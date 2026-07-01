import request from '@/router/axios'

// 拉流播放
export function streamPullPlay(data) {
  return request({
    url: '/zlm/streamPullPlay',
    method: 'post',
    data: data,
    timeout: 20000
  })
}

// 停止拉流播放
export function stopStreamPullPlay(data) {
  return request({
    url: '/zlm/stopStreamPullPlay',
    method: 'post',
    data: data,
    timeout: 20000
  })
}

// 获取截图
export function getSnap(data) {
  return request({
    url: '/zlm/getSnap',
    method: 'post',
    data: data,
    timeout: 20000
  })
}

// rtp播放
export function rtpPlay(data) {
  return request({
    url: '/zlm/rtpPlay',
    method: 'post',
    data: data,
    timeout: 20000
  })
}

// 停止rtp播放
export function stopRtpPlay(data) {
  return request({
    url: '/zlm/stopRtpPlay',
    method: 'post',
    data: data,
    timeout: 20000
  })
}

// 大华回放
export function rtpPlayback(data) {
  return request({
    url: '/zlm/rtpPlayback',
    method: 'post',
    data: data,
    timeout: 20000
  })
}

// 停止大华回放
export function stopRtpPlayback(data) {
  return request({
    url: '/zlm/stopRtpPlayback',
    method: 'post',
    data: data,
    timeout: 20000
  })
}

// ONVIF回放拉流播放
export function onvifPlayback(data) {
  return request({
    url: '/zlm/onvifPlayback',
    method: 'post',
    data: data,
    timeout: 20000
  })
}

// 停止ONVIF拉流播放
export function stopOnvifPlayback(data) {
  return request({
    url: '/zlm/stopStreamPullPlay',
    method: 'post',
    data: data,
    timeout: 20000
  })
}

// 获取流媒体服务器列表
export function getMediaServerList() {
  return request({
    url: '/zlm/list',
    method: 'get'
  })
}

// 移除流媒体服务
export function delMediaServer(id) {
  return request({
    url: '/zlm/delete/' + id,
    method: 'delete'
  })
}

// 保存流媒体服务
export function saveMediaServer(data) {
  return request({
    url: '/zlm/save',
    method: 'post',
    data: data
  })
}

// 测试流媒体服务
export function checkMediaServer(ip, port, secret, type) {
  return request({
    url: '/zlm/check',
    method: 'get',
    params: { ip: ip, port: port, secret: secret, type: type }
  })
}

// 获取流媒体服务
export function getMediaServer(id) {
  return request({
    url: '/zlm/one/' + id,
    method: 'get'
  })
}

// 获取流信息
export function getMediaInfo(app, stream, mediaServerId) {
  return request({
    url: '/zlm/media_info',
    method: 'get',
    params: { app: app, stream: stream, mediaServerId: mediaServerId }
  })
}

// 加载文件形成播放地址
export function loadRecord(id) {
  return request({
    url: '/zlm/loadRecord/' + id,
    method: 'get'
  })
}

// 关闭流文件形成播放地址
export function closeStreams(id) {
  return request({
    url: '/zlm/closeStreams/' + id,
    method: 'get'
  })
}

/**
 * 获取负载信息
 */
export function getMediaLoad() {
  return request({
    url: '/zlm/server/media_server/load',
    method: 'get'
  })
}

/**
 * 重启流媒体
 */
export function restartServer(id) {
  return request({
    url: '/zlm/restartServer/' + id,
    method: 'get'
  })
}

/**
 * 获取所有在线媒体服务器
 */
export function getAllOnlineMediaServe() {
  return request({
    url: '/zlm/getAllOnlineMediaServe',
    method: 'get'
  })
}
