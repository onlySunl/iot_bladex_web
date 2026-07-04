<template>
  <basic-container>
    <div class="device-management">
      <!-- 搜索表单 -->
      <DeviceSearchForm
        :search-form="searchForm"
        :protocol-dict="protocolDict"
        :vendor-dict="vendorDict"
        :online-status-dict="onlineStatusDict"
        :group-list="groupList"
        @search="handleSearch"
        @reset="handleReset"
        @export="handleExport"
        @add="handleEdit()"
      />

      <!-- 视图切换 -->
      <div class="view-switch">
        <el-radio-group v-model="viewMode" size="small">
          <el-radio-button label="list">
            <i class="el-icon-s-unfold"></i> 列表
          </el-radio-button>
          <el-radio-button label="card">
            <i class="el-icon-s-grid"></i> 卡片
          </el-radio-button>
        </el-radio-group>
      </div>

      <!-- 列表视图 -->
      <DeviceTable
        v-if="viewMode === 'list'"
        :device-list="deviceList"
        :loading="loading"
        :selection="selection"
        :pagination="pagination"
        :protocol-dict="protocolDict"
        :vendor-dict="vendorDict"
        :online-status-map="onlineStatusMap"
        @selection-change="handleSelectionChange"
        @page-change="handlePageChange"
        @size-change="handleSizeChange"
        @view="handleView"
        @edit="handleEdit"
        @delete="handleDelete"
        @start-stream="handleStartStream"
        @stop-stream="handleStopStream"
        @snapshot="handleSnapshot"
        @ptz="handlePtz"
        @config="handleConfig"
        @reboot="handleReboot"
      />

      <!-- 卡片视图 -->
      <DeviceCards
        v-else
        :device-list="deviceList"
        :protocol-dict="protocolDict"
        :vendor-dict="vendorDict"
        :online-status-map="onlineStatusMap"
        @view="handleView"
        @edit="handleEdit"
        @delete="handleDelete"
        @start-stream="handleStartStream"
        @stop-stream="handleStopStream"
        @snapshot="handleSnapshot"
        @ptz="handlePtz"
        @config="handleConfig"
        @reboot="handleReboot"
      />

      <!-- 新增/编辑对话框 -->
      <DeviceFormDialog
        :visible="formDialogVisible"
        :device="currentDevice"
        :media-server-list="mediaServerList"
        :group-list="groupList"
        :protocol-dict="protocolDict"
        :vendor-dict="vendorDict"
        @update:visible="formDialogVisible = $event"
        @submit="handleSubmit"
      />

      <!-- 播放器对话框 -->
      <DevicePlayerDialog
        :visible="playerDialogVisible"
        :device="currentDevice"
        @update:visible="playerDialogVisible = $event"
        @close="handlePlayerClose"
      />

      <!-- 配置对话框 -->
      <DeviceConfigDialog
        ref="configDialogRef"
        :visible="configDialogVisible"
        :device="currentDevice"
        @update:visible="configDialogVisible = $event"
        @add="handleAddConfig"
        @update="handleUpdateConfig"
        @delete="handleDeleteConfig"
      />
    </div>
  </basic-container>
</template>

<script>
import { mapGetters } from 'vuex';
import {
  pageQsDevice,
  addQsDevice,
  updateQsDevice,
  removeQsDevice,
  exportQsDevice,
  startStream,
  stopStream,
  rebootDevice
} from '@/api/nvr/qs/device';
import { pageMediaServer } from '@/api/nvr/zlm/mediaServer';
import { listGroup } from '@/api/nvr/qs/group';
import {
  pageDeviceConfig,
  addDeviceConfig,
  updateDeviceConfig,
  removeDeviceConfig
} from '@/api/nvr/qs/deviceConfig';
import DeviceSearchForm from './components/DeviceSearchForm.vue';
import DeviceTable from './components/DeviceTable.vue';
import DeviceCards from './components/DeviceCards.vue';
import DeviceFormDialog from './components/DeviceFormDialog.vue';
import DevicePlayerDialog from './components/DevicePlayerDialog.vue';
import DeviceConfigDialog from './components/DeviceConfigDialog.vue';

