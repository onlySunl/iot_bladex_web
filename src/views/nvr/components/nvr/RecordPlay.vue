<template>
  <div class="record-play-container">
    <el-row :gutter="16">
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
        <div class="timeline-container">
          <div class="time-text">{{ currentPlayTime }}</div>
          <div class="timeline-view" ref="timelineViewRef" @mousedown="handleMouseDown">
            <div class="timeline-scroll" ref="timelineScrollRef" :style="{transform: `translateX(${scrollX}px)`}">
              <div
                  v-for="item in renderList"
                  :key="item.id"
                  class="record-block"
                  :class="{event: item.isEvent}"
                  :style="{left: `${item.left}px`, width: `${item.width}px`}"
              ></div>
              <div
                  v-for="item in hourList"
                  :key="item.id"
                  class="hour-label"
                  :style="{left: `${item.left}px`}"
              >
                {{ item.label }}
              </div>
              <div
                  v-for="item in halfList"
                  :key="item.id"
                  class="half-line"
                  :style="{left: `${item.left}px`}"
              ></div>
              <div
                  v-for="item in quarterList"
                  :key="item.id"
                  class="quarter-line"
                  :style="{left: `${item.left}px`}"
              ></div>
            </div>
            <div class="play-cursor"></div>
          </div>
        </div>
      </el-col>
      <el-col :span="5">
        <div class="right-panel">
          <el-date-picker
              v-model="selectedDate"
              type="date"
              format="YYYY年MM月DD日"
              value-format="YYYY-MM-DD"
              placeholder="请选择日期"
              @change="handleDateChange"
              style="width: 100%"
          ></el-date-picker>
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
import {ref, defineProps, nextTick, watch, onBeforeUnmount, onMounted} from 'vue'
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
import { getSpeedConfig } from '@/utils/play‑type‑util'
import dayjs from 'dayjs'

const props = defineProps({
  deviceRow: {type: Object, required: true},
  deviceId: {type: String, required: true},
  deviceCode: {type: String, required: true},
  mediaServerId: {type: String, default: ''},
  type: {type: [Number, String], default: 0}
})
const rawType = Number(props.type)
const {deviceId} = props

const playerComponentRef = ref(null)
const timelineViewRef = ref(null)

const DAY_WIDTH = 2400
const ONE_DAY_SEC = 86400

// 修复1：初始化强制赋值今日日期，保证初始值不为空字符串
const todayStr = dayjs().format('YYYY-MM-DD')
const nowTime = dayjs()
let baseTime = ref(nowTime.startOf('day').valueOf())

const streamInfo = ref(null)
const quality = ref([])
const defaultQuality = ref('高清')
const isQuality = ref(true)
const isLive = ref(false)
const playerHeight = ref(400)
const playUrl = ref('')
const playing = ref(false)
const playSpeed = ref(1)
const selectedDate = ref(todayStr) // 初始化直接赋值今日日期，解决日期选择器空白
const currentPlayTime = ref(nowTime.format('YYYY-MM-DD HH:mm:ss')) // 默认当前时间
const hour = ref(nowTime.format('HH'))
const minute = ref(nowTime.format('mm'))
const second = ref(nowTime.format('ss'))
const recordSegmentList = ref([])
let lastDeviceId = null

const scrollX = ref(0)
let isDrag = false
let startClientX = 0

const hourList = ref([])
const halfList = ref([])
const quarterList = ref([])
const renderList = ref([])

/**
 * 格式化时间，增加有效性校验，彻底解决Invalid Date
 */
const formatTimeByTs = (ts) => {
  const time = dayjs(ts)
  if (!time.isValid()) {
    return {
      h: '00',
      m: '00',
      s: '00',
      full: `${selectedDate.value} 00:00:00`,
      hhmmss: '00:00:00'
    }
  }
  return {
    h: String(time.hour()).padStart(2, '0'),
    m: String(time.minute()).padStart(2, '0'),
    s: String(time.second()).padStart(2, '0'),
    full: time.format('YYYY-MM-DD HH:mm:ss'),
    hhmmss: time.format('HH:mm:ss')
  }
}

const calcCursorTime = () => {
  const viewWidth = timelineViewRef.value?.offsetWidth ?? 0
  if (viewWidth === 0) {
    return dayjs(selectedDate.value).startOf('day').valueOf()
  }
  const cursorInnerX = viewWidth / 2 - scrollX.value
  const percent = cursorInnerX / DAY_WIDTH
  const offsetSec = percent * ONE_DAY_SEC
  const currentTs = baseTime.value + offsetSec * 1000
  return currentTs
}

