import request from '@/router/axios'

export const getList = (current, size, params) => {
  return request({
    url: '/api/iot/video/list',
    method: 'get',
    params: { ...params, current, size }
  })
}

export const getDetail = (id) => {
  return request({
    url: '/api/iot/video/detail',
    method: 'get',
    params: { id }
  })
}

export const add = (row) => {
  return request({
    url: '/api/iot/video/submit',
    method: 'post',
    data: row
  })
}

export const update = (row) => {
  return request({
    url: '/api/iot/video/submit',
    method: 'post',
    data: row
  })
}

export const remove = (ids) => {
  return request({
    url: '/api/iot/video/remove',
    method: 'post',
    params: { ids }
  })
}

export const play = (id) => {
  return request({
    url: '/api/iot/video/play',
    method: 'get',
    params: { id }
  })
}

export const snapshot = (id) => {
  return request({
    url: '/api/iot/video/snapshot',
    method: 'post',
    params: { id }
  })
}

export const ptzControl = (id, command) => {
  return request({
    url: '/api/iot/video/ptz-control',
    method: 'post',
    data: { id, command }
  })
}

export const startPull = (id) => {
  return request({
    url: '/api/iot/video/start-pull',
    method: 'post',
    params: { id }
  })
}

export const startPush = (id) => {
  return request({
    url: '/api/iot/video/start-push',
    method: 'post',
    params: { id }
  })
}