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
      @row-del="rowDel"
      @selection-change="selectionChange"
    >
      <template slot-scope="{ row }" slot="menu">
        <el-button size="small" type="primary" icon="el-icon-video-play" @click="handlePlayback(row)">回放</el-button>
      </template>
    </avue-crud>
  </basic-container>
</template>

<script>
import { getList, getDetail, remove } from '@/api/qs/cloudRecord'

export default {
  name: 'NvrRecordPlayback',
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
        column: [
          {
            label: '应用名',
            prop: 'app',
            search: true,
            width: 120
          },
          {
            label: '流ID',
            prop: 'stream',
            search: true,
            width: 150
          },
          {
            label: '设备名称',
            prop: 'deviceName',
            width: 150
          },
          {
            label: '文件大小',
            prop: 'fileSize',
            width: 100
          },
          {
            label: '时长',
            prop: 'timeLen',
            width: 100
          },
          {
            label: '开始时间',
            prop: 'startTime',
            search: true,
            width: 160
          },
          {
            label: '结束时间',
            prop: 'endTime',
            search: true,
            width: 160
          }
        ]
      }
    }
  },
  methods: {
    async onLoad(page) {
      const res = await getList(page.currentPage, page.pageSize, this.query)
      this.tableData = res.data.data.records
      this.page.total = res.data.data.total
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
    async rowDel(row, index, done) {
      await this.$confirm('确定删除该录像记录吗？', '提示', { type: 'warning' })
      await remove(row.id)
      this.$message.success('删除成功')
      done()
      this.onLoad(this.page)
    },
    selectionChange(list) {
      this.selectionList = list
    },
    handlePlayback(row) {
      this.$message.info('正在加载回放：' + row.stream)
    }
  }
}
</script>
