import request from '@/router/axios'

// 查询海康isup设备列表
export function listHaiKangIsupDevice() {
  return request({ url: '/haikangIsup/device/list', method: 'get' })
}

/**
 * 查询海康ISUP设备录像列表
 */
export function queryHaiKangIsupRecord(deviceId, channelId, startTime, endTime) {
  return request({
    url: '/haikangIsup/device/getRecMonth/' + deviceId + '/' + channelId,
    method: 'get',
    params: { startTime: startTime, endTime: endTime },
    timeout: 30000
  })
}

/**
 * 重启海康ISUP设备
 */
export function rebootHaiKangIsupDevice(deviceId) {
  return request({ url: '/haikangIsup/device/rebootHaiKangDevice/' + deviceId, method: 'get' })
}

/**
 * 获取海康ISUP设备时间
 */
export function getHaiKangIsupDevTime(deviceId) {
  return request({ url: '/haikangIsup/device/getHaiKangDevTime/' + deviceId, method: 'get' })
}

/**
 * 设置海康ISUP设备时间
 */
export function setHaiKangIsupDevTime(deviceId, time) {
  return request({ url: '/haikangIsup/device/setHaiKangDevTime/' + deviceId, method: 'get', params: { time: time } })
}

/**
 * 海康ISUP设备抓图并保存
 */
export function captureHaiKangIsupAndSave(deviceId, channelId, snapshotType) {
  return request({ url: '/haikangIsup/device/captureAndSave/' + deviceId + '/' + channelId, method: 'post', params: { snapshotType: snapshotType } })
}

/**
 * 海康ISUP设备录像直接下载到用户电脑
 */
export function downloadHaikangIsupRecordDirect(data) {
  return request({ url: '/haikangIsup/device/downloadRecordDirect', method: 'post', data: data, responseType: 'blob', timeout: 300000 })
}

/**
 * 获取海康ISUP设备信息
 */
export function getHaiKangIsupDeviceInfo(deviceId) {
  return request({ url: '/haikangIsup/device/getHaiKangIsupDeviceInfo/' + deviceId, method: 'get' })
}

/**
 * 获取海康ISUP存储信息
 */
export function getHaiKangIsupStorageInfo(deviceId) {
  return request({ url: '/haikangIsup/device/getHaiKangIsupStorageInfo/' + deviceId, method: 'get' })
}

/**
 * 获取海康ISUP SD卡信息
 */
export function getHaiKangIsupSDCardInfo(deviceId) {
  return request({ url: '/haikangIsup/device/getHaiKangIsupSDCardInfo/' + deviceId, method: 'get' })
}

/**
 * 获取海康ISUP码率信息
 */
export function getHaiKangIsupBitrateInfo(deviceId) {
  return request({ url: '/haikangIsup/device/getHaiKangIsupBitrateInfo/' + deviceId, method: 'get' })
}

/**
 * 获取海康ISUP网络状态信息
 */
export function getHaiKangIsupNetworkStatusInfo(deviceId) {
  return request({ url: '/haikangIsup/device/getHaiKangIsupNetworkStatusInfo/' + deviceId, method: 'get' })
}

/**
 * 获取海康ISUP软件版本信息
 */
export function getHaiKangIsupSoftwareVersionInfo(deviceId) {
  return request({ url: '/haikangIsup/device/getHaiKangIsupSoftwareVersionInfo/' + deviceId, method: 'get' })
}

/**
 * 获取海康ISUP电源状态信息
 */
export function getHaiKangIsupPowerStateInfo(deviceId) {
  return request({ url: '/haikangIsup/device/getHaiKangIsupPowerStateInfo/' + deviceId, method: 'get' })
}

/**
 * 获取海康ISUP摄像头属性信息
 */
export function getHaiKangIsupCameraInfo(deviceId) {
  return request({ url: '/haikangIsup/device/getHaiKangIsupCameraInfo/' + deviceId, method: 'get' })
}

/**
 * 获取海康ISUP系统参数
 */
export function getHaiKangIsupSystemParam(deviceId) {
  return request({ url: '/haikangIsup/device/getHaiKangIsupSystemParam/' + deviceId, method: 'get' })
}

/**
 * 获取海康ISUP视频参数
 */
export function getHaiKangIsupVideoParam(deviceId, streamType) {
  return request({ url: '/haikangIsup/device/getHaiKangIsupVideoParam/' + deviceId, method: 'get', params: { streamType: streamType } })
}

/**
 * 获取海康系统状态信息
 */
export function getHaiKangIsupSystemStatus(deviceId) {
  return request({ url: '/haikangIsup/device/getHaiKangIsupSystemStatus/' + deviceId, method: 'get' })
}

/**
 * 获取海康设备信息（XML格式）
 */
export function getHaiKangIsupDeviceInfoXml(deviceId) {
  return request({ url: '/haikangIsup/device/getHaiKangIsupDeviceInfoXml/' + deviceId, method: 'get' })
}

/**
 * 海康设备远程升级
 */
export function upgradeHaiKangIsupDevice(data) {
  return request({ url: '/haikangIsup/device/upgradeHaiKangIsupDevice', method: 'post', data: data })
}

/**
 * 获取海康ISUP设备配置信息
 */
export function getHaiKangIsupDeviceConfig(deviceId) {
  return request({ url: '/haikangIsup/device/getHaiKangIsupDeviceConfig/' + deviceId, method: 'get' })
}

/**
 * 设置海康ISUP设备配置信息
 */
export function setHaiKangIsupDeviceConfig(deviceId, config) {
  return request({ url: '/haikangIsup/device/setHaiKangIsupDeviceConfig/' + deviceId, method: 'post', data: config })
}

/**
 * 获取海康ISUP版本信息
 */
export function getHaiKangIsupVersionInfo(deviceId) {
  return request({ url: '/haikangIsup/device/getHaiKangIsupVersionInfo/' + deviceId, method: 'get' })
}
