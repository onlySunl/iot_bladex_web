
/** 数据表分页查询参数 */
export interface GenQueryParams extends PageDomain {
  /** 表名称 */
  tableName?: string;
  /** 表描述 */
  tableComment?: string;
  /** 创建时间 */
  params?: {
    beginTime?: string;
    endTime?: string;
  };
}

/** 代码生成业务信息 */

/** 生成表列字段信息 */

/** 代码生成信息响应 */
