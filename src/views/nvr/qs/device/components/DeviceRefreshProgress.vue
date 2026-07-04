<template>
    <el-dialog
        :model-value="visible"
        @update:model-value="$emit('update:visible', $event)"
        title="设备通道刷新进度"
        width="800px"
        :close-on-click-modal="false" :show-close="false"
    >

    <div class="refresh-progress-center">
      <el-icon size="40" class="refresh-icon spinning"><Refresh /></el-icon>
      <h3 class="refresh-header">正在同步设备通道信息</h3>
      <el-progress :percentage="progress" />
      <div class="refresh-steps">
        <div class="step-item">
          <span>连接设备</span>
        </div>
        <div class="step-divider"></div>
        <div class="step-item">
          <span>获取通道</span>
        </div>
        <div class="step-divider"></div>
        <div class="step-item">
          <span>保存数据</span>
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<script setup>
const props = defineProps({
  visible: Boolean,
  progress: Number
})
const emit = defineEmits(['update:visible'])
</script>