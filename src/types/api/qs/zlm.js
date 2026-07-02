/**
 * RTPServerParam
 * @property {number} id
 * @property {any; // 建议替换为具体的 ZlmMediaServer 类型} mediaServer
 * @property {any; // 建议替换为具体的 StreamInfo 类型} streamInfo
 * @property {string} app
 * @property {string} streamId
 * @property {string} presetSsrc
 * @property {boolean} ssrcCheck
 * @property {boolean} playback
 * @property {number} port
 * @property {boolean} onlyAuto
 * @property {boolean} disableAudio
 * @property {boolean} reUsePort
 * @property {string} ssrc
 * @property {string} type
 * @property {number} tcpMode
 */

/**
 * 截图参数
 */
/**
 * Snap
 * @property {string} app
 * @property {string} stream
 * @property {string} url
 */

/**
 * 拉流配置请求参数
 */
/**
 * PullConfig
 * @property {string} app
 * @property {string} stream
 * @property {string} url
 * @property {boolean} enable_audio
 * @property {boolean} enable_mp4
 * @property {string} rtp_type
 * @property {number} timeOut
 */

/**
 * 流媒体节点配置信息
 */
/**
 * MediaServer
 * @property {string | null} createBy
 * @property {string} createTime
 * @property {string | null} updateBy
 * @property {string} updateTime
 * @property {string | null} remark
 * @property {string} id
 * @property {string} ip
 * @property {string} hookIp
 * @property {string} sdpIp
 * @property {string} streamIp
 * @property {number} httpPort
 * @property {number} httpSslPort
 * @property {number} rtmpPort
 * @property {number} rtmpSslPort
 * @property {number} rtpProxyPort
 * @property {number} rtspPort
 * @property {number} rtspSslPort
 * @property {number} flvPort
 * @property {number} flvSslPort
 * @property {number} mp4Port
 * @property {string | null} mp4SslPort
 * @property {number} wsFlvPort
 * @property {number} wsFlvSslPort
 * @property {number} jttProxyPort
 * @property {boolean} autoConfig
 * @property {string} secret
 * @property {string} type
 * @property {boolean} rtpEnable
 * @property {string} rtpPortRange
 * @property {string} sendRtpPortRange
 * @property {number} recordAssistPort
 * @property {boolean} defaultServer
 * @property {number} hookAliveInterval
 * @property {string} recordPath
 * @property {number} recordDay
 * @property {string | null} transcodeSuffix
 * @property {string} serverId
 * @property {string} status
 */

/**
 * 流编码及状态信息
 */
/**
 * MediaInfo
 * @property {string} app
 * @property {string} stream
 * @property {MediaServer} mediaServer
 * @property {string} schema
 * @property {number} readerCount
 * @property {string} videoCodec
 * @property {number} width
 * @property {number} height
 * @property {number | null} fps
 * @property {number | null} loss
 * @property {string | null} audioCodec
 * @property {number | null} audioChannels
 * @property {number | null} audioSampleRate
 * @property {number | null} duration
 * @property {boolean} online
 * @property {number} originType
 * @property {string} originTypeStr
 * @property {string} originUrl
 * @property {number} aliveSecond
 * @property {number} bytesSpeed
 * @property {string | null} callId
 * @property {Record} paramMap
 * @property {string} serverId
 */

/**
 * 流地址响应对象
 */
/**
 * StreamContent
 * @property {string} app
 * @property {string} stream
 * @property {string | null} ip
 * @property {string} flv
 * @property {string} https_flv
 * @property {string} ws_flv
 * @property {string} wss_flv
 * @property {string} fmp4
 * @property {string} https_fmp4
 * @property {string} ws_fmp4
 * @property {string} wss_fmp4
 * @property {string} hls
 * @property {string} https_hls
 * @property {string} ws_hls
 * @property {string} wss_hls
 * @property {string} ts
 * @property {string} https_ts
 * @property {string} ws_ts
 * @property {string | null} wss_ts
 * @property {string} rtmp
 * @property {string | null} rtmps
 * @property {string} rtsp
 * @property {string | null} rtsps
 * @property {string} rtc
 * @property {string} rtcs
 * @property {string} mediaServerId
 * @property {MediaInfo} mediaInfo
 * @property {string | null} startTime
 * @property {string | null} endTime
 * @property {number | null} duration
 * @property {string | null} downLoadFilePath
 * @property {string | null} transcodeStream
 * @property {number} progress
 * @property {string | null} key
 * @property {string} serverId
 */
