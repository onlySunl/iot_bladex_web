import request from '@/router/axios'

// 查询录像计划列表
export const getList = (current, size, params) => {
  return request({
    url: '/api/zlm/recordPlan/list',
    method: 'get',
    params: { ...params, current, size }
  })
}

// 查询录像计划详细
export const getDetail = (id) => {
  return request({
    url: '/api/zlm/recordPlan/' + id,
    method: 'get'
  })
}

// 新增录像计划
export const add = (data) => {
  return request({
    url: '/api/zlm/recordPlan',
    method: 'post',
    data: data
  })
}

// 修改录像计划
export const update = (data) => {
  return request({
    url: '/api/zlm/recordPlan',
    method: 'put',
    data: data
  })
}

// 删除录像计划
export const remove = (ids) => {
  return request({
    url: '/api/zlm/recordPlan/' + ids,
    method: 'delete'
  })
}

// 状态修改
export const changeStatus = (id, status) => {
  return request({
    url: '/api/zlm/recordPlan/changeStatus',
    method: 'put',
    data: { id, status }
  })
}
