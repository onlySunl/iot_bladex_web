
/** 参数配置分页查询参数 */
export interface ConfigQueryParams extends PageDomain {
  /** 参数名称 */
  configName?: string;
  /** 参数键名 */
  configKey?: string;
  /** 系统内置 */
  configType?: string;
  /** 创建时间 */
  params?: {
    beginTime?: string;
    endTime?: string;
  };
}

/** 参数配置信息 */
