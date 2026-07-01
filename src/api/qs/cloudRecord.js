import request from '@/router/axios'

// 查询云端录像列表（分页）
export const getList = (current, size, params) => {
  return request({
    url: '/api/zlm/cloudRecord/list',
    method: 'get',
    params: { ...params, current, size }
  })
}

// 查询云端录像列表（不分页）
export const listAllCloudRecord = (params) => {
  return request({
    url: '/api/zlm/cloudRecord/allList',
    method: 'get',
    params: params
  })
}

// 查询云端录像详细
export const getDetail = (id) => {
  return request({
    url: '/api/zlm/cloudRecord/' + id,
    method: 'get'
  })
}

// 删除云端录像
export const remove = (ids) => {
  return request({
    url: '/api/zlm/cloudRecord/' + ids,
    method: 'delete'
  })
}

// 播放云端录像
export const loadRecord = (id) => {
  return request({
    url: '/api/zlm/cloudRecord/loadRecord/' + id,
    method: 'get'
  })
}

// 关闭流
export const closeStreams = (id) => {
  return request({
    url: '/api/zlm/cloudRecord/closeStreams/' + id,
    method: 'get'
  })
}

// 定位录像播放
export const seekCloudRecord = (params) => {
  return request({
    url: '/api/zlm/cloudRecord/seek',
    method: 'get',
    params: params
  })
}

// 设置录像播放速度
export const setCloudRecordSpeed = (params) => {
  return request({
    url: '/api/zlm/cloudRecord/speed',
    method: 'get',
    params: params
  })
}
