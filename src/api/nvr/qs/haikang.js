import request from '@/axios'

/**
 * @typedef {import("@/types/api/qs/haikang").HaikangRecordDownloadRequest} HaikangRecordDownloadRequest
 * @typedef {import("@/types/common").AjaxResult} AjaxResult
 */

/**
 * 查询海康SDK设备录像列表
 * @param {string} deviceId 设备ID
 * @param {number} channelId 通道ID
 * @param {string} startTime 开始时间
 * @param {string} endTime 结束时间
 * @returns {Promise<AjaxResult<any>>}
 */
export function queryHaiKangRecord(deviceId, channelId, startTime, endTime) {
    return request({
        url: `/haikang/device/getRecMonth/${deviceId}/${channelId}`,
        method: 'get',
        params: {
            startTime,
            endTime
        },
        timeout: 30000
    })
}

/**
 * 海康设备录像直接下载到用户电脑
 * @param {HaikangRecordDownloadRequest} data 下载请求参数
 * @returns {Promise<Blob>}
 */
export function downloadHaikangRecordDirect(data) {
    return request({
        url: '/haikang/device/downloadRecordDirect',
        method: 'post',
        data,
        responseType: 'blob',
        timeout: 300000
    })
}

/**
 * 海康设备抓图并保存
 * @param {string} deviceId 设备ID
 * @param {number} channelId 通道ID
 * @param {string} [snapshotType='manual'] 抓图类型
 * @returns {Promise<AjaxResult<any>>}
 */
export function captureHaikangAndSave(deviceId, channelId, snapshotType = 'manual') {
    return request({
        url: `/haikang/device/captureAndSave/${deviceId}/${channelId}`,
        method: 'post',
        params: { snapshotType },
        timeout: 30000
    })
}

/**
 * 获取海康设备详细信息
 * @param {string} deviceId 设备ID
 * @returns {Promise<AjaxResult<any>>}
 */
export function getHaiKangDeviceInfo(deviceId) {
    return request({
        url: `/haikang/device/getHaiKangDeviceInfo/${deviceId}`,
        method: 'get',
        timeout: 30000
    })
}

/**
 * 获取海康存储硬盘分区信息
 * @param {string} deviceId 设备ID
 * @returns {Promise<AjaxResult<any>>}
 */
export function getHaiKangStorageInfo(deviceId) {
    return request({
        url: `/haikang/device/getHaiKangStorageInfo/${deviceId}`,
        method: 'get',
        timeout: 30000
    })
}

/**
 * 获取海康SD卡存储信息
 * @param {string} deviceId 设备ID
 * @returns {Promise<AjaxResult<any>>}
 */
export function getHaiKangSDCardInfo(deviceId) {
    return request({
        url: `/haikang/device/getHaiKangSDCardInfo/${deviceId}`,
        method: 'get',
        timeout: 30000
    })
}

/**
 * 获取海康各通道实时码率信息
 * @param {string} deviceId 设备ID
 * @returns {Promise<AjaxResult<any>>}
 */
export function getHaiKangBitrateInfo(deviceId) {
    return request({
        url: `/haikang/device/getHaiKangBitrateInfo/${deviceId}`,
        method: 'get',
        timeout: 30000
    })
}

/**
 * 获取海康设备网络状态信息
 * @param {string} deviceId 设备ID
 * @returns {Promise<AjaxResult<any>>}
 */
export function getHaiKangNetworkStatusInfo(deviceId) {
    return request({
        url: `/haikang/device/getHaiKangNetworkStatusInfo/${deviceId}`,
        method: 'get',
        timeout: 30000
    })
}

/**
 * 获取海康软硬件版本信息
 * @param {string} deviceId 设备ID
 * @returns {Promise<AjaxResult<any>>}
 */
export function getHaiKangSoftwareVersionInfo(deviceId) {
    return request({
        url: `/haikang/device/getHaiKangSoftwareVersionInfo/${deviceId}`,
        method: 'get',
        timeout: 30000
    })
}

