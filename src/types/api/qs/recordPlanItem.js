/**
 * @typedef {import("../common").PageDomain} PageDomain
 * @typedef {import("../common").BaseEntity} BaseEntity
 */

/**
 * 录像计划管理设备配置分页查询参数
 * @typedef {Object} RecordPlanItemQueryParams
 * @extends {PageDomain}
 * @property {number} [start] 开始时间（时分秒数值）
 * @property {number} [stop] 结束时间（时分秒数值）
 * @property {number} [weekDay] 星期几
 * @property {number} [planId] 所属录像计划ID
 */

/**
 * 录像计划管理设备配置信息
 * @typedef {Object} ZlmRecordPlanItem
 * @extends {BaseEntity}
 * @property {number} [id] 主键ID
 * @property {number} [start] 开始时间（时分秒数值）
 * @property {number} [stop] 结束时间（时分秒数值）
 * @property {number} [weekDay] 星期几
 * @property {number} [planId] 所属录像计划ID
 */