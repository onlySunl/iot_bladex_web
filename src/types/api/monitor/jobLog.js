
/** 定时任务日志分页查询参数 */
export interface JobLogQueryParams extends PageDomain {
  /** 任务名称 */
  jobName?: string;
  /** 任务组名 */
  jobGroup?: string;
  /** 执行状态 */
  status?: string;
  /** 执行时间 */
  params?: {
    beginTime?: string;
    endTime?: string;
  };
}

/** 定时任务日志信息 */
