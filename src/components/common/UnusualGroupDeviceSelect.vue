<template>
  <el-dialog
    title="选择分组设备"
    :visible.sync="dialogVisible"
    width="600px"
    :before-close="handleClose"
  >
    <div class="unusual-group-device-select">
      <el-row :gutter="10">
        <el-col :span="12">
          <div class="panel">
            <div class="panel-title">可选设备</div>
            <el-input
              v-model="searchText"
              placeholder="搜索设备"
              size="small"
              clearable
              style="margin-bottom: 10px"
            />
            <el-table
              ref="availableTable"
              :data="filteredAvailableDevices"
              height="300"
              highlight-current-row
              @row-click="handleAvailableClick"
            >
              <el-table-column prop="name" label="设备名称" />
              <el-table-column prop="deviceId" label="设备ID" width="150" />
            </el-table>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="panel">
            <div class="panel-title">已选设备</div>
            <el-table
              ref="selectedTable"
              :data="selectedDevices"
              height="300"
              highlight-current-row
              @row-click="handleSelectedClick"
            >
              <el-table-column prop="name" label="设备名称" />
              <el-table-column prop="deviceId" label="设备ID" width="150" />
            </el-table>
          </div>
        </el-col>
      </el-row>
      <div class="actions" style="text-align: center; margin-top: 10px">
        <el-button size="small" @click="handleAdd">添加 &gt;</el-button>
        <el-button size="small" @click="handleRemove">&lt; 移除</el-button>
      </div>
    </div>
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
    visible: {
      type: Boolean,
      default: false
    },
    availableDevices: {
      type: Array,
      default: () => []
    },
    selectedDeviceIds: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      searchText: '',
      currentAvailable: null,
      currentSelected: null,
      selectedDevices: []
    }
  },
  computed: {
    dialogVisible: {
      get() {
        return this.visible
      },
      set(val) {
        this.$emit('update:visible', val)
      }
    },
    filteredAvailableDevices() {
      const available = this.availableDevices.filter(
        d => !this.selectedDevices.some(s => s.deviceId === d.deviceId)
      )
      if (!this.searchText) return available
      return available.filter(
        d => d.name && d.name.indexOf(this.searchText) !== -1
      )
    }
  },
  watch: {
    visible(val) {
      if (val) {
        this.initSelected()
      }
    }
  },
  methods: {
    initSelected() {
      this.selectedDevices = this.availableDevices.filter(d =>
        this.selectedDeviceIds.includes(d.deviceId)
      )
    },
    handleAvailableClick(row) {
      this.currentAvailable = row
    },
    handleSelectedClick(row) {
      this.currentSelected = row
    },
    handleAdd() {
      if (this.currentAvailable) {
        this.selectedDevices.push(this.currentAvailable)
        this.currentAvailable = null
      }
    },
    handleRemove() {
      if (this.currentSelected) {
        const idx = this.selectedDevices.findIndex(
          d => d.deviceId === this.currentSelected.deviceId
        )
        if (idx > -1) {
          this.selectedDevices.splice(idx, 1)
        }
        this.currentSelected = null
      }
    },
    handleClose() {
      this.dialogVisible = false
    },
    handleConfirm() {
      this.$emit('confirm', this.selectedDevices)
      this.dialogVisible = false
    }
  }
}
</script>

<style scoped>
.unusual-group-device-select {
  padding: 10px 0;
}
.panel {
  border: 1px solid #ebeef5;
  border-radius: 4px;
  padding: 10px;
}
.panel-title {
  font-weight: bold;
  margin-bottom: 10px;
  color: #303133;
}
</style>
