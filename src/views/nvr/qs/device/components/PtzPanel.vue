<template>
  <div class="ptz-panel">
    <div v-if="!isPtz" class="empty-tip">
      <el-icon class="tip-icon">
        <InfoFilled/>
      </el-icon>
      <p>当前设备不支持云台控制</p>
    </div>
    <div v-else class="ptz-container">
      <!-- 左侧：方向控制 -->
      <div class="ptz-left-panel">
        <div class="ptz-direction-wrapper">
          <div class="control-btn control-top" @mousedown="sendPtz('up')" @mouseup="stopPtz">
            <el-icon class="icon">
              <CaretTop/>
            </el-icon>
            <div class="control-inner-btn control-inner"></div>
          </div>
          <div class="control-btn control-left" @mousedown="sendPtz('left')" @mouseup="stopPtz">
            <el-icon class="icon">
              <CaretLeft/>
            </el-icon>
            <div class="control-inner-btn control-inner"></div>
          </div>
          <div class="control-btn control-bottom" @mousedown="sendPtz('down')" @mouseup="stopPtz">
            <el-icon class="icon">
              <CaretBottom/>
            </el-icon>
            <div class="control-inner-btn control-inner"></div>
          </div>
          <div class="control-btn control-right" @mousedown="sendPtz('right')" @mouseup="stopPtz">
            <el-icon class="icon">
              <CaretRight/>
            </el-icon>
            <div class="control-inner-btn control-inner"></div>
          </div>
          <div class="control-round">
            <div class="control-round-inner"><i class="fa fa-pause-circle"></i></div>
          </div>
          <div class="ptz-speed-slider">
            <el-slider v-model="localControlSpeed" :min="controlSpeedMin" :max="controlSpeedMax"/>
          </div>
        </div>
        <!-- 变倍/聚焦/光圈 -->
        <div class="ptz-zoom-group">
          <div class="ptz-btn-box">
            <div @mousedown="sendPtz('zoomin')" @mouseup="stopPtz" title="变+">
              <el-icon class="control-zoom-btn">
                <ZoomIn/>
              </el-icon>
            </div>
            <div @mousedown="sendPtz('zoomout')" @mouseup="stopPtz" title="变-">
              <el-icon class="control-zoom-btn">
                <ZoomOut/>
              </el-icon>
            </div>
          </div>
          <div class="ptz-btn-box">
            <div @mousedown="sendPtz('near')" @mouseup="stopPtz" title="聚焦+">
              <i class="iconfont icon-bianjiao-fangda control-zoom-btn"></i>
            </div>
            <div @mousedown="sendPtz('far')" @mouseup="stopPtz" title="聚焦-">
              <i class="iconfont icon-bianjiao-suoxiao control-zoom-btn"></i>
            </div>
          </div>
          <div class="ptz-btn-box">
            <div @mousedown="sendPtz('in')" @mouseup="stopPtz" title="光圈+">
              <i class="iconfont icon-guangquan control-zoom-btn"></i>
            </div>
            <div @mousedown="sendPtz('out')" @mouseup="stopPtz" title="光圈-">
              <i class="iconfont icon-guangquan- control-zoom-btn"></i>
            </div>
          </div>
        </div>
      </div>

      <!-- 右侧：功能面板 -->
      <div class="ptz-right-panel">
        <el-tabs type="card" class="ptz-tabs">
          <!-- 预置点 -->
          <el-tab-pane v-if="isPresetSupported" label="预置点">
            <div class="preset-panel">
              <el-select v-model="selectedPresetIndex" placeholder="选择预置点" class="preset-select" clearable
                         @change="handlePresetSelect">
                <el-option v-for="preset in presetList" :key="preset.index"
                           :label="preset.name || `预置点${preset.index}`" :value="preset.index"/>
              </el-select>
              <div class="preset-buttons">
                <el-button type="primary" size="small" @click="handleGotoPreset" :disabled="!selectedPresetIndex">
                  调用
                </el-button>
                <el-button size="small" @click="openSetPresetDialog">设置</el-button>
                <el-button type="danger" size="small" @click="handleDeletePreset" :disabled="!selectedPresetIndex">删除
                </el-button>
              </div>
              <el-button text @click="loadPresetList" class="refresh-btn">
                <el-icon>
                  <Refresh/>
                </el-icon>
                刷新
              </el-button>
            </div>
          </el-tab-pane>

          <!-- 灯光 -->
          <el-tab-pane label="灯光">
            <div class="control-panel">
              <el-button @click="handleLightControl(true)">开灯</el-button>
              <el-button type="danger" @click="handleLightControl(false)">关灯</el-button>
            </div>
          </el-tab-pane>

          <!-- 雨刷 -->
          <el-tab-pane label="雨刷">
            <div class="control-panel">
              <el-button @click="handleWiperControl(true)">开雨刷</el-button>
              <el-button type="danger" @click="handleWiperControl(false)">关雨刷</el-button>
            </div>
          </el-tab-pane>

          <!-- 看守位 -->
          <el-tab-pane v-if="isGb28181Device" label="看守位">
            <el-form :model="homePositionForm" label-width="100px">
              <el-form-item label="预置点编号">
                <el-input-number v-model="homePositionForm.presetId" :min="1" :max="255" class="w-full"/>
              </el-form-item>
              <el-form-item label="停留时间(秒)">
                <el-input-number v-model="homePositionForm.dwellTime" :min="0" class="w-full"/>
              </el-form-item>
            </el-form>
            <div class="button-group mt20">
              <el-button @click="handleQueryHomePosition" icon="Refresh">查询</el-button>
              <el-button type="success" @click="handleSetHomePosition" icon="Check">设置</el-button>
              <el-button type="warning" @click="handleHomePositionControl" icon="SwitchButton">调用</el-button>
            </div>
          </el-tab-pane>

          <!-- 巡航轨迹 -->
          <el-tab-pane v-if="isGb28181Device" label="巡航轨迹">
            <el-form :model="cruiseTrackForm" label-width="100px">
              <el-form-item label="轨迹编号">
                <el-input-number v-model="cruiseTrackForm.trackId" :min="0" class="w-full"/>
              </el-form-item>
            </el-form>
            <div class="button-group mt20">
              <el-button @click="handleQueryCruiseTrackList" icon="Refresh">查询列表</el-button>
              <el-button type="success" @click="handleQueryCruiseTrack" icon="Search">查询详情</el-button>
              <el-button type="warning" @click="handleStartCruise" icon="VideoPlay">开始巡航</el-button>
              <el-button type="danger" @click="handleStopCruise" icon="VideoPause">停止巡航</el-button>
            </div>
            <div v-if="cruiseTrackList.length > 0" class="mt20">
              <div class="panel-section-title">巡航轨迹列表:</div>
              <el-table :data="cruiseTrackList" border size="small" width="100%">
                <el-table-column prop="id" label="编号" width="100"/>
                <el-table-column prop="name" label="名称"/>
              </el-table>
            </div>
          </el-tab-pane>

          <!-- 精准控制 -->
          <el-tab-pane v-if="isGb28181Device" label="精准控制">
            <el-form :model="ptzPreciseForm" label-width="100px">
              <el-form-item label="水平位置(0-359)">
                <el-input-number v-model="ptzPreciseForm.pan" :min="0" :max="359" class="w-full"/>
              </el-form-item>
              <el-form-item label="垂直位置(0-359)">
                <el-input-number v-model="ptzPreciseForm.tilt" :min="0" :max="359" class="w-full"/>
              </el-form-item>
              <el-form-item label="变倍(0-15)">
                <el-input-number v-model="ptzPreciseForm.zoom" :min="0" class="w-full"/>
              </el-form-item>
            </el-form>
            <div class="button-group mt20">
              <el-button @click="handleQueryPTZPosition" icon="Refresh">查询位置</el-button>
              <el-button type="success" @click="handlePtzPreciseControl" icon="Connection">执行控制</el-button>
            </div>
            <div v-if="ptzPosition?.pan !== undefined" class="mt20">
              <div class="panel-section-title">当前PTZ位置:</div>
              <el-descriptions :column="3" border size="small">
                <el-descriptions-item label="水平位置">{{ ptzPosition.pan }}</el-descriptions-item>
                <el-descriptions-item label="垂直位置">{{ ptzPosition.tilt }}</el-descriptions-item>
                <el-descriptions-item label="变倍">{{ ptzPosition.zoom }}</el-descriptions-item>
              </el-descriptions>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </div>
