import request from '@/axios';
// 查询设备告警列表
export const listAlarm = (query: AlarmQueryParams) => {
    return request({
        url: '/qs/alarm/list',
        method: 'get',
        params: query
    })
}

// 查询设备告警详细
export const getAlarm = (id) => {
    return request({
        url: '/qs/alarm/' + id,
        method: 'get'
    })
}

// 修改设备告警
export const updateAlarm = (data: QsDeviceAlarm) => {
    return request({
        url: '/qs/alarm',
        method: 'put',
        data: data
    })
}

// 删除设备告警
export const delAlarm = (id | number[]) => {
    return request({
        url: '/qs/alarm/' + id,
        method: 'delete'
    })
}

// 导出设备告警
export const exportAlarm = (query: AlarmQueryParams) => {
    return request({
        url: '/qs/alarm/export',
        method: 'get',
        params: query
    })
}

// 批量处理设备告警
export const batchHandleAlarm = (data: QsDeviceAlarm) => {
    console.log('=== 调用批量处理告警 API ===')
    console.log('发送的数据:', data)
    return request({
        url: '/qs/alarm/batchHandle',
        method: 'put',
        data: data
    })
}
