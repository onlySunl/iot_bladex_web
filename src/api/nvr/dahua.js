import request from '@/router/axios'

// 查询大华设备列表
export function listDaHuaDevice() {
  return request({ url: '/dahua/device/list', method: 'get' })
}

/**
 * 查询大华设备录像列表
 */
export function queryDaHuaRecord(id, channelId, startTime, endTime) {
  return request({
    url: '/dahua/device/queryRecord/' + id + '/' + channelId,
    method: 'get',
    params: { startTime: startTime, endTime: endTime },
    timeout: 30000
  })
}

/**
 * 大华设备获取时间
 */
export function getDaHuaTime(ip) {
  return request({ url: '/dahua/device/getTime/' + ip, method: 'post' })
}

/**
 * 大华设备设置时间
 */
export function setDaHuaTime(id, date, type) {
  return request({
    url: '/dahua/device/setTime/' + id,
    method: 'get',
    params: { date: date, type: type }
  })
}

/**
 * 大华设备重启
 */
export function rebootDaHuaDevice(id) {
  return request({ url: '/dahua/device/reboot/' + id, method: 'get' })
}

/**
 * 获取大华设备详细信息
 */
export function getDaHuaDeviceInfo(id) {
  return request({ url: '/dahua/device/deviceInfo/' + id, method: 'get' })
}

/**
 * 获取大华设备详细信息(通过IP)
 */
export function getDaHuaDeviceInfoByIp(ip) {
  return request({ url: '/dahua/device/deviceInfoByIp/' + ip, method: 'get' })
}

/**
 * 获取大华设备系统参数
 */
export function getDaHuaSystemParam(id) {
  return request({ url: '/dahua/device/systemParam/' + id, method: 'get' })
}

/**
 * 获取大华设备视频参数
 */
export function getDaHuaVideoParam(id, channelId, streamType) {
  return request({
    url: '/dahua/device/videoParam/' + id + '/' + channelId,
    method: 'get',
    params: { streamType: streamType }
  })
}

/**
 * 获取大华设备视频输入参数
 */
export function getDaHuaDeviceVideoParam(id, channelId) {
  return request({ url: '/dahua/device/deviceVideoParam/' + id + '/' + channelId, method: 'get' })
}

/**
 * 设置大华设备视频参数
 */
export function setDaHuaVideoParam(id, channelId, streamType, param) {
  return request({
    url: '/dahua/device/videoParam/' + id + '/' + channelId,
    method: 'put',
    params: { streamType: streamType },
    data: param
  })
}

/**
 * 设置大华设备视频输入参数
 */
export function setDaHuaDeviceVideoParam(id, channelId, param) {
  return request({
    url: '/dahua/device/deviceVideoParam/' + id + '/' + channelId,
    method: 'put',
    data: param
  })
}

/**
 * 大华设备抓图并保存
 */
export function captureDaHuaAndSave(id, channelId, snapshotType) {
  return request({
    url: '/dahua/device/captureAndSave/' + id + '/' + channelId,
    method: 'post',
    params: { snapshotType: snapshotType || 'manual' }
  })
}

/**
 * 获取大华设备存储信息
 */
export function getDaHuaStorageInfo(id) {
  return request({ url: '/dahua/device/storageInfo/' + id, method: 'get' })
}

/**
 * 获取大华设备系统资源信息
 */
export function getDaHuaSystemResourceInfo(id) {
  return request({ url: '/dahua/device/systemResourceInfo/' + id, method: 'get' })
}

/**
 * 获取大华设备SD卡信息
 */
export function getDaHuaSDCardInfo(id) {
  return request({ url: '/dahua/device/sdCardInfo/' + id, method: 'get' })
}

/**
 * 获取大华设备码流信息
 */
export function getDaHuaBitrateInfo(id) {
  return request({ url: '/dahua/device/bitrateInfo/' + id, method: 'get' })
}

/**
 * 获取大华设备网络状态信息
 */
export function getDaHuaNetworkStatusInfo(id) {
  return request({ url: '/dahua/device/networkStatusInfo/' + id, method: 'get' })
}

/**
 * 获取大华设备软件版本信息
 */
export function getDaHuaSoftwareVersionInfo(id) {
  return request({ url: '/dahua/device/softwareVersionInfo/' + id, method: 'get' })
}

/**
 * 获取大华设备录像状态信息
 */
export function getDaHuaRecordStateInfo(id) {
  return request({ url: '/dahua/device/recordStateInfo/' + id, method: 'get' })
}

/**
 * 获取大华设备电源状态信息
 */
export function getDaHuaPowerStateInfo(id) {
  return request({ url: '/dahua/device/powerStateInfo/' + id, method: 'get' })
}

/**
 * 获取大华设备报警布撤防信息
 */
export function getDaHuaAlarmArmInfo(id) {
  return request({ url: '/dahua/device/alarmArmInfo/' + id, method: 'get' })
}

/**
 * 获取大华设备摄像头属性信息
 */
export function getDaHuaCameraInfo(id) {
  return request({ url: '/dahua/device/cameraInfo/' + id, method: 'get' })
}

/**
 * 获取大华设备RTSP URL信息
 */
export function getDaHuaRtspUrlInfo(id) {
  return request({ url: '/dahua/device/rtspUrlInfo/' + id, method: 'get' })
}

/**
 * 大华设备录像下载（返回文件信息）
 */
export function downloadDaHuaRecord(data) {
  return request({ url: '/dahua/device/downloadRecord', method: 'post', data: data, timeout: 300000 })
}

/**
 * 大华设备录像直接下载到用户电脑
 */
export function downloadDaHuaRecordDirect(data) {
  return request({ url: '/dahua/device/downloadRecordDirect', method: 'post', data: data, responseType: 'blob', timeout: 300000 })
}
