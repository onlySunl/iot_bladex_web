/** 登录日志分页查询参数 */
/**
 * LogininforQueryParams
 * @extends PageDomain
 * @property {string} ipaddr
 * @property {string} userName
 * @property {string} status
 * @property {{} params
 * @property {string} beginTime
 * @property {string} endTime
 */


/** 登录日志信息 */
/**
 * SysLogininfor
 * @extends BaseEntity
 * @property {number} infoId
 * @property {string} userName
 * @property {string} ipaddr
 * @property {string} loginLocation
 * @property {string} browser
 * @property {string} os
 * @property {string} msg
 * @property {Date} accessTime
 * @property {'0' | '1'} status
 */
