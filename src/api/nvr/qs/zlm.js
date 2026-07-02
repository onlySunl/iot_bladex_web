import request from '@/axios';
import {MediaInfo, MediaServer, PullConfig, RTPServerParam, Snap, StreamContent} from "@/types/api";
import {AjaxResult} from "@/types/common";

// 拉流播放
export const streamPullPlay = (data: PullConfig) => {
    return request({
        url: '/zlm/streamPullPlay',
        method: 'post',
        data,
        timeout: 20000
    })
}

// 停止拉流播放
export const stopStreamPullPlay = (data: PullConfig) => {
    return request({
        url: '/zlm/stopStreamPullPlay',
        method: 'post',
        data,
        timeout: 20000
    })
}

// 获取截图
export const getSnap = (data: Snap) => {
    return request({
        url: '/zlm/getSnap',
        method: 'post',
        data,
        timeout: 20000
    })
}

// rtp播放
export const rtpPlay = (data: RTPServerParam) => {
    return request({
        url: '/zlm/rtpPlay',
        method: 'post',
        data,
        timeout: 20000
    })
}

// 停止rtp播放
export const stopRtpPlay = (data: RTPServerParam) => {
    return request({
        url: '/zlm/stopRtpPlay',
        method: 'post',
        data,
        timeout: 20000
    })
}

// 大华回放
export const rtpPlayback = (data: RTPServerParam) => {
    return request({
        url: '/zlm/rtpPlayback',
        method: 'post',
        data,
        timeout: 20000
    })
}

// 停止大华回放
export const stopRtpPlayback = (data: RTPServerParam) => {
    return request({
        url: '/zlm/stopRtpPlayback',
        method: 'post',
        data,
        timeout: 20000
    })
}

// ONVIF回放拉流播放
export const onvifPlayback = (data) => {
    return request({
        url: '/zlm/onvifPlayback',
        method: 'post',
        data,
        timeout: 20000
    })
}

// 停止ONVIF拉流播放
export const stopOnvifPlayback = (data) => {
    return request({
        url: '/zlm/stopStreamPullPlay',
        method: 'post',
        data,
        timeout: 20000
    })
}


// 获取流媒体服务器列表
export const getMediaServerList = () => {
    return request({
        url: '/zlm/list',
        method: 'get',
    })
}

// 移除流媒体服务
export const delMediaServer = (id) => {
    return request({
        url: '/zlm/delete/' + id,
        method: 'delete',
    })
}

// 保存流媒体服务
export const saveMediaServer = (data: MediaServer) => {
    return request({
        url: '/zlm/save',
        method: 'post',
        data
    })
}

// 测试流媒体服务
export const checkMediaServer = (ip, port, secret, type) => {
    return request({
        url: '/zlm/check',
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
export const getMediaServer = (id) => {
    return request({
        url: '/zlm/one/' + id,
        method: 'get',
    })
}

// 获取流信息
export const getMediaInfo = (app, stream, mediaServerId) => {
    return request({
        url: '/zlm/media_info',
        method: 'get',
        params: {
            app,
            stream,
            mediaServerId,
        }
    })
}

// 加载文件形成播放地址
export const loadRecord = (id) => {
    return request({
        url: '/zlm/loadRecord/' + id,
        method: 'get',
    })
}

// 关闭流文件形成播放地址
export const closeStreams = (id) => {
    return request({
        url: '/zlm/closeStreams/' + id,
        method: 'get',
    })
}

/**
 * 获取负载信息
 */
export const getMediaLoad = () => {
    return request({
        url: '/zlm/server/media_server/load',
        method: 'get',
    })
}

/**
 * 重启流媒体
 */
export const restartServer = (id) => {
    return request({
        url: '/zlm/restartServer/' + id,
        method: 'get',
    })
}

/**
 * 获取所有在线媒体服务器
 */
export const getAllOnlineMediaServe = () => {
    return request({
        url: '/zlm/getAllOnlineMediaServe',
        method: 'get',
    })
}

/**
 * 生成推流地址
 */
export const getStreamPushAddress = (id, callId) => {
    return request({
        url: '/zlm/getStreamPushAddress/' + id,
        method: 'get',
        params: {
            callId
        }
    })
}

/**
 * 推流播放
 */
export const streamPullPush = (id) => {
    return request({
        url: '/zlm/streamPullPush',
        method: 'get',
        params: {
            id
        }
    })
}

/**
 * gb28181 播放
 */
export const startGb28181Play = (id) => {
    return request({
        url: '/zlm/startGb28181Play/' + id,
        method: 'get',
    })
}

/**
 * gb28181 停止点播
 */
export const stopGb28181Play = (id) => {
    return request({
        url: '/zlm/stopGb28181Play/' + id,
        method: 'get',
    })
}

/**
 * gb28181 回放
 */
export const startGb28181Playback = (id, startTime, endTime) => {
    return request({
        url: '/zlm/startGb28181Playback/' + id,
        method: 'get',
        params: { startTime, endTime },
        timeout: 20000
    })
}

/**
 * gb28181 停止回放
 */
export const stopGb28181Playback = (id) => {
    return request({
        url: '/zlm/stopGb28181Playback/' + id,
        method: 'get',
    })
}

/**
 * jt1078 播放
 */
export const startJt1078Play = (id) => {
    return request({
        url: '/zlm/startJt1078Play/' + id,
        method: 'get',
    })
}

/**
 * jt1078 停止点播
 */
export const stopJt1078Play = (id) => {
    return request({
        url: '/zlm/stopJt1078Play/' + id,
        method: 'get',
    })
}
