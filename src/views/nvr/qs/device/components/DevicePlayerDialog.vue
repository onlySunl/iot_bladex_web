<template>
  <el-drawer
      v-model="dialogVisible"
      :title="deviceName"
      direction="rtl"
      size="70%"
      :before-close="handleClose"
      :destroy-on-close="true"
  >
    <div class="player-container">
      <!-- 播放器区域 -->
      <PlayerView
          ref="playerViewRef"
          :flv-url="flvUrl"
          :ws-url="wsUrl"
          :rtc-url="rtcUrl"
          :device-type="deviceType"
          :player-type="playerType"
          :is-ptz="isPtz"
          :is-gb28181-device="isGb28181Device"
          :is-jt1078-device="isJt1078Device"
          @auto-play="autoPlay"
          @stop-play="stopPlay"
      />

      <!-- 功能面板 -->
      <div class="player-panel">
        <el-tabs v-model="activeTab" type="card" class="player-tabs">
          <!-- 播放地址 -->
          <el-tab-pane label="播放地址" name="address">
            <StreamAddress
                :flv-url="flvUrl"
                :ws-url="wsUrl"
                :rtc-url="rtcUrl"
                :shared-iframe="sharedIframe"
                :stream-info="streamInfo"
            />
          </el-tab-pane>

          <!-- 编码信息 -->
          <el-tab-pane label="编码信息" name="codec">
            <MediaInfo
                v-if="streamInfo"
                :app="streamInfo.app"
                :stream="streamInfo.stream"
                :media-server-id="streamInfo.mediaServerId"
            />
          </el-tab-pane>

          <!-- 云台控制 -->
          <el-tab-pane label="云台控制" name="ptz">
            <PtzPanel
                ref="ptzPanelRef"
                :is-ptz="isPtz"
                :is-preset-supported="isPresetSupported"
                :is-gb28181-device="isGb28181Device"
                :control-speed="controlSpeed"
                :control-speed-min="controlSpeedMin"
                :control-speed-max="controlSpeedMax"
                @ptz="handlePtz"
                @stop-ptz="handleStopPtz"
                @load-preset-list="loadPresetList"
                @preset-select="handlePresetSelect"
                @goto-preset="handleGotoPreset"
                @set-preset="handleSetPreset"
                @delete-preset="handleDeletePreset"
                @light-control="handleLightControl"
                @wiper-control="handleWiperControl"
                @query-home-position="handleQueryHomePosition"
                @set-home-position="handleSetHomePosition"
                @home-position-control="handleHomePositionControl"
                @query-cruise-track-list="handleQueryCruiseTrackList"
                @query-cruise-track="handleQueryCruiseTrack"
                @start-cruise="handleStartCruise"
                @stop-cruise="handleStopCruise"
                @query-ptz-position="handleQueryPTZPosition"
                @ptz-precise-control="handlePtzPreciseControl"
            />
          </el-tab-pane>

          <!-- 抓图 -->
          <el-tab-pane label="抓图" name="snapshot">
            <SnapshotPanel
                ref="snapshotPanelRef"
                :stream-info="streamInfo"
                @snapshot="handleSnapshot"
                @download="handleDownloadSnapshot"
            />
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>

    <!-- 预置点设置弹窗 -->
    <DevicePresetDialog
        v-model="presetDialogVisible"
        :device-id="deviceId"
        :channel-id="channelId"
        :device-type="deviceType"
        :preset-index="currentPresetIndex"
        @success="loadPresetList"
    />
  </el-drawer>
</template>

<script setup>
/**
 * DevicePlayerDialog - 设备播放弹窗（主页面）
 * 负责协调各子组件，处理播放逻辑
 */
