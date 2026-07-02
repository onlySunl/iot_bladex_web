<template>
  <div class="device-management">
    <!-- 搜索表单 -->
    <DeviceSearchForm
      v-model:searchForm="searchForm"
      :protocolDict="protocolDict"
      :vendorDict="vendorDict"
      @search="handleSearch"
      @reset="handleReset"
      @export="handleExport"
      @toggle-view="viewMode = viewMode === 'list' ? 'card' : 'list'"
      :viewMode="viewMode"
    />

    <!-- 列表视图 -->
    <DeviceTable
      v-if="viewMode === 'list'"
      :deviceList="deviceList"
      :loading="loading"
      :selection="selection"
      :protocolDict="protocolDict"
      :vendorDict="vendorDict"
      :onlineStatusMap="onlineStatusMap"
      @selection-change="handleSelectionChange"
      @view="handleView"
      @edit="handleEdit"
      @delete="handleDelete"
      @start-stream="handleStartStream"
      @stop-stream="handleStopStream"
      @snapshot="handleSnapshot"
      @ptz="handlePtz"
      @config="handleConfig"
      @reboot="handleReboot"
      @page-change="handlePageChange"
      @size-change="handleSizeChange"
      :pagination="pagination"
    />

    <!-- 卡片视图 -->
    <DeviceCards
      v-else
      :deviceList="deviceList"
      :loading="loading"
      :protocolDict="protocolDict"
      :vendorDict="vendorDict"
      :onlineStatusMap="onlineStatusMap"
      @view="handleView"
      @edit="handleEdit"
      @delete="handleDelete"
      @start-stream="handleStartStream"
      @stop-stream="handleStopStream"
      @snapshot="handleSnapshot"
      @ptz="handlePtz"
      @config="handleConfig"
      @reboot="handleReboot"
      @page-change="handlePageChange"
      @size-change="handleSizeChange"
      :pagination="pagination"
    />

    <!-- 新增/编辑对话框 -->
    <DeviceFormDialog
      v-model="formDialogVisible"
      :device="currentDevice"
      :protocolDict="protocolDict"
      :vendorDict="vendorDict"
      :mediaServerList="mediaServerList"
      :groupList="groupList"
      @submit="handleSubmit"
    />

    <!-- 视频播放对话框 -->
    <DevicePlayerDialog
      v-model="playerDialogVisible"
      :device="currentDevice"
      @close="handlePlayerClose"
    />

    <!-- 设备配置对话框 -->
    <DeviceConfigDialog
      ref="configDialogRef"
      v-model="configDialogVisible"
      :device="currentDevice"
      @load-configs="loadDeviceConfigs"
      @add-config="handleAddConfig"
      @update-config="handleUpdateConfig"
      @delete-config="handleDeleteConfig"
    />
  </div>
</template>

<script setup lang="ts" name="DeviceManagement">
import { ref, reactive, onMounted, computed } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { saveAs } from 'file-saver';

// 导入子组件
import DeviceSearchForm from './components/DeviceSearchForm.vue';
import DeviceTable from './components/DeviceTable.vue';
import DeviceCards from './components/DeviceCards.vue';
import DeviceFormDialog from './components/DeviceFormDialog.vue';
import DevicePlayerDialog from './components/DevicePlayerDialog.vue';
import DeviceConfigDialog from './components/DeviceConfigDialog.vue';

// 导入 API
import {
  pageQsDevice,
  addQsDevice,
  updateQsDevice,
  removeQsDevice,
  exportQsDevice,
  startStream,
  stopStream,
  rebootDevice,
  pageDeviceConfig,
  addDeviceConfig,
  updateDeviceConfig,
  removeDeviceConfig
} from '@/api/nvr/qs/device';

import { pageMediaServer } from '@/api/nvr/qs/zlm';
import { listGroup } from '@/api/nvr/qs/group';

// 导入工具函数
import { formatCapacity, calculateStoragePercentage, getStorageStatus, getOnlineStatus } from './utils.js';

