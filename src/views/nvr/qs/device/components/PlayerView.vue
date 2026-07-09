<template>
  <div class="player-view">
    <div class="player-wrap">
      <EasyPlayer
          ref="EasyPlayerRef"
          class="easy-player-box"
          width="100"
          height="100"
          :isPercentage="true"
          :quality="quality"
          :defaultQuality="defaultQuality"
          :isPtz="isPtz"
          :isQuality="isQuality"
          :isLive="isLive"
          :videoUrl="wsUrl"
          @ptz="handlePtz"
      />
    </div>
  </div>
</template>

<script setup>
/**
 * PlayerView - 视频播放器组件
 * 负责视频流的播放控制
 */
import { ref, nextTick, watch } from 'vue'
import EasyPlayer from '@/components/EasyPlayer'

// Props
const props = defineProps({
  wsUrl: { type: String, default: '' },
  isPtz: { type: Boolean, default: false },
  isQuality: { type: Boolean, default: true },
  isLive: { type: Boolean, default: true },
  quality: { type: Array, default: () => [] },
  defaultQuality: { type: String, default: '高清' }
})

// Emits
const emit = defineEmits(['ptz'])

// Refs
const EasyPlayerRef = ref(null)

// 播放
const play = async (url) => {
  if (!url || !EasyPlayerRef.value) return
  await nextTick()
  EasyPlayerRef.value.play(url)
}

// 停止
const stop = () => {
  if (!EasyPlayerRef.value) return
  if (typeof EasyPlayerRef.value.stop === 'function') EasyPlayerRef.value.stop()
}

// 销毁
const destroy = async () => {
  await nextTick()
  if (!EasyPlayerRef.value) return
  if (typeof EasyPlayerRef.value.stop === 'function') EasyPlayerRef.value.stop()
  if (typeof EasyPlayerRef.value.destroy === 'function') EasyPlayerRef.value.destroy()
  EasyPlayerRef.value = null
}

// 云台事件
const handlePtz = (info) => {
  emit('ptz', info)
}

// 暴露方法给父组件
defineExpose({
  play,
  stop,
  destroy
})
</script>

<style scoped lang="scss">
.player-view {
  width: 100%;
  display: flex;
  justify-content: center;

  .player-wrap {
    width: 100%;
    display: flex;
    justify-content: center;
  }

  .easy-player-box {
    width: 800px;
    height: 400px;
  }
}
</style>
