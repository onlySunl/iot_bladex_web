/**
 * NVR设备枚举常量
 */
// 设备在线状态
export const DEVICE_STATUS = {
    ONLINE: { label: '在线', value: 1, tagType: 'success' },
    OFFLINE: { label: '离线', value: 0, tagType: 'danger' }
}

// 批量操作类型
export const BATCH_OP_TYPE = {
    DELETE: 'delete',
    SYNC_CHANNEL: 'syncChannel'
}

// 分页默认配置
export const DEFAULT_PAGE = {
    pageNum: 1,
    pageSize: 10
}