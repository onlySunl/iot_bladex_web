import request from '@/axios'

/**
 * 获取系统配置参数
 * @param {string} key 配置键名
 * @returns {Promise<any>}
 */
export function getConfigKey(key) {
    return request({
        url: '/system/config/getConfigKey',
        method: 'get',
        params: { key }
    })
}

/**
 * 获取系统配置列表
 * @param {object} query 查询参数
 * @returns {Promise<any>}
 */
export function listConfig(query) {
    return request({
        url: '/system/config/list',
        method: 'get',
        params: query
    })
}

/**
 * 获取系统配置详情
 * @param {number} id 配置ID
 * @returns {Promise<any>}
 */
export function getConfig(id) {
    return request({
        url: `/system/config/${id}`,
        method: 'get'
    })
}

/**
 * 新增系统配置
 * @param {object} data 配置数据
 * @returns {Promise<any>}
 */
export function addConfig(data) {
    return request({
        url: '/system/config',
        method: 'post',
        data
    })
}

/**
 * 修改系统配置
 * @param {object} data 配置数据
 * @returns {Promise<any>}
 */
export function updateConfig(data) {
    return request({
        url: '/system/config',
        method: 'put',
        data
    })
}

/**
 * 删除系统配置
 * @param {number | number[]} id 配置ID
 * @returns {Promise<any>}
 */
export function delConfig(id) {
    return request({
        url: `/system/config/${id}`,
        method: 'delete'
    })
}
