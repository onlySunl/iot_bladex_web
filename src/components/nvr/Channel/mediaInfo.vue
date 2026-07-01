<template>
  <div class="media-info">
    <div class="header">
      <div class="header-left">
        <i class="el-icon-data-line header-icon"></i>
        <span class="title">媒体信息</span>
      </div>
      <el-button
        icon="el-icon-refresh-right"
        circle
        size="mini"
        @click="getMediaInfoFun"
        :loading="refreshing"
      />
    </div>
    <div class="stats-row" v-if="info.videoCodec || info.audioCodec">
      <div class="stat-item">
        <i class="el-icon-user stat-icon"></i>
        <span class="stat-label">观看</span>
        <span class="stat-value">{{ info.readerCount || 0 }}</span>
      </div>
      <el-divider direction="vertical" />
      <div class="stat-item">
        <i class="el-icon-position stat-icon"></i>
        <span class="stat-label">速度</span>
        <span class="stat-value">{{ formatByteSpeed() }}</span>
      </div>
      <el-divider direction="vertical" />
      <div class="stat-item">
        <i class="el-icon-time stat-icon"></i>
        <span class="stat-label">时长</span>
        <span class="stat-value">{{ formatAliveSecond() }}</span>
      </div>
    </div>
    <div class="detail-section" v-if="info.videoCodec || info.audioCodec">
      <div class="detail-block" v-if="info.videoCodec">
        <div class="block-label">
          <i class="el-icon-video-camera label-icon"></i>
          <span>视频</span>
          <el-tag size="mini" type="success">{{ info.videoCodec }}</el-tag>
        </div>
        <div class="block-content">
          <span class="tag">{{ info.width }}x{{ info.height }}</span>
          <span class="tag">{{ info.fps }} FPS</span>
          <span class="tag">丢包 {{ info.loss || '0%' }}</span>
        </div>
      </div>
      <div class="detail-block" v-if="info.audioCodec">
        <div class="block-label">
          <i class="el-icon-service label-icon"></i>
          <span>音频</span>
          <el-tag size="mini" type="primary">{{ info.audioCodec }}</el-tag>
        </div>
        <div class="block-content">
          <span class="tag">{{ info.audioSampleRate }} Hz</span>
        </div>
      </div>
    </div>
    <div class="empty-state" v-else>
      <span>暂无媒体信息</span>
    </div>
  </div>
</template>

<script>
import { getMediaInfo } from '@/api/nvr/zlm'

export default {
  name: 'MediaInfo',
  props: {
    mediaServerId: { type: String, default: '' },
    app: { type: String, default: '' },
    stream: { type: String, default: '' }
  },
  data: function () {
    return {
      info: {},
      refreshing: false,
      timer: null
    }
  },
  mounted: function () {
    this.getMediaInfoFun()
    this.timer = setInterval(this.getMediaInfoFun, 5000)
  },
  beforeDestroy: function () {
    if (this.timer) {
      clearInterval(this.timer)
    }
  },
  methods: {
    getMediaInfoFun: function () {
      if (!this.mediaServerId || !this.app || !this.stream) return
      this.refreshing = true
      getMediaInfo(this.mediaServerId, this.app, this.stream).then(function (res) {
        this.info = res.data || {}
        this.refreshing = false
      }.bind(this)).catch(function () {
        this.refreshing = false
      }.bind(this))
    },
    formatByteSpeed: function () {
      var bytes = this.info.bytesSpeed || 0
      if (bytes < 1024) return bytes + ' B/s'
      if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB/s'
      return (bytes / 1024 / 1024).toFixed(1) + ' MB/s'
    },
    formatAliveSecond: function () {
      var seconds = this.info.aliveSecond || 0
      var hours = Math.floor(seconds / 3600)
      var minutes = Math.floor((seconds % 3600) / 60)
      var secs = seconds % 60
      if (hours > 0) return hours + 'h ' + minutes + 'm'
      if (minutes > 0) return minutes + 'm ' + secs + 's'
      return secs + 's'
    }
  }
}
</script>

<style lang="scss" scoped>
.media-info {
  padding: 10px;
  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 10px;
    .header-left {
      display: flex;
      align-items: center;
      .header-icon { margin-right: 5px; font-size: 16px; color: #409eff; }
      .title { font-size: 14px; font-weight: bold; }
    }
  }
  .stats-row {
    display: flex;
    align-items: center;
    gap: 15px;
    margin-bottom: 10px;
    padding: 8px;
    background: #f5f7fa;
    border-radius: 4px;
    .stat-item {
      display: flex;
      align-items: center;
      gap: 5px;
      .stat-icon { color: #409eff; }
      .stat-label { color: #909399; font-size: 12px; }
      .stat-value { font-weight: bold; font-size: 14px; }
    }
  }
  .detail-section {
    .detail-block {
      margin-bottom: 10px;
      padding: 8px;
      background: #f5f7fa;
      border-radius: 4px;
      .block-label {
        display: flex;
        align-items: center;
        gap: 5px;
        margin-bottom: 5px;
        font-weight: bold;
        .label-icon { font-size: 14px; }
      }
      .block-content {
        display: flex;
        gap: 10px;
        .tag {
          padding: 2px 8px;
          background: #ecf5ff;
          border-radius: 3px;
          font-size: 12px;
          color: #409eff;
        }
      }
    }
  }
  .empty-state {
    text-align: center;
    padding: 20px;
    color: #909399;
  }
}
</style>