import { ref, computed, onBeforeUnmount } from 'vue'
import { ElMessage } from 'element-plus'
import PlayerView from './PlayerView.vue'
import StreamAddress from './StreamAddress.vue'
import PtzPanel from './PtzPanel.vue'
import SnapshotPanel from './SnapshotPanel.vue'
import DevicePresetDialog from './DevicePresetDialog.vue'
import MediaInfo from '@/components/nvr/Channel/mediaInfo.vue'
import {
  streamPullPlay, stopStreamPullPlay, loadRecord, closeStreams,
  rtpPlay, stopRtpPlay, streamPullPush,
  startGb28181Play, stopGb28181Play,
  startJt1078Play, stopJt1078Play
} from '@/api/nvr/zlm'
import {
  startPtz, endPtz, getPresetList, setPreset, gotoPreset, deletePreset,
  controlLight, controlWiper
} from '@/api/nvr/device'
import {
  queryHomePosition, updateHomePosition, homePositionControl,
  queryCruiseTrackList, queryCruiseTrack, startCruise, stopCruise,
  ptzPreciseControl, queryPTZPosition
} from '@/api/nvr/gb28181'

// 播放类型配置
const PLAY_TYPE_CONFIG = {
  1: { api: streamPullPlay, stopApi: stopStreamPullPlay, type: 'rtsp' },
  2: { api: streamPullPlay, stopApi: stopStreamPullPlay, type: 'rtmp' },
  3: { api: streamPullPlay, stopApi: stopStreamPullPlay, type: 'flv' },
  4: { api: streamPullPlay, stopApi: stopStreamPullPlay, type: 'hls' },
  5: { api: streamPullPlay, stopApi: stopStreamPullPlay, type: 'onvif' },
  6: { api: loadRecord, stopApi: stopStreamPullPlay, type: 'record' },
  7: { api: rtpPlay, stopApi: stopRtpPlay, type: 'hik_rtp' },
  8: { api: streamPullPush, stopApi: stopStreamPullPlay, type: 'hik_isup' },
  9: { api: rtpPlay, stopApi: stopRtpPlay, type: 'dahua_rtp' },
  13: { api: streamPullPush, stopApi: stopStreamPullPlay, type: 'pull_push' },
  12: { api: startGb28181Play, stopApi: stopGb28181Play, type: 'gb28181' },
  14: { api: startJt1078Play, stopApi: stopJt1078Play, type: 'jt1078' }
}

// Props
const props = defineProps({
  deviceRow: { type: Object, default: () => ({}) },
  channels: { type: Array, default: () => [] }
})

// Emits
const emit = defineEmits(['update:easy-player-open'])

// 状态
const dialogVisible = computed({
  get: () => props.deviceRow?.playerVisible || false,
  set: (val) => emit('update:easy-player-open', val)
})
const activeTab = ref('address')
const playerViewRef = ref(null)
const ptzPanelRef = ref(null)
const snapshotPanelRef = ref(null)

// 播放相关
const flvUrl = ref('')
const wsUrl = ref('')
const rtcUrl = ref('')
const sharedIframe = ref('')
const streamInfo = ref(null)
const playerType = ref('flv')

// 设备信息
const deviceId = computed(() => props.deviceRow?.id)
const deviceName = computed(() => props.deviceRow?.deviceName || '设备播放')
const deviceType = computed(() => props.deviceRow?.type || 1)
const channelId = computed(() => props.deviceRow?.channelId || props.deviceRow?.gbChannelId || '')
const channelName = computed(() => props.deviceRow?.channelName || '')

// 云台相关
const isPtz = computed(() => !!props.deviceRow?.ptz)
const isGb28181Device = computed(() => deviceType.value === 12)
const isJt1078Device = computed(() => deviceType.value === 14)
const isPresetSupported = computed(() => isGb28181Device.value || isJt1078Device.value)
const controlSpeed = ref(50)
const controlSpeedMin = 1
const controlSpeedMax = 100

// 预置点相关
const presetDialogVisible = ref(false)
const currentPresetIndex = ref(null)

// 打开弹窗
const open = () => {
  dialogVisible.value = true
  activeTab.value = 'address'
  handlePlay()
}

// 关闭弹窗
const handleClose = () => {
  stopPlay()
  dialogVisible.value = false
}

