import request from '@/router/axios'

export const getList = (current, size, params) => {
  return request({
    url: '/api/iot/category/list',
    method: 'get',
    params: { ...params, current, size }
  })
}

export const getTree = (params) => {
  return request({
    url: '/api/iot/category/tree',
    method: 'get',
    params
  })
}

export const getDetail = (id) => {
  return request({
    url: '/api/iot/category/detail',
    method: 'get',
    params: { id }
  })
}

export const add = (row) => {
  return request({
    url: '/api/iot/category/submit',
    method: 'post',
    data: row
  })
}

export const update = (row) => {
  return request({
    url: '/api/iot/category/submit',
    method: 'post',
    data: row
  })
}

export const remove = (ids) => {
  return request({
    url: '/api/iot/category/remove',
    method: 'post',
    params: { ids }
  })
}