import request from '@/axios'

/**
 * @typedef {import("@/types/api").CloudRecordQueryParams} CloudRecordQueryParams
 * @typedef {import("@/types/api").ZlmCloudRecord} ZlmCloudRecord
 * @typedef {import("@/types/common").AjaxResult} AjaxResult
 * @typedef {import("@/types/common").TableDataInfo} TableDataInfo
 */

/**
 * 查询云端录像列表（分页）
 * @param {CloudRecordQueryParams} query 分页查询参数
 * @returns {Promise<AjaxResult<TableDataInfo<ZlmCloudRecord>>>}
 */
export function listCloudRecord(query) {
    return request({
        url: '/zlm/cloudRecord/list',
        method: 'get',
        params: query
    })
}

/**
 * 查询云端录像列表（不分页）
 * @param {CloudRecordQueryParams} query 查询参数
 * @returns {Promise<AjaxResult<ZlmCloudRecord[]>>}
 */
export function listAllCloudRecord(query) {
    return request({
        url: '/zlm/cloudRecord/allList',
        method: 'get',
        params: query
    })
}

/**
 * 查询云端录像详细信息
 * @param {number} id 录像主键ID
 * @returns {Promise<AjaxResult<ZlmCloudRecord>>}
 */
export function getCloudRecord(id) {
    return request({
        url: `/zlm/cloudRecord/${id}`,
        method: 'get'
    })
}

/**
 * 删除云端录像（支持单个ID、批量ID数组）
 * @param {number | number[]} id 录像ID或ID数组
 * @returns {Promise<AjaxResult>}
 */
export function delCloudRecord(id) {
    return request({
        url: `/zlm/cloudRecord/${id}`,
        method: 'delete'
    })
}

/**
 * 加载云端录像，生成播放地址
 * @param {number | number[]} id 录像ID或ID数组
 * @returns {Promise<AjaxResult>}
 */
export function loadRecord(id) {
    return request({
        url: `/zlm/cloudRecord/loadRecord/${id}`,
        method: 'get'
    })
}

/**
 * 关闭录像播放流、释放流媒体服务资源
 * @param {number | number[]} id 录像ID或ID数组
 * @returns {Promise<AjaxResult>}
 */
export function closeStreams(id) {
    return request({
        url: `/zlm/cloudRecord/closeStreams/${id}`,
        method: 'get'
    })
}

/**
 * 录像播放进度跳转定位
 * @param {Object} query 播放定位请求参数
 * @returns {Promise<AjaxResult>}
 */
export function seekCloudRecord(query) {
    return request({
        url: '/zlm/cloudRecord/seek',
        method: 'get',
        params: query
    })
}

/**
 * 设置录像播放倍速
 * @param {Object} query 倍速配置参数
 * @returns {Promise<AjaxResult>}
 */
export function setCloudRecordSpeed(query) {
    return request({
        url: '/zlm/cloudRecord/speed',
        method: 'get',
        params: query
    })
}