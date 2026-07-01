import request from '@/router/axios'

// 查询设备抓图列表
export const getList = (current, size, params) => {
  return request({
    url: '/api/qs/snapshot/list',
    method: 'get',
    params: { ...params, current, size }
  })
}

// 查询设备抓图详细
export const getDetail = (id) => {
  return request({
    url: '/api/qs/snapshot/' + id,
    method: 'get'
  })
}

// 删除设备抓图
export const remove = (ids) => {
  return request({
    url: '/api/qs/snapshot/' + ids,
    method: 'delete'
  })
}

// 从流中抓图并保存
export const captureFromStream = (data) => {
  return request({
    url: '/api/qs/snapshot/captureFromStream',
    method: 'post',
    params: data
  })
}
