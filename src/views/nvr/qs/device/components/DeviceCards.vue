<template>
  <div class="device-cards">
    <el-row :gutter="16">
      <el-col
        v-for="device in deviceList"
        :key="device.id"
        :xs="24"
        :sm="12"
        :md="8"
        :lg="6"
      >
        <el-card class="device-card" shadow="hover">
          <div class="card-header">
            <div class="device-name">{{ device.deviceName }}</div>
            <el-tag :type="getOnlineStatusType(device.online)" size="mini">
              {{ getOnlineStatusLabel(device.online) }}
            </el-tag>
          </div>
          <div class="card-body">
            <div class="info-row">
              <span class="label">设备ID:</span>
              <span class="value">{{ device.deviceId }}</span>
            </div>
            <div class="info-row">
              <span class="label">协议:</span>
              <span class="value">{{ getProtocolLabel(device.protocol) }}</span>
            </div>
            <div class="info-row">
              <span class="label">厂商:</span>
              <span class="value">{{ getVendorLabel(device.vendor) }}</span>
            </div>
            <div class="info-row">
              <span class="label">IP地址:</span>
              <span class="value">{{ device.ip }}:{{ device.port }}</span>
            </div>
            <div class="info-row">
              <span class="label">推流状态:</span>
              <el-tag :type="device.streamPush ? 'success' : 'info'" size="mini">
                {{ device.streamPush ? '推流中' : '未推流' }}
              </el-tag>
            </div>
          </div>
          <div class="card-footer">
            <el-button size="mini" type="primary" @click="$emit('view', device)">
              <i class="el-icon-view"></i> 查看
            </el-button>
            <el-button size="mini" type="primary" @click="$emit('edit', device)">
              <i class="el-icon-edit"></i> 编辑
            </el-button>
            <el-button size="mini" type="danger" @click="$emit('delete', device)">
              <i class="el-icon-delete"></i> 删除
            </el-button>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-pagination
      class="pagination"
      :current-page="pagination.currentPage"
      :page-size="pagination.pageSize"
      :page-sizes="[12, 24, 48]"
      :total="pagination.total"
      layout="total, sizes, prev, pager, next"
      @size-change="$emit('size-change', $event)"
      @current-change="$emit('page-change', $event)"
    />
  </div>
</template>

<script>
export default {
  name: 'DeviceCards',
  props: {
    deviceList: {
      type: Array,
      default: () => []
    },
    pagination: {
      type: Object,
      default: () => ({
        currentPage: 1,
        pageSize: 12,
        total: 0
      })
    },
    protocolDict: {
      type: Array,
      default: () => []
    },
    vendorDict: {
      type: Array,
      default: () => []
    },
    onlineStatusMap: {
      type: Object,
      default: () => ({})
    }
  },
  emits: ['page-change', 'size-change', 'view', 'edit', 'delete'],
  methods: {
    getProtocolLabel(value) {
      const item = this.protocolDict.find(d => d.value === value);
      return item ? item.label : value;
    },
    getVendorLabel(value) {
      const item = this.vendorDict.find(d => d.value === value);
      return item ? item.label : value;
    },
    getOnlineStatusLabel(value) {
      const status = this.onlineStatusMap[value];
      return status ? status.label : '未知';
    },
    getOnlineStatusType(value) {
      const status = this.onlineStatusMap[value];
      return status ? status.type : 'info';
    }
  }
};
</script>

<style scoped>
.device-cards {
  padding: 16px;
}
.device-card {
  margin-bottom: 16px;
}
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}
.device-name {
  font-size: 16px;
  font-weight: bold;
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
  margin-bottom: 8px;
  font-size: 14px;
}
.info-row .label {
  color: #909399;
}
.info-row .value {
  color: #303133;
}
.card-footer {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}
.pagination {
  margin-top: 16px;
  text-align: right;
}
</style>
