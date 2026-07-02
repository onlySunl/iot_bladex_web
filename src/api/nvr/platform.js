import request from '@/router/axios'


export function listPlatform(query) {
  return request({
    url: '/qs/platform/list',
    method: 'get',
    params
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
    data
  })
}

export function updatePlatform(data) {
  return request({
    url: '/qs/platform',
    method: 'put',
    data
  })
}

export function delPlatform(id | number[]) {
  return request({
    url: '/qs/platform/' + id,
    method: 'delete'
  })
}



export function listPlatformDevice(query, platformId, hasLink) {
  return request({
    url: '/qs/platformChannel/deviceList',
    method: 'get',
    params: {...query, platformId, hasLink}
  })
}

export function linkDevice(data) {
  return request({
    url: '/qs/platformChannel/link',
    method: 'post',
    data
  })
}

export function unlinkDevice(data) {
  return request({
    url: '/qs/platformChannel/unlink',
    method: 'post',
    data
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
