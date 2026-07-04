<template>

    <el-dialog
        :model-value="visible"
        @update:model-value="$emit('update:visible', $event)"
        title="GB录像回放控制"
        width="650px"
    >
    <el-form :model="form" label-width="100px">
      <el-form-item label="通道ID">
        <el-input v-model="form.channelId" />
      </el-form-item>
      <el-form-item label="录像起始时间">
        <el-date-picker v-model="form.start" type="datetime" style="width:100%" />
      </el-form-item>
      <el-form-item label="录像结束时间">
        <el-date-picker v-model="form.end" type="datetime" style="width:100%" />
      </el-form-item>
      <el-form-item label="回放速度">
        <el-select v-model="form.speed">
          <el-option label="1倍速" value="1" />
          <el-option label="2倍速" value="2" />
          <el-option label="4倍速" value="4" />
        </el-select>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="visible = false">关闭</el-button>
        <el-button type="primary" @click="$emit('playRecord')">开始回放</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
const props = defineProps({
  visible: Boolean,
  form: Object
})
const emit = defineEmits(['update:visible', 'playRecord'])
</script>