// 设置流数据
const setStreamBaseData = (res) => {
  const data = res || {}
  const isHttps = location.protocol === 'https:'

  // 直接使用 API 返回的播放地址
  flvUrl.value = isHttps ? data.https_flv : data.flv
  wsUrl.value = isHttps ? data.wss_flv : data.ws_flv
  rtcUrl.value = isHttps ? data.rtcs : data.rtc

  // 生成 iframe 分享代码
  const playerUrl = flvUrl.value
  if (playerUrl) {
    sharedIframe.value = `<iframe src="${playerUrl}" width="100%" height="100%" frameborder="0" allowfullscreen></iframe>`
  }

  // 保存流信息
  streamInfo.value = {
    ...data,
    app: data.app || 'live',
    stream: data.stream || '',
    mediaServerId: data.mediaServerId || data.mediaInfo?.mediaServer?.id || ''
  }
}

// 自动播放
const autoPlay = () => {
  if (flvUrl.value && playerViewRef.value) {
    playerViewRef.value.play(flvUrl.value, 'flv')
  }
}

// 播放
const handlePlay = async () => {
  const config = PLAY_TYPE_CONFIG[deviceType.value]
  if (!config) {
    ElMessage.warning('不支持的设备类型')
    return
  }

  try {
    const params = {
      deviceId: deviceId.value,
      channelId: channelId.value,
      type: config.type
    }

    const res = await config.api(params)
    if (res?.data) {
      setStreamBaseData(res.data)
      autoPlay()
    }
  } catch (err) {
    console.error('播放失败:', err)
    ElMessage.error(err?.message || '播放失败')
  }
}

// 停止播放
const stopPlay = async () => {
  const config = PLAY_TYPE_CONFIG[deviceType.value]
  if (!config?.stopApi) return

  try {
    await config.stopApi({
      deviceId: deviceId.value,
      channelId: channelId.value
    })
  } catch (err) {
    console.error('停止播放失败:', err)
  }
}

// 云台控制
const handlePtz = async ({ cmd, speed }) => {
  try {
    await startPtz({
      deviceId: deviceId.value,
      channelId: channelId.value,
      command: cmd,
      speed
    })
  } catch (err) {
    ElMessage.error('云台控制失败')
  }
}

const handleStopPtz = async () => {
  try {
    await endPtz({
      deviceId: deviceId.value,
      channelId: channelId.value
    })
  } catch (err) {
    console.error('停止云台失败:', err)
  }
}

// 预置点操作
const loadPresetList = async () => {
  try {
    const res = await getPresetList({
      deviceId: deviceId.value,
      channelId: channelId.value
    })
    if (res?.data && ptzPanelRef.value) {
      ptzPanelRef.value.presetList = res.data
    }
  } catch (err) {
    console.error('加载预置点列表失败:', err)
  }
}

const handlePresetSelect = (index) => {
  // 预置点选择由 PtzPanel 内部管理
}

const handleGotoPreset = async (index) => {
  try {
    await gotoPreset({
      deviceId: deviceId.value,
      channelId: channelId.value,
      presetIndex: index
    })
    ElMessage.success('调用预置点成功')
  } catch (err) {
    ElMessage.error('调用预置点失败')
  }
}

const handleSetPreset = (index) => {
  currentPresetIndex.value = index
  presetDialogVisible.value = true
}

const handleDeletePreset = async (index) => {
  try {
    await deletePreset({
      deviceId: deviceId.value,
      channelId: channelId.value,
      presetIndex: index
    })
    ElMessage.success('删除预置点成功')
    loadPresetList()
  } catch (err) {
    ElMessage.error('删除预置点失败')
  }
}

// 灯光控制
const handleLightControl = async (on) => {
  try {
    await controlLight({
      deviceId: deviceId.value,
      channelId: channelId.value,
      command: on ? 'on' : 'off'
    })
    ElMessage.success(on ? '开灯成功' : '关灯成功')
  } catch (err) {
    ElMessage.error('灯光控制失败')
  }
}

// 雨刷控制
const handleWiperControl = async (on) => {
  try {
    await controlWiper({
      deviceId: deviceId.value,
      channelId: channelId.value,
      command: on ? 'on' : 'off'
    })
    ElMessage.success(on ? '开雨刷成功' : '关雨刷成功')
  } catch (err) {
    ElMessage.error('雨刷控制失败')
  }
}

// 看守位
const handleQueryHomePosition = async (form) => {
  try {
    const res = await queryHomePosition({
      deviceId: deviceId.value,
      channelId: channelId.value
    })
    if (res?.data && ptzPanelRef.value) {
      ptzPanelRef.value.homePositionForm = res.data
    }
  } catch (err) {
    ElMessage.error('查询看守位失败')
  }
}

