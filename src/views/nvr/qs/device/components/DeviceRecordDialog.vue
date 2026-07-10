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
        ref="playerRecordRef"
        :type="props.deviceRow.type"
        :device-row="props.deviceRow"
        :device-id="String(props.deviceRow.id)"
        :device-code="props.deviceRow.deviceCode"
        :media-server-id="String(props.deviceRow.deviceCode)"
    ></RecordPlay>
  </el-drawer>
</template>

<script setup>
import {ref, defineProps, defineEmits, watch,nextTick} from 'vue'
import RecordPlay from '@/views/nvr/components/nvr/RecordPlay.vue'

const props = defineProps({
  deviceRow: {type: Object, default: () => ({})},
  easyPlayerOpen: {type: Boolean, default: false},
  dict: {type: Object, default: () => ({})}
})
const emit = defineEmits(['update:easyPlayerOpen'])

//页面展示变量，数据由播放器组件推送过来
const isLive = ref(true)
const playerRecordRef = ref(null)

//关闭抽屉，调用播放器内部暴露出来停止播放和销毁方法
const handleDialogClose = async () => {
  // 只有实例存在才调用方法，使用可选链操作符
  if (playerRecordRef.value) {
    try {
      await playerRecordRef.value.stopPlay()
    } catch (err) {
      console.warn('播放器关闭过程异常：', err)
    }
  }
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