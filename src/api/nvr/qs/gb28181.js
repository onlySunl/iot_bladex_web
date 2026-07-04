import request from '@/axios'

/**
 * @typedef {import("@/types/api/qs/gb28181").Gb28181Device} Gb28181Device
 * @typedef {import("@/types/api/qs/gb28181").Gb28181Channel} Gb28181Channel
 * @typedef {import("@/types/common").AjaxResult} AjaxResult
 */

/**
 * 获取所有国标设备
 * @returns {Promise<AjaxResult<Gb28181Device[]>>}
 */
export function getAllDevices() {
    return request({
        url: '/gb28181/device/getAllDevices',
        method: 'get'
    })
}

/**
 * 根据国标设备编号获取所有通道
 * @param {string} gbDeviceId 设备国标编号
 * @returns {Promise<AjaxResult<Gb28181Channel[]>>}
 */
export function getChannelsByDeviceId(gbDeviceId) {
    return request({
        url: `/gb28181/device/getChannelsByDeviceId/${gbDeviceId}`,
        method: 'get'
    })
}

/**
 * 查询设备录像列表
 * @param {string} deviceId 设备国标ID
 * @param {string} channelId 通道国标ID
 * @param {string} startTime 开始时间
 * @param {string} endTime 结束时间
 * @returns {Promise<AjaxResult<any>>}
 */
export function queryDeviceRecord(deviceId, channelId, startTime, endTime) {
    return request({
        url: `/gb28181/device/queryRecord/${deviceId}/${channelId}`,
        method: 'get',
        params: {
            startTime,
            endTime
        },
        timeout: 30000
    })
}

/**
 * 刷新设备状态与通道目录
 * @param {string} gbDeviceId 国标设备ID
 * @returns {Promise<AjaxResult>}
 */
export function refreshDevice(gbDeviceId) {
    return request({
        url: `/gb28181/device/refresh/${gbDeviceId}`,
        method: 'post'
    })
}

/**
 * 远程重启国标设备
 * @param {string} gbDeviceId 国标设备ID
 * @returns {Promise<AjaxResult>}
 */
export function rebootGb28181Device(gbDeviceId) {
    return request({
        url: `/gb28181/device/reboot/${gbDeviceId}`,
        method: 'post'
    })
}

/**
 * 录像启停控制
 * @param {string} gbDeviceId 国标设备ID
 * @param {string} channelId 通道国标编号
 * @param {number} recordCmd 录像命令：0-停止录像，1-开始录像，2-定时录像
 * @param {number} [streamNumber=0] 码流类型：0主码流、1子码流1...
 * @returns {Promise<AjaxResult>}
 */
export function recordCmd(gbDeviceId, channelId, recordCmd, streamNumber) {
    return request({
        url: '/gb28181/device/record/cmd',
        method: 'post',
        params: {
            gbDeviceId,
            channelId,
            recordCmd,
            streamNumber
        }
    })
}

/**
 * 查询设备在线状态
 * @param {string} deviceId 设备国标ID
 * @returns {Promise<AjaxResult<any>>}
 */
export function queryDeviceStatus(deviceId) {
    return request({
        url: `/gb28181/device/status/${deviceId}`,
        method: 'get'
    })
}

/**
 * 查询设备基础详情信息
 * @param {string} deviceId 设备国标ID
 * @returns {Promise<AjaxResult<Gb28181Device>>}
 */
export function queryDeviceInfo(deviceId) {
    return request({
        url: `/gb28181/device/info/${deviceId}`,
        method: 'get'
    })
}

/**
 * 查询设备指定类型配置
 * @param {string} deviceId 设备国标ID
 * @param {string} configType 配置类型，多类型用/分隔
 * @returns {Promise<AjaxResult<any>>}
 */
export function queryDeviceConfig(deviceId, configType) {
    return request({
        url: `/gb28181/device/config/${deviceId}`,
        method: 'get',
        params: { configType },
        timeout: 30000
    })
}

/**
 * 订阅设备目录（获取通道）
 * @param {number} qsDeviceId 业务库设备主键ID
 * @returns {Promise<AjaxResult>}
 */
export function subscribeCatalog(qsDeviceId) {
    return request({
        url: `/gb28181/device/subscribe/catalog/${qsDeviceId}`,
        method: 'get'
    })
}

