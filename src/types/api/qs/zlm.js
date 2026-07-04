/**
 * RTP推流服务参数
 * @typedef {Object} RTPServerParam
 * @property {number} [id] 主键ID
 * @property {any} [mediaServer] 媒体服务器信息
 * @property {any} [streamInfo] 流信息
 * @property {string} [app] 应用名
 * @property {string} [streamId] 流ID
 * @property {string} [presetSsrc] 预设的SSRC
 * @property {boolean} [ssrcCheck] 是否开启SSRC校验
 * @property {boolean} [playback] 是否为回放模式
 * @property {number} [port] 端口号
 * @property {boolean} [onlyAuto] 是否仅自动模式
 * @property {boolean} [disableAudio] 是否禁用音频
 * @property {boolean} [reUsePort] 是否复用端口
 * @property {string} [ssrc] SSRC字符串
 * @property {string} [type] 类型
 * @property {number} [tcpMode] TCP模式 0:不启用TCP监听 1:启用TCP监听 2:TCP主动连接模式
 */

/**
 * 截图参数
 * @typedef {Object} Snap
 * @property {string} app 应用名称
 * @property {string} stream 流ID / 流名称
 * @property {string} url 原始流地址
 */

/**
 * 拉流配置请求参数
 * @typedef {Object} PullConfig
 * @property {string} app 应用名称
 * @property {string} stream 流ID / 流名称
 * @property {string} url 原始 RTSP 流地址
 * @property {boolean} enable_audio 是否启用音频 false:不解析音频/静音 true:解析音频
 * @property {boolean} enable_mp4 是否启用 MP4 录制 false:不录制 true:开启录制
 * @property {string} rtp_type RTP传输类型 "0":UDP "1":TCP
 * @property {number} timeOut 拉流超时时间(单位：秒)
 */

/**
 * 流媒体节点配置信息
 * @typedef {Object} MediaServer
 * @property {string|null} createBy 创建人
 * @property {string} createTime 创建时间
 * @property {string|null} updateBy 更新人
 * @property {string} updateTime 更新时间
 * @property {string|null} remark 备注
 * @property {string} id 节点ID
 * @property {string} ip 服务IP
 * @property {string} hookIp Hook回调IP
 * @property {string} sdpIp SDP监听IP
 * @property {string} streamIp 流媒体监听IP
 * @property {number} httpPort HTTP端口
 * @property {number} httpSslPort HTTPS端口
 * @property {number} rtmpPort RTMP端口
 * @property {number} rtmpSslPort RTMPS端口
 * @property {number} rtpProxyPort RTP代理端口
 * @property {number} rtspPort RTSP端口
 * @property {number} rtspSslPort RTSPS端口
 * @property {number} flvPort HTTP-FLV端口
 * @property {number} flvSslPort HTTPS-FLV端口
 * @property {number} mp4Port HTTP-MP4端口
 * @property {string|null} mp4SslPort HTTPS-MP4端口
 * @property {number} wsFlvPort WS-FLV端口
 * @property {number} wsFlvSslPort WSS-FLV端口
 * @property {number} jttProxyPort JT/T1078代理端口
 * @property {boolean} autoConfig 是否自动配置
 * @property {string} secret 服务密钥
 * @property {string} type 服务类型
 * @property {boolean} rtpEnable 是否开启RTP接收
 * @property {string} rtpPortRange RTP接收端口范围
 * @property {string} sendRtpPortRange RTP发送端口范围
 * @property {number} recordAssistPort 录制辅助端口
 * @property {boolean} defaultServer 是否默认流媒体节点
 * @property {number} hookAliveInterval Hook心跳上报间隔
 * @property {string} recordPath 录像存储根目录
 * @property {number} recordDay 录像保存天数
 * @property {string|null} transcodeSuffix 转码流后缀
 * @property {string} serverId 服务唯一标识
 * @property {string} status 节点运行状态
 */

/**
 * 流编码及状态信息
 * @typedef {Object} MediaInfo
 * @property {string} app 应用名
 * @property {string} stream 流ID
 * @property {MediaServer} mediaServer 所属流媒体节点
 * @property {string} schema 传输协议类型
 * @property {number} readerCount 在线播放人数
 * @property {string} videoCodec 视频编码格式
 * @property {number} width 视频宽度
 * @property {number} height 视频高度
 * @property {number|null} fps 帧率
 * @property {number|null} loss 丢包率
 * @property {string|null} audioCodec 音频编码格式
 * @property {number|null} audioChannels 音频声道数
 * @property {number|null} audioSampleRate 音频采样率
 * @property {number|null} duration 流持续时长
 * @property {boolean} online 流是否在线
 * @property {number} originType 拉流源类型编码
 * @property {string} originTypeStr 拉流源类型描述
 * @property {string} originUrl 原始拉流地址
 * @property {number} aliveSecond 在线存活秒数
 * @property {number} bytesSpeed 码率(字节/秒)
 * @property {string|null} callId 会话ID
 * @property {Record<string, string>} paramMap 自定义扩展参数
 * @property {string} serverId 流媒体服务ID
 */

/**
 * 多格式播放地址响应对象
 * @typedef {Object} StreamContent
 * @property {string} app 应用名
 * @property {string} stream 流ID
 * @property {string|null} ip 流媒体节点IP
 * @property {string} flv HTTP-FLV播放地址
 * @property {string} https_flv HTTPS-FLV播放地址
 * @property {string} ws_flv WS-FLV播放地址
 * @property {string} wss_flv WSS-FLV播放地址
 * @property {string} fmp4 HTTP-FMP4播放地址
 * @property {string} https_fmp4 HTTPS-FMP4播放地址
 * @property {string} ws_fmp4 WS-FMP4播放地址
 * @property {string} wss_fmp4 WSS-FMP4播放地址
 * @property {string} hls HLS播放地址
 * @property {string} https_hls HTTPS-HLS播放地址
 * @property {string} ws_hls WS-HLS播放地址
 * @property {string} wss_hls WSS-HLS播放地址
 * @property {string} ts HTTP-TS播放地址
 * @property {string} https_ts HTTPS-TS播放地址
 * @property {string} ws_ts WS-TS播放地址
 * @property {string|null} wss_ts WSS-TS播放地址
 * @property {string} rtmp RTMP播放地址
 * @property {string|null} rtmps RTMPS播放地址
 * @property {string} rtsp RTSP播放地址
 * @property {string|null} rtsps RTSPS播放地址
 * @property {string} rtc WebRTC播放地址
 * @property {string} rtcs WebRTC加密播放地址
 * @property {string} mediaServerId 流媒体节点ID
 * @property {MediaInfo} mediaInfo 流详细编码与状态信息
 * @property {string|null} startTime 录像开始时间
 * @property {string|null} endTime 录像结束时间
 * @property {number|null} duration 录像时长
 * @property {string|null} downLoadFilePath 录像文件下载路径
 * @property {string|null} transcodeStream 转码流ID
 * @property {number} progress 回放播放进度
 * @property {string|null} key 流唯一标识
 * @property {string} serverId 服务ID
 */