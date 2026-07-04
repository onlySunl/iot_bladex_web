import request from '@/axios'

/**
 * @typedef {import('@/types').AjaxResult} AjaxResult
 * @typedef {import('@/types').TableDataInfo} TableDataInfo
 * @typedef {import('@/types/api').QsDevice} QsDevice
 */

/**
 * 国标级联平台配置
 * @typedef {Object} QsGb28181Platform
 * @property {number} [id] 主键ID
 * @property {number} [enable] 是否启用 0禁用 1启用
 * @property {string} [name] 平台名称
 * @property {string} [serverGbId] 上级平台国标ID
 * @property {string} [serverGbDomain] 上级平台域名
 * @property {string} [serverIp] 上级平台SIP IP
 * @property {number} [serverPort] 上级平台SIP端口
 * @property {string} [deviceGbId] 本级平台国标ID
 * @property {string} [deviceIp] 本级SIP内网IP
 * @property {number} [devicePort] 本级SIP端口
 * @property {string} [username] 平台注册用户名
 * @property {string} [password] 平台注册密码
 * @property {string} [expires] 注册有效期(秒)
 * @property {string} [keepTimeout] 心跳超时时间
 * @property {string} [transport] 传输协议 UDP/TCP
 * @property {string} [civilCode] 行政区划编码
 * @property {string} [manufacturer] 厂商
 * @property {string} [model] 型号
 * @property {string} [address] 地址
 * @property {string} [characterSet] 字符集 UTF-8/GB2312
 * @property {number} [ptz] 是否支持PTZ
 * @property {number} [rtcp] 是否开启RTCP
 * @property {number} [status] 级联状态
 * @property {number} [catalogGroup] 是否按业务分组推送目录
 * @property {number} [registerWay] 注册方式
 * @property {number} [secrecy] 保密属性 0不涉密 1涉密
 * @property {string} [createTime] 创建时间
 * @property {string} [updateTime] 更新时间
 * @property {number} [asMessageChannel] 是否作为消息通道
 * @property {number} [catalogWithPlatform] 是否推送平台级目录
 * @property {number} [catalogWithGroup] 是否推送业务分组目录
 * @property {number} [catalogWithRegion] 是否推送行政区划目录
 * @property {number} [autoPushChannel] 是否自动推送通道
 * @property {string} [sendStreamIp] 流媒体推流IP
 * @property {string} [serverId] 媒体服务ID
 */

/**
 * 平台分页查询参数
 * @typedef {Object} PlatformQueryParams
 * @property {number} [pageNum] 页码
 * @property {number} [pageSize] 每页条数
 * @property {string} [name] 平台名称模糊查询
 * @property {string} [serverGbId] 上级平台国标编号
 * @property {number} [status] 级联状态
 * @property {number} [enable] 是否启用
 */

/**
 * 分页查询国标级联平台列表
 * @param {PlatformQueryParams} query 查询条件
 * @returns {Promise<TableDataInfo<QsGb28181Platform[]>>}
 */
export function listPlatform(query) {
  return request({
    url: '/qs/platform/list',
    method: 'get',
    params: query
  })
}

/**
 * 获取平台详情
 * @param {number} id 平台主键ID
 * @returns {Promise<AjaxResult<QsGb28181Platform>>}
 */
export function getPlatform(id) {
  return request({
    url: `/qs/platform/${id}`,
    method: 'get'
  })
}

/**
 * 新增国标级联平台
 * @param {QsGb28181Platform} data 平台表单数据
 * @returns {Promise<AjaxResult>}
 */
export function addPlatform(data) {
  return request({
    url: '/qs/platform',
    method: 'post',
    data
  })
}

/**
 * 修改国标级联平台
 * @param {QsGb28181Platform} data 平台表单数据
 * @returns {Promise<AjaxResult>}
 */
export function updatePlatform(data) {
  return request({
    url: '/qs/platform',
    method: 'put',
    data
  })
}

/**
 * 删除平台（支持单个ID/批量ID数组）
 * @param {number | number[]} id 平台ID或ID数组
 * @returns {Promise<AjaxResult>}
 */
export function delPlatform(id) {
  return request({
    url: `/qs/platform/${id}`,
    method: 'delete'
  })
}

/**
 * 平台通道绑定请求参数
 * @typedef {Object} PlatformChannelLinkRequest
 * @property {number} [platformId] 级联平台ID
 * @property {number[]} [deviceIds] 待绑定设备ID数组
 * @property {boolean} [allLink] 是否全量绑定
 */

/**
 * 设备查询参数（平台绑定设备用）
 * @typedef {Object} DeviceQueryParams
 * @property {number} [page] 页码
 * @property {number} [count] 每页条数
 * @property {string} [deviceName] 设备名称
 * @property {string} [ipAddress] 设备IP
 * @property {string} [type] 设备类型
 * @property {string} [deviceStatus] 设备在线状态
 */

/**
 * 查询可绑定/已绑定平台的设备列表
 * @param {DeviceQueryParams} query 分页筛选参数
 * @param {number} [platformId] 平台ID
 * @param {boolean} [hasLink] true已绑定 false未绑定
 * @returns {Promise<TableDataInfo<QsDevice[]>>}
 */
export function listPlatformDevice(query, platformId, hasLink) {
  return request({
    url: '/qs/platformChannel/deviceList',
    method: 'get',
    params: { ...query, platformId, hasLink }
  })
}

/**
 * 设备绑定到级联平台
 * @param {PlatformChannelLinkRequest} data 绑定参数
 * @returns {Promise<AjaxResult>}
 */
export function linkDevice(data) {
  return request({
    url: '/qs/platformChannel/link',
    method: 'post',
    data
  })
}

/**
 * 解绑平台下已关联设备
 * @param {PlatformChannelLinkRequest} data 解绑参数
 * @returns {Promise<AjaxResult>}
 */
export function unlinkDevice(data) {
  return request({
    url: '/qs/platformChannel/unlink',
    method: 'post',
    data
  })
}

/**
 * 启动平台级联注册
 * @param {number} id 平台ID
 * @returns {Promise<AjaxResult>}
 */
export function registerPlatform(id) {
  return request({
    url: `/qs/platform/cascade/start/${id}`,
    method: 'post'
  })
}

/**
 * 停止平台级联注册
 * @param {number} id 平台ID
 * @returns {Promise<AjaxResult>}
 */
export function unregisterPlatform(id) {
  return request({
    url: `/qs/platform/cascade/stop/${id}`,
    method: 'post'
  })
}

/**
 * 手动向上级平台推送设备目录
 * @param {number} id 平台ID
 * @returns {Promise<AjaxResult>}
 */
export function pushCatalog(id) {
  return request({
    url: `/qs/platform/cascade/pushCatalog/${id}`,
    method: 'post'
  })
}