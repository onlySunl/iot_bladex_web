<template>
  <el-drawer
      :model-value="props.easyPlayerOpen"
      @update:model-value="emit('update:easyPlayerOpen', $event)"
      size="880px"
      direction="rtl"
      @close="handleDialogClose"
      class="glass-dialog play-drawer"
  >
    <template #header>
      <span>{{ `视频播放-${props.deviceRow?.deviceName || ''}` }}</span>
    </template>

    <!-- 播放器区域 -->
    <div v-if="props.easyPlayerOpen" class="player-wrap">
      <EasyPlayer
          ref="EasyPlayerRef"
          class="easy-player-box"
          width="100"
          height="100"
          :isPercentage="true"
          :quality="quality"
          :defaultQuality="defaultQuality"
          :isPtz="isPtz"
          :isQuality="isQuality"
          :isLive="isLive"
          :videoUrl="wsUrl"
          @ptz="handlePtz"
      />
    </div>

    <el-tabs
        v-model="tabActiveName"
        type="card"
        stretch
        v-if="props.easyPlayerOpen"
        class="video-tab-container"
    >
      <el-tab-pane label="地址" name="address">
        <el-row :gutter="10" class="url-row">
          <el-col :span="3">
            <span class="url-label">播放地址：</span>
          </el-col>
          <el-col :span="21">
            <el-input v-model="flvUrl" disabled>
              <template #prepend>flv地址</template>
              <template #append>
                <el-button type="primary" :icon="DocumentCopy" @click="copyText(flvUrl)"/>
              </template>
            </el-input>
          </el-col>
        </el-row>
        <el-row :gutter="10" class="url-row">
          <el-col :span="3">
            <span class="url-label">iframe：</span>
          </el-col>
          <el-col :span="21">
            <el-input v-model="sharedIframe" disabled>
              <template #prepend>iframe：</template>
              <template #append>
                <el-button type="primary" :icon="DocumentCopy" @click="copyText(sharedIframe)"/>
              </template>
            </el-input>
          </el-col>
        </el-row>
        <el-row :gutter="10" class="url-row">
          <el-col :span="3">
            <span class="url-label">资源地址：</span>
          </el-col>
          <el-col :span="21">
            <el-input v-model="rtcUrl" disabled>
              <template #prepend>
                <StreamDropdown :stream-info="streamInfo || {}"/>
              </template>
              <template #append>
                <el-button type="primary" :icon="DocumentCopy" @click="copyText(wsUrl)"/>
              </template>
            </el-input>
          </el-col>
        </el-row>
      </el-tab-pane>

      <el-tab-pane label="编码信息" name="codec">
        <MediaInfo
            v-if="streamInfo"
            ref="mediaInfo"
            :app="streamInfo.app"
            :stream="streamInfo.stream"
            :mediaServerId="streamInfo.mediaServerId"
        />
      </el-tab-pane>

      <el-tab-pane label="云台控制" name="control">
        <div v-if="!isPtz" class="empty-tip">
          <el-icon class="tip-icon">
            <InfoFilled/>
          </el-icon>
          <p>当前设备不支持云台控制</p>
        </div>
        <div v-else class="ptz-container">
          <div class="ptz-left-panel">
            <div class="ptz-direction-wrapper">
              <div class="control-btn control-top" @mousedown="sendPtz('up')" @mouseup="stopPtz">
                <el-icon class="icon">
                  <CaretTop/>
                </el-icon>
                <div class="control-inner-btn control-inner"></div>
              </div>
              <div class="control-btn control-left" @mousedown="sendPtz('left')" @mouseup="stopPtz">
                <el-icon class="icon">
                  <CaretLeft/>
                </el-icon>
                <div class="control-inner-btn control-inner"></div>
              </div>
              <div class="control-btn control-bottom" @mousedown="sendPtz('down')" @mouseup="stopPtz">
                <el-icon class="icon">
                  <CaretBottom/>
                </el-icon>
                <div class="control-inner-btn control-inner"></div>
              </div>
              <div class="control-btn control-right" @mousedown="sendPtz('right')" @mouseup="stopPtz">
                <el-icon class="icon">
                  <CaretRight/>
                </el-icon>
                <div class="control-inner-btn control-inner"></div>
              </div>
              <div class="control-round">
                <div class="control-round-inner"><i class="fa fa-pause-circle"></i></div>
              </div>
              <div class="ptz-speed-slider">
                <el-slider v-model="controlSpeed" :min="controlSpeedMin" :max="controlSpeedMax"/>
              </div>
            </div>
            <div class="ptz-zoom-group">
              <div class="ptz-btn-box">
                <div @mousedown="sendPtz('zoomin')" @mouseup="stopPtz" title="变+">
                  <el-icon class="control-zoom-btn">
                    <ZoomIn/>
                  </el-icon>
                </div>
                <div @mousedown="sendPtz('zoomout')" @mouseup="stopPtz" title="变-">
                  <el-icon class="control-zoom-btn">
                    <ZoomOut/>
                  </el-icon>
                </div>
              </div>
              <div class="ptz-btn-box">
                <div @mousedown="sendPtz('near')" @mouseup="stopPtz" title="聚焦+">
                  <i class="iconfont icon-bianjiao-fangda control-zoom-btn"></i>
                </div>
                <div @mousedown="sendPtz('far')" @mouseup="stopPtz" title="聚焦-">
                  <i class="iconfont icon-bianjiao-suoxiao control-zoom-btn"></i>
                </div>
              </div>
              <div class="ptz-btn-box">
                <div @mousedown="sendPtz('in')" @mouseup="stopPtz" title="光圈+">
                  <i class="iconfont icon-guangquan control-zoom-btn"></i>
                </div>
                <div @mousedown="sendPtz('out')" @mouseup="stopPtz" title="光圈-">
                  <i class="iconfont icon-guangquan- control-zoom-btn"></i>
                </div>
              </div>
            </div>
          </div>
          <div class="ptz-right-panel">
            <el-tabs type="card" class="ptz-tabs">
              <el-tab-pane v-if="isPresetSupported" label="预置点">
                <div class="preset-panel">
                  <el-select v-model="selectedPresetIndex" placeholder="选择预置点" class="preset-select" clearable
                             @change="handlePresetSelect">
                    <el-option v-for="preset in presetList" :key="preset.index"
                               :label="preset.name || `预置点${preset.index}`" :value="preset.index"/>
                  </el-select>
                  <div class="preset-buttons">
                    <el-button type="primary" size="small" @click="handleGotoPreset" :disabled="!selectedPresetIndex">
                      调用
                    </el-button>
                    <el-button size="small" @click="openSetPresetDialog">设置</el-button>
                    <el-button type="danger" size="small" @click="handleDeletePreset" :disabled="!selectedPresetIndex">删除
                    </el-button>
                  </div>
                  <el-button text @click="loadPresetList" class="refresh-btn">
                    <el-icon>
                      <Refresh/>
                    </el-icon>
                    刷新
                  </el-button>
                </div>
              </el-tab-pane>
              <el-tab-pane label="灯光">
                <div class="control-panel">
                  <el-button @click="handleLightControl(true)">开灯</el-button>
                  <el-button type="danger" @click="handleLightControl(false)">关灯</el-button>
                </div>
              </el-tab-pane>
              <el-tab-pane label="雨刷">
                <div class="control-panel">
                  <el-button @click="handleWiperControl(true)">开雨刷</el-button>
                  <el-button type="danger" @click="handleWiperControl(false)">关雨刷</el-button>
                </div>
              </el-tab-pane>
              <el-tab-pane v-if="isGb28181Device" label="看守位">
                <el-form :model="homePositionForm" label-width="100px">
                  <el-form-item label="预置点编号">
                    <el-input-number v-model="homePositionForm.presetId" :min="1" :max="255" class="w-full"/>
                  </el-form-item>
                  <el-form-item label="停留时间(秒)">
                    <el-input-number v-model="homePositionForm.dwellTime" :min="0" class="w-full"/>
                  </el-form-item>
                </el-form>
                <div class="button-group mt20">
                  <el-button @click="handleQueryHomePosition" icon="Refresh">查询</el-button>
                  <el-button type="success" @click="handleSetHomePosition" icon="Check">设置</el-button>
                  <el-button type="warning" @click="handleHomePositionControl" icon="SwitchButton">调用</el-button>
                </div>
              </el-tab-pane>
              <el-tab-pane v-if="isGb28181Device" label="巡航轨迹">
                <el-form :model="cruiseTrackForm" label-width="100px">
                  <el-form-item label="轨迹编号">
                    <el-input-number v-model="cruiseTrackForm.trackId" :min="0" class="w-full"/>
                  </el-form-item>
                </el-form>
                <div class="button-group mt20">
                  <el-button @click="handleQueryCruiseTrackList" icon="Refresh">查询列表</el-button>
                  <el-button type="success" @click="handleQueryCruiseTrack" icon="Search">查询详情</el-button>
                  <el-button type="warning" @click="handleStartCruise" icon="VideoPlay">开始巡航</el-button>
                  <el-button type="danger" @click="handleStopCruise" icon="VideoPause">停止巡航</el-button>
                </div>
                <div v-if="cruiseTrackList.length > 0" class="mt20">
                  <div class="panel-section-title">巡航轨迹列表:</div>
                  <el-table :data="cruiseTrackList" border size="small" width="100%">
                    <el-table-column prop="id" label="编号" width="100"/>
                    <el-table-column prop="name" label="名称"/>
                  </el-table>
                </div>
              </el-tab-pane>
              <el-tab-pane v-if="isGb28181Device" label="精准控制">
                <el-form :model="ptzPreciseForm" label-width="100px">
                  <el-form-item label="水平位置(0-359)">
                    <el-input-number v-model="ptzPreciseForm.pan" :min="0" :max="359" class="w-full"/>
                  </el-form-item>
                  <el-form-item label="垂直位置(0-359)">
                    <el-input-number v-model="ptzPreciseForm.tilt" :min="0" :max="359" class="w-full"/>
                  </el-form-item>
                  <el-form-item label="变倍(0-15)">
                    <el-input-number v-model="ptzPreciseForm.zoom" :min="0" class="w-full"/>
                  </el-form-item>
                </el-form>
                <div class="button-group mt20">
                  <el-button @click="handleQueryPTZPosition" icon="Refresh">查询位置</el-button>
                  <el-button type="success" @click="handlePtzPreciseControl" icon="Connection">执行控制</el-button>
                </div>
                <div v-if="ptzPosition?.pan !== undefined" class="mt20">
                  <div class="panel-section-title">当前PTZ位置:</div>
                  <el-descriptions :column="3" border size="small">
                    <el-descriptions-item label="水平位置">{{ ptzPosition.pan }}</el-descriptions-item>
                    <el-descriptions-item label="垂直位置">{{ ptzPosition.tilt }}</el-descriptions-item>
                    <el-descriptions-item label="变倍">{{ ptzPosition.zoom }}</el-descriptions-item>
                  </el-descriptions>
                </div>
              </el-tab-pane>
            </el-tabs>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="抓图记录" name="snapshots">
        <div class="snapshot-wrap">
          <div class="snapshot-toolbar">
            <el-button type="primary" :icon="Camera" @click="handleCaptureFromStream" :loading="captureLoading"
                       :disabled="!shouldShowCaptureBtn">抓图
            </el-button>
            <el-button type="success" :icon="Refresh" @click="getDeviceSnapshotList" :loading="deviceSnapshotLoading">
              刷新
            </el-button>
          </div>
          <div v-loading="deviceSnapshotLoading" class="snapshot-grid-wrap">
            <div v-if="deviceSnapshotList.length > 0" class="snapshot-grid">
              <div v-for="item in deviceSnapshotList" :key="item.id" class="snapshot-card">
                <image-preview v-if="item.fileUrl" :src="item.fileUrl" width="100%" height="100%"/>
                <div class="snapshot-actions">
                  <el-tooltip content="下载">
                    <el-button text size="small" :icon="Download" @click.stop="handleDownloadDeviceSnapshot(item)"/>
                  </el-tooltip>
                  <el-tooltip content="删除">
                    <el-button text danger size="small" :icon="Delete" @click.stop="handleDeleteDeviceSnapshot(item)"/>
                  </el-tooltip>
                </div>
              </div>
            </div>
            <el-empty v-else description="暂无抓图记录"/>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
  </el-drawer>
