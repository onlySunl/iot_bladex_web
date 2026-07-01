import request from '@/router/axios'

/**
 * 添加区域
 */
export function addRegion(data) {
  return request({
    url: '/qs/region/add',
    method: 'post',
    data: data
  })
}

/**
 * 更新区域
 */
export function updateRegion(data) {
  return request({
    url: '/qs/region/update',
    method: 'post',
    data: data
  })
}

/**
 * 删除区域
 */
export function deleteRegion(id) {
  return request({
    url: '/qs/region/delete/' + id,
    method: 'delete'
  })
}

/**
 * 查询区域节点
 */
export function queryForRegionTree(query) {
  return request({
    url: '/qs/region/tree/list',
    method: 'get',
    params: query
  })
}

/**
 * 查询区域节点设备
 */
export function queryRegionForDevice() {
  return request({
    url: '/qs/region/device/list',
    method: 'get'
  })
}

/**
 * 查询区域节点（下拉用）
 */
export function queryForRegionQuery(query) {
  return request({
    url: '/qs/region/tree/query',
    method: 'get',
    params: query
  })
}

/**
 * 获取所属的行政区划下的行政区划
 */
export function getAllChild(parent) {
  return request({
    url: '/qs/region/base/child/list',
    method: 'get',
    params: parent
  })
}
