import request from '@/router/axios'

/**
 * 获取系统信息
 */
export function getSystemInfo() {
  return request({
    url: '/qs/server/system/info',
    method: 'get'
  })
}

/**
 * 获取设备统计信息
 */
export function getDeviceStatistics() {
  return request({
    url: '/qs/server/system/deviceStatist',
    method: 'get'
  })
}