</template>

<script setup>
import {ref, nextTick, defineProps, defineEmits, watch} from 'vue'
import {ElMessage} from 'element-plus'
// 图标
import {
  DocumentCopy, InfoFilled, CaretTop, CaretLeft, CaretBottom, CaretRight,
  ZoomIn, ZoomOut, Refresh, Camera, Download, Delete, Check, SwitchButton,
  VideoPlay, VideoPause, Connection
} from '@element-plus/icons-vue'
// 组件
import EasyPlayer from '@/components/EasyPlayer'
import MediaInfo from '@/components/nvr/Channel/mediaInfo.vue'
import StreamDropdown from '@/components/nvr/Channel/streamDropdown.vue'
import ImagePreview from '@/components/nvr/ImagePreview'
// 接口
import {
  streamPullPlay,
  stopStreamPullPlay,
  loadRecord,
  closeStreams,
  rtpPlay,
  stopRtpPlay,
  streamPullPush,
  startGb28181Play,
  stopGb28181Play,
  startJt1078Play,
  stopJt1078Play
} from '@/api/nvr/zlm'

// Props Emits
const props = defineProps({
  deviceRow: {type: Object, default: () => ({})},
  easyPlayerOpen: {type: Boolean, default: false},
  dict: {type: Object, default: () => ({})}
})
const emit = defineEmits(['update:easyPlayerOpen'])

