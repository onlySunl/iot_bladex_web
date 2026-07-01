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
                <template #append>
                  <el-button icon="el-icon-document-copy" @click="copyUrl(streamInfo.flv)"/>
                </template>
              </el-input>
            </div>
            <div class="url-item" v-if="streamInfo.https_flv">
              <span class="label">HTTPS</span>
              <el-input v-model="streamInfo.https_flv" readonly>
                <template #append>
                  <el-button icon="el-icon-document-copy" @click="copyUrl(streamInfo.https_flv)"/>
                </template>
              </el-input>
            </div>
            <div class="url-item" v-if="streamInfo.ws_flv">
              <span class="label">WS</span>
              <el-input v-model="streamInfo.ws_flv" readonly>
                <template #append>
                  <el-button icon="el-icon-document-copy" @click="copyUrl(streamInfo.ws_flv)"/>
                </template>
              </el-input>
            </div>
            <div class="url-item" v-if="streamInfo.wss_flv">
              <span class="label">WSS</span>
              <el-input v-model="streamInfo.wss_flv" readonly>
                <template #append>
                  <el-button icon="el-icon-document-copy" @click="copyUrl(streamInfo.wss_flv)"/>
                </template>
              </el-input>
            </div>
          </div>
        </el-tab-pane>

        <el-tab-pane v-if="hasFmp4" label="FMP4" name="fmp4">
          <div class="url-list">
            <div class="url-item" v-if="streamInfo.fmp4">
              <span class="label">HTTP</span>
              <el-input v-model="streamInfo.fmp4" readonly>
                <template #append>
                  <el-button icon="el-icon-document-copy" @click="copyUrl(streamInfo.fmp4)"/>
                </template>
              </el-input>
            </div>
            <div class="url-item" v-if="streamInfo.https_fmp4">
              <span class="label">HTTPS</span>
              <el-input v-model="streamInfo.https_fmp4" readonly>
                <template #append>
                  <el-button icon="el-icon-document-copy" @click="copyUrl(streamInfo.https_fmp4)"/>
                </template>
              </el-input>
            </div>
            <div class="url-item" v-if="streamInfo.ws_fmp4">
              <span class="label">WS</span>
              <el-input v-model="streamInfo.ws_fmp4" readonly>
                <template #append>
                  <el-button icon="el-icon-document-copy" @click="copyUrl(streamInfo.ws_fmp4)"/>
                </template>
              </el-input>
            </div>
            <div class="url-item" v-if="streamInfo.wss_fmp4">
              <span class="label">WSS</span>
              <el-input v-model="streamInfo.wss_fmp4" readonly>
                <template #append>
                  <el-button icon="el-icon-document-copy" @click="copyUrl(streamInfo.wss_fmp4)"/>
                </template>
              </el-input>
            </div>
          </div>
        </el-tab-pane>

        <el-tab-pane v-if="hasHls" label="HLS" name="hls">
          <div class="url-list">
            <div class="url-item" v-if="streamInfo.hls">
              <span class="label">HTTP</span>
              <el-input v-model="streamInfo.hls" readonly>
                <template #append>
                  <el-button icon="el-icon-document-copy" @click="copyUrl(streamInfo.hls)"/>
                </template>
              </el-input>
            </div>
            <div class="url-item" v-if="streamInfo.https_hls">
              <span class="label">HTTPS</span>
              <el-input v-model="streamInfo.https_hls" readonly>
                <template #append>
                  <el-button icon="el-icon-document-copy" @click="copyUrl(streamInfo.https_hls)"/>
                </template>
              </el-input>
            </div>
            <div class="url-item" v-if="streamInfo.ws_hls">
              <span class="label">WS</span>
              <el-input v-model="streamInfo.ws_hls" readonly>
                <template #append>
                  <el-button icon="el-icon-document-copy" @click="copyUrl(streamInfo.ws_hls)"/>
                </template>
              </el-input>
            </div>
            <div class="url-item" v-if="streamInfo.wss_hls">
              <span class="label">WSS</span>
              <el-input v-model="streamInfo.wss_hls" readonly>
                <template #append>
                  <el-button icon="el-icon-document-copy" @click="copyUrl(streamInfo.wss_hls)"/>
                </template>
              </el-input>
            </div>
          </div>
        </el-tab-pane>

        <el-tab-pane v-if="hasTs" label="TS" name="ts">
          <div class="url-list">
            <div class="url-item" v-if="streamInfo.ts">
              <span class="label">HTTP</span>
              <el-input v-model="streamInfo.ts" readonly>
                <template #append>
                  <el-button icon="el-icon-document-copy" @click="copyUrl(streamInfo.ts)"/>
                </template>
              </el-input>
            </div>
            <div class="url-item" v-if="streamInfo.https_ts">
              <span class="label">HTTPS</span>
              <el-input v-model="streamInfo.https_ts" readonly>
                <template #append>
                  <el-button icon="el-icon-document-copy" @click="copyUrl(streamInfo.https_ts)"/>
                </template>
              </el-input>
            </div>
            <div class="url-item" v-if="streamInfo.ws_ts">
              <span class="label">WS</span>
              <el-input v-model="streamInfo.ws_ts" readonly>
                <template #append>
                  <el-button icon="el-icon-document-copy" @click="copyUrl(streamInfo.ws_ts)"/>
                </template>
              </el-input>
            </div>
            <div class="url-item" v-if="streamInfo.wss_ts">
              <span class="label">WSS</span>
              <el-input v-model="streamInfo.wss_ts" readonly>
                <template #append>
                  <el-button icon="el-icon-document-copy" @click="copyUrl(streamInfo.wss_ts)"/>
                </template>
              </el-input>
            </div>
          </div>
        </el-tab-pane>

        <el-tab-pane v-if="hasRtc" label="RTC" name="rtc">
          <div class="url-list">
            <div class="url-item" v-if="streamInfo.rtc">
              <span class="label">RTC</span>
              <el-input v-model="streamInfo.rtc" readonly>
                <template #append>
                  <el-button icon="el-icon-document-copy" @click="copyUrl(streamInfo.rtc)"/>
                </template>
              </el-input>
            </div>
            <div class="url-item" v-if="streamInfo.rtcs">
              <span class="label">RTCS</span>
              <el-input v-model="streamInfo.rtcs" readonly>
                <template #append>
                  <el-button icon="el-icon-document-copy" @click="copyUrl(streamInfo.rtcs)"/>
                </template>
              </el-input>
            </div>
          </div>
        </el-tab-pane>

        <el-tab-pane v-if="hasRtmp" label="RTMP" name="rtmp">
          <div class="url-list">
            <div class="url-item" v-if="streamInfo.rtmp">
              <span class="label">RTMP</span>
              <el-input v-model="streamInfo.rtmp" readonly>
                <template #append>
                  <el-button icon="el-icon-document-copy" @click="copyUrl(streamInfo.rtmp)"/>
                </template>
              </el-input>
            </div>
            <div class="url-item" v-if="streamInfo.rtmps">
              <span class="label">RTMPS</span>
              <el-input v-model="streamInfo.rtmps" readonly>
                <template #append>
                  <el-button icon="el-icon-document-copy" @click="copyUrl(streamInfo.rtmps)"/>
                </template>
              </el-input>
            </div>
          </div>
        </el-tab-pane>

        <el-tab-pane v-if="hasRtsp" label="RTSP" name="rtsp">
          <div class="url-list">
            <div class="url-item" v-if="streamInfo.rtsp">
              <span class="label">RTSP</span>
              <el-input v-model="streamInfo.rtsp" readonly>
                <template #append>
                  <el-button icon="el-icon-document-copy" @click="copyUrl(streamInfo.rtsp)"/>
                </template>
              </el-input>
            </div>
            <div class="url-item" v-if="streamInfo.rtsps">
              <span class="label">RTSPS</span>
              <el-input v-model="streamInfo.rtsps" readonly>
                <template #append>
                  <el-button icon="el-icon-document-copy" @click="copyUrl(streamInfo.rtsps)"/>
                </template>
              </el-input>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
      <template #footer>
        <el-button @click="dialogOpen = false">关闭</el-button>
      </template>
    </el-dialog>
  </span>
</template>

<script>

;

// 定义 Props
const props = defineProps({
  streamInfo: {
    type: Object,
    required: true,
    default: () => ({})
  }
});

;
;

// 判断分组是否有内容
;
;
;
;
;
;
;

// 根据数据更新时，自动选择第一个有内容的标签页
const setDefaultActiveTab = () => {
  if (hasFlv) { activeTab = 'flv'; return; }
  if (hasHls) { activeTab = 'hls'; return; }
  if (hasTs) { activeTab = 'ts'; return; }
  if (hasFmp4) { activeTab = 'fmp4'; return; }
  if (hasRtc) { activeTab = 'rtc'; return; }
  if (hasRtmp) { activeTab = 'rtmp'; return; }
  if (hasRtsp) { activeTab = 'rtsp'; }
};

watch(dialogOpen, (newVal) => {
  if (newVal) {
    setDefaultActiveTab();
  }
});

// 复制 URL 的方法
const copyUrl = async (url) => {
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
};
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
