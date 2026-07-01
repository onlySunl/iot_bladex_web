<template>

  <div class="app-container group-page">
    <el-row :gutter="20">
      <splitpanes class="default-theme custom-splitpanes">
        <pane size="20" min-size="15">
          <div class="tree-card">
            <div class="tree-header">
              <el-icon class="tree-icon"><FolderOpened /></el-icon>
              <span class="tree-title">业务分组</span>
            </div>
            <div class="tree-content">
              <GroupTree
                @handleNodeClick="handleNodeClick"
                :showIndex="true"
                :contextMenu="['refresh', 'add', 'update', 'delete']"
              />
            </div>
          </div>
        </pane>

        <pane size="80">
          <div class="main-content">
            <!-- 分组信息卡片 -->
            <div class="group-info-card" :class="{ 'has-group': groupName }">
              <div class="group-info-content">
                <i class="group-info-icon el-icon-monitor"></i>
                <div class="group-info-text">
                  <span class="group-info-label">所选业务分组</span>
                  <el-text v-if="groupName" type="primary" class="group-name">{{ groupName }}</el-text>
                  <el-text v-else type="warning" class="group-name empty">未选择业务分组</el-text>
                </div>
              </div>
              <div class="group-info-badge" v-if="groupName">
                <el-tag type="success" effect="light" size="small">已选择</el-tag>
              </div>
            </div>

            <!-- 查询表单 -->
            <el-form
              :model="queryParams"
              ref="queryRef"
              :inline="true"
              v-show="showSearch"
              label-width="80px"
              class="query-form"
            >
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
                  prefix-icon="MapLocation"
                />
              </el-form-item>
              <el-form-item label="接入类型" prop="type">
                <el-select v-model="queryParams.type" placeholder="请选择直播流接入类型" clearable>
                  <el-option
                    v-for="dict in qs_live_stream_type"
                    :key="dict.value"
                    :label="dict.label"
                    :value="dict.value"
                  />
                </el-select>
              </el-form-item>
              <el-form-item label="设备状态" prop="deviceStatus">
                <el-select v-model="queryParams.deviceStatus" placeholder="请选择设备状态" clearable>
                  <el-option
                    v-for="dict in qs_device_status"
                    :key="dict.value"
                    :label="dict.label"
                    :value="dict.value"
                  />
                </el-select>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" icon="el-icon-search" @click="handleQuery" class="search-btn">
                  搜索
                </el-button>
                <el-button icon="el-icon-refresh" @click="resetQuery" class="reset-btn">重置</el-button>
              </el-form-item>
            </el-form>

            <!-- 操作按钮区 -->
            <el-row :gutter="10" class="mb8 toolbar-row">
              <el-col :span="1.5">
                <el-button
                  type="primary"
                  plain
                  icon="el-icon-plus"
                  :disabled="addDisabled"
                  @click="handleAdd"
                  class="action-btn add-btn"
                >
                  新增
                </el-button>
              </el-col>
              <el-col :span="1.5">
                <el-button
                  type="danger"
                  plain
                  icon="el-icon-delete"
                  :disabled="addDisabled || multiple"
                  @click="handleDelete"
                  class="action-btn delete-btn"
                >
                  删除
                </el-button>
              </el-col>
              <el-col :span="1.5">
                <el-button
                  type="warning"
                  plain
                  icon="el-icon-warning"
                  @click="handleUnusual"
                  class="action-btn unusual-btn"
                >
                  异常挂载设备
                </el-button>
              </el-col>
              <right-toolbar :showSearch.sync="showSearch" @queryTable="getList" />
            </el-row>

            <!-- 数据表格 -->
            <div class="table-wrapper">
              <el-table
                v-loading="loading"
                :data="deviceList"
                @selection-change="handleSelectionChange"
                class="custom-table"
                highlight-current-row
              >
                <el-table-column type="selection" width="55" align="center" fixed />
                <el-table-column label="编号" align="center" prop="id" width="70">
                  <template slot-scope="scope">
                    <span class="id-badge">{{ scope.row.id }}</span>
                  
</template>

<script>
import GroupTree from "../../components/common/GroupTree.vue";
import { Pane, Splitpanes } from "splitpanes";
import "splitpanes/dist/splitpanes.css";
import { addDeviceIdToGroup, deleteDeviceToGroup, listDevice, queryListByParentId } from "@/api/nvr/device";
import UnusualGroupDeviceSelect from "../../components/common/UnusualGroupDeviceSelect.vue";

