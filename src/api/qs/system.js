import request from '@/router/axios'

// 获取系统信息
export const getSystemInfo = () => {
  return request({
    url: '/api/qs/server/system/info',
    method: 'get'
  })
}

// 获取设备统计信息
export const getDeviceStatistics = () => {
  return request({
    url: '/api/qs/server/system/deviceStatist',
    method: 'get'
  })
}
