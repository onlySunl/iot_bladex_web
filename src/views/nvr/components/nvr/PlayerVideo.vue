<template>
  <div class="player-wrap">
    <EasyPlayer
        ref="innerPlayerRef"
        class="easy-player-box"
        :width="playerWidth"
        :height="playerHeight"
        :isPercentage="false"
        :quality="quality"
        :defaultQuality="defaultQuality"
        :isPtz="ptzEnable"
        :isQuality="isQuality"
        :isLive="isLive"
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
const fmp4Url = ref('')
const sharedIframe = ref('')
const streamInfo = ref(null)
const ptzEnable = ref(false)
const playVideoUrl = ref('') // 绑定到Easy‑Player组件
const playerWidth = ref(800)
const playerHeight = ref(400)

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
  fmp4Url.value = ''
  sharedIframe.value = ''
  streamInfo.value = null
  ptzEnable.value = false
  playVideoUrl.value = '' //清空播放地址
}

const setStreamBaseData = (resData) => {
  const data = resData || {}
  console.log(data);
  const isHttps = location.protocol === 'https:'
  flvUrl.value = isHttps ? data.https_flv : data.flv
  hlsUrl.value = isHttps ? data.https_hls : data.hls
  wsUrl.value = isHttps ? data.wss_flv : data.ws_flv
  rtcUrl.value = isHttps ? data.rtcs : data.rtc
  //重点修复：回放优先ws‑fmp4，http‑fmp4播放器容易黑屏
  fmp4Url.value = isHttps ? data.wss_fmp4 : data.ws_fmp4 || data.fmp4
  sharedIframe.value = `<iframe src="${window.location.origin}/easyPlayer?url=${encodeURIComponent(wsUrl.value)}"></iframe>`
  streamInfo.value = {
    ...data,
    app: data.app || 'live',
    stream: data.stream || '',
    mediaServerId: data.mediaServerId || data.mediaInfo?.mediaServer?.id || ''
  }
}

// 实时预览：移除手动play，赋值 playVideoUrl 由组件内部自动播放
const autoPlayVideo = async () => {
  const playUrl = flvUrl.value
  if (!playUrl) return
  await nextTick()
  // 延迟300ms等待Easy‑Player实例初始化完毕
  setTimeout(() => {
    playVideoUrl.value = playUrl
    innerPlayerRef.value.play(playVideoUrl.value);
    console.log(playVideoUrl.value)
  }, 300)
}

//回放播放：改用ws‑fmp4并且绑定playVideoUrl，不再手动调用实例play方法
const autoPlayBackVideo = async () => {
  const playUrl = fmp4Url.value
  if (!playUrl) return
  await nextTick()
  setTimeout(() => {
    playVideoUrl.value = playUrl
    innerPlayerRef.value.play(playVideoUrl.value);
    console.log(playVideoUrl.value)
  }, 300)
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
        hlsUrl: hlsUrl.value,
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
  await stopPlaybackPlay();
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
      app: typeCfg.app,
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
      await autoPlayBackVideo()
      emit('stream-ready', {
        flvUrl: flvUrl.value,
        wsUrl: wsUrl.value,
        rtcUrl: rtcUrl.value,
        hlsUrl: hlsUrl.value,
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
  //前端播放器先停止
  if (innerPlayerRef.value && typeof innerPlayerRef.value.stop === 'function') {
    innerPlayerRef.value.stop()
  }
  playVideoUrl.value = ''
  const deviceType = props.deviceRow.type
  const typeCfg = PLAY_TYPE_CONFIG[deviceType]
  const params = {
    deviceId: props.deviceRow.id,
    deviceCode: props.deviceRow.deviceCode,
    streamId: props.deviceRow.deviceCode,
    type: deviceType
  }
  if (typeCfg.app) params.app = typeCfg.app
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
    playVideoUrl.value = ''
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
  innerPlayerRef.value.destroy()
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