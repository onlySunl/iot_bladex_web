import request from '@/axios';
// 查询录像计划列表
export const listRecordPlan = (query: RecordPlanQueryParams) => {
  return request({
    url: '/zlm/recordPlan/list',
    method: 'get',
    params: query
  })
}

// 查询录像计划详细
export const getRecordPlan = (id) => {
  return request({
    url: '/zlm/recordPlan/' + id,
    method: 'get'
  })
}

// 新增录像计划
export const addRecordPlan = (data: ZlmRecordPlan) => {
  return request({
    url: '/zlm/recordPlan',
    method: 'post',
    data: data
  })
}

// 修改录像计划
export const updateRecordPlan = (data: ZlmRecordPlan) => {
  return request({
    url: '/zlm/recordPlan',
    method: 'put',
    data: data
  })
}

// 删除录像计划
export const delRecordPlan = (id | number[]) => {
  return request({
    url: '/zlm/recordPlan/' + id,
    method: 'delete'
  })
}

// 状态修改
export const changeRecordPlanStatus = (id, status) => {
  const data = {
    id,
    status
  }
  return request({
    url: '/zlm/recordPlan/changeStatus',
    method: 'put',
    data: data
  })
}


