import request from '@/router/axios'

// 查询设备抓图列表
export function listSnapshot(query) {
    return request({
        url: '/api/qs/snapshot/list',
        method: 'get',
        params: query
    })
}

// 查询设备抓图详细
export function getSnapshot(id) {
    return request({
        url: '/api/qs/snapshot/' + id,
        method: 'get'
    })
}

// 删除设备抓图
export function delSnapshot(id) {
    return request({
        url: '/api/qs/snapshot/' + id,
        method: 'delete'
    })
}

// 导出设备抓图
export function exportSnapshot(query) {
    return request({
        url: '/api/qs/snapshot/export',
        method: 'get',
        params: query
    })
}

// 从流中抓图并保存
export function captureFromStream(data) {
    return request({
        url: '/api/qs/snapshot/captureFromStream',
        method: 'post',
        params: data
    })
}

// Aliases for compatibility
export const getSnapshotList = listSnapshot
export const deleteSnapshot = delSnapshot