<template>
  <div class="snapshot-wrap">
    <el-row>
      <el-col :span="12">
        <el-button type="primary" :icon="Camera" @click="handleCaptureFromStream"
                   :loading="captureLoading" :disabled="!shouldShowCaptureBtn">抓图</el-button>
      </el-col>
      <el-col :span="12">
        <el-button type="success" :icon="Refresh" @click="getDeviceSnapshotList"
                   :loading="deviceSnapshotLoading">刷新</el-button>
      </el-col>
    </el-row>
    <div class="mt15" v-loading="deviceSnapshotLoading">
      <div v-if="deviceSnapshotList.length >0">
        <el-row :gutter="12">
          <el-col v-for="item in deviceSnapshotList" :key="item.id" :span="4">
            <div class="snapshot-card">
              <image-preview v-if="item.fileUrl" :src="item.fileUrl" width="100%" height="100%"></image-preview>
              <div class="snapshot-actions">
                <el-tooltip content="下载">
                  <el-button text size="small" :icon="Download" @click.stop="handleDownloadDeviceSnapshot(item)"></el-button>
                </el-tooltip>
                <el-tooltip content="删除">
                  <el-button text danger size="small" :icon="Delete" @click.stop="handleDeleteDeviceSnapshot(item)"></el-button>
                </el-tooltip>
              </div>
            </div>
          </el-col>
        </el-row>
      </div>
      <el-empty v-else description="暂无抓图记录"></el-empty>
    </div>
  </div>
</template>

<script setup>
import {ref, defineProps} from 'vue'
import {Camera, Refresh, Download, Delete} from '@element-plus/icons-vue'
import ImagePreview from '@/components/nvr/ImagePreview'
const props = defineProps({
  deviceId: String,
  mediaServerId: String
})

//抓图组件内部变量
const captureLoading = ref(false)
const shouldShowCaptureBtn = ref(true)
const deviceSnapshotLoading = ref(false)
const deviceSnapshotList = ref([])
const deviceSnapshotQuery = ref({pageNum:1,pageSize:10})

//抓图、刷新、下载、删除接口写在当前组件内部
const handleCaptureFromStream = async () => {}
const getDeviceSnapshotList = async () => {}
const handleDownloadDeviceSnapshot = (row) => {}
const handleDeleteDeviceSnapshot = (row) => {}
</script>

<style scoped lang="scss">
.mt15 {margin-top:15px;}
.snapshot-card {
  position:relative;
  border-radius:8px;
  overflow:hidden;
  box-shadow:0 2px 8px rgba(0,0,0,0.1);
  aspect-ratio:1/1;
}
.snapshot-actions {
  position:absolute;top:8px;right:8px;display:flex;gap:4px;
}
</style>