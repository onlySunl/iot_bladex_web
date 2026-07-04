import request from '@/axios'

/**
 * @typedef {import("@/types/api/qs/jt1078").Jt1078Device} Jt1078Device
 * @typedef {import("@/types/common").AjaxResult} AjaxResult
 */

/**
 * 获取所有JT1078终端设备列表
 * @returns {Promise<AjaxResult<Jt1078Device[]>>}
 */
export function getAllDevice() {
  return request({
    url: '/jt1078/device/allList',
    method: 'get'
  })
}

/**
 * 查询JT1078设备录像文件列表
 * @param {string} mobileNo 设备绑定手机号
 * @param {number} channelNo 通道号
 * @param {string} startTime 开始时间
 * @param {string} endTime 结束时间
 * @returns {Promise<AjaxResult<any>>}
 */
export function queryJt1078Record(mobileNo, channelNo, startTime, endTime) {
  return request({
    url: `/jt1078/queryRecord/${mobileNo}/${channelNo}`,
    method: 'get',
    params: {
      startTime,
      endTime
    },
    timeout: 30000
  })
}

/**
 * 8104 指令：查询终端参数
 * @param {Object} data 指令请求消息体
 * @returns {Promise<AjaxResult>}
 */
export function queryTerminalParams(data) {
  return request({
    url: '/jt1078/device/8104',
    method: 'post',
    data
  })
}

/**
 * 8103 指令：设置终端参数
 * @param {Object} data 终端参数配置数据
 * @returns {Promise<AjaxResult>}
 */
export function setTerminalParams(data) {
  return request({
    url: '/jt1078/device/8103',
    method: 'post',
    data
  })
}

/**
 * 8106 指令：查询指定终端参数
 * @param {Object} data 参数查询请求体
 * @returns {Promise<AjaxResult>}
 */
export function querySpecificTerminalParams(data) {
  return request({
    url: '/jt1078/device/8106',
    method: 'post',
    data
  })
}

/**
 * 8105 指令：终端远程控制
 * @param {Object} data 终端控制指令数据
 * @returns {Promise<AjaxResult>}
 */
export function terminalControl(data) {
  return request({
    url: '/jt1078/device/8105',
    method: 'post',
    data
  })
}

/**
 * 8107 指令：查询终端属性信息
 * @param {Object} data 指令消息体
 * @returns {Promise<AjaxResult>}
 */
export function queryTerminalAttribute(data) {
  return request({
    url: '/jt1078/device/8107',
    method: 'post',
    data
  })
}

/**
 * 8201 指令：单次位置信息查询
 * @param {Object} data 指令消息体
 * @returns {Promise<AjaxResult>}
 */
export function queryLocation(data) {
  return request({
    url: '/jt1078/device/8201',
    method: 'post',
    data
  })
}

/**
 * 8202 指令：临时位置跟踪控制
 * @param {Object} data 跟踪配置消息体
 * @returns {Promise<AjaxResult>}
 */
export function tempLocationTrack(data) {
  return request({
    url: '/jt1078/device/8202',
    method: 'post',
    data
  })
}

/**
 * 8203 指令：人工确认报警消息
 * @param {Object} data 报警确认消息体
 * @returns {Promise<AjaxResult>}
 */
export function confirmAlarm(data) {
  return request({
    url: '/jt1078/device/8203',
    method: 'post',
    data
  })
}

/**
 * 8204 指令：链路心跳检测请求
 * @param {Object} data 检测指令消息体
 * @returns {Promise<AjaxResult>}
 */
export function linkCheck(data) {
  return request({
    url: '/jt1078/device/8204',
    method: 'post',
    data
  })
}

/**
 * 8300 指令：下发文本消息
 * @param {Object} data 文本消息内容
 * @returns {Promise<AjaxResult>}
 */
export function sendText(data) {
  return request({
    url: '/jt1078/device/8300',
    method: 'post',
    data
  })
}

/**
 * 8301 指令：事件上报设置
 * @param {Object} data 事件配置参数
 * @returns {Promise<AjaxResult>}
 */
export function eventSetting(data) {
  return request({
    url: '/jt1078/device/8301',
    method: 'post',
    data
  })
}

/**
 * 8302 指令：下发问答提问
 * @param {Object} data 提问消息体
 * @returns {Promise<AjaxResult>}
 */
export function sendQuestion(data) {
  return request({
    url: '/jt1078/device/8302',
    method: 'post',
    data
  })
}

/**
 * 8303 指令：信息点播菜单配置
 * @param {Object} data 菜单设置数据
 * @returns {Promise<AjaxResult>}
 */
export function menuSetting(data) {
  return request({
    url: '/jt1078/device/8303',
    method: 'post',
    data
  })
}

/**
 * 8304 指令：信息点播服务下发
 * @param {Object} data 服务指令消息体
 * @returns {Promise<AjaxResult>}
 */
export function infoService(data) {
  return request({
    url: '/jt1078/device/8304',
    method: 'post',
    data
  })
}

/**
 * 8400 指令：电话回拨
 * @param {Object} data 回拨参数消息体
 * @returns {Promise<AjaxResult>}
 */
export function phoneCallback(data) {
  return request({
    url: '/jt1078/device/8400',
    method: 'post',
    data
  })
}

/**
 * 8401 指令：设置终端电话本
 * @param {Object} data 电话本配置数据
 * @returns {Promise<AjaxResult>}
 */
export function setPhoneBook(data) {
  return request({
    url: '/jt1078/device/8401',
    method: 'post',
    data
  })
}

/**
 * 8500 指令：车辆远程控制（断油断电等）
 * @param {Object} data 车辆控制指令数据
 * @returns {Promise<AjaxResult>}
 */
