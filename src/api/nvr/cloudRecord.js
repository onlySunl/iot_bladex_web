import request from '@/router/axios'

// 查询云端录像列表（分页）
export function listCloudRecord(query) {
    return request({
        url: '/api/zlm/cloudRecord/list',
        method: 'get',
        params: query
    })
}

// 查询云端录像列表（不分页）
export function listAllCloudRecord(query) {
    return request({
        url: '/api/zlm/cloudRecord/allList',
        method: 'get',
        params: query
    })
}

// 查询云端录像详细
export function getCloudRecord(id) {
    return request({
        url: '/api/zlm/cloudRecord/' + id,
        method: 'get'
    })
}

// 删除云端录像
export function delCloudRecord(id) {
    return request({
        url: '/api/zlm/cloudRecord/' + id,
        method: 'delete'
    })
}

// 播放云端录像
export function loadRecord(id) {
    return request({
        url: '/api/zlm/cloudRecord/loadRecord/' + id,
        method: 'get'
    })
}

// 关闭流文件形成播放地址
export function closeStreams(id) {
    return request({
        url: '/api/zlm/cloudRecord/closeStreams/' + id,
        method: 'get'
    })
}

// 定位录像播放到制定位置
export function seekCloudRecord(query) {
    return request({
        url: '/api/zlm/cloudRecord/seek',
        method: 'get',
        params: query
    })
}

// 设置录像播放速度
export function setCloudRecordSpeed(query) {
    return request({
        url: '/api/zlm/cloudRecord/speed',
        method: 'get',
        params: query
    })
}