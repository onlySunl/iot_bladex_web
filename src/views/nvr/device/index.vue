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
      <template slot-scope="{ row }" slot="sdkType">
        <el-tag :type="getSdkTypeTag(row.sdkType)" size="small">{{ getSdkTypeLabel(row.sdkType) }}</el-tag>
      </template>
      <template slot-scope="{ row }" slot="online">
        <el-tag :type="row.online === 1 ? 'success' : 'danger'" size="small" effect="dark">{{ row.online === 1 ? '在线' : '离线' }}</el-tag>
      </template>
      <template slot-scope="{ row }" slot="menu">
        <el-button size="small" type="primary" icon="el-icon-video-play" v-if="row.online === 1" @click="handlePlay(row)">播放</el-button>
        <el-button size="small" type="info" icon="el-icon-picture" @click="handleSnapshot(row)">抓图</el-button>
        <el-button size="small" type="warning" icon="el-icon-refresh" v-if="row.online === 1" @click="handleRefresh(row)">刷新</el-button>
        <el-button size="small" type="danger" icon="el-icon-video-pause" v-if="row.online === 1" @click="handleStop(row)">停止</el-button>
      </template>
    </avue-crud>
  </basic-container>
</template>

<script>
import { getList, getDetail, add, update, remove, getDeviceStatistics, captureAndSave, refreshDevice, rebootDevice, stopDevice, startDevice } from '@/api/qs/device'

export default {
  name: 'NvrDevice',
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
            label: '设备名称',
            prop: 'deviceName',
            search: true,
            rules: [{ required: true, message: '请输入设备名称', trigger: 'blur' }]
          },
          {
            label: '设备编号',
            prop: 'deviceCode',
            search: true,
            rules: [{ required: true, message: '请输入设备编号', trigger: 'blur' }]
          },
          {
            label: 'SDK类型',
            prop: 'sdkType',
            search: true,
            type: 'select',
            width: 120,
            dicData: [
              { label: '海康', value: 'hik' },
              { label: '海康ISUP', value: 'hik_isup' },
              { label: '大华', value: 'dahua' },
              { label: '宇视', value: 'uniview' },
              { label: '天地伟业', value: 'tiandy' },
              { label: '国标28181', value: 'gb28181' },
              { label: '其他', value: 'other' }
            ]
          },
          {
            label: '设备IP',
            prop: 'deviceIp',
            width: 140
          },
          {
            label: '设备端口',
            prop: 'devicePort',
            width: 100
          },
          {
            label: '在线状态',
            prop: 'online',
            search: true,
            type: 'select',
            width: 100,
            dicData: [
              { label: '离线', value: 0 },
              { label: '在线', value: 1 }
            ]
          },
          {
            label: '分组名称',
            prop: 'groupName',
            width: 120
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
      await this.$confirm('确定删除该设备吗？', '提示', { type: 'warning' })
      await remove(row.id)
      this.$message.success('删除成功')
      done()
      this.onLoad(this.page)
    },
    selectionChange(list) {
      this.selectionList = list
    },
    handlePlay(row) {
      this.$router.push({ path: '/nvr/live', query: { deviceId: row.id, sdkType: row.sdkType } })
    },
    async handleSnapshot(row) {
      await this.$confirm('确定对该设备进行抓图吗？', '提示', { type: 'warning' })
      await captureAndSave(row.id, null, 'manual')
      this.$message.success('抓图成功')
    },
    async handleRefresh(row) {
      await this.$confirm('确定刷新该设备吗？', '提示', { type: 'warning' })
      await refreshDevice(row.id)
      this.$message.success('刷新成功')
      this.onLoad(this.page)
    },
    async handleStop(row) {
      await this.$confirm('确定停止该设备吗？', '提示', { type: 'warning' })
      await stopDevice(row.id)
      this.$message.success('停止成功')
      this.onLoad(this.page)
    },
    getSdkTypeTag(type) {
      const map = { hik: 'danger', hik_isup: 'danger', dahua: 'warning', uniview: 'success', tiandy: 'info', gb28181: '' }
      return map[type] || 'info'
    },
    getSdkTypeLabel(type) {
      const map = { hik: '海康', hik_isup: '海康ISUP', dahua: '大华', uniview: '宇视', tiandy: '天地伟业', gb28181: '国标28181', other: '其他' }
      return map[type] || type
    }
  }
}
</script>
