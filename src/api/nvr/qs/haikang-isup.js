import request from '@/axios';
import {HaikangIsupDevice} from "@/types/api";
import {AjaxResult} from "@/types";

// 查询海康isup设备列表
export const listHaiKangIsupDevice = () => {
    return request({
        url: '/haikangIsup/device/list',
        method: 'get',
    })
}

/**
 * 查询海康ISUP设备录像列表
 * @param deviceId 设备ID
 * @param channelId 通道ID
 * @param startTime 开始时间
 * @param endTime 结束时间
 */
export const queryHaiKangIsupRecord = (
    deviceId,
    channelId,
    startTime,
    endTime
) => {
    return request({
        url: `/haikangIsup/device/getRecMonth/${deviceId}/${channelId}`,
        method: 'get',
        params: {
            startTime,
            endTime
        },
        timeout: 30000
    })
}

/**
 * 重启海康ISUP设备
 * @param deviceId 设备ID
 */
export const rebootHaiKangIsupDevice = (deviceId) => {
    return request({
        url: `/haikangIsup/device/rebootHaiKangDevice/${deviceId}`,
        method: 'get'
    })
}

/**
 * 获取海康ISUP设备时间
 * @param deviceId 设备ID
 */
export const getHaiKangIsupDevTime = (deviceId) => {
    return request({
        url: `/haikangIsup/device/getHaiKangDevTime/${deviceId}`,
        method: 'get'
    })
}

/**
 * 设置海康ISUP设备时间
 * @param deviceId 设备ID
 * @param time 时间，格式为 yyyy-MM-dd HH:mm:ss
 */
export const setHaiKangIsupDevTime = (deviceId, time) => {
    return request({
        url: `/haikangIsup/device/setHaiKangDevTime/${deviceId}`,
        method: 'get',
        params: { time }
    })
}

/**
 * 海康ISUP设备抓图并保存
 * @param deviceId 设备ID
 * @param channelId 通道ID
 * @param snapshotType 抓图类型
 */
export const captureHaiKangIsupAndSave = (deviceId, channelId, snapshotType) => {
    return request({
        url: `/haikangIsup/device/captureAndSave/${deviceId}/${channelId}`,
        method: 'post',
        params: { snapshotType }
    })
}

/**
 * 海康ISUP设备录像下载请求参数
 */

/**
 * 海康ISUP设备录像直接下载到用户电脑
 * @param data 下载请求
 */
export const downloadHaikangIsupRecordDirect = (data: HaikangIsupRecordDownloadRequest) => {
    return request({
        url: '/haikangIsup/device/downloadRecordDirect',
        method: 'post',
        data: data,
        responseType: 'blob',
        timeout: 300000
    })
}

/**
 * 获取海康ISUP设备信息
 * @param deviceId 设备ID
 */
export const getHaiKangIsupDeviceInfo = (deviceId) => {
    return request({
        url: `/haikangIsup/device/getHaiKangIsupDeviceInfo/${deviceId}`,
        method: 'get'
    })
}

/**
 * 获取海康ISUP存储信息
 * @param deviceId 设备ID
 */
export const getHaiKangIsupStorageInfo = (deviceId) => {
    return request({
        url: `/haikangIsup/device/getHaiKangIsupStorageInfo/${deviceId}`,
        method: 'get'
    })
}

/**
 * 获取海康ISUP SD卡信息
 * @param deviceId 设备ID
 */
export const getHaiKangIsupSDCardInfo = (deviceId) => {
    return request({
        url: `/haikangIsup/device/getHaiKangIsupSDCardInfo/${deviceId}`,
        method: 'get'
    })
}

/**
 * 获取海康ISUP码率信息
 * @param deviceId 设备ID
 */
export const getHaiKangIsupBitrateInfo = (deviceId) => {
    return request({
        url: `/haikangIsup/device/getHaiKangIsupBitrateInfo/${deviceId}`,
        method: 'get'
    })
}

