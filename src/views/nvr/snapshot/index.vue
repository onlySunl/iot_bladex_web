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
      <template slot-scope="{ row }" slot="sdkType">
        <el-tag :type="getSdkTypeTag(row.sdkType)" size="small">{{ getSdkTypeLabel(row.sdkType) }}</el-tag>
      </template>
      <template slot-scope="{ row }" slot="snapshotType">
        <el-tag :type="getSnapshotTypeTag(row.snapshotType)" size="small">{{ getSnapshotTypeLabel(row.snapshotType) }}</el-tag>
      </template>
      <template slot-scope="{ row }" slot="snapshotUrl">
        <el-image v-if="row.snapshotUrl" :src="row.snapshotUrl" style="width: 80px; height: 45px;" fit="cover" :preview-src-list="[row.snapshotUrl]" />
        <span v-else>-</span>
      </template>
    </avue-crud>
  </basic-container>
</template>

<script>
import { getList, getDetail, remove } from '@/api/nvr/snapshot'

export default {
  name: 'NvrSnapshot',
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
            width: 150
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
            label: '抓图类型',
            prop: 'snapshotType',
            search: true,
            type: 'select',
            width: 100,
            dicData: [
              { label: '手动', value: 'manual' },
              { label: '报警', value: 'alarm' },
              { label: '定时', value: 'schedule' },
              { label: '预览', value: 'preview' }
            ]
          },
          {
            label: '设备编号',
            prop: 'deviceCode',
            width: 150
          },
          {
            label: '抓图',
            prop: 'snapshotUrl',
            width: 120
          },
          {
            label: '抓图时间',
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
    async rowDel(row, index, done) {
      await this.$confirm('确定删除该条抓图记录吗？', '提示', { type: 'warning' })
      await remove(row.id)
      this.$message.success('删除成功')
      done()
    },
    selectionChange(list) {
      this.selectionList = list
    },
    getSdkTypeTag(type) {
      const map = { hik: 'danger', hik_isup: 'danger', dahua: 'warning', uniview: 'success', tiandy: 'info', gb28181: '' }
      return map[type] || 'info'
    },
    getSdkTypeLabel(type) {
      const map = { hik: '海康', hik_isup: '海康ISUP', dahua: '大华', uniview: '宇视', tiandy: '天地伟业', gb28181: '国标28181', other: '其他' }
      return map[type] || type
    },
    getSnapshotTypeTag(type) {
      const map = { manual: '', alarm: 'danger', schedule: 'warning', preview: 'info' }
      return map[type] || 'info'
    },
    getSnapshotTypeLabel(type) {
      const map = { manual: '手动', alarm: '报警', schedule: '定时', preview: '预览' }
      return map[type] || type
    }
  }
}
</script>
