<template>
    <el-dialog
        :model-value="visible"
        @update:model-value="$emit('update:visible', $event)"
        title="录像下载"
        width="800px"
    >

    <el-form :model="form" label-width="100px">
      <el-form-item label="通道号">
        <el-input-number v-model="form.channel" :min="1" />
      </el-form-item>
      <el-form-item label="开始时间">
        <el-date-picker v-model="form.startTime" type="datetime" style="width:100%" />
      </el-form-item>
      <el-form-item label="结束时间">
        <el-date-picker v-model="form.endTime" type="datetime" style="width:100%" />
      </el-form-item>
      <el-form-item label="存储路径">
        <el-input v-model="form.savePath" placeholder="本地保存路径" />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="visible = false">取消</el-button>
        <el-button type="primary" @click="$emit('download')">开始下载</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
const props = defineProps({
  visible: Boolean,
  form: Object
})
const emit = defineEmits(['update:visible', 'download'])
</script>