</template>

<script setup>
/**
 * PtzPanel - 云台控制面板
 * 负责云台方向控制、变倍、预置点、灯光、雨刷等功能
 */
import { ref, computed } from 'vue'
import {
  InfoFilled, CaretTop, CaretLeft, CaretBottom, CaretRight,
  ZoomIn, ZoomOut, Refresh, Check, SwitchButton, VideoPlay, VideoPause, Connection
} from '@element-plus/icons-vue'

// Props
const props = defineProps({
  isPtz: { type: Boolean, default: false },
  isPresetSupported: { type: Boolean, default: false },
  isGb28181Device: { type: Boolean, default: false },
  controlSpeed: { type: Number, default: 50 },
  controlSpeedMin: { type: Number, default: 1 },
  controlSpeedMax: { type: Number, default: 100 }
})

// Emits
const emit = defineEmits([
  'update:controlSpeed',
  'ptz', 'stopPtz',
  'loadPresetList', 'presetSelect', 'gotoPreset', 'setPreset', 'deletePreset',
  'lightControl', 'wiperControl',
  'queryHomePosition', 'setHomePosition', 'homePositionControl',
  'queryCruiseTrackList', 'queryCruiseTrack', 'startCruise', 'stopCruise',
  'queryPTZPosition', 'ptzPreciseControl'
])

