<template>
  <avue-crud
      v-if="tableOptionReady"
      v-loading="loading"
      :data="deviceList"
      :option="tableOption"
      ref="crud"
      @selection-change="handleSelectionChange"
      @row-save="handleSubmit"
      @row-update="handleUpdate"
      :before-close="beforeClose"
  >
    <!-- 核心：#menu 操作栏插槽，scope.row 获取当前行，完全复用你原来el-table代码 -->
    <template #menu="{ row }">
      <div class="table-actions" style="display:flex;flex-wrap:wrap;gap:4px">
        <!-- 固定外露三个按钮：查看、编辑、删除 -->

        <!-- 更多下拉：存放全部剩余功能 -->
        <el-dropdown
            trigger="click"
            style="margin-left:12px"
            @command="(cmd) => handleMoreAction(cmd, row)"
        >
          <el-button
              type="primary"
              text
              bg
              size="small"
              icon="More"
          >
            更多
            <el-icon class="el-icon--right">
              <ArrowDown/>
            </el-icon>
          </el-button>
          <template #dropdown>
            <el-dropdown-menu class="device-dropdown-menu">
              <!-- 播放 -->
              <el-dropdown-item
                  v-if="row.deviceStatus === 'ON'"
                  command="handlePlay"
                  icon="VideoPlay"
              >播放
              </el-dropdown-item>
              <!-- 停止 -->
              <el-dropdown-item
                  v-if="row.streamStatus === '1' && row.type !== '13'"
                  command="handleStopPlay"
                  icon="SwitchButton"
              >停止
              </el-dropdown-item>
              <!-- 接入地址 -->
              <el-dropdown-item
                  v-if="row.type === '13'"
                  command="handleAccessAddress"
                  icon="Position"
              >接入地址
              </el-dropdown-item>
              <!-- 云端录像 -->
              <el-dropdown-item command="handleCloudRecord" icon="VideoCamera">云端录像</el-dropdown-item>
              <!-- 设备录像 -->
              <el-dropdown-item
                  v-if="!['1','2','3','4','6','13'].includes(row.type)"
                  command="handleDeviceRecord"
                  icon="Monitor"
              >设备录像
              </el-dropdown-item>
              <!-- 刷新 -->
              <el-dropdown-item
                  v-if="row.type === '12'"
                  command="handleRefreshDevice"
                  icon="Refresh"
              >刷新
              </el-dropdown-item>
              <!-- 查看抓图 -->
              <el-dropdown-item command="viewSnapshots" icon="Picture">查看抓图</el-dropdown-item>
              <!-- GB目录订阅 -->
              <el-dropdown-item
                  v-if="row.type === '12' && row.subscribeCatalogStatus !== 1"
                  command="subscribeCatalog"
                  icon="Connection"
                  :disabled="row.deviceStatus !== 'ON'"
              >目录订阅
              </el-dropdown-item>
              <el-dropdown-item
                  v-if="row.type === '12' && row.subscribeCatalogStatus === 1"
                  command="unsubscribeCatalog"
                  icon="SwitchButton"
                  :disabled="row.deviceStatus !== 'ON'"
              >取消目录订阅
              </el-dropdown-item>
              <!-- 校时 -->
              <el-dropdown-item
                  v-if="['5','7','8','9'].includes(row.type)"
                  command="timeSync"
                  icon="Clock"
                  :disabled="row.deviceStatus !== 'ON'"
                  class="time-sync-item"
              >校时
              </el-dropdown-item>
              <!-- 设备信息 -->
              <el-dropdown-item
                  v-if="['5','7','8','9','12','14'].includes(row.type)"
                  command="deviceInfo"
                  icon="InfoFilled"
                  :disabled="row.deviceStatus !== 'ON'"
                  class="time-sync-item"
              >设备信息
              </el-dropdown-item>
              <!-- 抓图 -->
              <el-dropdown-item
                  v-if="['5','7','8','9'].includes(row.type)"
                  command="capture"
                  icon="Camera"
                  :disabled="row.deviceStatus !== 'ON'"
              >抓图
              </el-dropdown-item>
              <!-- 重启 -->
              <el-dropdown-item
                  v-if="['5','7','8','9','12','14'].includes(row.type)"
                  command="reboot"
                  icon="Refresh"
                  :disabled="row.deviceStatus !== 'ON'"
                  class="is-danger"
              >重启
              </el-dropdown-item>
              <!-- GB录像控制 -->
              <el-dropdown-item
                  v-if="row.type === '12'"
                  command="recordControl"
                  icon="VideoCamera"
                  :disabled="row.deviceStatus !== 'ON'"
              >录像控制
              </el-dropdown-item>
              <!-- 设备配置 -->
              <el-dropdown-item
                  v-if="row.type === '12'"
                  command="deviceConfig"
                  icon="Setting"
                  :disabled="row.deviceStatus !== 'ON'"
              >设备配置
              </el-dropdown-item>
              <!-- 录像下载 -->
              <el-dropdown-item
                  v-if="['7','8','9'].includes(row.type)"
                  command="downloadRecord"
                  icon="Download"
                  :disabled="row.deviceStatus !== 'ON'"
              >录像下载
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </template>
  </avue-crud>
