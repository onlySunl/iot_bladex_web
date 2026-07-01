import request from '@/router/axios'

// 查询录像计划列表
export function listRecordPlan(query) {
  return request({
    url: '/zlm/recordPlan/list',
    method: 'get',
    params: query
  })
}

// 查询录像计划详细
export function getRecordPlan(id) {
  return request({
    url: '/zlm/recordPlan/' + id,
    method: 'get'
  })
}

// 新增录像计划
export function addRecordPlan(data) {
  return request({
    url: '/zlm/recordPlan',
    method: 'post',
    data: data
  })
}

// 修改录像计划
export function updateRecordPlan(data) {
  return request({
    url: '/zlm/recordPlan',
    method: 'put',
    data: data
  })
}

// 删除录像计划
export function delRecordPlan(id) {
  return request({
    url: '/zlm/recordPlan/' + id,
    method: 'delete'
  })
}

// 状态修改
export function changeRecordPlanStatus(id, status) {
  var data = { id: id, status: status }
  return request({
    url: '/zlm/recordPlan/changeStatus',
    method: 'put',
    data: data
  })
}
