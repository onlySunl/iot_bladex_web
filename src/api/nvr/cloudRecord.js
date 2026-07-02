import request from '@/axios'
// 查询云端录像列表（分页）
export function listCloudRecord(query) {
    return request({
        url: '/zlm/cloudRecord/list',
        method: 'get',
        params
    })
}

// 查询云端录像列表（不分页）
export function listAllCloudRecord(query) {
    return request({
        url: '/zlm/cloudRecord/allList',
        method: 'get',
        params
    })
}


// 查询云端录像详细
export function getCloudRecord(id) {
    return request({
        url: '/zlm/cloudRecord/' + id,
        method: 'get'
    })
}

// 删除云端录像
export function delCloudRecord(id | number[]) {
    return request({
        url: '/zlm/cloudRecord/' + id,
        method: 'delete'
    })
}

// 播放云端录像
export function loadRecord(id | number[]) {
    return request({
        url: '/zlm/cloudRecord/loadRecord/' + id,
        method: 'get'
    })
}

// 关闭流文件形成播放地址
export function closeStreams(id | number[]) {
    return request({
        url: '/zlm/cloudRecord/closeStreams/' + id,
        method: 'get'
    })
}

// 定位录像播放到制定位置
export function seekCloudRecord(query) {
    return request({
        url: '/zlm/cloudRecord/seek',
        method: 'get',
        params
    })
}

// 设置录像播放速度
export function setCloudRecordSpeed(query) {
    return request({
        url: '/zlm/cloudRecord/speed',
        method: 'get',
        params
    })
}