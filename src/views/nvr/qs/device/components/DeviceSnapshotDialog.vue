<template>
  <el-dialog
      :model-value="visible"
      @update:model-value="$emit('update:visible', $event)"
      title="设备抓拍截图"
      width="800px"
  >
    <div v-if="imgUrl" style="text-align:center;">
      <img :src="imgUrl" style="max-width:100%;max-height:600px;" />
    </div>
    <div v-else style="padding:80px;text-align:center;color:#999;">暂无截图</div>
    <template #footer>
      <div class="snapshot-actions">
        <el-button @click="$emit('saveImg')">保存图片</el-button>
        <el-button @click="$emit('update:visible', false)">关闭</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
const props = defineProps({
  visible: Boolean,
  imgUrl: String
})
const emit = defineEmits(['update:visible', 'saveImg'])
</script>