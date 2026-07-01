import request from '@/router/axios'

// 查询视频监控设备列表
export const getList = (current, size, params) => {
  return request({
    url: '/api/qs/device/list',
    method: 'get',
    params: { ...params, current, size }
  })
}

// 根据行政区域获取视频监控设备列表
export const queryListByCivilCode = (current, size, params) => {
  return request({
    url: '/api/qs/device/queryListByCivilCode',
    method: 'get',
    params: { ...params, current, size }
  })
}

// 查询视频监控设备详细
export const getDetail = (id) => {
  return request({
    url: '/api/qs/device/' + id,
    method: 'get'
  })
}

// 新增视频监控设备
export const add = (data) => {
  return request({
    url: '/api/qs/device',
    method: 'post',
    data: data
  })
}

// 修改视频监控设备
export const update = (data) => {
  return request({
    url: '/api/qs/device',
    method: 'put',
    data: data
  })
}

// 删除视频监控设备
export const remove = (ids) => {
  return request({
    url: '/api/qs/device/' + ids,
    method: 'delete'
  })
}

// 状态修改
export const changeDeviceStatus = (id, status) => {
  return request({
    url: '/api/qs/device/changeStatus',
    method: 'put',
    data: { id, status }
  })
}

// 获取本地mp4截图
export const getVideoSnapshot = (id) => {
  return request({
    url: '/api/qs/device/getVideoSnapshot/' + id,
    method: 'put'
  })
}

// 获取计划记录对应的视频监控设备
export const listPlanRecord = (current, size, params) => {
  return request({
    url: '/api/qs/device/listPlanRecord',
    method: 'get',
    params: { ...params, current, size }
  })
}

// 设备关联录制计划
export const linkDevicePlan = (data) => {
  return request({
    url: '/api/qs/device/link',
    method: 'post',
    data: data
  })
}

// 添加行政区划设备
export const addDeviceToRegion = (data) => {
  return request({
    url: '/api/qs/device/region/add',
    method: 'post',
    data: data
  })
}

// 删除行政区划设备
export const deleteDeviceToRegion = (data) => {
  return request({
    url: '/api/qs/device/region/delete',
    method: 'post',
    data: data
  })
}

// 获取编码列表
export const getDeviceTypeList = () => {
  return request({
    url: '/api/qs/device/type/list',
    method: 'get'
  })
}

// 获取行业编码列表
export const getIndustryCodeList = () => {
  return request({
    url: '/api/qs/device/industry/list',
    method: 'get'
  })
}

// 添加业务分组设备
export const addDeviceIdToGroup = (data) => {
  return request({
    url: '/api/qs/device/group/add',
    method: 'post',
    data: data
  })
}

// 删除业务分组设备
export const deleteDeviceToGroup = (data) => {
  return request({
    url: '/api/qs/device/group/delete',
    method: 'post',
    data: data
  })
}
