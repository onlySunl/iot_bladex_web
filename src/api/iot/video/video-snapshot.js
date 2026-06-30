import request from '@/router/axios'

export const getList = (current, size, params) => {
  return request({
    url: '/api/iot/video-snapshot/list',
    method: 'get',
    params: { ...params, current, size }
  })
}

export const getDetail = (id) => {
  return request({
    url: '/api/iot/video-snapshot/detail',
    method: 'get',
    params: { id }
  })
}

export const remove = (ids) => {
  return request({
    url: '/api/iot/video-snapshot/remove',
    method: 'post',
    params: { ids }
  })
}