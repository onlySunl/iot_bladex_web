import request from '@/axios'

/**
 * @typedef {import("@/types/api").RecordPlanParam} RecordPlanParam
 * @typedef {import("@/types/api").DeviceQueryParams} DeviceQueryParams
 * @typedef {import("@/types/api").QsDevice} QsDevice
 */

/**
 * 查询视频监控设备列表
 * @param {DeviceQueryParams} query 查询参数
 * @returns {Promise<any>}
 */
export function listDevice(query) {
    return request({
        url: '/qs/device/list',
        method: 'get',
        params: query
    })
}

/**
 * 根据行政区域获取视频监控设备列表
 * @param {DeviceQueryParams} query 查询参数
 * @returns {Promise<any>}
 */
export function queryListByCivilCode(query) {
    return request({
        url: '/qs/device/queryListByCivilCode',
        method: 'get',
        params: query
    })
}

/**
 * 查询视频监控设备详情
 * @param {number} id 设备主键ID
 * @returns {Promise<any>}
 */
export function getDevice(id) {
    return request({
        url: `/qs/device/${id}`,
        method: 'get'
    })
}

/**
 * 新增视频监控设备
 * @param {QsDevice} data 设备表单数据
 * @returns {Promise<any>}
 */
export function addDevice(data) {
    return request({
        url: '/qs/device',
        method: 'post',
        data
    })
}

/**
 * 修改视频监控设备
 * @param {QsDevice} data 设备表单数据
 * @returns {Promise<any>}
 */
export function updateDevice(data) {
    return request({
        url: '/qs/device',
        method: 'put',
        data
    })
}

/**
 * 删除视频监控设备（支持单个ID / ID数组批量删除）
 * @param {number | number[]} id 单个id或者id数组
 * @returns {Promise<any>}
 */
export function delDevice(id) {
    return request({
        url: `/qs/device/${id}`,
        method: 'delete'
    })
}

/**
 * 修改设备启用/停用状态
 * @param {number} id 设备ID
 * @param {string} status 状态 ENABLE/DEACTIVATE
 * @returns {Promise<any>}
 */
export function changeDeviceStatus(id, status) {
    return request({
        url: '/qs/device/changeStatus',
        method: 'put',
        data: { id, status }
    })
}

/**
 * 截取设备本地MP4视频截图
 * @param {number} id 设备ID
 * @returns {Promise<any>}
 */
export function getVideoSnapshot(id) {
    return request({
        url: `/qs/device/getVideoSnapshot/${id}`,
        method: 'put'
    })
}

/**
 * 查询录制计划绑定的设备列表
 * @param {QsDevice} query 查询条件
 * @returns {Promise<any>}
 */
export function listPlanRecord(query) {
    return request({
        url: '/qs/device/listPlanRecord',
        method: 'get',
        params: query
    })
}

/**
 * 设备绑定录制计划
 * @param {RecordPlanParam} data 绑定参数
 * @returns {Promise<any>}
 */
export function linkRecordPlan(data) {
    return request({
        url: '/qs/device/link',
        method: 'post',
        data
    })
}

/**
 * 行政区划绑定设备
 * @param {object} data 绑定参数
 * @returns {Promise<any>}
 */
export function addDeviceToRegion(data) {
    return request({
        url: '/qs/device/region/add',
        method: 'post',
        data
    })
}

/**
 * 移除行政区划下的设备
 * @param {object} data 移除参数
 * @returns {Promise<any>}
 */
export function deleteDeviceToRegion(data) {
    return request({
        url: '/qs/device/region/delete',
        method: 'post',
        data
    })
}

/**
 * 查询异常行政区划设备列表（有编码无法挂载）
 * @param {object} query 查询参数
 * @returns {Promise<any>}
 */
export function getUnusualCivilCodeList(query) {
    return request({
        url: '/qs/device/civilCode/unusual/list',
        method: 'get',
        params: query
    })
}

/**
 * 清空异常设备行政区划编码
 * @param {object} data 设备id集合
 * @returns {Promise<any>}
 */
export function clearDeviceCivilCode(data) {
    return request({
        url: '/qs/device/civilCode/unusual/clear',
        method: 'post',
        data
    })
}

/**
 * 获取网络编码类型下拉列表
 * @returns {Promise<any>}
 */
export function getNetworkIdentificationTypeList() {
    return request({
        url: '/qs/device/network/identification/list',
        method: 'get'
    })
}

/**
 * 获取设备类型下拉选项
 * @returns {Promise<any>}
 */
export function getDeviceTypeList() {
    return request({
        url: '/qs/device/type/list',
        method: 'get'
    })
}

/**
 * 获取行业编码下拉列表
 * @returns {Promise<any>}
 */
export function getIndustryCodeList() {
    return request({
        url: '/qs/device/industry/list',
        method: 'get'
    })
}

/**
 * 根据父节点ID查询设备列表
 * @param {object} query 查询参数
 * @returns {Promise<any>}
 */
export function queryListByParentId(query) {
    return request({
        url: '/qs/device/parent/list',
        method: 'get',
        params: query
    })
}

/**
 * 业务分组添加设备
 * @param {object} data 分组设备参数
 * @returns {Promise<any>}
 */
export function addDeviceIdToGroup(data) {
    return request({
        url: '/qs/device/group/add',
        method: 'post',
        data
    })
}

/**
 * 业务分组移除设备
 * @param {object} data 设备参数
 * @returns {Promise<any>}
 */
export function deleteDeviceToGroup(data) {
    return request({
        url: '/qs/device/group/delete',
        method: 'post',
        data
    })
}

/**
 * 查询父节点异常设备列表
 * @param {object} query 查询参数
 * @returns {Promise<any>}
 */
