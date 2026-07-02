import request from '@/axios';
// 查询设备抓图列表
export const listSnapshot = (query: SnapshotQueryParams) => {
    return request({
        url: '/qs/snapshot/list',
        method: 'get',
        params: query
    })
}

// 查询设备抓图详细
export const getSnapshot = (id) => {
    return request({
        url: '/qs/snapshot/' + id,
        method: 'get'
    })
}

// 删除设备抓图
export const delSnapshot = (id | number[]) => {
    return request({
        url: '/qs/snapshot/' + id,
        method: 'delete'
    })
}

// 导出设备抓图
export const exportSnapshot = (query: SnapshotQueryParams) => {
    return request({
        url: '/qs/snapshot/export',
        method: 'get',
        params: query
    })
}

// 从流中抓图并保存
export const captureFromStream = (data: {
    deviceId;
    app;
    stream;
    snapshotType;
}) => {
    return request({
        url: '/qs/snapshot/captureFromStream',
        method: 'post',
        params: data
    })
}