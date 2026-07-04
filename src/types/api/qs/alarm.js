/**
 * @typedef {Object} AjaxResult
 * @property {number} code 状态码
 * @property {string} msg 提示信息
 * @property {any} data 返回数据
 */

/**
 * @typedef {Object} TableDataInfo
 * @property {QsDeviceAlarm[]} records 数据列表
 * @property {number} total 总条数
 * @property {number} pageNum 当前页码
 * @property {number} pageSize 每页条数
 */

/**
 * NVR设备告警信息实体
 * @typedef {Object} QsDeviceAlarm
 * @property {number} [id] 主键ID
 * @property {number} [deviceId] 设备ID
 * @property {string} [deviceCode] 设备编码
 * @property {string} [deviceName] 设备名称
 * @property {string} [alarmType] 告警类型
 * @property {string} [alarmLevel] 告警级别
 * @property {string} [sdkType] SDK类型
 * @property {number} [channel] 通道号
 * @property {string} [alarmTime] 告警时间
 * @property {string} [alarmContent] 告警内容
 * @property {string} [imageUrl] 告警截图地址
 * @property {number} [handled] 是否已处理 0未处理 1已处理
 * @property {string} [handler] 处理人
 * @property {string} [handleTime] 处理时间
 * @property {string} [remark] 备注
 * @property {string} [createBy] 创建人
 * @property {string} [createTime] 创建时间
 * @property {string} [updateBy] 更新人
 * @property {string} [updateTime] 更新时间
 */

/**
 * 告警记录分页查询参数
 * @typedef {Object} AlarmQueryParams
 * @property {number} [deviceId] 设备ID
 * @property {string} [deviceCode] 设备编码
 * @property {string} [deviceName] 设备名称
 * @property {string} [alarmType] 告警类型
 * @property {string} [alarmLevel] 告警级别
 * @property {string} [sdkType] SDK类型
 * @property {number} [channel] 通道号
 * @property {number} [handled] 是否处理 0未处理 1已处理
 * @property {number} [pageNum] 页码
 * @property {number} [pageSize] 每页条数
 * @property {string} [beginTime] 开始时间
 * @property {string} [endTime] 结束时间
 */