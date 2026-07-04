import request from '@/axios'

/**
 * @typedef {import('@/types').AjaxResult} AjaxResult
 * @typedef {import('@/types').TableDataInfo} TableDataInfo
 * @typedef {import('@/types').RecordPlanQueryParams} RecordPlanQueryParams
 * @typedef {import('@/types').ZlmRecordPlan} ZlmRecordPlan
 */

/**
 * 查询录像计划列表
 * @param {RecordPlanQueryParams} query 分页查询参数
 * @returns {Promise<TableDataInfo<ZlmRecordPlan[]>>}
 */
export function listRecordPlan(query) {
  return request({
    url: '/zlm/recordPlan/list',
    method: 'get',
    params: query
  })
}

/**
 * 查询录像计划详细
 * @param {number} id 主键ID
 * @returns {Promise<AjaxResult<ZlmRecordPlan>>}
 */
export function getRecordPlan(id) {
  return request({
    url: `/zlm/recordPlan/${id}`,
    method: 'get'
  })
}

/**
 * 新增录像计划
 * @param {ZlmRecordPlan} data 录像计划对象
 * @returns {Promise<AjaxResult>}
 */
export function addRecordPlan(data) {
  return request({
    url: '/zlm/recordPlan',
    method: 'post',
    data
  })
}

/**
 * 修改录像计划
 * @param {ZlmRecordPlan} data 录像计划对象
 * @returns {Promise<AjaxResult>}
 */
export function updateRecordPlan(data) {
  return request({
    url: '/zlm/recordPlan',
    method: 'put',
    data
  })
}

/**
 * 删除录像计划
 * @param {number | number[]} id ID 或 ID 数组
 * @returns {Promise<AjaxResult>}
 */
export function delRecordPlan(id) {
  return request({
    url: `/zlm/recordPlan/${id}`,
    method: 'delete'
  })
}

/**
 * 状态修改
 * @param {number} id 主键ID
 * @param {string} status 状态
 * @returns {Promise<AjaxResult>}
 */
export function changeRecordPlanStatus(id, status) {
  const data = {
    id,
    status
  }
  return request({
    url: '/zlm/recordPlan/changeStatus',
    method: 'put',
    data
  })
}