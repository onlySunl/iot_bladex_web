<template>
  <div class="card-view" v-loading="loading">
    <div v-if="deviceList.length > 0" class="card-grid">
      <div class="device-card" :class="{ 'is-online': item.deviceStatus === 'ON' }" v-for="item in deviceList" :key="item.id">
        <div class="card-media">
          <div class="media-inner">
            <div v-if="item.snap">截图预览</div>
            <div v-else class="snapshot-placeholder">暂无截图</div>
          </div>
          <el-checkbox v-model="item.checked" @change="$emit('cardSelect', item)" class="card-checkbox"/>
          <div class="media-glass-bar">
            <h3 class="bar-device-name" :title="item.deviceName">{{ item.deviceName }}</h3>
            <div class="status-indicator">
              <span class="status-dot"></span>
              <span class="status-text">{{ item.deviceStatus === 'ON' ? '在线' : '离线' }}</span>
            </div>
          </div>
        </div>
        <div class="card-info">
          <div class="info-tags">
            <span class="info-tag">ID：{{ item.id }}</span>
            <span class="info-tag">IP：{{ item.ip || '-' }}</span>
            <dict-tag :options="qs_live_stream_type" :value="item.type" size="small"/>
          </div>
        </div>
        <div class="card-toolbar">
          <el-button size="small" type="primary" icon="VideoPlay" @click="$emit('openPlay', item)" :disabled="item.deviceStatus !== 'ON'">播放</el-button>
          <el-dropdown @command="cmd => $emit('moreAction', cmd, item)">
            <el-button text bg size="small" icon="More"/>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="edit" icon="Edit">编辑</el-dropdown-item>
                <el-dropdown-item command="delete" icon="Delete" class="is-danger">删除</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </div>
    </div>
    <el-empty v-else description="暂无设备数据"/>
  </div>
</template>

<script setup>
import { useDeviceDict } from '@/views/nvr/qs/device/js/useDeviceDict'

const props = defineProps({
  loading: Boolean,
  deviceList: Array
})
const emit = defineEmits(['cardSelect', 'openPlay', 'moreAction'])
const { qs_live_stream_type } = useDeviceDict()
</script>