// 响应式变量
const wsUrl = ref('')
const flvUrl = ref('')
const rtcUrl = ref('')
const sharedIframe = ref('')
const streamInfo = ref(null)
const quality = ref([])
const defaultQuality = ref('高清')
const isPtz = ref(false)
const isQuality = ref(true)
const isLive = ref(true)
const controlSpeed = ref(50)
const controlSpeedMin = ref(1)
const controlSpeedMax = ref(100)
const tabActiveName = ref('media')
const isPresetSupported = ref(false)
const selectedPresetIndex = ref(null)
const presetList = ref([])
const isGb28181Device = ref(false)
const homePositionForm = ref({presetId: 1, dwellTime: 10})
const cruiseTrackForm = ref({trackId: 0})
const cruiseTrackList = ref([])
const ptzPreciseForm = ref({pan: 0, tilt: 0, zoom: 0})
const ptzPosition = ref({})
const captureLoading = ref(false)
const shouldShowCaptureBtn = ref(true)
const deviceSnapshotLoading = ref(false)
const deviceSnapshotList = ref([])
const deviceSnapshotTotal = ref(0)
const deviceSnapshotQuery = ref({pageNum: 1, pageSize: 10})
const EasyPlayerRef = ref(null)
// 缓存上次设备ID，防止重复请求
let lastDeviceId = null
// 设备播放类型配置表（统一维护，新增类型仅在此添加）
// 设备播放类型全局配置（所有差异化逻辑统一在此维护，消除函数内if判断）
const PLAY_TYPE_CONFIG = {
  1: {
    api: streamPullPlay,
    app: 'rtsp',
    ptz: false
  },
  2: {
    api: streamPullPlay,
    app: 'rtmp',
    ptz: false
  },
  3: {
    api: streamPullPlay,
    app: 'flv',
    ptz: false,
    needConvertWsUrl: true // flv-ws 需要转换地址标记
  },
  4: {
    api: streamPullPlay,
    app: 'hls',
    ptz: false
  },
  5: {
    api: streamPullPlay,
    app: 'onvif',
    ptz: true
  },
  6: {
    api: loadRecord,
    needSnap: true // 需要加载截图
  },
  7: {
    api: rtpPlay,
    app: 'haikang',
    speed: {min: 1, val: 5, max: 10},
    ptz: true,
    needTcpMode: true // rtp接口额外携带tcpMode标记
  },
  8: {
    api: rtpPlay,
    app: 'haikang_isup',
    speed: {min: 1, val: 5, max: 5},
    ptz: true,
    needTcpMode: true
  },
  9: {
    api: rtpPlay,
    app: 'dahua',
    speed: {min: 1, val: 5, max: 15},
    ptz: true,
    needTcpMode: true
  },
  12: {
    api: startGb28181Play,
    ptz: true,
    gb28181: true // 国标设备标记
  },
  14: {
    api: startJt1078Play,
    speedMax: 255,
    ptz: true
  },
  13: {
    api: streamPullPush,
    singleId: true // 仅传id标记
  }
}
// 工具函数
const copyText = (text) => {
  if (!text) return
  const input = document.createElement('textarea')
  input.value = text
  document.body.appendChild(input)
  input.select()
  document.execCommand('copy')
  document.body.removeChild(input)
  ElMessage.success('复制成功')
}

