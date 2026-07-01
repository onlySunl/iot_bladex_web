import request from '@/router/axios'

// 获取所有国标设备
export const getAllDevices = () => {
  return request({
    url: '/api/gb28181/device/getAllDevices',
    method: 'get'
  })
}

// 根据国标设备获取所有通道
export const getChannelsByDeviceId = (gbDeviceId) => {
  return request({
    url: '/api/gb28181/device/getChannelsByDeviceId/' + gbDeviceId,
    method: 'get'
  })
}

// 查询设备录像列表
export const queryDeviceRecord = (deviceId, channelId, startTime, endTime) => {
  return request({
    url: '/api/gb28181/device/queryRecord/' + deviceId + '/' + channelId,
    method: 'get',
    params: { startTime, endTime },
    timeout: 30000
  })
}

// 刷新设备状态和通道
export const refreshDevice = (gbDeviceId) => {
  return request({
    url: '/api/gb28181/device/refresh/' + gbDeviceId,
    method: 'post'
  })
}

// 远程重启设备
export const rebootGb28181Device = (gbDeviceId) => {
  return request({
    url: '/api/gb28181/device/reboot/' + gbDeviceId,
    method: 'post'
  })
}

// 录像控制
export const recordCmd = (gbDeviceId, channelId, recordCmd, streamNumber) => {
  return request({
    url: '/api/gb28181/device/record/cmd',
    method: 'post',
    params: { gbDeviceId, channelId, recordCmd, streamNumber }
  })
}

// 查询设备状态
export const queryDeviceStatus = (deviceId) => {
  return request({
    url: '/api/gb28181/device/status/' + deviceId,
    method: 'get'
  })
}
