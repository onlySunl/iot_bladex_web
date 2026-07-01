import request from '@/router/axios'

/** 添加区域 */
export const addRegion = (data) => {
  return request({
    url: '/api/qs/region/add',
    method: 'post',
    data: data
  })
}

/** 更新区域 */
export const updateRegion = (data) => {
  return request({
    url: '/api/qs/region/update',
    method: 'post',
    data: data
  })
}

/** 删除区域 */
export const deleteRegion = (id) => {
  return request({
    url: '/api/qs/region/delete/' + id,
    method: 'delete'
  })
}

/** 查询区域节点 */
export const queryForRegionTree = (params) => {
  return request({
    url: '/api/qs/region/tree/list',
    method: 'get',
    params: params
  })
}

/** 查询区域节点设备 */
export const queryRegionForDevice = () => {
  return request({
    url: '/api/qs/region/device/list',
    method: 'get'
  })
}

/** 查询区域 */
export const queryForRegionQuery = (params) => {
  return request({
    url: '/api/qs/region/tree/query',
    method: 'get',
    params: params
  })
}

/** 获取所属的行政区划下的行政区划 */
export const getAllChild = (params) => {
  return request({
    url: '/api/qs/region/base/child/list',
    method: 'get',
    params: params
  })
}
