import request from '@/axios'

/**
 * @typedef {import("@/types/api/qs/dahua").DaHuaDevice} DaHuaDevice
 * @typedef {import("@/types/api/qs/dahua").DaHuaDeviceInfo} DaHuaDeviceInfo
 * @typedef {import("@/types/api/qs/dahua").DaHuaSystemParam} DaHuaSystemParam
 * @typedef {import("@/types/api/qs/dahua").DaHuaVideoParam} DaHuaVideoParam
 * @typedef {import("@/types/api/qs/dahua").DaHuaDeviceVideoParam} DaHuaDeviceVideoParam
 * @typedef {import("@/types/api/qs/dahua").DaHuaStorageInfo} DaHuaStorageInfo
 * @typedef {import("@/types/api/qs/dahua").DaHuaSystemResourceInfo} DaHuaSystemResourceInfo
 * @typedef {import("@/types/api/qs/dahua").DaHuaSDCardInfo} DaHuaSDCardInfo
 * @typedef {import("@/types/api/qs/dahua").DaHuaBitrateInfo} DaHuaBitrateInfo
 * @typedef {import("@/types/api/qs/dahua").DaHuaNetworkStatusInfo} DaHuaNetworkStatusInfo
 * @typedef {import("@/types/api/qs/dahua").DaHuaSoftwareVersionInfo} DaHuaSoftwareVersionInfo
 * @typedef {import("@/types/api/qs/dahua").DaHuaRecordStateInfo} DaHuaRecordStateInfo
 * @typedef {import("@/types/api/qs/dahua").DaHuaPowerStateInfo} DaHuaPowerStateInfo
 * @typedef {import("@/types/api/qs/dahua").DaHuaAlarmArmInfo} DaHuaAlarmArmInfo
 * @typedef {import("@/types/api/qs/dahua").DaHuaCameraInfo} DaHuaCameraInfo
 * @typedef {import("@/types/api/qs/dahua").DaHuaRtspUrlInfo} DaHuaRtspUrlInfo
 * @typedef {import("@/types/api/qs/dahua").DaHuaRecordDownloadRequest} DaHuaRecordDownloadRequest
 * @typedef {import("@/types/api/qs/dahua").DaHuaRecordDownloadResponse} DaHuaRecordDownloadResponse
 * @typedef {import("@/types/common").AjaxResult} AjaxResult
 */

/**
 * 查询大华设备列表
 * @returns {Promise<AjaxResult<DaHuaDevice[]>>}
 */
export function listDaHuaDevice() {
  return request({
    url: '/dahua/device/list',
    method: 'get'
  })
}

/**
 * 查询大华设备录像列表
 * @param {number} id 设备ID
 * @param {number} channelId 通道ID
 * @param {string} startTime 开始时间
 * @param {string} endTime 结束时间
 * @returns {Promise<AjaxResult<any>>}
 */
export function queryDaHuaRecord(id, channelId, startTime, endTime) {
  return request({
    url: `/dahua/device/queryRecord/${id}/${channelId}`,
    method: 'get',
    params: {
      startTime,
      endTime
    },
    timeout: 30000
  })
}

/**
 * 获取大华设备系统时间
 * @param {string} ip 设备IP
 * @returns {Promise<AjaxResult<any>>}
 */
export function getDaHuaTime(ip) {
  return request({
    url: `/dahua/device/getTime/${ip}`,
    method: 'post'
  })
}

/**
 * 设置大华设备系统时间
 * @param {number} id 设备ID
 * @param {string} date 日期时间
 * @param {string|number} type 时间类型
 * @returns {Promise<AjaxResult<any>>}
 */
export function setDaHuaTime(id, date, type) {
  return request({
    url: `/dahua/device/setTime/${id}`,
    method: 'get',
    params: {
      date,
      type
    }
  })
}

/**
 * 大华设备远程重启
 * @param {number} id 设备ID
 * @returns {Promise<AjaxResult<any>>}
 */
export function rebootDaHuaDevice(id) {
  return request({
    url: `/dahua/device/reboot/${id}`,
    method: 'get'
  })
}

