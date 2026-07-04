/** 操作日志分页查询参数 */
/**
 * OperlogQueryParams
 * @extends PageDomain
 * @property {string} operIp
 * @property {string} title
 * @property {string} operName
 * @property {number} businessType
 * @property {string} status
 * @property {{} params
 * @property {string} beginTime
 * @property {string} endTime
 */


/** 操作日志信息 */
/**
 * SysOperLog
 * @extends BaseEntity
 * @property {number} operId
 * @property {string} title
 * @property {number} businessType
 * @property {string} method
 * @property {string} requestMethod
 * @property {string} operatorType
 * @property {string} operName
 * @property {string} deptName
 * @property {string} operUrl
 * @property {string} operIp
 * @property {string} operLocation
 * @property {string} operParam
 * @property {string} jsonResult
 * @property {string} errorMsg
 * @property {Date} operTime
 * @property {number} costTime
 * @property {'0' | '1'} status
 */
