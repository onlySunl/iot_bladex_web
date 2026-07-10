<template>
  <div class="record-play-container">
    <el-row :gutter="16">
      <!-- 左侧播放器区域 -->
      <el-col :span="19">
        <div class="player-box" :style="{height: playerHeight + 'px'}">
          <EasyPlayer
              ref="recordPlayerRef"
              width="80"
              height="90"
              :isPercentage="true"
              :videoUrl="playUrl"
              :isLive="false"
              @play-progress="onPlayProgress"
          />
        </div>
        <!--播放控制按钮栏-->
        <div class="control-bar">
          <el-button :icon="VideoPauseIcon" @click="stopPlay" circle></el-button>
          <el-button :icon="ArrowLeft" @click="prevFrame" circle></el-button>
          <el-button :icon="VideoPlay" @click="togglePlay" v-if="!playing" circle></el-button>
          <el-button :icon="VideoPause" @click="togglePlay" v-else circle></el-button>
          <el-button :icon="ArrowRight" @click="nextFrame" circle></el-button>
          <el-select v-model="playSpeed" style="width:70px" @change="changeSpeed">
            <el-option label="0.5x" value="0.5"></el-option>
            <el-option label="1x" value="1"></el-option>
            <el-option label="2x" value="2"></el-option>
            <el-option label="4x" value="4"></el-option>
          </el-select>
          <div class="flex-grow"></div>
          <el-button :icon="Camera" @click="handleSnapshot" circle></el-button>
          <el-button :icon="Scissor" circle></el-button>
          <el-button :icon="Search" circle></el-button>
          <el-button :icon="Bell" circle></el-button>
          <el-button :icon="Download" @click="downloadRecord" circle></el-button>
        </div>
        <!--24小时可滑动时间轴区域-->
        <div class="timeline-container">
          <div class="time-text">{{ currentPlayTime || `${selectedDate} 00:00:00` }}</div>
          <!--可视容器-->
          <div class="timeline-view" ref="timelineViewRef"
               @mousedown="handleMouseDown"
               @mousemove="handleMouseMove"
               @mouseup="handleMouseUp"
               @mouseleave="handleMouseUp">
            <!--可滑动内层容器-->
            <div class="timeline-scroll" ref="timelineScrollRef" :style="{transform: `translateX(${scrollX}px)`}">
              <!--录像片段-->
              <div
                  v-for="(item,idx) in recordSegmentList"
                  :key="idx"
                  class="record-block"
                  :style="{
                  left: `${calcTimePercent(item.startTime) * 100}%`,
                  width: `${(calcTimePercent(item.endTime) - calcTimePercent(item.startTime)) * 100}%`
                }"
              ></div>
              <!-- 小时刻度文字 0‑23 -->
              <div class="hour-label" v-for="hour in 24" :key="hour" :style="{left: `${hour / 24 * 100}%`}">
                {{ `${hour}:00` }}
              </div>
              <!-- 每15分钟刻度线，一天一共24*4 =96个 -->
              <div class="minute-line" v-for="item in 96" :key="item" :style="{left:`${(item / 96) * 100}%`}"></div>
            </div>
            <!-- 重点：黄色标尺固定在可视容器中央，不随scrollX移动 -->
            <div class="play-cursor"></div>
          </div>
        </div>
      </el-col>

      <!--右侧日历与时间定位区域-->
      <el-col :span="5">
        <div class="right-panel">
          <avue-date v-model="selectedDate"
                     format="YYYY年MM月DD日"
                     value-format="YYYY-MM-DD"
                     placeholder="请选择日期"
                     @change="getRecordSegmentList"></avue-date>

          <div class="time-position-title">回放时间点定位</div>
          <div class="time-input-wrap">
            <el-input v-model="hour" style="width:60px"></el-input>
            <span>:</span>
            <el-input v-model="minute" style="width:60px"></el-input>
            <span>:</span>
            <el-input v-model="second" style="width:60px"></el-input>
            <el-button icon="ArrowRight" @click="jumpTime"></el-button>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import {ref, defineProps, nextTick, onMounted} from 'vue'
import {ElMessage} from 'element-plus'
import EasyPlayer from '@/components/EasyPlayer'
import {
  VideoPause as VideoPauseIcon,
  ArrowLeft,
  VideoPlay,
  VideoPause,
  ArrowRight,
  Camera,
  Scissor,
  Search,
  Bell,
  Download
} from '@element-plus/icons-vue'
import {loadRecord, closeStreams, rtpPlayback, stopRtpPlayback} from '@/api/nvr/zlm'
import { getPlayApi, hasPtz, isRecordPlay, getSpeedConfig,PLAY_TYPE_CONFIG  } from '@/utils/play‑type‑util'
const props = defineProps({
  deviceId: {type: String, required: true},
  deviceCode: {type: String, required: true},
  mediaServerId: {type: String, default: ''},
  type: {type: String, default: ''}
})

