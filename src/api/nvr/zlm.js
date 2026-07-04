import request from '@/axios'

/**
 * @typedef {import("@/types/api").MediaInfo} MediaInfo
 * @typedef {import("@/types/api").MediaServer} MediaServer
 * @typedef {import("@/types/api").PullConfig} PullConfig
 * @typedef {import("@/types/api").RTPServerParam} RTPServerParam
 * @typedef {import("@/types/api").Snap} Snap
 * @typedef {import("@/types/api").StreamContent} StreamContent
 * @typedef {import("@/types").AjaxResult} AjaxResult
 */

/**
 * RTSP拉流播放
 * @param {PullConfig} data 拉流配置参数
 * @returns {Promise<AjaxResult<StreamContent>>}
 */
export function streamPullPlay(data) {
    return request({
        url: '/zlm/streamPullPlay',
        method: 'post',
        data,
        timeout: 20000
    })
}

/**
 * 停止RTSP拉流
 * @param {PullConfig} data 拉流配置参数
 * @returns {Promise<AjaxResult>}
 */
export function stopStreamPullPlay(data) {
    return request({
        url: '/zlm/stopStreamPullPlay',
        method: 'post',
        data,
        timeout: 20000
    })
}

/**
 * 视频流截图
 * @param {Snap} data 截图参数
 * @returns {Promise<AjaxResult>}
 */
export function getSnap(data) {
    return request({
        url: '/zlm/getSnap',
        method: 'post',
        data,
        timeout: 20000
    })
}

/**
 * RTP实时预览播放
 * @param {RTPServerParam} data RTP服务参数
 * @returns {Promise<AjaxResult<StreamContent>>}
 */
export function rtpPlay(data) {
    return request({
        url: '/zlm/rtpPlay',
        method: 'post',
        data,
        timeout: 20000
    })
}

/**
 * 停止RTP实时预览
 * @param {RTPServerParam} data RTP服务参数
 * @returns {Promise<AjaxResult>}
 */
export function stopRtpPlay(data) {
    return request({
        url: '/zlm/stopRtpPlay',
        method: 'post',
        data,
        timeout: 20000
    })
}

/**
 * 大华设备RTP回放
 * @param {RTPServerParam} data RTP服务参数
 * @returns {Promise<AjaxResult<StreamContent>>}
 */
export function rtpPlayback(data) {
    return request({
        url: '/zlm/rtpPlayback',
        method: 'post',
        data,
        timeout: 20000
    })
}

/**
 * 停止大华RTP回放
 * @param {RTPServerParam} data RTP服务参数
 * @returns {Promise<AjaxResult>}
 */
export function stopRtpPlayback(data) {
    return request({
        url: '/zlm/stopRtpPlayback',
        method: 'post',
        data,
        timeout: 20000
    })
}

/**
 * ONVIF录像回放拉流
 * @param {Object} data 回放参数
 * @returns {Promise<AjaxResult<StreamContent>>}
 */
export function onvifPlayback(data) {
    return request({
        url: '/zlm/onvifPlayback',
        method: 'post',
        data,
        timeout: 20000
    })
}

/**
 * 停止ONVIF回放拉流
 * @param {Object} data 回放参数
 * @returns {Promise<AjaxResult>}
 */
export function stopOnvifPlayback(data) {
    return request({
        url: '/zlm/stopStreamPullPlay',
        method: 'post',
        data,
        timeout: 20000
    })
}

/**
 * 获取所有流媒体服务节点列表
 * @returns {Promise<AjaxResult<MediaServer[]>>}
 */
export function getMediaServerList() {
    return request({
        url: '/zlm/list',
        method: 'get'
    })
}

/**
 * 删除流媒体服务节点
 * @param {string} id 服务节点ID
 * @returns {Promise<AjaxResult>}
 */
export function delMediaServer(id) {
    return request({
        url: `/zlm/delete/${id}`,
        method: 'delete'
    })
}

/**
 * 新增/编辑保存流媒体服务配置
 * @param {MediaServer} data 流媒体节点配置
 * @returns {Promise<AjaxResult>}
 */
export function saveMediaServer(data) {
    return request({
        url: '/zlm/save',
        method: 'post',
        data
    })
}

/**
 * 测试流媒体服务连通性
 * @param {string} ip 服务IP
 * @param {number} port 服务端口
 * @param {string} secret 密钥
 * @param {string} type 服务类型
 * @returns {Promise<AjaxResult>}
 */
export function checkMediaServer(ip, port, secret, type) {
    return request({
        url: '/zlm/check',
        method: 'get',
        params: {
            ip,
            port,
            secret,
            type
        }
    })
}

