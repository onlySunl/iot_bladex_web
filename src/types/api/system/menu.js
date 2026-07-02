/** 菜单查询参数 */
/**
 * MenuQueryParams
 * @property {string} menuName
 * @property {string} status
 */

/** 菜单信息 */
/**
 * SysMenu
 * @extends BaseEntity
 * @property {number} menuId
 * @property {number} parentId
 * @property {string} menuName
 * @property {number} orderNum
 * @property {string} path
 * @property {string} component
 * @property {string} query
 * @property {string} routeName
 * @property {string} perms
 * @property {string} icon
 * @property {'0' | '1'} isFrame
 * @property {'0' | '1'} isCache
 * @property {'M' | 'C' | 'F'} menuType
 * @property {'0' | '1'} visible
 * @property {'0' | '1'} status
 */

/**
 * RoleMenuTreeselectResult
 * @extends AjaxResult
 * @property {number[]} checkedKeys
 * @property {TreeSelect[]} menus
 */
