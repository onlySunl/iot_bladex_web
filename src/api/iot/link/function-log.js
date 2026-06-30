import request from '@/router/axios'

export const getList = (current, size, params) => {
  return request({
    url: '/api/iot/function-log/list',
    method: 'get',
    params: { ...params, current, size }
  })
}

export const getDetail = (id) => {
  return request({
    url: '/api/iot/function-log/detail',
    method: 'get',
    params: { id }
  })
}

export const remove = (ids) => {
  return request({
    url: '/api/iot/function-log/remove',
    method: 'post',
    params: { ids }
  })
}