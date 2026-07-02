/** 大华设备 */
/**
 * DaHuaDevice
 * @property {string} deviceId
 * @property {string} ip
 * @property {string} port
 */

/** 大华设备详细信息 */
/**
 * DaHuaDeviceInfo
 * @property {string} serialNumber
 * @property {number} alarmInPortNum
 * @property {number} alarmOutPortNum
 * @property {number} diskNum
 * @property {number} dvrType
 * @property {number} channelNum
 * @property {number} limitLoginTime
 * @property {number} leftLogTimes
 * @property {number} lockLeftTime
 */

/** 大华设备系统参数 */
/**
 * DaHuaSystemParam
 * @property {number} videoStandard
 * @property {string} country
 */

/** 大华设备视频参数 */
/**
 * DaHuaVideoParam
 * @property {number} formatType
 * @property {number} videoEnable
 * @property {number} compression
 * @property {number} width
 * @property {number} height
 * @property {number} bitRateControl
 * @property {number} bitRate
 * @property {number} frameRate
 * @property {number} iframeInterval
 * @property {number} imageQuality
 */

/** 大华设备视频输入参数 */
/**
 * DaHuaDeviceVideoParam
 * @property {number} brightness
 * @property {number} contrast
 * @property {number} saturation
 * @property {number} chroma
 * @property {number} sharpness
 * @property {number} hue
 * @property {number} gain
 * @property {number} blackWhiteMode
 */

/** 存储设备分区信息 */
/**
 * DaHuaStoragePartition
 * @property {string} name
 * @property {number} totalSpace
 * @property {number} freeSpace
 * @property {number} totalSpaceGB
 * @property {number} freeSpaceGB
 * @property {number} state
 */

/** 存储设备信息 */
/**
 * DaHuaStorageDevice
 * @property {string} name
 * @property {number} totalSpace
 * @property {number} freeSpace
 * @property {number} usedSpace
 * @property {number} totalSpaceGB
 * @property {number} freeSpaceGB
 * @property {number} usedSpaceGB
 * @property {number} usagePercent
 * @property {number} mediaType
 * @property {string} mediaTypeDesc
 * @property {number} busType
 * @property {string} busTypeDesc
 * @property {number} volumeType
 * @property {string} volumeTypeDesc
 * @property {number} state
 * @property {string} stateDesc
 * @property {number} physicNo
 * @property {number} logicNo
 * @property {string} parent
 * @property {string} module
 * @property {string} serial
 * @property {string} firmware
 * @property {number} partitionNum
 * @property {number} opState
 * @property {string} opStateDesc
 * @property {DaHuaStoragePartition[]} partitions
 */

/** 大华设备存储信息 */
/**
 * DaHuaStorageInfo
 * @property {DaHuaStorageDevice[]} storageDevices
 */

/** 大华设备系统资源信息 */
/**
 * DaHuaSystemResourceInfo
 * @property {boolean} success
 * @property {string} errorMessage
 * @property {number} cpuUsage
 * @property {number} memoryUsage
 * @property {number} ipChannelIn
 * @property {number} netRemain
 * @property {number} netCapability
 * @property {number} previewRemain
 * @property {number} playBackRemain
 * @property {number} netSendRemain
 * @property {number} decodeAbility
 */

/** 硬盘信息 */
/**
 * DaHuaDiskInfo
 * @property {number} diskNumber
 * @property {number} partitionNumber
 * @property {number} volume
 * @property {number} freeSpace
 * @property {number} status
 * @property {number} signal
 * @property {number} diskType
 * @property {number} diskStatus
 */

/** 大华设备SD卡信息 */
/**
 * DaHuaSDCardInfo
 * @property {boolean} success
 * @property {string} errorMessage
 * @property {boolean} exists
 * @property {number} totalSpace
 * @property {number} freeSpace
 * @property {number} usedSpace
 * @property {number} totalSpaceGB
 * @property {number} freeSpaceGB
 * @property {number} usedSpaceGB
 * @property {number} usagePercent
 * @property {number} state
 * @property {string} stateDesc
 * @property {number} diskCount
 * @property {DaHuaDiskInfo[]} diskList
 */

/** 大华设备录像状态信息 */
/**
 * DaHuaRecordStateInfo
 * @property {boolean} success
 * @property {string} errorMessage
 * @property {boolean} wholeRecording
 * @property {boolean} wholeEncoding
 * @property {DaHuaChannelRecordState[]} channelStates
 */

