<template>
  <basic-container>
    <!-- Avue CRUD 主表格 -->
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
      <!-- 操作列下拉 -->
      <template #menu="{ row, size }">
        <el-dropdown @command="(cmd) => handleCommand(cmd, row)" trigger="click">
          <el-button type="primary" text :size="size">
            更多
            <el-icon style="margin-left: 3px"><arrow-down/></el-icon>
          </el-button>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="play" v-if="row.deviceStatus =='ONLINE'">播放</el-dropdown-item>
              <el-dropdown-item command="record" v-if="row.deviceStatus =='ONLINE'">回放</el-dropdown-item>
<!--              <el-dropdown-item command="snapshot">抓图</el-dropdown-item>
              <el-dropdown-item command="config">配置</el-dropdown-item>-->
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

    <!-- 视频播放弹窗组件（移除无效ref） -->
    <DevicePlayerDialog v-model:easy-player-open="playerDialogVisible" :device-row="currentDevice"/>
    <DeviceConfigDialog v-model="configDialogVisible" :device="currentDevice" @close="configDialogVisible = false"/>
    <DevicePresetDialog v-model="presetDialogVisible" :device="currentDevice" @close="presetDialogVisible = false"/>
    <DevicePtzControl v-model="ptzDialogVisible" :device="currentDevice" @close="ptzDialogVisible = false"/>
    <DeviceTimeSync v-model="timeSyncDialogVisible" :device="currentDevice" @close="timeSyncDialogVisible = false"/>
    <DeviceRecordDownload v-model="recordDownloadVisible" :device="currentDevice" @close="recordDownloadVisible = false"/>
    <DeviceSnapshotDialog v-model="snapshotDialogVisible" :device="currentDevice" @close="snapshotDialogVisible = false"/>
    <DeviceRecordDialog v-model="recordDialogVisible"  :device-row="currentDevice" @close="recordDialogVisible = false"></DeviceRecordDialog>
    <!-- 地图选点弹窗 -->
    <SelectMapPosition ref="selectMapPositionRef" @onSubmit="handleMapSelect"/>
  </basic-container>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue'
import { ArrowDown, Location } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

// 组件导入
import DevicePlayerDialog from './components/DevicePlayerDialog.vue'
import DeviceConfigDialog from './components/DeviceConfigDialog.vue'
import DevicePresetDialog from './components/DevicePresetDialog.vue'
import DevicePtzControl from './components/DevicePtzControl.vue'
import DeviceTimeSync from './components/DeviceTimeSync.vue'
import DeviceRecordDownload from './components/DeviceRecordDownload.vue'
import DeviceSnapshotDialog from './components/DeviceSnapshotDialog.vue'
import DeviceRecordDialog from './components/DeviceRecordDialog.vue'
import SelectMapPosition from '@/components/nvr/SelectMapPosition/index.vue'


// 业务hooks
import { useDeviceDict } from './hooks/useDeviceDict'
import { useDeviceTable } from './hooks/useDeviceTable'
import { useDeviceDialog } from './hooks/useDeviceDialog'
import { useDeviceStream } from './hooks/useDeviceStream'
import { useDeviceAction } from './hooks/useDeviceAction'

const crudRef = ref(null)

// 实例化hooks
const dictHook = useDeviceDict()
const tableHook = useDeviceTable()
const dialogHook = useDeviceDialog(tableHook.form)
const streamHook = useDeviceStream(dictHook.mediaServerList)
const actionHook = useDeviceAction(tableHook, dialogHook)

