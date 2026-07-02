import request from '@/axios';
// 查询云端录像列表（分页）
export const listCloudRecord = (query: CloudRecordQueryParams) => {
    return request({
        url: '/zlm/cloudRecord/list',
        method: 'get',
        params: query
    })
}

// 查询云端录像列表（不分页）
export const listAllCloudRecord = (query: CloudRecordQueryParams) => {
    return request({
        url: '/zlm/cloudRecord/allList',
        method: 'get',
        params: query
    })
}


// 查询云端录像详细
export const getCloudRecord = (id) => {
    return request({
        url: '/zlm/cloudRecord/' + id,
        method: 'get'
    })
}

// 删除云端录像
export const delCloudRecord = (id | number[]) => {
    return request({
        url: '/zlm/cloudRecord/' + id,
        method: 'delete'
    })
}

// 播放云端录像
export const loadRecord = (id | number[]) => {
    return request({
        url: '/zlm/cloudRecord/loadRecord/' + id,
        method: 'get'
    })
}

// 关闭流文件形成播放地址
export const closeStreams = (id | number[]) => {
    return request({
        url: '/zlm/cloudRecord/closeStreams/' + id,
        method: 'get'
    })
}

// 定位录像播放到制定位置
export const seekCloudRecord = (query) => {
    return request({
        url: '/zlm/cloudRecord/seek',
        method: 'get',
        params: query
    })
}

// 设置录像播放速度
export const setCloudRecordSpeed = (query) => {
    return request({
        url: '/zlm/cloudRecord/speed',
        method: 'get',
        params: query
    })
}