/** 通道录像状态 */
/**
 * DaHuaChannelRecordState
 * @property {number} channelId
 * @property {boolean} mainStreamRecording
 * @property {boolean} extraStream1Recording
 * @property {boolean} extraStream2Recording
 * @property {boolean} extraStream3Recording
 */

/** 大华设备电源状态信息 */
/**
 * DaHuaPowerStateInfo
 * @property {boolean} success
 * @property {string} errorMessage
 * @property {number} powerCount
 * @property {DaHuaPowerState[]} powerStates
 */

/** 电源状态 */
/**
 * DaHuaPowerState
 * @property {number} powerId
 * @property {string} powerName
 * @property {number} status
 * @property {string} statusDesc
 * @property {boolean} online
 */

/** 大华设备报警布撤防信息 */
/**
 * DaHuaAlarmArmInfo
 * @property {boolean} success
 * @property {string} errorMessage
 * @property {number} channelCount
 * @property {DaHuaAlarmChannelState[]} channelStates
 */

/** 报警通道状态 */
/**
 * DaHuaAlarmChannelState
 * @property {number} channelId
 * @property {string} channelName
 * @property {boolean} armed
 * @property {number} armType
 * @property {string} armTypeDesc
 */

/** 大华设备摄像头属性信息 */
/**
 * DaHuaCameraInfo
 * @property {boolean} success
 * @property {string} errorMessage
 * @property {number} cameraCount
 * @property {DaHuaCamera[]} cameraList
 */

/** 摄像头信息 */
/**
 * DaHuaCamera
 * @property {number} channelId
 * @property {string} cameraName
 * @property {string} cameraType
 * @property {boolean} online
 * @property {number} status
 * @property {string} statusDesc
 * @property {string} manufacturer
 * @property {string} model
 * @property {string} serialNumber
 * @property {string} firmwareVersion
 * @property {string} ipAddress
 * @property {number} port
 */

/** 大华设备RTSP URL信息 */
/**
 * DaHuaRtspUrlInfo
 * @property {boolean} success
 * @property {string} errorMessage
 * @property {number} urlCount
 * @property {DaHuaRtspUrl[]} urlList
 */

/** RTSP URL */
/**
 * DaHuaRtspUrl
 * @property {number} channelId
 * @property {string} streamType
 * @property {string} url
 * @property {string} description
 */

/** 大华设备通道码流信息 */
/**
 * DaHuaChannelBitrate
 * @property {number} channelId
 * @property {number} streamType
 * @property {number} bitrate
 * @property {string} bitrateDesc
 */

/** 大华设备码流信息 */
/**
 * DaHuaBitrateInfo
 * @property {boolean} success
 * @property {string} errorMessage
 * @property {DaHuaChannelBitrate[]} channelBitrates
 */

/** 大华设备网络状态信息 */
/**
 * DaHuaNetworkStatusInfo
 * @property {boolean} success
 * @property {string} errorMessage
 * @property {string} ipAddress
 * @property {string} subnetMask
 * @property {string} gateway
 * @property {string} macAddress
 * @property {boolean} linkStatus
 * @property {string} linkStatusDesc
 * @property {string} dns1
 * @property {string} dns2
 * @property {boolean} networkAvailable
 * @property {boolean} hasWireless
 */

/** 大华设备软件版本信息 */
/**
 * DaHuaSoftwareVersionInfo
 * @property {boolean} success
 * @property {string} errorMessage
 * @property {string} serialNumber
 * @property {string} fullVersion
 * @property {string} deviceModel
 * @property {string} buildDate
 * @property {string} hardwareVersion
 * @property {string} softwareVersion
 * @property {string} webVersion
 * @property {string} peripheralVersion
 * @property {string} geographyVersion
 * @property {number} protocolVersion
 * @property {number} softwareBuildDate
 * @property {number} peripheralBuildDate
 * @property {number} geographyBuildDate
 * @property {number} hardwareDate
 * @property {number} webBuildDate
 */

/** 大华设备录像下载请求 */
/**
 * DaHuaRecordDownloadRequest
 * @property {number} id
 * @property {number} channelId
 * @property {string} startTime
 * @property {string} endTime
 * @property {number} recordFileType
 */

/** 大华设备录像下载响应 */
/**
 * DaHuaRecordDownloadResponse
 * @property {boolean} success
 * @property {string} errorMessage
 * @property {string} filePath
 * @property {string} fileUrl
 * @property {number} fileSize
 * @property {number} progress
 */