// 解构变量与方法
const { dict, groupList, mediaServerList, loadDict, loadGroupList, loadMediaServerList } = dictHook
const { tableData, loading, selectedIds, form, page, searchParams, loadData, handleSearchChange, handleSearchReset, handleCurrentChange, handleSizeChange, handleSelectionChange, handleBeforeOpen, handleRowSave, handleRowUpdate, handleRowDel, handleStatusChange } = tableHook
const { selectMapPositionRef, playerDialogVisible, configDialogVisible, presetDialogVisible, ptzDialogVisible, timeSyncDialogVisible, recordDownloadVisible, snapshotDialogVisible, currentDevice, mapSelectVisible, openMapSelect, handleMapSelect, handlePlay, handleSnapshot, handleConfig,recordDialogVisible } = dialogHook
const { handleAccessTypeChange } = streamHook
const { handleCommand, handleReboot, handleBatchDelete, handleExport, handleCopy, handleUpdate, handleView, canReboot, isGb28181, canTimeSync, canDownloadRecord } = actionHook

// CRUD列配置
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
  menuWidth: 320,
  column: []
})

const initColumn = () => {
  crudOption.column = [
    { label: '名称', prop: 'deviceName', width: 140, align: 'center', fixed: 'left', type: 'input', placeholder: '请输入名称', rules: [{required: true, message: '请输入名称', trigger: 'blur'}], search: true, searchLabelWidth: 80, overHidden: true },
    { label: '编号', prop: 'deviceCode', width: 140, align: 'center', type: 'input', placeholder: '请输入编号', span: 12, search: true, overHidden: true },
    { label: '启用状态', prop: 'status', width: 90, align: 'center', type: 'radio', activeValue: "1", inactiveValue: "0", defaultValue: "1", dicData: dict.qs_status, search: true, searchType: 'select', props: {label: 'dictValue', value: 'dictKey'} },
    { label: '是否在线', prop: 'deviceStatus', width: 90, align: 'center', type: 'radio', activeValue: "1", inactiveValue: "0", defaultValue: "0", dicData: dict.qs_device_status, search: true, searchType: 'select', props: {label: 'dictValue', value: 'dictKey'} },
    { label: '码流类型', prop: 'streamType', width: 90, align: 'center', type: 'select', dicData: dict.qs_stream_type, overHidden: true, props: {label: 'dictValue', value: 'dictKey'} },
    { label: '传输协议', prop: 'protocol', width: 100, align: 'center', type: 'select', dicData: dict.qs_protocol, props: {label: 'dictValue', value: 'dictKey'} },
    { label: '传输模式', prop: 'streamMode', type: 'select', width: 100, align: 'center', overHidden: true, dicData: dict.qs_stream_mode, props: {label: 'dictValue', value: 'dictKey'} },
    { label: '通道号', prop: 'channel', width: 80, align: 'center', overHidden: true, defaultValue: 1 },
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
      props: {label: 'dictValue', value: 'dictKey'},
      control: (value, formData) => handleAccessTypeChange(value, null, formData)
    },
    { label: '直播流地址', prop: 'liveAddress', width: 180, align: 'center', span: 24, overHidden: true },
    { label: '安装地址', prop: 'address', type: 'map', width: 160, align: 'center', hide: true, overHidden: true, span: 24, addDisplay: true, editDisplay: true },
    { label: '经度', prop: 'longitude', type: 'map', hide: true, span: 12, addDisplay: true, editDisplay: true },
    { label: '纬度', prop: 'latitude', type: 'map', hide: true, span: 12, addDisplay: true, editDisplay: true },
    { label: '端口', prop: 'port', type: 'input', hide: true, display: false },
    { label: '用户名', prop: 'username', type: 'input', hide: true, display: false },
    { label: '密码', prop: 'password', type: 'input', hide: true, display: false },
    { label: '上线类型', prop: 'onlineType', type: 'select', dicData: dict.qs_online_type, hide: true, display: false, props: {label: 'dictValue', value: 'dictKey'} }
  ]
}

// 页面初始化
onMounted(async () => {
  await loadDict()
  initColumn()
  loadMediaServerList()
  loadData()
})
</script>

<style scoped>
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
:deep(.avue-crud__search) {
  padding: 12px 16px;
}
:deep(.avue-crud__pagination) {
  padding: 8px 16;
}
:deep(.el-dropdown-menu__item) {
  padding: 6px 12px;
  font-size: 13px;
}
</style>