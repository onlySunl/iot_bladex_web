<template>
  <div class="cards-wrapper">
    <el-row :gutter="16">
      <el-col
        v-for="device in deviceList"
        :key="device.id"
        :xs="24"
        :sm="12"
        :md="8"
        :lg="6"
        :xl="4"
      >
        <div
          class="device-card"
          :class="{ 'is-selected': isSelected(device), 'is-offline': !isOnline(device) }"
          @click="handleCardClick(device)"
        >
          <!-- 卡片头部 -->
          <div class="card-header">
            <div class="device-info">
              <el-checkbox
                :model-value="isSelected(device)"
                @click.stop="handleCardSelect(device)"
                class="device-checkbox"
              />
              <div class="device-name" :title="device.deviceName">
                {{ device.deviceName || '未命名设备' }}
              </div>
            </div>
            <div class="device-status">
              <el-tag :type="getStatusType(device.status)" size="small" effect="dark">
                {{ getStatusLabel(device.status) }}
              </el-tag>
            </div>
          </div>

          <!-- 卡片内容 -->
          <div class="card-body">
            <div class="info-row">
              <span class="label">接入类型:</span>
              <span class="value">
                <dict-tag :options="liveStreamTypeDict" :value="device.type" />
              </span>
            </div>
            <div class="info-row">
              <span class="label">IP地址:</span>
              <span class="value">{{ device.ipAddress || '-' }}</span>
            </div>
            <div class="info-row">
              <span class="label">端口:</span>
              <span class="value">{{ device.port || '-' }}</span>
            </div>
            <div class="info-row" v-if="device.deviceStatus">
              <span class="label">设备状态:</span>
              <span class="value">
                <dict-tag :options="deviceStatusDict" :value="device.deviceStatus" />
              </span>
            </div>
          </div>

          <!-- 卡片操作 -->
          <div class="card-actions">
            <el-button link type="primary" icon="VideoPlay" @click.stop="handlePlay(device)">播放</el-button>
            <el-button link type="primary" icon="Edit" @click.stop="handleEdit(device)">编辑</el-button>
            <el-button link type="danger" icon="Delete" @click.stop="handleDelete(device)">删除</el-button>
          </div>
        </div>
      </el-col>
    </el-row>

    <!-- 空状态 -->
    <el-empty v-if="deviceList.length === 0" description="暂无设备数据" />

    <!-- 分页 -->
    <pagination
      v-show="total > 0"
      :total="total"
      v-model:page="queryParams.pageNum"
      v-model:limit="queryParams.pageSize"
      @pagination="handlePageChange"
    />
  </div>
</template>

<script setup lang="ts" name="DeviceCards">
import { computed } from 'vue';

interface QsDevice {
  id: number;
  deviceName: string;
  type: string;
  ipAddress: string;
  port: string;
  status: string;
  deviceStatus: string;
  [key: string]: any;
}

interface QueryParams {
  pageNum: number;
  pageSize: number;
  [key: string]: any;
}

interface DictItem {
  label: string;
  value: string;
}

const props = defineProps<{
  deviceList: QsDevice[];
  total: number;
  queryParams: QueryParams;
  selectedIds: number[];
  liveStreamTypeDict: DictItem[];
  deviceStatusDict: DictItem[];
}>();

const emit = defineEmits<{
  (e: 'select', device: QsDevice): void;
  (e: 'play', device: QsDevice): void;
  (e: 'edit', device: QsDevice): void;
  (e: 'delete', device: QsDevice): void;
  (e: 'page-change'): void;
  (e: 'update:queryParams', value: QueryParams): void;
}>();

const isSelected = (device: QsDevice): boolean => {
  return props.selectedIds.includes(device.id);
};

const isOnline = (device: QsDevice): boolean => {
  return Number(device.status) === 1;
};

const getStatusType = (status: string): string => {
  const typeMap: Record<number, string> = {
    0: 'danger',
    1: 'success',
    2: 'warning'
  };
  return typeMap[Number(status)] || 'info';
};

const getStatusLabel = (status: string): string => {
  const statusMap: Record<number, string> = {
    0: '离线',
    1: '在线',
    2: '故障'
  };
  return statusMap[Number(status)] || '未知';
};

const handleCardClick = (device: QsDevice) => {
  emit('select', device);
};

const handleCardSelect = (device: QsDevice) => {
  emit('select', device);
};

const handlePlay = (device: QsDevice) => {
  emit('play', device);
};

const handleEdit = (device: QsDevice) => {
  emit('edit', device);
};

const handleDelete = (device: QsDevice) => {
  emit('delete', device);
};

const handlePageChange = () => {
  emit('page-change');
};
</script>

<style scoped lang="scss">
.cards-wrapper {
  margin-top: 16px;
}

.device-card {
  background: #fff;
  border: 1px solid #ebeef5;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 16px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    transform: translateY(-2px);
  }

  &.is-selected {
    border-color: #409eff;
    background: #ecf5ff;
  }

  &.is-offline {
    opacity: 0.7;
  }
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  padding-bottom: 12px;
  border-bottom: 1px solid #ebeef5;
}

.device-info {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
  min-width: 0;
}

.device-checkbox {
  flex-shrink: 0;
}

.device-name {
  font-size: 14px;
  font-weight: 500;
  color: #303133;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.card-body {
  margin-bottom: 12px;
}

.info-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 4px 0;
  font-size: 13px;

  .label {
    color: #909399;
    flex-shrink: 0;
  }

  .value {
    color: #606266;
    text-align: right;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    max-width: 60%;
  }
}

.card-actions {
  display: flex;
  justify-content: space-around;
  padding-top: 12px;
  border-top: 1px solid #ebeef5;
}
</style>
