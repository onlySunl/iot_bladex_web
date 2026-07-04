import request from '@/axios'

/**
 * @typedef {import("@/types/api").SnapshotQueryParams} SnapshotQueryParams
 * @typedef {import("@/types/api").QsDeviceSnapshot} QsDeviceSnapshot
 * @typedef {import("@/types/common").AjaxResult} AjaxResult
 * @typedef {import("@/types/common").TableDataInfo} TableDataInfo
 */

/**
 * 查询设备抓图分页列表
 * @param {SnapshotQueryParams} query 分页查询条件
 * @returns {Promise<TableDataInfo<QsDeviceSnapshot[]>>}
 */
export function listSnapshot(query) {
    return request({
        url: '/qs/snapshot/list',
        method: 'get',
        params: query
    })
}

/**
 * 查询设备抓图详情
 * @param {number} id 抓拍记录主键ID
 * @returns {Promise<AjaxResult<QsDeviceSnapshot>>}
 */
export function getSnapshot(id) {
    return request({
        url: `/qs/snapshot/${id}`,
        method: 'get'
    })
}

/**
 * 删除设备抓图记录（支持单个ID、批量ID数组）
 * @param {number | number[]} id 抓拍记录ID或ID数组
 * @returns {Promise<AjaxResult>}
 */
export function delSnapshot(id) {
    return request({
        url: `/qs/snapshot/${id}`,
        method: 'delete'
    })
}

/**
 * 导出设备抓图记录
 * @param {SnapshotQueryParams} query 筛选条件
 * @returns {Promise<Blob>}
 */
export function exportSnapshot(query) {
    return request({
        url: '/qs/snapshot/export',
        method: 'get',
        params: query
    })
}

/**
 * 从播放流中抓拍图片并保存
 * @param {Object} data 抓拍参数
 * @param {number} data.deviceId 设备主键ID
 * @param {string} data.app 流媒体应用名
 * @param {string} data.stream 流ID
 * @param {string} data.snapshotType 抓拍类型
 * @returns {Promise<AjaxResult>}
 */
export function captureFromStream(data) {
    return request({
        url: '/qs/snapshot/captureFromStream',
        method: 'post',
        params: data
    })
}