/**
 * 取消设备目录订阅
 * @param {number} qsDeviceId 业务库设备主键ID
 * @returns {Promise<AjaxResult>}
 */
export function unsubscribeCatalog(qsDeviceId) {
    return request({
        url: `/gb28181/device/unsubscribe/catalog/${qsDeviceId}`,
        method: 'get'
    })
}

/**
 * 修改设备配置参数
 * @param {string} deviceId 设备国标ID
 * @param {Object} config 设备配置对象
 * @returns {Promise<AjaxResult>}
 */
export function updateDeviceConfig(deviceId, config) {
    return request({
        url: `/gb28181/device/config/${deviceId}`,
        method: 'post',
        data: config,
        timeout: 30000
    })
}

/**
 * 查询摄像头看守位配置
 * @param {string} deviceId 设备国标ID
 * @param {string} [channelId] 通道国标ID（可选）
 * @returns {Promise<AjaxResult<any>>}
 */
export function queryHomePosition(deviceId, channelId) {
    return request({
        url: `/gb28181/device/homePosition/${deviceId}`,
        method: 'get',
        params: { channelId },
        timeout: 30000
    })
}

/**
 * 设置/修改看守位参数
 * @param {string} deviceId 设备国标ID
 * @param {string} [channelId] 通道国标ID（可选）
 * @param {Object} config 看守位配置参数
 * @returns {Promise<AjaxResult>}
 */
export function updateHomePosition(deviceId, channelId, config) {
    return request({
        url: `/gb28181/device/homePosition/${deviceId}`,
        method: 'post',
        params: { channelId },
        data: config,
        timeout: 30000
    })
}

/**
 * 查询所有巡航轨迹组列表
 * @param {string} deviceId 设备国标ID
 * @param {string} [channelId] 通道国标ID（可选）
 * @returns {Promise<AjaxResult<any>>}
 */
export function queryCruiseTrackList(deviceId, channelId) {
    return request({
        url: `/gb28181/device/cruiseTrackList/${deviceId}`,
        method: 'get',
        params: { channelId },
        timeout: 30000
    })
}

/**
 * 查询指定编号巡航轨迹详细预置点
 * @param {string} deviceId 设备国标ID
 * @param {string} [channelId] 通道国标ID（可选）
 * @param {number} number 轨迹组编号
 * @returns {Promise<AjaxResult<any>>}
 */
export function queryCruiseTrack(deviceId, channelId, number) {
    return request({
        url: `/gb28181/device/cruiseTrack/${deviceId}`,
        method: 'get',
        params: { channelId, number },
        timeout: 30000
    })
}

/**
 * PTZ精准位置（水平、垂直、缩放）状态查询
 * @param {string} deviceId 设备国标ID
 * @param {string} [channelId] 通道国标ID（可选）
 * @returns {Promise<AjaxResult<any>>}
 */
export function queryPTZPosition(deviceId, channelId) {
    return request({
        url: `/gb28181/device/ptzPosition/${deviceId}`,
        method: 'get',
        params: { channelId },
        timeout: 30000
    })
}

/**
 * 查询设备SD存储卡状态、容量信息
 * @param {string} deviceId 设备国标ID
 * @param {string} [channelId] 通道国标ID（可选）
 * @returns {Promise<AjaxResult<any>>}
 */
export function querySDCardStatus(deviceId, channelId) {
    return request({
        url: `/gb28181/device/sdCardStatus/${deviceId}`,
        method: 'get',
        params: { channelId },
        timeout: 30000
    })
}

/**
 * 开始执行指定巡航轨迹
 * @param {string} deviceId 设备国标ID
 * @param {string} [channelId] 通道国标ID（可选）
 * @param {number} cruiseId 巡航轨迹组编号
 * @returns {Promise<AjaxResult>}
 */
export function startCruise(deviceId, channelId, cruiseId) {
    return request({
        url: `/gb28181/device/cruise/start/${deviceId}`,
        method: 'get',
        params: { channelId, cruiseId },
        timeout: 30000
    })
}

/**
 * 停止当前巡航任务
 * @param {string} deviceId 设备国标ID
 * @param {string} [channelId] 通道国标ID（可选）
 * @param {number} cruiseId 巡航轨迹组编号
 * @returns {Promise<AjaxResult>}
 */
