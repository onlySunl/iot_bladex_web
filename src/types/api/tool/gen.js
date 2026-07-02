/** 数据表分页查询参数 */
/**
 * GenQueryParams
 * @extends PageDomain
 * @property {string} tableName
 * @property {string} tableComment
 * @property {{} params
 * @property {string} beginTime
 * @property {string} endTime
 */


/** 代码生成业务信息 */
/**
 * GenTable
 * @extends BaseEntity
 * @property {number} tableId
 * @property {string} tableName
 * @property {string} tableComment
 * @property {string} subTableName
 * @property {string} subTableFkName
 * @property {string} className
 * @property {'crud' | 'tree' | 'sub'} tplCategory
 * @property {'element-ui' | 'element-plus'} tplWebType
 * @property {string} packageName
 * @property {string} moduleName
 * @property {string} businessName
 * @property {string} functionName
 * @property {string} functionAuthor
 * @property {'0' | '1'} genType
 * @property {string} genPath
 * @property {string} options
 * @property {string} treeCode
 * @property {string} treeParentCode
 * @property {string} treeName
 * @property {string} parentMenuId
 * @property {string} parentMenuName
 * @property {GenTableColumn[]} columns
 */

/** 生成表列字段信息 */
/**
 * GenTableColumn
 * @extends BaseEntity
 * @property {number} columnId
 * @property {number} tableId
 * @property {string} columnName
 * @property {string} columnComment
 * @property {string} columnType
 * @property {string} javaType
 * @property {string} javaField
 * @property {'1' | '0'} isPk
 * @property {'1' | '0'} isIncrement
 * @property {'1' | '0'} isRequired
 * @property {'1' | '0'} isInsert
 * @property {'1' | '0'} isEdit
 * @property {'1' | '0'} isList
 * @property {'1' | '0'} isQuery
 * @property {'EQ' | 'NE' | 'GT' | 'LT' | 'LIKE' | 'BETWEEN'} queryType
 * @property {string} htmlType
 * @property {string} dictType
 * @property {number} sort
 */

/** 代码生成信息响应 */
/**
 * GenTableInfoResult
 * @property {GenTable} info
 * @property {GenTableColumn[]} rows
 * @property {GenTable[]} tables
 */