const updateTimeAndRender = () => {
  const viewWidth = timelineViewRef.value?.offsetWidth ?? 0
  if (viewWidth === 0) return

  const currentTs = calcCursorTime()
  const dayDiff = Math.floor((currentTs - baseTime.value) / (1000 * ONE_DAY_SEC))
  if (dayDiff !== 0) {
    baseTime.value = dayjs(baseTime.value).add(dayDiff, 'day').startOf('day').valueOf()
    selectedDate.value = dayjs(baseTime.value).format('YYYY-MM-DD')
    getRecordSegmentList()
  }
  const timeObj = formatTimeByTs(calcCursorTime())
  hour.value = timeObj.h
  minute.value = timeObj.m
  second.value = timeObj.s
  currentPlayTime.value = timeObj.full
  generateTimeDom()
}

const generateTimeDom = () => {
  hourList.value = []
  halfList.value = []
  quarterList.value = []
  renderList.value = []

  for (let dayIdx = -1; dayIdx <= 1; dayIdx++) {
    const dayStartTs = baseTime.value + dayIdx * ONE_DAY_SEC * 1000
    for (let h = 0; h < 24; h++) {
      const px = dayIdx * DAY_WIDTH + (h / 24) * DAY_WIDTH
      hourList.value.push({
        id: `${dayIdx}-${h}`,
        left: px,
        label: `${h}:00`
      })
    }
    for (let n = 0; n < 48; n++) {
      const px = dayIdx * DAY_WIDTH + (n / 48) * DAY_WIDTH
      halfList.value.push({id: `h-${dayIdx}-${n}`, left: px})
    }
    for (let n = 0; n < 96; n++) {
      const px = dayIdx * DAY_WIDTH + (n / 96) * DAY_WIDTH
      quarterList.value.push({id: `q-${dayIdx}-${n}`, left: px})
    }
  }

  //修复2：录像片段解析前判空，selectedDate为空默认取baseTime对应的日期
  const currentDay = selectedDate.value || dayjs(baseTime.value).format('YYYY-MM-DD')
  recordSegmentList.value.forEach((item, idx) => {
    const start = dayjs(`${currentDay} ${item.startTime}`)
    const end = dayjs(`${currentDay} ${item.endTime}`)
    if (!start.isValid() || !end.isValid()) return
    const startSec = start.diff(dayjs(baseTime.value), 'second')
    const endSec = end.diff(dayjs(baseTime.value), 'second')
    const left = (startSec / ONE_DAY_SEC) * DAY_WIDTH
    const width = ((endSec - startSec) / ONE_DAY_SEC) * DAY_WIDTH
    renderList.value.push({id: idx, left, width, isEvent: item.isEvent})
  })
}

const handleMouseDown = (e) => {
  isDrag = true
  startClientX = e.clientX
  document.addEventListener('mousemove', handleMouseMove)
  document.addEventListener('mouseup', handleMouseUp)
}

const handleMouseMove = (e) => {
  if (!isDrag) return
  const delta = e.clientX - startClientX
  startClientX = e.clientX
  scrollX.value += delta
  updateTimeAndRender()
}

const handleMouseUp = async () => {
  if (!isDrag) return
  isDrag = false
  document.removeEventListener('mousemove', handleMouseMove)
  document.removeEventListener('mouseup', handleMouseUp)
  const timeObj = formatTimeByTs(calcCursorTime())
  await playSegment(timeObj.full, `${selectedDate.value} 23:59:59`)
}

/**
 * 手动选择日期
 */
const handleDateChange = (newDateVal) => {
  if (!newDateVal) return
  selectedDate.value = newDateVal
  baseTime.value = dayjs(newDateVal).startOf('day').valueOf()
  scrollX.value = 0
  nextTick(() => {
    updateTimeAndRender()
    getRecordSegmentList()
  })
}

const handleStreamReady = (payload) => {
  // EasyPlayerPro 仅支持 HLS (m3u8) 和 FMP4 (mp4) 格式，优先使用 HLS
  playUrl.value = payload.hlsUrl || payload.flvUrl
  streamInfo.value = payload.streamInfo
}

