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
import { getList, getDetail } from '@/api/iot/link/device-log'

export default {
  name: 'DeviceLog',
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
          { label: "设备ID", prop: "deviceId", search: true, width: 120 },
          { label: "设备名称", prop: "deviceName", search: true, width: 120 },
          { label: "日志类型", prop: "logType", type: "select", dicUrl: "/api/blade-system/dict/dictionary?code=iot_log_type", props: { label: "dictValue", value: "dictKey" }, dataType: "number", search: true, width: 120 },
          { label: "日志内容", prop: "logContent", width: 300, overHidden: true },
          { label: "创建时间", prop: "createTime", width: 160 }
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
