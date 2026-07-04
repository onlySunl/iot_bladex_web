/**
 * @typedef {Object} AjaxResult
 * @property {number} code 状态码
 * @property {string} msg 返回内容
 * @property {any} [data] 数据对象
 */

/**
 * @typedef {Object} TableDataInfo
 * @property {number} code 状态码
 * @property {string} msg 返回内容
 * @property {number} total 总记录数
 * @property {any[]} rows 列表数据
 */

/**
 * 分页参数类型
 * @typedef {Object} PageDomain
 * @property {number} [pageNum] 当前记录起始索引
 * @property {number} [pageSize] 每页显示记录数
 * @property {string} [orderByColumn] 排序列
 * @property {string} [isAsc] 排序的方向desc或者asc
 * @property {boolean} [reasonable] 分页参数合理化
 */

/**
 * Entity基类
 * @typedef {Object} BaseEntity
 * @property {string} [searchValue] 搜索值
 * @property {string} [createBy] 创建者
 * @property {string} [createTime] 创建时间
 * @property {string} [updateBy] 更新者
 * @property {string} [updateTime] 更新时间
 * @property {string} [remark] 备注
 * @property {Record<string, any>} [params] 请求参数
 */

/**
 * Treeselect树结构类型
 * @typedef {Object} TreeSelect
 * @property {number} [id] 节点ID
 * @property {string} [label] 节点名称
 * @property {boolean} disabled 节点禁用
 * @property {TreeSelect[]} children 子节点
 */

/**
 * 显隐列信息
 * @typedef {Object} TableShowColumns
 * @property {string} label 显示名称
 * @property {boolean} visible 是否显示
 */

/**
 * 文件上传响应数据
 * @typedef {Object} UploadFileResult
 * @extends {AjaxResult}
 * @property {string} fileName 文件名称（包含路径）
 * @property {string} newFileName 文件名称（不含路径）
 * @property {string} url 完整URL地址
 * @property {string} originalFilename 原始文件名称
 */