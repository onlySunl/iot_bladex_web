
/** 操作日志分页查询参数 */
export interface OperlogQueryParams extends PageDomain {
  /** 操作地址 */
  operIp?: string;
  /** 系统模块 */
  title?: string;
  /** 操作人员 */
  operName?: string;
  /** 类型 */
  businessType?: number;
  /** 状态 */
  status?: string;
  /** 登录时间 */
  params?: {
    beginTime?: string;
    endTime?: string;
  };
}

/** 操作日志信息 */
