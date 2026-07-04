<template>
  <basic-container>
    <!-- ==================== Avue CRUD 主表格 ==================== -->
    <avue-crud
      ref="crudRef"
      v-model:page="page"
      v-model="form"
      :option="crudOption"
      :data="tableData"
      :table-loading="loading"
      :before-open="handleBeforeOpen"
      @search-change="handleSearchChange"
      @search-reset="handleSearchReset"
      @selection-change="handleSelectionChange"
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
      @row-save="handleRowSave"
      @row-update="handleRowUpdate"
      @row-del="handleRowDel"
    >
      <!-- ==================== 搜索区域扩展 ==================== -->
      <template #searchMenuForm>
        <el-form-item>
          <el-button type="primary" @click="handleExport">导出</el-button>
        </el-form-item>
      </template>

      <!-- ==================== 表格菜单扩展 ==================== -->
      <template #menuLeft>
        <el-button type="danger" size="small" @click="handleBatchDelete">批量删除</el-button>
      </template>

      <!-- ==================== 自定义列插槽 ==================== -->
      <!-- 设备名称 -->
      <template #deviceName="{ row }">
        <span>{{ row.deviceName || '-' }}</span>
      </template>

      <!-- 设备编号 -->
      <template #deviceCode="{ row }">
        <span>{{ row.deviceCode || '-' }}</span>
      </template>

      <!-- 接入类型 -->
      <template #type="{ row }">
        <avue-select
          v-model="row.type"
          :dic-data="dict.qs_live_stream_type"
          :dic-props="{ label: 'dictValue', value: 'dictKey' }"
          disabled
          size="small"
        />
      </template>

      <!-- 启用状态 -->
      <template #status="{ row }">
        <avue-switch
          v-model="row.status"
          :active-value="1"
          :inactive-value="0"
          @change="handleStatusChange(row)"
        />
      </template>

      <!-- 码流类型 -->
      <template #streamType="{ row }">
        <avue-select
          v-model="row.streamType"
          :dic-data="dict.qs_stream_type"
          :dic-props="{ label: 'dictValue', value: 'dictKey' }"
          disabled
          size="small"
        />
      </template>

      <!-- 传输协议 -->
      <template #protocol="{ row }">
        <avue-select
          v-model="row.protocol"
          :dic-data="dict.qs_protocol"
          :dic-props="{ label: 'dictValue', value: 'dictKey' }"
          disabled
          size="small"
        />
      </template>

      <!-- 传输模式 -->
      <template #streamMode="{ row }">
        <span>{{ row.streamMode || '-' }}</span>
      </template>

      <!-- 通道号 -->
      <template #channel="{ row }">
        <span>{{ row.channel || row.gbChannelId || '-' }}</span>
      </template>

      <!-- 直播流地址 -->
      <template #liveAddress="{ row }">
        <div v-if="row.liveAddress" style="display: flex; align-items: center; gap: 8px">
          <span style="max-width: 160px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap">
            {{ row.liveAddress }}
          </span>
          <avue-button link type="primary" size="small" @click="handleCopy(row.liveAddress)">复制</avue-button>
        </div>
        <span v-else>-</span>
      </template>

      <!-- 端口 -->
      <template #port="{ row }">
        <span>{{ row.port || '-' }}</span>
      </template>

      <!-- 用户名 -->
      <template #userName="{ row }">
        <span>{{ row.userName || '-' }}</span>
      </template>

      <!-- 密码 -->
      <template #password>
        <span>******</span>
      </template>

      <!-- 设备在线状态 -->
      <template #deviceStatus="{ row }">
        <avue-dict-tag :options="dict.qs_device_status" :value="row.deviceStatus" />
      </template>

      <!-- 上线类型 -->
      <template #onlineType="{ row }">
        <avue-dict-tag :options="dict.qs_online_type" :value="row.onlineType" />
      </template>

      <!-- ==================== 操作列扩展 ==================== -->
      <template #menu="{ row, size }">
        <!-- 播放 -->
        <avue-button
          type="primary"
          text
          :size="size"
          icon="video-play"
          @click="handlePlay(row)"
        >播放</avue-button>

        <!-- 抓图 -->
        <avue-button
          type="primary"
          text
          :size="size"
          icon="camera"
          @click="handleSnapshot(row)"
        >抓图</avue-button>

        <!-- 配置 -->
        <avue-button
          type="primary"
          text
          :size="size"
          icon="setting"
          @click="handleConfig(row)"
        >配置</avue-button>

        <!-- 更多操作下拉菜单 -->
        <avue-dropdown @command="(cmd) => handleCommand(cmd, row)">
          <avue-button type="primary" text :size="size">
            更多<avue-icon icon="arrow-down" style="margin-left: 3px" />
          </avue-button>
          <template #dropdown>
            <avue-dropdown-item command="reboot" icon="refresh-right" :disabled="!canReboot(row)">重启</avue-dropdown-item>
            <avue-dropdown-item command="preset" icon="aim" :disabled="!isGb28181(row)">预置点</avue-dropdown-item>
            <avue-dropdown-item command="ptz" icon="aim" :disabled="!isGb28181(row)">云台控制</avue-dropdown-item>
            <avue-dropdown-item command="timeSync" icon="time" :disabled="!canTimeSync(row)">校时</avue-dropdown-item>
            <avue-dropdown-item command="recordDownload" icon="download" :disabled="!canDownloadRecord(row)">录像下载</avue-dropdown-item>
          </template>
        </avue-dropdown>
      </template>
    </avue-crud>

    <!-- ==================== 播放弹窗 ==================== -->
    <device-player-dialog
      v-model:visible="playerDialogVisible"
      :device="currentDevice"
      :dict="dict"
    />

    <!-- ==================== 配置弹窗 ==================== -->
    <device-config-dialog
      v-model:visible="configDialogVisible"
      :device="currentDevice"
      :dict="dict"
    />

    <!-- ==================== 预置点弹窗 ==================== -->
    <device-preset-dialog
      v-model:visible="presetDialogVisible"
      :device="currentDevice"
    />

    <!-- ==================== 云台控制弹窗 ==================== -->
    <device-ptz-control
      v-model:visible="ptzDialogVisible"
      :device="currentDevice"
    />

    <!-- ==================== 校时弹窗 ==================== -->
    <device-time-sync
      v-model:visible="timeSyncDialogVisible"
      :device="currentDevice"
    />

    <!-- ==================== 录像下载弹窗 ==================== -->
    <device-record-download
      v-model:visible="recordDownloadVisible"
      :device="currentDevice"
    />

    <!-- ==================== 抓图弹窗 ==================== -->
    <device-snapshot-dialog
      v-model:visible="snapshotDialogVisible"
      :device="currentDevice"
    />
  </basic-container>
