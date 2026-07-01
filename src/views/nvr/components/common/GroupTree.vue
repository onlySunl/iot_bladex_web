<template>

  <div class="group-tree-container">
    <!-- 搜索区域 -->
    <div class="search-area">
      <el-input
        v-model="searchStr"
        placeholder="请输入内容搜索"
        clearable
        class="search-input"
        :prefix-icon="el-icon-search"
      >
        <template slot="append">v-if="showIndex">
          <el-tooltip content="显示编号" placement="top">
            <el-checkbox v-model="checked" label="编号" class="index-checkbox" />
          </el-tooltip>
        
</template>

<script>
import ChannelCode from "../../components/common/channelCode.vue";
import ChooseCivilCode from "../../components/common/chooseCivilCode.vue";
import { addGroup, deleteGroup, queryForGroupQuery, queryForGroupTree, updateGroup } from "@/api/nvr/group.js";

export default {
  props: {
    showIndex: { 
    type: Boolean,
    default: true,
   },
    showContextmenu: { 
    type: Boolean,
    default: true,
   },
    isContextmenu: { 
    type: Boolean,
    default: false,
   },
    contextMenu: { 
    type: Array,
    default: ["refresh", "add", "update", "delete"],
   },
  },
  data() {
    return {
      searchStr: "",
      treeData: [],
      nodeData: {},
      groupList: [],
      total: 0,
      show: false,
      title: "",
      openGroup: false,
      chooseId: "",
      defaultExpandedKeys: [],
      checked: false,
      formGroup: {},
      name: [{ required: true,
      message: "请输入节点名称",
      trigger: "blur" }],
      deviceId: [{ required: true,
      message: "请选择节点编号",
      trigger: "change" }],
      civilCode: [{ required: true,
      message: "请选择行政区划",
      trigger: "change" }],
      pageNum: 1,
      pageSize: 10,
      query: null,
    }
  },
  mounted() {
    chooseId = null;
      getQueryForGroupTree();
  },
  methods: {
    getQueryForGroupTree() {
      queryForGroupTree({
          query: searchStr,
          parent: null,
          hasDevice: props.hasDevice,
        }).then((res) => {
          let data = [
            {
              id: null,
              name: "根资源组",
              children: [],
              disabled: true,
            },
          ];
          data[0].children = proxy.handleTree(res.data, "id");
          treeData = data;
          if (res.data && res.data.length > 0) {
            defaultExpandedKeys = [];
            res.data.forEach((item) => {
              defaultExpandedKeys.push(item.id);
            });
          }
        });
    },
    getQueryForGroupQuery(val) {
      queryParamsGroup.query = val;
        queryForGroupQuery(queryParamsGroup).then((res) => {
          groupList = res.rows;
          total = res.total;
        });
    },
    refresh() {
      if (!searchStr) {
          getQueryForGroupTree();
        } else {
          getQueryForGroupQuery(searchStr);
        }
    },
    handleNodeClick(data) {
      chooseId = data.name;
        emit("handleNodeClick", data);
    },
    onContextMenu(e, data) {
      e.preventDefault();
        nodeData = data;
        show = true;
        optionsComponent.x = e.x;
        optionsComponent.y = e.y;
    },
    resetGroup() {
      formGroup = {
          deviceId: undefined,
          name: undefined,
          civilCode: undefined,
          businessGroup: "",
        };
        proxy.resetForm("formGroupRef");
    },
    buildDeviceIdCode(deviceId) {
      let lockContent = formGroup.businessGroup ? "216" : "215";
        this.$refs["channelCodeRef"].openDialog(
          (code) => {},
          deviceId,
          5,
          lockContent
        );
    },
    handleOk(code) {
      formGroup.deviceId = code;
    },
    chooseCivilCodeFun() {
      this.$refs["chooseCivilCodeRef"].openDialog((code) => {});
    },
    gbCivilCodeOnSubmit(data) {
      formGroup.civilCode = data;
    },
    cancel() {
      openGroup = false;
        resetGroup();
    },
    submitFormGroup() {
      this.$refs["formGroupRef"].validate((valid) => {
          if (valid) {
            if (formGroup.id) {
              updateGroup(formGroup).then(() => {
                this.$modal.msgSuccess("修改成功");
                openGroup = false;
                getQueryForGroupTree();
              });
            } else {
              addGroup(formGroup).then(() => {
                this.$modal.msgSuccess("新增成功");
                openGroup = false;
                getQueryForGroupTree();
              });
            }
          }
        });
    },
    loadNode(node, resolve) {
      if (node.level === 0) {
          return resolve([
            {
              treeId: "",
              deviceId: "",
              name: "根资源组",
              isLeaf: false,
              type: 0,
            },
          ]);
        } else if (node.level > 0) {
          if (node.data.leaf) {
            return resolve([]);
          }
          let res = await queryForGroupTree({
            query: "",
            parent: node.data.id,
            leaf: false,
            hasDevice: props.hasDevice,
          });
      
          let terr = [...proxy.handleTree(res.data, "id")];
          if (res.data && res.data.length > 0) {
            defaultExpandedKeys = [];
            res.data.forEach((item) => {
              defaultExpandedKeys.push(item.id);
            });
          }
      
          resolve(terr);
        } else {
          resolve([]);
        }
    },
    addNode() {
      resetGroup();
        formGroup.parentId = nodeData.id;
        formGroup.businessGroup = nodeData.businessGroup;
        formGroup.parentDeviceId = nodeData.deviceId;
        openGroup = true;
        title = "新增虚拟组织";
    },
    updateNode() {
      resetGroup();
        formGroup = JSON.parse(JSON.stringify(nodeData));
        openGroup = true;
        title = "修改虚拟组织";
    },
    deleteNode() {
      this.$modal
          .confirm('是否确认删除名称为"' + nodeData.name + '"的数据项?')
          .then(function () {
            deleteGroup(nodeData.id).then(() => {
              getQueryForGroupTree();
              this.$modal.msgSuccess("删除成功");
            });
          });
    },
    refreshNode() {
      refresh();
    },
    playChannel() {
      emit("playChannel", nodeData);
    },
    updatePosition() {
      emit("updatePosition", nodeData);
    },
  },
}
</script>

