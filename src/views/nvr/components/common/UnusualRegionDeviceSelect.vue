<template>

  <div>
    <el-dialog
      draggable
      title="异常挂载设备"
      width="1300px"
      top="5rem"
      v-model="showDialog"
      :destroy-on-close="true"
      append-to-body
      class="device-dialog"
      align-center
      @close="close()"
    >
      <div class="dialog-body">
        <el-alert title="清除后设备可正常添加到行政区划，添加可以自动添加对应的行政区划节点。" type="success"
          :closable="false" style="margin-bottom: 16px"/>

        <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="80px" class="query-form">
          <el-form-item label="设备名称" prop="deviceName">
            <el-input
              v-model="queryParams.deviceName"
              placeholder="请输入设备名称"
              clearable
              @keyup.enter="handleQuery"
              prefix-icon="el-icon-video-camera"
            />
          </el-form-item>
          <el-form-item label="IP地址" prop="ipAddress">
            <el-input
              v-model="queryParams.ipAddress"
              placeholder="请输入IP地址"
              clearable
              @keyup.enter="handleQuery"
              prefix-icon="el-icon-map-location"
            />
          </el-form-item>
          <el-form-item label="接入类型" prop="type">
            <el-select v-model="queryParams.type" placeholder="请选择直播流接入类型" clearable>
              <el-option
                v-for="dict in qs_live_stream_type"
                :key="dict"
                :label="dict.label"
                :value="dict"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="设备状态" prop="deviceStatus">
            <el-select v-model="queryParams.deviceStatus" placeholder="请选择设备状态" clearable>
              <el-option
                v-for="dict in qs_device_status"
                :key="dict"
                :label="dict.label"
                :value="dict"
              />
            </el-select>
          </el-form-item>
          <el-form-item class="form-actions">
            <div class="button-group">
              <el-button type="primary" icon="el-icon-search" @click="handleQuery" class="search-btn">搜索</el-button>
              <el-button icon="el-icon-refresh" @click="resetQuery" class="reset-btn">重置</el-button>
            </div>
          </el-form-item>
        </el-form>

        <el-row :gutter="10" class="mb8 toolbar-row">
          <el-col :span="1.5">
            <el-button
              type="primary"
              plain
              :disabled="single"
              icon="CircleClose"
              @click="handleClear"
              class="action-btn clear-btn"
            >清除
            </el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button
              type="primary"
              plain
              :disabled="unusualCivilCodeList.length > 0 ? false : true"
              icon="el-icon-delete"
              @click="handleClearAll"
              class="action-btn clear-all-btn"
            >全部清除
            </el-button>
          </el-col>
          <right-toolbar :showSearch.sync="showSearch" @queryTable="getUnusualCivilCodeListFun"></right-toolbar>
        </el-row>

        <div class="table-wrapper">
          <el-table v-loading="loading" :data="unusualCivilCodeList" @selection-change="handleSelectionChange" class="custom-table" highlight-current-row>
            <el-table-column type="selection" width="55" align="center" fixed/>
            <el-table-column label="编号" align="center" prop="id" width="70">
              <template slot-scope="scope">
                <span class="id-badge">{{ scope.row.id }}</span>
              
</template>

<script>
import {clearDeviceCivilCode, getUnusualCivilCodeList} from "@/api/nvr/device.js";

export default {
  name: 'small-padding fixed-width',
  data() {
    return {
      single: true,
      selectionList: [],
      showDialog: false,
      title: '',
      unusualCivilCodeList: [],
      total: 0,
      loading: true,
      showSearch: true,
      pageNum: 1,
      pageSize: 10,
      deviceName: undefined,
      ipAddress: undefined,
      type: undefined,
      deviceStatus: undefined,
      status: 'ENABLE',
    }
  },
  methods: {
    handleClearAll() {
      clearDeviceCivilCode({
          all: true,
          deviceIds: []
        }).then(res => {
          this.$modal.msgSuccess("全部清除成功");
          getUnusualCivilCodeListFun()
        })
    },
    close() {
      showDialog = false;
    },
    openDialog() {
      showDialog = true;
        getUnusualCivilCodeListFun()
    },
    handleDelete(row) {
      clearDeviceCivilCode({
          deviceIds: [row.id]
        }).then(res => {
          this.$modal.msgSuccess("清除成功");
          getUnusualCivilCodeListFun()
        })
    },
  },
}
</script>