const destroyPlayer = async () => {
  await nextTick()
  if (!EasyPlayerRef.value) return
  if (typeof EasyPlayerRef.value.stop === 'function') EasyPlayerRef.value.stop()
  if (typeof EasyPlayerRef.value.destroy === 'function') EasyPlayerRef.value.destroy()
  EasyPlayerRef.value = null
}

const sendPtz = (cmd) => console.log('云台指令', cmd, '速度', controlSpeed.value)
const stopPtz = () => sendPtz('stop')

const convertWsToHttp = (url) => {
  if (!url) return url
  const reg = /^wss?:\/\//
  return reg.test(url) ? url.replace(reg, url.startsWith('wss') ? 'https://' : 'http://') : url
}

const resetStreamData = () => {
  wsUrl.value = ''
  flvUrl.value = ''
  rtcUrl.value = ''
  sharedIframe.value = ''
  streamInfo.value = null
}

/**
 * 设置流播放数据
 * API 响应已包含所有播放地址，直接使用
 * @param {Object} res API响应数据
 */
const setStreamBaseData = (res) => {
  const data = res || {}
  console.log('[DevicePlayer] 流数据:', data)

  const isHttps = location.protocol === 'https:'

  // 直接使用 API 返回的播放地址
  flvUrl.value = isHttps ? data.https_flv : data.flv
  wsUrl.value = isHttps ? data.wss_flv : data.ws_flv
  rtcUrl.value = isHttps ? data.rtcs : data.rtc

  sharedIframe.value = `<iframe src="${window.location.origin}/easyPlayer?url=${encodeURIComponent(wsUrl.value)}"></iframe>`

  // 保存流信息（包含所有 URL 和媒体信息）
  streamInfo.value = {
    ...data,
    app: data.app || 'live',
    stream: data.stream || '',
    mediaServerId: data.mediaServerId || data.mediaInfo?.mediaServer?.id || ''
  }

  console.log('[DevicePlayer] 播放地址:', { flvUrl: flvUrl.value, wsUrl: wsUrl.value, rtcUrl: rtcUrl.value })
  console.log('[DevicePlayer] 流信息:', { app: data.app, stream: data.stream, mediaServerId: data.mediaServerId })
}

