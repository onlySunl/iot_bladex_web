<template>
  <basic-container>
    <div class="nvr-live-container">
      <div class="device-list">
        <div class="device-item" v-for="device in deviceList" :key="device.id" @click="selectDevice(device)" :class="{ active: currentDevice && currentDevice.id === device.id }">
          <div class="device-name">{{ device.deviceName }}</div>
          <div class="device-status">
            <el-tag :type="device.online === 1 ? 'success' : 'danger'" size="mini">{{ device.online === 1 ? '在线' : '离线' }}</el-tag>
          </div>
        </div>
      </div>
      <div class="video-area">
        <div v-if="!currentDevice" class="no-device">
          <p>请选择设备进行播放</p>
        </div>
        <div v-else class="video-content">
          <div class="video-header">
            <span>{{ currentDevice.deviceName }}</span>
            <el-button size="mini" type="danger" icon="el-icon-close" @click="stopPlay">停止</el-button>
          </div>
          <div class="video-player" ref="videoContainer">
            <p class="video-placeholder">视频播放区域 - {{ currentDevice.deviceName }}</p>
          </div>
        </div>
      </div>
    </div>
  </basic-container>
</template>

<script>
import { getAllDevices } from '@/api/qs/device'

export default {
  name: 'NvrLive',
  data() {
    return {
      deviceList: [],
      currentDevice: null
    }
  },
  created() {
    this.loadDevices()
  },
  methods: {
    async loadDevices() {
      const res = await getAllDevices()
      this.deviceList = res.data.data || []
    },
    selectDevice(device) {
      this.currentDevice = device
    },
    stopPlay() {
      this.currentDevice = null
    }
  }
}
</script>

<style scoped>
.nvr-live-container {
  display: flex;
  height: calc(100vh - 150px);
}
.device-list {
  width: 250px;
  border-right: 1px solid #e4e7ed;
  overflow-y: auto;
}
.device-item {
  padding: 12px;
  border-bottom: 1px solid #f0f0f0;
  cursor: pointer;
}
.device-item:hover,
.device-item.active {
  background: #ecf5ff;
}
.device-name {
  font-size: 14px;
  margin-bottom: 4px;
}
.video-area {
  flex: 1;
  display: flex;
  flex-direction: column;
}
.no-device {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #909399;
}
.video-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 16px;
  background: #f5f7fa;
  border-bottom: 1px solid #e4e7ed;
}
.video-player {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #000;
}
.video-placeholder {
  color: #fff;
}
</style>
