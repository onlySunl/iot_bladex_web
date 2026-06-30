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
import { getList, getDetail, remove } from '@/api/iot/link/firmware-task-detail'

export default {
  name: 'FirmwareTaskDetail',
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
                "label": "任务ID",
                "prop": "taskId",
                "search": true,
                "width": 120
        },
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
                "label": "当前版本",
                "prop": "currentVersion",
                "width": 120
        },
        {
                "label": "目标版本",
                "prop": "targetVersion",
                "width": 120
        },
        {
                "label": "升级状态",
                "prop": "upgradeStatus",
                "type": "select",
                "dicUrl": "/api/blade-system/dict/dictionary?code=iot_firmware_status",
                "props": {
                        "label": "dictValue",
                        "value": "dictKey"
                },
                "dataType": "number",
                "search": true,
                "width": 120
        },
        {
                "label": "升级时间",
                "prop": "upgradeTime",
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
