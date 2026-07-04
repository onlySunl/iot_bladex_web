<template>
  <basic-container>
    <avue-crud
      :option="option"
      :table-loading="loading"
      :data="data"
      ref="crud"
      v-model="form"
      :page="page"
      :permission="permissionList"
      @row-del="rowDel"
      @search-change="searchChange"
      @search-reset="searchReset"
      @selection-change="selectionChange"
      @current-change="currentChange"
      @size-change="sizeChange"
      @refresh-change="refreshChange"
      @on-load="onLoad"
    >
      <template #menu-left>
        <el-button
          type="warning"
          icon="el-icon-download"
          plain
          @click="handleExport"
        >导出</el-button>
      </template>
      <template #menu="{ row }">
        <el-button
          type="success"
          text
          icon="el-icon-download"
          @click="handleDownload(row)"
        >下载</el-button>
      </template>
      <template #sdkType="{ row }">
        <el-tag v-if="row.sdkType === 'hik'" type="danger">海康</el-tag>
        <el-tag v-else-if="row.sdkType === 'hik_isup'" type="danger">海康ISUP</el-tag>
        <el-tag v-else-if="row.sdkType === 'dahua'" type="warning">大华</el-tag>
        <el-tag v-else-if="row.sdkType === 'uniview'" type="success">宇视</el-tag>
        <el-tag v-else-if="row.sdkType === 'tiandy'" type="info">天地伟业</el-tag>
        <el-tag v-else-if="row.sdkType === 'gb28181'" type="primary">国标28181</el-tag>
        <el-tag v-else>其他</el-tag>
      </template>
      <template #snapshotType="{ row }">
        <el-tag v-if="row.snapshotType === 'manual'" type="success">手动</el-tag>
        <el-tag v-else-if="row.snapshotType === 'alarm'" type="danger">报警</el-tag>
        <el-tag v-else-if="row.snapshotType === 'schedule'" type="warning">定时</el-tag>
        <el-tag v-else-if="row.snapshotType === 'preview'" type="info">预览</el-tag>
      </template>
      <template #fileUrl="{ row }">
        <image-preview v-if="row.fileUrl" :src="row.fileUrl" :width="80" :height="50"/>
      </template>
      <template #fileSize="{ row }">
        {{ formatFileSize(row.fileSize) }}
      </template>
    </avue-crud>
  </basic-container>
</template>

<script>
import { delSnapshot, listSnapshot, exportSnapshot } from '@/api/nvr/snapshot'
import { mapGetters } from 'vuex'
import { downloadXls } from '@/utils/util'

export default {
  name: 'DeviceSnapshot',
  data() {
    return {
      form: {},
      selectionList: [],
      loading: true,
      query: {},
      data: [],
      page: {
        pageSize: 10,
        currentPage: 1,
        total: 0
      },
      option: {
        tip: false,
        simplePage: true,
        searchShow: true,
        searchMenuSpan: 6,
        border: true,
        index: true,
        selection: true,
        viewBtn: true,
        labelWidth: 100,
        dialogClickModal: false,
        column: [
          {
            label: '编号',
            prop: 'id',
            width: 70,
            search: true
          },
          {
            label: '设备编号',
            prop: 'deviceCode',
            search: true
          },
          {
            label: '设备名称',
            prop: 'deviceName',
            search: true,
            overHidden: true
          },
          {
            label: 'SDK类型',
            prop: 'sdkType',
            search: true,
            type: 'select',
            dicData: [
              { label: '海康', value: 'hik' },
              { label: '海康ISUP', value: 'hik_isup' },
              { label: '大华', value: 'dahua' },
              { label: '宇视', value: 'uniview' },
              { label: '天地伟业', value: 'tiandy' },
              { label: '国标28181', value: 'gb28181' },
              { label: '其他', value: 'other' }
            ],
            slot: true
          },
          {
            label: '通道号',
            prop: 'channel'
          },
          {
            label: '截图预览',
            prop: 'fileUrl',
            slot: true
          },
          {
            label: '抓图类型',
            prop: 'snapshotType',
            search: true,
            type: 'select',
            dicData: [
              { label: '手动', value: 'manual' },
              { label: '报警', value: 'alarm' },
              { label: '定时', value: 'schedule' },
              { label: '预览', value: 'preview' }
            ],
            slot: true
          },
          {
            label: '抓图时间',
            prop: 'captureTime',
            search: true,
            searchType: 'daterange',
            type: 'date'
          },
          {
            label: '文件大小',
            prop: 'fileSize',
            slot: true
          },
          {
            label: '文件类型',
            prop: 'fileType'
          }
        ]
      }
    }
  },
  computed: {
    ...mapGetters(['permission']),
    permissionList() {
      return {
        delBtn: true,
        addBtn: false,
        viewBtn: true,
        editBtn: false
      }
    }
  },
  methods: {
    onLoad(page, params = {}) {
      this.loading = true
      const query = {
        ...params,
        pageNum: page.currentPage,
        pageSize: page.pageSize
      }
      listSnapshot(query).then(res => {
        this.data = res.data.records || res.data.rows || []
        this.page.total = res.data.total || 0
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    searchChange(query, done) {
      this.query = query
      this.page.currentPage = 1
      done()
    },
    searchReset() {
      this.query = {}
      this.page.currentPage = 1
    },
    selectionChange(list) {
      this.selectionList = list
    },
    currentChange(currentPage) {
      this.page.currentPage = currentPage
    },
    sizeChange(pageSize) {
      this.page.pageSize = pageSize
    },
    refreshChange() {
      this.onLoad(this.page, this.query)
    },
    rowDel(row) {
      this.$confirm('是否确认删除抓图记录?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        return delSnapshot(row.id)
      }).then(() => {
        this.$message.success('删除成功')
        this.onLoad(this.page, this.query)
      }).catch(() => {})
    },
    handleDownload(row) {
      if (row.fileUrl) {
        const link = document.createElement('a')
        link.href = row.fileUrl
        link.download = row.fileName || row.fileUrl.split('/').pop() || 'snapshot.jpg'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      }
    },
    handleExport() {
      this.$confirm('是否确认导出抓图数据?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        return exportSnapshot(this.query)
      }).then(res => {
        downloadXls(res, `snapshot_${new Date().getTime()}.xlsx`)
      }).catch(() => {})
    },
    formatFileSize(bytes) {
      if (bytes === undefined || bytes === null) return '-'
      if (bytes === 0) return '0 B'
      const k = 1024
      const sizes = ['B', 'KB', 'MB', 'GB']
      const i = Math.floor(Math.log(bytes) / Math.log(k))
      return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
