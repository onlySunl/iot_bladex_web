import request from '@/router/axios'

export const getList = (current, size, params) => {
  return request({
    url: '/api/iot/device-record/list',
    method: 'get',
    params: { ...params, current, size }
  })
}

export const getDetail = (id) => {
  return request({
    url: '/api/iot/device-record/detail',
    method: 'get',
    params: { id }
  })
}

export const remove = (ids) => {
  return request({
    url: '/api/iot/device-record/remove',
    method: 'post',
    params: { ids }
  })
}