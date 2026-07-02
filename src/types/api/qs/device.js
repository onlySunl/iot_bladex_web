/** 视频监控设备配置分页查询参数 */
/**
 * DeviceQueryParams
 * @extends PageDomain
 * @property {string} deviceName
 * @property {string} ipAddress
 * @property {string} type
 * @property {string} status
 * @property {string} deviceStatus
 */

/** 视频监控设备配置信息 */
/**
 * QsDevice
 * @extends BaseEntity
 * @property {number} id
 * @property {string} deviceCode
 * @property {string} deviceName
 * @property {string} ipAddress
 * @property {number} port
 * @property {string} userName
 * @property {string} password
 * @property {string} type
 * @property {number} deviceType
 * @property {string} liveAddress
 * @property {number} channel
 * @property {number} alarmChannelId
 * @property {string} status
 * @property {string} streamType
 * @property {string} longitude
 * @property {string} latitude
 * @property {string} gbCode
 * @property {string} protocol
 * @property {string} deviceStatus
 * @property {string} onlineType
 * @property {string} enableAudio
 * @property {string} enableMp4
 * @property {string} streamStatus
 * @property {string} mediaServerId
 * @property {string} streamKey
 * @property {string} enableDisableNoneReader
 * @property {string} snap
 * @property {string} flvType
 * @property {string} onvifAuth
 * @property {string} onvifHostName
 * @property {string} manufacturer
 * @property {string} address
 * @property {number} ptzType
 * @property {string} gbDeviceId
 * @property {string} gbChannelId
 * @property {string} streamMode
 * @property {string} createBy
 * @property {string} createTime
 * @property {string} updateBy
 * @property {string} updateTime
 * @property {string} remark
 * @property {string} jtMobileNo
 * @property {string} jtPlateNo
 * @property {string} jtPlateColor
 * @property {number} subscribeCatalogStatus
 * @property {number} subscribeAlarmStatus
 * @property {string} subscribeTime
 */

/**
 * 录制计划-添加/编辑参数
 */
/**
 * RecordPlanParam
 * @property {number[]} deviceIds
 * @property {boolean} allLink
 * @property {number} planId
 */
