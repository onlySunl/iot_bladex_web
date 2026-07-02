import request from '@/axios'
import {OnvifDevice, WSDiscoveryDevice, WSOnvifDevice} from "@/types/api";
import {AjaxResult} from "@/types";

// 获取onvif设备列表
export function getOnvifDeviceList() {
    return request({
        url: '/onvif/device/getOnvifDeviceList',
        method: 'get',
        timeout
    })
}

// 验证登录onvif设备
export function onvifLogin(data) {
    return request({
        url: '/onvif/device/login',
        method: 'post',
        data,
        timeout
    })
}

/**
 * 查询ONVIF设备录像列表
 * @param deviceIp 设备IP
 * @param username 用户名
 * @param password 密码
 * @param startTime 开始时间
 * @param endTime 结束时间
 */
export function queryOnvifRecord(
    deviceIp,
    username,
    password,
    startTime,
    endTime
) {
    return request({
        url: `/onvif/device/queryRecord`,
        method: 'get',
        params: {
            deviceIp,
            username,
            password,
            startTime,
            endTime
        },
        timeout
    })
}

/**
 * ONVIF设备重启
 * @param deviceIp 设备IP
 * @param username 用户名
 * @param password 密码
 */
export function restartOnvifDevice(
  deviceId
) {
  return request({
    url: `/onvif/device/rebootOnvifDevice/${deviceId}`,
    method: 'get',
    timeout
  })
}

/**
 * ONVIF设备校时
 * @param deviceId 设备ID
 * @param dateTime 要设置的时间（可选，不传则使用服务器时间）
 */
export function syncOnvifDeviceTime(
  deviceId,
  dateTime
) {
  return request({
    url: `/onvif/device/syncOnvifDeviceTime/${deviceId}`,
    method: 'get',
    params ? { dateTime } : undefined,
    timeout
  })
}

/**
 * 获取ONVIF设备时间
 * @param deviceId 设备ID
 */
export function getOnvifDeviceTime(
  deviceId
) {
  return request({
    url: `/onvif/device/getOnvifDeviceTime/${deviceId}`,
    method: 'get',
    timeout
  })
}

/**
 * 获取ONVIF设备信息
 * @param deviceId 设备ID
 */
export function getOnvifDeviceInfo(
  deviceId
) {
  return request({
    url: `/onvif/device/getOnvifDeviceInfo/${deviceId}`,
    method: 'get',
    timeout
  })
}

/**
 * ONVIF设备抓图并保存
 * @param deviceId 设备ID
 * @param channelId 通道ID
 * @param snapshotType 抓图类型
 */
export function captureOnvifAndSave(
    deviceId,
    channelId,
    snapshotType = 'manual'
) {
    return request({
        url: `/onvif/device/captureAndSave/${deviceId}/${channelId}`,
        method: 'post',
        params: { snapshotType },
        timeout
    })
}

/**
 * 获取ONVIF设备存储配置
 * @param deviceId 设备ID
 */
export function getOnvifStorageConfigurations(
    deviceId
) {
    return request({
        url: `/onvif/device/getStorageConfigurations/${deviceId}`,
        method: 'get',
        timeout
    })
}

/**
 * 获取ONVIF设备存储能力
 * @param deviceId 设备ID
 */
export function getOnvifStorageCapabilities(
    deviceId
) {
    return request({
        url: `/onvif/device/getStorageCapabilities/${deviceId}`,
        method: 'get',
        timeout
    })
}

/**
 * 获取ONVIF设备存储状态
 * @param deviceId 设备ID
 */
export function getOnvifStorageState(
    deviceId
) {
    return request({
        url: `/onvif/device/getStorageState/${deviceId}`,
        method: 'get',
        timeout
    });
}

/**
 * 获取ONVIF网络接口配置
 * @param deviceId 设备ID
 */
export function getOnvifNetworkInterfaces(
    deviceId
) {
    return request({
        url: `/onvif/device/getNetworkInterfaces/${deviceId}`,
        method: 'get',
        timeout
    });
}

/**
 * 获取ONVIF网络协议配置
 * @param deviceId 设备ID
 */
export function getOnvifNetworkProtocols(
    deviceId
) {
    return request({
        url: `/onvif/device/getNetworkProtocols/${deviceId}`,
        method: 'get',
        timeout
    });
}

/**
 * 获取ONVIF视频源配置
 * @param deviceId 设备ID
 */
export function getOnvifVideoSourceConfigs(
    deviceId
) {
    return request({
        url: `/onvif/device/getVideoSourceConfigs/${deviceId}`,
        method: 'get',
        timeout
    });
}

/**
 * 获取ONVIF视频编码器配置
 * @param deviceId 设备ID
 */
export function getOnvifVideoEncoderConfigs(
    deviceId
) {
    return request({
        url: `/onvif/device/getVideoEncoderConfigs/${deviceId}`,
        method: 'get',
        timeout
    });
}

/**
 * 获取ONVIF音频源配置
 * @param deviceId 设备ID
 */
export function getOnvifAudioSourceConfigs(
    deviceId
) {
    return request({
        url: `/onvif/device/getAudioSourceConfigs/${deviceId}`,
        method: 'get',
        timeout
    });
}

/**
 * 获取ONVIF音频编码器配置
 * @param deviceId 设备ID
 */
export function getOnvifAudioEncoderConfigs(
    deviceId
) {
    return request({
        url: `/onvif/device/getAudioEncoderConfigs/${deviceId}`,
        method: 'get',
        timeout
    });
}

/**
 * 获取ONVIF视频输出配置
 * @param deviceId 设备ID
 */
export function getOnvifVideoOutputConfigs(
    deviceId
) {
    return request({
        url: `/onvif/device/getVideoOutputConfigs/${deviceId}`,
        method: 'get',
        timeout
    });
}
