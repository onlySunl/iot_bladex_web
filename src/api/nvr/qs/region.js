import request from '@/axios'

/**
 * @typedef {import("@/types").AjaxResult} AjaxResult
 * @typedef {import("@/types/api").QsRegion} QsRegion
 */

/**
 * 新增区域
 * @param {QsRegion} data 区域表单数据
 * @returns {Promise<AjaxResult>}
 */
export function addRegion(data) {
    return request({
        url: '/qs/region/add',
        method: 'post',
        data
    })
}

/**
 * 修改区域
 * @param {QsRegion} data 区域表单数据
 * @returns {Promise<AjaxResult>}
 */
export function updateRegion(data) {
    return request({
        url: '/qs/region/update',
        method: 'post',
        data
    })
}

/**
 * 删除区域
 * @param {number} id 区域主键ID
 * @returns {Promise<AjaxResult>}
 */
export function deleteRegion(id) {
    return request({
        url: `/qs/region/delete/${id}`,
        method: 'delete'
    })
}

/**
 * 获取区域树形节点列表
 * @param {Object} query 筛选查询参数
 * @returns {Promise<AjaxResult>}
 */
export function queryForRegionTree(query) {
    return request({
        url: '/qs/region/tree/list',
        method: 'get',
        params: query
    })
}

/**
 * 查询所有已绑定区域的设备列表
 * @returns {Promise<AjaxResult>}
 */
export function queryRegionForDevice() {
    return request({
        url: '/qs/region/device/list',
        method: 'get'
    })
}

/**
 * 条件查询区域树结构
 * @param {Object} query 筛选查询参数
 * @returns {Promise<AjaxResult<QsRegion[]>>}
 */
export function queryForRegionQuery(query) {
    return request({
        url: '/qs/region/tree/query',
        method: 'get',
        params: query
    })
}

/**
 * 根据父级区域ID获取所有子级行政区划
 * @param {string} parent 父区域国标编号
 * @returns {Promise<AjaxResult<QsRegion[]>>}
 */
export function getAllChild(parent) {
    return request({
        url: '/qs/region/base/child/list',
        method: 'get',
        params: { parent }
    })
}