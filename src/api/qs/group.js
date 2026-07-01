import request from '@/router/axios'

/** 添加分组 */
export const addGroup = (data) => {
  return request({
    url: '/api/qs/group/add',
    method: 'post',
    data: data
  })
}

/** 更新分组 */
export const updateGroup = (data) => {
  return request({
    url: '/api/qs/group/update',
    method: 'post',
    data: data
  })
}

/** 删除分组 */
export const deleteGroup = (id) => {
  return request({
    url: '/api/qs/group/delete/' + id,
    method: 'delete'
  })
}

// 查询分组
export const queryForGroupQuery = (params) => {
  return request({
    url: '/api/qs/group/tree/query',
    method: 'get',
    params: params
  })
}

// 查询分组节点
export const queryForGroupTree = (params) => {
  return request({
    url: '/api/qs/group/tree/list',
    method: 'get',
    params: params
  })
}

// 查询分组节点设备
export const queryGroupForDevice = () => {
  return request({
    url: '/api/qs/group/device/list',
    method: 'get'
  })
}
