/** 角色分页查询参数 */
/**
 * RoleQueryParams
 * @extends PageDomain
 * @property {string} roleName
 * @property {string} roleKey
 * @property {string} status
 * @property {{} params
 * @property {string} beginTime
 * @property {string} endTime
 */


/** 批量授权用户参数 */
/**
 * AuthUserSelectParams
 * @property {number} roleId
 * @property {number[]} userIds
 */

/** 用户和角色关联信息 */
/**
 * SysUserRole
 * @property {number} userId
 * @property {number} roleId
 */

/** 用户和多角色关联信息 */
/**
 * SysUserRoles
 * @property {number} userId
 * @property {number[]} roleIds
 */

/** 角色信息 */
/**
 * SysRole
 * @extends BaseEntity
 * @property {number} roleId
 * @property {string} roleName
 * @property {string} roleKey
 * @property {number} roleSort
 * @property {'1' | '2' | '3' | '4' | '5'} dataScope
 * @property {boolean} menuCheckStrictly
 * @property {boolean} deptCheckStrictly
 * @property {number[]} menuIds
 * @property {number[]} deptIds
 * @property {'0' | '1'} status
 */

/** 角色部门树响应 */
/**
 * RoleDeptTreeResult
 * @extends AjaxResult
 * @property {number[]} checkedKeys
 * @property {TreeSelect[]} depts
 */
