import request from '@/router/axios'

// 查询大华设备列表
export const listDaHuaDevice = () => {
  return request({
    url: '/api/dahua/device/list',
    method: 'get'
  })
}

// 查询大华设备录像列表
export const queryDaHuaRecord = (id, channelId, startTime, endTime) => {
  return request({
    url: '/api/dahua/device/queryRecord/' + id + '/' + channelId,
    method: 'get',
    params: { startTime, endTime },
    timeout: 30000
  })
}

// 大华设备重启
export const rebootDaHuaDevice = (id) => {
  return request({
    url: '/api/dahua/device/reboot/' + id,
    method: 'get'
  })
}

// 获取大华设备详细信息
export const getDaHuaDeviceInfo = (id) => {
  return request({
    url: '/api/dahua/device/info/' + id,
    method: 'get'
  })
}
