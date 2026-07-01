import request from '@/router/axios'

// 查询设备告警列表
export function listAlarm(query) {
    return request({
        url: '/api/qs/alarm/list',
        method: 'get',
        params: query
    })
}

// 查询设备告警详细
export function getAlarm(id) {
    return request({
        url: '/api/qs/alarm/' + id,
        method: 'get'
    })
}

// 修改设备告警
export function updateAlarm(data) {
    return request({
        url: '/api/qs/alarm',
        method: 'put',
        data: data
    })
}

// 删除设备告警
export function delAlarm(id) {
    return request({
        url: '/api/qs/alarm/' + id,
        method: 'delete'
    })
}

// 导出设备告警
export function exportAlarm(query) {
    return request({
        url: '/api/qs/alarm/export',
        method: 'get',
        params: query
    })
}

// 批量处理设备告警
export function batchHandleAlarm(data) {
    console.log('=== 调用批量处理告警 API ===')
    console.log('发送的数据:', data)
    return request({
        url: '/api/qs/alarm/batchHandle',
        method: 'put',
        data: data
    })
}
