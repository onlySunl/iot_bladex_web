
/** 登录日志分页查询参数 */
export interface LogininforQueryParams extends PageDomain {
  /** 登录地址 */
  ipaddr?: string;
  /** 用户名称 */
  userName?: string;
  /** 状态 */
  status?: string;
  /** 登录时间 */
  params?: {
    beginTime?: string;
    endTime?: string;
  };
}

/** 登录日志信息 */
