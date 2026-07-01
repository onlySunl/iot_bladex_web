<template>
  <basic-container>
    <div class="nvr-map-container">
      <div class="map-header">
        <el-button type="primary" size="small" icon="el-icon-refresh" @click="refreshMap">刷新地图</el-button>
      </div>
      <div class="map-content" ref="mapContainer">
        <div class="map-placeholder">
          <i class="el-icon-map-location" style="font-size: 48px; color: #909399;"></i>
          <p>地图组件区域 - 需集成地图SDK</p>
          <p class="map-tip">设备总数：{{ deviceCount }} 台</p>
        </div>
      </div>
    </div>
  </basic-container>
</template>

<script>
import { getAllDevices } from '@/api/qs/device'

export default {
  name: 'NvrMap',
  data() {
    return {
      deviceCount: 0,
      devices: []
    }
  },
  created() {
    this.loadDevices()
  },
  methods: {
    async loadDevices() {
      try {
        const res = await getAllDevices()
        this.devices = res.data.data || []
        this.deviceCount = this.devices.length
      } catch (e) {
        console.error('加载设备列表失败', e)
      }
    },
    refreshMap() {
      this.loadDevices()
    }
  }
}
</script>

<style scoped>
.nvr-map-container {
  height: calc(100vh - 150px);
  display: flex;
  flex-direction: column;
}
.map-header {
  margin-bottom: 12px;
}
.map-content {
  flex: 1;
  border: 1px solid #e4e7ed;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f5f7fa;
}
.map-placeholder {
  text-align: center;
  color: #909399;
}
.map-tip {
  margin-top: 8px;
  font-size: 14px;
}
</style>