const autoPlay = async () => {
  console.log(flvUrl.value);
  if (!wsUrl.value || !EasyPlayerRef.value) return
  await nextTick()
  EasyPlayerRef.value.play(wsUrl.value)
}

const showPlayErr = (msg) => ElMessage.error(`打开视频流失败：${msg || '未知错误'}`)

// 关闭抽屉
const handleDialogClose = async () => {
  lastDeviceId = null
  stopPtz()
  await destroyPlayer()
  await handleStopPlay();
  tabActiveName.value = 'media'
  resetStreamData()
  emit('update:easyPlayerOpen', false)
  getList()
}

// 核心播放逻辑（纯映射表，无if else）
/**
 * 打开设备预览播放
 * @param {Object} row 设备行数据
 */
const handlePlay = async () => {
  const row = props.deviceRow;
  // 前置校验
  if (!row?.id) return

  // 初始化全局播放控制默认值
  row.loading = true
  controlSpeed.value = 50
  controlSpeedMin.value = 1
  controlSpeedMax.value = 100
  isPtz.value = false
  isPresetSupported.value = false
  isGb28181Device.value = false
  resetStreamData()

  try {
    const deviceType = row.type
    const typeCfg = PLAY_TYPE_CONFIG[deviceType]
    // 无配置直接抛出异常
    if (!typeCfg) throw new Error('未知设备类型，无法播放')

    // 组装基础通用参数
    const baseParams = {
      deviceId: row.id,
      streamId: row.deviceCode,
      url: row.liveAddress,
      type: deviceType,
      rtp_type: row.protocol === 'UDP' ? '0' : '1',
      enable_audio: row.enableAudio === '1',
      enable_mp4: row.enableMp4 === '1'
    }

    // 配置标记统一处理，消除if分支
    // 1. 附加app参数
    if (typeCfg.app) baseParams.app = typeCfg.app
    // 2. flv ws地址转换
    typeCfg.needConvertWsUrl && row.flvType === 'ws' && (baseParams.url = convertWsToHttp(row.liveAddress))

    // 组装接口入参
    let requestParams = baseParams
    if (typeCfg.singleId) requestParams = row.id
    if (typeCfg.needTcpMode) requestParams = { ...baseParams, tcpMode: '0' }

    // 请求接口
    const apiResponse = await typeCfg.api(requestParams)
    console.log(apiResponse);
    // ========== 全部使用配置标记驱动状态更新，无多余if判断 ==========
    // 云台与预置位
    typeCfg.ptz && (isPtz.value = isPresetSupported.value = true)
    // 自定义倍速区间
    if (typeCfg.speed) {
      const { min, val, max } = typeCfg.speed
      controlSpeedMin.value = min
      controlSpeed.value = val
      controlSpeedMax.value = max
    }
    // 独立最大倍速
    typeCfg.speedMax && (controlSpeedMax.value = typeCfg.speedMax)
    // 国标设备标识
    typeCfg.gb28181 && (isGb28181Device.value = true)
    // 回放截图列表
    typeCfg.needSnap && getDeviceSnapshotList()

    // 流数据赋值 + 自动播放
    apiResponse?.data && setStreamBaseData(apiResponse.data.data)
    await autoPlay()

  } catch (err) {
    // 根据错误类型显示不同的提示信息
    let errMsg = '播放请求异常'
    if (err?.code === 'ECONNABORTED' || err?.message?.includes('timeout')) {
      errMsg = '视频流请求超时，请检查网络连接或稍后重试'
    } else if (err?.response?.status === 503) {
      errMsg = '流媒体服务暂不可用，请稍后重试'
    } else if (err?.response?.status === 404) {
      errMsg = '视频流地址不存在，请检查设备配置'
    } else if (err?.message) {
      errMsg = err.message
    }
    showPlayErr(errMsg)
  } finally {
    row.loading = false
  }
}
// 构造RTP停止参数
const buildRtpData = () => ({
  type: props.deviceRow.type,
  streamId: props.deviceRow.deviceCode,
  deviceId: props.deviceRow.id
})
// 构造拉流代理参数
const buildPullData = () => ({
  deviceId: props.deviceRow.id,
  mediaServerId: props.deviceRow.mediaServerId,
  streamKey: props.deviceRow.streamKey
})
const handleStopPlay = async () => {
  console.log(props.deviceRow);
  // 类型对应执行方法映射表
  const typeHandlerMap = {
    '1': () => stopStreamPullPlay(buildPullData()),
    '2': () => stopStreamPullPlay(buildPullData()),
    '3': () => stopStreamPullPlay(buildPullData()),
    '4': () => stopStreamPullPlay(buildPullData()),
    '5': () => stopStreamPullPlay(buildPullData()),
    '6': () => closeStreams(props.deviceRow.id),
    '7': () => stopRtpPlay(buildRtpData()),
    '8': () => stopRtpPlay(buildRtpData()),
    '9': () => stopRtpPlay(buildRtpData()),
    '12': () => stopGb28181Play(props.deviceRow.id),
    '14': () => stopJt1078Play(props.deviceRow.id)
  }

  const handler = typeHandlerMap[props.deviceRow.type]
  if (!handler) {
    //proxy.$modal.msgWarning('当前设备类型不支持停止播放')
    return
  }

  try {
    handler()
    handlePlaySuccess()
  } catch (err) {
    handlePlayError(err)
  }

}
// 成功统一处理
const handlePlaySuccess = () => {
  getList()
  // proxy.$modal.msgSuccess('停止播放成功')
}

