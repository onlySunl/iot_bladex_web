<template>
  <el-drawer
      :model-value="props.easyPlayerOpen"
      @update:model-value="emit('update:easyPlayerOpen', $event)"
      size="880px"
      direction="rtl"
      @close="handleDialogClose"
      class="glass-dialog play-drawer"
  >
    <template #header>
      <span>{{ `视频播放-${props.deviceRow?.deviceName || ''}` }}</span>
    </template>

    <!--播放器组件，只传入基础设备参数-->
    <PlayerVideo
        v-if="props.easyPlayerOpen"
        ref="playerComponentRef"
        :device-row="props.deviceRow"
        :quality="quality"
        :default-quality="defaultQuality"
        :is-quality="isQuality"
        :is-live="isLive"
        @stream-ready="handleStreamReady"
        @ptz="handlePlayerPtz"
    />

    <el-tabs
        v-model="tabActiveName"
        type="card"
        stretch
        v-if="props.easyPlayerOpen"
        class="video-tab-container"
    >
      <el-tab-pane label="地址" name="address">
        <el-row :gutter="10">
          <el-col :span="21">
            <el-input v-model="flvUrl" disabled>
              <template #prepend>flv地址</template>
              <template #append>
                <el-button type="primary" :icon="DocumentCopy" @click="copyText(flvUrl)"/>
              </template>
            </el-input>
          </el-col>
        </el-row>
        <el-row :gutter="10" class="mt10">
          <el-col :span="21">
            <el-input v-model="sharedIframe" disabled>
              <template #prepend>iframe：</template>
              <template #append>
                <el-button type="primary" :icon="DocumentCopy" @click="copyText(sharedIframe)"/>
              </template>
            </el-input>
          </el-col>
        </el-row>
        <el-row :gutter="10" class="mt10">
          <el-col :span="21">
            <el-input v-model="rtcUrl" disabled>
              <template #prepend>
                <StreamDropdown :stream-info="streamInfo || {}"/>
              </template>
              <template #append>
                <el-button type="primary" :icon="DocumentCopy" @click="copyText(wsUrl)"/>
              </template>
            </el-input>
          </el-col>
        </el-row>
      </el-tab-pane>

      <el-tab-pane label="编码信息" name="codec">
        <MediaInfoPanel v-if="streamInfo" :stream-info="streamInfo"></MediaInfoPanel>
      </el-tab-pane>

      <el-tab-pane label="云台控制" name="control">
        <PtzControlPanel
            :device-id="props.deviceRow.id"
            :device-code="props.deviceRow.deviceCode"
            :device-type="props.deviceRow.type"
            :media-server-id="String(streamInfo?.mediaServerId ?? '')"
        ></PtzControlPanel>
      </el-tab-pane>

      <el-tab-pane label="抓图记录" name="snapshots">
        <SnapshotPanel
            :device-id="props.deviceRow.id"
            :media-server-id="String(streamInfo?.mediaServerId ?? '')"
        ></SnapshotPanel>
      </el-tab-pane>
    </el-tabs>
  </el-drawer>
</template>

<script setup>
import {ref, defineProps, defineEmits, watch,nextTick} from 'vue'
import {ElMessage} from 'element-plus'
import {DocumentCopy} from '@element-plus/icons-vue'
import PlayerVideo from '@/views/nvr/components/nvr/PlayerVideo.vue'
import MediaInfoPanel from '@/views/nvr/components/nvr/MediaInfoPanel.vue'
import PtzControlPanel from '@/views/nvr/components/nvr/PtzControlPanel.vue'
import SnapshotPanel from '@/views/nvr/components/nvr/SnapshotPanel.vue'
import StreamDropdown from '@/components/nvr/Channel/streamDropdown.vue'

const props = defineProps({
  deviceRow: {type: Object, default: () => ({})},
  easyPlayerOpen: {type: Boolean, default: false},
  dict: {type: Object, default: () => ({})}
})
const emit = defineEmits(['update:easyPlayerOpen'])

//页面展示变量，数据由播放器组件推送过来
const flvUrl = ref('')
const wsUrl = ref('')
const rtcUrl = ref('')
const hlsUrl = ref('')
const sharedIframe = ref('')
const streamInfo = ref(null)
const tabActiveName = ref('address')
const quality = ref([])
const defaultQuality = ref('高清')
const isQuality = ref(true)
const isLive = ref(true)
const playerComponentRef = ref(null)
let lastDeviceId = null

//播放器返回流信息
const handleStreamReady = (payload) => {
  flvUrl.value = payload.flvUrl
  wsUrl.value = payload.wsUrl
  rtcUrl.value = payload.rtcUrl
  hlsUrl.value = payload.hlsUrl
  sharedIframe.value = payload.sharedIframe
  streamInfo.value = payload.streamInfo
}

//播放器原生ptz事件接收
const handlePlayerPtz = (info) => {
  console.log('播放器ptz事件：', info)
}

//复制文本工具方法，属于页面通用方法留在父组件
const copyText = (text) => {
  if (!text) return
  const input = document.createElement('textarea')
  input.value = text
  document.body.appendChild(input)
  input.select()
  document.execCommand('copy')
  document.body.removeChild(input)
  ElMessage.success('复制成功')
}

//关闭抽屉，调用播放器内部暴露出来停止播放和销毁方法
const handleDialogClose = async () => {
  // 只有实例存在才调用方法，使用可选链操作符
  if (playerComponentRef.value) {
    try {
      await playerComponentRef.value.stopPlay()
      // destroyPlayer里面本身也增加内部判断
      await playerComponentRef.value.destroyPlayer()
    } catch (err) {
      console.warn('播放器关闭过程异常：', err)
    }
  }
  lastDeviceId = null
  tabActiveName.value = 'address'
  flvUrl.value = wsUrl.value = rtcUrl.value = sharedIframe.value = ''
  streamInfo.value = null
  emit('update:easyPlayerOpen', false)
}

//监听抽屉打开，调用播放器内部startPlay方法，播放逻辑全部在子组件内部
watch(() => props.easyPlayerOpen, async (newVal, oldVal) => {
  if (newVal && !oldVal && props.deviceRow?.id && props.deviceRow.id !== lastDeviceId) {
    lastDeviceId = props.deviceRow.id
    // 等待DOM渲染完成，组件实例挂载完毕
    await nextTick()
    if (!playerComponentRef.value) {
      console.warn('播放器实例获取不到')
      return
    }
    try {
      await playerComponentRef.value.startPlay()
    } catch (err) {
      console.error('startPlay执行异常：', err)
    }
  }
})
</script>

<style scoped lang="scss">
.play-drawer {
  .player-wrap {
    width: 100%;
    display: flex;
    justify-content: center;
  }
  .video-tab-container {margin-top:10px;}
  .url-label {
    line-height:40px;
    text-align:right;
    display:inline-block;
  }
  .mt10 {margin-top:10px;}
}
</style>