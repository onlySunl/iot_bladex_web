import request from '@/router/axios'

export function listPlatform(query) {
  return request({
    url: '/api/qs/platform/list',
    method: 'get',
    params: query
  })
}

export function getPlatform(id) {
  return request({
    url: '/api/qs/platform/' + id,
    method: 'get'
  })
}

export function addPlatform(data) {
  return request({
    url: '/api/qs/platform',
    method: 'post',
    data: data
  })
}

export function updatePlatform(data) {
  return request({
    url: '/api/qs/platform',
    method: 'put',
    data: data
  })
}

export function delPlatform(id) {
  return request({
    url: '/api/qs/platform/' + id,
    method: 'delete'
  })
}

export function listPlatformDevice(query, platformId, hasLink) {
  return request({
    url: '/api/qs/platformChannel/deviceList',
    method: 'get',
    params: {...query, platformId, hasLink}
  })
}

export function linkDevice(data) {
  return request({
    url: '/api/qs/platformChannel/link',
    method: 'post',
    data: data
  })
}

export function unlinkDevice(data) {
  return request({
    url: '/api/qs/platformChannel/unlink',
    method: 'post',
    data: data
  })
}

export function registerPlatform(id) {
  return request({
    url: '/api/qs/platform/cascade/start/' + id,
    method: 'post'
  })
}

export function unregisterPlatform(id) {
  return request({
    url: '/api/qs/platform/cascade/stop/' + id,
    method: 'post'
  })
}

export function pushCatalog(id) {
  return request({
    url: '/api/qs/platform/cascade/pushCatalog/' + id,
    method: 'post'
  })
}
