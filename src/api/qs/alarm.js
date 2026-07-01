import request from '@/router/axios'

// 查询设备告警列表
export const getList = (current, size, params) => {
  return request({
    url: '/api/qs/alarm/list',
    method: 'get',
    params: { ...params, current, size }
  })
}

// 查询设备告警详细
export const getDetail = (id) => {
  return request({
    url: '/api/qs/alarm/' + id,
    method: 'get'
  })
}

// 修改设备告警
export const update = (data) => {
  return request({
    url: '/api/qs/alarm',
    method: 'put',
    data: data
  })
}

// 删除设备告警
export const remove = (ids) => {
  return request({
    url: '/api/qs/alarm/' + ids,
    method: 'delete'
  })
}

// 批量处理设备告警
export const batchHandleAlarm = (data) => {
  return request({
    url: '/api/qs/alarm/batchHandle',
    method: 'put',
    data: data
  })
}
