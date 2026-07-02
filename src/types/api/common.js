/** API 通用响应类型 */
export interface AjaxResult<T = any> {
  /** 状态码 */
  code
  /** 返回内容 */
  msg
  /** 数据对象 */
  data?: T
}

/** API 表格响应类型 */
export interface TableDataInfo<T = any> {
  /** 状态码 */
  code
  /** 返回内容 */
  msg
  /** 总记录数 */
  total
  /** 列表数据 */
  rows
}

/** 分页参数类型 */

/** Entity基类 */

/** Treeselect树结构类型 */

/** 显隐列信息 */

/** 文件上传响应数据 */
