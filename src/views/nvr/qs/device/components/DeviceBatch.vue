<template>
  <el-dialog title="批量操作" v-model="visible" width="450px">
    <div class="batch-tip">
      <el-alert type="warning" :closable="false" show-icon>
        当前选中 <span class="text-red">{{ selectedIds.length }}</span> 条设备数据，确认执行批量删除操作？删除后不可恢复！
      </el-alert>
    </div>
    <template #footer>
      <el-button @click="$emit('update:visible', false)">取消</el-button>
      <el-button type="danger" @click="$emit('confirm', 'delete')">确认删除</el-button>
    </template>
  </el-dialog>
</template>

<script>
export default {
  name: 'DeviceBatch',
  props: {
    visible: Boolean,
    selectedIds: Array
  },
  computed: {
    dialogVisible: {
      get() { return this.visible },
      set(val) { this.$emit('update:visible', val) }
    }
  }
}
</script>

<style scoped lang="scss">
.batch-tip {
  margin-bottom: 20px;
}
.text-red {
  color: #f56c6c;
  font-weight: bold;
}
</style>