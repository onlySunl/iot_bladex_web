import request from '@/axios'

/**
 * @typedef {import("@/types/api/qs/haikangIsup").HaikangIsupDevice} HaikangIsupDevice
 * @typedef {import("@/types/api/qs/haikangIsup").HaikangIsupRecordDownloadRequest} HaikangIsupRecordDownloadRequest
 * @typedef {import("@/types/api/qs/haikangIsup").HaiKangIsupUpgradeRequest} HaiKangIsupUpgradeRequest
 * @typedef {import("@/types/common").AjaxResult} AjaxResult
 */

/**
 * 查询海康isup设备列表
 * @returns {Promise<AjaxResult<HaikangIsupDevice[]>>}
 */
export function listHaiKangIsupDevice() {
    return request({
        url: '/haikangIsup/device/list',
        method: 'get'
    })
}

/**
 * 查询海康ISUP设备录像列表
 * @param {string} deviceId 设备ID
 * @param {number} channelId 通道ID
 * @param {string} startTime 开始时间
 * @param {string} endTime 结束时间
 * @returns {Promise<AjaxResult<any>>}
 */
export function queryHaiKangIsupRecord(deviceId, channelId, startTime, endTime) {
    return request({
        url: `/haikangIsup/device/getRecMonth/${deviceId}/${channelId}`,
        method: 'get',
        params: {
            startTime,
            endTime
        },
        timeout: 30000
    })
}

/**
 * 重启海康ISUP设备
 * @param {string} deviceId 设备ID
 * @returns {Promise<AjaxResult>}
 */
export function rebootHaiKangIsupDevice(deviceId) {
    return request({
        url: `/haikangIsup/device/rebootHaiKangDevice/${deviceId}`,
        method: 'get'
    })
}

/**
 * 获取海康ISUP设备系统时间
 * @param {string} deviceId 设备ID
 * @returns {Promise<AjaxResult<any>>}
 */
export function getHaiKangIsupDevTime(deviceId) {
    return request({
        url: `/haikangIsup/device/getHaiKangDevTime/${deviceId}`,
        method: 'get'
    })
}

/**
 * 设置海康ISUP设备系统时间
 * @param {string} deviceId 设备ID
 * @param {string} time 时间，格式 yyyy-MM-dd HH:mm:ss
 * @returns {Promise<AjaxResult>}
 */
export function setHaiKangIsupDevTime(deviceId, time) {
    return request({
        url: `/haikangIsup/device/setHaiKangDevTime/${deviceId}`,
        method: 'get',
        params: { time }
    })
}

/**
 * 海康ISUP设备实时抓图并保存至服务端
 * @param {string} deviceId 设备ID
 * @param {number} channelId 通道ID
 * @param {string} snapshotType 抓图类型
 * @returns {Promise<AjaxResult<any>>}
 */
export function captureHaiKangIsupAndSave(deviceId, channelId, snapshotType) {
    return request({
        url: `/haikangIsup/device/captureAndSave/${deviceId}/${channelId}`,
        method: 'post',
        params: { snapshotType }
    })
}

/**
 * 海康ISUP录像直接浏览器下载
 * @param {HaikangIsupRecordDownloadRequest} data 录像下载请求参数
 * @returns {Promise<Blob>}
 */
export function downloadHaikangIsupRecordDirect(data) {
    return request({
        url: '/haikangIsup/device/downloadRecordDirect',
        method: 'post',
        data,
        responseType: 'blob',
        timeout: 300000
    })
}

/**
 * 获取海康ISUP设备详细信息
 * @param {string} deviceId 设备ID
 * @returns {Promise<AjaxResult<any>>}
 */
export function getHaiKangIsupDeviceInfo(deviceId) {
    return request({
        url: `/haikangIsup/device/getHaiKangIsupDeviceInfo/${deviceId}`,
        method: 'get'
    })
}

/**
 * 获取海康ISUP设备存储硬盘分区信息
 * @param {string} deviceId 设备ID
 * @returns {Promise<AjaxResult<any>>}
 */
export function getHaiKangIsupStorageInfo(deviceId) {
    return request({
        url: `/haikangIsup/device/getHaiKangIsupStorageInfo/${deviceId}`,
        method: 'get'
    })
}

/**
 * 获取海康ISUP设备SD卡存储信息
 * @param {string} deviceId 设备ID
 * @returns {Promise<AjaxResult<any>>}
 */
export function getHaiKangIsupSDCardInfo(deviceId) {
    return request({
        url: `/haikangIsup/device/getHaiKangIsupSDCardInfo/${deviceId}`,
        method: 'get'
    })
}

/**
 * 获取海康ISUP各通道实时码率信息
 * @param {string} deviceId 设备ID
 * @returns {Promise<AjaxResult<any>>}
 */