export function vehicleControl(data) {
  return request({
    url: '/jt1078/device/8500',
    method: 'post',
    data
  })
}

/**
 * 8600 指令：设置圆形电子围栏
 * @param {Object} data 圆形围栏参数
 * @returns {Promise<AjaxResult>}
 */
export function setCircleArea(data) {
  return request({
    url: '/jt1078/device/8600',
    method: 'post',
    data
  })
}

/**
 * 8601 指令：删除指定圆形电子围栏
 * @param {Object} data 围栏删除参数
 * @returns {Promise<AjaxResult>}
 */
export function deleteCircleArea(data) {
  return request({
    url: '/jt1078/device/8601',
    method: 'post',
    data
  })
}

/**
 * 8602 指令：设置矩形电子围栏
 * @param {Object} data 矩形围栏参数
 * @returns {Promise<AjaxResult>}
 */
export function setRectArea(data) {
  return request({
    url: '/jt1078/device/8602',
    method: 'post',
    data
  })
}

/**
 * 8603 指令：删除指定矩形电子围栏
 * @param {Object} data 围栏删除参数
 * @returns {Promise<AjaxResult>}
 */
export function deleteRectArea(data) {
  return request({
    url: '/jt1078/device/8603',
    method: 'post',
    data
  })
}

/**
 * 8604 指令：设置多边形电子围栏
 * @param {Object} data 多边形围栏参数
 * @returns {Promise<AjaxResult>}
 */
export function setPolygonArea(data) {
  return request({
    url: '/jt1078/device/8604',
    method: 'post',
    data
  })
}

/**
 * 8605 指令：删除指定多边形电子围栏
 * @param {Object} data 围栏删除参数
 * @returns {Promise<AjaxResult>}
 */
export function deletePolygonArea(data) {
  return request({
    url: '/jt1078/device/8605',
    method: 'post',
    data
  })
}

/**
 * 8606 指令：设置行驶路线规则
 * @param {Object} data 路线配置参数
 * @returns {Promise<AjaxResult>}
 */
export function setRoute(data) {
  return request({
    url: '/jt1078/device/8606',
    method: 'post',
    data
  })
}

/**
 * 8607 指令：删除指定行驶路线
 * @param {Object} data 路线删除参数
 * @returns {Promise<AjaxResult>}
 */
export function deleteRoute(data) {
  return request({
    url: '/jt1078/device/8607',
    method: 'post',
    data
  })
}

/**
 * 8608 指令：查询电子围栏/路线配置数据
 * @param {Object} data 查询条件消息体
 * @returns {Promise<AjaxResult>}
 */
export function queryAreaOrRoute(data) {
  return request({
    url: '/jt1078/device/8608',
    method: 'post',
    data
  })
}

/**
 * 8700 指令：行驶记录仪数据采集
 * @param {Object} data 采集指令消息体
 * @returns {Promise<AjaxResult>}
 */
export function tachographDataCollect(data) {
  return request({
    url: '/jt1078/device/8700',
    method: 'post',
    data
  })
}

/**
 * 8701 指令：行驶记录仪参数下发配置
 * @param {Object} data 记录仪参数数据
 * @returns {Promise<AjaxResult>}
 */
export function tachographParamSend(data) {
  return request({
    url: '/jt1078/device/8701',
    method: 'post',
    data
  })
}

/**
 * 8702 指令：请求上报驾驶员身份信息
 * @param {Object} data 指令消息体
 * @returns {Promise<AjaxResult>}
 */
export function reportDriverInfo(data) {
  return request({
    url: '/jt1078/device/8702',
    method: 'post',
    data
  })
}

/**
 * 8801 指令：终端摄像头立即抓拍
 * @param {Object} data 拍照指令参数
 * @returns {Promise<AjaxResult>}
 */
export function cameraShoot(data) {
  return request({
    url: '/jt1078/device/8801',
    method: 'post',
    data
  })
}

/**
 * 8802 指令：检索终端存储多媒体文件
 * @param {Object} data 多媒体检索条件
 * @returns {Promise<AjaxResult>}
 */
export function searchMultimedia(data) {
  return request({
    url: '/jt1078/device/8802',
    method: 'post',
    data
  })
}

/**
 * 8803 指令：下发多媒体文件上传指令
 * @param {Object} data 上传请求参数
 * @returns {Promise<AjaxResult>}
 */
export function uploadMultimedia(data) {
  return request({
    url: '/jt1078/device/8803',
    method: 'post',
    data
  })
}

/**
 * 8804 指令：终端开始录音控制
 * @param {Object} data 录音指令参数
 * @returns {Promise<AjaxResult>}
 */
export function startRecording(data) {
  return request({
    url: '/jt1078/device/8804',
    method: 'post',
    data
  })
}

/**
 * 8805 指令：单条多媒体文件检索并上传
 * @param {Object} data 多媒体检索上传参数
 * @returns {Promise<AjaxResult>}
 */
export function searchUploadMultimedia(data) {
  return request({
    url: '/jt1078/device/8805',
    method: 'post',
    data
  })
}

/**
 * 8108 指令：下发终端远程升级包
 * @param {Object} data 升级任务参数
 * @returns {Promise<AjaxResult>}
 */
export function terminalUpgrade(data) {
  return request({
    url: '/jt1078/device/8108',
    method: 'post',
    data
  })
}

/**
 * 9003 指令：查询JT1078音视频相关能力属性
 * @param {Object} data 查询指令消息体
 * @returns {Promise<AjaxResult>}
 */
export function queryTerminalAVProperties(data) {
  return request({
    url: '/jt1078/device/9003',
    method: 'post',
    data
  })
}