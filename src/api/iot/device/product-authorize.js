import request from '@/router/axios'

export const getList = (current, size, params) => {
  return request({
    url: '/api/iot/product-authorize/list',
    method: 'get',
    params: { ...params, current, size }
  })
}

export const getDetail = (id) => {
  return request({
    url: '/api/iot/product-authorize/detail',
    method: 'get',
    params: { id }
  })
}

export const add = (row) => {
  return request({
    url: '/api/iot/product-authorize/submit',
    method: 'post',
    data: row
  })
}

export const update = (row) => {
  return request({
    url: '/api/iot/product-authorize/submit',
    method: 'post',
    data: row
  })
}

export const remove = (ids) => {
  return request({
    url: '/api/iot/product-authorize/remove',
    method: 'post',
    params: { ids }
  })
}