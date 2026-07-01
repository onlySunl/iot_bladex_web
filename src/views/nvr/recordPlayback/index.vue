<template>

  <div class="record-playback-container">
    <!-- 切换按钮 -->
    <div class="switch-bar">
      <div class="switch-wrapper">
        <div
          class="switch-indicator"
          :class="playbackType === 'device' ? 'is-left' : 'is-right'"
        />
        <div
          class="switch-item"
          :class="{ active: playbackType === 'device' }"
          @click="handleTypeChange('device')"
        >
          <i class="el-icon-monitor"></i>
          <span>设备录像</span>
        </div>
        <div
          class="switch-item"
          :class="{ active: playbackType === 'cloud' }"
          @click="handleTypeChange('cloud')"
        >
          <i class="el-icon-video-camera"></i>
          <span>云端录像</span>
        </div>
      </div>
    </div>

    <!-- 组件切换 -->
    <transition name="fade-transform" mode="out-in">
      <CloudRecordPlayback v-if="playbackType === 'cloud'" ref="cloudPlaybackRef" />
      <DeviceRecordPlayback v-else ref="devicePlaybackRef" />
    </transition>
  </div>

</template>

<script>
import CloudRecordPlayback from './CloudRecordPlayback.vue'
import DeviceRecordPlayback from './DeviceRecordPlayback.vue'

export default {
  name: 'RecordPlayback',
  components: {
    CloudRecordPlayback,
    DeviceRecordPlayback,
  },
  data() {
    return {
      playbackType: 'device',
    }
  },
  methods: {
    handleTypeChange(type) {
      this.playbackType = type
    },
  },
}
</script>

<style lang="scss" scoped>
.record-playback-container {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: #fff;
}

.switch-bar {
  padding: 4px 20px;
  background: #f5f7fa;
  border-bottom: 1px solid #ebeef5;
  display: flex;
  justify-content: center;
  flex-shrink: 0;
}

.switch-wrapper {
  position: relative;
  display: inline-flex;
  align-items: center;
  background: #ebeef5;
  border-radius: 10px;
  padding: 4px;
  gap: 4px;
}

.switch-indicator {
  position: absolute;
  top: 4px;
  bottom: 4px;
  width: calc(50% - 4px);
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08), 0 0 1px rgba(0, 0, 0, 0.04);
  transition: transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
  z-index: 0;

  &.is-left {
    transform: translateX(0);
  }

  &.is-right {
    transform: translateX(calc(100% + 4px));
  }
}

.switch-item {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 24px;
  font-weight: 500;
  font-size: 14px;
  color: #909399;
  cursor: pointer;
  border-radius: 8px;
  transition: color 0.3s ease;
  user-select: none;

  &:hover {
    color: #303133;
  }

  &.active {
    color: #409EFF;
  }
}

/* 切换动画 */
.fade-transform-enter-active,
.fade-transform-leave-active {
  transition: all 0.25s ease;
}

.fade-transform-enter-from {
  opacity: 0;
  transform: translateX(20px);
}

.fade-transform-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}
</style>