//基础变量
const recordPlayerRef = ref(null)
const timelineScrollRef = ref(null)
const timelineViewRef = ref(null)
const playerHeight = ref(400)
const playUrl = ref('')
const playing = ref(false)
const playSpeed = ref(1)
const selectedDate = ref('')
const currentPlayTime = ref('')
const recordSegmentList = ref([])
const currentSegmentIndex = ref(-1)

//时间定位输入
const hour = ref('00')
const minute = ref('00')
const second = ref('00')

//拖动相关变量
const scrollX = ref(0)
let isDrag = false
let startX = 0
const INNER_WIDTH = 2400 //内层容器固定宽度px，代表24小时

// 时间字符串 "HH:mm:ss" 转为0~1之间百分比，增加容错
const calcTimePercent = (timeStr) => {
  if (!timeStr || typeof timeStr !== 'string') return 0
  const arr = timeStr.split(':')
  if (arr.length !== 3) return 0
  const [h, m, s] = arr.map(Number)
  const totalSec = h * 3600 + m * 60 + s
  return totalSec / (24 * 3600)
}

// 获取动态计算滚动边界（修正边界逻辑）
const getScrollBound = () => {
  const viewWidth = timelineViewRef.value.offsetWidth
  // 标尺对准00:00时 scrollX = viewWidth / 2（最大值，可以向右偏移）
  const maxScroll = viewWidth / 2
  // 标尺对准24:00时 scrollX = viewWidth/2 - INNER_WIDTH（最小值）
  const minScroll = viewWidth / 2 - INNER_WIDTH
  return {viewWidth, minScroll, maxScroll}
}

// 根据scrollX反推标尺对应的时分秒（核心函数）
const updateTimeByScrollX = () => {
  const {viewWidth} = getScrollBound()
  //标尺在内层容器的x坐标
  const cursorInnerX = viewWidth / 2 - scrollX.value
  let percent = cursorInnerX / INNER_WIDTH
  //边界限制0~1
  percent = Math.max(0, Math.min(1, percent))
  const totalSec = Math.floor(percent * 86400)
  const h = String(Math.floor(totalSec / 3600)).padStart(2, '0')
  const m = String(Math.floor((totalSec % 3600) / 60)).padStart(2, '0')
  const s = String(totalSec % 60).padStart(2, '0')
  //强制转为普通字符串，解决Proxy对象打印 [object Object]
  const dateStr = String(selectedDate.value ?? selectedDate)
  currentPlayTime.value = `${dateStr} ${h}:${m}:${s}`
}

//播放器播放进度回调：增加参数容错
const onPlayProgress = (res) => {
  let fullTimeStr = ''
  if (typeof res === 'object' && res !== null) {
    //如果你的EasyPlayer返回对象，修改这里对应的属性名称
    fullTimeStr = res.playTime
  } else {
    fullTimeStr = res
  }
  if (!fullTimeStr) return
  currentPlayTime.value = fullTimeStr
  const arr = fullTimeStr.split(' ')
  if (arr.length < 2) return
  const timeStr = arr[1]
  const percent = calcTimePercent(timeStr)
  const {viewWidth, minScroll, maxScroll} = getScrollBound()
  //根据播放时间计算scrollX，让时间轴向左滑动，标尺位置不变
  scrollX.value = viewWidth / 2 - percent * INNER_WIDTH
  scrollX.value = Math.max(minScroll, Math.min(maxScroll, scrollX.value))
}

//鼠标按下
const handleMouseDown = (e) => {
  isDrag = true
  startX = e.clientX
}
//鼠标移动，拖动过程实时更新时间
const handleMouseMove = (e) => {
  if (!isDrag) return
  const move = e.clientX - startX
  startX = e.clientX
  const {minScroll, maxScroll} = getScrollBound()
  scrollX.value += move
  scrollX.value = Math.max(minScroll, Math.min(maxScroll, scrollX.value))
  updateTimeByScrollX()
}
//鼠标松开
const handleMouseUp = () => {
  isDrag = false
}

onMounted(() => {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  selectedDate.value = `${year}-${month}-${day}`
  getRecordSegmentList()
  nextTick(() => {
    updateTimeByScrollX()
  })
})

//获取录像片段
const getRecordSegmentList = async () => {
  console.log('获取录像片段', props.deviceId, selectedDate.value)
  recordSegmentList.value = [
    {startTime: '08:00:00', endTime: '23:00:00', recordId: 1}
  ]
  scrollX.value = 0
  nextTick(() => {
    updateTimeByScrollX()
  })
}

