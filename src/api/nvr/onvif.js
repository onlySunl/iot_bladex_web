import request from '@/axios'

/**
 * @typedef {import("@/types/api").OnvifDevice} OnvifDevice
 * @typedef {import("@/types/api").WSDiscoveryDevice} WSDiscoveryDevice
 * @typedef {import("@/types/api").WSOnvifDevice} WSOnvifDevice
 * @typedef {import("@/types/common").AjaxResult} AjaxResult
 */

/**
 * 获取ONVIF设备列表
 * @returns {Promise<AjaxResult<OnvifDevice[]>>}
 */
export function getOnvifDeviceList() {
    return request({
        url: '/onvif/device/getOnvifDeviceList',
        method: 'get',
        timeout: 20000
    })
}

/**
 * ONVIF设备账号密码登录校验
 * @param {WSOnvifDevice} data 设备登录信息
 * @returns {Promise<AjaxResult>}
 */
export function onvifLogin(data) {
    return request({
        url: '/onvif/device/login',
        method: 'post',
        data,
        timeout: 20000
    })
}

/**
 * 查询ONVIF设备录像文件列表
 * @param {string} deviceIp 设备IP地址
 * @param {string} username 登录用户名
 * @param {string} password 登录密码
 * @param {string} startTime 开始时间
 * @param {string} endTime 结束时间
 * @returns {Promise<AjaxResult<any>>}
 */
export function queryOnvifRecord(deviceIp, username, password, startTime, endTime) {
    return request({
        url: '/onvif/device/queryRecord',
        method: 'get',
        params: {
            deviceIp,
            username,
            password,
            startTime,
            endTime
        },
        timeout: 30000
    })
}

/**
 * ONVIF设备远程重启
 * @param {string} deviceId 设备主键ID
 * @returns {Promise<AjaxResult>}
 */
export function restartOnvifDevice(deviceId) {
    return request({
        url: `/onvif/device/rebootOnvifDevice/${deviceId}`,
        method: 'get',
        timeout: 30000
    })
}

/**
 * ONVIF设备时间同步校时
 * @param {string} deviceId 设备主键ID
 * @param {string} [dateTime] 自定义校准时间，不传默认使用服务器时间
 * @returns {Promise<AjaxResult>}
 */
export function syncOnvifDeviceTime(deviceId, dateTime) {
    return request({
        url: `/onvif/device/syncOnvifDeviceTime/${deviceId}`,
        method: 'get',
        params: dateTime ? { dateTime } : undefined,
        timeout: 30000
    })
}

/**
 * 获取ONVIF设备当前系统时间
 * @param {string} deviceId 设备主键ID
 * @returns {Promise<AjaxResult<any>>}
 */
export function getOnvifDeviceTime(deviceId) {
    return request({
        url: `/onvif/device/getOnvifDeviceTime/${deviceId}`,
        method: 'get',
        timeout: 30000
    })
}

/**
 * 获取ONVIF设备基础详细信息
 * @param {string} deviceId 设备主键ID
 * @returns {Promise<AjaxResult<OnvifDevice>>}
 */
export function getOnvifDeviceInfo(deviceId) {
    return request({
        url: `/onvif/device/getOnvifDeviceInfo/${deviceId}`,
        method: 'get',
        timeout: 30000
    })
}

/**
 * ONVIF设备通道实时抓图并保存至服务端
 * @param {string} deviceId 设备主键ID
 * @param {number} channelId 通道ID
 * @param {string} [snapshotType='manual'] 抓图类型
 * @returns {Promise<AjaxResult<any>>}
 */
export function captureOnvifAndSave(deviceId, channelId, snapshotType = 'manual') {
    return request({
        url: `/onvif/device/captureAndSave/${deviceId}/${channelId}`,
        method: 'post',
        params: { snapshotType },
        timeout: 30000
    })
}

/**
 * 获取ONVIF设备存储配置信息
 * @param {string} deviceId 设备主键ID
 * @returns {Promise<AjaxResult<any>>}
 */
export function getOnvifStorageConfigurations(deviceId) {
    return request({
        url: `/onvif/device/getStorageConfigurations/${deviceId}`,
        method: 'get',
        timeout: 30000
    })
}

/**
 * 获取ONVIF设备存储能力描述
 * @param {string} deviceId 设备主键ID
 * @returns {Promise<AjaxResult<any>>}
 */
export function getOnvifStorageCapabilities(deviceId) {
    return request({
        url: `/onvif/device/getStorageCapabilities/${deviceId}`,
        method: 'get',
        timeout: 30000
    })
}

/**
 * 获取ONVIF设备硬盘存储运行状态
 * @param {string} deviceId 设备主键ID
 * @returns {Promise<AjaxResult<any>>}
 */
export function getOnvifStorageState(deviceId) {
    return request({
        url: `/onvif/device/getStorageState/${deviceId}`,
        method: 'get',
        timeout: 30000
    })
}

/**
 * 获取ONVIF设备网卡网络接口配置
 * @param {string} deviceId 设备主键ID
 * @returns {Promise<AjaxResult<any>>}
 */
export function getOnvifNetworkInterfaces(deviceId) {
    return request({
        url: `/onvif/device/getNetworkInterfaces/${deviceId}`,
        method: 'get',
        timeout: 30000
    })
}

/**
 * 获取ONVIF设备网络协议参数配置
 * @param {string} deviceId 设备主键ID
 * @returns {Promise<AjaxResult<any>>}
 */
export function getOnvifNetworkProtocols(deviceId) {
    return request({
        url: `/onvif/device/getNetworkProtocols/${deviceId}`,
        method: 'get',
        timeout: 30000
    })
}

/**
 * 获取ONVIF设备视频源配置参数
 * @param {string} deviceId 设备主键ID
 * @returns {Promise<AjaxResult<any>>}
 */
export function getOnvifVideoSourceConfigs(deviceId) {
    return request({
        url: `/onvif/device/getVideoSourceConfigs/${deviceId}`,
        method: 'get',
        timeout: 30000
    })
}

/**
 * 获取ONVIF设备视频编码配置参数
 * @param {string} deviceId 设备主键ID
 * @returns {Promise<AjaxResult<any>>}
 */
export function getOnvifVideoEncoderConfigs(deviceId) {
    return request({
        url: `/onvif/device/getVideoEncoderConfigs/${deviceId}`,
        method: 'get',
        timeout: 30000
    })
}

/**
 * 获取ONVIF设备音频源配置参数
 * @param {string} deviceId 设备主键ID
 * @returns {Promise<AjaxResult<any>>}
 */
export function getOnvifAudioSourceConfigs(deviceId) {
    return request({
        url: `/onvif/device/getAudioSourceConfigs/${deviceId}`,
        method: 'get',
        timeout: 30000
    })
}

/**
 * 获取ONVIF设备音频编码配置参数
 * @param {string} deviceId 设备主键ID
 * @returns {Promise<AjaxResult<any>>}
 */
export function getOnvifAudioEncoderConfigs(deviceId) {
    return request({
        url: `/onvif/device/getAudioEncoderConfigs/${deviceId}`,
        method: 'get',
        timeout: 30000
    })
}

/**
 * 获取ONVIF设备视频输出配置信息
 * @param {string} deviceId 设备主键ID
 * @returns {Promise<AjaxResult<any>>}
 */
export function getOnvifVideoOutputConfigs(deviceId) {
    return request({
        url: `/onvif/device/getVideoOutputConfigs/${deviceId}`,
        method: 'get',
        timeout: 30000
    })
}