</template>

<script setup>
import {addDevice, updateDevice} from '@/api/nvr/qs/device'
import {useDeviceDict} from '@/views/nvr/qs/device/js/useDeviceDict'
import {initTableOption} from '@/views/nvr/qs/device/js/deviceTableColumn'
import {ref} from 'vue'

const tableOptionReady = ref(false)
let tableOption = null
const props = defineProps({
  loading: Boolean,
  deviceList: Array,
  single: Boolean,
  multiple: Boolean,
  viewMode: String,
  dictObject: Object
})

const emit = defineEmits([
  'update:view-mode',
  'add',
  'edit',
  'batch-del',
  'refresh',
  'selectionChange',
  'handleCopy',
  'handleStatusChange',
  'handlePlay',
  'handleStopPlay',
  'handleAccessAddress',
  'handleCloudRecord',
  'handleDeviceRecord',
  'handleRefreshDevice',
  'handleMoreAction'
])

const {
  qs_live_stream_type,
  qs_device_status,
  qs_status,
  qs_stream_type,
  qs_protocol,
  qs_online_type
} = useDeviceDict()
// 直接初始化完整表格配置（包含列+工具栏+分页+搜索等全部配置）
// 模拟异步
const loadOption = async () => {
  // 异步请求/处理逻辑
  tableOption = initTableOption(emit,
      props.dictObject.qs_live_stream_type,
      props.dictObject.qs_device_status,
      props.dictObject.qs_status,
      props.dictObject.qs_stream_type,
      props.dictObject.qs_protocol,
      props.dictObject.qs_online_type)
  tableOptionReady.value = true
}
loadOption()
const handleSelectionChange = val => emit('selectionChange', val)
const handleUpdate = async (row, done, loading) => {
  try {
    loading();
    const res = await updateDevice(row)
    done()
  } catch (err){
    // 捕获异常，不阻塞done，可自行加提示
    console.error(err)
    done()
  }
}
const handleSubmit = async (row, done, loading) => {
  try {
    loading();
    const res = await addDevice(row)
    done()
  } catch (err){
    // 捕获异常，不阻塞done，可自行加提示
    console.error(err)
    done()
  }
}
const beforeClose = (done, type) => {
  done();
};
// 所有操作函数直接emit抛出，无需内部处理
const handleMoreAction = (cmd, row) => {
  switch (cmd) {
    case 'handlePlay':
      emit('handlePlay', row)
      break
    case 'handleStopPlay':
      emit('handleStopPlay', row)
      break
    case 'handleAccessAddress':
      emit('handleAccessAddress', row)
      break
    case 'handleCloudRecord':
      emit('handleCloudRecord', row)
      break
    case 'handleDeviceRecord':
      emit('handleDeviceRecord', row)
      break
    case 'handleRefreshDevice':
      emit('handleRefreshDevice', row)
      break
    case 'viewSnapshots':
    case 'subscribeCatalog':
    case 'unsubscribeCatalog':
    case 'timeSync':
    case 'deviceInfo':
    case 'capture':
    case 'reboot':
    case 'recordControl':
    case 'deviceConfig':
    case 'downloadRecord':
      emit('handleMoreAction', cmd, row)
      break
  }
}
</script>