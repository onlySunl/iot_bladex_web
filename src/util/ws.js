/**
 * IoT WebSocket 工具类
 * 封装连接管理、断线重连、心跳检测、消息分发
 */
class IoTWebSocket {
  constructor() {
    this.ws = null
    this.url = `ws://${location.host}/ws/iot`
    this.reconnectInterval = 3000 // 重连间隔 3秒
    this.maxReconnectTimes = 10 // 最大重连次数
    this.reconnectCount = 0
    this.reconnectTimer = null
    this.heartbeatTimer = null
    this.heartbeatInterval = 30000 // 心跳间隔 30秒
    this.listeners = {} // { type: [callback, ...] }
    this.statusListeners = [] // 连接状态变更回调
    this.manualClose = false // 是否主动关闭
  }

  /**
   * 建立 WebSocket 连接
   */
  connect() {
    if (this.ws && (this.ws.readyState === WebSocket.OPEN || this.ws.readyState === WebSocket.CONNECTING)) {
      return
    }

    this.manualClose = false
    this.ws = new WebSocket(this.url)

    this.ws.onopen = () => {
      console.log('[IoT-WS] 连接成功')
      this.reconnectCount = 0
      this._startHeartbeat()
      this._notifyStatus(true)
    }

    this.ws.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data)
        // 心跳响应，忽略
        if (msg.type === 'pong') return
        this._dispatch(msg)
      } catch (e) {
        console.warn('[IoT-WS] 消息解析失败:', event.data)
      }
    }

    this.ws.onclose = () => {
      console.log('[IoT-WS] 连接关闭')
      this._stopHeartbeat()
      this._notifyStatus(false)
      if (!this.manualClose) {
        this._reconnect()
      }
    }

    this.ws.onerror = (err) => {
      console.error('[IoT-WS] 连接异常:', err)
      // onclose 会在 onerror 后触发，重连逻辑放在 onclose 中
    }
  }

  /**
   * 主动关闭连接
   */
  close() {
    this.manualClose = true
    this._stopHeartbeat()
    clearTimeout(this.reconnectTimer)
    this.reconnectTimer = null
    if (this.ws) {
      this.ws.close()
      this.ws = null
    }
    this._notifyStatus(false)
  }

  /**
   * 按消息类型注册回调监听器
   * @param {string} type - 消息类型: device_online | device_offline | property_change | alert
   * @param {Function} callback - 回调函数，接收 data 参数
   */
  on(type, callback) {
    if (!this.listeners[type]) {
      this.listeners[type] = []
    }
    if (typeof callback === 'function' && !this.listeners[type].includes(callback)) {
      this.listeners[type].push(callback)
    }
  }

  /**
   * 移除指定类型的回调监听器
   * @param {string} type
   * @param {Function} callback
   */
  off(type, callback) {
    if (!this.listeners[type]) return
    if (callback) {
      this.listeners[type] = this.listeners[type].filter(cb => cb !== callback)
    } else {
      delete this.listeners[type]
    }
  }

  /**
   * 注册连接状态变更回调
   * @param {Function} callback - 接收 boolean 参数 (connected)
   */
  onStatusChange(callback) {
    if (typeof callback === 'function' && !this.statusListeners.includes(callback)) {
      this.statusListeners.push(callback)
    }
  }

  /**
   * 移除连接状态变更回调
   * @param {Function} callback
   */
  offStatusChange(callback) {
    this.statusListeners = this.statusListeners.filter(cb => cb !== callback)
  }

  /**
   * 获取当前连接状态
   */
  get connected() {
    return this.ws && this.ws.readyState === WebSocket.OPEN
  }

  // ========== 内部方法 ==========

  /**
   * 分发消息到对应类型的监听器
   */
  _dispatch(msg) {
    const { type, data } = msg
    if (type && this.listeners[type]) {
      this.listeners[type].forEach(cb => {
        try {
          cb(data)
        } catch (e) {
          console.error(`[IoT-WS] 监听器执行异常 (${type}):`, e)
        }
      })
    }
  }

  /**
   * 通知连接状态变更
   */
  _notifyStatus(connected) {
    this.statusListeners.forEach(cb => {
      try {
        cb(connected)
      } catch (e) {
        console.error('[IoT-WS] 状态监听器异常:', e)
      }
    })
  }

  /**
   * 断线重连
   */
  _reconnect() {
    if (this.reconnectCount >= this.maxReconnectTimes) {
      console.warn('[IoT-WS] 已达最大重连次数，停止重连')
      return
    }
    this.reconnectCount++
    console.log(`[IoT-WS] ${this.reconnectInterval / 1000}s 后尝试第 ${this.reconnectCount} 次重连...`)
    this.reconnectTimer = setTimeout(() => {
      this.connect()
    }, this.reconnectInterval)
  }

  /**
   * 启动心跳检测
   */
  _startHeartbeat() {
    this._stopHeartbeat()
    this.heartbeatTimer = setInterval(() => {
      if (this.ws && this.ws.readyState === WebSocket.OPEN) {
        this.ws.send(JSON.stringify({ type: 'ping' }))
      }
    }, this.heartbeatInterval)
  }

  /**
   * 停止心跳检测
   */
  _stopHeartbeat() {
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer)
      this.heartbeatTimer = null
    }
  }
}

// 单例导出
const ws = new IoTWebSocket()
export default ws
