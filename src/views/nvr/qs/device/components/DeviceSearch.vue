<template>
  <el-card class="search-card" shadow="never">
    <el-form :model="queryParams" inline label-width="80px">
      <el-form-item label="设备名称">
        <el-input v-model="queryParams.deviceName" placeholder="请输入设备名称" clearable></el-input>
      </el-form-item>
      <el-form-item label="设备IP">
        <el-input v-model="queryParams.ip" placeholder="请输入IP地址" clearable></el-input>
      </el-form-item>
      <el-form-item label="在线状态">
        <el-select v-model="queryParams.status" placeholder="全部" clearable>
          <el-option label="在线" value="1"></el-option>
          <el-option label="离线" value="0"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="$emit('search')">搜索</el-button>
        <el-button icon="el-icon-refresh" @click="$emit('reset')">重置</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script>
export default {
  name: 'DeviceSearch',
  props: {
    queryParams: {
      type: Object,
      required: true
    }
  }
}
</script>

<style scoped lang="scss">
.search-card {
  margin-bottom: 16px;
}
</style>