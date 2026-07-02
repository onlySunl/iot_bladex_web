<template>
  <el-card shadow="never">
    <template #header>
      <div class="table-header">
        <span>NVR设备列表</span>
        <div>
          <el-button v-if="permission.add" type="primary" icon="el-icon-plus" @click="$emit('edit')">新增设备</el-button>
          <el-button v-if="permission.batch" icon="el-icon-delete" @click="handleBatchClick">批量删除</el-button>
        </div>
      </div>
    </template>

    <el-table
        :data="tableData"
        border
        :loading="loading"
        @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column label="序号" type="index" width="60"></el-table-column>
      <el-table-column label="设备名称" prop="deviceName"></el-table-column>
      <el-table-column label="设备IP" prop="ip"></el-table-column>
      <el-table-column label="端口" prop="port"></el-table-column>
      <el-table-column label="通道总数" prop="channelTotal"></el-table-column>
      <el-table-column label="在线状态" prop="status">
        <template slot-scope="scope">
          <el-tag :type="getStatusTagType(scope.row.status)">
            {{ getStatusLabel(scope.row.status) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" prop="createTime" width="160"></el-table-column>
      <el-table-column label="操作" width="300" fixed="right">
        <template slot-scope="scope">
          <el-button size="mini" type="text" @click="$emit('detail', scope.row)">详情</el-button>
          <el-button v-if="permission.edit" size="mini" type="text" @click="$emit('edit', scope.row)">编辑</el-button>
          <el-button v-if="permission.sync" size="mini" type="text" @click="$emit('sync-channel', scope.row)">同步通道</el-button>
          <el-button v-if="permission.del" size="mini" type="text" danger @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
        class="mt16"
        :current-page="pageInfo.pageNum"
        :page-size="pageInfo.pageSize"
        :total="pageInfo.total"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handlePageSizeChange"
        @current-change="handlePageNumChange"
    />
  </el-card>
</template>

<script>
import { DEVICE_STATUS } from '../js/deviceEnum'
export default {
  name: 'DeviceTable',
  props: {
    tableData: Array,
    loading: Boolean,
    pageInfo: Object,
    permission: Object
  },
  data() {
    return {
      selectedRows: []
    }
  },
  methods: {
    getStatusLabel(status) {
      const item = Object.values(DEVICE_STATUS).find(v => v.value === status)
      return item ? item.label : '未知'
    },
    getStatusTagType(status) {
      const item = Object.values(DEVICE_STATUS).find(v => v.value === status)
      return item ? item.tagType : ''
    },
    handleSelectionChange(val) {
      this.selectedRows = val
    },
    handleBatchClick() {
      const ids = this.selectedRows.map(item => item.id)
      this.$emit('batch-select', ids)
    },
    handleDelete(row) {
      this.$confirm('确定删除该设备？', '提示', { type: 'warning' }).then(() => {
        this.$emit('batch-select', [row.id])
      })
    },
    handlePageSizeChange(size) {
      this.$emit('page-change', { pageNum: 1, pageSize: size })
    },
    handlePageNumChange(page) {
      this.$emit('page-change', { pageNum: page, pageSize: this.pageInfo.pageSize })
    }
  }
}
</script>

<style scoped lang="scss">
.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.mt16 {
  margin-top: 16px;
}
</style>