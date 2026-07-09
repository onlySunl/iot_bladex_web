<template>
  <div class="stream-address">
    <el-row :gutter="10" class="url-row">
      <el-col :span="3">
        <span class="url-label">播放地址：</span>
      </el-col>
      <el-col :span="21">
        <el-input :value="flvUrl" disabled>
          <template #prepend>flv地址</template>
          <template #append>
            <el-button type="primary" :icon="DocumentCopy" @click="copyText(flvUrl)"/>
          </template>
        </el-input>
      </el-col>
    </el-row>
    <el-row :gutter="10" class="url-row">
      <el-col :span="3">
        <span class="url-label">iframe：</span>
      </el-col>
      <el-col :span="21">
        <el-input :value="sharedIframe" disabled>
          <template #prepend>iframe：</template>
          <template #append>
            <el-button type="primary" :icon="DocumentCopy" @click="copyText(sharedIframe)"/>
          </template>
        </el-input>
      </el-col>
    </el-row>
    <el-row :gutter="10" class="url-row">
      <el-col :span="3">
        <span class="url-label">资源地址：</span>
      </el-col>
      <el-col :span="21">
        <el-input :value="rtcUrl" disabled>
          <template #prepend>
            <StreamDropdown :stream-info="streamInfo || {}"/>
          </template>
          <template #append>
            <el-button type="primary" :icon="DocumentCopy" @click="copyText(wsUrl)"/>
          </template>
        </el-input>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
/**
 * StreamAddress - 流地址显示组件
 * 负责显示各种格式的播放地址
 */
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { DocumentCopy } from '@element-plus/icons-vue'
import StreamDropdown from '@/components/nvr/Channel/streamDropdown.vue'

// Props
const props = defineProps({
  flvUrl: { type: String, default: '' },
  wsUrl: { type: String, default: '' },
  rtcUrl: { type: String, default: '' },
  sharedIframe: { type: String, default: '' },
  streamInfo: { type: Object, default: () => ({}) }
})

// 复制文本
const copyText = (text) => {
  if (!text) return
  const input = document.createElement('textarea')
  input.value = text
  document.body.appendChild(input)
  input.select()
  document.execCommand('copy')
  document.body.removeChild(input)
  ElMessage.success('复制成功')
}
</script>

<style scoped lang="scss">
.stream-address {
  .url-row {
    margin-top: 10px;
  }

  .url-label {
    width: 80px;
    line-height: 40px;
    text-align: right;
    display: inline-block;
  }
}
</style>