export default {
  name: 'small-padding fixed-width',
  data() {
    return {
      deviceList: [],
      loading: true,
      total: 0,
      showSearch: true,
      groupDeviceId: "",
      businessGroup: "",
      selectionList: [],
      multiple: true,
      addDisabled: true,
      open: false,
      title: "",
      deviceSelectList: [],
      loadingSelect: true,
      totalSelect: 0,
      showSearchSelect: true,
      multipleSelect: true,
      selectionSelectList: [],
      groupName: "",
      form: {},
      pageNum: 1,
      pageSize: 10,
      deviceName: undefined,
      ipAddress: undefined,
      type: undefined,
      deviceStatus: undefined,
      gbParentId: undefined,
      status: "ENABLE",
      rules: {},
      pageNum: 1,
      pageSize: 10,
      deviceName: undefined,
      ipAddress: undefined,
      type: undefined,
      deviceStatus: undefined,
      gbParentId: undefined,
      status: "ENABLE",
    }
  },
  methods: {
    getList() {
      this.loading = true;
        listDevice(this.queryParams)
          .then((res) => {
            this.deviceList = res.rows;
            this.total = res.total;
          })
          .finally(() => {
            this.loading = false;
          });
    },
    handleQuery() {
      this.queryParams.pageNum = 1;
        getList();
    },
    resetQuery() {
      proxy.resetForm("queryRef");
        handleQuery();
    },
    handleDelete(row) {
      let deviceIds = [];
        if (row.id) {
          deviceIds.push(row.id);
        } else {
          for (let i = 0; i < this.selectionList.length; i++) {
            deviceIds.push(this.selectionList[i].id);
          }
        }
        proxy.$modal
          .confirm("是否删除选择的数据？")
          .then(function () {
            return deleteDeviceToGroup({ deviceIds: deviceIds });
          })
          .then(() => {
            getList();
            proxy.$modal.msgSuccess("删除成功");
          })
          .catch(() => {});
    },
    handleSelectionChange(selection) {
      if (this.queryParams.gbParentId === null) {
          this.multiple = true;
        } else {
          this.multiple = !selection.length;
        }
        this.selectionList = selection;
    },
    handleNodeClick(data) {
      if (data.deviceId == null || data.deviceId == undefined) {
          proxy.$modal.msgError("当前为业务分组，挂载设备请选择其下的虚拟组织，如不存在可右键新建");
          return;
        }
      
        if (data.deviceId != null || data.deviceId != undefined) {
          this.queryParams.gbParentId = data.deviceId;
          this.addDisabled = false;
        } else {
          this.queryParams.gbParentId = null;
          this.addDisabled = true;
        }
      
        this.groupName = data.name;
        this.groupDeviceId = this.queryParams.gbParentId;
        this.businessGroup = data.businessGroup;
        handleQuery();
    },
    handleAdd() {
      if (this.groupDeviceId === "" || this.groupDeviceId === " ") {
          proxy.$modal.msgError("请选择左侧业务分组");
          return;
        }
      
        this.title = "添加设备";
        this.open = true;
      
        getListDevice();
    },
    getListDevice() {
      this.loadingSelect = true;
        queryListByParentId(this.queryParamsSelect)
          .then((res) => {
            this.deviceSelectList = res.rows;
            this.totalSelect = res.total;
          })
          .finally(() => {
            this.loadingSelect = false;
          });
    },
    handleSelectQuery() {
      this.queryParamsSelect.pageNum = 1;
        getListDevice();
    },
    resetSelectQuery() {
      proxy.resetForm("querySelectRef");
        handleSelectQuery();
    },
    handleSelectionSelectChange(selection) {
      this.selectionSelectList = selection;
        this.multipleSelect = !selection.length;
    },
    handleSelect(row) {
      if (row.id) {
          addDeviceToCivilCode(this.groupDeviceId, this.businessGroup, [row]);
        } else {
          addDeviceToCivilCode(this.groupDeviceId, this.businessGroup, this.selectionSelectList);
        }
        proxy.$modal.msgSuccess("选择成功");
        this.open = false;
    },
    addDeviceToCivilCode(groupDeviceId, businessGroup, data) {
      let deviceIds = [];
        for (let i = 0; i < data.length; i++) {
          deviceIds.push(data[i].id);
        }
        addDeviceIdToGroup({
          parentId: groupDeviceId,
          businessGroup: businessGroup,
          deviceIds: deviceIds,
        }).then(() => {
          getList();
        });
    },
    handleUnusual() {
      proxy.$refs["UnusualGroupDeviceSelectRef"].openDialog();
    },
  },
}
</script>

