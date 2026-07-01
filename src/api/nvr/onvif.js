import request from '@/router/axios'

// 获取onvif设备列表
export function getOnvifDeviceList() {
  return request({ url: '/onvif/device/getOnvifDeviceList', method: 'get', timeout: 20000 })
}

// 验证登录onvif设备
export function onvifLogin(data) {
  return request({ url: '/onvif/device/login', method: 'post', data: data, timeout: 20000 })
}

/**
 * 查询ONVIF设备录像列表
 */
export function queryOnvifRecord(deviceIp, username, password, startTime, endTime) {
  return request({
    url: '/onvif/device/queryRecord',
    method: 'get',
    params: { deviceIp: deviceIp, username: username, password: password, startTime: startTime, endTime: endTime },
    timeout: 30000
  })
}

/**
 * ONVIF设备重启
 */
export function restartOnvifDevice(deviceId) {
  return request({ url: '/onvif/device/rebootOnvifDevice/' + deviceId, method: 'get', timeout: 30000 })
}

/**
 * ONVIF设备校时
 */
export function syncOnvifDeviceTime(deviceId, dateTime) {
  return request({
    url: '/onvif/device/syncOnvifDeviceTime/' + deviceId,
    method: 'get',
    params: dateTime ? { dateTime: dateTime } : undefined,
    timeout: 30000
  })
}

/**
 * 获取ONVIF设备时间
 */
export function getOnvifDeviceTime(deviceId) {
  return request({ url: '/onvif/device/getOnvifDeviceTime/' + deviceId, method: 'get', timeout: 30000 })
}

/**
 * 获取ONVIF设备信息
 */
export function getOnvifDeviceInfo(deviceId) {
  return request({ url: '/onvif/device/getOnvifDeviceInfo/' + deviceId, method: 'get', timeout: 30000 })
}

/**
 * ONVIF设备抓图并保存
 */
export function captureOnvifAndSave(deviceId, channelId, snapshotType) {
  return request({
    url: '/onvif/device/captureAndSave/' + deviceId + '/' + channelId,
    method: 'post',
    params: { snapshotType: snapshotType || 'manual' },
    timeout: 30000
  })
}

/**
 * 获取ONVIF设备存储配置
 */
export function getOnvifStorageConfigurations(deviceId) {
  return request({ url: '/onvif/device/getStorageConfigurations/' + deviceId, method: 'get', timeout: 30000 })
}

/**
 * 获取ONVIF设备存储能力
 */
export function getOnvifStorageCapabilities(deviceId) {
  return request({ url: '/onvif/device/getStorageCapabilities/' + deviceId, method: 'get', timeout: 30000 })
}

/**
 * 获取ONVIF设备存储状态
 */
export function getOnvifStorageState(deviceId) {
  return request({ url: '/onvif/device/getStorageState/' + deviceId, method: 'get', timeout: 30000 })
}

/**
 * 获取ONVIF网络接口配置
 */
export function getOnvifNetworkInterfaces(deviceId) {
  return request({ url: '/onvif/device/getNetworkInterfaces/' + deviceId, method: 'get', timeout: 30000 })
}

/**
 * 获取ONVIF网络协议配置
 */
export function getOnvifNetworkProtocols(deviceId) {
  return request({ url: '/onvif/device/getNetworkProtocols/' + deviceId, method: 'get', timeout: 30000 })
}

/**
 * 获取ONVIF视频源配置
 */
export function getOnvifVideoSourceConfigs(deviceId) {
  return request({ url: '/onvif/device/getVideoSourceConfigs/' + deviceId, method: 'get', timeout: 30000 })
}

/**
 * 获取ONVIF视频编码器配置
 */
export function getOnvifVideoEncoderConfigs(deviceId) {
  return request({ url: '/onvif/device/getVideoEncoderConfigs/' + deviceId, method: 'get', timeout: 30000 })
}

/**
 * 获取ONVIF音频源配置
 */
export function getOnvifAudioSourceConfigs(deviceId) {
  return request({ url: '/onvif/device/getAudioSourceConfigs/' + deviceId, method: 'get', timeout: 30000 })
}

/**
 * 获取ONVIF音频编码器配置
 */
export function getOnvifAudioEncoderConfigs(deviceId) {
  return request({ url: '/onvif/device/getAudioEncoderConfigs/' + deviceId, method: 'get', timeout: 30000 })
}

/**
 * 获取ONVIF视频输出配置
 */
export function getOnvifVideoOutputConfigs(deviceId) {
  return request({ url: '/onvif/device/getVideoOutputConfigs/' + deviceId, method: 'get', timeout: 30000 })
}