/**
 * 获取海康设备全局及通道录像状态
 * @param {string} deviceId 设备ID
 * @returns {Promise<AjaxResult<any>>}
 */
export function getHaiKangRecordStateInfo(deviceId) {
    return request({
        url: `/haikang/device/getHaiKangRecordStateInfo/${deviceId}`,
        method: 'get',
        timeout: 30000
    })
}

/**
 * 获取海康设备电源运行状态
 * @param {string} deviceId 设备ID
 * @returns {Promise<AjaxResult<any>>}
 */
export function getHaiKangPowerStateInfo(deviceId) {
    return request({
        url: `/haikang/device/getHaiKangPowerStateInfo/${deviceId}`,
        method: 'get',
        timeout: 30000
    })
}

/**
 * 获取海康设备报警通道布撤防状态
 * @param {string} deviceId 设备ID
 * @returns {Promise<AjaxResult<any>>}
 */
export function getHaiKangAlarmArmInfo(deviceId) {
    return request({
        url: `/haikang/device/getHaiKangAlarmArmInfo/${deviceId}`,
        method: 'get',
        timeout: 30000
    })
}

/**
 * 获取海康摄像头通道属性信息
 * @param {string} deviceId 设备ID
 * @returns {Promise<AjaxResult<any>>}
 */
export function getHaiKangCameraInfo(deviceId) {
    return request({
        url: `/haikang/device/getHaiKangCameraInfo/${deviceId}`,
        method: 'get',
        timeout: 30000
    })
}

/**
 * 获取海康各通道RTSP播放地址
 * @param {string} deviceId 设备ID
 * @returns {Promise<AjaxResult<any>>}
 */
export function getHaiKangRtspUrlInfo(deviceId) {
    return request({
        url: `/haikang/device/getHaiKangRtspUrlInfo/${deviceId}`,
        method: 'get',
        timeout: 30000
    })
}

/**
 * 获取海康设备系统全局参数
 * @param {string} deviceId 设备ID
 * @returns {Promise<AjaxResult<any>>}
 */
export function getHaiKangSystemParam(deviceId) {
    return request({
        url: `/haikang/device/getHaiKangSystemParam/${deviceId}`,
        method: 'get',
        timeout: 30000
    })
}

/**
 * 获取指定通道指定码流的视频编码参数
 * @param {string} deviceId 设备ID
 * @param {number} channelId 通道ID
 * @param {number} streamType 码流类型
 * @returns {Promise<AjaxResult<any>>}
 */
export function getHaiKangVideoParam(deviceId, channelId, streamType) {
    return request({
        url: `/haikang/device/getHaiKangVideoParam/${deviceId}/${channelId}`,
        method: 'get',
        params: { streamType },
        timeout: 30000
    })
}

/**
 * 获取海康设备系统时间
 * @param {string} deviceId 设备ID
 * @returns {Promise<AjaxResult<any>>}
 */
export function getHaiKangDevTime(deviceId) {
    return request({
        url: `/haikang/device/getHaiKangDevTime/${deviceId}`,
        method: 'get',
        timeout: 30000
    })
}

/**
 * 设置海康设备系统时间
 * @param {string} deviceId 设备ID
 * @param {string} time 时间 格式：yyyy-MM-dd HH:mm:ss
 * @returns {Promise<AjaxResult<any>>}
 */
export function setHaiKangDevTime(deviceId, time) {
    return request({
        url: `/haikang/device/setHaiKangDevTime/${deviceId}`,
        method: 'get',
        params: { time },
        timeout: 30000
    })
}

/**
 * 远程重启海康设备
 * @param {string} deviceId 设备ID
 * @returns {Promise<AjaxResult<any>>}
 */
export function rebootHaiKangDevice(deviceId) {
    return request({
        url: `/haikang/device/rebootHaiKangDevice/${deviceId}`,
        method: 'get',
        timeout: 30000
    })
}