<template>
    <el-dialog
        :model-value="visible"
        @update:model-value="$emit('update:visible', $event)"
        title="大华设备信息"
        width="650px"
    >
    <div class="info-cards-grid">
      <div class="info-card">
        <div class="info-card-label">设备型号</div>
        <div class="info-card-value">{{ info.deviceModel || '-' }}</div>
      </div>
      <div class="info-card">
        <div class="info-card-label">软件版本</div>
        <div class="info-card-value">{{ info.softVersion || '-' }}</div>
      </div>
      <div class="info-card">
        <div class="info-card-label">硬件序列号</div>
        <div class="info-card-value">{{ info.serial || '-' }}</div>
      </div>
      <div class="info-card">
        <div class="info-card-label">视频通道</div>
        <div class="info-card-value">{{ info.videoNum || 0 }}</div>
      </div>
      <div class="info-card">
        <div class="info-card-label">编码能力</div>
        <div class="info-card-value">{{ info.encodeType || '-' }}</div>
      </div>
      <div class="info-card">
        <div class="info-card-label">设备温度</div>
        <div class="info-card-value">{{ info.temp }}℃</div>
      </div>
    </div>
    <template #footer>
      <el-button @click="visible = false">关闭</el-button>
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