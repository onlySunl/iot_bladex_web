// 查询视频监控设备列表
import request from "@/router/axios";

/**
 * 获取系统信息
 *
 * @return
 */
export function getSystemInfo() {
    return request({
        url: '/api/qs/server/system/info',
        method: 'get',
    })
}

/**
 * 获取设备统计信息
 *
 * @return
 */
export function getDeviceStatistics() {
    return request({
        url: '/api/qs/server/system/deviceStatist',
        method: 'get',
    })
}