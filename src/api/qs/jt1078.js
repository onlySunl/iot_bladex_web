import request from '@/router/axios'

// 获取所有JT1078设备
export const getAllDevice = () => {
  return request({
    url: '/api/jt1078/device/allList',
    method: 'get'
  })
}

// 查询JT1078设备录像列表
export const queryJt1078Record = (mobileNo, channelNo, startTime, endTime) => {
  return request({
    url: '/api/jt1078/queryRecord/' + mobileNo + '/' + channelNo,
    method: 'get',
    params: { startTime, endTime },
    timeout: 30000
  })
}

// 8104 查询终端参数
export const queryTerminalParams = (data) => {
  return request({
    url: '/api/jt1078/device/8104',
    method: 'post',
    data
  })
}

// 8103 设置终端参数
export const setTerminalParams = (data) => {
  return request({
    url: '/api/jt1078/device/8103',
    method: 'post',
    data
  })
}
