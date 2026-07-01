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
      @row-save="rowSave"
      @row-update="rowUpdate"
      @row-del="rowDel"
      @selection-change="selectionChange"
    >
      <template slot-scope="{ row }" slot="enable">
        <el-tag :type="row.enable === 1 ? 'success' : 'info'" size="small">{{ row.enable === 1 ? '启用' : '禁用' }}</el-tag>
      </template>
      <template slot-scope="{ row }" slot="status">
        <el-tag :type="row.status === 1 ? 'success' : 'danger'" size="small" effect="dark">{{ row.status === 1 ? '在线' : '离线' }}</el-tag>
      </template>
      <template slot-scope="{ row }" slot="menu">
        <el-button size="small" type="success" icon="el-icon-connection" @click="handleLinkChannels(row)">关联通道</el-button>
        <el-button size="small" type="primary" icon="el-icon-upload2" v-if="row.status === 1" @click="handlePushCatalog(row)">推送通道</el-button>
      </template>
    </avue-crud>
  </basic-container>
</template>

<script>
import { getList, getDetail, add, update, remove, register, unregister, pushCatalog } from '@/api/qs/platform'

export default {
  name: 'NvrPlatform',
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
            label: '平台名称',
            prop: 'name',
            search: true,
            rules: [{ required: true, message: '请输入平台名称', trigger: 'blur' }]
          },
          {
            label: '国标编码',
            prop: 'serverGbId',
            search: true,
            rules: [{ required: true, message: '请输入国标编码', trigger: 'blur' }]
          },
          {
            label: '服务器IP',
            prop: 'serverIp',
            width: 150
          },
          {
            label: '服务器端口',
            prop: 'serverPort',
            width: 100
          },
          {
            label: '传输协议',
            prop: 'transport',
            type: 'select',
            width: 100,
            dicData: [
              { label: 'UDP', value: 'UDP' },
              { label: 'TCP', value: 'TCP' }
            ]
          },
          {
            label: '启用状态',
            prop: 'enable',
            type: 'select',
            width: 100,
            dicData: [
              { label: '启用', value: 1 },
              { label: '禁用', value: 0 }
            ]
          },
          {
            label: '在线状态',
            prop: 'status',
            search: true,
            type: 'select',
            width: 100,
            dicData: [
              { label: '离线', value: 0 },
              { label: '在线', value: 1 }
            ]
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
    async rowSave(row, done, loading) {
      await add(row)
      this.$message.success('新增成功')
      done()
      this.onLoad(this.page)
    },
    async rowUpdate(row, index, done, loading) {
      await update(row)
      this.$message.success('修改成功')
      done()
      this.onLoad(this.page)
    },
    async rowDel(row, index, done) {
      await this.$confirm('确定删除该平台吗？', '提示', { type: 'warning' })
      await remove(row.id)
      this.$message.success('删除成功')
      done()
    },
    selectionChange(list) {
      this.selectionList = list
    },
    handleLinkChannels(row) {
      this.$router.push({ path: '/nvr/platform/channel', query: { id: row.id } })
    },
    async handlePushCatalog(row) {
      await this.$confirm('确定推送通道到该平台吗？', '提示', { type: 'warning' })
      await pushCatalog(row.id)
      this.$message.success('推送成功')
    }
  }
}
</script>
