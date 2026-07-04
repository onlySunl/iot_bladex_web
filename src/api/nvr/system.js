import request from '@/axios'

/**
 * @typedef {import("@/types/common").AjaxResult} AjaxResult
 */

/**
 * 获取系统基础信息
 * @returns {Promise<AjaxResult>}
 */
export function getSystemInfo() {
    return request({
        url: '/qs/server/system/info',
        method: 'get'
    })
}

/**
 * 获取设备统计数据
 * @returns {Promise<AjaxResult>}
 */
export function getDeviceStatistics() {
    return request({
        url: '/qs/server/system/deviceStatist',
        method: 'get'
    })
}