<template>

  <span>
    <div class="prepend-btn" @click="dialogOpen = true">更多地址</div>
    <el-dialog v-model="dialogOpen" title="所有播放地址" width="600px" append-to-body>
      <el-tabs v-model="activeTab" type="border-card">
        <el-tab-pane v-if="hasFlv" label="FLV" name="flv">
          <div class="url-list">
            <div class="url-item" v-if="streamInfo.flv">
              <span class="label">HTTP</span>
              <el-input v-model="streamInfo.flv" readonly>
                <template slot="append">
                  <el-button icon="el-icon-document-copy" @click="copyUrl(streamInfo.flv)"/>
                
</template>

<script>

export default {
  name: 'flv',
  data() {
    return {
    }
  },
  methods: {
    setDefaultActiveTab() {
      if (hasFlv) { activeTab = 'flv'; return; }
        if (hasHls) { activeTab = 'hls'; return; }
        if (hasTs) { activeTab = 'ts'; return; }
        if (hasFmp4) { activeTab = 'fmp4'; return; }
        if (hasRtc) { activeTab = 'rtc'; return; }
        if (hasRtmp) { activeTab = 'rtmp'; return; }
        if (hasRtsp) { activeTab = 'rtsp'; }
    },
    async copyUrl(url) {
      if (!url) {
          this.$message.error('内容为空，无法复制');
          return;
        }
      
        try {
          await toClipboard(url);
          this.$message.success('成功拷贝到粘贴板');
        } catch (e) {
          console.error(e);
        }
    },
  },
}
</script>

<style scoped>
.no-radius-btn {
  border-radius: 0important;
  color: #ffffffimportant;
}

.url-list {
  padding: 16px 4px;
}

.url-item {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 14px;
}

.url-item:last-child {
  margin-bottom: 0;
}

.url-item .label {
  min-width: 60px;
  font-size: 13px;
  font-weight: 600;
  color: #409eff;
  text-align: right;
}

:deep(.el-tabs--border-card) {
  border-radius: 8px;
  box-shadow: none;
}

:deep(.el-tabs__header) {
  margin: 0;
}

:deep(.el-tabs__item) {
  font-weight: 500;
  color: #606266;
}

:deep(.el-tabs__item.is-active) {
  color: #409eff;
}

:deep(.el-tabs__active-bar) {
  background: #409eff;
}

:deep(.el-tabs__content) {
  padding: 0 16px;
}
</style>
