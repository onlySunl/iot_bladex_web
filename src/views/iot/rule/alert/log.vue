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
      @selection-change="selectionChange"
    >
    </avue-crud>
  </basic-container>
</template>

<script>
import { getList, getDetail } from '@/api/iot/rule/alert'

export default {
  name: 'AlertLog',
  data() {
    return {
      form: {},
      tableData: [],
      page: { currentPage: 1, pageSize: 20, total: 0 },
      query: {},
      selectionList: [],
      option: {
        grid: true,
        gridBtn: true,
        index: true,
        selection: true,
        viewBtn: true,
        border: true,
        align: 'center',
        menuAlign: 'center',
        addBtn: false,
        editBtn: false,
        delBtn: false,
        column: [
          { label: "告警名称", prop: "alertName", search: true, width: 150 },
          { label: "告警级别", prop: "alertLevel", type: "select", dicUrl: "/api/blade-system/dict/dictionary?code=iot_alert_level", props: { label: "dictValue", value: "dictKey" }, dataType: "number", search: true, width: 100 },
          { label: "设备名称", prop: "deviceName", search: true, width: 120 },
          { label: "告警内容", prop: "alertContent", width: 250, overHidden: true },
          { label: "状态", prop: "status", type: "select", dicUrl: "/api/blade-system/dict/dictionary?code=iot_enable_status", props: { label: "dictValue", value: "dictKey" }, dataType: "number", search: true, width: 100 },
          { label: "告警时间", prop: "alertTime", width: 160 },
          { label: "处理人", prop: "handleUser", width: 120 },
          { label: "处理时间", prop: "handleTime", width: 160 }
        ]
      }
    }
  },
  methods: {
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
    selectionChange(list) {
      this.selectionList = list
    }
  }
}
</script>
