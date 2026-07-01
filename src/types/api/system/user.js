
/** 用户分页查询参数 */
export interface UserQueryParams extends PageDomain {
  /** 用户名称 */
  userName?: string;
  /** 手机号码 */
  phonenumber?: string;
  /** 状态（0正常 1停用） */
  status?: '0' | '1';
  /** 部门编号 */
  deptId?: number;
  /** 创建时间 */
  params?: {
    beginTime?: string;
    endTime?: string;
  };
}

/** 角色授权用户分页查询参数 */

/** 用户信息 */

/** 注册信息 */

/** 用户详情查询响应 */

/** 用户个人资料响应 */

/** 用户头像上传响应 */

/** 用户授权角色响应 */
