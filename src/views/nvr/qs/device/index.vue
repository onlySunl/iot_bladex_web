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
        <el-tag size="small">{{ getAccessTypeLabel(row.type) }}</el-tag>
      </template>

      <!-- 启用状态 -->
      <template #status="{ row }">
        <el-switch
          :model-value="row.status == 1"
          @change="(val) => handleStatusChange(row, val)"
        />
      </template>

      <!-- 是否在线 -->
      <template #deviceStatus="{ row }">
        <el-tag :type="row.deviceStatus === 1 ? 'success' : 'danger'" size="small">
          {{ row.deviceStatus === 1 ? '在线' : '离线' }}
        </el-tag>
      </template>

      <!-- 码流类型 -->
      <template #streamType="{ row }">
        <el-tag size="small">{{ getStreamTypeLabel(row.streamType) }}</el-tag>
      </template>

      <!-- 传输协议 -->
      <template #protocol="{ row }">
        <el-tag size="small">{{ getProtocolLabel(row.protocol) }}</el-tag>
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
          <el-button type="primary" text size="small" @click="handleCopy(row.liveAddress)">复制</el-button>
        </div>
        <span v-else>-</span>
      </template>

      <!-- 安装地址 -->
      <template #address="{ row }">
        <div v-if="row.address" style="display: flex; align-items: center; gap: 4px">
          <el-icon size="14" color="#409eff"><location /></el-icon>
          <span style="max-width: 140px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap">
            {{ row.address }}
          </span>
        </div>
        <span v-else>-</span>
      </template>

      <!-- ==================== 表单插槽 ==================== -->
      <!-- 启用状态表单插槽 -->
      <template #statusForm="{ row }">
        <el-switch
          v-model="row.status"
          :active-value="1"
          :inactive-value="0"
          active-text="启用"
          inactive-text="禁用"
        />
      </template>

      <!-- 安装地址表单插槽 -->
      <template #addressForm="{ row }">
        <el-input v-model="row.address" placeholder="请输入安装地址" readonly>
          <template #append>
            <el-button @click="openMapSelect">
              <el-icon><location /></el-icon>地图选点
            </el-button>
          </template>
        </el-input>
      </template>

      <!-- ==================== 操作列 ==================== -->
      <!-- 使用 menu 插槽完全控制操作列 -->
      <template #menu="{ row, size }">
          <!-- 更多操作下拉菜单 -->
          <el-dropdown @command="(cmd) => handleCommand(cmd, row)" trigger="click">
            <el-button type="primary" text :size="size">
              更多<el-icon style="margin-left: 3px"><arrow-down /></el-icon>
            </el-button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="play">播放</el-dropdown-item>
                <el-dropdown-item command="snapshot">抓图</el-dropdown-item>
                <el-dropdown-item command="config">配置</el-dropdown-item>
                <el-dropdown-item command="reboot" :disabled="!canReboot(row)">重启</el-dropdown-item>
                <el-dropdown-item command="preset" :disabled="!isGb28181(row)">预置点</el-dropdown-item>
                <el-dropdown-item command="ptz" :disabled="!isGb28181(row)">云台控制</el-dropdown-item>
                <el-dropdown-item command="timeSync" :disabled="!canTimeSync(row)">校时</el-dropdown-item>
                <el-dropdown-item command="recordDownload" :disabled="!canDownloadRecord(row)">录像下载</el-dropdown-item>

              </el-dropdown-menu>
            </template>
          </el-dropdown>
      </template>
    </avue-crud>

    <!-- ==================== 弹窗组件 ==================== -->
    <DevicePlayerDialog
      v-model="playerDialogVisible"
      :device="currentDevice"
      :dict="dict"
      @close="playerDialogVisible = false"
    />

    <DeviceConfigDialog
      v-model="configDialogVisible"
      :device="currentDevice"
      @close="configDialogVisible = false"
    />

    <DevicePresetDialog
      v-model="presetDialogVisible"
      :device="currentDevice"
      @close="presetDialogVisible = false"
    />

    <DevicePtzControl
      v-model="ptzDialogVisible"
      :device="currentDevice"
      @close="ptzDialogVisible = false"
    />

    <DeviceTimeSync
      v-model="timeSyncDialogVisible"
      :device="currentDevice"
      @close="timeSyncDialogVisible = false"
    />

    <DeviceRecordDownload
      v-model="recordDownloadVisible"
      :device="currentDevice"
      @close="recordDownloadVisible = false"
    />

    <DeviceSnapshotDialog
      v-model="snapshotDialogVisible"
      :device="currentDevice"
      @close="snapshotDialogVisible = false"
    />

    <!-- ==================== 地图选点弹窗 ==================== -->
    <SelectMapPosition
      ref="selectMapPositionRef"
      @onSubmit="handleMapSelect"
    />
  </basic-container>