/**
 * 获取海康ISUP网络状态信息
 * @param deviceId 设备ID
 */
export const getHaiKangIsupNetworkStatusInfo = (deviceId) => {
    return request({
        url: `/haikangIsup/device/getHaiKangIsupNetworkStatusInfo/${deviceId}`,
        method: 'get'
    })
}

/**
 * 获取海康ISUP软件版本信息
 * @param deviceId 设备ID
 */
export const getHaiKangIsupSoftwareVersionInfo = (deviceId) => {
    return request({
        url: `/haikangIsup/device/getHaiKangIsupSoftwareVersionInfo/${deviceId}`,
        method: 'get'
    })
}

/**
 * 获取海康ISUP电源状态信息
 * @param deviceId 设备ID
 */
export const getHaiKangIsupPowerStateInfo = (deviceId) => {
    return request({
        url: `/haikangIsup/device/getHaiKangIsupPowerStateInfo/${deviceId}`,
        method: 'get'
    })
}

/**
 * 获取海康ISUP摄像头属性信息
 * @param deviceId 设备ID
 */
export const getHaiKangIsupCameraInfo = (deviceId) => {
    return request({
        url: `/haikangIsup/device/getHaiKangIsupCameraInfo/${deviceId}`,
        method: 'get'
    })
}

/**
 * 获取海康ISUP系统参数
 * @param deviceId 设备ID
 */
export const getHaiKangIsupSystemParam = (deviceId) => {
    return request({
        url: `/haikangIsup/device/getHaiKangIsupSystemParam/${deviceId}`,
        method: 'get'
    })
}

/**
 * 获取海康ISUP视频参数
 * @param deviceId 设备ID
 * @param streamType 流类型
 */
export const getHaiKangIsupVideoParam = (deviceId, streamType) => {
    return request({
        url: `/haikangIsup/device/getHaiKangIsupVideoParam/${deviceId}`,
        method: 'get',
        params: { streamType }
    })
}

/**
 * 获取海康系统状态信息
 * @param deviceId 设备ID
 */
export const getHaiKangIsupSystemStatus = (deviceId) => {
    return request({
        url: `/haikangIsup/device/getHaiKangIsupSystemStatus/${deviceId}`,
        method: 'get'
    });
}

/**
 * 获取海康设备信息（XML格式）
 * @param deviceId 设备ID
 */
export const getHaiKangIsupDeviceInfoXml = (deviceId) => {
    return request({
        url: `/haikangIsup/device/getHaiKangIsupDeviceInfoXml/${deviceId}`,
        method: 'get'
    });
}

/**
 * 海康设备远程升级请求参数
 */

/**
 * 海康设备远程升级
 * @param request 升级请求参数
 */
export const upgradeHaiKangIsupDevice = (data: HaiKangIsupUpgradeRequest) => {
  return request({
    url: '/haikangIsup/device/upgradeHaiKangIsupDevice',
    method: 'post',
    data: data
  });
}

/**
 * 获取海康ISUP设备配置信息
 * @param deviceId 设备ID
 */
export const getHaiKangIsupDeviceConfig = (deviceId) => {
  return request({
    url: `/haikangIsup/device/getHaiKangIsupDeviceConfig/${deviceId}`,
    method: 'get'
  });
}

/**
 * 设置海康ISUP设备配置信息
 * @param deviceId 设备ID
 * @param config 配置信息
 */
export const setHaiKangIsupDeviceConfig = (deviceId, config) => {
  return request({
    url: `/haikangIsup/device/setHaiKangIsupDeviceConfig/${deviceId}`,
    method: 'post',
    data: config
  });
}

/**
 * 获取海康ISUP版本信息
 * @param deviceId 设备ID
 */
export const getHaiKangIsupVersionInfo = (deviceId) => {
  return request({
    url: `/haikangIsup/device/getHaiKangIsupVersionInfo/${deviceId}`,
    method: 'get'
  });
}

