/**
 * 大华设备基础信息
 * @typedef {Object} DaHuaDevice
 * @property {string} [deviceId] 设备ID
 * @property {string} [ip] ip地址
 * @property {string} [port] 设备登录端口
 */

/**
 * 大华设备详细信息
 * @typedef {Object} DaHuaDeviceInfo
 * @property {string} [serialNumber] 序列号
 * @property {number} [alarmInPortNum] 报警输入端口数
 * @property {number} [alarmOutPortNum] 报警输出端口数
 * @property {number} [diskNum] 硬盘数量
 * @property {number} [dvrType] DVR类型
 * @property {number} [channelNum] 通道数量
 * @property {number} [limitLoginTime] 登录超时时间(分钟)
 * @property {number} [leftLogTimes] 剩余登录次数
 * @property {number} [lockLeftTime] 解锁剩余时间(秒)
 */

/**
 * 大华设备系统参数
 * @typedef {Object} DaHuaSystemParam
 * @property {number} [videoStandard] 视频制式
 * @property {string} [country] 国家/地区配置
 */

/**
 * 大华设备视频编码参数
 * @typedef {Object} DaHuaVideoParam
 * @property {number} [formatType] 码流类型
 * @property {number} [videoEnable] 视频使能
 * @property {number} [compression] 视频压缩格式
 * @property {number} [width] 视频宽度
 * @property {number} [height] 视频高度
 * @property {number} [bitRateControl] 码流控制模式
 * @property {number} [bitRate] 视频码流(kbps)
 * @property {number} [frameRate] 视频帧率
 * @property {number} [iframeInterval] I帧间隔
 * @property {number} [imageQuality] 图像质量
 */

/**
 * 大华设备视频图像输入参数
 * @typedef {Object} DaHuaDeviceVideoParam
 * @property {number} [brightness] 亮度
 * @property {number} [contrast] 对比度
 * @property {number} [saturation] 饱和度
 * @property {number} [chroma] 色度
 * @property {number} [sharpness] 锐度
 * @property {number} [hue] 色调
 * @property {number} [gain] 增益
 * @property {number} [blackWhiteMode] 黑白模式
 */

/**
 * 存储设备分区信息
 * @typedef {Object} DaHuaStoragePartition
 * @property {string} [name] 分区名称
 * @property {number} [totalSpace] 总容量(字节)
 * @property {number} [freeSpace] 剩余容量(字节)
 * @property {number} [totalSpaceGB] 总容量(GB)
 * @property {number} [freeSpaceGB] 剩余容量(GB)
 * @property {number} [state] 分区状态
 */

/**
 * 存储设备信息
 * @typedef {Object} DaHuaStorageDevice
 * @property {string} [name] 存储设备名称
 * @property {number} [totalSpace] 总容量(字节)
 * @property {number} [freeSpace] 剩余容量(字节)
 * @property {number} [usedSpace] 已用容量(字节)
 * @property {number} [totalSpaceGB] 总容量(GB)
 * @property {number} [freeSpaceGB] 剩余容量(GB)
 * @property {number} [usedSpaceGB] 已用容量(GB)
 * @property {number} [usagePercent] 使用率
 * @property {number} [mediaType] 存储介质类型
 * @property {string} [mediaTypeDesc] 介质类型描述
 * @property {number} [busType] 总线类型
 * @property {string} [busTypeDesc] 总线类型描述
 * @property {number} [volumeType] 卷类型
 * @property {string} [volumeTypeDesc] 卷类型描述
 * @property {number} [state] 设备状态
 * @property {string} [stateDesc] 状态描述
 * @property {number} [physicNo] 物理编号
 * @property {number} [logicNo] 逻辑编号
 * @property {string} [parent] 父级设备标识
 * @property {string} [module] 所属模块
 * @property {string} [serial] 设备序列号
 * @property {string} [firmware] 固件版本
 * @property {number} [partitionNum] 分区数量
 * @property {number} [opState] 运行状态
 * @property {string} [opStateDesc] 运行状态描述
 * @property {DaHuaStoragePartition[]} [partitions] 分区列表
 */

/**
 * 大华设备存储总信息
 * @typedef {Object} DaHuaStorageInfo
 * @property {DaHuaStorageDevice[]} [storageDevices] 存储设备列表
 */

