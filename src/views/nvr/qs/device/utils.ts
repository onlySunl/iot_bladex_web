/**
 * 设备管理工具函数
 */

/**
 * 格式化容量显示
 * @param capacity 容量值（字节）
 * @returns 格式化后的字符串
 */
export const formatCapacity = (capacity: any): string => {
  if (!capacity && capacity !== 0) return '-';
  const num = Number(capacity);
  if (isNaN(num)) return String(capacity);

  if (num >= 1024 * 1024 * 1024) {
    return (num / (1024 * 1024 * 1024)).toFixed(2) + ' GB';
  } else if (num >= 1024 * 1024) {
    return (num / (1024 * 1024)).toFixed(2) + ' MB';
  } else if (num >= 1024) {
    return (num / 1024).toFixed(2) + ' KB';
  } else {
    return num + ' B';
  }
};

/**
 * 计算存储使用百分比
 * @param used 已使用容量
 * @param total 总容量
 * @returns 百分比（0-100）
 */
export const calculateStoragePercentage = (used: any, total: any): number => {
  const usedNum = Number(used);
  const totalNum = Number(total);
  if (!totalNum || isNaN(usedNum) || isNaN(totalNum)) return 0;
  return Math.min(100, Math.round((usedNum / totalNum) * 100));
};

/**
 * 根据存储使用比例获取颜色
 * @param used 已使用容量
 * @param total 总容量
 * @returns 颜色值
 */
export const getStorageColor = (used: any, total: any): string => {
  const percentage = calculateStoragePercentage(used, total);
  if (percentage >= 90) return '#f56c6c'; // 红色
  if (percentage >= 70) return '#e6a23c'; // 橙色
  return '#67c23a'; // 绿色
};

/**
 * 将 ws:// 或 wss:// 转换为 http:// 或 https://
 * @param wsUrl WebSocket URL
 * @returns HTTP URL
 */
export const convertWsToHttp = (wsUrl: string): string => {
  if (!wsUrl) return '';
  return wsUrl.replace(/^ws:\/\//, 'http://').replace(/^wss:\/\//, 'https://');
};

/**
 * 获取配置类型名称
 * @param key 配置类型键
 * @returns 配置类型名称
 */
export const getConfigTypeName = (key: string): string => {
  const configTypes: Record<string, string> = {
    'basic': '基础配置',
    'stream': '流媒体配置',
    'record': '录像配置',
    'alarm': '告警配置',
    'ptz': '云台配置',
    'network': '网络配置',
    'storage': '存储配置',
    'jt1078': 'JT1078配置'
  };
  return configTypes[key] || key;
};

/**
 * 获取配置字段名称
 * @param configType 配置类型
 * @param fieldKey 字段键
 * @returns 字段名称
 */
export const getConfigFieldName = (configType: string, fieldKey: string): string => {
  const fieldNames: Record<string, Record<string, string>> = {
    'basic': {
      'deviceName': '设备名称',
      'deviceCode': '设备编码',
      'ipAddress': 'IP地址',
      'port': '端口'
    },
    'stream': {
      'streamMode': '流模式',
      'codec': '编码格式',
      'resolution': '分辨率'
    },
    'record': {
      'recordMode': '录像模式',
      'preRecordTime': '预录时间',
      'postRecordTime': '延录时间'
    },
    'alarm': {
      'alarmEnable': '告警开关',
      'alarmLevel': '告警级别'
    },
    'ptz': {
      'ptzType': '云台类型',
      'ptzProtocol': '云台协议'
    },
    'network': {
      'subnetMask': '子网掩码',
      'gateway': '网关',
      'dns': 'DNS'
    },
    'storage': {
      'storagePath': '存储路径',
      'storageQuota': '存储配额'
    },
    'jt1078': {
      'mobileNo': '手机号',
      'plateNo': '车牌号',
      'plateColor': '车牌颜色'
    }
  };
  return fieldNames[configType]?.[fieldKey] || fieldKey;
};

/**
 * 格式化时间戳
 * @param timestamp 时间戳（毫秒）
 * @returns 格式化后的时间字符串
 */
export const formatTimestamp = (timestamp: number | string): string => {
  if (!timestamp) return '-';
  const date = new Date(typeof timestamp === 'string' ? parseInt(timestamp) : timestamp);
  if (isNaN(date.getTime())) return String(timestamp);
  
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

/**
 * 格式化时长
 * @param seconds 秒数
 * @returns 格式化后的时长字符串
 */
export const formatDuration = (seconds: number): string => {
  if (!seconds || seconds < 0) return '00:00:00';
  
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
};

/**
 * 判断设备是否在线
 * @param status 设备状态
 * @returns 是否在线
 */
export const isDeviceOnline = (status: number | string): boolean => {
  return Number(status) === 1;
};

/**
 * 获取设备状态标签
 * @param status 设备状态
 * @returns 状态标签
 */
export const getDeviceStatusLabel = (status: number | string): string => {
  const statusMap: Record<number, string> = {
    0: '离线',
    1: '在线',
    2: '故障'
  };
  return statusMap[Number(status)] || '未知';
};

/**
 * 获取设备状态类型（用于 Element Plus 标签颜色）
 * @param status 设备状态
 * @returns 状态类型
 */
export const getDeviceStatusType = (status: number | string): string => {
  const typeMap: Record<number, string> = {
    0: 'danger',
    1: 'success',
    2: 'warning'
  };
  return typeMap[Number(status)] || 'info';
};

/**
 * 深度克隆对象
 * @param obj 要克隆的对象
 * @returns 克隆后的对象
 */
export const deepClone = <T>(obj: T): T => {
  if (obj === null || typeof obj !== 'object') return obj;
  if (obj instanceof Date) return new Date(obj.getTime()) as any;
  if (obj instanceof Array) return obj.map(item => deepClone(item)) as any;
  if (obj instanceof Object) {
    const copy: Record<string, any> = {};
    Object.keys(obj).forEach(key => {
      copy[key] = deepClone((obj as Record<string, any>)[key]);
    });
    return copy as T;
  }
  return obj;
};

/**
 * 防抖函数
 * @param fn 要执行的函数
 * @param delay 延迟时间（毫秒）
 * @returns 防抖后的函数
 */
export const debounce = <T extends (...args: any[]) => any>(fn: T, delay: number = 300) => {
  let timer: ReturnType<typeof setTimeout> | null = null;
  return function(this: any, ...args: Parameters<T>) {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      fn.apply(this, args);
    }, delay);
  };
};

/**
 * 节流函数
 * @param fn 要执行的函数
 * @param interval 间隔时间（毫秒）
 * @returns 节流后的函数
 */
export const throttle = <T extends (...args: any[]) => any>(fn: T, interval: number = 300) => {
  let lastTime = 0;
  return function(this: any, ...args: Parameters<T>) {
    const now = Date.now();
    if (now - lastTime >= interval) {
      lastTime = now;
      fn.apply(this, args);
    }
  };
};
