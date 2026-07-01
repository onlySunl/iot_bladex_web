
/** 字典分页查询参数 */
export interface DictTypeQueryParams extends PageDomain {
  /** 字典名称 */
  dictName?: string;
  /** 字典类型 */
  dictType?: string;
  /** 状态 */
  status?: string;
  /** 创建时间 */
  params?: {
    beginTime?: string;
    endTime?: string;
  };
}

/** 字典数据查询参数 */

/** 字典类型信息 */

/** 字典数据信息 */
