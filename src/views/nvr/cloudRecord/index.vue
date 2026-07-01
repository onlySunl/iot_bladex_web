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
        <el-button size="small" type="primary" icon="el-icon-video-play" @click="handlePlay(row)">播放</el-button>
      </template>
    </avue-crud>
  </basic-container>
</template>

<script>
import { getList, getDetail, remove, loadRecord, closeStreams } from '@/api/nvr/cloudRecord'
import { getMediaServerList } from '@/api/nvr/zlm'

export default {
  name: 'NvrCloudRecord',
  data() {
    return {
      form: {},
      tableData: [],
      page: { currentPage: 1, pageSize: 20, total: 0 },
      query: {},
      selectionList: [],
      mediaServerList: [],
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
            label: '设备编号',
            prop: 'deviceCode',
            width: 150
          },
          {
            label: '设备名称',
            prop: 'deviceName',
            width: 150
          },
          {
            label: '媒体节点',
            prop: 'mediaServerId',
            search: true,
            type: 'select',
            width: 150,
            dicData: []
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
          },
          {
            label: '创建时间',
            prop: 'createTime',
            width: 160
          }
        ]
      }
    }
  },
  async created() {
    const res = await getMediaServerList()
    const list = res.data.data || []
    this.option.column.find(c => c.prop === 'mediaServerId').dicData = list.map(item => ({ label: item.id, value: item.id }))
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
    async handlePlay(row) {
      const res = await loadRecord(row.id)
      if (res.data.data) {
        this.$message.success('播放地址已生成')
      }
    }
  }
}
</script>
