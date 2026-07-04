/**
 * @typedef {import("../common").PageDomain} PageDomain
 * @typedef {import("../common").BaseEntity} BaseEntity
 */

/**
 * 录像计划配置分页查询参数
 * @typedef {Object} RecordPlanQueryParams
 * @extends {PageDomain}
 * @property {number} [snap] 计划名称（字段命名备注：原字段疑似注释与字段不匹配）
 * @property {number} [status] 是否启用
 */

/**
 * 录像计划配置信息
 * @typedef {Object} ZlmRecordPlan
 * @extends {BaseEntity}
 * @property {number} [id] 主键ID
 * @property {string} [snap] 开启定时截图标识
 * @property {string} [name] 计划名称
 * @property {string} [status] 是否启用
 * @property {string} [createTime] 创建时间
 * @property {string} [updateTime] 更新时间
 */