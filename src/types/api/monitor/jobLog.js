/** 定时任务日志分页查询参数 */
/**
 * JobLogQueryParams
 * @extends PageDomain
 * @property {string} jobName
 * @property {string} jobGroup
 * @property {string} status
 * @property {{} params
 * @property {string} beginTime
 * @property {string} endTime
 */


/** 定时任务日志信息 */
/**
 * SysJobLog
 * @extends BaseEntity
 * @property {number} jobLogId
 * @property {string} jobName
 * @property {string} jobGroup
 * @property {string} invokeTarget
 * @property {string} jobMessage
 * @property {string} exceptionInfo
 * @property {'0' | '1'} status
 */
