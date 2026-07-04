<template>
  <el-dialog
      :model-value="visible"
      @update:model-value="$emit('update:visible', $event)"
      title="海康设备信息"
      width="650px"
  >
    <div class="info-cards-grid">
      <div class="info-card">
        <div class="info-card-label">设备型号</div>
        <div class="info-card-value">{{ info.model || '-' }}</div>
      </div>
      <div class="info-card">
        <div class="info-card-label">固件版本</div>
        <div class="info-card-value">{{ info.firmware || '-' }}</div>
      </div>
      <div class="info-card">
        <div class="info-card-label">序列号</div>
        <div class="info-card-value">{{ info.sn || '-' }}</div>
      </div>
      <div class="info-card">
        <div class="info-card-label">通道数量</div>
        <div class="info-card-value">{{ info.channelNum || 0 }}</div>
      </div>
      <div class="info-card">
        <div class="info-card-label">硬盘容量</div>
        <div class="info-card-value">{{ info.diskSize || '未知' }}</div>
      </div>
      <div class="info-card">
        <div class="info-card-label">在线时长</div>
        <div class="info-card-value">{{ info.onlineTime || '-' }}</div>
      </div>
    </div>
    <template #footer>
      <el-button @click="$emit('update:visible', false)">关闭</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
const props = defineProps({
  visible: Boolean,
  info: Object
})
const emit = defineEmits(['update:visible'])
</script>