export function stopCruise(deviceId, channelId, cruiseId) {
    return request({
        url: `/gb28181/device/cruise/stop/${deviceId}`,
        method: 'get',
        params: { channelId, cruiseId },
        timeout: 30000
    })
}

/**
 * 设备报警复位操作
 * @param {string} deviceId 设备国标ID
 * @param {string} [channelId] 通道国标ID（可选）
 * @param {number} [alarmMethod] 报警方式
 * @param {string} [alarmType] 报警类型
 * @returns {Promise<AjaxResult>}
 */
export function alarmResetControl(deviceId, channelId, alarmMethod, alarmType) {
    return request({
        url: `/gb28181/device/alarmReset/${deviceId}`,
        method: 'post',
        params: { channelId, alarmMethod, alarmType },
        timeout: 30000
    })
}

/**
 * 下发强制I帧指令
 * @param {string} deviceId 设备国标ID
 * @param {string} [channelId] 通道国标ID（可选）
 * @returns {Promise<AjaxResult>}
 */
export function iFrameControl(deviceId, channelId) {
    return request({
        url: `/gb28181/device/iFrame/${deviceId}`,
        method: 'post',
        params: { channelId },
        timeout: 30000
    })
}

/**
 * 看守位启用/停用控制
 * @param {string} deviceId 设备国标ID
 * @param {string} [channelId] 通道国标ID（可选）
 * @param {Object} deviceConfig 看守位控制参数
 * @returns {Promise<AjaxResult>}
 */
export function homePositionControl(deviceId, channelId, deviceConfig) {
    return request({
        url: `/gb28181/device/homePosition/control/${deviceId}`,
        method: 'post',
        params: { channelId },
        data: deviceConfig,
        timeout: 30000
    })
}

/**
 * PTZ精准定位控制
 * @param {string} deviceId 设备国标ID
 * @param {string} [channelId] 通道国标ID（可选）
 * @param {Object} ptzPreciseCtrl PTZ精准位置参数
 * @returns {Promise<AjaxResult>}
 */
export function ptzPreciseControl(deviceId, channelId, ptzPreciseCtrl) {
    return request({
        url: `/gb28181/device/ptzPrecise/${deviceId}`,
        method: 'post',
        params: { channelId },
        data: ptzPreciseCtrl,
        timeout: 30000
    })
}

/**
 * 设备远程固件升级
 * @param {string} deviceId 设备国标ID
 * @param {string} [channelId] 通道国标ID（可选）
 * @param {string} firmware 目标固件版本
 * @param {string} fileURL 升级文件下载地址
 * @param {string} manufacturer 设备厂商编码
 * @param {string} sessionID 升级会话标识
 * @returns {Promise<AjaxResult>}
 */
export function deviceUpgradeControl(deviceId, channelId, firmware, fileURL, manufacturer, sessionID) {
    return request({
        url: `/gb28181/device/deviceUpgrade/${deviceId}`,
        method: 'post',
        params: { channelId, firmware, fileURL, manufacturer, sessionID },
        timeout: 30000
    })
}

/**
 * 格式化指定SD存储卡
 * @param {string} deviceId 设备国标ID
 * @param {string} [channelId] 通道国标ID（可选）
 * @param {number} sdCardId 存储卡编号，0代表全部
 * @returns {Promise<AjaxResult>}
 */
export function formatSDCardControl(deviceId, channelId, sdCardId) {
    return request({
        url: `/gb28181/device/formatSDCard/${deviceId}`,
        method: 'post',
        params: { channelId, sdCardId },
        timeout: 30000
    })
}

/**
 * 球机目标跟踪控制（自动/手动/停止）
 * @param {string} deviceId 球机通道国标编号
 * @param {string} [channelId] 球机通道ID（可选）
 * @param {string} targetTrack 跟踪模式 Auto/Manual/Stop
 * @param {string} [deviceId2] 全景相机通道国标ID（可选）
 * @param {Object} [targetArea] 手动跟踪目标区域坐标
 * @returns {Promise<AjaxResult>}
 */
export function targetTrackControl(deviceId, channelId, targetTrack, deviceId2, targetArea) {
    return request({
        url: `/gb28181/device/targetTrack/${deviceId}`,
        method: 'post',
        params: { channelId, targetTrack, deviceId2 },
        data: targetArea,
        timeout: 30000
    })
}