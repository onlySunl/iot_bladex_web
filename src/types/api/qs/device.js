/**
 * @typedef {Object} PageDomain
 * @property {number} [pageNum] 页码
 * @property {number} [pageSize] 每页条数
 */

/**
 * @typedef {Object} BaseEntity
 * @property {string} [createBy] 创建者
 * @property {string} [createTime] 创建时间
 * @property {string} [updateBy] 更新者
 * @property {string} [updateTime] 更新时间
 * @property {string} [remark] 备注
 */

/**
 * 视频监控设备配置分页查询参数
 * @typedef {Object} DeviceQueryParams
 * @extends PageDomain
 * @property {string} [deviceName] 设备名称
 * @property {string} [ipAddress] IP地址
 * @property {string} [type] 直播流接入类型(1=RTSP,2=RTMP,3=FLV,4=HLS,5=ONVIF,6=视频文件,7=海康SDK,8=海康ISUP,9=大华SDK,10=宇视SDK,11=天地伟业SDK,12=国标28181,13=PUSH,14=部标1078)
 * @property {string} [status] 状态(ENABLE/DEACTIVATE)
 * @property {string} [deviceStatus] 设备状态(OFFLINE=离线,ON=在线)
 */

/**
 * 视频监控设备配置信息
 * @typedef {Object} QsDevice
 * @extends BaseEntity
 * @property {number} [id] 主键ID
 * @property {string} [deviceCode] 设备唯一标识
 * @property {string} [deviceName] 设备名称
 * @property {string} [ipAddress] IP地址
 * @property {number} [port] 端口号
 * @property {string} [userName] 用户名
 * @property {string} [password] 密码
 * @property {string} [type] 直播流接入类型
 * @property {number} [deviceType] 设备类型(0=IPC, 1=NVR)
 * @property {string} [liveAddress] 直播流地址
 * @property {number} [channel] 通道号
 * @property {number} [alarmChannelId] 报警通道号
 * @property {string} [status] 状态(ENABLE/DEACTIVATE)
 * @property {string} [streamType] 码流类型(1=主码流,2=子码流,3=第三码流)
 * @property {string} [longitude] 经度
 * @property {string} [latitude] 纬度
 * @property {string} [gbCode] 国标编码
 * @property {string} [protocol] 传输协议(UDP/TCP)
 * @property {string} [deviceStatus] 设备状态(OFFLINE=离线,ON=在线)
 * @property {string} [onlineType] 上线类型(1=主动添加, 2=主动注册)
 * @property {string} [enableAudio] 开启音频(0=关闭, 1=开启)
 * @property {string} [enableMp4] 开启mp4录制(0=关闭, 1=开启)
 * @property {string} [streamStatus] 流状态(0=停止,1=直播中)
 * @property {string} [mediaServerId] 当前拉流使用的流媒体服务ID
 * @property {string} [streamKey] 拉流代理时zlm返回的key，用于停止拉流代理
 * @property {string} [enableDisableNoneReader] 是否无人观看时自动停用
 * @property {string} [snap] 截图
 * @property {string} [flvType] flv 类型（ws/flv）
 * @property {string} [onvifAuth] omvif 验证类型（1=WS-UsernameToken,2=Digest）
 * @property {string} [onvifHostName] onvif 主机名
 * @property {string} [manufacturer] 生产厂商
 * @property {string} [address] 安装地址
 * @property {number} [ptzType] 摄像机结构类型,1-球机;2-半球;3-固定枪机;4-遥控枪机;5-遥控半球;6-多目设备的全景/拼接通道;7-多目设备的分割通道
 * @property {string} [gbDeviceId] gb设备id
 * @property {string} [gbChannelId] gb通道id
 * @property {string} [streamMode] 数据流传输模式 UDP/TCP-ACTIVE/TCP-PASSIVE
 * @property {string} [jtMobileNo] JT1078-手机号
 * @property {string} [jtPlateNo] JT1078-车牌号
 * @property {string} [jtPlateColor] JT1078-车牌颜色
 * @property {number} [subscribeCatalogStatus] 目录订阅状态 0=未订阅 1=已订阅
 * @property {number} [subscribeAlarmStatus] 报警订阅状态 0=未订阅 1=已订阅
 * @property {string} [subscribeTime] 订阅时间
 */

/**
 * 录制计划-添加/编辑参数
 * @typedef {Object} RecordPlanParam
 * @property {number[]} [deviceIds] 关联的设备ID列表，会为设备下的所有通道关联此录制计划，channelId存在则此项不生效
 * @property {boolean} [allLink] 全部关联 / 全部取消关联
 * @property {number} [planId] 录制计划ID，ID为空表示删除关联的计划
 */