</template>

<script setup>
/**
 * 设备管理页面 - Vue 3 Composition API
 * 使用 Avue CRUD 组件实现，支持：
 * - 表格展示、搜索、分页
 * - 抽屉式新增/编辑表单
 * - 播放、抓图、配置、云台控制等功能
 */
import { ref, reactive, computed, onMounted, nextTick } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { mapGetters } from 'vuex'
import { copyText } from 'vue3-clipboard'
import {
  pageQsDevice,
  addQsDevice,
  updateQsDevice,
  removeQsDevice,
  changeDeviceStatus,
  rebootDevice,
  exportQsDevice
} from '@/api/nvr/device'
import { listGroup } from '@/api/nvr/group'
import { getMediaServerList, streamPullPlay, stopStreamPullPlay } from '@/api/nvr/zlm'
import { getDictionary } from '@/api/system/dict'

// 导入子组件
import DevicePlayerDialog from './components/DevicePlayerDialog.vue'
import DeviceConfigDialog from './components/DeviceConfigDialog.vue'
import DevicePresetDialog from './components/DevicePresetDialog.vue'
import DevicePtzControl from './components/DevicePtzControl.vue'
import DeviceTimeSync from './components/DeviceTimeSync.vue'
import DeviceRecordDownload from './components/DeviceRecordDownload.vue'
import DeviceSnapshotDialog from './components/DeviceSnapshotDialog.vue'
import SelectMapPosition from '@/components/nvr/SelectMapPosition/index.vue'

// 导入图标
import { ArrowDown, Location } from '@element-plus/icons-vue'

// ==================== Refs ====================
const crudRef = ref(null)
const selectMapPositionRef = ref(null)

// ==================== 表格数据 ====================
const tableData = ref([])
const loading = ref(false)
const selectedIds = ref([])
const form = ref({})

// ==================== 分页参数 ====================
const page = reactive({
  currentPage: 1,
  pageSize: 20,
  total: 0
})

// ==================== 搜索参数 ====================
const searchParams = reactive({
  deviceName: '',
  deviceCode: '',
  type: '',
  status: '',
  deviceStatus: ''
})

// ==================== 字典数据 ====================
const dict = reactive({
  qs_live_stream_type: [],
  qs_device_status: [],
  qs_status: [],
  qs_stream_type: [],
  qs_protocol: [],
  qs_online_type: [],
  qs_onvif_auth: []
})

// ==================== 分组和媒体服务器 ====================
const groupList = ref([])
const mediaServerList = ref([])

// ==================== 弹窗状态 ====================
const playerDialogVisible = ref(false)
const configDialogVisible = ref(false)
const presetDialogVisible = ref(false)
const ptzDialogVisible = ref(false)
const timeSyncDialogVisible = ref(false)
const recordDownloadVisible = ref(false)
const snapshotDialogVisible = ref(false)
const currentDevice = ref(null)

// ==================== 地图选点状态 ====================
const mapSelectVisible = ref(false)

