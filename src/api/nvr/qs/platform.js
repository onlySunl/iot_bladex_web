import request from '@/axios';


export const listPlatform = (query: PlatformQueryParams) => {
  return request({
    url: '/qs/platform/list',
    method: 'get',
    params: query
  })
}

export const getPlatform = (id) => {
  return request({
    url: '/qs/platform/' + id,
    method: 'get'
  })
}

export const addPlatform = (data: QsGb28181Platform) => {
  return request({
    url: '/qs/platform',
    method: 'post',
    data: data
  })
}

export const updatePlatform = (data: QsGb28181Platform) => {
  return request({
    url: '/qs/platform',
    method: 'put',
    data: data
  })
}

export const delPlatform = (id | number[]) => {
  return request({
    url: '/qs/platform/' + id,
    method: 'delete'
  })
}



export const listPlatformDevice = (query: DeviceQueryParams, platformId, hasLink) => {
  return request({
    url: '/qs/platformChannel/deviceList',
    method: 'get',
    params: {...query, platformId, hasLink}
  })
}

export const linkDevice = (data: PlatformChannelLinkRequest) => {
  return request({
    url: '/qs/platformChannel/link',
    method: 'post',
    data: data
  })
}

export const unlinkDevice = (data: PlatformChannelLinkRequest) => {
  return request({
    url: '/qs/platformChannel/unlink',
    method: 'post',
    data: data
  })
}

export const registerPlatform = (id) => {
  return request({
    url: '/qs/platform/cascade/start/' + id,
    method: 'post'
  })
}

export const unregisterPlatform = (id) => {
  return request({
    url: '/qs/platform/cascade/stop/' + id,
    method: 'post'
  })
}

export const pushCatalog = (id) => {
  return request({
    url: '/qs/platform/cascade/pushCatalog/' + id,
    method: 'post'
  })
}