<style scoped lang="scss">
/* ========== 查询表单 ========== */
.query-form {
  padding: 18px 22px;
  background: #fff;
  border-radius: 10px;
  border: 1px solid #ebeef5;
  box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.04);
  margin-bottom: 0important;
  animation: fadeInUp 0.4s ease-out 0.1s both;
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  gap: 20px;

  :deep(.el-form-item) {
    margin-bottom: 0;
    margin-right: 0;
  }

  :deep(.el-input__wrapper),
  :deep(.el-select .el-input__wrapper) {
    box-shadow: 0 0 0 1px #dcdfe6 inset;
    transition: all 0.3s;

    &:hover,
    &:focus-within {
      box-shadow: 0 0 0 1px #a0cfff inset;
    }

    &:focus-within {
      box-shadow: 0 0 0 1px #409EFF inset, 0 0 0 3px #d9ecff;
    }
  }
}

/* 按钮区域 */
.form-actions {
  margin-left: autoimportant;
  margin-right: 0important;
  padding-left: 32px;
  border-left: 1px solid #ebeef5;
  margin-left: 24pximportant;

  .button-group {
    display: flex;
    gap: 12px;
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(12px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.search-btn {
  transition: all 0.3s;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px #c6e2ff;
  }

  &:active {
    transform: translateY(0);
  }
}

.reset-btn {
  transition: all 0.3s;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
  }

  &:active {
    transform: translateY(0);
  }
}

/* ========== 工具栏 ========== */
.toolbar-row {
  padding: 4px 0;
  animation: fadeInUp 0.4s ease-out 0.15s both;
}

.action-btn {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  &:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.1);
  }

  &:not(:disabled) {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
}

.clear-btn:not(:disabled) {
  box-shadow: 0 6px 16px var(--el-color-danger-light-7);
}

.clear-all-btn:not(:disabled) {
  box-shadow: 0 6px 16px var(--el-color-danger-light-7);
}

/* ========== 表格区域 ========== */
.table-wrapper {
  background: #fff;
  border-radius: 10px;
  border: 1px solid #ebeef5;
  box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.04);
  overflow: hidden;
  animation: fadeInUp 0.4s ease-out 0.2s both;
  transition: box-shadow 0.3s;

  &:hover {
    box-shadow: 0 4px 16px 0 rgba(0, 0, 0, 0.06);
  }
}

.custom-table {
  --el-table-header-bg-color: #ebeef5;

  :deep(.el-table__header-wrapper) {
    th {
      background-color: #ebeef5 !important;
      color: #303133;
      font-weight: 600;
      font-size: 13px;
      letter-spacing: 0.3px;
      transition: background-color 0.3s;
    }
  }

  :deep(.el-table__body-wrapper) {
    .el-table__row {
      transition: all 0.25s ease;
      animation: rowFadeIn 0.4s ease-out both;

      @for $i from 1 through 20 {
        &:nth-child(#{$i}) {
          animation-delay: #{$i * 0.03 + 0.2}s;
        }
      }

      &:hover {
        background-color: #ecf5ff !important;
        transform: scale(1.002);
      }

      &.current-row {
        background-color: #ecf5ff !important;
      }
    }
  }

  :deep(.el-table__empty-block) {
    padding: 40px 0;
  }
}

