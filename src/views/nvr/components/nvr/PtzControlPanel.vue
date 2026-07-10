<template>
  <div>
    <div v-if="!isPtzEnable" class="empty-tip">
      <el-icon class="tip-icon">
        <InfoFilled/>
      </el-icon>
      <p>当前设备不支持云台控制</p>
    </div>
    <div v-else>
      <el-row :gutter="12">
        <el-col :span="8">
          <div class="ptz-direction-wrapper">
            <!-- 罗盘十字布局 -->
            <div class="ptz-compass">
              <div class="control-btn control-top" @mousedown="sendPtz('up')" @mouseup="stopPtz">
                <el-icon class="icon"><CaretTop/></el-icon>
              </div>
              <div class="middle-row">
                <div class="control-btn control-left" @mousedown="sendPtz('left')" @mouseup="stopPtz">
                  <el-icon class="icon"><CaretLeft/></el-icon>
                </div>
                <div class="control-round">
                  <div class="control-round-inner">
                    <i class="fa fa-pause-circle"></i>
                  </div>
                </div>
                <div class="control-btn control-right" @mousedown="sendPtz('right')" @mouseup="stopPtz">
                  <el-icon class="icon"><CaretRight/></el-icon>
                </div>
              </div>
              <div class="control-btn control-bottom" @mousedown="sendPtz('down')" @mouseup="stopPtz">
                <el-icon class="icon"><CaretBottom/></el-icon>
              </div>
            </div>
            <!-- 云台速度滑块 -->
            <div class="ptz-speed-slider">
              <span>云台速度：</span>
              <el-slider v-model="controlSpeed" :min="controlSpeedMin" :max="controlSpeedMax"/>
            </div>
          </div>
          <div class="ptz-zoom-group mt15">
            <el-row :gutter="8">
              <el-col :span="12">
                <div @mousedown="sendPtz('zoomin')" @mouseup="stopPtz" title="变+">
                  <el-icon class="control-zoom-btn"><ZoomIn/></el-icon>
                </div>
              </el-col>
              <el-col :span="12">
                <div @mousedown="sendPtz('zoomout')" @mouseup="stopPtz" title="变-">
                  <el-icon class="control-zoom-btn"><ZoomOut/></el-icon>
                </div>
              </el-col>
            </el-row>
            <el-row :gutter="8" class="mt10">
              <el-col :span="12">
                <div @mousedown="sendPtz('near')" @mouseup="stopPtz" title="聚焦+">
                  <i class="iconfont icon-bianjiao-fangda control-zoom-btn"></i>
                </div>
              </el-col>
              <el-col :span="12">
                <div @mousedown="sendPtz('far')" @mouseup="stopPtz" title="聚焦-">
                  <i class="iconfont icon-bianjiao-suoxiao control-zoom-btn"></i>
                </div>
              </el-col>
            </el-row>
            <el-row :gutter="8" class="mt10">
              <el-col :span="12">
                <div @mousedown="sendPtz('in')" @mouseup="stopPtz" title="光圈+">
                  <i class="iconfont icon-guangquan control-zoom-btn"></i>
                </div>
              </el-col>
              <el-col :span="12">
                <div @mousedown="sendPtz('out')" @mouseup="stopPtz" title="光圈-">
                  <i class="iconfont icon-guangquan- control-zoom-btn"></i>
                </div>
              </el-col>
            </el-row>
          </div>
        </el-col>
        <el-col :span="16">
          <el-tabs type="card">
            <el-tab-pane v-if="isPresetSupported" label="预置点">
              <el-row>
                <el-col :span="24">
                  <el-select v-model="selectedPresetIndex" placeholder="选择预置点" clearable @change="handlePresetSelect">
                    <el-option v-for="preset in presetList" :key="preset.index"
                               :label="preset.name || `预置点${preset.index}`" :value="preset.index"></el-option>
                  </el-select>
                </el-col>
              </el-row>
              <el-row class="mt10">
                <el-col :span="8">
                  <el-button type="primary" size="small" @click="handleGotoPreset" :disabled="!selectedPresetIndex">调用</el-button>
                </el-col>
                <el-col :span="8">
                  <el-button size="small" @click="openSetPresetDialog">设置</el-button>
                </el-col>
                <el-col :span="8">
                  <el-button type="danger" size="small" @click="handleDeletePreset" :disabled="!selectedPresetIndex">删除</el-button>
                </el-col>
              </el-row>
              <el-row class="mt10">
                <el-col :span="24">
                  <el-button text @click="loadPresetList">
                    <el-icon><Refresh/></el-icon>刷新
                  </el-button>
                </el-col>
              </el-row>
            </el-tab-pane>
            <el-tab-pane label="灯光">
              <el-row :gutter="10">
                <el-col :span="12">
                  <el-button @click="handleLightControl(true)">开灯</el-button>
                </el-col>
                <el-col :span="12">
                  <el-button type="danger" @click="handleLightControl(false)">关灯</el-button>
                </el-col>
              </el-row>
            </el-tab-pane>
            <el-tab-pane label="雨刷">
              <el-row :gutter="10">
                <el-col :span="12">
                  <el-button @click="handleWiperControl(true)">开雨刷</el-button>
                </el-col>
                <el-col :span="12">
                  <el-button type="danger" @click="handleWiperControl(false)">关雨刷</el-button>
                </el-col>
              </el-row>
            </el-tab-pane>
            <el-tab-pane v-if="isGb28181Device" label="看守位">
              <el-form :model="homePositionForm" label-width="100px">
                <el-row>
                  <el-col :span="24">
                    <el-form-item label="预置点编号">
                      <el-input-number v-model="homePositionForm.presetId" :min="1" :max="255" class="w-full"></el-input-number>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="24">
                    <el-form-item label="停留时间(秒)">
                      <el-input-number v-model="homePositionForm.dwellTime" :min="0" class="w-full"></el-input-number>
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-form>
              <el-row :gutter="8">
                <el-col :span="8">
                  <el-button @click="handleQueryHomePosition"><el-icon><Refresh/></el-icon>查询</el-button>
                </el-col>
                <el-col :span="8">
                  <el-button type="success" @click="handleSetHomePosition"><el-icon><Check/></el-icon>设置</el-button>
                </el-col>
                <el-col :span="8">
                  <el-button type="warning" @click="handleHomePositionControl"><el-icon><SwitchButton/></el-icon>调用</el-button>
                </el-col>
              </el-row>
            </el-tab-pane>
            <el-tab-pane v-if="isGb28181Device" label="巡航轨迹">
              <el-form :model="cruiseTrackForm" label-width="100px">
                <el-row>
                  <el-col :span="24">
                    <el-form-item label="轨迹编号">
                      <el-input-number v-model="cruiseTrackForm.trackId" :min="0" class="w-full"></el-input-number>
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-form>
              <el-row :gutter="8">
                <el-col :span="6">
                  <el-button @click="handleQueryCruiseTrackList"><el-icon><Refresh/></el-icon>查询列表</el-button>
                </el-col>
                <el-col :span="6">
                  <el-button @click="handleQueryCruiseTrack"><el-icon><Search/></el-icon>查询详情</el-button>
                </el-col>
                <el-col :span="6">
                  <el-button type="warning" @click="handleStartCruise"><el-icon><VideoPlay/></el-icon>开始巡航</el-button>
                </el-col>
                <el-col :span="6">
                  <el-button type="danger" @click="handleStopCruise"><el-icon><VideoPause/></el-icon>停止巡航</el-button>
                </el-col>
              </el-row>
              <div v-if="cruiseTrackList.length >0" class="mt20">
                <div class="panel-section-title">巡航轨迹列表:</div>
                <el-table :data="cruiseTrackList" border size="small">
                  <el-table-column prop="id" label="编号" width="100"></el-table-column>
                  <el-table-column prop="name" label="名称"></el-table-column>
                </el-table>
              </div>
            </el-tab-pane>
            <el-tab-pane v-if="isGb28181Device" label="精准控制">
              <el-form :model="ptzPreciseForm" label-width="100px">
                <el-row>
                  <el-col :span="24">
                    <el-form-item label="水平位置(0‑359)">
                      <el-input-number v-model="ptzPreciseForm.pan" :min="0" :max="359" class="w-full"></el-input-number>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="24">
                    <el-form-item label="垂直位置(0‑359)">
                      <el-input-number v-model="ptzPreciseForm.tilt" :min="0" :max="359" class="w-full"></el-input-number>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="24">
                    <el-form-item label="变倍(0‑15)">
                      <el-input-number v-model="ptzPreciseForm.zoom" :min="0" class="w-full"></el-input-number>
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-form>
              <el-row :gutter="8">
                <el-col :span="12">
                  <el-button @click="handleQueryPTZPosition"><el-icon><Refresh/></el-icon>查询位置</el-button>
                </el-col>
                <el-col :span="12">
                  <el-button type="success" @click="handlePtzPreciseControl"><el-icon><Connection/></el-icon>执行控制</el-button>
                </el-col>
              </el-row>
              <div v-if="ptzPosition?.pan !== undefined" class="mt20">
                <div class="panel-section-title">当前PTZ位置:</div>
                <el-descriptions :column="3" border size="small">
                  <el-descriptions-item label="水平位置">{{ptzPosition.pan}}</el-descriptions-item>
                  <el-descriptions-item label="垂直位置">{{ptzPosition.tilt}}</el-descriptions-item>
                  <el-descriptions-item label="变倍">{{ptzPosition.zoom}}</el-descriptions-item>
                </el-descriptions>
              </div>
            </el-tab-pane>
          </el-tabs>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script setup>
