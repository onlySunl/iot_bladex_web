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

export default {
  name: 'RecordPlayback',
  components: {
    CloudRecordPlayback,
    DeviceRecordPlayback,
  },
  data() {
    return {
      playbackType: 'device',
      deviceId: null,
    }
  },
  created() {
    if (this.$route.query.deviceId) {
      this.deviceId = Number(this.$route.query.deviceId)
    }
    if (this.$route.query.type === 'cloud') {
      this.playbackType = 'cloud'
    } else if (this.$route.query.type === 'device') {
      this.playbackType = 'device'
    }
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
