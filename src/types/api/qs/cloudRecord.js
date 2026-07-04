/**
 * @typedef {import("../common").PageDomain} PageDomain
 * @typedef {import("../common").BaseEntity} BaseEntity
 */

/**
 * 云端录像配置分页查询参数
 * @typedef {Object} CloudRecordQueryParams
 * @extends {PageDomain}
 * @property {string} [app] 应用名
 * @property {string} [stream] 流id
 * @property {string} [callId] 会话ID
 * @property {number} [startTime] 开始时间戳
 * @property {number} [endTime] 结束时间戳
 * @property {string} [mediaServerId] ZLM 媒体服务ID
 * @property {string} [serverId] 所属服务ID
 * @property {string} [fileName] 文件名称
 * @property {string} [folder] 文件夹
 * @property {string} [filePath] 文件路径
 * @property {number} [collect] 收藏标识，收藏的文件不会被定时清理
 * @property {number} [fileSize] 文件大小
 * @property {number} [timeLen] 文件录制时长
 * @property {number} [queryStartTime] 筛选创建时间-开始时间戳
 * @property {number} [queryEndTime] 筛选创建时间-结束时间戳
 */

/**
 * 云端录像配置信息
 * @typedef {Object} ZlmCloudRecord
 * @extends {BaseEntity}
 * @property {number} [id] 主键ID
 * @property {string} [app] 应用名
 * @property {string} [stream] 流id
 * @property {string} [callId] 会话ID
 * @property {number} [startTime] 录像开始时间戳
 * @property {number} [endTime] 录像结束时间戳
 * @property {string} [mediaServerId] ZLM 媒体服务ID
 * @property {string} [serverId] 所属服务ID
 * @property {string} [fileName] 文件名称
 * @property {string} [folder] 文件夹
 * @property {string} [filePath] 文件存储路径
 * @property {number} [collect] 收藏标识，收藏文件不自动清理
 * @property {number} [fileSize] 文件大小
 * @property {number} [timeLen] 录像时长
 * @property {string} [createTime] 创建时间
 * @property {string} [updateTime] 更新时间
 */