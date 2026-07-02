/** 定时任务分页查询参数 */
/**
 * JobQueryParams
 * @extends PageDomain
 * @property {string} jobName
 * @property {string} jobGroup
 * @property {string} status
 */

/** 定时任务信息 */
/**
 * SysJob
 * @extends BaseEntity
 * @property {number} jobId
 * @property {string} jobName
 * @property {string} jobGroup
 * @property {string} invokeTarget
 * @property {string} cronExpression
 * @property {Date} nextValidTime
 * @property {'1' | '2' | '3'} misfirePolicy
 * @property {'0' | '1'} concurrent
 * @property {'0' | '1'} status
 */
