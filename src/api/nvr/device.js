import request from '@/router/axios'

// 查询视频监控设备列表
export function listDevice(query) {
    return request({
        url: '/api/qs/device/list',
        method: 'get',
        params: query
    })
}

// 根据行政区域获取视频监控设备列表
export function queryListByCivilCode(query) {
    return request({
        url: '/api/qs/device/queryListByCivilCode',
        method: 'get',
        params: query
    })
}

// 查询视频监控设备详细
export function getDevice(id) {
    return request({
        url: '/api/qs/device/' + id,
        method: 'get'
    })
}

// 新增视频监控设备
export function addDevice(data) {
    return request({
        url: '/api/qs/device',
        method: 'post',
        data: data
    })
}

// 修改视频监控设备
export function updateDevice(data) {
    return request({
        url: '/api/qs/device',
        method: 'put',
        data: data
    })
}

// 删除视频监控设备
export function delDevice(id) {
    return request({
        url: '/api/qs/device/' + id,
        method: 'delete'
    })
}

// 状态修改
export function changeDeviceStatus(id, status) {
    const data = {
        id,
        status
    }
    return request({
        url: '/api/qs/device/changeStatus',
        method: 'put',
        data: data
    })
}

// 获取本地mp4截图
export function getVideoSnapshot(id) {
    return request({
        url: '/api/qs/device/getVideoSnapshot/' + id,
        method: 'put'
    })
}

// 获取计划记录对应的视频监控设备
export function listPlanRecord(query) {
    return request({
        url: '/api/qs/device/listPlanRecord',
        method: 'get',
        params: query
    })
}

// 设备关联录制计划
export function link(data) {
    return request({
        url: '/api/qs/device/link',
        method: 'post',
        data: data
    })
}

// 添加行政区划设备
export function addDeviceToRegion(data) {
    return request({
        url: `/qs/device/region/add`,
        method: 'post',
        data: data
    })
}

// 删除行政区划设备
export function deleteDeviceToRegion(data) {
    return request({
        url: `/qs/device/region/delete`,
        method: 'post',
        data: data
    })
}

// 存在行政区划但无法挂载的设备列表
export function getUnusualCivilCodeList(query) {
    return request({
        url: `/qs/device/civilCode/unusual/list`,
        method: 'get',
        params: query
    })
}

// 清除存在行政区划但无法挂载的设备列表
export function clearDeviceCivilCode(data) {
    return request({
        url: `/qs/device/civilCode/unusual/clear`,
        method: 'post',
        data: data
    })
}

// 获取编码列表
export function getNetworkIdentificationTypeList() {
    return request({
        url: `/qs/device/network/identification/list`,
        method: 'get',
    })
}

// 获取编码列表
export function getDeviceTypeList() {
    return request({
        url: `/qs/device/type/list`,
        method: 'get',
    })
}

// 获取行业编码列表
export function getIndustryCodeList() {
    return request({
        url: `/qs/device/industry/list`,
        method: 'get',
    })
}

// 根据ParentId获取设备列表
export function queryListByParentId(query) {
    return request({
        url: `/qs/device/parent/list`,
        method: 'get',
        params: query
    })
}

// 添加业务分组设备信息
export function addDeviceIdToGroup(data) {
    return request({
        url: `/qs/device/group/add`,
        method: 'post',
        data: data
    })
}

// 删除业务分组设备
export function deleteDeviceToGroup(data) {
    return request({
        url: `/qs/device/group/delete`,
        method: 'post',
        data: data
    })
}

// 存在父节点编号但无法挂载的设备列表
export function queryListByParentForUnusual(query) {
    return request({
        url: `/qs/device/parent/unusual/list`,
        method: 'get',
        params: query
    })
}

// 清除存在分组节点但无法挂载的设备列表
export function clearDeviceParent(data) {
    return request({
        url: `/qs/device/parent/unusual/clear`,
        method: 'post',
        data: data
    })
}

// 开始云台控制
export function startPtz(id, direction, controlSpeed) {
    return request({
        url: `/qs/device/startPtz/${id}`,
        method: 'get',
        params: {
            direction,
            controlSpeed
        }
    })
}

// 结束云台控制
export function endPtz(id, direction, controlSpeed) {
    return request({
        url: `/qs/device/endPtz/${id}`,
        method: 'get',
        params: {
            direction,
            controlSpeed
        }
    })
}

// 获取预置点列表
export function getPresetList(id, channelId) {
  return request({
    url: `/qs/device/preset/list/${id}`,
    method: 'get',
    params: { channelId }
  })
}

// 设置预置点
export function setPreset(id, channelId, presetIndex, presetName) {
  return request({
    url: `/qs/device/preset/set/${id}`,
    method: 'get',
    params: { channelId, presetIndex, presetName }
  })
}

// 调用预置点
export function gotoPreset(id, channelId, presetIndex, speed) {
  return request({
    url: `/qs/device/preset/goto/${id}`,
    method: 'get',
    params: { channelId, presetIndex, speed }
  })
}

// 删除预置点
export function deletePreset(id, channelId, presetIndex) {
  return request({
    url: `/qs/device/preset/delete/${id}`,
    method: 'get',
    params: { channelId, presetIndex }
  })
}

// 灯光控制
export function controlLight(id, channelId, isOn) {
  return request({
    url: `/qs/device/light/${id}`,
    method: 'get',
    params: { channelId, isOn }
  })
}

// 雨刷控制
export function controlWiper(id, channelId, isOn) {
  return request({
    url: `/qs/device/wiper/${id}`,
    method: 'get',
    params: { channelId, isOn }
  })
}