const handleSetHomePosition = async (form) => {
  try {
    await updateHomePosition({
      deviceId: deviceId.value,
      channelId: channelId.value,
      ...form
    })
    ElMessage.success('设置看守位成功')
  } catch (err) {
    ElMessage.error('设置看守位失败')
  }
}

const handleHomePositionControl = async (form) => {
  try {
    await homePositionControl({
      deviceId: deviceId.value,
      channelId: channelId.value,
      ...form
    })
    ElMessage.success('调用看守位成功')
  } catch (err) {
    ElMessage.error('调用看守位失败')
  }
}

// 巡航轨迹
const handleQueryCruiseTrackList = async (form) => {
  try {
    const res = await queryCruiseTrackList({
      deviceId: deviceId.value,
      channelId: channelId.value
    })
    if (res?.data && ptzPanelRef.value) {
      ptzPanelRef.value.cruiseTrackList = res.data
    }
  } catch (err) {
    ElMessage.error('查询巡航轨迹列表失败')
  }
}

const handleQueryCruiseTrack = async (form) => {
  try {
    const res = await queryCruiseTrack({
      deviceId: deviceId.value,
      channelId: channelId.value,
      ...form
    })
    ElMessage.success('查询巡航轨迹成功')
  } catch (err) {
    ElMessage.error('查询巡航轨迹失败')
  }
}

const handleStartCruise = async (form) => {
  try {
    await startCruise({
      deviceId: deviceId.value,
      channelId: channelId.value,
      ...form
    })
    ElMessage.success('开始巡航成功')
  } catch (err) {
    ElMessage.error('开始巡航失败')
  }
}

const handleStopCruise = async (form) => {
  try {
    await stopCruise({
      deviceId: deviceId.value,
      channelId: channelId.value,
      ...form
    })
    ElMessage.success('停止巡航成功')
  } catch (err) {
    ElMessage.error('停止巡航失败')
  }
}

// 精准控制
const handleQueryPTZPosition = async () => {
  try {
    const res = await queryPTZPosition({
      deviceId: deviceId.value,
      channelId: channelId.value
    })
    if (res?.data && ptzPanelRef.value) {
      ptzPanelRef.value.ptzPosition = res.data
    }
  } catch (err) {
    ElMessage.error('查询PTZ位置失败')
  }
}

const handlePtzPreciseControl = async (form) => {
  try {
    await ptzPreciseControl({
      deviceId: deviceId.value,
      channelId: channelId.value,
      ...form
    })
    ElMessage.success('执行精准控制成功')
  } catch (err) {
    ElMessage.error('执行精准控制失败')
  }
}

// 抓图
const handleSnapshot = ({ onSuccess, onComplete }) => {
  if (!streamInfo.value) {
    ElMessage.warning('请先播放视频')
    onComplete?.()
    return
  }

  // 调用抓图 API
  loadRecord({
    deviceId: deviceId.value,
    channelId: channelId.value,
    command: 'snapshot'
  }).then(res => {
    if (res?.data?.url) {
      onSuccess?.(res.data.url)
    }
  }).catch(err => {
    ElMessage.error('抓图失败')
  }).finally(() => {
    onComplete?.()
  })
}

// 下载抓图
const handleDownloadSnapshot = (url) => {
  if (!url) return
  const link = document.createElement('a')
  link.href = url
  link.download = `snapshot_${Date.now()}.jpg`
  link.click()
}

// 组件卸载时停止播放
onBeforeUnmount(() => {
  stopPlay()
})

// 暴露方法给父组件
defineExpose({
  open,
  handleClose
})
</script>

<style scoped lang="scss">
.player-container {
  display: grid;
  grid-template-columns: 1fr 400px;
  gap: 16px;
  height: 100%;
}

.player-panel {
  display: flex;
  flex-direction: column;
  overflow: hidden;

  .player-tabs {
    flex: 1;
    display: flex;
    flex-direction: column;

    :deep(.el-tabs__content) {
      flex: 1;
      overflow: auto;
      padding: 12px;
    }
  }
}
</style>
