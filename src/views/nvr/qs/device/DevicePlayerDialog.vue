<template>
  <el-dialog v-model="visible" :title="dialogTitle" width="900px" append-to-body @close="handleClose">
    <div class="player-container">
      <!-- 播放器 -->
      <div class="player-wrapper">
        <EasyPlayer
          v-if="videoUrl"
          :videoUrl="videoUrl"
          fluent
          autoplay
          stretch
          :muted="muted"
          ref="playerRef"
        />
        <div v-else class="no-video">
          <el-empty description="暂无视频流" />
        </div>
      </div>

      <!-- 控制栏 -->
      <div class="player-controls">
        <div class="control-left">
          <el-button :icon="muted ? 'MuteNotification' : 'Bell'" circle @click="toggleMute" />
          <el-button icon="FullScreen" circle @click="toggleFullscreen" />
        </div>
        <div class="control-center">
          <el-select v-model="selectedChannel" placeholder="选择通道" @change="handleChannelChange" style="width: 200px">
            <el-option
              v-for="channel in channelList"
              :key="channel.channelId"
              :label="channel.channelName || channel.channelId"
              :value="channel.channelId"
            />
          </el-select>
          <el-select v-model="streamType" placeholder="码流类型" @change="handleStreamTypeChange" style="width: 120px; margin-left: 10px">
            <el-option label="主码流" value="main" />
            <el-option label="子码流" value="sub" />
          </el-select>
        </div>
        <div class="control-right">
          <el-button type="primary" icon="VideoPlay" @click="handlePlay">播放</el-button>
          <el-button type="danger" icon="VideoPause" @click="handleStop">停止</el-button>
        </div>
      </div>

      <!-- PTZ 控制 -->
      <div class="ptz-control" v-if="showPtz">
        <el-divider content-position="left">云台控制</el-divider>
        <DevicePtzControl :deviceId="device?.id || ''" />
      </div>
    </div>
  </el-dialog>
</template>

<script setup lang="ts" name="DevicePlayerDialog">
import { ref, computed } from 'vue';
import EasyPlayer from '@/components/nvr/EasyPlayer/index.vue';
import DevicePtzControl from './DevicePtzControl.vue';

interface QsDevice {
  id: number;
  deviceName: string;
  [key: string]: any;
}

interface Channel {
  channelId: string;
  channelName?: string;
  [key: string]: any;
}

const props = defineProps<{
  modelValue: boolean;
  device?: QsDevice;
  channelList: Channel[];
  showPtz?: boolean;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
  (e: 'play', deviceId: number, channelId: string, streamType: string): void;
  (e: 'stop', deviceId: number, channelId: string): void;
  (e: 'channel-change', channelId: string): void;
  (e: 'stream-type-change', streamType: string): void;
}>();

const playerRef = ref();
const videoUrl = ref('');
const muted = ref(true);
const selectedChannel = ref('');
const streamType = ref('main');

const visible = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
});

const dialogTitle = computed(() => {
  return props.device ? `${props.device.deviceName} - 视频播放` : '视频播放';
});

const toggleMute = () => {
  muted.value = !muted.value;
};

const toggleFullscreen = () => {
  const playerEl = playerRef.value?.$el;
  if (playerEl) {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      playerEl.requestFullscreen();
    }
  }
};

const handleChannelChange = (channelId: string) => {
  emit('channel-change', channelId);
};

const handleStreamTypeChange = (streamType: string) => {
  emit('stream-type-change', streamType);
};

const handlePlay = () => {
  if (props.device && selectedChannel.value) {
    emit('play', props.device.id, selectedChannel.value, streamType.value);
  }
};

const handleStop = () => {
  if (props.device && selectedChannel.value) {
    emit('stop', props.device.id, selectedChannel.value);
    videoUrl.value = '';
  }
};

const handleClose = () => {
  videoUrl.value = '';
  selectedChannel.value = '';
  visible.value = false;
};

// 设置视频 URL
const setVideoUrl = (url: string) => {
  videoUrl.value = url;
};

// 暴露方法
defineExpose({
  setVideoUrl,
  playerRef
});
</script>

<style scoped lang="scss">
.player-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.player-wrapper {
  width: 100%;
  aspect-ratio: 16 / 9;
  background: #000;
  border-radius: 8px;
  overflow: hidden;

  .no-video {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}

.player-controls {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px;
  background: #f5f7fa;
  border-radius: 8px;

  .control-left,
  .control-right {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .control-center {
    display: flex;
    align-items: center;
  }
}

.ptz-control {
  margin-top: 8px;
}
</style>
