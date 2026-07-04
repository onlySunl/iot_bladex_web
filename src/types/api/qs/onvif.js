/**
 * WSDiscoveryDevice 返回前端类型
 * @typedef {Object} WSDiscoveryDevice
 * @property {string} hostName 主机名称
 * @property {string} ip IP地址
 */

/**
 * WSOnvifDevice 设备信息类型
 * @typedef {Object} WSOnvifDevice
 * @property {string} ip IP地址
 * @property {string} auth 认证方式
 * @property {string} hostName 主机名称
 * @property {string} username 用户名
 * @property {string} password 密码
 */

/**
 * OnvifDevice 设备信息类型
 * @typedef {Object} OnvifDevice
 * @property {string} ip IP地址
 * @property {string} userName 用户名
 * @property {string} password 密码
 * @property {string} hostName 主机名称
 * @property {string} firm 设备厂商
 * @property {string} model 设备型号
 * @property {string} firmwareVersion 固件版本
 * @property {string[]} streamUris 球机多条播放流 URI 列表
 */