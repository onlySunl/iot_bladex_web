import request from '@/router/axios'

export const getList = (current, size, params) => {
  return request({
    url: '/api/iot/group/list',
    method: 'get',
    params: { ...params, current, size }
  })
}

export const getTree = (params) => {
  return request({
    url: '/api/iot/group/tree',
    method: 'get',
    params
  })
}

export const getDetail = (id) => {
  return request({
    url: '/api/iot/group/detail',
    method: 'get',
    params: { id }
  })
}

export const add = (row) => {
  return request({
    url: '/api/iot/group/submit',
    method: 'post',
    data: row
  })
}

export const update = (row) => {
  return request({
    url: '/api/iot/group/submit',
    method: 'post',
    data: row
  })
}

export const remove = (ids) => {
  return request({
    url: '/api/iot/group/remove',
    method: 'post',
    params: { ids }
  })
}