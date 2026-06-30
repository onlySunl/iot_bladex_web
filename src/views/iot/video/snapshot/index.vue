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
import { getList, getDetail, remove } from '@/api/iot/video/video-snapshot'

export default {
  name: 'VideoSnapshot',
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
                "label": "截图地址",
                "prop": "snapshotUrl",
                "width": 200,
                "overHidden": true
        },
        {
                "label": "截图时间",
                "prop": "snapshotTime",
                "width": 160
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
