<template>
  <div class="record-play-container">
    <el-row :gutter="16">
      <!-- 左侧播放器区域 -->
      <el-col :span="19">
        <div class="player-box" :style="{height: playerHeight + 'px'}">
          <PlayerVideo
              ref="playerComponentRef"
              :device-row="props.deviceRow"
              :quality="quality"
              :default-quality="defaultQuality"
              :is-quality="isQuality"
              :is-live="isLive"
              @stream-ready="handleStreamReady"
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
          <!-- 使用响应式变量 defaultTimeText -->
          <div class="time-text">{{ currentPlayTime }}</div>
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
            <!-- 黄色标尺固定在可视容器中央，不随scrollX移动 -->
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
                     @change="(val) => handleDateChange(val)"></avue-date>
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
import {ref, defineProps, nextTick, watch, onBeforeUnmount} from 'vue'
import {ElMessage} from 'element-plus'
import PlayerVideo from '@/views/nvr/components/nvr/PlayerVideo.vue'
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
import { getSpeedConfig, PLAY_TYPE_CONFIG } from '@/utils/play‑type‑util'

const props = defineProps({
  deviceRow: {type: Object, required: true},
  deviceId: {type: String, required: true},
  deviceCode: {type: String, required: true},
  mediaServerId: {type: String, default: ''},
  type: {
    type: [Number, String],
    default: 0
  }
})
// 强制转为数字类型，消除控制台警告
const rawType = Number(props.type)
const {deviceId, deviceCode, mediaServerId} = props

// ==================== DOM Refs ====================
const playerComponentRef = ref(null)
const timelineScrollRef = ref(null)
const timelineViewRef = ref(null)

// ==================== 页面状态变量 ====================
const sharedIframe = ref('')
const streamInfo = ref(null)
const quality = ref([])
const defaultQuality = ref('高清')
const isQuality = ref(true)
const isLive = ref(true)
const playerHeight = ref(400)
const playUrl = ref('')
const playing = ref(false)
const playSpeed = ref(1)
const selectedDate = ref('')
let rawDate = ''
// 新增：响应式默认时间文本，修改后模板自动更新
const currentPlayTime = ref('')
const h = ref();
const m = ref();
const s = ref();
const recordSegmentList = ref([])
const hour = ref('00')
const minute = ref('00')
const second = ref('00')
let lastDeviceId = null

// ==================== 时间轴拖动变量 ====================
const scrollX = ref(0)
let isDrag = false
let startX = 0
const INNER_WIDTH = 2400

// ==================== 公共工具方法 ====================
/**
 * HH:mm:ss 转0‑1百分比
 * @param {string} timeStr
 * @returns {number}
 */
const calcTimePercent = (timeStr) => {
  if (!timeStr || typeof timeStr !== 'string') return 0
  const arr = timeStr.split(':')
  if (arr.length !== 3) return 0
  const [h, m, s] = arr.map(Number)
  const totalSec = h * 3600 + m * 60 + s
  return totalSec / (24 * 3600)
}

/**
 * 获取滚动边界
 */
const getScrollBound = () => {
  const viewWidth = timelineViewRef.value?.offsetWidth ?? 0
  const maxScroll = viewWidth / 2
  const minScroll = viewWidth / 2 - INNER_WIDTH
  return {viewWidth, minScroll, maxScroll}
}

/**
 * 根据scrollX反推当前时间
 */
const updateTimeByScrollX = () => {
  const {viewWidth} = getScrollBound()
  const cursorInnerX = viewWidth / 2 - scrollX.value
  let percent = cursorInnerX / INNER_WIDTH
  percent = Math.max(0, Math.min(1, percent))
  const totalSec = Math.floor(percent * 86400)
   h.value = String(Math.floor(totalSec / 3600)).padStart(2, '0')
   m.value = String(Math.floor((totalSec % 3600) / 60)).padStart(2, '0')
   s.value = String(totalSec % 60).padStart(2, '0')
  currentPlayTime.value = `${rawDate} ${h.value}:${m.value}:${s.value}`
  console.log(currentPlayTime.value)
}

/**
 * 日期选择变更同步普通变量和响应式变量
 */
const handleDateChange = (newDateVal) => {
  console.log("选择日期",newDateVal.value)
  rawDate = newDateVal.value
  console.log(rawDate)
  updateTimeByScrollX()
  getRecordSegmentList()
}

// ==================== 播放器回调 ====================
const handleStreamReady = (payload) => {
  playUrl.value = payload.flvUrl
  sharedIframe.value = payload.sharedIframe
  streamInfo.value = payload.streamInfo
}

/**
 * 播放器进度回调
 */