export function queryListByParentForUnusual(query) {
    return request({
        url: '/qs/device/parent/unusual/list',
        method: 'get',
        params: query
    })
}

/**
 * 清空异常设备父节点编码
 * @param {object} data 设备id集合
 * @returns {Promise<any>}
 */
export function clearDeviceParent(data) {
    return request({
        url: '/qs/device/parent/unusual/clear',
        method: 'post',
        data
    })
}

/**
 * 开始云台控制
 * @param {number} id 设备ID
 * @param {string} direction 云台方向
 * @param {number} controlSpeed 云台速度
 * @returns {Promise<any>}
 */
export function startPtz(id, direction, controlSpeed) {
    return request({
        url: `/qs/device/startPtz/${id}`,
        method: 'get',
        params: { direction, controlSpeed }
    })
}

/**
 * 停止云台控制
 * @param {number} id 设备ID
 * @param {string} direction 云台方向
 * @param {number} controlSpeed 云台速度
 * @returns {Promise<any>}
 */
export function endPtz(id, direction, controlSpeed) {
    return request({
        url: `/qs/device/endPtz/${id}`,
        method: 'get',
        params: { direction, controlSpeed }
    })
}

/**
 * 获取通道预置点列表
 * @param {number} id 设备ID
 * @param {number} channelId 通道ID
 * @returns {Promise<any>}
 */
export function getPresetList(id, channelId) {
    return request({
        url: `/qs/device/preset/list/${id}`,
        method: 'get',
        params: { channelId }
    })
}

/**
 * 设置预置点
 * @param {number} id 设备ID
 * @param {number} channelId 通道ID
 * @param {number} presetIndex 预置点序号
 * @param {string} presetName 预置点名称
 * @returns {Promise<any>}
 */
export function setPreset(id, channelId, presetIndex, presetName) {
    return request({
        url: `/qs/device/preset/set/${id}`,
        method: 'get',
        params: { channelId, presetIndex, presetName }
    })
}

/**
 * 调用预置点
 * @param {number} id 设备ID
 * @param {number} channelId 通道ID
 * @param {number} presetIndex 预置点序号
 * @param {number} speed 调用速度
 * @returns {Promise<any>}
 */
export function gotoPreset(id, channelId, presetIndex, speed) {
    return request({
        url: `/qs/device/preset/goto/${id}`,
        method: 'get',
        params: { channelId, presetIndex, speed }
    })
}

/**
 * 删除预置点
 * @param {number} id 设备ID
 * @param {number} channelId 通道ID
 * @param {number} presetIndex 预置点序号
 * @returns {Promise<any>}
 */
export function deletePreset(id, channelId, presetIndex) {
    return request({
        url: `/qs/device/preset/delete/${id}`,
        method: 'get',
        params: { channelId, presetIndex }
    })
}

/**
 * 灯光开关控制
 * @param {number} id 设备ID
 * @param {number} channelId 通道ID
 * @param {boolean} isOn true开启 false关闭
 * @returns {Promise<any>}
 */
export function controlLight(id, channelId, isOn) {
    return request({
        url: `/qs/device/light/${id}`,
        method: 'get',
        params: { channelId, isOn }
    })
}

/**
 * 雨刷开关控制
 * @param {number} id 设备ID
 * @param {number} channelId 通道ID
 * @param {boolean} isOn true开启 false关闭
 * @returns {Promise<any>}
 */
export function controlWiper(id, channelId, isOn) {
    return request({
        url: `/qs/device/wiper/${id}`,
        method: 'get',
        params: { channelId, isOn }
    })
}

// ============ 别名函数（兼容 device/index.vue 导入） ============

/**
 * 分页查询设备列表（listDevice 别名）
 * @param {DeviceQueryParams} query 查询参数
 * @returns {Promise<any>}
 */
export function pageQsDevice(query) {
    return listDevice(query)
}

/**
 * 新增设备（addDevice 别名）
 * @param {QsDevice} data 设备数据
 * @returns {Promise<any>}
 */
export function addQsDevice(data) {
    return addDevice(data)
}

/**
 * 修改设备（updateDevice 别名）
 * @param {QsDevice} data 设备数据
 * @returns {Promise<any>}
 */
export function updateQsDevice(data) {
    return updateDevice(data)
}

/**
 * 删除设备（delDevice 别名）
 * @param {number | number[]} id 设备ID
 * @returns {Promise<any>}
 */
export function removeQsDevice(id) {
    return delDevice(id)
}

/**
 * 导出设备列表
 * @param {DeviceQueryParams} query 查询参数
 * @returns {Promise<any>}
 */
export function exportQsDevice(query) {
    return request({
        url: '/qs/device/export',
        method: 'get',
        params: query,
        responseType: 'blob'
    })
}

/**
 * 开启设备视频流
 * @param {number} id 设备ID
 * @returns {Promise<any>}
 */
export function startStream(id) {
    return request({
        url: `/qs/device/stream/start/${id}`,
        method: 'put'
    })
}

/**
 * 关闭设备视频流
 * @param {number} id 设备ID
 * @returns {Promise<any>}
 */
export function stopStream(id) {
    return request({
        url: `/qs/device/stream/stop/${id}`,
        method: 'put'
    })
}

/**
 * 重启设备
 * @param {number} id 设备ID
 * @returns {Promise<any>}
 */
export function rebootDevice(id) {
    return request({
        url: `/qs/device/reboot/${id}`,
        method: 'put'
    })
}
/**
 * 设备绑定录制计划（linkRecordPlan 别名）
 * @param {object} data 绑定参数
 * @returns {Promise<any>}
 */
export function link(data) {
    return linkRecordPlan(data)
}
