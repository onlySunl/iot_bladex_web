<template>
  <el-dialog
      :model-value="visible"
      @update:model-value="$emit('update:visible', $event)"
      title="视频播放"
      width="1200px"
      destroy-on-close
  >

    <div style="display:flex;gap:16px;">
      <div style="flex:1;background:#000;min-height:450px;">
        <div v-if="deviceRow.deviceStatus !== 'ON'" style="color:#fff;text-align:center;padding:100px;">设备离线无法播放</div>
        <div v-else>视频播放器容器</div>
      </div>
      <div style="width:220px;">
        <el-tabs v-model="tabActiveName">
          <el-tab-pane label="云台控制" name="media">
            <div class="control-wrapper">
              <div class="control-btn control-top" @mousedown="ptzCamera('up', deviceRow)" @mouseup="ptzCamera('stop', deviceRow)">↑</div>
              <div class="control-btn control-left" @mousedown="ptzCamera('left', deviceRow)" @mouseup="ptzCamera('stop', deviceRow)">←</div>
              <div class="control-round" @click="ptzCamera('stop', deviceRow)">●</div>
              <div class="control-btn control-right" @mousedown="ptzCamera('right', deviceRow)" @mouseup="ptzCamera('stop', deviceRow)">→</div>
              <div class="control-btn control-bottom" @mousedown="ptzCamera('down', deviceRow)" @mouseup="ptzCamera('stop', deviceRow)">↓</div>
            </div>
            <el-divider />
            <el-slider v-model="controSpeed" :min="controSpeedMin" :max="controSpeedMax" label="云台速度" />
            <el-button block @click="captureFromStream(deviceRow.id)" :loading="captureLoading">抓图</el-button>
          </el-tab-pane>
          <el-tab-pane label="预置点" name="preset">
            <el-button block @click="$emit('openPreset')">预置点管理</el-button>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
    <template #footer>
      <el-button @click="$emit('update:visible', false)">关闭</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { useDevicePlay } from '@/views/nvr/qs/device/js/useDevicePlay'
const props = defineProps({
  visible: Boolean,
  deviceRow: Object
})
const emit = defineEmits(['update:visible', 'openPreset'])

const {
  controSpeed, controSpeedMin, controSpeedMax, captureLoading, ptzCamera
} = useDevicePlay()
</script>