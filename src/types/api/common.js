/** API 通用响应类型 */
/**
 * AjaxResult
 * @property {number} code
 * @property {string} msg
 * @property {T} data
 */

/** API 表格响应类型 */
/**
 * TableDataInfo
 * @property {number} code
 * @property {string} msg
 * @property {number} total
 * @property {T[]} rows
 */

/** 分页参数类型 */
/**
 * PageDomain
 * @property {number} pageNum
 * @property {number} pageSize
 * @property {string} orderByColumn
 * @property {string} isAsc
 * @property {boolean} reasonable
 */

/** Entity基类 */
/**
 * BaseEntity
 * @property {string} searchValue
 * @property {string} createBy
 * @property {string} createTime
 * @property {string} updateBy
 * @property {string} updateTime
 * @property {string} remark
 * @property {Record} params
 */

/** Treeselect树结构类型 */
/**
 * TreeSelect
 * @property {number} id
 * @property {string} label
 * @property {boolean} disabled
 * @property {TreeSelect[]} children
 */

/** 显隐列信息 */
/**
 * TableShowColumns
 * @property {string} label
 * @property {boolean} visible
 */

/** 文件上传响应数据 */
/**
 * UploadFileResult
 * @extends AjaxResult
 * @property {string} fileName
 * @property {string} newFileName
 * @property {string} url
 * @property {string} originalFilename
 */
