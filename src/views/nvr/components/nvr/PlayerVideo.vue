<template>
  <div className="player-wrap">
    <EasyPlayer
        ref="innerPlayerRef"
        class="easy-player-box"
        width="100"
        height="100"
        :isPercentage="true"
        :quality="quality"
        :defaultQuality="defaultQuality"
        :isPtz="ptzEnable"
        :isQuality="isQuality"
        :isLive="isLive"
        :videoUrl="wsUrl"
        @ptz="$emit('ptz',$event)"
    />
  </div>
</template>

<script setup>
import {ref, defineProps, defineEmits, nextTick, watch} from 'vue'
import {ElMessage} from 'element-plus'
import EasyPlayer from '@/components/EasyPlayer'
import {
  stopStreamPullPlay,
  closeStreams,
  rtpPlayback,
  stopRtpPlay,
  stopGb28181Play,
  stopJt1078Play, stopRtpPlayback
} from '@/api/nvr/zlm'
import {getPlayApi, hasPtz, isRecordPlay, getSpeedConfig, PLAY_TYPE_CONFIG} from '@/utils/play‑type‑util'

const props = defineProps({
  deviceRow: {type: Object, required: true},
  quality: Array,
  defaultQuality: String,
  isQuality: Boolean,
  isLive: Boolean
})
const emit = defineEmits(['stream-ready', 'ptz'])
const innerPlayerRef = ref(null)

//组件内部私有变量
const wsUrl = ref('')
const flvUrl = ref('')
const hlsUrl = ref('')
const rtcUrl = ref('')
const sharedIframe = ref('')
const streamInfo = ref(null)
const ptzEnable = ref(false)

//私有方法
const convertWsToHttp = (url) => {
  if (!url) return url
  const reg = /^wss?:\/\//
  return reg.test(url) ? url.replace(reg, url.startsWith('wss') ? 'https://' : 'http://') : url
}

const resetInnerStreamData = () => {
  wsUrl.value = ''
  flvUrl.value = ''
  rtcUrl.value = ''
  sharedIframe.value = ''
  streamInfo.value = null
  ptzEnable.value = false
}

const setStreamBaseData = (resData) => {
  const data = resData || {}
  const isHttps = location.protocol === 'https:'
  flvUrl.value = isHttps ? data.https_flv : data.flv
  hlsUrl.value = isHttps ? data.https_hls : data.hls
  wsUrl.value = isHttps ? data.wss_flv : data.ws_flv
  rtcUrl.value = isHttps ? data.rtcs : data.rtc
  sharedIframe.value = `<iframe src="${window.location.origin}/easyPlayer?url=${encodeURIComponent(wsUrl.value)}"></iframe>`
  streamInfo.value = {
    ...data,
    app: data.app || 'live',
    stream: data.stream || '',
    mediaServerId: data.mediaServerId || data.mediaInfo?.mediaServer?.id || ''
  }
}

const autoPlayVideo = async () => {
  // EasyPlayerPro 仅支持 HLS (m3u8) 和 FMP4 (mp4) 格式，优先使用 HLS
  const playUrl = hlsUrl.value || flvUrl.value
  if (!playUrl || !innerPlayerRef.value) return
  await nextTick()
  innerPlayerRef.value.play(playUrl)
}

const showPlayErr = (msg) => {
  ElMessage.error(`打开视频流失败：${msg || '未知错误'}`)
}

/**
 * 实时预览播放
 */