import {ref, defineProps} from 'vue'
import {
  InfoFilled, CaretTop, CaretLeft, CaretBottom, CaretRight,
  ZoomIn, ZoomOut, Refresh, Check, SwitchButton, VideoPlay, VideoPause, Connection
} from '@element-plus/icons-vue'

const props = defineProps({
  deviceId: String,
  deviceCode: String,
  deviceType: [Number, String],
  mediaServerId: String
})

//云台全部状态定义在当前组件
const isPtzEnable = ref(true)
const controlSpeed = ref(50)
const controlSpeedMin = ref(1)
const controlSpeedMax = ref(100)
const isPresetSupported = ref(false)
const selectedPresetIndex = ref(null)
const presetList = ref([])
const isGb28181Device = ref(Number(props.deviceType) === 12)
const homePositionForm = ref({presetId: 1, dwellTime: 10})
const cruiseTrackForm = ref({trackId: 0})
const cruiseTrackList = ref([])
const ptzPreciseForm = ref({pan: 0, tilt: 0, zoom: 0})
const ptzPosition = ref({})

//云台指令方法，后续在此调用后端接口
const sendPtz = (cmd) => {
  console.log('云台指令', cmd, controlSpeed.value, props)
}
const stopPtz = () => sendPtz('stop')

const loadPresetList = async () => {}
const handlePresetSelect = () => {}
const handleGotoPreset = () => {}
const openSetPresetDialog = () => {}
const handleDeletePreset = () => {}
const handleLightControl = (flag) => {}
const handleWiperControl = (flag) => {}
const handleQueryHomePosition = () => {}
const handleSetHomePosition = () => {}
const handleHomePositionControl = () => {}
const handleQueryCruiseTrackList = () => {}
const handleQueryCruiseTrack = () => {}
const handleStartCruise = () => {}
const handleStopCruise = () => {}
const handleQueryPTZPosition = () => {}
const handlePtzPreciseControl = () => {}
</script>

