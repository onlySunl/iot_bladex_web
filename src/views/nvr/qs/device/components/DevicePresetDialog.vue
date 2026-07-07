<template>

    <el-dialog
        :model-value="visible"
        @update:model-value="$emit('update:visible', $event)"
        title="预置点管理"
        width="800px"
    >

    <el-form :model="form" label-width="80px">
      <el-form-item label="预置点编号">
        <el-input-number v-model="form.index" :min="1" />
      </el-form-item>
      <el-form-item label="预置点名称">
        <el-input v-model="form.name" placeholder="自定义预置点名称" />
      </el-form-item>
    </el-form>
    <el-divider />
    <div class="preset-list">
      <el-tag v-for="item in presetList" :key="item.index" @click="selectedPresetIndex = item.index" closable @close="handleDeletePreset(deviceRow.id)">
        {{ item.index }}-{{ item.name }}
      </el-tag>
    </div>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="visible = false">取消</el-button>
        <el-button type="primary" @click="handleSetPreset(deviceRow.id)">保存预置点</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { useDevicePlay } from '@/views/nvr/qs/device/hooks/useDevicePlay'
const props = defineProps({
  visible: Boolean,
  form: Object,
  deviceRow: Object
})
const emit = defineEmits(['update:visible', 'save'])

const { presetList, selectedPresetIndex, handleSetPreset, handleDeletePreset, loadPresetList } = useDevicePlay()
// 弹窗打开加载预置点
const openWatch = () => {
  if (props.visible) loadPresetList(props.deviceRow.id)
}
</script>