const startPlay = async () => {
  const row = props.deviceRow
  if (!row.id) return
  row.loading = true
  resetInnerStreamData()
  try {
    const deviceType = row.type
    const typeCfg = PLAY_TYPE_CONFIG[deviceType]
    if (!typeCfg) throw new Error('未知设备类型，无法播放')
    const baseParams = {
      deviceId: row.id,
      streamId: row.deviceCode,
      type: deviceType,
      rtp_type: row.protocol === 'UDP' ? '0' : '1',
      enable_audio: row.enableAudio === '1',
      enable_mp4: row.enableMp4 === '1'
    }
    let requestParams = {...baseParams}
    if (typeCfg.app) baseParams.app = typeCfg.app
    typeCfg.needConvertWsUrl && row.flvType === 'ws' && (baseParams.url = convertWsToHttp(row.liveAddress))
    if (typeCfg.singleId) requestParams = row.id
    if (typeCfg.needTcpMode) requestParams = {...baseParams, tcpMode: '0'}
    const apiResponse = await typeCfg.api(requestParams)
    ptzEnable.value = !!typeCfg.ptz
    if (apiResponse?.data?.data) {
      setStreamBaseData(apiResponse.data.data)
      await autoPlayVideo()
      emit('stream-ready', {
        flvUrl: flvUrl.value,
        wsUrl: wsUrl.value,
        rtcUrl: rtcUrl.value,
        sharedIframe: sharedIframe.value,
        streamInfo: streamInfo.value
      })
    }
  } catch (err) {
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

/**
 * 新增：录像回放播放
 * @param {string} startTime 开始时间  YYYY‑MM‑DD HH:mm:ss
 * @param {string} endTime   结束时间  YYYY‑MM‑DD HH:mm:ss
 * @param {number} speed     倍速
 */
const startPlayBack = async (startTime, endTime, speed = 1) => {
  const row = props.deviceRow
  if (!row.id) return
  row.loading = true
  resetInnerStreamData()
  try {
    const deviceType = row.type
    const typeCfg = PLAY_TYPE_CONFIG[deviceType]
    if (!typeCfg) throw new Error('未知设备类型，无法回放')

    //回放接口参数
    const params = {
      deviceId: row.id,
      deviceCode: row.deviceCode,
      streamId: row.deviceCode,
      app:typeCfg.app,
      startTime,
      endTime,
      speed,
      type: deviceType
    }
    //调用回放接口 loadRecord
    const apiResponse = await rtpPlayback(params)
    ptzEnable.value = !!typeCfg.ptz
    if (apiResponse?.data?.data) {
      setStreamBaseData(apiResponse.data.data)
      await autoPlayVideo()
      emit('stream-ready', {
        flvUrl: flvUrl.value,
        wsUrl: wsUrl.value,
        rtcUrl: rtcUrl.value,
        sharedIframe: sharedIframe.value,
        streamInfo: streamInfo.value
      })
    }
  } catch (err) {
    let errMsg = '回放打开失败'
    if (err?.code === 'ECONNABORTED' || err?.message?.includes('timeout')) {
      errMsg = '回放请求超时，请稍后重试'
    } else if (err?.response?.status === 503) {
      errMsg = '流媒体服务不可用'
    } else if (err?.response?.status === 404) {
      errMsg = '录像文件不存在'
    } else if (err?.message) {
      errMsg = err.message
    }
    showPlayErr(errMsg)
  } finally {
    row.loading = false
  }
}

const stopPlaybackPlay = async () => {
  const deviceType = props.deviceRow.type
  const typeCfg = PLAY_TYPE_CONFIG[deviceType]
  const params = {
    deviceId: props.deviceRow.id,
    deviceCode: props.deviceRow.deviceCode,
    streamId: props.deviceRow.deviceCode,
    type: deviceType
  }
  if (typeCfg.app) params.app =typeCfg.app
  if (typeCfg.needTcpMode) params.tcpMode = '0'
  await stopRtpPlayback(params)
  sharedIframe.value = ''
  streamInfo.value = null
}
//停止播放内部参数构造
const buildRtpData = () => ({
  type: props.deviceRow.type,
  streamId: props.deviceRow.deviceCode,
  deviceId: props.deviceRow.id
})
const buildPullData = () => ({
  deviceId: props.deviceRow.id,
  mediaServerId: props.mediaServerId
})

/**
 * 停止播放（实时预览 + 回放通用）
 */
const stopPlay = async () => {
  const typeHandlerMap = {
    '1': () => stopStreamPullPlay(buildPullData()),
    '2': () => stopStreamPullPlay(buildPullData()),
    '3': () => stopStreamPullPlay(buildPullData()),
    '4': () => stopStreamPullPlay(buildPullData()),
    '5': () => stopStreamPullPlay(buildPullData()),
    '6': () => closeStreams(props.deviceRow.id), //type=6 回放停止
    '7': () => stopRtpPlay(buildRtpData()),
    '8': () => stopRtpPlay(buildRtpData()),
    '9': () => stopRtpPlay(buildRtpData()),
    '12': () => stopGb28181Play(props.deviceRow.id),
    '14': () => stopJt1078Play(props.deviceRow.id)
  }
  const handler = typeHandlerMap[props.deviceRow.type]
  if (!handler) return
  try {
    await handler()
    if (innerPlayerRef.value && typeof innerPlayerRef.value.stop === 'function') {
      innerPlayerRef.value.stop()
    }
  } catch (err) {
    console.error('停止播放失败', err)
  }
}

/**
 * 销毁播放器实例
 */
const destroyPlayer = async () => {
  await nextTick()
  if (!innerPlayerRef?.value) return
  if (typeof innerPlayerRef.value.destroy === 'function') {
    innerPlayerRef.value.destroy()
  }
  innerPlayerRef.value = null
  resetInnerStreamData()
}

//向外暴露方法，父组件可以调用 startPlay、playbackPlay、stopPlay、destroyPlayer
defineExpose({
  startPlay,
  startPlayBack,
  stopPlaybackPlay,
  stopPlay,
  destroyPlayer
})
</script>

<style scoped lang="scss">
.player-wrap {
  width: 100%;
  display: flex;
  justify-content: center;
}

.easy-player-box {
  width: 800px;
  height: 400px;
}
</style>