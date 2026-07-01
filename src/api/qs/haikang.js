import request from '@/router/axios'

// 查询海康SDK设备录像列表
export const queryHaiKangRecord = (deviceId, channelId, startTime, endTime) => {
  return request({
    url: '/api/haikang/device/getRecMonth/' + deviceId + '/' + channelId,
    method: 'get',
    params: { startTime, endTime },
    timeout: 30000
  })
}

// 海康设备录像直接下载
export const downloadHaikangRecordDirect = (data) => {
  return request({
    url: '/api/haikang/device/downloadRecordDirect',
    method: 'post',
    data: data,
    responseType: 'blob',
    timeout: 300000
  })
}

// 海康设备抓图并保存
export const captureHaikangAndSave = (deviceId, channelId, snapshotType) => {
  return request({
    url: '/api/haikang/device/captureAndSave/' + deviceId + '/' + channelId,
    method: 'post',
    params: { snapshotType: snapshotType || 'manual' },
    timeout: 30000
  })
}

// 获取海康设备信息
export const getHaiKangDeviceInfo = (deviceId) => {
  return request({
    url: '/api/haikang/device/getHaiKangDeviceInfo/' + deviceId,
    method: 'get',
    timeout: 30000
  })
}

// 获取海康存储信息
export const getHaiKangStorageInfo = (deviceId) => {
  return request({
    url: '/api/haikang/device/getHaiKangStorageInfo/' + deviceId,
    method: 'get',
    timeout: 30000
  })
}
