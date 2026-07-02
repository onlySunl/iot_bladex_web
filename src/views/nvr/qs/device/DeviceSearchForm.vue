<template>
  <div class="search-box">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px" class="query-form">
      <el-form-item label="设备名称" prop="deviceName">
        <el-input
          v-model="queryParams.deviceName"
          placeholder="请输入设备名称"
          clearable
          @keyup.enter="$emit('query')"
          prefix-icon="VideoCamera"
        />
      </el-form-item>
      <el-form-item label="IP地址" prop="ipAddress">
        <el-input
          v-model="queryParams.ipAddress"
          placeholder="请输入IP地址"
          clearable
          @keyup.enter="$emit('query')"
          prefix-icon="MapLocation"
        />
      </el-form-item>
      <el-form-item label="接入类型" prop="type">
        <el-select v-model="queryParams.type" placeholder="请选择直播流接入类型" clearable style="width: 240px;">
          <el-option
            v-for="dict in liveStreamTypeDict"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="请选择状态" clearable style="width: 240px;">
          <el-option
            v-for="dict in statusDict"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="设备状态" prop="deviceStatus">
        <el-select v-model="queryParams.deviceStatus" placeholder="请选择设备状态" clearable style="width: 240px;">
          <el-option
            v-for="dict in deviceStatusDict"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item class="form-actions">
        <div class="button-group">
          <el-button type="primary" icon="Search" @click="$emit('query')" class="search-btn">搜索</el-button>
          <el-button icon="Refresh" @click="$emit('reset')" class="reset-btn">重置</el-button>
        </div>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8 toolbar-row action-buttons">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="Plus" @click="$emit('add')" class="action-btn add-btn">新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="success" plain icon="Edit" :disabled="!hasSelection" @click="$emit('update')" class="action-btn edit-btn">修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" plain icon="Delete" :disabled="!hasSelection" @click="$emit('delete')" class="action-btn delete-btn">删除</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" v-model:viewMode="viewMode" :showViewSwitch="true" @queryTable="$emit('query')"></right-toolbar>
    </el-row>
  </div>
</template>

<script setup lang="ts" name="DeviceSearchForm">
import { ref, computed } from 'vue';

interface QueryParams {
  deviceName?: string;
  ipAddress?: string;
  type?: string;
  status?: string;
  deviceStatus?: string;
}

interface DictItem {
  label: string;
  value: string;
}

const props = defineProps<{
  queryParams: QueryParams;
  showSearch: boolean;
  viewMode: string;
  hasSelection: boolean;
  liveStreamTypeDict: DictItem[];
  statusDict: DictItem[];
  deviceStatusDict: DictItem[];
}>();

const emit = defineEmits<{
  (e: 'query'): void;
  (e: 'reset'): void;
  (e: 'add'): void;
  (e: 'update'): void;
  (e: 'delete'): void;
  (e: 'update:showSearch', value: boolean): void;
  (e: 'update:viewMode', value: string): void;
}>();

const queryRef = ref();

// 计算属性用于 v-model 绑定
const showSearch = computed({
  get: () => props.showSearch,
  set: (value) => emit('update:showSearch', value)
});

const viewMode = computed({
  get: () => props.viewMode,
  set: (value) => emit('update:viewMode', value)
});

// 暴露方法供父组件调用
defineExpose({
  queryRef
});
</script>

<style scoped lang="scss">
.search-box {
  margin-bottom: 16px;
}

.query-form {
  margin-bottom: 16px;
}

.form-actions {
  margin-left: auto;
}

.button-group {
  display: flex;
  gap: 8px;
}

.toolbar-row {
  display: flex;
  align-items: center;
}

.action-buttons {
  margin-bottom: 16px;
}

.action-btn {
  margin-right: 8px;
}
</style>