/**
 * 获取大华设备详细信息
 * @param {number} id 设备ID
 * @returns {Promise<AjaxResult<DaHuaDeviceInfo>>}
 */
export function getDaHuaDeviceInfo(id) {
  return request({
    url: `/dahua/device/deviceInfo/${id}`,
    method: 'get'
  })
}

/**
 * 通过IP获取大华设备详细信息
 * @param {string} ip 设备IP
 * @returns {Promise<AjaxResult<DaHuaDeviceInfo>>}
 */
export function getDaHuaDeviceInfoByIp(ip) {
  return request({
    url: `/dahua/device/deviceInfoByIp/${ip}`,
    method: 'get'
  })
}

/**
 * 获取大华设备系统配置参数
 * @param {number} id 设备ID
 * @returns {Promise<AjaxResult<DaHuaSystemParam>>}
 */
export function getDaHuaSystemParam(id) {
  return request({
    url: `/dahua/device/systemParam/${id}`,
    method: 'get'
  })
}

/**
 * 获取指定通道指定码流类型的视频编码参数
 * @param {number} id 设备ID
 * @param {number} channelId 通道ID
 * @param {number} streamType 码流类型
 * @returns {Promise<AjaxResult<DaHuaVideoParam>>}
 */
export function getDaHuaVideoParam(id, channelId, streamType) {
  return request({
    url: `/dahua/device/videoParam/${id}/${channelId}`,
    method: 'get',
    params: {
      streamType
    }
  })
}

/**
 * 获取通道图像输入参数（亮度、对比度、饱和度等）
 * @param {number} id 设备ID
 * @param {number} channelId 通道ID
 * @returns {Promise<AjaxResult<DaHuaDeviceVideoParam>>}
 */
export function getDaHuaDeviceVideoParam(id, channelId) {
  return request({
    url: `/dahua/device/deviceVideoParam/${id}/${channelId}`,
    method: 'get'
  })
}

/**
 * 修改通道视频编码参数
 * @param {number} id 设备ID
 * @param {number} channelId 通道ID
 * @param {number} streamType 码流类型
 * @param {DaHuaVideoParam} param 视频编码参数
 * @returns {Promise<AjaxResult<any>>}
 */
export function setDaHuaVideoParam(id, channelId, streamType, param) {
  return request({
    url: `/dahua/device/videoParam/${id}/${channelId}`,
    method: 'put',
    params: {
      streamType
    },
    data: param
  })
}

/**
 * 修改通道图像输入参数
 * @param {number} id 设备ID
 * @param {number} channelId 通道ID
 * @param {DaHuaDeviceVideoParam} param 图像参数
 * @returns {Promise<AjaxResult<any>>}
 */
export function setDaHuaDeviceVideoParam(id, channelId, param) {
  return request({
    url: `/dahua/device/deviceVideoParam/${id}/${channelId}`,
    method: 'put',
    data: param
  })
}

/**
 * 设备实时抓图并保存到服务端
 * @param {number} id 设备ID
 * @param {number} channelId 通道ID
 * @param {string} [snapshotType='manual'] 抓图类型
 * @returns {Promise<AjaxResult<any>>}
 */
export function captureDaHuaAndSave(id, channelId, snapshotType = 'manual') {
  return request({
    url: `/dahua/device/captureAndSave/${id}/${channelId}`,
    method: 'post',
    params: { snapshotType }
  })
}

/**
 * 获取设备硬盘、分区等存储信息
 * @param {number} id 设备ID
 * @returns {Promise<AjaxResult<DaHuaStorageInfo>>}
 */
export function getDaHuaStorageInfo(id) {
  return request({
    url: `/dahua/device/storageInfo/${id}`,
    method: 'get'
  })
}

/**
 * 获取设备CPU、内存、网络、解码等系统资源占用信息
 * @param {number} id 设备ID
 * @returns {Promise<AjaxResult<DaHuaSystemResourceInfo>>}
 */
export function getDaHuaSystemResourceInfo(id) {
  return request({
    url: `/dahua/device/systemResourceInfo/${id}`,
    method: 'get'
  })
}