@keyframes rowFadeIn {
  from {
    opacity: 0;
    transform: translateX(-10px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

/* 编号徽章 */
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

  .el-table__row:hover & {
    background: #d9ecff;
    transform: scale(1.05);
  }
}

/* 设备名称单元格 */
.device-name-cell {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: #303133;
  font-weight: 500;
  transition: color 0.3s;

  .el-icon {
    color: #409EFF;
    font-size: 16px;
  }
}

/* IP 单元格 */
.ip-cell {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  color: #606266;
  font-family: "Courier New", monospace;
  font-size: 13px;
  transition: color 0.3s;

  .el-icon {
    color: var(--el-color-info);
    font-size: 14px;
  }
}

/* 操作按钮 */
.table-actions {
  display: flex;
  align-items: center;
  gap: 6px;
  justify-content: center;
}
.table-actions .el-button {
  padding: 7px 10px;
  height: auto;
  font-size: 14px;
  transition: all 0.2s ease;
}
.table-actions .el-button:hover {
  transform: scale(1.08);
}
/* 强制保持白色图标 */
.table-actions .el-button .el-icon {
  color: #ffffffimportant;
}
.table-actions .el-button--primary,
.table-actions .el-button--primary[text],
.table-actions .el-button--primary[text][bg] {
  color: #ffffffimportant;
  background-color: #409EFF !important;
  border-color: #409EFF !important;
}
.table-actions .el-button--danger,
.table-actions .el-button--danger[text],
.table-actions .el-button--danger[text][bg] {
  color: #ffffffimportant;
  background-color: #F56C6C !important;
  border-color: #F56C6C !important;
}


/* ========== 分页 ========== */
.custom-pagination {
  padding: 12px 0;
  animation: fadeInUp 0.4s ease-out 0.25s both;

  :deep(.el-pagination__total) {
    color: #606266;
  }

  :deep(.el-pagination__sizes) {
    .el-input__wrapper {
      box-shadow: 0 0 0 1px #dcdfe6 inset;
    }
  }

  :deep(.el-pager li) {
    transition: all 0.3s;

    &:hover:not(.is-active) {
      color: #409EFF;
      transform: translateY(-1px);
    }

    &.is-active {
      box-shadow: 0 2px 8px #a0cfff;
    }
  }
}

/* ========== 对话框 ========== */
.device-dialog {
  :deep(.el-dialog) {
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
    animation: dialogEnter 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  }

  :deep(.el-dialog__header) {
    padding: 20px 24px;
    margin-right: 0;
    border-bottom: 1px solid #ebeef5;
    background: linear-gradient(
      135deg,
      #ecf5ff 0%,
      #fff 60%
    );

    .el-dialog__title {
      font-weight: 600;
      font-size: 16px;
      color: #303133;
      letter-spacing: 0.5px;
    }

    .el-dialog__headerbtn {
      width: 32px;
      height: 32px;
      border-radius: 8px;
      transition: all 0.3s;

      &:hover {
        background: var(--el-color-danger-light-9);

        .el-dialog__close {
          color: #F56C6C;
        }
      }
    }
  }

  :deep(.el-dialog__body) {
    padding: 20px 24px;
  }
}

@keyframes dialogEnter {
  from {
    opacity: 0;
    transform: scale(0.95) translateY(20px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

.dialog-body {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

/* ========== 响应式优化 ========== */
@media screen and (max-width: 1400px) {
  .query-form {
    :deep(.el-form-item) {
      margin-bottom: 12px;
    }
  }
}

@media screen and (max-width: 900px) {
  .query-form {
    .form-actions {
      margin-left: 0important;
      padding-left: 0;
      border-left: none;
      width: 100%;
      border-top: 1px solid #ebeef5;
      padding-top: 16px;
      margin-top: 8px;

      .button-group {
        justify-content: flex-end;
      }
    }
  }
}

/* ========== 滚动条美化 ========== */
:deep(.el-table__body-wrapper::-webkit-scrollbar) {
  width: 6px;
  height: 6px;
}

:deep(.el-table__body-wrapper::-webkit-scrollbar-thumb) {
  background: #dcdfe6;
  border-radius: 3px;
  transition: background 0.3s;
}

:deep(.el-table__body-wrapper::-webkit-scrollbar-thumb:hover) {
  background: #a0cfff;
}

:deep(.el-table__body-wrapper::-webkit-scrollbar-track) {
  background: transparent;
}
</style>
