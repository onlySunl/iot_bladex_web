<template>
  <el-row>
    <el-col :span="24">
      <MediaInfo
          :app="streamInfo.app"
          :stream="streamInfo.stream"
          :media-server-id="String(streamInfo?.mediaServerId ?? '')"
      ></MediaInfo>
    </el-col>
  </el-row>
</template>
<script setup>
import {defineProps} from 'vue'
import MediaInfo from '@/components/nvr/Channel/mediaInfo.vue'
const props = defineProps({
  streamInfo: {type: Object, required: true}
})
</script>
<style scoped lang="scss">
</style>