<style scoped lang="scss">
.empty-tip {
  text-align:center;
  padding:40px;
  color:var(--el-text-secondary);
  .tip-icon {font-size:48px;margin-bottom:16px;}
}

.ptz-direction-wrapper {
  display:flex;
  flex-direction:column;
  align-items:center;
  gap:16px;
}
.ptz-compass {
  display:flex;
  flex-direction:column;
  align-items:center;
  gap:8px;
  .control-btn {
    width:44px;
    height:44px;
    cursor:pointer;
    display:flex;
    align-items:center;
    justify-content:center;
    border:1px solid #dcdcdc;
    border-radius:6px;
    background:#fff;
    &:active {
      background:#409eff;
      .icon {
        color:#fff;
      }
    }
    .icon {font-size:22px;}
  }
  .middle-row {
    display:flex;
    align-items:center;
    gap:14px;
  }
  .control-round {
    width:48px;
    height:48px;
    border-radius:50%;
    display:flex;
    align-items:center;
    justify-content:center;
    border:1px solid #dcdcdc;
    background:#f5f7fa;
    font-size:22px;
  }
}
.ptz-speed-slider {
  width:100%;
}
.control-zoom-btn {font-size:24px;cursor:pointer;}
.mt15 {margin-top:15px;}
.mt10 {margin-top:10px;}
.mt20 {margin-top:20px;}
.panel-section-title {font-weight:bold;margin-bottom:8px;}
.w-full {width:100%;}
</style>