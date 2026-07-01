import request from '@/router/axios'

// 查询设备告警列表
export function listAlarm(query) {
  return request({
    url: '/qs/alarm/list',
    method: 'get',
    params: query
  })
}

// 查询设备告警详细
export function getAlarm(id) {
  return request({
    url: '/qs/alarm/' + id,
    method: 'get'
  })
}

// 修改设备告警
export function updateAlarm(data) {
  return request({
    url: '/qs/alarm',
    method: 'put',
    data: data
  })
}

// 删除设备告警
export function delAlarm(id) {
  return request({
    url: '/qs/alarm/' + id,
    method: 'delete'
  })
}

// 导出设备告警
export function exportAlarm(query) {
  return request({
    url: '/qs/alarm/export',
    method: 'get',
    params: query
  })
}

// 批量处理设备告警
export function batchHandleAlarm(data) {
  return request({
    url: '/qs/alarm/batchHandle',
    method: 'put',
    data: data
  })
}