// 本地速度计算属性
const localControlSpeed = computed({
  get: () => props.controlSpeed,
  set: (val) => emit('update:controlSpeed', val)
})

// 预置点相关
const selectedPresetIndex = ref(null)
const presetList = ref([])
const homePositionForm = ref({ presetId: 1, dwellTime: 10 })
const cruiseTrackForm = ref({ trackId: 0 })
const cruiseTrackList = ref([])
const ptzPreciseForm = ref({ pan: 0, tilt: 0, zoom: 0 })
const ptzPosition = ref({})

// 云台控制
const sendPtz = (cmd) => {
  emit('ptz', { cmd, speed: props.controlSpeed })
}

const stopPtz = () => {
  emit('stopPtz')
}

// 预置点操作
const loadPresetList = () => emit('loadPresetList')
const handlePresetSelect = () => emit('presetSelect', selectedPresetIndex.value)
const handleGotoPreset = () => emit('gotoPreset', selectedPresetIndex.value)
const openSetPresetDialog = () => emit('setPreset', selectedPresetIndex.value)
const handleDeletePreset = () => emit('deletePreset', selectedPresetIndex.value)

// 灯光/雨刷
const handleLightControl = (on) => emit('lightControl', on)
const handleWiperControl = (on) => emit('wiperControl', on)

// 看守位
const handleQueryHomePosition = () => emit('queryHomePosition', homePositionForm.value)
const handleSetHomePosition = () => emit('setHomePosition', homePositionForm.value)
const handleHomePositionControl = () => emit('homePositionControl', homePositionForm.value)

// 巡航轨迹
const handleQueryCruiseTrackList = () => emit('queryCruiseTrackList', cruiseTrackForm.value)
const handleQueryCruiseTrack = () => emit('queryCruiseTrack', cruiseTrackForm.value)
const handleStartCruise = () => emit('startCruise', cruiseTrackForm.value)
const handleStopCruise = () => emit('stopCruise', cruiseTrackForm.value)

// 精准控制
const handleQueryPTZPosition = () => emit('queryPTZPosition')
const handlePtzPreciseControl = () => emit('ptzPreciseControl', ptzPreciseForm.value)

// 暴露数据给父组件
defineExpose({
  presetList,
  selectedPresetIndex,
  homePositionForm,
  cruiseTrackForm,
  cruiseTrackList,
  ptzPreciseForm,
  ptzPosition
})
</script>

<style scoped lang="scss">
.ptz-panel {
  .empty-tip {
    text-align: center;
    padding: 40px;
    color: var(--el-text-secondary);

    .tip-icon {
      font-size: 48px;
      margin-bottom: 16px;
    }
  }

  .ptz-container {
    display: grid;
    grid-template-columns: 240px auto;
    height: 180px;
    overflow: auto;
    gap: 12px;
  }

  .ptz-left-panel {
    display: grid;
    grid-template-columns: 100px auto;
  }

  .ptz-direction-wrapper {
    position: relative;

    .ptz-speed-slider {
      position: absolute;
      left: 4px;
      top: 112px;
      width: 100px;
    }
  }

  .ptz-zoom-group {
    display: flex;
    flex-direction: column;
    gap: 10px;

    .ptz-btn-box {
      display: flex;
      gap: 8px;

      .control-zoom-btn {
        font-size: 20px;
        cursor: pointer;
        padding: 4px;
        border-radius: 4px;
        transition: background-color 0.2s;

        &:hover {
          background-color: var(--el-fill-color-light);
        }
      }
    }
  }

  .ptz-right-panel {
    .ptz-tabs {
      height: 100%;
    }

    .preset-panel {
      display: flex;
      flex-direction: column;
      gap: 10px;

      .preset-select {
        width: 100%;
      }

      .preset-buttons {
        display: flex;
        gap: 8px;
      }

      .refresh-btn {
        align-self: flex-start;
      }
    }

    .control-panel {
      display: flex;
      gap: 10px;
      padding: 10px 0;
    }

    .button-group {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
    }

    .panel-section-title {
      font-weight: bold;
      margin-bottom: 8px;
      color: var(--el-text-primary);
    }
  }

  .mt20 {
    margin-top: 20px;
  }

  .w-full {
    width: 100%;
  }
}
</style>
