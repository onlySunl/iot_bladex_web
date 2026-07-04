import request from '@/axios'

/**
 * 设备配置分页查询
 * @param {Object} params - 查询参数
 * @returns {Promise}
 */
export const pageDeviceConfig = (params) => {
  return request({
    url: '/api/nvr/device-config/page',
    method: 'get',
    params
  })
}

/**
 * 设备配置列表查询
 * @param {Object} params - 查询参数
 * @returns {Promise}
 */
export const listDeviceConfig = (params) => {
  return request({
    url: '/api/nvr/device-config/list',
    method: 'get',
    params
  })
}

/**
 * 新增设备配置
 * @param {Object} data - 配置数据
 * @returns {Promise}
 */
export const addDeviceConfig = (data) => {
  return request({
    url: '/api/nvr/device-config/save',
    method: 'post',
    data
  })
}

/**
 * 更新设备配置
 * @param {Object} data - 配置数据
 * @returns {Promise}
 */
export const updateDeviceConfig = (data) => {
  return request({
    url: '/api/nvr/device-config/update',
    method: 'put',
    data
  })
}

/**
 * 删除设备配置
 * @param {string|Array} ids - 配置ID
 * @returns {Promise}
 */
export const removeDeviceConfig = (ids) => {
  return request({
    url: '/api/nvr/device-config/remove',
    method: 'delete',
    params: { ids }
  })
}

/**
 * 获取设备配置详情
 * @param {string} id - 配置ID
 * @returns {Promise}
 */
export const getDeviceConfig = (id) => {
  return request({
    url: '/api/nvr/device-config/detail',
    method: 'get',
    params: { id }
  })
}
