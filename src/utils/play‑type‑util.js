import { streamPullPlay, loadRecord, rtpPlay, startGb28181Play, startJt1078Play, streamPullPush } from '@/api/nvr/zlm'

const PLAY_TYPE_CONFIG = {
    1: { api: streamPullPlay, app: 'rtsp', ptz: false },
    2: { api: streamPullPlay, app: 'rtmp', ptz: false },
    3: { api: streamPullPlay, app: 'flv', ptz: false, needConvertWsUrl: true },
    4: { api: streamPullPlay, app: 'hls', ptz: false },
    5: { api: streamPullPlay, app: 'onvif', ptz: true },
    6: { api: loadRecord, needSnap: true },
    7: { api: rtpPlay, app: 'haikang', speed: { min: 1, val: 5, max: 10 }, ptz: true, needTcpMode: true },
    8: { api: rtpPlay, app: 'haikang_isup', speed: { min: 1, val: 5, max: 5 }, ptz: true, needTcpMode: true },
    9: { api: rtpPlay, app: 'dahua', speed: { min: 1, val: 5, max: 15 }, ptz: true, needTcpMode: true },
    12: { api: startGb28181Play, ptz: true, gb28181: true },
    14: { api: startJt1078Play, speedMax: 255, ptz: true },
    13: { api: streamPullPush, singleId: true }
}

/**
 * 获取对应类型的配置对象，不存在返回null
 * @param {number} type 播放类型
 * @returns {object|null}
 */
export function getPlayConfig(type) {
    return PLAY_TYPE_CONFIG[type] ?? null
}

/**
 * 获取播放接口函数
 * @param {number} type
 * @returns {Function|null}
 */
export function getPlayApi(type) {
    const config = getPlayConfig(type)
    return config?.api ?? null
}

/**
 * 判断是否支持云台PTZ
 * @param {number} type
 * @returns {boolean}
 */
export function hasPtz(type) {
    const config = getPlayConfig(type)
    return Boolean(config?.ptz)
}

/**
 * 是否需要转换Ws‑Flv地址
 * @param {number} type
 * @returns {boolean}
 */
export function needConvertWsUrl(type) {
    const config = getPlayConfig(type)
    return Boolean(config?.needConvertWsUrl)
}

/**
 * 是否录像回放模式(type=6)
 * @param {number} type
 * @returns {boolean}
 */
export function isRecordPlay(type) {
    const config = getPlayConfig(type)
    return Boolean(config?.needSnap)
}

/**
 * 是否启用TCP模式(海康大华RTP播放)
 * @param {number} type
 * @returns {boolean}
 */
export function needTcpMode(type) {
    const config = getPlayConfig(type)
    return Boolean(config?.needTcpMode)
}

/**
 * 获取倍速配置 {min,val,max}
 * @param {number} type
 * @returns {object|null}
 */
export function getSpeedConfig(type) {
    const config = getPlayConfig(type)
    return config?.speed ?? null
}

/**
 * 获取app标识 rtsp/rtmp/flv/hls/haikang等
 * @param {number} type
 * @returns {string|null}
 */
export function getAppType(type) {
    const config = getPlayConfig(type)
    return config?.app ?? null
}

/**
 * 是否GB28181播放
 * @param {number} type
 * @returns {boolean}
 */
export function isGb28181(type) {
    const config = getPlayConfig(type)
    return Boolean(config?.gb28181)
}

/**
 * 获取JT1078最大倍速
 * @param {number} type
 * @returns {number|null}
 */
export function getJtSpeedMax(type) {
    const config = getPlayConfig(type)
    return config?.speedMax ?? null
}

/**
 * 是否单ID推送模式
 * @param {number} type
 * @returns {boolean}
 */
export function isSingleId(type) {
    const config = getPlayConfig(type)
    return Boolean(config?.singleId)
}

export { PLAY_TYPE_CONFIG }