<style scoped lang="scss">
.group-tree-container {
  height: 100%;
  display: flex;
  flex-direction: column;
  animation: fadeIn 0.35s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(6px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* ========== 搜索区域 ========== */
.search-area {
  padding: 0 4px 12px;
  flex-shrink: 0;

  .search-input {
    :deep(.el-input__wrapper) {
      border-radius: 8px 0 0 8px;
      box-shadow: 0 0 0 1px #dcdfe6 inset;
      transition: all 0.3s;

      &:focus-within {
        box-shadow: 0 0 0 1px #409EFF inset, 0 0 0 3px #d9ecff;
      }
    }

    :deep(.el-input-group__prepend) {
      padding: 0;
      background: transparent;
      border-radius: 8px 0 0 8px;
      overflow: hidden;

      .refresh-btn {
        border: none;
        border-radius: 0;
        margin: 0;
        height: 100%;
        padding: 0 12px;
        background: #ebeef5;
        color: #606266;
        transition: all 0.3s;

        &:hover {
          background: #ecf5ff;
          color: #409EFF;
        }
      }
    }

    :deep(.el-input-group__append) {
      padding: 0 10px;
      background: #ebeef5;
      border-radius: 0 8px 8px 0;

      .index-checkbox {
        height: 100%;
        display: flex;
        align-items: center;
        margin-right: 0;

        :deep(.el-checkbox__label) {
          font-size: 12px;
          padding-left: 4px;
        }
      }
    }
  }
}

/* ========== 树形组件 ========== */
.custom-tree {
  flex: 1;
  overflow: auto;
  padding: 4px;

  :deep(.el-tree-node__content) {
    height: 36px;
    border-radius: 8px;
    margin: 2px 0;
    padding-right: 8pximportant;
    transition: all 0.25s ease;

    &:hover {
      background-color: #ecf5ff !important;
    }
  }

  :deep(.el-tree-node.is-current > .el-tree-node__content) {
    background: linear-gradient(90deg, #ecf5ff 0%, #d9ecff 100%) !important;
    box-shadow: 0 0 0 1px #c6e2ff inset;

    .node-label.active,
    .node-label {
      color: #409EFF;
      font-weight: 600;
    }

    .folder-icon {
      color: #409EFF;
      transform: scale(1.1);
    }
  }

  :deep(.el-tree-node__expand-icon) {
    color: #909399;
    transition: all 0.3s;

    &:hover {
      color: #409EFF;
    }
  }

  :deep(.el-tree-node__loading-icon) {
    color: #409EFF;
  }
}

/* ========== 自定义树节点 ========== */
.custom-tree-node {
  display: flex;
  align-items: center;
  gap: 6px;
  width: 100%;
  font-size: 14px;
  color: #303133;
  transition: all 0.25s;

  &.is-active {
    .node-label {
      color: #409EFF;
      font-weight: 600;
    }
  }
}

.tree-leaf-row,
.tree-folder-row {
  display: flex;
  align-items: center;
  gap: 6px;
  width: 100%;
}

.node-icon-wrap {
  display: flex;
  align-items: center;
  flex-shrink: 0;
}

.node-icon {
  font-size: 18px;
  transition: all 0.3s;
  flex-shrink: 0;

  &.folder-icon {
    color: #E6A23C;

    &.active {
      color: #409EFF;
    }
  }

  &.camera-icon {
    &.online {
      color: #67C23A;
    }

    &.offline {
      color: var(--el-text-color-disabled);
    }
  }
}

.node-label {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  transition: color 0.25s;
}

.node-extra {
  flex-shrink: 0;
}

.device-id-badge {
  display: inline-flex;
  align-items: center;
  padding: 0 8px;
  height: 20px;
  background: #ecf5ff;
  color: #409EFF;
  border-radius: 10px;
  font-size: 11px;
  font-weight: 600;
  font-family: "Courier New", monospace;
  transition: all 0.3s;
}

/* ========== 搜索结果区域 ========== */
.search-result-area {
  flex: 1;
  overflow: auto;
  padding: 0 4px;
}

.result-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.result-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 14px;
  background: #fff;
  border: 1px solid #ebeef5;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  animation: slideInLeft 0.35s ease-out both;

  &:hover {
    background: #ecf5ff;
    border-color: #c6e2ff;
    transform: translateX(4px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);

    .result-arrow {
      opacity: 1;
      transform: translateX(0);
    }
  }

  &.is-active {
    background: linear-gradient(90deg, #ecf5ff 0%, #d9ecff 100%);
    border-color: #a0cfff;
    box-shadow: 0 2px 8px #c6e2ff;

    .result-name {
      color: #409EFF;
      font-weight: 600;
    }

    .iconfont {
      color: #409EFF;
    }
  }
}

@keyframes slideInLeft {
  from {
    opacity: 0;
    transform: translateX(-12px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.result-icon-wrap {
  flex-shrink: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #ebeef5;
  border-radius: 8px;
  transition: all 0.3s;

  .iconfont {
    font-size: 18px;
    color: #909399;
    transition: color 0.3s;

    &.active {
      color: #409EFF;
    }
  }
}

.result-item:hover .result-icon-wrap {
  background: #d9ecff;
}

.result-info {
  flex: 1;
  min-width: 0;
}

.result-name {
  font-size: 14px;
  color: #303133;
  font-weight: 500;
  transition: color 0.25s;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.result-id {
  margin-top: 4px;
  font-size: 12px;
  color: var(--el-text-color-placeholder);
  font-family: "Courier New", monospace;
}

.result-arrow {
  flex-shrink: 0;
  color: #409EFF;
  opacity: 0;
  transform: translateX(-4px);
  transition: all 0.3s;
}

/* 分页 */
.tree-pagination {
  margin-top: 12px;
  padding: 8px 0;

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

/* 空状态 */
.tree-empty {
  padding: 40px 0;
}

/* ========== 对话框 ========== */
.group-dialog {
  :deep(.el-dialog) {
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
    animation: dialogEnter 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  }

  :deep(.el-dialog__header) {
    padding: 18px 24px;
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
    padding: 24px;
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

.group-form {
  :deep(.el-form-item__label) {
    font-weight: 500;
    color: #606266;
  }

  :deep(.el-input__wrapper) {
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

  :deep(.el-input-group__append) {
    padding: 0;
    overflow: hidden;

    .el-button {
      border: none;
      border-radius: 0;
      margin: 0;
      height: 100%;
      padding: 0 14px;
      background: #ebeef5;
      color: #606266;
      transition: all 0.3s;

      &:hover {
        background: #ecf5ff;
        color: #409EFF;
      }
    }
  }
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;

  .cancel-btn {
    transition: all 0.3s;

    &:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
    }
  }

  .confirm-btn {
    transition: all 0.3s;

    &:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 12px #c6e2ff;
    }
  }
}

/* ========== 暗黑模式适配 ========== */


      :deep(.el-input-group__append) {
        background: #fff;
      }
    }

    .custom-tree {
      :deep(.el-tree-node.is-current > .el-tree-node__content) {
        background: rgba(64, 158, 255, 0.1) !important;
        box-shadow: 0 0 0 1px rgba(64, 158, 255, 0.2) inset;
      }

      :deep(.el-tree-node__content:hover) {
        background-color: rgba(64, 158, 255, 0.08) !important;
      }
    }

    .result-item {
      &:hover {
        background: rgba(64, 158, 255, 0.08);
        border-color: rgba(64, 158, 255, 0.2);
      }

      &.is-active {
        background: linear-gradient(90deg, rgba(64, 158, 255, 0.1) 0%, rgba(64, 158, 255, 0.15) 100%);
        border-color: rgba(64, 158, 255, 0.25);
      }
    }

    .result-icon-wrap {
      background: #fff;
    }

    .device-id-badge {
      background: rgba(64, 158, 255, 0.15);
    }

    .group-dialog :deep(.el-dialog__header) {
      background: linear-gradient(
        135deg,
        rgba(64, 158, 255, 0.08) 0%,
        #fff 60%
      );
    }
  }
}

/* ========== 滚动条美化 ========== */
.custom-tree::-webkit-scrollbar,
.search-result-area::-webkit-scrollbar {
  width: 5px;
}

.custom-tree::-webkit-scrollbar-thumb,
.search-result-area::-webkit-scrollbar-thumb {
  background: #dcdfe6;
  border-radius: 3px;
}

.custom-tree::-webkit-scrollbar-thumb:hover,
.search-result-area::-webkit-scrollbar-thumb:hover {
  background: #a0cfff;
}

.custom-tree::-webkit-scrollbar-track,
.search-result-area::-webkit-scrollbar-track {
  background: transparent;
}
</style>
