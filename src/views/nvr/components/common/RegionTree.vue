<template>

  <div class="region-tree-container">
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
import {

export default {
  name: '0',
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
      regionList: [],
      total: 0,
      show: false,
      title: "",
      openRegion: false,
      chooseId: "",
      allValRegion: [],
      activeKeyRegion: "0",
      defaultExpandedKeys: [],
      checked: false,
      formRegion: {},
      name: [{ required: true,
      message: "请输入节点名称",
      trigger: "blur" }],
      deviceId: [{ required: true,
      message: "请选择节点编号",
      trigger: "change" }],
      pageNum: 1,
      pageSize: 10,
      query: null,
    }
  },
  mounted() {
    activeKeyRegion = "0";
      chooseId = null;
      getQueryForRegionTree();
  },
  methods: {
    getQueryForRegionTree() {
      queryForRegionTree({
          query: searchStr,
          parent: null,
          hasDevice: props.hasDevice,
        }).then((res) => {
          let data = [
            {
              name: "根资源组",
              children: [],
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
    getQueryForRegionQuery(val) {
      queryParamsRegion.query = val;
        queryForRegionQuery(queryParamsRegion).then((res) => {
          regionList = res.rows;
          total = res.total;
        });
    },
    refresh() {
      if (!searchStr) {
          getQueryForRegionTree();
        } else {
          getQueryForRegionQuery(searchStr);
        }
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
          let res = await queryForRegionTree({
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
    onContextMenu(e, data) {
      e.preventDefault();
        nodeData = data;
        show = true;
        optionsComponent.x = e.x;
        optionsComponent.y = e.y;
    },
    handleNodeClick(data) {
      chooseId = data.name;
        emit("handleNodeClick", data);
    },
    resetRegion() {
      formRegion = {
          deviceId: undefined,
          name: undefined,
        };
        proxy.resetForm("formRegionRef");
    },
    queryChildList(parent) {
      getAllChild({ parent: parent }).then((res) => {
          regionList = res.data;
        });
    },
    getRegionList() {
      nextTick(() => {
          if (activeKeyRegion === "0") {
            queryChildList();
          } else if (activeKeyRegion === "1" || activeKeyRegion === "2") {
            let parent = "";
            if (activeKeyRegion === "1") {
              parent = allValRegion[0].val;
            }
            if (activeKeyRegion === "2") {
              if (allValRegion[1].val === "") {
                parent = "";
              } else {
                parent = allValRegion[0].val + allValRegion[1].val;
              }
            }
      
            if (activeKeyRegion !== "0" && parent === "") {
              this.$modal.msgError("请先选择上级行政区划");
            }
            if (parent !== "") {
              queryChildList(parent);
            } else {
              regionList = [];
            }
          }
        });
    },
    deviceChange(item) {
      nextTick(() => {
          let code = allValRegion[0].val;
      
          if (allValRegion[1].val) {
            code += allValRegion[1].val;
            if (allValRegion[2].val) {
              code += allValRegion[2].val;
              if (allValRegion[3].val) {
                code += allValRegion[3].val;
              }
            } else {
              allValRegion[3].val = "";
            }
          } else {
            allValRegion[2].val = "";
            allValRegion[3].val = "";
          }
          formRegion.deviceId = code;
        });
    },
    cancel() {
      openRegion = false;
        resetRegion();
    },
    addNode() {
      resetRegion();
        formRegion.parentId = nodeData.id;
        if (nodeData.deviceId) {
          formRegion.deviceId = String(nodeData.deviceId).slice(0, -2);
        }
        formRegion.parentDeviceId = nodeData.deviceId;
        openRegion = true;
        title = "新增行政区划";
        getRegionList();
        allValRegion = [
          {
            id: [1, 2],
            meaning: "省级编码",
            val: "11",
            type: "中心编码",
            lock: false,
          },
          {
            id: [3, 4],
            meaning: "市级编码",
            val: "",
            type: "中心编码",
            lock: false,
          },
          {
            id: [5, 6],
            meaning: "区级编码",
            val: "",
            type: "中心编码",
            lock: false,
          },
          {
            id: [7, 8],
            meaning: "基层接入单位编码",
            val: "",
            type: "中心编码",
            lock: false,
          },
        ];
      
        activeKeyRegion = "0";
        if (formRegion.deviceId) {
          if (formRegion.deviceId.length >= 2 && allValRegion[0]) {
            allValRegion[0].val = formRegion.deviceId.substring(0, 2);
          }
          if (formRegion.deviceId.length >= 4 && allValRegion[1]) {
            allValRegion[1].val = formRegion.deviceId.substring(2, 4);
          }
          if (formRegion.deviceId.length >= 6 && allValRegion[2]) {
            allValRegion[2].val = formRegion.deviceId.substring(4, 6);
          }
          activeKeyRegion = "3";
        } else {
          if (formRegion.parentDeviceId) {
            if (formRegion.parentDeviceId.length >= 2) {
              allValRegion[0].val = formRegion.parentDeviceId.substring(0, 2);
              activeKeyRegion = "1";
            }
            if (formRegion.parentDeviceId.length >= 4) {
              allValRegion[1].val = formRegion.parentDeviceId.substring(2, 4);
              activeKeyRegion = "2";
            }
          }
        }
    },
    submitFormRegion() {
      this.$refs["formRegionRef"].validate((valid) => {
          if (valid) {
            if (formRegion.id) {
              updateRegion(formRegion).then(() => {
                this.$modal.msgSuccess("修改成功");
                openRegion = false;
                getQueryForRegionTree();
              });
            } else {
              addRegion(formRegion).then(() => {
                this.$modal.msgSuccess("新增成功");
                openRegion = false;
                getQueryForRegionTree();
              });
            }
          }
        });
    },
    updateNode() {
      resetRegion();
        formRegion = JSON.parse(JSON.stringify(nodeData));
        openRegion = true;
        title = "修改行政区划";
        getRegionList();
        allValRegion = [
          {
            id: [1, 2],
            meaning: "省级编码",
            val: "11",
            type: "中心编码",
            lock: false,
          },
          {
            id: [3, 4],
            meaning: "市级编码",
            val: "",
            type: "中心编码",
            lock: false,
          },
          {
            id: [5, 6],
            meaning: "区级编码",
            val: "",
            type: "中心编码",
            lock: false,
          },
          {
            id: [7, 8],
            meaning: "基层接入单位编码",
            val: "",
            type: "中心编码",
            lock: false,
          },
        ];
      
        activeKeyRegion = "0";
        if (formRegion.deviceId) {
          if (formRegion.deviceId.length >= 2 && allValRegion[0]) {
            allValRegion[0].val = formRegion.deviceId.substring(0, 2);
          }
          if (formRegion.deviceId.length >= 4 && allValRegion[1]) {
            allValRegion[1].val = formRegion.deviceId.substring(2, 4);
          }
          if (formRegion.deviceId.length >= 6 && allValRegion[2]) {
            allValRegion[2].val = formRegion.deviceId.substring(4, 6);
          }
          if (formRegion.deviceId.length === 8 && allValRegion[3]) {
            allValRegion[3].val = formRegion.deviceId.substring(6, 8);
          }
        } else {
          if (formRegion.parentDeviceId) {
            if (formRegion.parentDeviceId.length >= 2) {
              allValRegion[0].val = formRegion.parentDeviceId.substring(0, 2);
              activeKeyRegion = "1";
            }
            if (formRegion.parentDeviceId.length >= 4) {
              allValRegion[1].val = formRegion.parentDeviceId.substring(2, 4);
              activeKeyRegion = "2";
            }
            if (formRegion.parentDeviceId.length >= 6) {
              allValRegion[2].val = formRegion.parentDeviceId.substring(4, 6);
              activeKeyRegion = "3";
            }
          }
        }
    },
    deleteNode() {
      this.$modal
          .confirm('是否确认删除名称为"' + nodeData.name + '"的数据项?')
          .then(function () {
            deleteRegion(nodeData.id).then(() => {
              getQueryForRegionTree();
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
.region-tree-container {
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

/* ========== 行政区划对话框 ========== */
.region-dialog {
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
    padding: 0;
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
  padding: 20px 24px;
}

/* Tabs */
.region-tabs {
  :deep(.el-tabs__header) {
    margin-bottom: 16px;
  }

  :deep(.el-tabs__nav-wrap) {
    &::after {
      height: 1px;
      background: #ebeef5;
    }
  }

  :deep(.el-tabs__item) {
    padding: 0 20px;
    height: 56px;
    transition: all 0.3s;

    &.is-active {
      .tab-code {
        color: #409EFF;
      }

      .tab-meaning {
        color: #409EFF;
      }
    }

    &:hover {
      .tab-code {
        color: #79bbff;
      }
    }
  }

  :deep(.el-tabs__active-bar) {
    height: 3px;
    border-radius: 2px;
    background: linear-gradient(90deg, #409EFF 0%, #79bbff 100%);
  }
}

.tab-label {
  text-align: center;
  line-height: 1.4;

  .tab-code {
    font-size: 20px;
    font-weight: 700;
    color: #303133;
    font-family: "Courier New", monospace;
    transition: color 0.3s;
  }

  .tab-meaning {
    font-size: 12px;
    color: #909399;
    transition: color 0.3s;
  }
}

/* 单选组 */
.radio-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-height: 320px;
  overflow-y: auto;
  padding: 4px;

  &::-webkit-scrollbar {
    width: 5px;
  }

  &::-webkit-scrollbar-thumb {
    background: #dcdfe6;
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: #a0cfff;
  }
}

.region-radio {
  padding: 8px 12px;
  border-radius: 8px;
  margin-right: 0;
  transition: all 0.25s;

  :deep(.el-radio__label) {
    display: flex;
    align-items: center;
    gap: 8px;
    padding-left: 8px;
  }

  &:hover {
    background: #ebeef5;
  }

  &.is-checked {
    background: #ecf5ff;

    .radio-name {
      color: #409EFF;
      font-weight: 600;
    }
  }
}

.radio-name {
  font-size: 14px;
  color: #303133;
  transition: color 0.25s;

  &.text-muted {
    color: var(--el-text-color-placeholder);
  }
}

.radio-code {
  font-size: 12px;
  color: #909399;
  font-family: "Courier New", monospace;
  background: #ebeef5;
  padding: 2px 8px;
  border-radius: 4px;
  transition: all 0.25s;
}

.region-radio.is-checked .radio-code {
  background: #d9ecff;
  color: #409EFF;
}

/* 手动输入 */
.manual-input-area {
  padding: 8px 4px;

  .input-hint {
    font-size: 13px;
    color: #909399;
    margin-bottom: 12px;
    padding-left: 4px;
  }

  .manual-input {
    max-width: 300px;

    :deep(.el-input__wrapper) {
      box-shadow: 0 0 0 1px #dcdfe6 inset;
      transition: all 0.3s;

      &:focus-within {
        box-shadow: 0 0 0 1px #409EFF inset, 0 0 0 3px #d9ecff;
      }
    }
  }
}

/* 分隔线 */
.dialog-divider {
  margin: 16px 0;
}

/* 表单 */
.region-form {
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
}

/* 底部按钮 */
.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 0 24px 20px;

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

    .region-dialog :deep(.el-dialog__header) {
      background: linear-gradient(
        135deg,
        rgba(64, 158, 255, 0.08) 0%,
        #fff 60%
      );
    }

    .region-radio {
      &:hover {
        background: #fff;
      }

      &.is-checked {
        background: rgba(64, 158, 255, 0.1);
      }
    }

    .radio-code {
      background: #fff;
    }

    .region-radio.is-checked .radio-code {
      background: rgba(64, 158, 255, 0.15);
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
