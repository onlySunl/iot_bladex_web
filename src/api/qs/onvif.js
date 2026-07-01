import request from '@/router/axios'

// 获取onvif设备列表
export const getOnvifDeviceList = () => {
  return request({
    url: '/api/onvif/device/getOnvifDeviceList',
    method: 'get',
    timeout: 20000
  })
}

// 验证登录onvif设备
export const onvifLogin = (data) => {
  return request({
    url: '/api/onvif/device/login',
    method: 'post',
    data,
    timeout: 20000
  })
}

// 查询ONVIF设备录像列表
export const queryOnvifRecord = (deviceIp, username, password, startTime, endTime) => {
  return request({
    url: '/api/onvif/device/queryRecord',
    method: 'get',
    params: { deviceIp, username, password, startTime, endTime },
    timeout: 30000
  })
}

// ONVIF设备重启
export const restartOnvifDevice = (deviceId) => {
  return request({
    url: '/api/onvif/device/rebootOnvifDevice/' + deviceId,
    method: 'get',
    timeout: 30000
  })
}
