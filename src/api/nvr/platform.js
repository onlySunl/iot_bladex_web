import request from '@/router/axios'

export function listPlatform(query) {
  return request({
    url: '/qs/platform/list',
    method: 'get',
    params: query
  })
}

export function getPlatform(id) {
  return request({
    url: '/qs/platform/' + id,
    method: 'get'
  })
}

export function addPlatform(data) {
  return request({
    url: '/qs/platform',
    method: 'post',
    data: data
  })
}

export function updatePlatform(data) {
  return request({
    url: '/qs/platform',
    method: 'put',
    data: data
  })
}

export function delPlatform(id) {
  return request({
    url: '/qs/platform/' + id,
    method: 'delete'
  })
}

export function listPlatformDevice(query, platformId, hasLink) {
  return request({
    url: '/qs/platformChannel/deviceList',
    method: 'get',
    params: Object.assign({}, query, { platformId: platformId, hasLink: hasLink })
  })
}

export function linkDevice(data) {
  return request({
    url: '/qs/platformChannel/link',
    method: 'post',
    data: data
  })
}

export function unlinkDevice(data) {
  return request({
    url: '/qs/platformChannel/unlink',
    method: 'post',
    data: data
  })
}

export function registerPlatform(id) {
  return request({
    url: '/qs/platform/cascade/start/' + id,
    method: 'post'
  })
}

export function unregisterPlatform(id) {
  return request({
    url: '/qs/platform/cascade/stop/' + id,
    method: 'post'
  })
}

export function pushCatalog(id) {
  return request({
    url: '/qs/platform/cascade/pushCatalog/' + id,
    method: 'post'
  })
}
