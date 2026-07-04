import request from '@/axios'

/**
 * @typedef {import("@/types/api").AlarmQueryParams} AlarmQueryParams
 * @typedef {import("@/types/api").QsDeviceAlarm} QsDeviceAlarm
 * @typedef {import("@/types/common").AjaxResult} AjaxResult
 * @typedef {import("@/types/common").TableDataInfo} TableDataInfo
 */

/**
 * 分页查询设备告警列表
 * @param {AlarmQueryParams} query 告警查询条件
 * @returns {Promise<AjaxResult<TableDataInfo<QsDeviceAlarm>>>}
 */
export function listAlarm(query) {
    return request({
        url: '/qs/alarm/list',
        method: 'get',
        params: query
    })
}

/**
 * 获取设备告警详情
 * @param {number} id 告警主键ID
 * @returns {Promise<AjaxResult<QsDeviceAlarm>>}
 */
export function getAlarm(id) {
    return request({
        url: `/qs/alarm/${id}`,
        method: 'get'
    })
}

/**
 * 处理/编辑设备告警信息
 * @param {QsDeviceAlarm} data 告警表单数据
 * @returns {Promise<AjaxResult>}
 */
export function updateAlarm(data) {
    return request({
        url: '/qs/alarm',
        method: 'put',
        data
    })
}

/**
 * 删除告警记录（支持单个ID、ID数组批量删除）
 * @param {number | number[]} id 告警ID或ID数组
 * @returns {Promise<AjaxResult>}
 */
export function delAlarm(id) {
    return request({
        url: `/qs/alarm/${id}`,
        method: 'delete'
    })
}

/**
 * 导出设备告警Excel
 * @param {AlarmQueryParams} query 筛选查询参数
 * @returns {Promise<Blob>}
 */
export function exportAlarm(query) {
    return request({
        url: '/qs/alarm/export',
        method: 'get',
        params: query,
        responseType: 'blob'
    })
}

/**
 * 批量处理设备告警
 * @param {QsDeviceAlarm} data 批量处理参数（一般携带选中告警ID数组、处理结果、处理人等）
 * @returns {Promise<AjaxResult>}
 */
export function batchHandleAlarm(data) {
    console.log('=== 调用批量处理告警 API ===')
    console.log('发送的数据:', data)
    return request({
        url: '/qs/alarm/batchHandle',
        method: 'put',
        data
    })
}