import request from '@/axios';
export const getAllDevice = () => {
  return request({
    url: '/jt1078/device/allList',
    method: 'get'
  })
}

/**
 * 查询JT1078设备录像列表
 * @param mobileNo 手机号
 * @param channelNo 通道号
 * @param startTime 开始时间
 * @param endTime 结束时间
 */
export const queryJt1078Record = (
    mobileNo,
    channelNo,
    startTime,
    endTime
) => {
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
 * 8104 查询终端参数
 * @param data 消息体
 */
export const queryTerminalParams = (data) => {
  return request({
    url: '/jt1078/device/8104',
    method: 'post',
    data
  })
}

/**
 * 8103 设置终端参数
 * @param data 参数数据
 */
export const setTerminalParams = (data) => {
  return request({
    url: '/jt1078/device/8103',
    method: 'post',
    data
  })
}

/**
 * 8106 查询指定终端参数
 * @param data 参数数据
 */
export const querySpecificTerminalParams = (data) => {
  return request({
    url: '/jt1078/device/8106',
    method: 'post',
    data
  })
}

/**
 * 8105 终端控制
 * @param data 控制数据
 */
export const terminalControl = (data) => {
  return request({
    url: '/jt1078/device/8105',
    method: 'post',
    data
  })
}

/**
 * 8107 查询终端属性
 * @param data 消息体
 */
export const queryTerminalAttribute = (data) => {
  return request({
    url: '/jt1078/device/8107',
    method: 'post',
    data
  });
}

/**
 * 8201 位置信息查询
 * @param data 消息体
 */
export const queryLocation = (data) => {
  return request({
    url: '/jt1078/device/8201',
    method: 'post',
    data
  });
}

/**
 * 8202 临时位置跟踪控制
 * @param data 消息体
 */
export const tempLocationTrack = (data) => {
  return request({
    url: '/jt1078/device/8202',
    method: 'post',
    data
  });
}

/**
 * 8203 人工确认报警消息
 * @param data 消息体
 */
export const confirmAlarm = (data) => {
  return request({
    url: '/jt1078/device/8203',
    method: 'post',
    data
  });
}

/**
 * 8204 服务器向终端发起链路检测请求
 * @param data 消息体
 */
export const linkCheck = (data) => {
  return request({
    url: '/jt1078/device/8204',
    method: 'post',
    data
  });
}

/**
 * 8300 文本信息下发
 * @param data 消息体
 */
export const sendText = (data) => {
  return request({
    url: '/jt1078/device/8300',
    method: 'post',
    data
  });
}

/**
 * 8301 事件设置
 * @param data 消息体
 */
export const eventSetting = (data) => {
  return request({
    url: '/jt1078/device/8301',
    method: 'post',
    data
  });
}

/**
 * 8302 提问下发
 * @param data 消息体
 */
export const sendQuestion = (data) => {
  return request({
    url: '/jt1078/device/8302',
    method: 'post',
    data
  });
}

/**
 * 8303 信息点播菜单设置
 * @param data 消息体
 */
export const menuSetting = (data) => {
  return request({
    url: '/jt1078/device/8303',
    method: 'post',
    data
  });
}

/**
 * 8304 信息服务
 * @param data 消息体
 */
export const infoService = (data) => {
  return request({
    url: '/jt1078/device/8304',
    method: 'post',
    data
  });
}

/**
 * 8400 电话回拨
 * @param data 消息体
 */
export const phoneCallback = (data) => {
  return request({
    url: '/jt1078/device/8400',
    method: 'post',
    data
  });
}

/**
 * 8401 设置电话本
 * @param data 消息体
 */
export const setPhoneBook = (data) => {
  return request({
    url: '/jt1078/device/8401',
    method: 'post',
    data
  });
}

/**
 * 8500 车辆控制
 * @param data 消息体
 */
export const vehicleControl = (data) => {
  return request({
    url: '/jt1078/device/8500',
    method: 'post',
    data
  });
}

/**
 * 8600 设置圆形区域
 * @param data 消息体
 */
export const setCircleArea = (data) => {
  return request({
    url: '/jt1078/device/8600',
    method: 'post',
    data
  });
}

/**
 * 8601 删除圆形区域
 * @param data 消息体
 */
export const deleteCircleArea = (data) => {
  return request({
    url: '/jt1078/device/8601',
    method: 'post',
    data
  });
}

/**
 * 8602 设置矩形区域
 * @param data 消息体
 */
export const setRectArea = (data) => {
  return request({
    url: '/jt1078/device/8602',
    method: 'post',
    data
  });
}

/**
 * 8603 删除矩形区域
 * @param data 消息体
 */
export const deleteRectArea = (data) => {
  return request({
    url: '/jt1078/device/8603',
    method: 'post',
    data
  });
}

/**
 * 8604 设置多边形区域
 * @param data 消息体
 */
export const setPolygonArea = (data) => {
  return request({
    url: '/jt1078/device/8604',
    method: 'post',
    data
  });
}

/**
 * 8605 删除多边形区域
 * @param data 消息体
 */
export const deletePolygonArea = (data) => {
  return request({
    url: '/jt1078/device/8605',
    method: 'post',
    data
  });
}

/**
 * 8606 设置路线
 * @param data 消息体
 */
export const setRoute = (data) => {
  return request({
    url: '/jt1078/device/8606',
    method: 'post',
    data
  });
}

/**
 * 8607 删除路线
 * @param data 消息体
 */
export const deleteRoute = (data) => {
  return request({
    url: '/jt1078/device/8607',
    method: 'post',
    data
  });
}

/**
 * 8608 查询区域或线路数据
 * @param data 消息体
 */
export const queryAreaOrRoute = (data) => {
  return request({
    url: '/jt1078/device/8608',
    method: 'post',
    data
  });
}

/**
 * 8700 行驶记录仪数据采集命令
 * @param data 消息体
 */
export const tachographDataCollect = (data) => {
  return request({
    url: '/jt1078/device/8700',
    method: 'post',
    data
  });
}

/**
 * 8701 行驶记录仪参数下传命令
 * @param data 消息体
 */
export const tachographParamSend = (data) => {
  return request({
    url: '/jt1078/device/8701',
    method: 'post',
    data
  });
}

/**
 * 8702 上报驾驶员身份信息请求
 * @param data 消息体
 */
export const reportDriverInfo = (data) => {
  return request({
    url: '/jt1078/device/8702',
    method: 'post',
    data
  });
}

/**
 * 8801 摄像头立即拍摄命令
 * @param data 消息体
 */
export const cameraShoot = (data) => {
  return request({
    url: '/jt1078/device/8801',
    method: 'post',
    data
  });
}

/**
 * 8802 存储多媒体数据检索
 * @param data 消息体
 */
export const searchMultimedia = (data) => {
  return request({
    url: '/jt1078/device/8802',
    method: 'post',
    data
  });
}

/**
 * 8803 存储多媒体数据上传
 * @param data 消息体
 */
export const uploadMultimedia = (data) => {
  return request({
    url: '/jt1078/device/8803',
    method: 'post',
    data
  });
}

/**
 * 8804 录音开始命令
 * @param data 消息体
 */
export const startRecording = (data) => {
  return request({
    url: '/jt1078/device/8804',
    method: 'post',
    data
  });
}

/**
 * 8805 单条存储多媒体数据检索上传命令
 * @param data 消息体
 */
export const searchUploadMultimedia = (data) => {
  return request({
    url: '/jt1078/device/8805',
    method: 'post',
    data
  });
}

/**
 * 8108 下发终端升级包
 * @param data 消息体
 */
export const terminalUpgrade = (data) => {
  return request({
    url: '/jt1078/device/8108',
    method: 'post',
    data
  });
}

/**
 * 9003 查询终端音视频属性
 * @param data 消息体
 */
export const queryTerminalAVProperties = (data) => {
  return request({
    url: '/jt1078/device/9003',
    method: 'post',
    data
  });
}
