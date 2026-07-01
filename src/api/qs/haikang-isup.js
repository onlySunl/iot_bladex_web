import request from '@/router/axios'

// 查询海康ISUP设备列表
export const listHaiKangIsupDevice = () => {
  return request({
    url: '/api/haikangIsup/device/list',
    method: 'get'
  })
}

// 查询海康ISUP设备录像列表
export const queryHaiKangIsupRecord = (deviceId, channelId, startTime, endTime) => {
  return request({
    url: '/api/haikangIsup/device/getRecMonth/' + deviceId + '/' + channelId,
    method: 'get',
    params: { startTime, endTime },
    timeout: 30000
  })
}

// 重启海康ISUP设备
export const rebootHaiKangIsupDevice = (deviceId) => {
  return request({
    url: '/api/haikangIsup/device/rebootHaiKangDevice/' + deviceId,
    method: 'get'
  })
}

// 海康ISUP设备抓图并保存
export const captureHaiKangIsupAndSave = (deviceId, channelId, snapshotType) => {
  return request({
    url: '/api/haikangIsup/device/captureAndSave/' + deviceId + '/' + channelId,
    method: 'post',
    params: { snapshotType }
  })
}
