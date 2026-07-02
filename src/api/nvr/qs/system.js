// 查询视频监控设备列表
import request from '@/axios';
import {AjaxResult} from "@/types/common";

/**
 * 获取系统信息
 *
 * @return
 */
export const getSystemInfo = () => {
    return request({
        url: '/qs/server/system/info',
        method: 'get',
    })
}

/**
 * 获取设备统计信息
 *
 * @return
 */
export const getDeviceStatistics = () => {
    return request({
        url: '/qs/server/system/deviceStatist',
        method: 'get',
    })
}