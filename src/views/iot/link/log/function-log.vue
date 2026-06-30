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
import { getList, getDetail, remove } from '@/api/iot/link/function-log'

export default {
  name: 'FunctionLog',
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
        {
                "label": "设备ID",
                "prop": "deviceId",
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
                "label": "功能名称",
                "prop": "functionName",
                "search": true,
                "width": 120
        },
        {
                "label": "功能ID",
                "prop": "functionId",
                "width": 120
        },
        {
                "label": "请求内容",
                "prop": "requestContent",
                "width": 200,
                "overHidden": true
        },
        {
                "label": "响应内容",
                "prop": "responseContent",
                "width": 200,
                "overHidden": true
        },
        {
                "label": "状态",
                "prop": "status",
                "type": "select",
                "dicUrl": "/api/blade-system/dict/dictionary?code=iot_connect_status",
                "props": {
                        "label": "dictValue",
                        "value": "dictKey"
                },
                "dataType": "number",
                "search": true,
                "width": 100
        },
        {
                "label": "创建时间",
                "prop": "createTime",
                "width": 160
        }
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