// ==================== CRUD 配置 ====================
const crudOption = reactive({
  tip: false,
  simplePage: true,
  searchShow: true,
  searchMenuSpan: 6,
  border: false,
  stripe: true,
  index: false,
  selection: true,
  viewBtn: true,
  dialogType: 'drawer',
  dialogWidth: '60%',
  dialogHideTitleFlag: false,
  dialogClickModal: false,
  size: 'small',
  header: true,
  refreshBtn: true,
  menuWidth:320,
  column: []
})

// ==================== 初始化列配置 ====================
const initColumn = () => {
  crudOption.column = [
    // ==================== 名称 ====================
    {
      label: '名称',
      prop: 'deviceName',
      width: 140,
      align: 'center',
      fixed: 'left',
      type: 'input',
      placeholder: '请输入名称',
      rules: [{ required: true, message: '请输入名称', trigger: 'blur' }],
      search: true,
      searchLabelWidth: 80,
      overHidden: true
    },
    // ==================== 编号 ====================
    {
      label: '编号',
      prop: 'deviceCode',
      width: 140,
      align: 'center',
      type: 'input',
      placeholder: '请输入编号',
      span: 12,
      search: true,
      overHidden: true
    },
    // ==================== 接入类型 ====================
    {
      label: '接入类型',
      prop: 'type',
      width: 100,
      align: 'center',
      type: 'select',
      dicData: dict.qs_live_stream_type,
      placeholder: '请选择接入类型',
      search: true,
      searchType: 'select',
      overHidden: true,
      props: { label: 'dictValue', value: 'dictKey' },
      change: handleAccessTypeChange
    },
    // ==================== 启用状态 ====================
    {
      label: '启用状态',
      prop: 'status',
      width: 90,
      align: 'center',
      type: 'switch',
      activeValue: 1,
      inactiveValue: 0,
      defaultValue: 1,
      dicData: dict.qs_status,
      search: true,
      searchType: 'select',
      props: { label: 'dictValue', value: 'dictKey' }
    },
    // ==================== 是否在线 ====================
    {
      label: '是否在线',
      prop: 'deviceStatus',
      width: 90,
      align: 'center',
      type: 'switch',
      activeValue: 1,
      inactiveValue: 0,
      dicData: dict.qs_device_status,
      search: true,
      searchType: 'select',
      props: { label: 'dictValue', value: 'dictKey' }
    },
    // ==================== 码流类型 ====================
    {
      label: '码流类型',
      prop: 'streamType',
      width: 90,
      align: 'center',
      type: 'select',
      dicData: dict.qs_stream_type,
      overHidden: true,
      props: { label: 'dictValue', value: 'dictKey' }
    },
    // ==================== 传输协议 ====================
    {
      label: '传输协议',
      prop: 'protocol',
      width: 100,
      align: 'center',
      type: 'select',
      dicData: dict.qs_protocol,
      props: { label: 'dictValue', value: 'dictKey' }
    },
    // ==================== 传输模式 ====================
    {
      label: '传输模式',
      prop: 'streamMode',
      width: 100,
      align: 'center',
      overHidden: true
    },
    // ==================== 通道号 ====================
    {
      label: '通道号',
      prop: 'channel',
      width: 80,
      align: 'center',
      overHidden: true,
      defaultValue: 1
    },
    // ==================== 直播流地址 ====================
    {
      label: '直播流地址',
      prop: 'liveAddress',
      width: 180,
      align: 'center',
      overHidden: true
    },
    // ==================== 安装地址（地图模式） ====================
    {
      label: '安装地址',
      prop: 'address',
      type: 'map',
      width: 160,
      align: 'center',
      hide: true,
      overHidden: true,
      span: 24,
      addDisplay: true,
      editDisplay: true
    },
    // ==================== 经度 ====================
    {
      label: '经度',
      prop: 'longitude',
      type: 'map',
      hide: true,
      span: 12,
      addDisplay: true,
      editDisplay: true
    },
    // ==================== 纬度 ====================
    {
      label: '纬度',
      prop: 'latitude',
      type: 'map',
      hide: true,
      span: 12,
      addDisplay: true,
      editDisplay: true
    },
    // ==================== 端口（不在表格显示） ====================
    {
      label: '端口',
      prop: 'port',
      type: 'input',
      hide: true,
      display: false
    },
    // ==================== 用户名（不在表格显示） ====================
    {
      label: '用户名',
      prop: 'username',
      type: 'input',
      hide: true,
      display: false
    },
    // ==================== 密码（不在表格显示） ====================
    {
      label: '密码',
      prop: 'password',
      type: 'input',
      hide: true,
      display: false
    },
    // ==================== 上线类型（不在表格显示） ====================
    {
      label: '上线类型',
      prop: 'onlineType',
      type: 'select',
      dicData: dict.qs_online_type,
      hide: true,
      display: false,
      props: { label: 'dictValue', value: 'dictKey' }
    }
  ]
}

