<template>
  <basic-container>
    <avue-crud
      :data="tableData"
      :option="option"
      :page="page"
      v-model="form"
      ref="crud"
      @on-load="onLoad"
      @search-change="searchChange"
      @search-reset="searchReset"
      @row-save="handleRowSave"
      @row-update="handleRowUpdate"
      @row-del="rowDel"
      @selection-change="selectionChange"
    >
      <template slot-scope="{ row }" slot="connectStatus">
        <el-tag :type="getDeviceOnlineStatus(row) === 'online' ? 'success' : 'info'" size="small" effect="dark">
          {{ getDeviceOnlineStatus(row) === 'online' ? '在线' : '离线' }}
        </el-tag>
      </template>
      <template slot-scope="{ row, type, disabled }" slot="menuForm">
        <device-form ref="formRef" :form-data="form" :type="type" :disabled="disabled" @submit="handleFormSubmit" />
      </template>
    </avue-crud>
  </basic-container>
</template>

<script>
import { getList, getDetail, add, update, remove } from '@/api/iot/device/instance'
import DeviceForm from './device-form'
import ws from '@/util/ws'

export default {
  name: 'DevicePage',
  components: { DeviceForm },
  data() {
    return {
      form: {},
      tableData: [],
      page: { currentPage: 1, pageSize: 20, total: 0 },
      query: {},
      selectionList: [],
      submitType: 'add',
      // WebSocket 相关
      wsOnlineHandler: null,
      wsOfflineHandler: null,
      option: {
        grid: true,
        gridBtn: true,
        index: true,
        selection: true,
        viewBtn: true,
        border: true,
        align: 'center',
        menuAlign: 'center',
        column: [
        {
                "label": "设备名称",
                "prop": "deviceName",
                "search": true,
                "width": 150
        },
        {
                "label": "设备类型",
                "prop": "deviceType",
                "type": "select",
                "dicUrl": "/api/blade-system/dict/dictionary?code=iot_product_type",
                "props": {
                        "label": "dictValue",
                        "value": "dictKey"
                },
                "dataType": "number",
                "search": true,
                "width": 120
        },
        {
                "label": "产品名称",
                "prop": "productName",
                "search": true,
                "width": 120
        },
        {
                "label": "设备状态",
                "prop": "deviceStatus",
                "type": "select",
                "dicUrl": "/api/blade-system/dict/dictionary?code=iot_device_status",
                "props": {
                        "label": "dictValue",
                        "value": "dictKey"
                },
                "dataType": "number",
                "search": true,
                "width": 100
        },
        {
                "label": "连接状态",
                "prop": "connectStatus",
                "type": "select",
                "dicUrl": "/api/blade-system/dict/dictionary?code=iot_connect_status",
                "props": {
                        "label": "dictValue",
                        "value": "dictKey"
                },
                "dataType": "number",
                "search": true,
                "slot": true,
                "width": 100
        },
        {
                "label": "是否启用",
                "prop": "isEnabled",
                "type": "select",
                "dicUrl": "/api/blade-system/dict/dictionary?code=iot_enable_status",
                "props": {
                        "label": "dictValue",
                        "value": "dictKey"
                },
                "dataType": "number",
                "search": true,
                "width": 100
        },
        {
                "label": "最后上线时间",
                "prop": "lastOnlineTime",
                "width": 160
        },
        {
                "label": "描述",
                "prop": "description",
                "width": 200,
                "overHidden": true
        }
]
      }
    }
  },
  mounted() {
    this.initWebSocket()
  },
  beforeDestroy() {
    this.destroyWebSocket()
  },
  methods: {
    /**
     * 获取设备的实时在线状态（优先使用WebSocket推送的状态）
     */
    getDeviceOnlineStatus(row) {
      const wsStatus = this.$store && this.$store.state.ws && this.$store.state.ws.deviceStatusMap[row.id]
      if (wsStatus) return wsStatus
      // 兜底：使用接口返回的connectStatus字段
      return row.connectStatus === 1 ? 'online' : 'offline'
    },
    /**
     * 初始化 WebSocket 监听
     */
    initWebSocket() {
      // 初始化 store 中的 WebSocket
      if (this.$store && this.$store._modulesNamespaceMap && !this.$store._modulesNamespaceMap['ws/']) {
        this.$store.registerModule('ws', require('@/store/modules/ws').default)
      }
      this.$store.dispatch('ws/initWebSocket')

      // 设备上线回调：更新列表中对应设备的状态
      this.wsOnlineHandler = (data) => {
        this.updateDeviceInList(data.deviceId, 'online')
        this.$notify({
          title: '设备上线',
          message: `设备 ${data.deviceName || data.deviceId} 已上线`,
          type: 'success',
          duration: 3000
        })
      }
      ws.on('device_online', this.wsOnlineHandler)

      // 设备离线回调
      this.wsOfflineHandler = (data) => {
        this.updateDeviceInList(data.deviceId, 'offline')
        this.$notify({
          title: '设备离线',
          message: `设备 ${data.deviceName || data.deviceId} 已离线`,
          type: 'warning',
          duration: 3000
        })
      }
      ws.on('device_offline', this.wsOfflineHandler)
    },
    /**
     * 销毁 WebSocket 监听
     */
    destroyWebSocket() {
      ws.off('device_online', this.wsOnlineHandler)
      ws.off('device_offline', this.wsOfflineHandler)
      this.wsOnlineHandler = null
      this.wsOfflineHandler = null
    },
    /**
     * 更新表格中对应设备的状态（不刷新整页）
     */
    updateDeviceInList(deviceId, status) {
      const index = this.tableData.findIndex(item => item.id === deviceId)
      if (index !== -1) {
        // 使用 Vue.set 保证响应式更新
        this.$set(this.tableData, index, {
          ...this.tableData[index],
          connectStatus: status === 'online' ? 1 : 0,
          lastOnlineTime: status === 'online' ? new Date().toLocaleString() : this.tableData[index].lastOnlineTime
        })
      }
    },
    async onLoad(page) {
      const res = await getList(page.currentPage, page.pageSize, this.query)
      this.tableData = res.data.records
      this.page.total = res.data.total
    },
    searchChange(params, done) {
      this.query = params
      this.page.currentPage = 1
      this.onLoad(this.page)
      done()
    },
    searchReset() {
      this.query = {}
      this.onLoad(this.page)
    },
    handleRowSave(row, done, loading) {
      this.submitType = 'add'
      this.form = { ...row }
    },
    handleRowUpdate(row, index, done, loading) {
      this.submitType = 'edit'
      this.form = { ...row }
    },
    async handleFormSubmit(formData) {
      try {
        if (this.submitType === 'add') {
          await add(formData)
          this.$message.success('新增成功')
        } else {
          await update(formData)
          this.$message.success('修改成功')
        }
        this.$refs.crud.rowCancel()
        this.onLoad(this.page)
      } catch (e) {
        this.$message.error('操作失败')
      }
    },
    async rowDel(row, index, done) {
      await this.$confirm('确定删除该条数据吗？', '提示', { type: 'warning' })
      await remove(row.id)
      this.$message.success('删除成功')
      done()
    },
    selectionChange(list) {
      this.selectionList = list
    }
  }
}
</script>
