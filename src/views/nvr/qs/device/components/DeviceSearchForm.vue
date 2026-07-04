<template>
  <div class="device-search-form">
    <el-form :model="searchForm" inline>
      <el-form-item label="设备名称">
        <el-input
          v-model="searchForm.deviceName"
          placeholder="请输入设备名称"
          clearable
          style="width: 200px"
        />
      </el-form-item>
      <el-form-item label="协议">
        <el-select
          v-model="searchForm.protocol"
          placeholder="请选择协议"
          clearable
          style="width: 150px"
        >
          <el-option
            v-for="item in protocolDict"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="厂商">
        <el-select
          v-model="searchForm.vendor"
          placeholder="请选择厂商"
          clearable
          style="width: 150px"
        >
          <el-option
            v-for="item in vendorDict"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="状态">
        <el-select
          v-model="searchForm.status"
          placeholder="请选择状态"
          clearable
          style="width: 150px"
        >
          <el-option
            v-for="item in onlineStatusDict"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="分组">
        <el-tree-select
          v-model="searchForm.groupId"
          :data="groupList"
          placeholder="请选择分组"
          clearable
          check-strictly
          :render-after-expand="false"
          style="width: 200px"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="$emit('search')">
          <i class="el-icon-search"></i> 搜索
        </el-button>
        <el-button @click="$emit('reset')">
          <i class="el-icon-refresh"></i> 重置
        </el-button>
        <el-button type="success" @click="$emit('export')">
          <i class="el-icon-download"></i> 导出
        </el-button>
        <el-button type="primary" @click="$emit('add')">
          <i class="el-icon-plus"></i> 新增
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'DeviceSearchForm',
  props: {
    searchForm: {
      type: Object,
      required: true
    },
    protocolDict: {
      type: Array,
      default: () => []
    },
    vendorDict: {
      type: Array,
      default: () => []
    },
    onlineStatusDict: {
      type: Array,
      default: () => []
    },
    groupList: {
      type: Array,
      default: () => []
    }
  },
  emits: ['search', 'reset', 'export', 'add']
};
</script>

<style scoped>
.device-search-form {
  margin-bottom: 16px;
}
</style>
