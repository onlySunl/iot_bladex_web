import request from '@/axios'

/**
 * @typedef {import("@/types/api/qs/group").QsGroup} QsGroup
 * @typedef {import("@/types/common").AjaxResult} AjaxResult
 */

/**
 * 新增业务分组
 * @param {QsGroup} data 分组表单数据
 * @returns {Promise<AjaxResult>}
 */
export function addGroup(data) {
    return request({
        url: '/qs/group/add',
        method: 'post',
        data
    })
}

/**
 * 修改业务分组
 * @param {QsGroup} data 分组表单数据
 * @returns {Promise<AjaxResult>}
 */
export function updateGroup(data) {
    return request({
        url: '/qs/group/update',
        method: 'post',
        data
    })
}

/**
 * 删除业务分组
 * @param {number} id 分组主键ID
 * @returns {Promise<AjaxResult>}
 */
export function deleteGroup(id) {
    return request({
        url: `/qs/group/delete/${id}`,
        method: 'delete'
    })
}

/**
 * 条件查询业务分组树结构
 * @param {Object} query 筛选查询参数
 * @returns {Promise<AjaxResult<QsGroup[]>>}
 */
export function queryForGroupQuery(query) {
    return request({
        url: '/qs/group/tree/query',
        method: 'get',
        params: query
    })
}

/**
 * 获取业务分组树形节点列表
 * @param {Object} query 筛选查询参数
 * @returns {Promise<AjaxResult<QsGroup[]>>}
 */
export function queryForGroupTree(query) {
    return request({
        url: '/qs/group/tree/list',
        method: 'get',
        params: query
    })
}

/**
 * 查询所有已绑定业务分组的设备列表
 * @returns {Promise<AjaxResult<any[]>>}
 */
export function queryGroupForDevice() {
    return request({
        url: '/qs/group/device/list',
        method: 'get'
    })
}

// ============ 别名函数（兼容导入） ============

/**
 * 查询分组列表（queryForGroupQuery 别名）
 * @param {object} query 查询参数
 * @returns {Promise<any>}
 */
export function listGroup(query) {
    return queryForGroupQuery(query)
}