export function getHaiKangIsupBitrateInfo(deviceId) {
    return request({
        url: `/haikangIsup/device/getHaiKangIsupBitrateInfo/${deviceId}`,
        method: 'get'
    })
}

/**
 * 获取海康ISUP设备网卡网络参数状态
 * @param {string} deviceId 设备ID
 * @returns {Promise<AjaxResult<any>>}
 */
export function getHaiKangIsupNetworkStatusInfo(deviceId) {
    return request({
        url: `/haikangIsup/device/getHaiKangIsupNetworkStatusInfo/${deviceId}`,
        method: 'get'
    })
}

/**
 * 获取海康ISUP软硬件固件版本信息
 * @param {string} deviceId 设备ID
 * @returns {Promise<AjaxResult<any>>}
 */
export function getHaiKangIsupSoftwareVersionInfo(deviceId) {
    return request({
        url: `/haikangIsup/device/getHaiKangIsupSoftwareVersionInfo/${deviceId}`,
        method: 'get'
    })
}

/**
 * 获取海康ISUP设备电源运行状态
 * @param {string} deviceId 设备ID
 * @returns {Promise<AjaxResult<any>>}
 */
export function getHaiKangIsupPowerStateInfo(deviceId) {
    return request({
        url: `/haikangIsup/device/getHaiKangIsupPowerStateInfo/${deviceId}`,
        method: 'get'
    })
}

/**
 * 获取海康ISUP接入摄像头通道详情
 * @param {string} deviceId 设备ID
 * @returns {Promise<AjaxResult<any>>}
 */
export function getHaiKangIsupCameraInfo(deviceId) {
    return request({
        url: `/haikangIsup/device/getHaiKangIsupCameraInfo/${deviceId}`,
        method: 'get'
    })
}

/**
 * 获取海康ISUP设备系统全局参数
 * @param {string} deviceId 设备ID
 * @returns {Promise<AjaxResult<any>>}
 */
export function getHaiKangIsupSystemParam(deviceId) {
    return request({
        url: `/haikangIsup/device/getHaiKangIsupSystemParam/${deviceId}`,
        method: 'get'
    })
}

/**
 * 获取指定码流类型视频编码参数
 * @param {string} deviceId 设备ID
 * @param {number} streamType 码流类型
 * @returns {Promise<AjaxResult<any>>}
 */
export function getHaiKangIsupVideoParam(deviceId, streamType) {
    return request({
        url: `/haikangIsup/device/getHaiKangIsupVideoParam/${deviceId}`,
        method: 'get',
        params: { streamType }
    })
}

/**
 * 获取海康ISUP设备系统资源运行状态
 * @param {string} deviceId 设备ID
 * @returns {Promise<AjaxResult<any>>}
 */
export function getHaiKangIsupSystemStatus(deviceId) {
    return request({
        url: `/haikangIsup/device/getHaiKangIsupSystemStatus/${deviceId}`,
        method: 'get'
    })
}

/**
 * 获取XML格式设备能力与详情信息
 * @param {string} deviceId 设备ID
 * @returns {Promise<AjaxResult<any>>}
 */
export function getHaiKangIsupDeviceInfoXml(deviceId) {
    return request({
        url: `/haikangIsup/device/getHaiKangIsupDeviceInfoXml/${deviceId}`,
        method: 'get'
    })
}

/**
 * 海康ISUP设备远程固件升级
 * @param {HaiKangIsupUpgradeRequest} data 升级请求参数
 * @returns {Promise<AjaxResult>}
 */
export function upgradeHaiKangIsupDevice(data) {
    return request({
        url: '/haikangIsup/device/upgradeHaiKangIsupDevice',
        method: 'post',
        data
    })
}

/**
 * 获取海康ISUP设备配置参数
 * @param {string} deviceId 设备ID
 * @returns {Promise<AjaxResult<any>>}
 */
export function getHaiKangIsupDeviceConfig(deviceId) {
    return request({
        url: `/haikangIsup/device/getHaiKangIsupDeviceConfig/${deviceId}`,
        method: 'get'
    })
}

/**
 * 修改海康ISUP设备配置参数
 * @param {string} deviceId 设备ID
 * @param {Object} config 设备配置对象
 * @returns {Promise<AjaxResult>}
 */
export function setHaiKangIsupDeviceConfig(deviceId, config) {
    return request({
        url: `/haikangIsup/device/setHaiKangIsupDeviceConfig/${deviceId}`,
        method: 'post',
        data: config
    })
}

/**
 * 获取海康ISUP设备全量版本信息
 * @param {string} deviceId 设备ID
 * @returns {Promise<AjaxResult<any>>}
 */
export function getHaiKangIsupVersionInfo(deviceId) {
    return request({
        url: `/haikangIsup/device/getHaiKangIsupVersionInfo/${deviceId}`,
        method: 'get'
    })
}