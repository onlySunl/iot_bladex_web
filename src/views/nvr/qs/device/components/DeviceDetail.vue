<template>
  <el-drawer title="NVR设备详情" v-model="visible" direction="rtl" width="600px">
    <el-descriptions :column="2" border>
      <el-descriptions-item label="设备名称">{{ deviceInfo.deviceName || '-' }}</el-descriptions-item>
      <el-descriptions-item label="所属区域">{{ deviceInfo.regionName || '-' }}</el-descriptions-item>
      <el-descriptions-item label="设备IP">{{ deviceInfo.ip || '-' }}</el-descriptions-item>
      <el-descriptions-item label="端口">{{ deviceInfo.port || '-' }}</el-descriptions-item>
      <el-descriptions-item label="登录账号">{{ deviceInfo.username || '-' }}</el-descriptions-item>
      <el-descriptions-item label="通道总数">{{ deviceInfo.channelTotal || 0 }}</el-descriptions-item>
      <el-descriptions-item label="在线状态">
        <el-tag :type="deviceInfo.status === 1 ? 'success' : 'danger'">
          {{ deviceInfo.status === 1 ? '在线' : '离线' }}
        </el-tag>
      </el-descriptions-item>
      <el-descriptions-item label="创建时间">{{ deviceInfo.createTime || '-' }}</el-descriptions-item>
      <el-descriptions-item label="备注" :span="2">{{ deviceInfo.remark || '-' }}</el-descriptions-item>
    </el-descriptions>
  </el-drawer>
</template>

<script>
export default {
  name: 'DeviceDetail',
  props: {
    visible: Boolean,
    deviceInfo: Object
  },
  computed: {
    dialogVisible: {
      get() { return this.visible },
      set(val) { this.$emit('update:visible', val) }
    }
  }
}
</script>

<style scoped></style>