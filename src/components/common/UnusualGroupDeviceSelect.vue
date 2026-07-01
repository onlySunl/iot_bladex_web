<template>
  <el-dialog :visible.sync="dialogVisible" :title="title" width="600px" @close="handleClose">
    <el-table :data="deviceList" ref="table" @selection-change="handleSelectionChange" height="400">
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column prop="name" label="设备名称"></el-table-column>
      <el-table-column prop="deviceId" label="设备ID"></el-table-column>
    </el-table>
    <span slot="footer">
      <el-button @click="handleClose">取消</el-button>
      <el-button type="primary" @click="handleConfirm">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  name: 'UnusualGroupDeviceSelect',
  props: {
    visible: { type: Boolean, default: false },
    groupId: { type: [String, Number], default: '' }
  },
  data() {
    return {
      dialogVisible: false,
      deviceList: [],
      selectedDevices: []
    }
  },
  computed: {
    title() { return '选择设备' }
  },
  watch: {
    visible(val) { this.dialogVisible = val; if (val) this.loadData() }
  },
  methods: {
    loadData() { this.deviceList = [] },
    handleSelectionChange(val) { this.selectedDevices = val },
    handleConfirm() {
      this.$emit('confirm', this.selectedDevices)
      this.handleClose()
    },
    handleClose() {
      this.$emit('update:visible', false)
    }
  }
}
</script>