/**
 * 大华设备系统资源信息
 * @typedef {Object} DaHuaSystemResourceInfo
 * @property {boolean} [success] 是否查询成功
 * @property {string} [errorMessage] 异常信息
 * @property {number} [cpuUsage] CPU使用率
 * @property {number} [memoryUsage] 内存使用率
 * @property {number} [ipChannelIn] IP通道接入速度
 * @property {number} [netRemain] 网络剩余能力
 * @property {number} [netCapability] 网络总能力
 * @property {number} [previewRemain] 远程预览剩余路数
 * @property {number} [playBackRemain] 远程回放剩余路数
 * @property {number} [netSendRemain] 网络发送剩余能力
 * @property {number} [decodeAbility] 解码能力
 */

/**
 * 硬盘详细信息
 * @typedef {Object} DaHuaDiskInfo
 * @property {number} [diskNumber] 硬盘编号
 * @property {number} [partitionNumber] 分区号
 * @property {number} [volume] 卷名
 * @property {number} [freeSpace] 剩余容量
 * @property {number} [status] 硬盘状态
 * @property {number} [signal] 信号状态
 * @property {number} [diskType] 磁盘类型
 * @property {number} [diskStatus] 磁盘运行状态
 */

/**
 * 大华设备SD卡/硬盘汇总信息
 * @typedef {Object} DaHuaSDCardInfo
 * @property {boolean} [success] 是否查询成功
 * @property {string} [errorMessage] 异常信息
 * @property {boolean} [exists] 是否存在存储介质
 * @property {number} [totalSpace] 总容量(字节)
 * @property {number} [freeSpace] 剩余容量(字节)
 * @property {number} [usedSpace] 已用容量(字节)
 * @property {number} [totalSpaceGB] 总容量(GB)
 * @property {number} [freeSpaceGB] 剩余容量(GB)
 * @property {number} [usedSpaceGB] 已用容量(GB)
 * @property {number} [usagePercent] 使用率
 * @property {number} [state] 存储状态码
 * @property {string} [stateDesc] 状态描述
 * @property {number} [diskCount] 硬盘数量
 * @property {DaHuaDiskInfo[]} [diskList] 硬盘信息列表
 */

/**
 * 单通道录像状态
 * @typedef {Object} DaHuaChannelRecordState
 * @property {number} [channelId] 通道ID
 * @property {boolean} [mainStreamRecording] 主码流是否录像
 * @property {boolean} [extraStream1Recording] 子码流1是否录像
 * @property {boolean} [extraStream2Recording] 子码流2是否录像
 * @property {boolean} [extraStream3Recording] 子码流3是否录像
 */

/**
 * 大华设备整体录像状态信息
 * @typedef {Object} DaHuaRecordStateInfo
 * @property {boolean} [success] 是否查询成功
 * @property {string} [errorMessage] 异常信息
 * @property {boolean} [wholeRecording] 设备整体录像总开关状态
 * @property {boolean} [wholeEncoding] 设备整体编码总开关状态
 * @property {DaHuaChannelRecordState[]} [channelStates] 各通道录像状态列表
 */

/**
 * 单路电源状态
 * @typedef {Object} DaHuaPowerState
 * @property {number} [powerId] 电源ID
 * @property {string} [powerName] 电源名称
 * @property {number} [status] 电源状态码
 * @property {string} [statusDesc] 状态描述
 * @property {boolean} [online] 是否在线
 */

/**
 * 大华设备电源状态汇总信息
 * @typedef {Object} DaHuaPowerStateInfo
 * @property {boolean} [success] 是否查询成功
 * @property {string} [errorMessage] 异常信息
 * @property {number} [powerCount] 电源路数
 * @property {DaHuaPowerState[]} [powerStates] 各路电源状态列表
 */

/**
 * 报警通道布防状态
 * @typedef {Object} DaHuaAlarmChannelState
 * @property {number} [channelId] 报警通道ID
 * @property {string} [channelName] 报警通道名称
 * @property {boolean} [armed] 是否已布防
 * @property {number} [armType] 布防类型编码
 * @property {string} [armTypeDesc] 布防类型描述
 */

/**
 * 大华设备报警布撤防汇总信息
 * @typedef {Object} DaHuaAlarmArmInfo
 * @property {boolean} [success] 是否查询成功
 * @property {string} [errorMessage] 异常信息
 * @property {number} [channelCount] 报警通道总数量
 * @property {DaHuaAlarmChannelState[]} [channelStates] 各通道布防状态列表
 */

/**
 * 摄像头通道信息
 * @typedef {Object} DaHuaCamera
 * @property {number} [channelId] 通道ID
 * @property {string} [cameraName] 摄像头名称
 * @property {string} [cameraType] 摄像头类型
 * @property {boolean} [online] 是否在线
 * @property {number} [status] 状态编码
 * @property {string} [statusDesc] 状态描述
 * @property {string} [manufacturer] 设备厂商
 * @property {string} [model] 设备型号
 * @property {string} [serialNumber] 设备序列号
 * @property {string} [firmwareVersion] 固件版本
 * @property {string} [ipAddress] 摄像头IP
 * @property {number} [port] 摄像头端口
 */

