/** 用户分页查询参数 */
/**
 * UserQueryParams
 * @extends PageDomain
 * @property {string} userName
 * @property {string} phonenumber
 * @property {'0' | '1'} status
 * @property {number} deptId
 * @property {{} params
 * @property {string} beginTime
 * @property {string} endTime
 */


/** 角色授权用户分页查询参数 */
/**
 * AuthUserQueryParams
 * @extends UserQueryParams
 * @property {number} roleId
 */

/** 用户信息 */
/**
 * SysUser
 * @extends BaseEntity
 * @property {number} userId
 * @property {number} deptId
 * @property {string} userName
 * @property {string} nickName
 * @property {string} email
 * @property {string} phonenumber
 * @property {'0' | '1' | '2'} sex
 * @property {string} avatar
 * @property {string} password
 * @property {'0' | '1'} status
 * @property {SysDept} dept
 * @property {SysRole[]} roles
 * @property {number[]} roleIds
 * @property {number[]} postIds
 */

/** 注册信息 */
/**
 * SysRegister
 * @property {string} userName
 * @property {string} password
 * @property {string} code
 * @property {string} uuid
 */

/** 用户详情查询响应 */
/**
 * UserFormDataResult
 * @extends AjaxResult
 * @property {SysUser} data
 * @property {number[]} postIds
 * @property {number[]} roleIds
 * @property {SysRole[]} roles
 * @property {SysPost[]} posts
 */

/** 用户个人资料响应 */
/**
 * UserProfileResult
 * @extends AjaxResult
 * @property {string} roleGroup
 * @property {string} postGroup
 */

/** 用户头像上传响应 */
/**
 * UserProfileAvatarResult
 * @extends AjaxResult
 * @property {string} imgUrl
 */

/** 用户授权角色响应 */
/**
 * UserAuthRoleResult
 * @extends AjaxResult
 * @property {SysUser} user
 * @property {SysRole[]} roles
 */
