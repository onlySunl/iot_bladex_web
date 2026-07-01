import request from '@/router/axios'

export function getAllDevice() {
  return request({ url: '/jt1078/device/allList', method: 'get' })
}

/**
 * 查询JT1078设备录像列表
 */
export function queryJt1078Record(mobileNo, channelNo, startTime, endTime) {
  return request({
    url: '/jt1078/queryRecord/' + mobileNo + '/' + channelNo,
    method: 'get',
    params: { startTime: startTime, endTime: endTime },
    timeout: 30000
  })
}

/** 8104 查询终端参数 */
export function queryTerminalParams(data) {
  return request({ url: '/jt1078/device/8104', method: 'post', data: data })
}

/** 8103 设置终端参数 */
export function setTerminalParams(data) {
  return request({ url: '/jt1078/device/8103', method: 'post', data: data })
}

/** 8106 查询指定终端参数 */
export function querySpecificTerminalParams(data) {
  return request({ url: '/jt1078/device/8106', method: 'post', data: data })
}

/** 8105 终端控制 */
export function terminalControl(data) {
  return request({ url: '/jt1078/device/8105', method: 'post', data: data })
}

/** 8107 查询终端属性 */
export function queryTerminalAttribute(data) {
  return request({ url: '/jt1078/device/8107', method: 'post', data: data })
}

/** 8201 位置信息查询 */
export function queryLocation(data) {
  return request({ url: '/jt1078/device/8201', method: 'post', data: data })
}

/** 8202 临时位置跟踪控制 */
export function tempLocationTrack(data) {
  return request({ url: '/jt1078/device/8202', method: 'post', data: data })
}

/** 8203 人工确认报警消息 */
export function confirmAlarm(data) {
  return request({ url: '/jt1078/device/8203', method: 'post', data: data })
}

/** 8204 服务器向终端发起链路检测请求 */
export function linkCheck(data) {
  return request({ url: '/jt1078/device/8204', method: 'post', data: data })
}

/** 8300 文本信息下发 */
export function sendText(data) {
  return request({ url: '/jt1078/device/8300', method: 'post', data: data })
}

/** 8301 事件设置 */
export function eventSetting(data) {
  return request({ url: '/jt1078/device/8301', method: 'post', data: data })
}

/** 8302 提问下发 */
export function sendQuestion(data) {
  return request({ url: '/jt1078/device/8302', method: 'post', data: data })
}

/** 8303 信息点播菜单设置 */
export function menuSetting(data) {
  return request({ url: '/jt1078/device/8303', method: 'post', data: data })
}

/** 8304 信息服务 */
export function infoService(data) {
  return request({ url: '/jt1078/device/8304', method: 'post', data: data })
}

/** 8400 电话回拨 */
export function phoneCallback(data) {
  return request({ url: '/jt1078/device/8400', method: 'post', data: data })
}

/** 8401 设置电话本 */
export function setPhoneBook(data) {
  return request({ url: '/jt1078/device/8401', method: 'post', data: data })
}

/** 8500 车辆控制 */
export function vehicleControl(data) {
  return request({ url: '/jt1078/device/8500', method: 'post', data: data })
}

/** 8600 设置圆形区域 */
export function setCircleArea(data) {
  return request({ url: '/jt1078/device/8600', method: 'post', data: data })
}

/** 8601 删除圆形区域 */
export function deleteCircleArea(data) {
  return request({ url: '/jt1078/device/8601', method: 'post', data: data })
}

/** 8602 设置矩形区域 */
export function setRectArea(data) {
  return request({ url: '/jt1078/device/8602', method: 'post', data: data })
}

/** 8603 删除矩形区域 */
export function deleteRectArea(data) {
  return request({ url: '/jt1078/device/8603', method: 'post', data: data })
}

/** 8604 设置多边形区域 */
export function setPolygonArea(data) {
  return request({ url: '/jt1078/device/8604', method: 'post', data: data })
}

/** 8605 删除多边形区域 */
export function deletePolygonArea(data) {
  return request({ url: '/jt1078/device/8605', method: 'post', data: data })
}

/** 8606 设置路线 */
export function setRoute(data) {
  return request({ url: '/jt1078/device/8606', method: 'post', data: data })
}

/** 8607 删除路线 */
export function deleteRoute(data) {
  return request({ url: '/jt1078/device/8607', method: 'post', data: data })
}

/** 8608 查询区域或线路数据 */
export function queryAreaOrRoute(data) {
  return request({ url: '/jt1078/device/8608', method: 'post', data: data })
}

/** 8700 行驶记录仪数据采集命令 */
export function tachographDataCollect(data) {
  return request({ url: '/jt1078/device/8700', method: 'post', data: data })
}

/** 8701 行驶记录仪参数下传命令 */
export function tachographParamSend(data) {
  return request({ url: '/jt1078/device/8701', method: 'post', data: data })
}

/** 8702 上报驾驶员身份信息请求 */
export function reportDriverInfo(data) {
  return request({ url: '/jt1078/device/8702', method: 'post', data: data })
}

/** 8801 摄像头立即拍摄命令 */
export function cameraShoot(data) {
  return request({ url: '/jt1078/device/8801', method: 'post', data: data })
}
