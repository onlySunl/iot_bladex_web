<template>
  <div class="device-table">
    <el-table
      v-loading="loading"
      :data="deviceList"
      border
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" />
      <el-table-column label="设备名称" prop="deviceName" min-width="150" />
      <el-table-column label="设备ID" prop="deviceId" min-width="150" />
      <el-table-column label="协议" prop="protocol" width="100">
        <template slot-scope="scope">
          {{ getProtocolLabel(scope.row.protocol) }}
        </template>
      </el-table-column>
      <el-table-column label="厂商" prop="vendor" width="100">
        <template slot-scope="scope">
          {{ getVendorLabel(scope.row.vendor) }}
        </template>
      </el-table-column>
      <el-table-column label="在线状态" prop="online" width="100">
        <template slot-scope="scope">
          <el-tag :type="getOnlineStatusType(scope.row.online)">
            {{ getOnlineStatusLabel(scope.row.online) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="推流状态" prop="streamPush" width="100">
        <template slot-scope="scope">
          <el-tag :type="scope.row.streamPush ? 'success' : 'info'">
            {{ scope.row.streamPush ? '推流中' : '未推流' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="IP地址" prop="ip" width="140" />
      <el-table-column label="端口" prop="port" width="80" />
      <el-table-column label="创建时间" prop="createTime" width="160" />
      <el-table-column label="操作" width="300" fixed="right">
        <template slot-scope="scope">
          <el-button size="mini" type="text" @click="$emit('view', scope.row)">
            <i class="el-icon-view"></i> 查看
          </el-button>
          <el-button size="mini" type="text" @click="$emit('edit', scope.row)">
            <i class="el-icon-edit"></i> 编辑
          </el-button>
          <el-button size="mini" type="text" @click="$emit('delete', scope.row)">
            <i class="el-icon-delete"></i> 删除
          </el-button>
          <el-button
            v-if="!scope.row.streamPush"
            size="mini"
            type="text"
            @click="$emit('start-stream', scope.row)"
          >
            <i class="el-icon-video-play"></i> 推流
          </el-button>
          <el-button
            v-else
            size="mini"
            type="text"
            @click="$emit('stop-stream', scope.row)"
          >
            <i class="el-icon-video-pause"></i> 停止
          </el-button>
          <el-button size="mini" type="text" @click="$emit('snapshot', scope.row)">
            <i class="el-icon-camera"></i> 抓图
          </el-button>
          <el-button size="mini" type="text" @click="$emit('ptz', scope.row)">
            <i class="el-icon-aim"></i> 云台
          </el-button>
          <el-button size="mini" type="text" @click="$emit('config', scope.row)">
            <i class="el-icon-setting"></i> 配置
          </el-button>
          <el-button size="mini" type="text" @click="$emit('reboot', scope.row)">
            <i class="el-icon-refresh-right"></i> 重启
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      class="pagination"
      :current-page="pagination.currentPage"
      :page-size="pagination.pageSize"
      :page-sizes="[10, 20, 50, 100]"
      :total="pagination.total"
      layout="total, sizes, prev, pager, next, jumper"
      @size-change="$emit('size-change', $event)"
      @current-change="$emit('page-change', $event)"
    />
  </div>
</template>

<script>
export default {
  name: 'DeviceTable',
  props: {
    deviceList: {
      type: Array,
      default: () => []
    },
    loading: {
      type: Boolean,
      default: false
    },
    selection: {
      type: Array,
      default: () => []
    },
    pagination: {
      type: Object,
      default: () => ({
        currentPage: 1,
        pageSize: 20,
        total: 0
      })
    },
    protocolDict: {
      type: Array,
      default: () => []
    },
    vendorDict: {
      type: Array,
      default: () => []
    },
    onlineStatusMap: {
      type: Object,
      default: () => ({})
    }
  },
  emits: ['selection-change', 'page-change', 'size-change', 'view', 'edit', 'delete', 'start-stream', 'stop-stream', 'snapshot', 'ptz', 'config', 'reboot'],
  methods: {
    handleSelectionChange(val) {
      this.$emit('selection-change', val);
    },
    getProtocolLabel(value) {
      const item = this.protocolDict.find(d => d.value === value);
      return item ? item.label : value;
    },
    getVendorLabel(value) {
      const item = this.vendorDict.find(d => d.value === value);
      return item ? item.label : value;
    },
    getOnlineStatusLabel(value) {
      const status = this.onlineStatusMap[value];
      return status ? status.label : '未知';
    },
    getOnlineStatusType(value) {
      const status = this.onlineStatusMap[value];
      return status ? status.type : 'info';
    }
  }
};
</script>

<style scoped>
.device-table {
  margin-top: 16px;
}
.pagination {
  margin-top: 16px;
  text-align: right;
}
</style>