<style scoped lang="scss">
/* ========== 页面整体布局 ========== */
.group-page {
  padding: 16px;
  animation: fadeIn 0.4s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* ========== Splitpanes 自定义 ========== */
.custom-splitpanes {
  height: calc(100vh - 140px);
  background: transparent;

  :deep(.splitpanes__pane) {
    background: transparent;
    transition: background-color 0.3s;
  }

  :deep(.splitpanes__splitter) {
    background-color: #ebeef5;
    border-left: 1px solid #ebeef5;
    position: relative;
    width: 8px;
    transition: background-color 0.3s;

    &:hover {
      background-color: #c6e2ff;
    }

    &::before {
      content: "";
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 3px;
      height: 24px;
      background-color: #dcdfe6;
      border-radius: 2px;
      transition: background-color 0.3s, height 0.3s;
    }

    &:hover::before {
      background-color: #409EFF;
      height: 36px;
    }
  }
}

/* ========== 左侧树卡片 ========== */
.tree-card {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: #fff;
  border-radius: 12px;
  border: 1px solid #ebeef5;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);
  overflow: hidden;
  transition: box-shadow 0.3s, border-color 0.3s;
  animation: slideInLeft 0.5s ease-out;

  &:hover {
    box-shadow: 0 4px 20px 0 rgba(0, 0, 0, 0.08);
  }
}

@keyframes slideInLeft {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.tree-header {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 16px 20px;
  border-bottom: 1px solid #ebeef5;
  background: linear-gradient(
    135deg,
    #ecf5ff 0%,
    #fff 100%
  );
  transition: background 0.3s;
}

.tree-icon {
  font-size: 20px;
  color: #409EFF;
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
}

.tree-title {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
  letter-spacing: 0.5px;
}

.tree-content {
  flex: 1;
  overflow: auto;
  padding: 12px;
}

/* ========== 右侧主内容区 ========== */
.main-content {
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding-left: 8px;
  animation: slideInRight 0.5s ease-out 0.1s both;
}

@keyframes slideInRight {
  from {
    opacity: 0;
    transform: translateX(20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

/* ========== 分组信息卡片 ========== */
.group-info-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 20px;
  background: #fff;
  border-radius: 10px;
  border: 1px solid #ebeef5;
  box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.04);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 4px;
    background: #E6A23C;
    border-radius: 10px 0 0 10px;
    transition: background 0.3s, width 0.3s;
  }

  &.has-group {
    &::before {
      background: #409EFF;
      width: 4px;
    }

    .group-info-icon {
      color: #409EFF;
      animation: rotateIn 0.6s ease-out;
    }
  }

  &:hover {
    box-shadow: 0 4px 16px 0 rgba(0, 0, 0, 0.08);
    transform: translateY(-1px);
  }
}

@keyframes rotateIn {
  from {
    transform: rotate(-180deg) scale(0.5);
    opacity: 0;
  }
  to {
    transform: rotate(0) scale(1);
    opacity: 1;
  }
}

.group-info-content {
  display: flex;
  align-items: center;
  gap: 12px;
}

.group-info-icon {
  font-size: 24px;
  color: #E6A23C;
  transition: color 0.3s;
}

.group-info-text {
  display: flex;
  align-items: center;
  gap: 10px;
}

.group-info-label {
  font-size: 14px;
  color: #606266;
  font-weight: 500;
}

.group-name {
  font-size: 15px;
  font-weight: 600;

  &.empty {
    font-weight: 500;
  }
}

.group-info-badge {
  animation: scaleIn 0.4s ease-out;
}

@keyframes scaleIn {
  from {
    transform: scale(0);
  }
  to {
    transform: scale(1);
  }
}

/* ========== 查询表单 ========== */
.query-form {
  padding: 10px 15px;
  background: #fff;
  border-radius: 10px;
  border: 1px solid #ebeef5;
  box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.04);
  margin-bottom: 0 !important;
  animation: fadeInUp 0.4s ease-out 0.15s both;
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  gap: 10px;

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
  margin-left: auto !important;
  margin-right: 0 !important;
  padding-left: 16px;
  border-left: 1px solid #ebeef5;
  margin-left: 12px !important;

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
  animation: fadeInUp 0.4s ease-out 0.2s both;
}

.action-btn {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  &:not(:disabled):hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.1);
  }

  &:not(:disabled):active {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
}