// ==================== 加载字典数据 ====================
const loadDict = async () => {
  const dictKeys = ['qs_live_stream_type', 'qs_device_status', 'qs_status', 'qs_stream_type', 'qs_protocol', 'qs_online_type', 'qs_onvif_auth']
  for (const key of dictKeys) {
    try {
      const res = await getDictionary({code:key})
      dict[key] = res.data?.data || []
    } catch (e) {
      console.warn(`加载字典 ${key} 失败`, e)
    }
  }
  initColumn()
}

// ==================== 加载分组列表 ====================
const loadGroupList = async () => {
  try {
    const res = await listGroup({})
    groupList.value = res.data.data || []
  } catch (e) {
    console.warn('加载分组列表失败', e)
  }
}

// ==================== 加载媒体服务器列表 ====================
const loadMediaServerList = async () => {
  try {
    const res = await getMediaServerList({})
    mediaServerList.value = res.data.data || []
  } catch (e) {
    console.warn('加载媒体服务器列表失败', e)
  }
}

// ==================== 加载表格数据 ====================
const loadData = async () => {
  loading.value = true
  try {
    const params = {
      ...searchParams,
      current: page.currentPage,
      size: page.pageSize
    }
    const res = await pageQsDevice(params)
    tableData.value = res.data.records || []
    page.total = res.data.total || 0
  } catch (e) {
    ElMessage.error(e.message || '加载数据失败')
  } finally {
    loading.value = false
  }
}

// ==================== 搜索 ====================
const handleSearchChange = (params, done) => {
  Object.assign(searchParams, params)
  page.currentPage = 1
  loadData()
  done()
}

const handleSearchReset = () => {
  Object.assign(searchParams, {
    deviceName: '',
    deviceCode: '',
    type: '',
    status: '',
    deviceStatus: ''
  })
  page.currentPage = 1
  loadData()
}

// ==================== 分页 ====================
const handleCurrentChange = (current) => {
  page.currentPage = current
  loadData()
}

const handleSizeChange = (size) => {
  page.pageSize = size
  page.currentPage = 1
  loadData()
}

// ==================== 选择 ====================
const handleSelectionChange = (list) => {
  selectedIds.value = list.map(item => item.id)
}

// ==================== 新增/编辑前处理 ====================
const handleBeforeOpen = (done, type) => {
  if (type === 'edit') {
    form.value = { ...form.value }
  } else {
    form.value = {
      status: 1,
      streamType: 0,
      protocol: 0
    }
  }
  done()
}

// ==================== 新增保存 ====================
const handleRowSave = async (row, done, loading) => {
  try {
    await addQsDevice(row)
    ElMessage.success('新增成功')
    done()
    loadData()
  } catch (e) {
    loading()
    ElMessage.error(e.message || '新增失败')
  }
}

// ==================== 编辑更新 ====================
const handleRowUpdate = async (newVal, oldVal, done, loading) => {
  try {
    await updateQsDevice({ ...newVal, id: oldVal.id })
    ElMessage.success('修改成功')
    done()
    loadData()
  } catch (e) {
    loading()
    ElMessage.error(e.message || '修改失败')
  }
}

// ==================== 删除 ====================
const handleRowDel = async (row) => {
  try {
    await ElMessageBox.confirm('确定删除该设备？删除后无法恢复', '提示', { type: 'warning' })
    await removeQsDevice(row.id)
    ElMessage.success('删除成功')
    loadData()
  } catch (e) {
    if (e !== 'cancel') {
      ElMessage.error(e.message || '删除失败')
    }
  }
}

