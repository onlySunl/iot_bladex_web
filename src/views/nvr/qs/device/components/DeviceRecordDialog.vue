<template>
  <el-drawer
      :model-value="props.easyPlayerOpen"
      @update:model-value="emit('update:easyPlayerOpen', $event)"
      size="90%"
      direction="rtl"
      @close="handleDialogClose"
      class="glass-dialog play-drawer"
  >
    <template #header>
      <span>{{ `视频播放-${props.deviceRow?.deviceCode || ''}` }}</span>
    </template>

    <!--播放器组件，只传入基础设备参数-->
    <RecordPlay
        ref="playerComponentRef"
        :type="props.deviceRow.type"
        :device-id="String(props.deviceRow.id)"
        :device-code="props.deviceRow.deviceCode"
        :media-server-id="String(streamInfo?.mediaServerId ?? props.deviceRow.deviceCode)"
    ></RecordPlay>
  </el-drawer>
</template>

<script setup>
import {ref, defineProps, defineEmits, watch,nextTick} from 'vue'
import {ElMessage} from 'element-plus'
import {DocumentCopy} from '@element-plus/icons-vue'
import RecordPlay from '@/views/nvr/components/nvr/RecordPlay.vue'

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