//选中时间段回放
const playSegment = async (startTime, endTime) => {
  const baseParams = {
    deviceId: props.deviceId,
    deviceCode: props.deviceCode,
    streamId: props.mediaServerId,
    type: props.type,
    startTime:startTime,
    endTime:endTime
  }
  const typeCfg = PLAY_TYPE_CONFIG [props.type]
  let requestParams = {...baseParams}
  if (typeCfg.app) baseParams.app = typeCfg.app
  typeCfg.needConvertWsUrl && row.flvType === 'ws' && (baseParams.url = convertWsToHttp(row.liveAddress))
  if (typeCfg.singleId) requestParams = row.id
  if (typeCfg.needTcpMode) requestParams = {...baseParams, tcpMode: '0'}
  await stopPlay(requestParams)
  try {
    const res = await rtpPlayback(requestParams)
    console.log(res);
    console.log(res.data.data.flv);
    if (res?.data?.data?.flv) {
      playUrl.value = res.data.data.flv
      await nextTick()
      recordPlayerRef.value.play(playUrl.value)
      playing.value = true
    }
  } catch (err) {
    ElMessage.error('回放打开失败')
    console.error(err)
  }
}

//播放暂停
const togglePlay = async () => {
  if (!recordPlayerRef.value) return
  if (playing.value) {
    recordPlayerRef.value.pause()
    playing.value = false
  } else {
    if (playUrl.value) {
      recordPlayerRef.value.play(playUrl.value)
      playing.value = true
    } else {
      await playSegment(currentPlayTime.value, selectedDate.value + " " + "23:59:59");
    }
  }
}

//停止播放
const stopPlay = async (requestParams) => {
  await stopRtpPlayback(requestParams)
  if (recordPlayerRef.value?.stop) recordPlayerRef.value.stop()
  playUrl.value = ''
  playing.value = false
}

//上一帧、下一帧
const prevFrame = () => {
}
const nextFrame = () => {
}

//倍速切换
const changeSpeed = async () => {
  if (currentSegmentIndex < 0) return
  const seg = recordSegmentList.value[currentSegmentIndex.value]
  await playSegment(seg.startTime, seg.endTime)
}

//抓图
const handleSnapshot = () => {
  ElMessage.success('抓图成功')
}

//下载录像
const downloadRecord = () => {
}

//跳转到指定时分秒
const jumpTime = () => {
  const timeStr = `${hour.value}:${minute.value}:${second.value}`
  playSegment(timeStr, '24:00:00')
}

defineExpose({stopPlay})
</script>

<style scoped lang="scss">
.record-play-container {
  padding: 0;

  .player-box {
    border: 2px solid #d4af37;
    background: #000;

    .easy-player-box {
      width: 100%;
      height: 100%;
    }
  }

  .control-bar {
    display: flex;
    align-items: center;
    padding: 10px 0;
    gap: 8px;
    background: #fff;
  }

  .flex-grow {
    flex: 1;
  }

  .timeline-container {
    background: #000;
    color: #fff;
    padding: 10px 0;

    .time-text {
      text-align: center;
      font-size: 16px;
      margin-bottom: 8px;
    }

    /*可视区域，溢出隐藏*/
    .timeline-view {
      height: 60px;
      overflow: hidden;
      position: relative;
      user-select: none;
      cursor: grab;

      &:active {
        cursor: grabbing;
      }
    }

    /*内层滚动容器固定宽度2400px*/
    .timeline-scroll {
      width: 2400px;
      height: 60px;
      position: relative;
      transition: none;
      /*录像色块*/
      .record-block {
        position: absolute;
        height: 18px;
        background: #409eff;
        top: 22px;
      }

      /*小时文本标签*/
      .hour-label {
        position: absolute;
        bottom: 0;
        font-size: 14px;
        transform: translateX(-50%);
        color: #cccccc;
      }

      /*15分钟刻度线，96个*/
      .minute-line {
        position: absolute;
        bottom: 20px;
        width: 1px;
        height: 8px;
        background: #666666;
        transform: translateX(-50%);
      }
    }

    /*黄色标尺固定居中，不随内层容器滑动，重点！！*/
    .play-cursor {
      position: absolute;
      left: 50%;
      top: 8px;
      width: 2px;
      height: 45px;
      background: #ffcc00;
      transform: translateX(-50%);
      z-index: 9;
    }
  }

  .right-panel {
    .time-position-title {
      background: #e9ecef;
      padding: 8px;
      margin-top: 12px;
    }

    .time-input-wrap {
      display: flex;
      align-items: center;
      gap: 4px;
      margin-top: 8px;
    }
  }
}
</style>