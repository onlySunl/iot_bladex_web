/**
 * 国标设备/平台
 * @typedef {Object} Gb28181Device
 * @property {number} [id] 数据库自增ID
 * @property {string} [deviceId] 设备国标编号
 * @property {string} [name] 名称
 * @property {string} [manufacturer] 生产厂商
 * @property {string} [model] 型号
 * @property {string} [firmware] 固件版本
 * @property {string} [transport] 传输协议（UDP/TCP）
 * @property {string} [streamMode] 数据流传输模式 UDP/TCP-ACTIVE/TCP-PASSIVE
 * @property {string} [ip] IP地址
 * @property {number} [port] 端口
 * @property {string} [hostAddress] wan地址
 * @property {boolean} [onLine] 是否在线，true在线，false离线
 * @property {string} [registerTime] 注册时间
 * @property {string} [keepaliveTime] 心跳时间
 * @property {number} [heartBeatInterval] 心跳间隔
 * @property {number} [heartBeatCount] 心跳超时次数
 * @property {number} [positionCapability] 定位功能支持：0不支持、1GPS、2北斗
 * @property {number} [channelCount] 通道个数
 * @property {number} [expires] 注册有效期
 * @property {string} [createTime] 创建时间
 * @property {string} [updateTime] 更新时间
 * @property {string} [mediaServerId] 设备使用的媒体服务ID
 * @property {string} [charset] 字符集 UTF-8 / GB2312
 * @property {number} [subscribeCycleForCatalog] 目录订阅周期，0为不订阅
 * @property {number} [subscribeCycleForMobilePosition] 移动设备位置订阅周期，0不订阅
 * @property {number} [mobilePositionSubmissionInterval] 移动位置上报间隔(秒)，默认5
 * @property {number} [subscribeCycleForAlarm] 报警订阅周期，0不订阅
 * @property {boolean} [ssrcCheck] 是否开启ssrc校验，防止串流
 * @property {string} [geoCoordSys] 地理坐标系 WGS84/GCJ02
 * @property {string} [password] 密码
 * @property {string} [sdpIp] 收流IP
 * @property {string} [localIp] SIP交互IP（设备访问平台IP）
 * @property {boolean} [asMessageChannel] 是否作为消息通道
 * @property {any} [sipTransactionInfo] 设备注册事务信息
 * @property {boolean} [broadcastPushAfterAck] 语音对讲：收到ACK后再推流
 * @property {string} [serverId} 所属服务ID
 */

/**
 * 国标28181通道信息
 * @typedef {Object} Gb28181Channel
 * @property {number} [gbId] 数据库自增ID
 * @property {string} [gbDeviceId] 国标编码
 * @property {string} [gbName] 国标名称
 * @property {string} [gbManufacturer] 设备厂商
 * @property {string} [gbModel] 设备型号
 * @property {string} [gbOwner] 设备归属
 * @property {string} [gbCivilCode] 行政区域编码
 * @property {string} [gbBlock] 警区
 * @property {string} [gbAddress] 安装地址
 * @property {number} [gbParental] 是否有子设备 1有 0无
 * @property {string} [gbParentId] 父节点国标ID
 * @property {number} [gbSafetyWay] 信令安全模式
 * @property {number} [gbRegisterWay] 注册方式
 * @property {string} [gbCertNum] 证书序列号
 * @property {number} [gbCertifiable] 证书有效标识 0无效 1有效
 * @property {number} [gbErrCode] 证书无效原因码
 * @property {string} [gbEndTime] 证书终止有效期
 * @property {number} [gbSecrecy] 保密属性 0不涉密 1涉密
 * @property {string} [gbIpAddress] 设备IP
 * @property {number} [gbPort] 设备端口
 * @property {string} [gbPassword] 设备口令
 * @property {string} [gbStatus] 设备状态
 * @property {number} [gbLongitude] WGS84经度
 * @property {number} [gbLatitude] WGS84纬度
 * @property {number} [gpsAltitude] GPS海拔
 * @property {number} [gpsSpeed] GPS速度
 * @property {number} [gpsDirection] GPS方向
 * @property {string} [gpsTime] GPS定位时间
 * @property {string} [gbBusinessGroupId] 业务分组ID
 * @property {number} [gbPtzType] 摄像机结构类型：1球机、2半球、3枪机等
 * @property {number} [gbPositionType] 摄像机位置类型
 * @property {number} [gbRoomType] 安装位置：1室外 2室内
 * @property {number} [gbUseType] 用途属性
 * @property {number} [gbSupplyLightType] 补光类型：红外/白光/激光等
 * @property {number} [gbDirectionType] 监视方位
 * @property {string} [gbResolution] 支持分辨率，多值逗号分隔
 * @property {string} [gbDownloadSpeed] 录像下载倍速
 * @property {number} [gbSvcSpaceSupportMod] 空域编码增强层数
 * @property {number} [gbSvcTimeSupportMode] 时域编码增强层数
 * @property {number} [recordPLan] 小时级录制计划二进制位标识
 * @property {number} [dataType] 关联数据类型
 * @property {number} [dataDeviceId] 关联设备主键ID
 * @property {string} [createTime] 创建时间
 * @property {string} [updateTime] 更新时间
 * @property {string} [streamId] 直播流唯一ID，存在代表正在拉流
 * @property {number} [enableBroadcast] 1支持对讲，0不支持
 * @property {number} [mapLevel] 地图抽稀层级
 * @property {number} [id] 通道数据库主键ID
 * @property {string} [parentDeviceId] 父设备国标编号
 * @property {string} [parentName] 父设备名称
 * @property {string} [deviceId] 通道国标编号
 * @property {string} [name] 通道名称
 * @property {string} [manufacturer] 厂商
 * @property {string} [model] 型号
 * @property {string} [owner] 设备归属
 * @property {string} [civilCode] 行政区域编码
 * @property {string} [block] 警区
 * @property {string} [address] 安装地址
 * @property {number} [parental] 是否含子设备 1有 0无
 * @property {string} [parentId] 父节点国标ID
 * @property {number} [safetyWay] 信令安全模式
 * @property {number} [registerWay] 注册方式
 * @property {string} [certNum] 证书序列号
 * @property {number} [certifiable] 证书有效性
 * @property {number} [errCode] 证书无效原因码
 * @property {string} [endTime] 证书过期时间
 * @property {number} [secrecy] 涉密属性
 * @property {string} [ipAddress] 通道IP
 * @property {number} [port] 端口
 * @property {string} [password] 访问口令
 * @property {string} [status] 在线状态
 * @property {number} [longitude] 经度
 * @property {number} [latitude] 纬度
 * @property {number} [ptzType] 云台类型编码
 * @property {number} [positionType] 位置类型编码
 * @property {number} [roomType] 室内室外类型
 * @property {number} [useType] 用途类型
 * @property {number} [supplyLightType] 补光类型
 * @property {number} [directionType] 监视朝向
 * @property {string} [resolution] 支持分辨率列表
 * @property {string} [businessGroupId] 业务分组ID
 * @property {string} [downloadSpeed] 下载倍速
 * @property {number} [svcSpaceSupportMod] 空域SVC层数
 * @property {number} [svcTimeSupportMode] 时域SVC层数
 * @property {string} [ptzTypeText] 云台类型文字描述
 * @property {number} [subCount] 子设备数量
 * @property {boolean} [hasAudio] 是否支持音频
 * @property {string} [streamIdentification] 码流标识配置
 * @property {number} [channelType] 通道类型：0普通/1行政区划/2业务分组
 */