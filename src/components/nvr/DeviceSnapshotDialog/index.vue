<template>
  <el-dialog :visible.sync="visible" :title="title" width="70%" append-to-body destroy-on-close>
    <div class="search-box">
      <el-form :model="queryParams" ref="queryRef" :inline="true" label-width="68px">
        <el-form-item label="抓图类型" prop="snapshotType">
          <el-select v-model="queryParams.snapshotType" placeholder="请选择" clearable style="width: 200px">
            <el-option label="手动" value="manual" />
            <el-option label="报警" value="alarm" />
            <el-option label="定时" value="schedule" />
            <el-option label="预览" value="preview" />
          </el-select>
        </el-form-item>
        <el-form-item label="抓图时间">
          <el-date-picker
            v-model="dateRange"
            type="daterange"
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="handleQuery">搜索</el-button>
          <el-button icon="el-icon-refresh" @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-form>
      <el-row :gutter="10" class="mb8">
        <el-col :span="1.5">
          <el-button type="danger" plain icon="el-icon-delete" :disabled="multiple" @click="handleDelete">删除</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button type="warning" plain icon="el-icon-download" @click="handleExport">导出</el-button>
        </el-col>
      </el-row>
    </div>
    <el-table v-loading="loading" :data="snapshotList" @selection-change="handleSelectionChange" highlight-current-row>
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="编号" align="center" prop="id" width="70" />
      <el-table-column label="截图预览" align="center" prop="fileUrl">
        <template slot-scope="scope">
          <image-preview v-if="scope.row.fileUrl" :src="scope.row.fileUrl" :width="80" :height="50" />
        </template>
      </el-table-column>
      <el-table-column label="设备编号" align="center" prop="deviceId" />
      <el-table-column label="通道编号" align="center" prop="channelId" />
      <el-table-column label="类型" align="center" prop="snapshotType">
        <template slot-scope="scope">
          <span v-if="scope.row.snapshotType === 'manual'">手动</span>
          <span v-else-if="scope.row.snapshotType === 'alarm'">报警</span>
          <span v-else-if="scope.row.snapshotType === 'schedule'">定时</span>
          <span v-else-if="scope.row.snapshotType === 'preview'">预览</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center" prop="createTime" width="160" />
      <el-table-column label="操作" align="center" width="150">
        <template slot-scope="scope">
          <el-button size="mini" type="text" icon="el-icon-view" @click="handlePreview(scope.row)">预览</el-button>
          <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDeleteSingle(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryParams.pageNum"
      :page-sizes="[10, 20, 50]"
      :page-size="queryParams.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    />
  </el-dialog>
</template>

<script>
import { getSnapshotList, deleteSnapshot } from '@/api/nvr/snapshot'
import ImagePreview from '@/components/nvr/ImagePreview/index.vue'

export default {
  name: 'DeviceSnapshotDialog',
  components: { ImagePreview },
  props: {
    deviceId: { type: String, default: '' },
    channelId: { type: String, default: '' }
  },
  data: function () {
    return {
      visible: false,
      title: '设备抓图',
      loading: false,
      multiple: true,
      showSearch: true,
      ids: [],
      snapshotList: [],
      total: 0,
      dateRange: [],
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        deviceId: '',
        channelId: '',
        snapshotType: undefined
      }
    }
  },
  methods: {
    open: function () {
      this.visible = true
      this.queryParams.deviceId = this.deviceId
      this.queryParams.channelId = this.channelId
      this.getList()
    },
    getList: function () {
      this.loading = true
      var params = Object.assign({}, this.queryParams)
      if (this.dateRange && this.dateRange.length === 2) {
        params.beginTime = this.dateRange[0]
        params.endTime = this.dateRange[1]
      }
      getSnapshotList(params).then(function (res) {
        this.snapshotList = res.data.records || []
        this.total = res.data.total || 0
        this.loading = false
      }.bind(this))
    },
    handleQuery: function () {
      this.queryParams.pageNum = 1
      this.getList()
    },
    resetQuery: function () {
      this.dateRange = []
      this.$refs.queryRef.resetFields()
      this.handleQuery()
    },
    handleSelectionChange: function (selection) {
      this.ids = selection.map(function (item) { return item.id })
      this.multiple = !selection.length
    },
    handleSizeChange: function (val) {
      this.queryParams.pageSize = val
      this.getList()
    },
    handleCurrentChange: function (val) {
      this.queryParams.pageNum = val
      this.getList()
    },
    handlePreview: function (row) {
      if (row.fileUrl) {
        window.open(row.fileUrl)
      }
    },
    handleDeleteSingle: function (row) {
      this.$confirm('确认删除该抓图记录?', '提示', { type: 'warning' }).then(function () {
        return deleteSnapshot(row.id)
      }).then(function () {
        this.getList()
        this.$message.success('删除成功')
      }.bind(this)).catch(function () {})
    },
    handleDelete: function () {
      var ids = this.ids
      this.$confirm('确认删除选中的抓图记录?', '提示', { type: 'warning' }).then(function () {
        return deleteSnapshot(ids.join(','))
      }).then(function () {
        this.getList()
        this.$message.success('删除成功')
      }.bind(this)).catch(function () {})
    },
    handleExport: function () {
      this.$message.info('导出功能开发中')
    }
  }
}
</script>

<style lang="scss" scoped>
.search-box { margin-bottom: 15px; }
.mb8 { margin-bottom: 8px; }
</style>
