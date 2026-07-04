/** 字典分页查询参数 */
/**
 * DictTypeQueryParams
 * @extends PageDomain
 * @property {string} dictName
 * @property {string} dictType
 * @property {string} status
 * @property {{} params
 * @property {string} beginTime
 * @property {string} endTime
 */


/** 字典数据查询参数 */
/**
 * DictDataQueryParams
 * @extends PageDomain
 * @property {string} dictName
 * @property {string} dictLabel
 * @property {string} status
 */

/** 字典类型信息 */
/**
 * SysDictType
 * @extends BaseEntity
 * @property {number} dictId
 * @property {string} dictName
 * @property {string} dictType
 * @property {'0' | '1'} status
 */

/** 字典数据信息 */
/**
 * SysDictData
 * @extends BaseEntity
 * @property {number} dictCode
 * @property {string} dictLabel
 * @property {string} dictValue
 * @property {string} dictType
 * @property {string} cssClass
 * @property {string} listClass
 * @property {number} dictSort
 * @property {'Y' | 'N'} isDefault
 * @property {'0' | '1'} status
 */