/**
 * 大华设备摄像头汇总信息
 * @typedef {Object} DaHuaCameraInfo
 * @property {boolean} [success] 是否查询成功
 * @property {string} [errorMessage] 异常信息
 * @property {number} [cameraCount] 摄像头通道总数
 * @property {DaHuaCamera[]} [cameraList] 摄像头通道列表
 */

/**
 * RTSP播放地址信息
 * @typedef {Object} DaHuaRtspUrl
 * @property {number} [channelId] 通道ID
 * @property {string} [streamType] 码流类型
 * @property {string} [url] RTSP播放地址
 * @property {string} [description] 地址备注描述
 */

/**
 * 大华设备RTSP地址汇总信息
 * @typedef {Object} DaHuaRtspUrlInfo
 * @property {boolean} [success] 是否查询成功
 * @property {string} [errorMessage] 异常信息
 * @property {number} [urlCount] RTSP地址总数
 * @property {DaHuaRtspUrl[]} [urlList] RTSP地址列表
 */

/**
 * 单通道码流信息
 * @typedef {Object} DaHuaChannelBitrate
 * @property {number} [channelId] 通道ID
 * @property {number} [streamType] 码流类型编码
 * @property {number} [bitrate] 当前码率(kbps)
 * @property {string} [bitrateDesc] 码率说明
 */

/**
 * 大华设备各通道实时码流汇总信息
 * @typedef {Object} DaHuaBitrateInfo
 * @property {boolean} [success] 是否查询成功
 * @property {string} [errorMessage] 异常信息
 * @property {DaHuaChannelBitrate[]} [channelBitrates] 通道码流列表
 */

/**
 * 大华设备网络参数状态信息
 * @typedef {Object} DaHuaNetworkStatusInfo
 * @property {boolean} [success] 是否查询成功
 * @property {string} [errorMessage] 异常信息
 * @property {string} [ipAddress] IP地址
 * @property {string} [subnetMask] 子网掩码
 * @property {string} [gateway] 网关地址
 * @property {string} [macAddress] MAC地址
 * @property {boolean} [linkStatus] 网线链路状态
 * @property {string} [linkStatusDesc] 链路状态描述
 * @property {string} [dns1] 首选DNS
 * @property {string} [dns2] 备用DNS
 * @property {boolean} [networkAvailable] 网络是否可用
 * @property {boolean} [hasWireless] 是否支持无线网络
 */

/**
 * 大华设备软硬件版本信息
 * @typedef {Object} DaHuaSoftwareVersionInfo
 * @property {boolean} [success] 是否查询成功
 * @property {string} [errorMessage] 异常信息
 * @property {string} [serialNumber] 设备序列号
 * @property {string} [fullVersion] 完整版本号
 * @property {string} [deviceModel] 设备型号
 * @property {string} [buildDate] 编译日期
 * @property {string} [hardwareVersion] 硬件版本
 * @property {string} [softwareVersion] 软件版本
 * @property {string} [webVersion] Web管理端版本
 * @property {string} [peripheralVersion] 外设版本
 * @property {string} [geographyVersion] 地理库版本
 * @property {number} [protocolVersion] 协议版本号
 * @property {number} [softwareBuildDate] 软件编译时间戳
 * @property {number} [peripheralBuildDate] 外设编译时间戳
 * @property {number} [geographyBuildDate] 地理库编译时间戳
 * @property {number} [hardwareDate] 硬件生产时间戳
 * @property {number} [webBuildDate] Web端编译时间戳
 */

/**
 * 大华录像下载请求参数
 * @typedef {Object} DaHuaRecordDownloadRequest
 * @property {number} id 设备主键ID
 * @property {number} channelId 通道ID
 * @property {string} startTime 录像开始时间
 * @property {string} endTime 录像结束时间
 * @property {number} [recordFileType] 录像文件类型（0-主码流，1-子码流1，2-子码流2）
 */

/**
 * 大华录像下载返回结果
 * @typedef {Object} DaHuaRecordDownloadResponse
 * @property {boolean} success 是否下载任务成功提交
 * @property {string} [errorMessage] 错误提示信息
 * @property {string} [filePath] 服务器本地文件路径
 * @property {string} [fileUrl] 文件HTTP访问下载地址
 * @property {number} [fileSize] 文件大小（字节）
 * @property {number} [progress] 下载进度 0~100
 */