export default {
  name: 'DeviceManagement',
  components: {
    DeviceSearchForm,
    DeviceTable,
    DeviceCards,
    DeviceFormDialog,
    DevicePlayerDialog,
    DeviceConfigDialog
  },
  data() {
    return {
      // 视图模式
      viewMode: 'list',
      // 加载状态
      loading: false,
      // 设备列表
      deviceList: [],
      // 选择项
      selection: [],
      // 当前设备
      currentDevice: undefined,
      // 搜索表单
      searchForm: {
        deviceName: '',
        protocol: '',
        vendor: '',
        status: '',
        groupId: undefined
      },
      // 分页
      pagination: {
        currentPage: 1,
        pageSize: 20,
        total: 0
      },
      // 对话框可见性
      formDialogVisible: false,
      playerDialogVisible: false,
      configDialogVisible: false,
      // 媒体服务器列表
      mediaServerList: [],
      // 分组列表
      groupList: [],
      // 协议字典
      protocolDict: [
        { label: 'GB28181', value: 'gb28181' },
        { label: 'RTSP', value: 'rtsp' },
        { label: 'RTMP', value: 'rtmp' },
        { label: 'ONVIF', value: 'onvif' },
        { label: '海康', value: 'hikvision' },
        { label: '大华', value: 'dahua' },
        { label: '宇视', value: 'uniview' }
      ],
      // 厂商字典
      vendorDict: [
        { label: '海康威视', value: 'hikvision' },
        { label: '大华', value: 'dahua' },
        { label: '宇视', value: 'uniview' },
        { label: '其他', value: 'other' }
      ],
      // 在线状态字典
      onlineStatusDict: [
        { label: '在线', value: '1' },
        { label: '离线', value: '0' }
      ],
      // 在线状态映射
      onlineStatusMap: {
        0: { label: '离线', type: 'info' },
        1: { label: '在线', type: 'success' }
      },
      // 配置对话框引用
      configDialogRef: null
    };
  },
  computed: {
    ...mapGetters(['userInfo'])
  },
  mounted() {
    this.loadData();
    this.loadMediaServers();
    this.loadGroups();
  },
  methods: {
    // 加载设备列表
    async loadData() {
      this.loading = true;
      try {
        const params = {
          ...this.searchForm,
          current: this.pagination.currentPage,
          size: this.pagination.pageSize
        };
        const res = await pageQsDevice(params);
        if (res.data.code === 200) {
          this.deviceList = res.data.data.records || [];
          this.pagination.total = res.data.data.total || 0;
        }
      } catch (error) {
        this.$message.error('加载设备列表失败');
        console.error('加载设备列表失败:', error);
      } finally {
        this.loading = false;
      }
    },

    // 加载媒体服务器
    async loadMediaServers() {
      try {
        const res = await pageMediaServer({ current: 1, size: 1000 });
        if (res.data.code === 200) {
          this.mediaServerList = res.data.data.records || [];
        }
      } catch (error) {
        console.error('加载媒体服务器失败:', error);
      }
    },

    // 加载分组
    async loadGroups() {
      try {
        const res = await listGroup();
        if (res.data.code === 200) {
          this.groupList = res.data.data || [];
        }
      } catch (error) {
        console.error('加载分组失败:', error);
      }
    },

    // 搜索
    handleSearch() {
      this.pagination.currentPage = 1;
      this.loadData();
    },

    // 重置
    handleReset() {
      this.searchForm = {
        deviceName: '',
        protocol: '',
        vendor: '',
        status: '',
        groupId: undefined
      };
      this.handleSearch();
    },

    // 导出
    async handleExport() {
      try {
        const res = await exportQsDevice(this.searchForm);
        if (res) {
          const blob = new Blob([res], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = '设备列表.xlsx';
          link.click();
          window.URL.revokeObjectURL(url);
        }
      } catch (error) {
        this.$message.error('导出失败');
      }
    },

    // 选择变化
    handleSelectionChange(val) {
      this.selection = val;
    },

    // 分页变化
    handlePageChange(page) {
      this.pagination.currentPage = page;
      this.loadData();
    },

    // 每页数量变化
    handleSizeChange(size) {
      this.pagination.pageSize = size;
      this.pagination.currentPage = 1;
      this.loadData();
    },

    // 查看设备
    handleView(device) {
      this.currentDevice = device;
      this.playerDialogVisible = true;
    },

    // 编辑设备
    handleEdit(device) {
      this.currentDevice = device;
      this.formDialogVisible = true;
    },

    // 删除设备
    handleDelete(device) {
      this.$confirm('确定要删除该设备吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        try {
          const res = await removeQsDevice(device.id);
          if (res.data.code === 200) {
            this.$message.success('删除成功');
            this.loadData();
          }
        } catch (error) {
          this.$message.error('删除失败');
        }
      }).catch(() => {});
    },

    // 提交表单
    async handleSubmit(formData) {
      try {
        let res;
        if (formData.id) {
          res = await updateQsDevice(formData);
        } else {
          res = await addQsDevice(formData);
        }
        if (res.data.code === 200) {
          this.$message.success(formData.id ? '修改成功' : '新增成功');
          this.formDialogVisible = false;
          this.loadData();
        }
      } catch (error) {
        this.$message.error('操作失败');
      }
    },

    // 开始推流
    async handleStartStream(device) {
      try {
        const res = await startStream(device.id);
        if (res.data.code === 200) {
          this.$message.success('开始推流');
          this.loadData();
        }
      } catch (error) {
        this.$message.error('开始推流失败');
      }
    },

    // 停止推流
    async handleStopStream(device) {
      try {
        const res = await stopStream(device.id);
        if (res.data.code === 200) {
          this.$message.success('停止推流');
          this.loadData();
        }
      } catch (error) {
        this.$message.error('停止推流失败');
      }
    },

    // 抓图
    handleSnapshot(device) {
      this.$message.info('抓图功能开发中');
    },

    // 云台控制
    handlePtz(device) {
      this.currentDevice = device;
      this.playerDialogVisible = true;
    },

    // 设备配置
    handleConfig(device) {
      this.currentDevice = device;
      this.configDialogVisible = true;
      this.loadDeviceConfigs(device.id);
    },

    // 重启设备
    handleReboot(device) {
      this.$confirm('确定要重启该设备吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        try {
          const res = await rebootDevice(device.id);
          if (res.data.code === 200) {
            this.$message.success('重启指令已发送');
          }
        } catch (error) {
          this.$message.error('重启失败');
        }
      }).catch(() => {});
    },

    // 播放器关闭
    handlePlayerClose() {
      this.playerDialogVisible = false;
      this.currentDevice = undefined;
    },

    // 加载设备配置
    async loadDeviceConfigs(deviceId) {
      try {
        const res = await pageDeviceConfig({ deviceId, current: 1, size: 1000 });
        if (res.data.code === 200) {
          if (this.$refs.configDialogRef) {
            this.$refs.configDialogRef.setConfigList(res.data.data.records || []);
          }
        }
      } catch (error) {
        console.error('加载设备配置失败:', error);
      }
    },

    // 新增配置
    async handleAddConfig(config) {
      try {
        const res = await addDeviceConfig(config);
        if (res.data.code === 200) {
          this.$message.success('新增成功');
        }
      } catch (error) {
        this.$message.error('新增失败');
      }
    },

    // 更新配置
    async handleUpdateConfig(config) {
      try {
        const res = await updateDeviceConfig(config);
        if (res.data.code === 200) {
          this.$message.success('修改成功');
        }
      } catch (error) {
        this.$message.error('修改失败');
      }
    },

    // 删除配置
    async handleDeleteConfig(config) {
      try {
        const res = await removeDeviceConfig(config.id);
        if (res.data.code === 200) {
          this.$message.success('删除成功');
          this.loadDeviceConfigs(this.currentDevice.id);
        }
      } catch (error) {
        this.$message.error('删除失败');
      }
    }
  }
};
</script>

<style scoped lang="scss">
.device-management {
  padding: 20px;
}

.view-switch {
  margin-bottom: 16px;
}
</style>
