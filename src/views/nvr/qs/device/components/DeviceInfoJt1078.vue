<template>
    <el-dialog
        :model-value="visible"
        @update:model-value="$emit('update:visible', $event)"
        title="JT1078车载终端信息"
        width="1200px"
        destroy-on-close
    >
    <el-descriptions border column="2">
      <el-descriptions-item label="终端ID">{{ info.terminalId || '-' }}</el-descriptions-item>
      <el-descriptions-item label="车牌号码">{{ info.carNo || '-' }}</el-descriptions-item>
      <el-descriptions-item label="车牌颜色">{{ info.carColor || '-' }}</el-descriptions-item>
      <el-descriptions-item label="SIM卡号">{{ info.sim || '-' }}</el-descriptions-item>
      <el-descriptions-item label="通信协议">{{ info.protocol || 'JT1078-2019' }}</el-descriptions-item>
      <el-descriptions-item label="在线状态">
        <el-tag :type="info.online ? 'success' : 'danger'">{{ info.online ? '在线' : '离线' }}</el-tag>
      </el-descriptions-item>
      <el-descriptions-item label="视频通道数">{{ info.channelNum || 0 }}</el-descriptions-item>
      <el-descriptions-item label="最后上报时间">{{ info.lastReportTime || '-' }}</el-descriptions-item>
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