// 失败统一处理
const handlePlayError = (err) => {
  console.error('停止播放失败', err)
  //proxy.$modal.msgError('停止播放失败，请重试')
}
// 监听抽屉打开，设备不同才自动播放
watch(
    () => props.easyPlayerOpen,
    async (newVal, oldVal) => {
      if (newVal && !oldVal && props.deviceRow?.id && props.deviceRow.id !== lastDeviceId) {
        lastDeviceId = props.deviceRow.id
        await handlePlay(props.deviceRow)
      }
    }
)

// 空业务方法
const handlePtz = (info) => emit('ptz', info)
const loadPresetList = () => {
}
const handlePresetSelect = () => {
}
const handleGotoPreset = () => {
}
const openSetPresetDialog = () => {
}
const handleDeletePreset = () => {
}
const handleLightControl = () => {
}
const handleWiperControl = () => {
}
const handleQueryHomePosition = () => {
}
const handleSetHomePosition = () => {
}
const handleHomePositionControl = () => {
}
const handleQueryCruiseTrackList = () => {
}
const handleQueryCruiseTrack = () => {
}
const handleStartCruise = () => {
}
const handleStopCruise = () => {
}
const handleQueryPTZPosition = () => {
}
const handlePtzPreciseControl = () => {
}
const handleCaptureFromStream = () => {
}
const getDeviceSnapshotList = () => {
}
const handleDownloadDeviceSnapshot = () => {
}
const handleDeleteDeviceSnapshot = () => {
}
const getList = () => {
}
</script>

