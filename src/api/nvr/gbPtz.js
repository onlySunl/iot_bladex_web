/**
 * GB28181 PTZ 相关 API
 * 封装看守位、巡航、精准定位等功能
 */
import request from '@/axios'

/**
 * 查询看守位配置
 * @param {string} deviceId 设备ID
 * @returns {Promise}
 */
export function queryHomePresetApi(deviceId) {
    return request({
        url: `/gb28181/device/homePosition/${deviceId}`,
        method: 'get',
        timeout: 30000
    })
}

/**
 * 设置看守位
 * @param {Object} data 看守位配置 { deviceId, presetId, dwellTime }
 * @returns {Promise}
 */
export function setHomePresetApi(data) {
    return request({
        url: `/gb28181/device/homePosition/${data.deviceId}`,
        method: 'post',
        data: {
            presetId: data.presetId,
            dwellTime: data.dwellTime
        },
        timeout: 30000
    })
}

/**
 * 调用看守位
 * @param {Object} data 看守位配置 { deviceId, presetId }
 * @returns {Promise}
 */
export function callHomePresetApi(data) {
    return request({
        url: `/gb28181/device/homePosition/${data.deviceId}/control`,
        method: 'post',
        data: {
            presetId: data.presetId
        },
        timeout: 30000
    })
}

/**
 * 获取巡航列表
 * @param {string} deviceId 设备ID
 * @returns {Promise}
 */
export function getCruiseListApi(deviceId) {
    return request({
        url: `/gb28181/device/cruiseTrackList/${deviceId}`,
        method: 'get',
        timeout: 30000
    })
}

/**
 * 获取巡航详情
 * @param {Object} data 巡航配置 { deviceId, trackId }
 * @returns {Promise}
 */
export function getCruiseDetailApi(data) {
    return request({
        url: `/gb28181/device/cruiseTrack/${data.deviceId}`,
        method: 'get',
        params: { number: data.trackId },
        timeout: 30000
    })
}

/**
 * 开始巡航
 * @param {Object} data 巡航配置 { deviceId, trackId }
 * @returns {Promise}
 */
export function startCruiseApi(data) {
    return request({
        url: `/gb28181/device/cruise/${data.deviceId}/start`,
        method: 'post',
        data: {
            cruiseId: data.trackId
        },
        timeout: 30000
    })
}

/**
 * 停止巡航
 * @param {string} deviceId 设备ID
 * @returns {Promise}
 */
export function stopCruiseApi(deviceId) {
    return request({
        url: `/gb28181/device/cruise/${deviceId}/stop`,
        method: 'post',
        timeout: 30000
    })
}

/**
 * 查询PTZ位置
 * @param {string} deviceId 设备ID
 * @returns {Promise}
 */
export function queryPtzPosApi(deviceId) {
    return request({
        url: `/gb28181/device/ptzPosition/${deviceId}`,
        method: 'get',
        timeout: 30000
    })
}

/**
 * 设置PTZ位置
 * @param {Object} data PTZ位置配置 { deviceId, pan, tilt, zoom }
 * @returns {Promise}
 */
export function setPtzPosApi(data) {
    return request({
        url: `/gb28181/device/ptzPosition/${data.deviceId}`,
        method: 'post',
        data: {
            pan: data.pan,
            tilt: data.tilt,
            zoom: data.zoom
        },
        timeout: 30000
    })
}
