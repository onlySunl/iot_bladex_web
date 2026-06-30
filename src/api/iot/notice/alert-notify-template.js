import request from '@/router/axios'

export const getList = (current, size, params) => {
  return request({
    url: '/api/iot/alert-notify-template/list',
    method: 'get',
    params: { ...params, current, size }
  })
}

export const getDetail = (id) => {
  return request({
    url: '/api/iot/alert-notify-template/detail',
    method: 'get',
    params: { id }
  })
}

export const add = (row) => {
  return request({
    url: '/api/iot/alert-notify-template/submit',
    method: 'post',
    data: row
  })
}

export const update = (row) => {
  return request({
    url: '/api/iot/alert-notify-template/submit',
    method: 'post',
    data: row
  })
}

export const remove = (ids) => {
  return request({
    url: '/api/iot/alert-notify-template/remove',
    method: 'post',
    params: { ids }
  })
}