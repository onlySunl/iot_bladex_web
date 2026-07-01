<template>

  <div class="associated-wrap">
    <el-tabs v-model="hasLink" class="demo-tabs" @tab-click="handleClick">
      <el-tab-pane label="未关联" :name="false"/>
      <el-tab-pane label="已关联" :name="true"/>

      <div class="search-panel" v-show="showSearch">
        <el-form :model="queryParams" ref="queryRef" :inline="true" label-width="68px">
          <el-form-item label="设备名称" prop="deviceName">
            <el-input
              v-model="queryParams.deviceName"
              placeholder="请输入设备名称"
              clearable
              @keyup.enter="handleQuery"
            />
          </el-form-item>
          <el-form-item label="IP地址" prop="ipAddress">
            <el-input
              v-model="queryParams.ipAddress"
              placeholder="请输入IP地址"
              clearable
              @keyup.enter="handleQuery"
            />
          </el-form-item>
          <el-form-item label="接入类型" prop="type">
            <el-select v-model="queryParams.type" placeholder="请选择直播流接入类型" clearable style="width: 240px">
              <el-option label="RTSP" value="1"/>
              <el-option label="RTMP" value="2"/>
              <el-option label="FLV" value="3"/>
              <el-option label="HLS" value="4"/>
              <el-option label="ONVIF" value="5"/>
              <el-option label="国标28181" value="12"/>
            </el-select>
          </el-form-item>
          <el-form-item label="设备状态" prop="deviceStatus">
            <el-select v-model="queryParams.deviceStatus" placeholder="请选择设备状态" clearable style="width: 240px">
              <el-option label="离线" value="OFFLINE"/>
              <el-option label="在线" value="ON"/>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" @click="handleQuery">搜索</el-button>
            <el-button icon="el-icon-refresh" @click="resetQuery">重置</el-button>
          </el-form-item>
        </el-form>
      </div>

      <el-row :gutter="10" class="mb8">
        <el-col :span="1.5" v-if="!hasLink">
          <el-button type="primary"
                     plain
                     icon="el-icon-plus"
                     :disabled="multiple"
                     @click="handleAdd">新增
          </el-button>
        </el-col>
        <el-col :span="1.5" v-if="hasLink">
          <el-button
            type="danger"
            plain
            icon="el-icon-delete"
            :disabled="multiple"
            @click="handleDelete">
            删除
          </el-button>
        </el-col>
        <el-col :span="1.5" v-if="!hasLink">
          <el-button type="primary"
                     plain
                     icon="el-icon-plus"
                     @click="handleAddAll">
            添加所有设备
          </el-button>
        </el-col>
        <el-col :span="1.5" v-if="hasLink">
          <el-button
              type="danger"
              plain
              icon="el-icon-delete"
              @click="handleRemoveAll">
            移除所有设备
          </el-button>
        </el-col>
        <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
      </el-row>

      <el-table v-loading="loading" :data="channelList" @selection-change="handleSelectionChange" border class="custom-table">
        <el-table-column type="selection" width="55" align="center" fixed/>
        <el-table-column label="编号" align="center" prop="id" width="60" fixed>
          <template slot-scope="scope">
            <span class="id-badge">{{ scope.row.id }}</span>
          
</template>

<script>
import {listPlatformDevice, linkDevice, unlinkDevice} from '@/api/nvr/platform'

export default {
  name: 'false',
  data() {
    return {
      loading: false,
      total: 0,
      showSearch: true,
      multiple: true,
      hasLink: false,
      form: {},
      page: 1,
      count: 10,
      deviceName: undefined as string | undefined,
      ipAddress: undefined as string | undefined,
      type: undefined as string | undefined,
      deviceStatus: undefined as string | undefined,
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    handleRemoveAll() {
      proxy!.$modal.confirm('确定移除所有设备？').then(() => {
          return unlinkDevice({
            platformId: props.platformId,
            allLink: false
          })
        }).then(() => {
          getList()
          proxy!.$modal.msgSuccess("移除成功");
        }).catch(() => {
        });
    },
    handleClick() {
      nextTick(() => {
          getList()
        })
    },
  },
}
</script>

<style scoped>
.associated-wrap {
  animation: wrapEnter 0.45s ease-out;
}

@keyframes wrapEnter {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.search-panel {
  padding: 16px 20px;
  margin-bottom: 16px;
  background: #f5f7fa;
  backdrop-filter: blur(10px) saturate(1.1);
  -webkit-backdrop-filter: blur(10px) saturate(1.1);
  border: 1px solid #ebeef5;
  border-radius: 14px;
  box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
  animation: panelEnter 0.4s ease-out 0.08s backwards;
}

@keyframes panelEnter {
  from {
    opacity: 0;
    transform: translateY(-8px) scale(0.99);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.mb8 {
  animation: panelEnter 0.4s ease-out 0.14s backwards;
}

:deep(.mb8 .el-button) {
  transition: all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
}

:deep(.mb8 .el-button:hover:not(:disabled)) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(64, 158, 255, 0.2);
}

:deep(.mb8 .el-button--danger:hover:not(:disabled)) {
  box-shadow: 0 4px 12px rgba(245, 108, 108, 0.2);
}

.custom-table {
  border-radius: 14px;
  overflow: hidden;
  animation: panelEnter 0.4s ease-out 0.2s backwards;
  box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
}

:deep(.custom-table .el-table__header-wrapper th.el-table__cell) {
  background: #f5f7fa !important;
  font-weight: 600;
  color: #303133;
  transition: background 0.2s;
}

:deep(.custom-table .el-table__body-wrapper .el-table__row) {
  transition: all 0.2s ease;
  animation: rowEnter 0.3s ease-out backwards;
}

:deep(.custom-table .el-table__body-wrapper .el-table__row:nth-child(1)) { animation-delay: 0.04s; }
:deep(.custom-table .el-table__body-wrapper .el-table__row:nth-child(2)) { animation-delay: 0.08s; }
:deep(.custom-table .el-table__body-wrapper .el-table__row:nth-child(3)) { animation-delay: 0.12s; }
:deep(.custom-table .el-table__body-wrapper .el-table__row:nth-child(4)) { animation-delay: 0.16s; }
:deep(.custom-table .el-table__body-wrapper .el-table__row:nth-child(5)) { animation-delay: 0.2s; }

@keyframes rowEnter {
  from {
    opacity: 0;
    transform: translateX(-8px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

:deep(.custom-table .el-table__body-wrapper .el-table__row:hover > td.el-table__cell) {
  background: #ebeef5 !important;
}

:deep(.custom-table .el-table__body-wrapper .el-table__row td.el-table__cell) {
  transition: background 0.2s ease;
}

.id-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 28px;
  height: 22px;
  padding: 0 8px;
  background: #ecf5ff;
  color: #409EFF;
  border-radius: 11px;
  font-size: 12px;
  font-weight: 600;
  transition: all 0.3s;
}

.custom-table :deep(.el-table__row:hover .id-badge) {
  background: #d9ecff;
  transform: scale(1.05);
}
</style>
