<template>
  <div class="media-info">
    <el-descriptions :column="2" border size="small">
      <el-descriptions-item label="流地址">{{ mediaInfo.url || '-' }}</el-descriptions-item>
      <el-descriptions-item label="流类型">{{ mediaInfo.streamType || '-' }}</el-descriptions-item>
      <el-descriptions-item label="编码格式">{{ mediaInfo.codec || '-' }}</el-descriptions-item>
      <el-descriptions-item label="分辨率">{{ mediaInfo.resolution || '-' }}</el-descriptions-item>
      <el-descriptions-item label="帧率">{{ mediaInfo.fps || '-' }}</el-descriptions-item>
      <el-descriptions-item label="码率">{{ mediaInfo.bitrate || '-' }}</el-descriptions-item>
    </el-descriptions>
  </div>
</template>

<script>
export default {
  name: 'MediaInfo',
  props: {
    mediaInfo: {
      type: Object,
      default: function() {
        return {}
      }
    }
  }
}
</script>

<style scoped>
.media-info {
  padding: 10px;
}
</style>