</template>

<script>
import { mapGetters } from 'vuex'
import { copyText } from 'vue3-clipboard'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  listDevice,
  addDevice,
  updateDevice,
  delDevice,
  changeDeviceStatus,
  startStream,
  stopStream,
  rebootDevice,
  exportQsDevice
} from '@/api/nvr/device'
import { listGroup } from '@/api/nvr/group'
import { getMediaServerList } from '@/api/nvr/zlm'
import { getDictionary } from '@/api/system/dict'

// 导入子组件
import DevicePlayerDialog from './components/DevicePlayerDialog.vue'
import DeviceConfigDialog from './components/DeviceConfigDialog.vue'
import DevicePresetDialog from './components/DevicePresetDialog.vue'
import DevicePtzControl from './components/DevicePtzControl.vue'
import DeviceTimeSync from './components/DeviceTimeSync.vue'
import DeviceRecordDownload from './components/DeviceRecordDownload.vue'
import DeviceSnapshotDialog from './components/DeviceSnapshotDialog.vue'

/**
 * 设备管理页面
 * 使用 Avue CRUD 组件实现，支持：
 * - 表格展示、搜索、分页
 * - 抽屉式新增/编辑表单
 * - 播放、抓图、配置、云台控制等功能
 */
export default {
  name: 'QsDevice',
  components: {
    DevicePlayerDialog,
    DeviceConfigDialog,
    DevicePresetDialog,
    DevicePtzControl,
    DeviceTimeSync,
    DeviceRecordDownload,
    DeviceSnapshotDialog
  },
  data() {
    return {
      // ==================== 表格数据 ====================
      tableData: [],
      loading: false,
      selectedIds: [],
      form: {},

      // ==================== 分页参数 ====================
      page: {
        currentPage: 1,
        pageSize: 20,
        total: 0
      },

      // ==================== 搜索参数 ====================
      searchParams: {
        deviceName: '',
        deviceCode: '',
        type: '',
        status: '',
        deviceStatus: ''
      },

      // ==================== 字典数据 ====================
      dict: {
        qs_live_stream_type: [],
        qs_device_status: [],
        qs_status: [],
        qs_stream_type: [],
        qs_protocol: [],
        qs_online_type: [],
        qs_onvif_auth: []
      },

      // ==================== 分组和媒体服务器 ====================
      groupList: [],
      mediaServerList: [],

      // ==================== 弹窗状态 ====================
      playerDialogVisible: false,
      configDialogVisible: false,
      presetDialogVisible: false,
      ptzDialogVisible: false,
      timeSyncDialogVisible: false,
      recordDownloadVisible: false,
      snapshotDialogVisible: false,
      currentDevice: null,

      // ==================== CRUD 配置 ====================
      crudOption: {
        tip: false,
        simplePage: true,
        searchShow: true,
        searchMenuSpan: 6,
        border: true,
        index: true,
        indexLabel: '序号',
        selection: true,
        viewBtn: true,
        dialogType: 'drawer',
        dialogWidth: '65%',
        dialogHideTitleFlag: false,
        dialogClickModal: false,
        column: []
      }
    }
  },
  computed: {
    ...mapGetters(['permissions'])
  },
  created() {
    this.loadDict()
    this.loadGroupList()
    this.loadMediaServerList()
    this.loadData()
  },
  methods: {
    // ==================== 初始化列配置 ====================
    initColumn() {
      this.crudOption.column = [
        // ==================== 名称 ====================
        {
          label: '名称',
          prop: 'deviceName',
          width: 160,
          align: 'center',
          fixed: 'left',
          type: 'input',
          placeholder: '请输入名称',
          rules: [{ required: true, message: '请输入名称', trigger: 'blur' }],
          search: true,
          searchLabelWidth: 100,
          overHidden: true,
          slot: true
        },
        // ==================== 编号 ====================
        {
          label: '编号',
          prop: 'deviceCode',
          width: 160,
          align: 'center',
          type: 'input',
          placeholder: '请输入编号',
          span: 12,
          search: true,
          overHidden: true,
          slot: true
        },
        // ==================== 接入类型 ====================
        {
          label: '接入类型',
          prop: 'type',
          width: 120,
          align: 'center',
          type: 'select',
          dicData: this.dict.qs_live_stream_type,
          placeholder: '请选择接入类型',
          search: true,
          searchType: 'select',
          overHidden: true,
          slot: true,
          props: { label: 'dictValue', value: 'dictKey' }
        },
        // ==================== 启用状态 ====================
        {
          label: '启用状态',
          prop: 'status',
          width: 110,
          align: 'center',
          type: 'switch',
          activeValue: 1,
          inactiveValue: 0,
          defaultValue: 1,
          dicData: this.dict.qs_status,
          search: true,
          searchType: 'select',
          slot: true
        },
        // ==================== 是否在线（Switch 模式） ====================
        {
          label: '是否在线',
          prop: 'deviceStatus',
          width: 110,
          align: 'center',
          type: 'switch',
          activeValue: 'online',
          inactiveValue: 'offline',
          addDisplay: false,
          editDisplay: false,
          search: true,
          searchType: 'select',
          dicData: this.dict.qs_device_status,
          props: { label: 'dictValue', value: 'dictKey' },
          slot: true
        },
        // ==================== 码流类型 ====================
        {
          label: '码流类型',
          prop: 'streamType',
          width: 110,
          align: 'center',
          type: 'select',
          dicData: this.dict.qs_stream_type,
          placeholder: '请选择码流类型',
          span: 12,
          overHidden: true,
          slot: true,
          props: { label: 'dictValue', value: 'dictKey' }
        },
        // ==================== 传输协议 ====================
        {
          label: '传输协议',
          prop: 'protocol',
          width: 120,
          align: 'center',
          type: 'select',
          dicData: this.dict.qs_protocol,
          placeholder: '请选择传输协议',
          span: 12,
          overHidden: true,
          slot: true,
          props: { label: 'dictValue', value: 'dictKey' }
        },
        // ==================== 传输模式 ====================
        {
          label: '传输模式',
          prop: 'streamMode',
          width: 120,
          align: 'center',
          type: 'select',
          placeholder: '请选择传输模式',
          span: 12,
          overHidden: true,
          slot: true,
          dicData: [
            { label: 'UDP', value: 'UDP' },
            { label: 'TCP被动', value: 'TCP-PASSIVE' }
          ]
        },
        // ==================== 通道号 ====================
        {
          label: '通道号',
          prop: 'channel',
          width: 100,
          align: 'center',
          type: 'input',
          placeholder: '请输入通道号',
          span: 12,
          overHidden: true,
          slot: true
        },
        // ==================== 直播流地址 ====================
        {
          label: '直播流地址',
          prop: 'liveAddress',
          minWidth: 200,
          align: 'center',
          type: 'input',
          placeholder: '请输入直播流地址',
          span: 24,
          overHidden: true,
          slot: true
        },
        // ==================== 安装地址（地图模式） ====================
        {
          label: '安装地址',
          prop: 'address',
          minWidth: 180,
          align: 'center',
          type: 'map',
          placeholder: '请选择安装地址',
          span: 24,
          overHidden: true,
          display: false,
          addDisplay: true,
          editDisplay: true,
          slot: true
        },
        // ==================== 经度（地图模式，仅表单显示） ====================
        {
          label: '经度',
          prop: 'longitude',
          type: 'map',
          span: 12,
          display: false,
          addDisplay: true,
          editDisplay: true,
          hide: true
        },
        // ==================== 纬度（地图模式，仅表单显示） ====================
        {
          label: '纬度',
          prop: 'latitude',
          type: 'map',
          span: 12,
          display: false,
          addDisplay: true,
          editDisplay: true,
          hide: true
        },
        // ==================== 端口（不在表格显示） ====================
        {
          label: '端口',
          prop: 'port',
          hide: true,
          type: 'input',
          span: 12
        },
        // ==================== 用户名（不在表格显示） ====================
        {
          label: '用户名',
          prop: 'userName',
          hide: true,
          type: 'input',
          span: 12
        },
        // ==================== 密码（不在表格显示） ====================
        {
          label: '密码',
          prop: 'password',
          hide: true,
          type: 'password',
          span: 12
        },
        // ==================== 上线类型（不在表格显示） ====================
        {
          label: '上线类型',
          prop: 'onlineType',
          hide: true,
          type: 'select',
          dicData: this.dict.qs_online_type,
          props: { label: 'dictValue', value: 'dictKey' }
        }
      ]
    },

    // ==================== 加载字典数据 ====================
    async loadDict() {
      const keys = ['qs_status', 'qs_live_stream_type', 'qs_stream_type', 'qs_protocol', 'qs_device_status', 'qs_online_type', 'qs_onvif_auth']
      for (const key of keys) {
        try {
          const res = await getDictionary({ code: key })
          this.dict[key] = res.data.data || []
        } catch (e) {
          console.error('loadDict error', e)
          this.dict[key] = []
        }
      }
      // 字典加载完成后初始化列配置
      this.initColumn()
    },

    // ==================== 加载分组列表 ====================
    async loadGroupList() {
      try {
        const res = await listGroup()
        this.groupList = res.data?.records || res.data || []
      } catch (e) {
        console.warn('加载分组列表失败', e)
      }
    },

    // ==================== 加载媒体服务器列表 ====================
    async loadMediaServerList() {
      try {
        const res = await getMediaServerList()
        this.mediaServerList = res.data?.records || res.data || []
      } catch (e) {
        console.warn('加载媒体服务器列表失败', e)
      }
    },

    // ==================== 加载表格数据 ====================
    async loadData() {
      this.loading = true
      try {
        const params = {
          ...this.searchParams,
          pageNum: this.page.currentPage,
          pageSize: this.page.pageSize
        }
        const res = await listDevice(params)
        this.tableData = res.data?.records || res.data || []
        this.page.total = res.total || 0
      } catch (e) {
        console.error('加载设备列表失败', e)
      } finally {
        this.loading = false
      }
    },

    // ==================== 搜索相关 ====================
    handleSearchChange(params, done) {
      this.searchParams = { ...params }
      this.page.currentPage = 1
      this.loadData()
      done()
    },
    handleSearchReset() {
      this.searchParams = {
        deviceName: '',
        deviceCode: '',
        type: '',
        status: '',
        deviceStatus: ''
      }
      this.page.currentPage = 1
      this.loadData()
    },

    // ==================== 分页相关 ====================
    handleCurrentChange(currentPage) {
      this.page.currentPage = currentPage
      this.loadData()
    },
    handleSizeChange(pageSize) {
      this.page.pageSize = pageSize
      this.page.currentPage = 1
      this.loadData()
    },

    // ==================== 选择相关 ====================
    handleSelectionChange(list) {
      this.selectedIds = list.map(item => item.id)
    },

    // ==================== 新增/编辑前处理 ====================
    handleBeforeOpen(done, type) {
      if (type === 'edit') {
        // 编辑时加载详情
        this.form = { ...this.form }
      } else {
        // 新增时重置表单
        this.form = {
          status: 1,
          streamType: 0,
          protocol: 0
        }
      }
      done()
    },

    // ==================== 新增保存 ====================
    async handleRowSave(row, done, loading) {
      try {
        await addDevice(row)
        ElMessage.success('新增成功')
        done()
        this.loadData()
      } catch (e) {
        loading()
        ElMessage.error(e.message || '新增失败')
      }
    },

    // ==================== 编辑更新 ====================
    async handleRowUpdate(newVal, oldVal, done, loading) {
      try {
        await updateDevice({ ...newVal, id: oldVal.id })
        ElMessage.success('修改成功')
        done()
        this.loadData()
      } catch (e) {
        loading()
        ElMessage.error(e.message || '修改失败')
      }
    },

    // ==================== 删除 ====================
    async handleRowDel(row) {
      try {
        await ElMessageBox.confirm('确定删除该设备？删除后无法恢复', '提示', { type: 'warning' })
        await delDevice(row.id)
        ElMessage.success('删除成功')
        this.loadData()
      } catch (e) {
        if (e !== 'cancel') {
          ElMessage.error(e.message || '删除失败')
        }
      }
    },

    // ==================== 批量删除 ====================
    async handleBatchDelete() {
      if (this.selectedIds.length === 0) {
        ElMessage.warning('请选择设备')
        return
      }
      try {
        await ElMessageBox.confirm(`确定删除选中的 ${this.selectedIds.length} 台设备？`, '提示', { type: 'warning' })
        for (const id of this.selectedIds) {
          await delDevice(id)
        }
        ElMessage.success('批量删除成功')
        this.loadData()
      } catch (e) {
        if (e !== 'cancel') {
          ElMessage.error(e.message || '删除失败')
        }
      }
    },

    // ==================== 状态切换 ====================
    async handleStatusChange(row) {
      try {
        await changeDeviceStatus(row.id, row.status)
        ElMessage.success('状态修改成功')
      } catch (e) {
        row.status = row.status === 1 ? 0 : 1
        ElMessage.error(e.message || '状态修改失败')
      }
    },

    // ==================== 导出 ====================
    async handleExport() {
      try {
        const res = await exportQsDevice(this.searchParams)
        const blob = new Blob([res.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
        const url = window.URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = '设备列表.xlsx'
        link.click()
        window.URL.revokeObjectURL(url)
        ElMessage.success('导出成功')
      } catch (e) {
        ElMessage.error(e.message || '导出失败')
      }
    },

    // ==================== 复制 ====================
    handleCopy(text) {
      copyText(text)
      ElMessage.success('复制成功')
    },

    // ==================== 播放 ====================
    handlePlay(row) {
      this.currentDevice = row
      this.playerDialogVisible = true
    },

    // ==================== 抓图 ====================
    handleSnapshot(row) {
      this.currentDevice = row
      this.snapshotDialogVisible = true
    },

    // ==================== 配置 ====================
    handleConfig(row) {
      this.currentDevice = row
      this.configDialogVisible = true
    },

    // ==================== 更多操作 ====================
    async handleCommand(command, row) {
      this.currentDevice = row
      switch (command) {
        case 'reboot':
          await this.handleReboot(row)
          break
        case 'preset':
          this.presetDialogVisible = true
          break
        case 'ptz':
          this.ptzDialogVisible = true
          break
        case 'timeSync':
          this.timeSyncDialogVisible = true
          break
        case 'recordDownload':
          this.recordDownloadVisible = true
          break
      }
    },

    // ==================== 重启设备 ====================
    async handleReboot(row) {
      try {
        await ElMessageBox.confirm('确定重启该设备？', '提示', { type: 'warning' })
        await rebootDevice(row.id)
        ElMessage.success('重启指令已发送')
      } catch (e) {
        if (e !== 'cancel') {
          ElMessage.error(e.message || '重启失败')
        }
      }
    },

    // ==================== 判断方法 ====================
    canReboot(row) {
      return [5, 7, 8, 9, 12, 14].includes(row.type)
    },
    isGb28181(row) {
      return row.type === 5
    },
    canTimeSync(row) {
      return [5, 7, 8, 9].includes(row.type)
    },
    canDownloadRecord(row) {
      return [7, 8, 9].includes(row.type)
    }
  }
}
</script>

<style scoped>
:deep(.avue-crud__menu) {
  display: flex;
  align-items: center;
  gap: 8px;
}
</style>
