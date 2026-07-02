<template>
  <div class="table-wrapper">
    <el-table
      v-loading="loading"
      :data="deviceList"
      @selection-change="handleSelectionChange"
      ref="tableRef"
    >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="设备ID" align="center" prop="id" width="80" />
      <el-table-column label="设备名称" align="center" prop="deviceName" :show-overflow-tooltip="true" />
      <el-table-column label="接入类型" align="center" prop="type" width="120">
        <template #default="scope">
          <dict-tag :options="liveStreamTypeDict" :value="scope.row.type" />
        </template>
      </el-table-column>
      <el-table-column label="IP地址" align="center" prop="ipAddress" width="140" />
      <el-table-column label="端口" align="center" prop="port" width="80" />
      <el-table-column label="状态" align="center" prop="status" width="80">
        <template #default="scope">
          <dict-tag :options="statusDict" :value="scope.row.status" />
        </template>
      </el-table-column>
      <el-table-column label="设备状态" align="center" prop="deviceStatus" width="100">
        <template #default="scope">
          <dict-tag :options="deviceStatusDict" :value="scope.row.deviceStatus" />
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center" prop="createTime" width="160">
        <template #default="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="280" fixed="right">
        <template #default="scope">
          <el-button link type="primary" icon="View" @click="handlePlay(scope.row)">播放</el-button>
          <el-button link type="primary" icon="Edit" @click="handleEdit(scope.row)">编辑</el-button>
          <el-button link type="primary" icon="Setting" @click="handleConfig(scope.row)">配置</el-button>
          <el-button link type="danger" icon="Delete" @click="handleDelete(scope.row)">删除</el-button>
          <el-dropdown @command="(cmd) => handleMoreAction(cmd, scope.row)">
            <el-button link type="primary">
              更多<el-icon class="el-icon--right"><arrow-down /></el-icon>
            </el-button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="channel">通道管理</el-dropdown-item>
                <el-dropdown-item command="snapshot">抓图</el-dropdown-item>
                <el-dropdown-item command="cloudRecord">云端录像</el-dropdown-item>
                <el-dropdown-item command="deviceRecord">设备录像</el-dropdown-item>
                <el-dropdown-item command="subscribe">订阅目录</el-dropdown-item>
                <el-dropdown-item command="unsubscribe">取消订阅</el-dropdown-item>
                <el-dropdown-item command="status" divided>状态变更</el-dropdown-item>
                <el-dropdown-item command="accessAddress">接入地址</el-dropdown-item>
                <el-dropdown-item command="mapPosition">地图位置</el-dropdown-item>
                <el-dropdown-item command="jt1078">JT1078参数</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total > 0"
      :total="total"
      v-model:page="queryParams.pageNum"
      v-model:limit="queryParams.pageSize"
      @pagination="handlePageChange"
    />
  </div>
</template>

<script setup lang="ts" name="DeviceTable">
import { ref } from 'vue';
import { ArrowDown } from '@element-plus/icons-vue';

interface QsDevice {
  id: number;
  deviceName: string;
  type: string;
  ipAddress: string;
  port: string;
  status: string;
  deviceStatus: string;
  createTime: string;
  [key: string]: any;
}

interface QueryParams {
  pageNum: number;
  pageSize: number;
  [key: string]: any;
}

interface DictItem {
  label: string;
  value: string;
}

const props = defineProps<{
  loading: boolean;
  deviceList: QsDevice[];
  total: number;
  queryParams: QueryParams;
  liveStreamTypeDict: DictItem[];
  statusDict: DictItem[];
  deviceStatusDict: DictItem[];
}>();

const emit = defineEmits<{
  (e: 'selection-change', selection: QsDevice[]): void;
  (e: 'play', row: QsDevice): void;
  (e: 'edit', row: QsDevice): void;
  (e: 'config', row: QsDevice): void;
  (e: 'delete', row: QsDevice): void;
  (e: 'more-action', command: string, row: QsDevice): void;
  (e: 'page-change'): void;
  (e: 'update:queryParams', value: QueryParams): void;
}>();

const tableRef = ref();

const handleSelectionChange = (selection: QsDevice[]) => {
  emit('selection-change', selection);
};

const handlePlay = (row: QsDevice) => {
  emit('play', row);
};

const handleEdit = (row: QsDevice) => {
  emit('edit', row);
};

const handleConfig = (row: QsDevice) => {
  emit('config', row);
};

const handleDelete = (row: QsDevice) => {
  emit('delete', row);
};

const handleMoreAction = (command: string, row: QsDevice) => {
  emit('more-action', command, row);
};

const handlePageChange = () => {
  emit('page-change');
};

// 解析时间
const parseTime = (time: string | number) => {
  if (!time) return '-';
  const date = new Date(typeof time === 'string' ? time.replace(/-/g, '/') : time);
  if (isNaN(date.getTime())) return String(time);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

defineExpose({
  tableRef
});
</script>

<style scoped lang="scss">
.table-wrapper {
  margin-top: 16px;
}
</style>