.add-btn:not(:disabled):hover {
  box-shadow: 0 6px 16px #c6e2ff;
}

.delete-btn:not(:disabled):hover {
  box-shadow: 0 6px 16px var(--el-color-danger-light-7);
}

.unusual-btn:not(:disabled):hover {
  box-shadow: 0 6px 16px var(--el-color-warning-light-7);
}

.select-btn:not(:disabled):hover {
  box-shadow: 0 6px 16px var(--el-color-success-light-7);
}

/* ========== 表格区域 ========== */
.table-wrapper {
  background: #fff;
  border-radius: 10px;
  border: 1px solid #ebeef5;
  box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.04);
  overflow: hidden;
  animation: fadeInUp 0.4s ease-out 0.25s both;
  transition: box-shadow 0.3s;
  flex: 1;
  display: flex;
  flex-direction: column;

  &:hover {
    box-shadow: 0 4px 16px 0 rgba(0, 0, 0, 0.06);
  }
}

.custom-table {
  --el-table-header-bg-color: #ebeef5;
  flex: 1;
  height: 0;

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
          animation-delay: #{$i * 0.03 + 0.25}s;
        }
      }

      &:hover {
        background-color: #ecf5ff !important;
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
  color: #ffffff !important;
}
.table-actions .el-button--primary,
.table-actions .el-button--primary[text],
.table-actions .el-button--primary[text][bg] {
  color: #ffffff !important;
  background-color: #409EFF !important;
  border-color: #409EFF !important;
}
.table-actions .el-button--danger,
.table-actions .el-button--danger[text],
.table-actions .el-button--danger[text][bg] {
  color: #ffffff !important;
  background-color: #F56C6C !important;
  border-color: #F56C6C !important;
}

/* ========== 分页 ========== */
.custom-pagination {
  padding: 12px 0;
  animation: fadeInUp 0.4s ease-out 0.3s both;

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

/* ========== 暗黑模式适配 ========== */


    .tree-card:hover,
    .group-info-card:hover,
    .table-wrapper:hover {
      box-shadow: 0 4px 20px 0 rgba(0, 0, 0, 0.3);
    }

    .tree-header {
      background: linear-gradient(
        135deg,
        rgba(64, 158, 255, 0.1) 0%,
        #fff 100%
      );
    }

    .custom-table {
      :deep(.el-table__header-wrapper th) {
        background-color: #fff !important;
      }

      :deep(.el-table__row) {
        &:hover {
          background-color: #0c2a5e !important;
        }
      }

      :deep(.el-table__cell),
      :deep(.el-table__cell *),
      :deep(.el-link),
      :deep(.el-link *),
      :deep(.el-text),
      :deep(.el-text *) {
        color: #ffffff !important;
      }
    }

    .id-badge {
      background: rgba(64, 158, 255, 0.15);
    }

    .device-dialog :deep(.el-dialog__header) {
      background: linear-gradient(
        135deg,
        rgba(64, 158, 255, 0.08) 0%,
        #fff 60%
      );
    }
  }
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
      margin-left: 0 !important;
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
.tree-content::-webkit-scrollbar,
:deep(.el-table__body-wrapper::-webkit-scrollbar) {
  width: 6px;
  height: 6px;
}

.tree-content::-webkit-scrollbar-thumb,
:deep(.el-table__body-wrapper::-webkit-scrollbar-thumb) {
  background: #dcdfe6;
  border-radius: 3px;
  transition: background 0.3s;
}

.tree-content::-webkit-scrollbar-thumb:hover,
:deep(.el-table__body-wrapper::-webkit-scrollbar-thumb:hover) {
  background: #a0cfff;
}

.tree-content::-webkit-scrollbar-track,
:deep(.el-table__body-wrapper::-webkit-scrollbar-track) {
  background: transparent;
}
</style>
