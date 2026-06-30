/**
 * Vuex WebSocket 模块
 * 管理 WebSocket 连接状态、设备状态、告警列表
 */
import ws from '@/util/ws'

const state = {
  connected: false,
  deviceStatusMap: {}, // { deviceId: 'online' | 'offline' }
  alertList: [] // 最近告警列表
}

const mutations = {
  SET_CONNECTED(state, connected) {
    state.connected = connected
  },
  UPDATE_DEVICE_STATUS(state, { deviceId, status }) {
    state.deviceStatusMap = { ...state.deviceStatusMap, [deviceId]: status }
  },
  ADD_ALERT(state, alert) {
    // 插入到列表顶部，保留最近50条
    state.alertList = [alert, ...state.alertList].slice(0, 50)
  },
  CLEAR_ALERTS(state) {
    state.alertList = []
  }
}

const actions = {
  /**
   * 初始化 WebSocket 连接并注册消息监听
   */
  initWebSocket({ commit }) {
    // 连接状态监听
    ws.onStatusChange((connected) => {
      commit('SET_CONNECTED', connected)
    })

    // 设备上线
    ws.on('device_online', (data) => {
      commit('UPDATE_DEVICE_STATUS', { deviceId: data.deviceId, status: 'online' })
    })

    // 设备离线
    ws.on('device_offline', (data) => {
      commit('UPDATE_DEVICE_STATUS', { deviceId: data.deviceId, status: 'offline' })
    })

    // 告警消息
    ws.on('alert', (data) => {
      commit('ADD_ALERT', data)
    })

    // 建立连接
    ws.connect()
  },

  /**
   * 关闭 WebSocket 连接
   */
  closeWebSocket({ commit }) {
    ws.off('device_online')
    ws.off('device_offline')
    ws.off('alert')
    ws.offStatusChange()
    ws.close()
    commit('SET_CONNECTED', false)
  },

  /**
   * 订阅指定设备的状态变更（在页面上注册额外回调）
   * @param {Object} params - { deviceId, callback }
   */
  subscribeDevice({ commit }, { deviceId, callback }) {
    const handler = (data) => {
      if (data.deviceId === deviceId && typeof callback === 'function') {
        callback(data)
      }
    }
    ws.on('device_online', handler)
    ws.on('device_offline', handler)
    // 返回取消订阅函数
    return () => {
      ws.off('device_online', handler)
      ws.off('device_offline', handler)
    }
  },

  /**
   * 订阅告警通知（在页面上注册额外回调）
   * @param {Function} callback
   */
  subscribeAlert({ commit }, callback) {
    if (typeof callback === 'function') {
      ws.on('alert', callback)
    }
    return () => {
      ws.off('alert', callback)
    }
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
