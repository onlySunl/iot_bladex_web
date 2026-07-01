
/** 视频监控设备配置分页查询参数 */

/** 视频监控设备配置信息 */

/**
 * 录制计划-添加/编辑参数
 */
export interface RecordPlanParam {
  /**
   * 关联的设备ID列表
   * 注意：会为设备下的所有通道关联此录制计划
   * 如果 channelId 存在，则此项不生效
   */
  deviceIds?: number[];

  /**
   * 全部关联 / 全部取消关联
   */
  allLink?: boolean;

  /**
   * 录制计划ID
   * 如果 ID 为空，则表示删除关联的计划
   */
  planId?: number;
}