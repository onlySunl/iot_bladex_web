/**
 * @typedef {import('../common').AjaxResult} AjaxResult
 * @typedef {import('../common').TableDataInfo} TableDataInfo
 */

/**
 * 设备抓拍截图记录实体
 * @typedef {Object} QsDeviceSnapshot
 * @property {number} [id] 主键ID
 * @property {number} [deviceId] 设备主键ID
 * @property {string} [deviceCode] 设备编号
 * @property {string} [deviceName] 设备名称
 * @property {string} [fileUrl] 图片访问地址
 * @property {string} [filePath] 图片存储路径
 * @property {number} [fileSize] 文件大小
 * @property {string} [fileName] 文件名称
 * @property {string} [fileType] 文件类型
 * @property {string} [snapshotType] 抓拍类型
 * @property {string} [sdkType] 设备协议类型
 * @property {number} [channel] 通道号
 * @property {string} [captureTime] 抓拍时间
 * @property {number} [width] 图片宽度
 * @property {number} [height] 图片高度
 * @property {number} [latitude] 纬度
 * @property {number} [longitude] 经度
 * @property {string} [remark] 备注
 * @property {string} [createBy] 创建人
 * @property {string} [createTime] 创建时间
 * @property {string} [updateBy] 更新人
 * @property {string} [updateTime] 更新时间
 */

/**
 * 设备截图分页查询参数
 * @typedef {Object} SnapshotQueryParams
 * @property {number} [deviceId] 设备主键ID
 * @property {string} [deviceCode] 设备编号
 * @property {string} [deviceName] 设备名称
 * @property {string} [snapshotType] 抓拍类型
 * @property {string} [sdkType] 设备协议类型
 * @property {number} [channel] 通道号
 * @property {number} [pageNum] 页码
 * @property {number} [pageSize] 每页条数
 * @property {string} [beginTime] 开始时间
 * @property {string} [endTime] 结束时间
 */