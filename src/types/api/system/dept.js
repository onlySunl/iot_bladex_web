/** 部门查询参数 */
/**
 * DeptQueryParams
 * @property {string} deptName
 * @property {string} status
 */

/** 保存部门排序参数 */
/**
 * DeptSortParams
 * @property {string} deptIds
 * @property {string} orderNums
 */

/** 部门信息 */
/**
 * SysDept
 * @extends BaseEntity
 * @property {number} deptId
 * @property {number} parentId
 * @property {string} ancestors
 * @property {string} deptName
 * @property {number} orderNum
 * @property {string} leader
 * @property {string} phone
 * @property {string} email
 * @property {'0' | '1'} status
 * @property {SysDept[]} children
 */
