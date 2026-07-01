<template>
  <basic-container>
    <div class="nvr-dashboard">
      <el-row :gutter="20">
        <el-col :span="6">
          <div class="stat-card">
            <div class="stat-title">设备总数</div>
            <div class="stat-value">{{ statistics.totalDevices || 0 }}</div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="stat-card">
            <div class="stat-title">在线设备</div>
            <div class="stat-value" style="color: #67c23a;">{{ statistics.onlineDevices || 0 }}</div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="stat-card">
            <div class="stat-title">离线设备</div>
            <div class="stat-value" style="color: #f56c6c;">{{ statistics.offlineDevices || 0 }}</div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="stat-card">
            <div class="stat-title">通道总数</div>
            <div class="stat-value" style="color: #409eff;">{{ statistics.totalChannels || 0 }}</div>
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="20" style="margin-top: 20px;">
        <el-col :span="12">
          <el-card>
            <div slot="header">系统信息</div>
            <div class="info-item" v-for="(value, key) in systemInfo" :key="key">
              <span class="info-label">{{ key }}：</span>
              <span class="info-value">{{ value }}</span>
            </div>
          </el-card>
        </el-col>
        <el-col :span="12">
          <el-card>
            <div slot="header">设备类型分布</div>
            <div class="info-item" v-for="(count, type) in deviceTypeStats" :key="type">
              <span class="info-label">{{ getSdkTypeLabel(type) }}：</span>
              <span class="info-value">{{ count }} 台</span>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </basic-container>
</template>

<script>
import { getDeviceStatistics } from '@/api/qs/device'
import { getSystemInfo } from '@/api/qs/system'

export default {
  name: 'NvrDashboard',
  data() {
    return {
      statistics: {},
      systemInfo: {},
      deviceTypeStats: {}
    }
  },
  created() {
    this.loadStatistics()
    this.loadSystemInfo()
  },
  methods: {
    async loadStatistics() {
      try {
        const res = await getDeviceStatistics()
        this.statistics = res.data.data || {}
        this.deviceTypeStats = (res.data.data && res.data.data.typeStats) || {}
      } catch (e) {
        console.error('加载统计信息失败', e)
      }
    },
    async loadSystemInfo() {
      try {
        const res = await getSystemInfo()
        this.systemInfo = res.data.data || {}
      } catch (e) {
        console.error('加载系统信息失败', e)
      }
    },
    getSdkTypeLabel(type) {
      const map = { hik: '海康', hik_isup: '海康ISUP', dahua: '大华', uniview: '宇视', tiandy: '天地伟业', gb28181: '国标28181', other: '其他' }
      return map[type] || type
    }
  }
}
</script>

<style scoped>
.stat-card {
  background: #fff;
  border: 1px solid #e4e7ed;
  border-radius: 4px;
  padding: 20px;
  text-align: center;
}
.stat-title {
  font-size: 14px;
  color: #909399;
  margin-bottom: 8px;
}
.stat-value {
  font-size: 28px;
  font-weight: bold;
  color: #303133;
}
.info-item {
  padding: 8px 0;
  border-bottom: 1px solid #f0f0f0;
}
.info-label {
  color: #909399;
}
.info-value {
  color: #303133;
}
</style>
