
/** 角色分页查询参数 */
export interface RoleQueryParams extends PageDomain {
  /** 角色名称 */
  roleName?: string;
  /** 角色权限 */
  roleKey?: string;
  /** 状态 */
  status?: string;
  /** 创建时间 */
  params?: {
    beginTime?: string;
    endTime?: string;
  };
}

/** 批量授权用户参数 */

/** 用户和角色关联信息 */

/** 用户和多角色关联信息 */

/** 角色信息 */

/** 角色部门树响应 */
