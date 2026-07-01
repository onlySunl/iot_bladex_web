import request from '@/router/axios'

/**
 * 获取所有国标设备
 */
export function getAllDevices() {
  return request({ url: '/gb28181/device/getAllDevices', method: 'get' })
}

/**
 * 根据国标设备获取所有通道
 */
export function getChannelsByDeviceId(gbDeviceId) {
  return request({ url: '/gb28181/device/getChannelsByDeviceId/' + gbDeviceId, method: 'get' })
}

/**
 * 查询设备录像列表
 */
export function queryDeviceRecord(deviceId, channelId, startTime, endTime) {
  return request({
    url: '/gb28181/device/queryRecord/' + deviceId + '/' + channelId,
    method: 'get',
    params: { startTime: startTime, endTime: endTime },
    timeout: 30000
  })
}

/**
 * 刷新设备状态和通道
 */
export function refreshDevice(gbDeviceId) {
  return request({ url: '/gb28181/device/refresh/' + gbDeviceId, method: 'post' })
}

/**
 * 远程重启设备
 */
export function rebootGb28181Device(gbDeviceId) {
  return request({ url: '/gb28181/device/reboot/' + gbDeviceId, method: 'post' })
}

/**
 * 录像控制
 */
export function recordCmd(gbDeviceId, channelId, recordCmd, streamNumber) {
  return request({
    url: '/gb28181/device/record/cmd',
    method: 'post',
    params: { gbDeviceId: gbDeviceId, channelId: channelId, recordCmd: recordCmd, streamNumber: streamNumber }
  })
}

/**
 * 查询设备状态
 */
export function queryDeviceStatus(deviceId) {
  return request({ url: '/gb28181/device/status/' + deviceId, method: 'get' })
}

/**
 * 查询设备信息
 */
export function queryDeviceInfo(deviceId) {
  return request({ url: '/gb28181/device/info/' + deviceId, method: 'get' })
}

/**
 * 查询设备配置
 */
export function queryDeviceConfig(deviceId, configType) {
  return request({
    url: '/gb28181/device/config/' + deviceId,
    method: 'get',
    params: { configType: configType },
    timeout: 30000
  })
}

/**
 * 订阅设备目录
 */
export function subscribeCatalog(qsDeviceId) {
  return request({ url: '/gb28181/device/subscribe/catalog/' + qsDeviceId, method: 'get' })
}

/**
 * 取消订阅设备目录
 */
export function unsubscribeCatalog(qsDeviceId) {
  return request({ url: '/gb28181/device/unsubscribe/catalog/' + qsDeviceId, method: 'get' })
}

/**
 * 修改设备配置
 */
export function updateDeviceConfig(deviceId, config) {
  return request({
    url: '/gb28181/device/config/' + deviceId,
    method: 'post',
    data: config,
    timeout: 30000
  })
}

/**
 * 查询看守位
 */
export function queryHomePosition(deviceId, channelId) {
  return request({
    url: '/gb28181/device/homePosition/' + deviceId,
    method: 'get',
    params: { channelId: channelId },
    timeout: 30000
  })
}

/**
 * 设置看守位
 */
export function updateHomePosition(deviceId, channelId, config) {
  return request({
    url: '/gb28181/device/homePosition/' + deviceId,
    method: 'post',
    params: { channelId: channelId },
    data: config,
    timeout: 30000
  })
}

/**
 * 查询巡航轨迹列表
 */
export function queryCruiseTrackList(deviceId, channelId) {
  return request({
    url: '/gb28181/device/cruiseTrackList/' + deviceId,
    method: 'get',
    params: { channelId: channelId },
    timeout: 30000
  })
}

/**
 * 查询巡航轨迹
 */
export function queryCruiseTrack(deviceId, channelId, number) {
  return request({
    url: '/gb28181/device/cruiseTrack/' + deviceId,
    method: 'get',
    params: { channelId: channelId, number: number },
    timeout: 30000
  })
}

/**
 * PTZ精准状态查询
 */
export function queryPTZPosition(deviceId, channelId) {
  return request({
    url: '/gb28181/device/ptzPosition/' + deviceId,
    method: 'get',
    params: { channelId: channelId },
    timeout: 30000
  })
}

/**
 * 存储卡状态查询
 */
export function querySDCardStatus(deviceId, channelId) {
  return request({
    url: '/gb28181/device/sdCardStatus/' + deviceId,
    method: 'get',
    params: { channelId: channelId },
    timeout: 30000
  })
}

/**
 * 开始巡航
 */
export function startCruise(deviceId, channelId, cruiseId) {
  return request({
    url: '/gb28181/device/cruise/start/' + deviceId,
    method: 'get',
    params: { channelId: channelId, cruiseId: cruiseId },
    timeout: 30000
  })
}

/**
 * 停止巡航
 */
export function stopCruise(deviceId, channelId, cruiseId) {
  return request({
    url: '/gb28181/device/cruise/stop/' + deviceId,
    method: 'get',
    params: { channelId: channelId, cruiseId: cruiseId },
    timeout: 30000
  })
}

/**
 * 报警复位控制
 */
export function alarmResetControl(deviceId, channelId, alarmMethod, alarmType) {
  return request({
    url: '/gb28181/device/alarmReset/' + deviceId,
    method: 'post',
    params: { channelId: channelId, alarmMethod: alarmMethod, alarmType: alarmType },
    timeout: 30000
  })
}

/**
 * 强制关键帧控制
 */
export function iFrameControl(deviceId, channelId) {
  return request({
    url: '/gb28181/device/iFrame/' + deviceId,
    method: 'post',
    params: { channelId: channelId },
    timeout: 30000
  })
}

/**
 * 看守位控制
 */
export function homePositionControl(deviceId, channelId, deviceConfig) {
  return request({
    url: '/gb28181/device/homePosition/control/' + deviceId,
    method: 'post',
    params: { channelId: channelId },
    data: deviceConfig,
    timeout: 30000
  })
}

/**
 * PTZ精准控制
 */
export function ptzPreciseControl(deviceId, channelId, ptzPreciseCtrl) {
  return request({
    url: '/gb28181/device/ptzPrecise/' + deviceId,
    method: 'post',
    params: { channelId: channelId },
    data: ptzPreciseCtrl,
    timeout: 30000
  })
}

/**
 * 设备软升级控制
 */
export function deviceUpgradeControl(deviceId, channelId, firmware, fileURL, manufacturer, sessionID) {
  return request({
    url: '/gb28181/device/deviceUpgrade/' + deviceId,
    method: 'post',
    params: { channelId: channelId, firmware: firmware, fileURL: fileURL, manufacturer: manufacturer, sessionID: sessionID },
    timeout: 30000
  })
}

/**
 * 存储卡格式化控制
 */
export function formatSDCardControl(deviceId, channelId, sdCardId) {
  return request({
    url: '/gb28181/device/formatSDCard/' + deviceId,
    method: 'post',
    params: { channelId: channelId, sdCardId: sdCardId },
    timeout: 30000
  })
}

/**
 * 目标跟踪控制
 */
export function targetTrackControl(deviceId, channelId, targetTrack, deviceId2, targetArea) {
  return request({
    url: '/gb28181/device/targetTrack/' + deviceId,
    method: 'post',
    params: { channelId: channelId, targetTrack: targetTrack, deviceId2: deviceId2 },
    data: targetArea,
    timeout: 30000
  })
}
