import request from '@/router/axios'

export const getList = (current, size, params) => {
  return request({
    url: '/api/iot/video-record/list',
    method: 'get',
    params: { ...params, current, size }
  })
}

export const getDetail = (id) => {
  return request({
    url: '/api/iot/video-record/detail',
    method: 'get',
    params: { id }
  })
}

export const remove = (ids) => {
  return request({
    url: '/api/iot/video-record/remove',
    method: 'post',
    params: { ids }
  })
}