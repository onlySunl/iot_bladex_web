import request from '@/router/axios'

// 拉流播放
export const streamPullPlay = (data) => {
  return request({
    url: '/api/zlm/streamPullPlay',
    method: 'post',
    data,
    timeout: 20000
  })
}

// 停止拉流播放
export const stopStreamPullPlay = (data) => {
  return request({
    url: '/api/zlm/stopStreamPullPlay',
    method: 'post',
    data,
    timeout: 20000
  })
}

// 获取截图
export const getSnap = (data) => {
  return request({
    url: '/api/zlm/getSnap',
    method: 'post',
    data,
    timeout: 20000
  })
}

// rtp播放
export const rtpPlay = (data) => {
  return request({
    url: '/api/zlm/rtpPlay',
    method: 'post',
    data,
    timeout: 20000
  })
}

// 停止rtp播放
export const stopRtpPlay = (data) => {
  return request({
    url: '/api/zlm/stopRtpPlay',
    method: 'post',
    data,
    timeout: 20000
  })
}

// 大华回放
export const rtpPlayback = (data) => {
  return request({
    url: '/api/zlm/rtpPlayback',
    method: 'post',
    data,
    timeout: 20000
  })
}

// 停止大华回放
export const stopRtpPlayback = (data) => {
  return request({
    url: '/api/zlm/stopRtpPlayback',
    method: 'post',
    data,
    timeout: 20000
  })
}

// ONVIF回放
export const onvifPlayback = (data) => {
  return request({
    url: '/api/zlm/onvifPlayback',
    method: 'post',
    data,
    timeout: 20000
  })
}

// 停止ONVIF回放
export const stopOnvifPlayback = (data) => {
  return request({
    url: '/api/zlm/stopStreamPullPlay',
    method: 'post',
    data,
    timeout: 20000
  })
}

// 获取流媒体服务器列表
export const getMediaServerList = () => {
  return request({
    url: '/api/zlm/list',
    method: 'get'
  })
}

// 移除流媒体服务
export const delMediaServer = (id) => {
  return request({
    url: '/api/zlm/delete/' + id,
    method: 'delete'
  })
}

// 保存流媒体服务
export const saveMediaServer = (data) => {
  return request({
    url: '/api/zlm/save',
    method: 'post',
    data
  })
}

// 测试流媒体服务
export const checkMediaServer = (ip, port, secret, type) => {
  return request({
    url: '/api/zlm/check',
    method: 'get',
    params: { ip, port, secret, type }
  })
}

// 获取流媒体服务
export const getMediaServer = (id) => {
  return request({
    url: '/api/zlm/one/' + id,
    method: 'get'
  })
}

// 获取流信息
export const getMediaInfo = (app, stream, mediaServerId) => {
  return request({
    url: '/api/zlm/media_info',
    method: 'get',
    params: { app, stream, mediaServerId }
  })
}

// 加载文件形成播放地址
export const loadRecord = (id) => {
  return request({
    url: '/api/zlm/loadRecord/' + id,
    method: 'get'
  })
}

// 关闭流
export const closeStreams = (id) => {
  return request({
    url: '/api/zlm/closeStreams/' + id,
    method: 'get'
  })
}

// 获取负载信息
export const getMediaLoad = () => {
  return request({
    url: '/api/zlm/server/media_server/load',
    method: 'get'
  })
}

// 重启流媒体
export const restartServer = (id) => {
  return request({
    url: '/api/zlm/restartServer/' + id,
    method: 'get'
  })
}

// 获取所有在线媒体服务器
export const getAllOnlineMediaServe = () => {
  return request({
    url: '/api/zlm/getAllOnlineMediaServe',
    method: 'get'
  })
}
