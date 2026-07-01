
/**
 * 截图参数
 */

/**
 * 拉流配置请求参数
 */

/**
 * 流媒体节点配置信息
 */

/**
 * 流编码及状态信息
 */

/**
 * 流地址响应对象
 */
export interface StreamContent {
    app: string;
    stream: string;
    ip: string | null;
    flv: string;
    https_flv: string;
    ws_flv: string;
    wss_flv: string;
    fmp4: string;
    https_fmp4: string;
    ws_fmp4: string;
    wss_fmp4: string;
    hls: string;
    https_hls: string;
    ws_hls: string;
    wss_hls: string;
    ts: string;
    https_ts: string;
    ws_ts: string;
    wss_ts: string | null;
    rtmp: string;
    rtmps: string | null;
    rtsp: string;
    rtsps: string | null;
    rtc: string;
    rtcs: string;
    mediaServerId: string;
    mediaInfo: MediaInfo;
    startTime: string | null;
    endTime: string | null;
    duration: number | null;
    downLoadFilePath: string | null;
    transcodeStream: string | null;
    progress: number;
    key: string | null;
    serverId: string;
}