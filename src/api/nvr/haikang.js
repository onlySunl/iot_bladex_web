import request from '@/router/axios'

/**
 * 查询海康SDK设备录像列表
 */
export function queryHaiKangRecord(deviceId, channelId, startTime, endTime) {
  return request({
    url: '/haikang/device/getRecMonth/' + deviceId + '/' + channelId,
    method: 'get',
    params: { startTime: startTime, endTime: endTime },
    timeout: 30000
  })
}

/**
 * 海康设备录像直接下载到用户电脑
 */
export function downloadHaikangRecordDirect(data) {
  return request({ url: '/haikang/device/downloadRecordDirect', method: 'post', data: data, responseType: 'blob', timeout: 300000 })
}

/**
 * 海康设备抓图并保存
 */
export function captureHaikangAndSave(deviceId, channelId, snapshotType) {
  return request({
    url: '/haikang/device/captureAndSave/' + deviceId + '/' + channelId,
    method: 'post',
    params: { snapshotType: snapshotType || 'manual' },
    timeout: 30000
  })
}

/**
 * 获取海康设备信息
 */
export function getHaiKangDeviceInfo(deviceId) {
  return request({ url: '/haikang/device/getHaiKangDeviceInfo/' + deviceId, method: 'get', timeout: 30000 })
}

/**
 * 获取海康存储信息
 */
export function getHaiKangStorageInfo(deviceId) {
  return request({ url: '/haikang/device/getHaiKangStorageInfo/' + deviceId, method: 'get', timeout: 30000 })
}

/**
 * 获取海康SD卡信息
 */
export function getHaiKangSDCardInfo(deviceId) {
  return request({ url: '/haikang/device/getHaiKangSDCardInfo/' + deviceId, method: 'get', timeout: 30000 })
}

/**
 * 获取海康码率信息
 */
export function getHaiKangBitrateInfo(deviceId) {
  return request({ url: '/haikang/device/getHaiKangBitrateInfo/' + deviceId, method: 'get', timeout: 30000 })
}

/**
 * 获取海康网络状态信息
 */
export function getHaiKangNetworkStatusInfo(deviceId) {
  return request({ url: '/haikang/device/getHaiKangNetworkStatusInfo/' + deviceId, method: 'get', timeout: 30000 })
}

/**
 * 获取海康软件版本信息
 */
export function getHaiKangSoftwareVersionInfo(deviceId) {
  return request({ url: '/haikang/device/getHaiKangSoftwareVersionInfo/' + deviceId, method: 'get', timeout: 30000 })
}

/**
 * 获取海康录像状态信息
 */
export function getHaiKangRecordStateInfo(deviceId) {
  return request({ url: '/haikang/device/getHaiKangRecordStateInfo/' + deviceId, method: 'get', timeout: 30000 })
}

/**
 * 获取海康电源状态信息
 */
export function getHaiKangPowerStateInfo(deviceId) {
  return request({ url: '/haikang/device/getHaiKangPowerStateInfo/' + deviceId, method: 'get', timeout: 30000 })
}

/**
 * 获取海康报警布撤防信息
 */
export function getHaiKangAlarmArmInfo(deviceId) {
  return request({ url: '/haikang/device/getHaiKangAlarmArmInfo/' + deviceId, method: 'get', timeout: 30000 })
}

/**
 * 获取海康摄像头属性信息
 */
export function getHaiKangCameraInfo(deviceId) {
  return request({ url: '/haikang/device/getHaiKangCameraInfo/' + deviceId, method: 'get', timeout: 30000 })
}

/**
 * 获取海康RTSP URL
 */
export function getHaiKangRtspUrlInfo(deviceId) {
  return request({ url: '/haikang/device/getHaiKangRtspUrlInfo/' + deviceId, method: 'get', timeout: 30000 })
}

/**
 * 获取海康系统参数
 */
export function getHaiKangSystemParam(deviceId) {
  return request({ url: '/haikang/device/getHaiKangSystemParam/' + deviceId, method: 'get', timeout: 30000 })
}

/**
 * 获取海康视频参数
 */
export function getHaiKangVideoParam(deviceId, channelId, streamType) {
  return request({ url: '/haikang/device/getHaiKangVideoParam/' + deviceId + '/' + channelId, method: 'get', params: { streamType: streamType }, timeout: 30000 })
}

/**
 * 获取海康设备时间
 */
export function getHaiKangDevTime(deviceId) {
  return request({ url: '/haikang/device/getHaiKangDevTime/' + deviceId, method: 'get', timeout: 30000 })
}

/**
 * 设置海康设备时间
 */
export function setHaiKangDevTime(deviceId, time) {
  return request({ url: '/haikang/device/setHaiKangDevTime/' + deviceId, method: 'get', params: { time: time }, timeout: 30000 })
}

/**
 * 重启海康设备
 */
export function rebootHaiKangDevice(deviceId) {
  return request({ url: '/haikang/device/rebootHaiKangDevice/' + deviceId, method: 'get', timeout: 30000 })
}
