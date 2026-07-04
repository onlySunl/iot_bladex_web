<template>
  <el-dialog
      :model-value="visible"
      @update:model-value="$emit('update:visible', $event)"
      title="设备校时"
      width="520px"
  >
    <el-form :model="form" label-width="100px">
      <el-form-item label="设备ID">
        <el-input v-model="form.deviceId" disabled />
      </el-form-item>
      <el-form-item label="设备IP">
        <el-input v-model="form.deviceIp" disabled />
      </el-form-item>
      <el-form-item label="当前设备时间">
        <el-input v-model="form.deviceTime" disabled placeholder="读取中..." />
      </el-form-item>
      <el-form-item label="同步本机时间">
        <el-switch v-model="form.syncType" />
      </el-form-item>
      <el-form-item label="自定义时间" v-if="!form.syncType">
        <el-date-picker v-model="form.syncTime" type="datetime" placeholder="选择时间" style="width:100%;" />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="$emit('update:visible', false)">取消</el-button>
        <el-button type="primary" @click="$emit('sync')">执行校时</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
const props = defineProps({
  visible: Boolean,
  form: Object
})
const emit = defineEmits(['update:visible', 'sync'])
</script>