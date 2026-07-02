import request from '@/axios'
// 查询设备抓图列表
export function listSnapshot(query) {
    return request({
        url: '/qs/snapshot/list',
        method: 'get',
        params
    })
}

// 查询设备抓图详细
export function getSnapshot(id) {
    return request({
        url: '/qs/snapshot/' + id,
        method: 'get'
    })
}

// 删除设备抓图
export function delSnapshot(id | number[]) {
    return request({
        url: '/qs/snapshot/' + id,
        method: 'delete'
    })
}

// 导出设备抓图
export function exportSnapshot(query) {
    return request({
        url: '/qs/snapshot/export',
        method: 'get',
        params
    })
}

// 从流中抓图并保存
export function captureFromStream(data: {
    deviceId;
    app;
    stream;
    snapshotType;
}) {
    return request({
        url: '/qs/snapshot/captureFromStream',
        method: 'post',
        params
    })
}