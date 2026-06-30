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
      <template slot-scope="{ row }" slot="menuLeft">
        <el-badge :value="newAlertCount" :hidden="newAlertCount === 0" class="alert-badge">
          <el-button type="warning" size="small" icon="el-icon-bell" @click="clearNewAlertCount">新告警</el-button>
        </el-badge>
      </template>
      <template slot-scope="{ row, type, disabled }" slot="menuForm">
        <alert-form ref="formRef" :form-data="form" :type="type" :disabled="disabled" @submit="handleFormSubmit" />
      </template>
    </avue-crud>
  </basic-container>
</template>

<script>
import { getList, getDetail, add, update, remove } from '@/api/iot/rule/alert'
import AlertForm from './alert-form'
import ws from '@/util/ws'

export default {
  name: 'AlertPage',
  components: { AlertForm },
  data() {
    return {
      form: {},
      tableData: [],
      page: { currentPage: 1, pageSize: 20, total: 0 },
      query: {},
      selectionList: [],
      submitType: 'add',
      // WebSocket 相关
      wsAlertHandler: null,
      newAlertCount: 0,
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
                "label": "告警名称",
                "prop": "alertName",
                "search": true,
                "width": 150
        },
        {
                "label": "告警级别",
                "prop": "alertLevel",
                "type": "select",
                "dicUrl": "/api/blade-system/dict/dictionary?code=iot_alert_level",
                "props": {
                        "label": "dictValue",
                        "value": "dictKey"
                },
                "dataType": "number",
                "search": true,
                "width": 100
        },
        {
                "label": "告警类型",
                "prop": "alertType",
                "type": "select",
                "dicUrl": "/api/blade-system/dict/dictionary?code=iot_alert_level",
                "props": {
                        "label": "dictValue",
                        "value": "dictKey"
                },
                "dataType": "number",
                "search": true,
                "width": 120
        },
        {
                "label": "设备名称",
                "prop": "deviceName",
                "search": true,
                "width": 120
        },
        {
                "label": "告警内容",
                "prop": "alertContent",
                "width": 200,
                "overHidden": true
        },
        {
                "label": "状态",
                "prop": "status",
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
                "label": "告警时间",
                "prop": "alertTime",
                "width": 160
        },
        {
                "label": "处理时间",
                "prop": "handleTime",
                "width": 160
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
     * 初始化 WebSocket 告警监听
     */
    initWebSocket() {
      // 初始化 store 中的 WebSocket
      if (this.$store && this.$store._modulesNamespaceMap && !this.$store._modulesNamespaceMap['ws/']) {
        this.$store.registerModule('ws', require('@/store/modules/ws').default)
      }
      this.$store.dispatch('ws/initWebSocket')

      // 告警回调
      this.wsAlertHandler = (data) => {
        // 1. 新告警插入列表顶部
        this.tableData.unshift({
          ...data,
          alertTime: data.alertTime || new Date().toLocaleString()
        })
        this.page.total += 1

        // 2. 新告警计数+1
        this.newAlertCount += 1

        // 3. 弹窗通知
        const levelMap = { 1: 'warning', 2: 'error', 3: 'error' }
        this.$notify({
          title: '新告警通知',
          message: `${data.alertName || '未知告警'} - ${data.alertContent || ''}`,
          type: levelMap[data.alertLevel] || 'warning',
          duration: 5000
        })
      }
      ws.on('alert', this.wsAlertHandler)
    },
    /**
     * 销毁 WebSocket 监听
     */
    destroyWebSocket() {
      ws.off('alert', this.wsAlertHandler)
      this.wsAlertHandler = null
    },
    /**
     * 清除新告警计数
     */
    clearNewAlertCount() {
      this.newAlertCount = 0
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

<style lang="scss" scoped>
.alert-badge {
  margin-right: 10px;
}
</style>
