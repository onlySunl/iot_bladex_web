import request from '@/router/axios'

// 查询国标平台列表
export const getList = (current, size, params) => {
  return request({
    url: '/api/qs/platform/list',
    method: 'get',
    params: { ...params, current, size }
  })
}

// 查询平台详细
export const getDetail = (id) => {
  return request({
    url: '/api/qs/platform/' + id,
    method: 'get'
  })
}

// 新增平台
export const add = (data) => {
  return request({
    url: '/api/qs/platform',
    method: 'post',
    data: data
  })
}

// 修改平台
export const update = (data) => {
  return request({
    url: '/api/qs/platform',
    method: 'put',
    data: data
  })
}

// 删除平台
export const remove = (ids) => {
  return request({
    url: '/api/qs/platform/' + ids,
    method: 'delete'
  })
}

// 关联通道设备列表
export const getLinkedDevices = (current, size, params) => {
  return request({
    url: '/api/qs/platform/linkedDevices',
    method: 'get',
    params: { ...params, current, size }
  })
}

// 关联通道
export const linkChannels = (data) => {
  return request({
    url: '/api/qs/platform/linkChannels',
    method: 'post',
    data: data
  })
}

// 注册上线
export const register = (id) => {
  return request({
    url: '/api/qs/platform/register/' + id,
    method: 'post'
  })
}

// 注销下线
export const unregister = (id) => {
  return request({
    url: '/api/qs/platform/unregister/' + id,
    method: 'post'
  })
}

// 推送通道
export const pushCatalog = (id) => {
  return request({
    url: '/api/qs/platform/pushCatalog/' + id,
    method: 'post'
  })
}