const onPlayProgress = (res) => {
  console.log('播放器返回值：', res)
  let fullTimeStr = ''
  if (res !== null && typeof res === 'object') {
    if (res.playTime && typeof res.playTime === 'string') {
      fullTimeStr = res.playTime.trim()
    } else if (res.data && res.data.playTime && typeof res.data.playTime === 'string') {
      fullTimeStr = res.data.playTime.trim()
    } else return
  } else if (typeof res === 'string') {
    fullTimeStr = res.trim()
  }
  if (!fullTimeStr) return
  const testDay = dayjs(fullTimeStr)
  if (!testDay.isValid()) return

  currentPlayTime.value = fullTimeStr
  const ts = testDay.valueOf()
  const offsetSec = (ts - baseTime.value) / 1000
  const percent = offsetSec / ONE_DAY_SEC
  const viewWidth = timelineViewRef.value?.offsetWidth ?? 0
  scrollX.value = viewWidth / 2 - percent * DAY_WIDTH
  updateTimeAndRender()
}

const getRecordSegmentList = async () => {
  console.log('请求录像片段', deviceId, selectedDate.value)
  recordSegmentList.value = [{startTime: '08:00:00', endTime: '23:00:00', isEvent: false}]
  generateTimeDom()
}

const playSegment = async (startTime, endTime) => {
  if (!playerComponentRef.value) return
  try {
    await playerComponentRef.value.startPlayBack(startTime, endTime)
    playing.value = true
  } catch (err) {
    ElMessage.error('回放打开失败')
    console.error(err)
  }
}

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
      const timeStr = `${hour.value}:${minute.value}:${second.value}`
      await playSegment(`${selectedDate.value} ${timeStr}`, `${selectedDate.value} 23:59:59`)
    }
  }
}

const stopPlay = async () => {
  if (playerComponentRef.value) {
    try {
      await playerComponentRef.value.stopPlaybackPlay()
      await playerComponentRef.value.destroyPlayer()
    } catch (err) {
      console.warn('关闭播放器异常', err)
    }
  }
  playing.value = false
}

const changeSpeed = async () => {
  const speedConfig = getSpeedConfig(rawType)
  if (speedConfig) {
    const {min, max} = speedConfig
    playSpeed.value = Math.max(min, Math.min(max, Number(playSpeed.value)))
  }
  const timeStr = `${hour.value}:${minute.value}:${second.value}`
  await playSegment(`${selectedDate.value} ${timeStr}`, `${selectedDate.value} 23:59:59`)
}

const jumpTime = async () => {
  await playSegment(`${selectedDate.value} ${hour.value}:${minute.value}:${second.value}`, `${selectedDate.value} 23:59:59`)
}

const prevFrame = () => {}
const nextFrame = () => {}
const handleSnapshot = () => ElMessage.success('抓图成功')
const downloadRecord = () => {}

// DOM加载完成初始化
onMounted(async () => {
  await nextTick()
  updateTimeAndRender()
})

watch(() => props.deviceId, async (newVal) => {
  if (!newVal || newVal === lastDeviceId) return
  lastDeviceId = newVal
  scrollX.value = 0
  baseTime.value = dayjs(selectedDate.value).startOf('day').valueOf()
  await nextTick()
  updateTimeAndRender()
  getRecordSegmentList()
})

onBeforeUnmount(async () => {
  await stopPlay()
  document.removeEventListener('mousemove', handleMouseMove)
  document.removeEventListener('mouseup', handleMouseUp)
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
  .flex-grow {flex:1;}

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
      &:active {cursor: grabbing;}
    }
    .timeline-scroll {
      height: 60px;
      position: relative;
      transition: none;
      .record-block {
        position: absolute;
        height: 16px;
        top: 26px;
        background-color: #409eff;
      }
      .record-block.event {
        background-color: #f56c6c;
      }
      .hour-label {
        position: absolute;
        bottom: 0;
        font-size: 13px;
        transform: translateX(-50%);
        color: #bbbbbb;
      }
      .half-line {
        position: absolute;
        bottom: 20px;
        width:1px;
        height:10px;
        background:#777777;
        transform: translateX(-50%);
      }
      .quarter-line {
        position: absolute;
        bottom: 24px;
        width:1px;
        height:5px;
        background:#555555;
        transform: translateX(-50%);
      }
    }
    .play-cursor {
      position: absolute;
      left:50%;
      top:5px;
      width:3px;
      height:50px;
      background: #ffcc00;
      transform: translateX(-50%);
      z-index:9;
    }
  }
  .right-panel {
    .time-position-title {
      background: #e9ecef;
      padding:8px;
      margin-top:12px;
    }
    .time-input-wrap {
      display:flex;
      align-items:center;
      gap:4px;
      margin-top:8px;
    }
  }
}
</style>