const onPlayProgress = (res) => {
  let fullTimeStr = ''
  if (typeof res === 'object' && res !== null) {
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
  scrollX.value = viewWidth / 2 - percent * INNER_WIDTH
  scrollX.value = Math.max(minScroll, Math.min(maxScroll, scrollX.value))
}

// ==================== 拖动相关 ====================
const handleMouseDown = (e) => {
  isDrag = true
  startX = e.clientX
}
const handleMouseMove = (e) => {
  if (!isDrag) return
  const move = e.clientX - startX
  startX = e.clientX
  const {minScroll, maxScroll} = getScrollBound()
  scrollX.value += move
  scrollX.value = Math.max(minScroll, Math.min(maxScroll, scrollX.value))
  updateTimeByScrollX()
}
/**
 * 鼠标松开后自动开始回放
 */
const handleMouseUp = async () => {
  if (!isDrag) return
  isDrag = false
  if (!currentPlayTime.value) return
  const timePart = currentPlayTime.value.split(' ')[1]
  await playSegment(`${rawDate}`+ " " +timePart, `${rawDate} 23:59:59`)
}

// ==================== 业务方法 ====================
/**
 * 获取录像片段
 */
const getRecordSegmentList = async () => {
  console.log('获取录像片段', deviceId, rawDate)
  // 这里替换为后端接口
  recordSegmentList.value = [
    {startTime: '08:00:00', endTime: '23:00:00', recordId: 1}
  ]
  scrollX.value = 0
  nextTick(() => {
    updateTimeByScrollX()
  })
}

/**
 * 开始回放
 * @param {string} startTime HH:mm:ss
 * @param {string} endTime HH:mm:ss
 */
const playSegment = async (startTime, endTime) => {
  try {
    playerComponentRef.value.startPlayBack(startTime,endTime)
  } catch (err) {
    ElMessage.error('回放打开失败')
    console.error(err)
  }
}

/**
 * 播放暂停切换
 */
const togglePlay = async () => {
  if (!playerComponentRef.value) return
  if (playing.value) {
    playerComponentRef.value.pause()
    playing.value = false
  } else {
    if (playUrl.value) {
      await playerComponentRef.value.play(playUrl.value)
      playing.value = true
    } else {
      const timeStr = currentPlayTime.value.split(' ')[1]
      await playSegment(`${rawDate}`+ " " +timeStr, `${rawDate} 23:59:59`)
    }
  }
}

/**
 * 停止播放，销毁播放器并且关闭后端流
 */
const stopPlay = async () => {
  if (playerComponentRef.value) {
    console.log(playerComponentRef.value)
    try {
      await playerComponentRef.value.stopPlaybackPlay()
      await playerComponentRef.value.destroyPlayer()
    } catch (err) {
      console.warn('播放器关闭异常', err)
    }
  }
  playing.value = false
}

/**
 * 倍速切换，做取值范围校验
 */
const changeSpeed = async () => {
  const speedConfig = getSpeedConfig(rawType)
  if (speedConfig) {
    const {min, max} = speedConfig
    playSpeed.value = Math.max(min, Math.min(max, Number(playSpeed.value)))
  }
  if (!currentPlayTime.value) return
  const timeStr = currentPlayTime.value.split(' ')[1]
  await playSegment(`${rawDate}`+ " " +timeStr, `${rawDate} 23:59:59`)
}

/**
 * 跳转到指定时分秒
 */
const jumpTime = () => {
  const timeStr = `${hour.value}:${minute.value}:${second.value}`
  playSegment(timeStr, '23:59:59')
}

// 空方法，后续对接后端帧进退接口
const prevFrame = () => {}
const nextFrame = () => {}
const handleSnapshot = () => ElMessage.success('抓图成功')
const downloadRecord = () => {}

// ==================== 生命周期 ====================
onMounted(() => {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  selectedDate.value = `${year}-${month}-${day}`
  rawDate = selectedDate.value
  h.value="00";
  m.value="00";
  s.value="00";
  currentPlayTime.value = `${rawDate} ${h.value}:${m.value}:${s.value}`
  getRecordSegmentList()
  nextTick(() => {
    updateTimeByScrollX()
  })
})

//组件销毁，释放前后端资源
onBeforeUnmount(async () => {
  await stopPlay()
})

//监听设备切换
watch(() => props.deviceId, async (newVal, oldVal) => {
  if (!newVal || newVal === lastDeviceId) return
  lastDeviceId = newVal
  await nextTick()
  if (!playerComponentRef.value) {
    console.warn('播放器实例获取失败')
    return
  }
  try {
    await playerComponentRef.value.startPlay()
  } catch (err) {
    console.error('startPlay异常', err)
  }
})

defineExpose({stopPlay})
</script>

<style scoped lang="scss">
.record-play-container {
  padding: 0;
  .player-box {
    border: 2px solid #d4af37;
    background: #000;
    :deep(.easy-player-box) {
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
    .timeline-scroll {
      width: 2400px;
      height: 60px;
      position: relative;
      transition: none;
      .record-block {
        position: absolute;
        height: 18px;
        background: #409eff;
        top: 22px;
      }
      .hour-label {
        position: absolute;
        bottom: 0;
        font-size: 14px;
        transform: translateX(-50%);
        color: #cccccc;
      }
      .minute-line {
        position: absolute;
        bottom: 20px;
        width: 1px;
        height: 8px;
        background: #666666;
        transform: translateX(-50%);
      }
    }
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