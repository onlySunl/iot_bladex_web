import request from '@/router/axios'

export const getList = (current, size, params) => {
  return request({
    url: '/api/iot/project-group/list',
    method: 'get',
    params: { ...params, current, size }
  })
}

export const getTree = (params) => {
  return request({
    url: '/api/iot/project-group/tree',
    method: 'get',
    params
  })
}

export const getDetail = (id) => {
  return request({
    url: '/api/iot/project-group/detail',
    method: 'get',
    params: { id }
  })
}

export const add = (row) => {
  return request({
    url: '/api/iot/project-group/submit',
    method: 'post',
    data: row
  })
}

export const update = (row) => {
  return request({
    url: '/api/iot/project-group/submit',
    method: 'post',
    data: row
  })
}

export const remove = (ids) => {
  return request({
    url: '/api/iot/project-group/remove',
    method: 'post',
    params: { ids }
  })
}