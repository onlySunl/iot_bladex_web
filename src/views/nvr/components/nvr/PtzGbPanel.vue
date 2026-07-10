<template>
  <div class="ptz-gb-panel">
    <el-tabs type="card">
      <el-tab-pane label="看守位">
        <el-form label-width="90px" class="form-wrap">
          <el-form-item label="预置点编号">
            <el-input-number v-model="innerHome.presetId" :min="1" :max="255" class="w-full" />
          </el-form-item>
          <el-form-item label="停留时间(秒)">
            <el-input-number v-model="innerHome.dwellTime" :min="0" class="w-full" />
          </el-form-item>
        </el-form>
        <div class="action-btn-group">
          <el-button @click="queryHome" icon="Refresh">查询</el-button>
          <el-button type="success" @click="setHome" icon="Check">设置</el-button>
          <el-button type="warning" @click="callHome" icon="SwitchButton">调用</el-button>
        </div>
      </el-tab-pane>

      <el-tab-pane label="巡航轨迹">
        <el-form label-width="90px" class="form-wrap">
          <el-form-item label="轨迹编号">
            <el-input-number v-model="innerCruise.trackId" :min="0" class="w-full" />
          </el-form-item>
        </el-form>
        <div class="action-btn-group">
          <el-button @click="getCruiseList" icon="Refresh">查询列表</el-button>
          <el-button type="success" @click="getCruiseDetail" icon="Search">查询详情</el-button>
          <el-button type="warning" @click="startCruise" icon="VideoPlay">开始巡航</el-button>
          <el-button type="danger" @click="stopCruise" icon="VideoPause">停止巡航</el-button>
        </div>
        <div v-if="cruiseList.length > 0" class="table-wrap">
          <div class="sub-title">巡航轨迹列表</div>
          <el-table :data="cruiseList" border size="small" width="100%">
            <el-table-column prop="id" label="编号" width="100"/>
            <el-table-column prop="name" label="名称"/>
          </el-table>
        </div>
      </el-tab-pane>

      <el-tab-pane label="精准控制">
        <el-form label-width="90px" class="form-wrap">
          <el-form-item label="水平位置(0-359)">
            <el-input-number v-model="innerPos.pan" :min="0" :max="359" class="w-full" />
          </el-form-item>
          <el-form-item label="垂直位置(0-359)">
            <el-input-number v-model="innerPos.tilt" :min="0" :max="359" class="w-full" />
          </el-form-item>
          <el-form-item label="变倍(0-15)">
            <el-input-number v-model="innerPos.zoom" :min="0" class="w-full" />
          </el-form-item>
        </el-form>
        <div class="action-btn-group">
          <el-button @click="queryPos" icon="Refresh">查询位置</el-button>
          <el-button type="success" @click="setPos" icon="Connection">执行控制</el-button>
        </div>
        <div v-if="currentPos.pan !== undefined" class="desc-wrap">
          <div class="sub-title">当前PTZ位置</div>
          <el-descriptions :column="3" border size="small">
            <el-descriptions-item label="水平">{{ currentPos.pan }}</el-descriptions-item>
            <el-descriptions-item label="垂直">{{ currentPos.tilt }}</el-descriptions-item>
            <el-descriptions-item label="变倍">{{ currentPos.zoom }}</el-descriptions-item>
          </el-descriptions>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup>
import { Refresh, Check, SwitchButton, VideoPlay, VideoPause, Connection } from '@element-plus/icons-vue'
import { ref, defineProps, defineExpose } from 'vue'
// 国标接口全部在子组件引入
import {
  queryHomePresetApi, setHomePresetApi, callHomePresetApi,
  getCruiseListApi, getCruiseDetailApi, startCruiseApi, stopCruiseApi,
  queryPtzPosApi, setPtzPosApi
} from '@/api/nvr/gbPtz'

const props = defineProps({
  deviceId: { type: String, required: true }
})

// 内部表单，不直接修改props
const innerHome = ref({ presetId: 1, dwellTime: 10 })
const innerCruise = ref({ trackId: 0 })
const innerPos = ref({ pan: 0, tilt: 0, zoom: 0 })
const cruiseList = ref([])
const currentPos = ref({})

// 看守位
const queryHome = async () => {
  const res = await queryHomePresetApi(props.deviceId)
  innerHome.value = res.data
}
const setHome = async () => await setHomePresetApi({ deviceId: props.deviceId, ...innerHome.value })
const callHome = async () => await callHomePresetApi({ deviceId: props.deviceId, ...innerHome.value })

// 巡航
const getCruiseList = async () => {
  const res = await getCruiseListApi(props.deviceId)
  cruiseList.value = res.data
}
const getCruiseDetail = async () => await getCruiseDetailApi({ deviceId: props.deviceId, ...innerCruise.value })
const startCruise = async () => await startCruiseApi({ deviceId: props.deviceId, ...innerCruise.value })
const stopCruise = async () => await stopCruiseApi(props.deviceId)

// 精准定位
const queryPos = async () => {
  const res = await queryPtzPosApi(props.deviceId)
  currentPos.value = res.data
  innerPos.value = { ...res.data }
}
const setPos = async () => await setPtzPosApi({ deviceId: props.deviceId, ...innerPos.value })

// 暴露给父组件重置、读取表单
defineExpose({
  resetAll: () => {
    innerHome.value = { presetId: 1, dwellTime: 10 }
    innerCruise.value = { trackId: 0 }
    innerPos.value = { pan: 0, tilt: 0, zoom: 0 }
    cruiseList.value = []
    currentPos.value = {}
  }
})
</script>

<style scoped lang="scss">
.ptz-gb-panel {
  height: 100%;
  :deep(.el-tabs__content) {
    height: calc(100% - 40px);
    overflow-y: auto;
    padding: 10px;
  }
}
.form-wrap { margin-bottom: 16px; }
.action-btn-group {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 16px;
}
.sub-title {
  font-weight: 500;
  margin: 10px 0 8px;
}
.table-wrap, .desc-wrap { margin-top: 10px; }
.w-full { width: 100%; }
</style>