// ==================== 批量删除 ====================
const handleBatchDelete = async () => {
  if (selectedIds.value.length === 0) {
    ElMessage.warning('请选择设备')
    return
  }
  try {
    await ElMessageBox.confirm(`确定删除选中的 ${selectedIds.value.length} 台设备？`, '提示', { type: 'warning' })
    for (const id of selectedIds.value) {
      await removeQsDevice(id)
    }
    ElMessage.success('批量删除成功')
    loadData()
  } catch (e) {
    if (e !== 'cancel') {
      ElMessage.error(e.message || '删除失败')
    }
  }
}

// ==================== 状态切换 ====================
const handleStatusChange = async (row, val) => {
  const newStatus = val ? 1 : 0
  try {
    await changeDeviceStatus(row.id, newStatus)
    row.status = newStatus
    ElMessage.success('状态修改成功')
  } catch (e) {
    ElMessage.error(e.message || '状态修改失败')
  }
}

// ==================== 导出 ====================
const handleExport = async () => {
  try {
    const res = await exportQsDevice(searchParams)
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
}

// ==================== 复制 ====================
const handleCopy = (text) => {
  copyText(text)
  ElMessage.success('复制成功')
}

// ==================== 播放 ====================
const handlePlay = (row) => {
  currentDevice.value = row
  playerDialogVisible.value = true
}

// ==================== 抓图 ====================
const handleSnapshot = (row) => {
  currentDevice.value = row
  snapshotDialogVisible.value = true
}

// ==================== 配置 ====================
const handleConfig = (row) => {
  currentDevice.value = row
  configDialogVisible.value = true
}

// ==================== 编辑 ====================
const handleUpdate = (row) => {
  crudRef.value?.rowInit(row)
}

// ==================== 查看 ====================
const handleView = (row) => {
  crudRef.value?.rowInit(row, 'view')
}

// ==================== 删除单条 ====================
const handleDelete = async (row) => {
  await handleRowDel(row)
}

// ==================== 打开地图选点 ====================
const openMapSelect = () => {
  mapSelectVisible.value = true
  nextTick(() => {
    if (selectMapPositionRef.value) {
      selectMapPositionRef.value.openDialog({
        lat: form.value.latitude,
        lng: form.value.longitude
      })
    }
  })
}

// ==================== 地图选点回调 ====================
const handleMapSelect = (data) => {
  if (data && data.lat && data.lng) {
    form.value.latitude = data.lat
    form.value.longitude = data.lng
    if (data.address) {
      form.value.address = data.address
    }
  }
  mapSelectVisible.value = false
}

// ==================== 接入类型标签 ====================
const getAccessTypeLabel = (type) => {
  const typeMap = {
    1: 'RTSP',
    2: 'RTMP',
    3: 'HTTP-FLV',
    4: 'HLS',
    5: 'GB28181',
    6: 'JT1078'
  }
  return typeMap[type] || '-'
}

// ==================== 码流类型标签 ====================
// ==================== 接入类型变更处理 ====================
const handleAccessTypeChange = (value, column, formData) => {
  // 根据接入类型自动生成直播流地址模板
  const ip = formData.ip || '127.0.0.1'
  const port = formData.port || getDefaultPort(value)
  const stream = formData.stream || 'stream'
  const channelId = formData.channel || 1

  let streamAddress = ''
  switch (String(value)) {
    case '1': // RTSP
      streamAddress = `rtsp://${ip}:${port}/${stream}`
      break
    case '2': // RTMP
      streamAddress = `rtmp://${ip}:${port}/${stream}`
      break
    case '3': // HTTP-FLV
      streamAddress = `http://${ip}:${port}/${stream}.flv`
      break
    case '4': // HLS
      streamAddress = `http://${ip}:${port}/${stream}/hls.m3u8`
      break
    case '5': // GB28181
      streamAddress = `gb28181://${channelId}`
      break
    case '6': // JT1078
      streamAddress = `jt1078://${formData.phone || ''}:${channelId}`
      break
    default:
      streamAddress = ''
  }

  // 更新表单中的直播流地址
  if (formData) {
    formData.liveAddress = streamAddress
  }
}

// 获取默认端口
const getDefaultPort = (type) => {
  switch (String(type)) {
    case '1': return 554 // RTSP
    case '2': return 1935 // RTMP
    case '3': return 8080 // HTTP-FLV
    case '4': return 8080 // HLS
    case '5': return 5060 // GB28181
    case '6': return 1078 // JT1078
    default: return 80
  }
}

const getStreamTypeLabel = (type) => {
  const item = dict.qs_stream_type.find(d => d.dictKey === String(type))
  return item ? item.dictValue : '-'
}

// ==================== 传输协议标签 ====================
const getProtocolLabel = (protocol) => {
  const item = dict.qs_protocol.find(d => d.dictKey === String(protocol))
  return item ? item.dictValue : '-'
}

// ==================== 更多操作 ====================
const handleCommand = async (command, row) => {
  currentDevice.value = row
  switch (command) {
    case 'play':
      handlePlay(row)
      break
    case 'snapshot':
      handleSnapshot(row)
      break
    case 'config':
      handleConfig(row)
      break
    case 'edit':
      handleUpdate(row)
      break
    case 'view':
      handleView(row)
      break
    case 'delete':
      await handleDelete(row)
      break
    case 'reboot':
      await handleReboot(row)
      break
    case 'preset':
      presetDialogVisible.value = true
      break
    case 'ptz':
      ptzDialogVisible.value = true
      break
    case 'timeSync':
      timeSyncDialogVisible.value = true
      break
    case 'recordDownload':
      recordDownloadVisible.value = true
      break
  }
}

// ==================== 重启设备 ====================
const handleReboot = async (row) => {
  try {
    await ElMessageBox.confirm('确定重启该设备？', '提示', { type: 'warning' })
    await rebootDevice(row.id)
    ElMessage.success('重启指令已发送')
  } catch (e) {
    if (e !== 'cancel') {
      ElMessage.error(e.message || '重启失败')
    }
  }
}
// 设置菜单宽度

// ==================== 判断方法 ====================
const canReboot = (row) => [5, 7, 8, 9, 12, 14].includes(row.type)
const isGb28181 = (row) => row.type === 5
const canTimeSync = (row) => [5, 7, 8, 9].includes(row.type)
const canDownloadRecord = (row) => [7, 8, 9].includes(row.type)

// ==================== 初始化 ====================
onMounted(() => {
  loadDict()
  //loadGroupList()
  loadMediaServerList()
  loadData()
  //setMenuWidth()
})
</script>

<style scoped>
/* 紧凑布局样式 */
:deep(.avue-crud) {
  font-size: 13px;
}

:deep(.avue-crud .el-table) {
  font-size: 13px;
}

:deep(.avue-crud .el-table th) {
  padding: 6px 0;
  font-size: 13px;
}

:deep(.avue-crud .el-table td) {
  padding: 6px 0;
}

:deep(.avue-crud .el-table .cell) {
  padding: 0 8px;
}

:deep(.avue-crud .el-form-item) {
  margin-bottom: 12px;
}

:deep(.avue-crud__menu .el-button) {
  padding: 4px 8px;
  font-size: 12px;
}

:deep(.avue-crud__dialog) {
  padding: 12px;
}

:deep(.basic-container__card) {
  margin: 0;
}

:deep(.basic-container) {
  padding: 8px;
}

/* 搜索区域紧凑 */
:deep(.avue-crud__search) {
  padding: 12px 16px;
}

/* 分页紧凑 */
:deep(.avue-crud__pagination) {
  padding: 8px 16px;
}

/* 下拉菜单紧凑 */
:deep(.el-dropdown-menu__item) {
  padding: 6px 12px;
  font-size: 13px;
}
</style>