// 类型定义
interface QsDevice {
  id: number;
  deviceName: string;
  deviceId: string;
  protocol: string;
  vendor: string;
  host: string;
  port: number;
  username: string;
  password: string;
  streamMode: string;
  mediaServerId: string;
  groupId: number;
  status: number;
  storageTotal: number;
  storageUsed: number;
  [key: string]: any;
}

interface DeviceConfig {
  id?: number;
  deviceId?: number;
  configName: string;
  configValue: string;
  remark?: string;
}

interface MediaServer {
  id: number;
  name: string;
  [key: string]: any;
}

interface Group {
  id: number;
  name: string;
  [key: string]: any;
}

// 状态
const loading = ref(false);
const viewMode = ref<'list' | 'card'>('list');
const deviceList = ref<QsDevice[]>([]);
const selection = ref<QsDevice[]>([]);
const currentDevice = ref<QsDevice>();
const formDialogVisible = ref(false);
const playerDialogVisible = ref(false);
const configDialogVisible = ref(false);
const configDialogRef = ref();

// 搜索表单
const searchForm = reactive({
  deviceName: '',
  protocol: '',
  vendor: '',
  status: '',
  groupId: undefined as number | undefined
});

// 分页
const pagination = reactive({
  currentPage: 1,
  pageSize: 20,
  total: 0
});

// 字典数据
const protocolDict = ref([
  { label: 'GB28181', value: 'gb28181' },
  { label: 'ONVIF', value: 'onvif' },
  { label: '海康', value: 'hikvision' },
  { label: '大华', value: 'dahua' },
  { label: '宇视', value: 'uniview' }
]);

const vendorDict = ref([
  { label: '海康威视', value: 'hikvision' },
  { label: '大华', value: 'dahua' },
  { label: '宇视', value: 'uniview' },
  { label: '其他', value: 'other' }
]);

// 媒体服务器列表
const mediaServerList = ref<MediaServer[]>([]);

// 分组列表
const groupList = ref<Group[]>([]);

// 在线状态映射
const onlineStatusMap = computed(() => {
  const map: Record<number, { label: string; type: string }> = {
    0: { label: '离线', type: 'info' },
    1: { label: '在线', type: 'success' }
  };
  return map;
});

// 初始化
onMounted(() => {
  loadData();
  loadMediaServers();
  loadGroups();
});

// 加载设备列表
const loadData = async () => {
  loading.value = true;
  try {
    const params = {
      ...searchForm,
      current: pagination.currentPage,
      size: pagination.pageSize
    };
    const res = await pageQsDevice(params);
    if (res.code === 200) {
      deviceList.value = res.data.records || [];
      pagination.total = res.data.total || 0;
    }
  } catch (error) {
    console.error('加载设备列表失败:', error);
  } finally {
    loading.value = false;
  }
};

// 加载媒体服务器
const loadMediaServers = async () => {
  try {
    const res = await pageMediaServer({ current: 1, size: 1000 });
    if (res.code === 200) {
      mediaServerList.value = res.data.records || [];
    }
  } catch (error) {
    console.error('加载媒体服务器失败:', error);
  }
};

// 加载分组
const loadGroups = async () => {
  try {
    const res = await listGroup();
    if (res.code === 200) {
      groupList.value = res.data || [];
    }
  } catch (error) {
    console.error('加载分组失败:', error);
  }
};

// 搜索
const handleSearch = () => {
  pagination.currentPage = 1;
  loadData();
};

// 重置
const handleReset = () => {
  Object.assign(searchForm, {
    deviceName: '',
    protocol: '',
    vendor: '',
    status: '',
    groupId: undefined
  });
  handleSearch();
};

