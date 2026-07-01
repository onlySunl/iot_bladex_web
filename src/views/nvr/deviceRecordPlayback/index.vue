<template>
  <div class="record-playback-container">
    <!-- 组件切换 -->
    <CloudRecordPlayback v-if="playbackType === 'cloud'" ref="cloudPlaybackRef" :deviceId="deviceId" />
    <DeviceRecordPlayback v-else ref="devicePlaybackRef" :deviceId="deviceId" />
  </div>
</template>

<script>
import CloudRecordPlayback from './CloudRecordPlayback.vue'
import DeviceRecordPlayback from './DeviceRecordPlayback.vue'


const deviceId = ref<number | null>(null)
const playbackType = ref<'cloud' | 'device'>('device')
const cloudPlaybackRef = ref()
const devicePlaybackRef = ref()

// 直接初始化，不要等 onMounted
if (this.$route.query.deviceId) {
  deviceId = Number(this.$route.query.deviceId)
}
if (this.$route.query.type === 'cloud') {
  playbackType = 'cloud'
} else if (this.$route.query.type === 'device') {
  playbackType = 'device'
}
</script>

<style lang="scss" scoped>
.record-playback-container {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: var(--el-bg-color);
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