<style scoped lang="scss">
.play-drawer {
  .player-wrap {
    width: 100%;
    display: flex;
    justify-content: center;
  }

  .easy-player-box {
    width: 800px;
    height: 400px;
  }

  .video-tab-container {
    margin-top: 10px;
  }

  .url-row {
    margin-top: 10px;
  }

  .url-label {
    width: 80px;
    line-height: 40px;
    text-align: right;
    display: inline-block;
  }

  .empty-tip {
    text-align: center;
    padding: 40px;
    color: var(--el-text-secondary);

    .tip-icon {
      font-size: 48px;
      margin-bottom: 16px;
    }
  }

  .ptz-container {
    display: grid;
    grid-template-columns: 240px auto;
    height: 180px;
    overflow: auto;
    gap: 12px;
  }

  .ptz-left-panel {
    display: grid;
    grid-template-columns: 100px auto;
  }

  .ptz-direction-wrapper {
    position: relative;

    .ptz-speed-slider {
      position: absolute;
      left: 4px;
      top: 112px;
      width: 100px;
    }
  }

  .ptz-zoom-group {
    display: flex;
    flex-direction: column;
    gap: 10px;

    .ptz-btn-box {
      display: flex;
      gap: 8px;

      .control-zoom-btn {
        font-size: 24px;
        cursor: pointer;
      }
    }
  }

  .ptz-right-panel .ptz-tabs {
    height: 100%;
  }

  .control-btn {
    width: 40px;
    height: 40px;
    cursor: pointer;

    .icon {
      font-size: 20px;
    }
  }

  .control-round {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .preset-panel {
    display: flex;
    flex-direction: column;
    gap: 10px;

    .preset-select {
      width: 100%;
    }

    .preset-buttons {
      display: flex;
      gap: 8px;
    }

    .refresh-btn {
      align-self: flex-start;
    }
  }

  .control-panel {
    display: flex;
    gap: 10px;
    margin-top: 10px;
  }

  .button-group {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
  }

  .panel-section-title {
    font-weight: bold;
    margin-bottom: 8px;
  }

  .snapshot-wrap {
    padding: 10px;
  }

  .snapshot-toolbar {
    margin-bottom: 10px;
  }

  .snapshot-grid {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 12px;
  }

  .snapshot-card {
    position: relative;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    aspect-ratio: 1/1;
  }

  .snapshot-actions {
    position: absolute;
    top: 8px;
    right: 8px;
    display: flex;
    gap: 4px;
  }

  .mt20 {
    margin-top: 20px;
  }

  .w-full {
    width: 100%;
  }
}
</style>