// 导出
const handleExport = async () => {
  try {
    const res = await exportQsDevice(searchForm);
    if (res) {
      const blob = new Blob([res], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      saveAs(blob, '设备列表.xlsx');
    }
  } catch (error) {
    ElMessage.error('导出失败');
  }
};

// 选择变化
const handleSelectionChange = (val: QsDevice[]) => {
  selection.value = val;
};

// 分页变化
const handlePageChange = (page: number) => {
  pagination.currentPage = page;
  loadData();
};

const handleSizeChange = (size: number) => {
  pagination.pageSize = size;
  pagination.currentPage = 1;
  loadData();
};

// 查看设备
const handleView = (device: QsDevice) => {
  currentDevice.value = device;
  playerDialogVisible.value = true;
};

// 编辑设备
const handleEdit = (device?: QsDevice) => {
  currentDevice.value = device;
  formDialogVisible.value = true;
};

// 删除设备
const handleDelete = (device: QsDevice) => {
  ElMessageBox.confirm('确定要删除该设备吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    try {
      const res = await removeQsDevice(device.id);
      if (res.code === 200) {
        ElMessage.success('删除成功');
        loadData();
      }
    } catch (error) {
      ElMessage.error('删除失败');
    }
  }).catch(() => {});
};

// 提交表单
const handleSubmit = async (formData: QsDevice) => {
  try {
    let res;
    if (formData.id) {
      res = await updateQsDevice(formData);
    } else {
      res = await addQsDevice(formData);
    }
    if (res.code === 200) {
      ElMessage.success(formData.id ? '修改成功' : '新增成功');
      formDialogVisible.value = false;
      loadData();
    }
  } catch (error) {
    ElMessage.error('操作失败');
  }
};

// 开始推流
const handleStartStream = async (device: QsDevice) => {
  try {
    const res = await startStream(device.id);
    if (res.code === 200) {
      ElMessage.success('开始推流');
      loadData();
    }
  } catch (error) {
    ElMessage.error('开始推流失败');
  }
};

// 停止推流
const handleStopStream = async (device: QsDevice) => {
  try {
    const res = await stopStream(device.id);
    if (res.code === 200) {
      ElMessage.success('停止推流');
      loadData();
    }
  } catch (error) {
    ElMessage.error('停止推流失败');
  }
};

// 抓图
const handleSnapshot = (device: QsDevice) => {
  ElMessage.info('抓图功能开发中');
};

// 云台控制
const handlePtz = (device: QsDevice) => {
  currentDevice.value = device;
  playerDialogVisible.value = true;
};

// 设备配置
const handleConfig = (device: QsDevice) => {
  currentDevice.value = device;
  configDialogVisible.value = true;
};

// 重启设备
const handleReboot = (device: QsDevice) => {
  ElMessageBox.confirm('确定要重启该设备吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    try {
      const res = await rebootDevice(device.id);
      if (res.code === 200) {
        ElMessage.success('重启指令已发送');
      }
    } catch (error) {
      ElMessage.error('重启失败');
    }
  }).catch(() => {});
};

// 播放器关闭
const handlePlayerClose = () => {
  playerDialogVisible.value = false;
  currentDevice.value = undefined;
};

// 加载设备配置
const loadDeviceConfigs = async (deviceId: number) => {
  try {
    const res = await pageDeviceConfig({ deviceId, current: 1, size: 1000 });
    if (res.code === 200) {
      configDialogRef.value?.setConfigList(res.data.records || []);
    }
  } catch (error) {
    console.error('加载设备配置失败:', error);
  }
};

// 新增配置
const handleAddConfig = async (config: DeviceConfig) => {
  try {
    const res = await addDeviceConfig(config);
    if (res.code === 200) {
      ElMessage.success('新增成功');
    }
  } catch (error) {
    ElMessage.error('新增失败');
  }
};

// 更新配置
const handleUpdateConfig = async (config: DeviceConfig) => {
  try {
    const res = await updateDeviceConfig(config);
    if (res.code === 200) {
      ElMessage.success('修改成功');
    }
  } catch (error) {
    ElMessage.error('修改失败');
  }
};

// 删除配置
const handleDeleteConfig = async (config: DeviceConfig) => {
  try {
    const res = await removeDeviceConfig(config.id!);
    if (res.code === 200) {
      ElMessage.success('删除成功');
      loadDeviceConfigs(currentDevice.value!.id);
    }
  } catch (error) {
    ElMessage.error('删除失败');
  }
};
</script>

<style scoped lang="scss">
.device-management {
  padding: 20px;
}
</style>