/**
 * 根据ID获取单个流媒体服务详情
 * @param {string} id 服务节点ID
 * @returns {Promise<AjaxResult<MediaServer>>}
 */
export function getMediaServer(id) {
    return request({
        url: `/zlm/one/${id}`,
        method: 'get'
    })
}

/**
 * 获取指定流的详细媒体编码信息
 * @param {string} app 应用名
 * @param {string} stream 流ID
 * @param {string} mediaServerId 流媒体节点ID
 * @returns {Promise<AjaxResult<MediaInfo>>}
 */
export function getMediaInfo(app, stream, mediaServerId) {
    return request({
        url: '/zlm/media_info',
        method: 'get',
        params: {
            app,
            stream,
            mediaServerId
        }
    })
}

/**
 * 加载云端录像文件生成播放地址
 * @param {string} id 录像记录ID
 * @returns {Promise<AjaxResult<StreamContent>>}
 */
export function loadRecord(id) {
    return request({
        url: `/zlm/loadRecord/${id}`,
        method: 'get'
    })
}

/**
 * 关闭录像播放流、释放资源
 * @param {string} id 录像记录ID
 * @returns {Promise<AjaxResult>}
 */
export function closeStreams(id) {
    return request({
        url: `/zlm/closeStreams/${id}`,
        method: 'get'
    })
}

/**
 * 获取流媒体服务负载信息
 * @returns {Promise<AjaxResult>}
 */
export function getMediaLoad() {
    return request({
        url: '/zlm/server/media_server/load',
        method: 'get'
    })
}

/**
 * 重启指定流媒体服务节点
 * @param {string} id 服务节点ID
 * @returns {Promise<AjaxResult>}
 */
export function restartServer(id) {
    return request({
        url: `/zlm/restartServer/${id}`,
        method: 'get'
    })
}

/**
 * 获取所有在线的流媒体服务节点
 * @returns {Promise<AjaxResult>}
 */
export function getAllOnlineMediaServe() {
    return request({
        url: '/zlm/getAllOnlineMediaServe',
        method: 'get'
    })
}

/**
 * 生成设备推流地址
 * @param {number} id 设备ID
 * @param {string} callId 会话ID
 * @returns {Promise<AjaxResult>}
 */
export function getStreamPushAddress(id, callId) {
    return request({
        url: `/zlm/getStreamPushAddress/${id}`,
        method: 'get',
        params: {
            callId
        }
    })
}

/**
 * 主动拉取推流进行播放
 * @param {number} id 设备ID
 * @returns {Promise<AjaxResult>}
 */
export function streamPullPush(id) {
    return request({
        url: '/zlm/streamPullPush',
        method: 'get',
        params: {
            id
        }
    })
}

/**
 * GB28181设备实时预览播放
 * @param {number} id 设备通道ID
 * @returns {Promise<AjaxResult<StreamContent>>}
 */
export function startGb28181Play(id) {
    return request({
        url: `/zlm/startGb28181Play/${id}`,
        method: 'get'
    })
}

/**
 * 停止GB28181实时预览
 * @param {number} id 设备通道ID
 * @returns {Promise<AjaxResult>}
 */
export function stopGb28181Play(id) {
    return request({
        url: `/zlm/stopGb28181Play/${id}`,
        method: 'get'
    })
}

/**
 * GB28181录像回放
 * @param {number} id 通道ID
 * @param {string} startTime 开始时间
 * @param {string} endTime 结束时间
 * @returns {Promise<AjaxResult<StreamContent>>}
 */
export function startGb28181Playback(id, startTime, endTime) {
    return request({
        url: `/zlm/startGb28181Playback/${id}`,
        method: 'get',
        params: { startTime, endTime },
        timeout: 20000
    })
}

/**
 * 停止GB28181录像回放
 * @param {number} id 通道ID
 * @returns {Promise<AjaxResult>}
 */
export function stopGb28181Playback(id) {
    return request({
        url: `/zlm/stopGb28181Playback/${id}`,
        method: 'get'
    })
}

/**
 * JT1078车载设备实时播放
 * @param {number} id 通道ID
 * @returns {Promise<AjaxResult<StreamContent>>}
 */
export function startJt1078Play(id) {
    return request({
        url: `/zlm/startJt1078Play/${id}`,
        method: 'get'
    })
}

/**
 * 停止JT1078实时播放
 * @param {number} id 通道ID
 * @returns {Promise<AjaxResult>}
 */
export function stopJt1078Play(id) {
    return request({
        url: `/zlm/stopJt1078Play/${id}`,
        method: 'get'
    })
}