/**
 * 获取设备SD卡/硬盘存储汇总信息
 * @param {number} id 设备ID
 * @returns {Promise<AjaxResult<DaHuaSDCardInfo>>}
 */
export function getDaHuaSDCardInfo(id) {
  return request({
    url: `/dahua/device/sdCardInfo/${id}`,
    method: 'get'
  })
}

/**
 * 获取各通道实时码流信息
 * @param {number} id 设备ID
 * @returns {Promise<AjaxResult<DaHuaBitrateInfo>>}
 */
export function getDaHuaBitrateInfo(id) {
  return request({
    url: `/dahua/device/bitrateInfo/${id}`,
    method: 'get'
  })
}

/**
 * 获取设备网卡IP、网关、DNS、MAC等网络状态信息
 * @param {number} id 设备ID
 * @returns {Promise<AjaxResult<DaHuaNetworkStatusInfo>>}
 */
export function getDaHuaNetworkStatusInfo(id) {
  return request({
    url: `/dahua/device/networkStatusInfo/${id}`,
    method: 'get'
  })
}

/**
 * 获取设备软硬件、固件、Web等版本信息
 * @param {number} id 设备ID
 * @returns {Promise<AjaxResult<DaHuaSoftwareVersionInfo>>}
 */
export function getDaHuaSoftwareVersionInfo(id) {
  return request({
    url: `/dahua/device/softwareVersionInfo/${id}`,
    method: 'get'
  })
}

/**
 * 获取设备全局及各通道录像启停状态
 * @param {number} id 设备ID
 * @returns {Promise<AjaxResult<DaHuaRecordStateInfo>>}
 */
export function getDaHuaRecordStateInfo(id) {
  return request({
    url: `/dahua/device/recordStateInfo/${id}`,
    method: 'get'
  })
}

/**
 * 获取设备多路电源在线状态
 * @param {number} id 设备ID
 * @returns {Promise<AjaxResult<DaHuaPowerStateInfo>>}
 */
export function getDaHuaPowerStateInfo(id) {
  return request({
    url: `/dahua/device/powerStateInfo/${id}`,
    method: 'get'
  })
}

/**
 * 获取报警输入通道布防、撤防状态
 * @param {number} id 设备ID
 * @returns {Promise<AjaxResult<DaHuaAlarmArmInfo>>}
 */
export function getDaHuaAlarmArmInfo(id) {
  return request({
    url: `/dahua/device/alarmArmInfo/${id}`,
    method: 'get'
  })
}

/**
 * 获取所有IPC通道在线、型号、固件、IP等摄像头信息
 * @param {number} id 设备ID
 * @returns {Promise<AjaxResult<DaHuaCameraInfo>>}
 */
export function getDaHuaCameraInfo(id) {
  return request({
    url: `/dahua/device/cameraInfo/${id}`,
    method: 'get'
  })
}

/**
 * 获取各通道主/子码流RTSP播放地址
 * @param {number} id 设备ID
 * @returns {Promise<AjaxResult<DaHuaRtspUrlInfo>>}
 */
export function getDaHuaRtspUrlInfo(id) {
  return request({
    url: `/dahua/device/rtspUrlInfo/${id}`,
    method: 'get'
  })
}

/**
 * 发起录像下载任务，返回文件服务信息
 * @param {DaHuaRecordDownloadRequest} data 下载请求参数
 * @returns {Promise<AjaxResult<DaHuaRecordDownloadResponse>>}
 */
export function downloadDaHuaRecord(data) {
  return request({
    url: '/dahua/device/downloadRecord',
    method: 'post',
    data,
    timeout: 300000
  })
}

/**
 * 直接流式返回录像文件，浏览器触发下载
 * @param {DaHuaRecordDownloadRequest} data 下载请求参数
 * @returns {Promise<Blob>}
 */
export function downloadDaHuaRecordDirect(data) {
  return request({
    url: '/dahua/device/downloadRecordDirect',
    method: 'post',
    data,
    responseType: 'blob',
    timeout: 300000
  })
}