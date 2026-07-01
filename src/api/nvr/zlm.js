import request from '@/router/axios'

// 拉流播放
export function streamPullPlay(data) {
    return request({
        url: '/api/zlm/streamPullPlay',
        method: 'post',
        data,
        timeout: 20000
    })
}

// 停止拉流播放
export function stopStreamPullPlay(data) {
    return request({
        url: '/api/zlm/stopStreamPullPlay',
        method: 'post',
        data,
        timeout: 20000
    })
}

// 获取截图
export function getSnap(data) {
    return request({
        url: '/api/zlm/getSnap',
        method: 'post',
        data,
        timeout: 20000
    })
}

// rtp播放
export function rtpPlay(data) {
    return request({
        url: '/api/zlm/rtpPlay',
        method: 'post',
        data,
        timeout: 20000
    })
}

// 停止rtp播放
export function stopRtpPlay(data) {
    return request({
        url: '/api/zlm/stopRtpPlay',
        method: 'post',
        data,
        timeout: 20000
    })
}

// 大华回放
export function rtpPlayback(data) {
    return request({
        url: '/api/zlm/rtpPlayback',
        method: 'post',
        data,
        timeout: 20000
    })
}

// 停止大华回放
export function stopRtpPlayback(data) {
    return request({
        url: '/api/zlm/stopRtpPlayback',
        method: 'post',
        data,
        timeout: 20000
    })
}

// ONVIF回放拉流播放
export function onvifPlayback(data) {
    return request({
        url: '/api/zlm/onvifPlayback',
        method: 'post',
        data,
        timeout: 20000
    })
}

// 停止ONVIF拉流播放
export function stopOnvifPlayback(data) {
    return request({
        url: '/api/zlm/stopStreamPullPlay',
        method: 'post',
        data,
        timeout: 20000
    })
}

// 获取流媒体服务器列表
export function getMediaServerList() {
    return request({
        url: '/api/zlm/list',
        method: 'get',
    })
}

// 移除流媒体服务
export function delMediaServer(id) {
    return request({
        url: '/api/zlm/delete/' + id,
        method: 'delete',
    })
}

// 保存流媒体服务
export function saveMediaServer(data) {
    return request({
        url: '/api/zlm/save',
        method: 'post',
        data
    })
}

// 测试流媒体服务
export function checkMediaServer(ip, port, secret, type) {
    return request({
        url: '/api/zlm/check',
        method: 'get',
        params: {
            ip,
            port,
            secret,
            type,
        }
    })
}

// 获取流媒体服务
export function getMediaServer(id) {
    return request({
        url: '/api/zlm/one/' + id,
        method: 'get',
    })
}

// 获取流信息
export function getMediaInfo(app, stream, mediaServerId) {
    return request({
        url: '/api/zlm/media_info',
        method: 'get',
        params: {
            app,
            stream,
            mediaServerId,
        }
    })
}

// 加载文件形成播放地址
export function loadRecord(id) {
    return request({
        url: '/api/zlm/loadRecord/' + id,
        method: 'get',
    })
}

// 关闭流文件形成播放地址
export function closeStreams(id) {
    return request({
        url: '/api/zlm/closeStreams/' + id,
        method: 'get',
    })
}

/**
 * 获取负载信息
 */
export function getMediaLoad() {
    return request({
        url: '/api/zlm/server/media_server/load',
        method: 'get',
    })
}

/**
 * 重启流媒体
 */
export function restartServer(id) {
    return request({
        url: '/api/zlm/restartServer/' + id,
        method: 'get',
    })
}

/**
 * 获取所有在线媒体服务器
 */
export function getAllOnlineMediaServe() {
    return request({
        url: '/api/zlm/getAllOnlineMediaServe',
        method: 'get',
    })
}

/**
 * 生成推流地址
 */
export function getStreamPushAddress(id, callId) {
    return request({
        url: '/api/zlm/getStreamPushAddress/' + id,
        method: 'get',
        params: {
            callId
        }
    })
}

/**
 * 推流播放
 */
export function streamPullPush(id) {
    return request({
        url: '/api/zlm/streamPullPush',
        method: 'get',
        params: {
            id
        }
    })
}

/**
 * gb28181 播放
 */
export function startGb28181Play(id) {
    return request({
        url: '/api/zlm/startGb28181Play/' + id,
        method: 'get',
    })
}

/**
 * gb28181 停止点播
 */
export function stopGb28181Play(id) {
    return request({
        url: '/api/zlm/stopGb28181Play/' + id,
        method: 'get',
    })
}

/**
 * gb28181 回放
 */
export function startGb28181Playback(id, startTime, endTime) {
    return request({
        url: '/api/zlm/startGb28181Playback/' + id,
        method: 'get',
        params: { startTime, endTime },
        timeout: 20000
    })
}

/**
 * gb28181 停止回放
 */
export function stopGb28181Playback(id) {
    return request({
        url: '/api/zlm/stopGb28181Playback/' + id,
        method: 'get',
    })
}

/**
 * jt1078 播放
 */
export function startJt1078Play(id) {
    return request({
        url: '/api/zlm/startJt1078Play/' + id,
        method: 'get',
    })
}

/**
 * jt1078 停止点播
 */
export function stopJt1078Play(id) {
    return request({
        url: '/api/zlm/stopJt1078Play/' + id,
        method: 'get',
    })
}
