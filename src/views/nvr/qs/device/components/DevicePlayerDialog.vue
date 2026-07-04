<template>
  <el-dialog
    title="视频播放"
    :visible.sync="dialogVisible"
    width="800px"
    @close="handleClose"
  >
    <div class="player-container">
      <div class="video-player">
        <video
          ref="videoRef"
          class="video-element"
          controls
          autoplay
        />
      </div>
      <div class="channel-list">
        <div class="channel-title">通道列表</div>
        <el-scrollbar height="300px">
          <div
            v-for="channel in channels"
            :key="channel.id"
            class="channel-item"
            :class="{ active: currentChannel === channel.id }"
            @click="selectChannel(channel)"
          >
            <span class="channel-name">{{ channel.name }}</span>
            <el-tag v-if="channel.online" size="mini" type="success">在线</el-tag>
            <el-tag v-else size="mini" type="info">离线</el-tag>
          </div>
        </el-scrollbar>
      </div>
    </div>
    <div slot="footer">
      <el-button @click="dialogVisible = false">关闭</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: 'DevicePlayerDialog',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    device: {
      type: Object,
      default: null
    },
    channels: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      currentChannel: ''
    };
  },
  computed: {
    dialogVisible: {
      get() {
        return this.visible;
      },
      set(val) {
        this.$emit('update:visible', val);
      }
    }
  },
  watch: {
    visible(val) {
      if (val && this.channels.length > 0) {
        this.selectChannel(this.channels[0]);
      }
    }
  },
  methods: {
    selectChannel(channel) {
      this.currentChannel = channel.id;
      this.$emit('channel-change', channel);
    },
    handleClose() {
      this.currentChannel = '';
      this.$emit('close');
    }
  }
};
</script>

<style scoped>
.player-container {
  display: flex;
  gap: 16px;
}
.video-player {
  flex: 1;
}
.video-element {
  width: 100%;
  height: 400px;
  background: #000;
}
.channel-list {
  width: 200px;
  border: 1px solid #ebeef5;
  border-radius: 4px;
}
.channel-title {
  padding: 12px;
  font-weight: bold;
  border-bottom: 1px solid #ebeef5;
}
.channel-item {
  padding: 12px;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #f0f0f0;
}
.channel-item:hover {
  background: #f5f7fa;
}
.channel-item.active {
  background: #ecf5ff;
  color: #409eff;
}
</style>
