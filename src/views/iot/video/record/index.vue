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
import { getList, getDetail, remove } from '@/api/iot/video/video-record'

export default {
  name: 'VideoRecord',
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
                "label": "视频ID",
                "prop": "videoId",
                "search": true,
                "width": 120
        },
        {
                "label": "视频名称",
                "prop": "videoName",
                "search": true,
                "width": 120
        },
        {
                "label": "录像类型",
                "prop": "recordType",
                "type": "select",
                "dicUrl": "/api/blade-system/dict/dictionary?code=iot_log_type",
                "props": {
                        "label": "dictValue",
                        "value": "dictKey"
                },
                "dataType": "number",
                "search": true,
                "width": 120
        },
        {
                "label": "开始时间",
                "prop": "startTime",
                "width": 160
        },
        {
                "label": "结束时间",
                "prop": "endTime",
                "width": 160
        },
        {
                "label": "录像地址",
                "prop": "recordUrl",
                "width": 200,
                "overHidden": true
        },
        {
                "label": "文件大小",
                "prop": "fileSize",
                "width": 100
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
