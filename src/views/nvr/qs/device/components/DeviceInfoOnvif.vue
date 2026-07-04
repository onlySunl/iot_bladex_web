<template>
    <el-dialog
        :model-value="visible"
        @update:model-value="$emit('update:visible', $event)"
        title="ONVIF设备信息"
        width="1200px"
        destroy-on-close
    >
    <el-descriptions border column="2">
      <el-descriptions-item label="服务地址">{{ info.serviceUrl || '-' }}</el-descriptions-item>
      <el-descriptions-item label="设备名称">{{ info.name || '-' }}</el-descriptions-item>
      <el-descriptions-item label="制造商">{{ info.manufacturer || '-' }}</el-descriptions-item>
      <el-descriptions-item label="型号">{{ info.model || '-' }}</el-descriptions-item>
      <el-descriptions-item label="固件版本">{{ info.firmware || '-' }}</el-descriptions-item>
      <el-descriptions-item label="认证方式">{{ info.authType || 'Digest' }}</el-descriptions-item>
      <el-descriptions-item label="支持Profile">{{ info.profiles || '-' }}</el-descriptions-item>
      <el-descriptions-item label="RTSP地址">{{ info.rtspUrl || '-' }}</el-descriptions-item>
    </el-descriptions>
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