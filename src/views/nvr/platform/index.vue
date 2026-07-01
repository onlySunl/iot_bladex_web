<template>

  <div class="app-container">
    <div class="search-box">
      <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="130px" class="query-form">
        <el-form-item label="平台名称" prop="name">
          <el-input
            v-model="queryParams.name"
            placeholder="请输入平台名称"
            clearable
            @keyup.enter="handleQuery"
          />
        </el-form-item>
        <el-form-item label="国标编码" prop="serverGbId">
          <el-input
            v-model="queryParams.serverGbId"
            placeholder="请输入国标编码"
            clearable
            @keyup.enter="handleQuery"
          />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="queryParams.status" placeholder="请选择状态" clearable style="width: 250px;">
            <el-option label="离线" :value="0"/>
            <el-option label="在线" :value="1"/>
          </el-select>
        </el-form-item>
        <el-form-item class="form-actions">
          <div class="button-group">
            <el-button type="primary" icon="el-icon-search" @click="handleQuery" class="search-btn">搜索</el-button>
            <el-button icon="el-icon-refresh" @click="resetQuery" class="reset-btn">重置</el-button>
          </div>
        </el-form-item>
      </el-form>

      <el-row :gutter="10" class="mb8 toolbar-row action-buttons">
        <el-col :span="1.5">
          <el-button
            type="primary"
            plain
            icon="el-icon-plus"
            @click="handleAdd"
            class="action-btn add-btn"
          >新增
          </el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
            type="success"
            plain
            icon="el-icon-edit"
            :disabled="single"
            @click="handleUpdate"
            class="action-btn edit-btn"
          >修改
          </el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
            type="danger"
            plain
            icon="el-icon-delete"
            :disabled="multiple"
            @click="handleDelete"
            class="action-btn delete-btn"
          >删除
          </el-button>
        </el-col>
        <right-toolbar :showSearch.sync="showSearch" :viewMode.sync="viewMode" :showViewSwitch="true" @queryTable="getList"/>
      </el-row>
    </div>

    <div v-if="viewMode === 'list'" class="table-wrapper">
      <el-table
        v-loading="loading"
        :data="platformList"
        @selection-change="handleSelectionChange"
        class="custom-table"
        highlight-current-row
      >
        <el-table-column type="selection" width="55" align="center" fixed/>
        <el-table-column label="编号" align="center" prop="id" width="70" fixed>
          <template slot-scope="scope">
            <span class="id-badge">{{ scope.row.id }}</span>
          
</template>

<script>
import {listPlatform, getPlatform, delPlatform, addPlatform, updatePlatform, unregisterPlatform, registerPlatform, pushCatalog} from '@/api/nvr/platform';
import AssociatedChannel from './associatedChannel.vue';

export default {
  name: 'small-padding fixed-width fixed-right',
  components: {
    AssociatedChannel,
  },
  data() {
    return {
      showSearch: true,
      viewMode: 'card',
      loading: true,
      open: false,
      ids: [],
      single: true,
      multiple: true,
      total: 0,
      title: '',
      platformList: [],
      associatedOpen: false,
      associatedPlatformId: null,
      form: {},
    }
  },
  mounted() {
    getList();
  },
  methods: {
    getList() {
      loading = true;
        listPlatform(queryParams).then(response => {
          platformList = response.rows.map(row => ({
            ...row,
            checked: false
          }));
          total = response.total;
          loading = false;
        });
    },
    cancel() {
      open = false;
        reset();
    },
    reset() {
      form = {
          id: null,
          enable: 1,
          name: null,
          serverGbId: null,
          serverGbDomain: null,
          serverIp: null,
          serverPort: null,
          deviceGbId: '34020000001320000001',
          deviceIp: null,
          devicePort: null,
          username: '34020000001320000001',
          password: null,
          expires: 3600,
          keepTimeout: 60,
          transport: 'UDP',
          civilCode: null,
          manufacturer: null,
          model: null,
          address: null,
          characterSet: 'GB2312',
          ptz: 1,
          rtcp: 1,
          status: 0,
          catalogGroup: null,
          registerWay: null,
          secrecy: null,
          asMessageChannel: 1,
          catalogWithPlatform: 1,
          catalogWithGroup: 0,
          catalogWithRegion: 0,
          autoPushChannel: 1,
          sendStreamIp: null,
          serverId: null
        };
        proxy.resetForm('formRef');
    },
    handleQuery() {
      queryParams.pageNum = 1;
        getList();
    },
    resetQuery() {
      proxy.resetForm('queryRef');
        handleQuery();
    },
    handleSelectionChange(selection) {
      ids = selection.map(item => item.id);
        single = selection.length !== 1;
        multiple = !selection.length;
    },
    handleCardSelection() {
      const selected = platformList.filter(item => item.checked);
        ids = selected.map(item => item.id);
        single = selected.length !== 1;
        multiple = !selected.length;
    },
    handleAdd() {
      reset();
        open = true;
        title = '添加国标GB28181平台配置';
    },
    handleAssociated(row) {
      associatedPlatformId = row.id;
        associatedOpen = true;
    },
    handleUpdate(row) {
      reset();
        const id = row.id || ids[0];
        getPlatform(id).then(response => {
          form = response.data;
          open = true;
          title = '修改国标GB28181平台配置';
        });
    },
    submitForm() {
      this.$refs['formRef'].validate(valid => {
          if (valid) {
            if (form.id != null) {
              updatePlatform(form).then(response => {
                this.$modal.msgSuccess('修改成功');
                open = false;
                getList();
              });
            } else {
              addPlatform(form).then(response => {
                this.$modal.msgSuccess('新增成功');
                open = false;
                getList();
              });
            }
          }
        });
    },
    handleDelete(row) {
      const id = row.id || ids;
        this.$modal.confirm('是否确认删除国标GB28181平台配置编号为"' + id + '"的数据项？').then(() => {
          return delPlatform(id);
        }).then(() => {
          getList();
          this.$modal.msgSuccess('删除成功');
        }).catch(() => {
        });
    },
    handleRegister(row) {
      this.$modal.confirm('是否确认上线平台"' + row.name + '"？').then(() => {
          return registerPlatform(row.id);
        }).then(() => {
          getList();
          this.$modal.msgSuccess('上线成功');
        }).catch(() => {
        });
    },
    handleUnregister(row) {
      this.$modal.confirm('是否确认注销平台"' + row.name + '"？').then(() => {
          return unregisterPlatform(row.id);
        }).then(() => {
          getList();
          this.$modal.msgSuccess('注销成功');
        }).catch(() => {
        });
    },
    handlePushCatalog(row) {
      this.$modal.confirm('是否确认推送通道到平台"' + row.name + '"？').then(() => {
          return pushCatalog(row.id);
        }).then(() => {
          this.$modal.msgSuccess('推送成功');
        }).catch(() => {
        });
    },
    handleEnableChange(row) {
      const text = row.enable === 1 ? '启用' : '禁用';
        this.$modal.confirm('是否确认' + text + '平台"' + row.name + '"？').then(() => {
          return updatePlatform({id: row.id, enable: row.enable});
        }).then(() => {
          this.$modal.msgSuccess(text + '成功');
        }).catch(() => {
          row.enable = row.enable === 1 ? 0 : 1;
        });
    },
  },
}
</script>

<style lang="scss" scoped>
.app-container {
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

.search-box {
  margin-bottom: 16px;
}

.query-form {
  padding: 14px 16px;
  background: #fff;
  border-radius: 12px;
  border: 1px solid #ebeef5;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.04);
  margin-bottom: 0important;
  animation: fadeInUp 0.4s ease-out 0.15s both;
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  gap: 12px;

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

.toolbar-row {
  padding: 6px 0;
  animation: fadeInUp 0.4s ease-out 0.2s both;
}

.action-buttons {
  display: flex;
  gap: 12px;
  margin-top: 14px;
  align-items: center;
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

.delete-btn:not(:disabled) {
  box-shadow: 0 6px 16px var(--el-color-danger-light-7);
}

.form-actions {
  margin-left: autoimportant;
  margin-right: 0important;
  padding-left: 16px;
  border-left: 1px solid #ebeef5;
  margin-left: 12pximportant;

  .button-group {
    display: flex;
    gap: 12px;
  }
}

.table-wrapper {
  background: #fff;
  border-radius: 12px;
  border: 1px solid #ebeef5;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.04);
  overflow: hidden;
  animation: fadeInUp 0.4s ease-out 0.25s both;
  transition: box-shadow 0.3s;
}

.table-wrapper:hover {
  box-shadow: 0 4px 20px 0 rgba(0, 0, 0, 0.06);
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
          animation-delay: #{$i * 0.03 + 0.25}s;
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

:deep(.el-pagination) {
  padding: 12px 0;
  animation: fadeInUp 0.4s ease-out 0.3s both;
}

:deep(.el-pagination__total) {
  color: #909399;
}

:deep(.el-pagination__sizes) .el-input__wrapper {
  box-shadow: 0 0 0 1px #dcdfe6 inset;
}

:deep(.el-pager li) {
  transition: all 0.3s;
}

:deep(.el-pager li:hover:not(.is-active)) {
  color: #409EFF;
  transform: translateY(-1px);
}

:deep(.el-pager li.is-active) {
  box-shadow: 0 2px 8px #a0cfff;
}

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

.table-actions .el-button--success,
.table-actions .el-button--success[text],
.table-actions .el-button--success[text][bg] {
  color: #ffffffimportant;
  background-color: #67C23A !important;
  border-color: #67C23A !important;
}

.table-actions .el-button--warning,
.table-actions .el-button--warning[text],
.table-actions .el-button--warning[text][bg] {
  color: #ffffffimportant;
  background-color: #E6A23C !important;
  border-color: #E6A23C !important;
}

.table-actions .el-button--info,
.table-actions .el-button--info[text],
.table-actions .el-button--info[text][bg] {
  color: #ffffffimportant;
  background-color: var(--el-color-info) !important;
  border-color: var(--el-color-info) !important;
}

.input-suffix {
  color: #909399;
  font-size: 13px;
}

.form-divider {
  margin: 20px 0;
  border-color: #ebeef5;

  :deep(.el-divider__text) {
    background: #ebeef5;
    padding: 0 16px;
    font-size: 13px;
    color: #909399;
    font-weight: 500;
  }
}

.section-divider {
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 28px 0 20px;
  animation: fadeInUp 0.4s ease-out 0.15s both;
}

.section-divider-icon-wrapper {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: linear-gradient(135deg, var(--el-color-primary-light-6) 0%, var(--el-color-primary-light-4) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 3px 10px rgba(64, 158, 255, 0.18);
}

.section-divider-icon {
  font-size: 18px;
  color: #ffffff;
}

.section-divider-title {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
}

.section-divider-line {
  flex: 1;
  height: 1px;
  background: linear-gradient(90deg, var(--el-color-primary-light-4) 0%, transparent 100%);
}

.card-view {
  animation: fadeInUp 0.4s ease-out 0.25s both;
}

/* 4列网格布局 */
.card-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}

@media (max-width: 1400px) {
  .card-grid { grid-template-columns: repeat(3, 1fr); }
}
@media (max-width: 1000px) {
  .card-grid { grid-template-columns: repeat(2, 1fr); }
}
@media (max-width: 640px) {
  .card-grid { grid-template-columns: 1fr; }
}

.platform-card {
  background: #fff;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.04);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 2px solid transparent;
  animation: cardFadeIn 0.4s ease-out both;
  display: flex;
  flex-direction: column;

  @for $i from 1 through 20 {
    &:nth-child(#{$i}) {
      animation-delay: #{$i * 0.04 + 0.25}s;
    }
  }

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 32px rgba(0, 0, 0, 0.12);
    border-color: var(--el-color-primary-light-4);
  }

  &.is-selected {
    border-color: #409EFF;
    box-shadow: 0 0 0 1px #409EFF, 0 8px 28px var(--el-color-primary-light-6);
  }

  &.is-online {
    .card-header {
      background: linear-gradient(135deg, var(--el-color-success-light-9) 0%, #fff 100%);
    }
  }
}

@keyframes cardFadeIn {
  from {
    opacity: 0;
    transform: translateY(16px) scale(0.96);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.card-header {
  padding: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #ebeef5;
  background: linear-gradient(135deg, #f5f7fa 0%, #fff 100%);
  transition: background 0.3s;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
}

.card-checkbox {
  flex-shrink: 0;

  :deep(.el-checkbox__input) {
    .el-checkbox__inner {
      border-color: #dcdfe6;
      background: #fff;
    }
  }

  :deep(.el-checkbox__input.is-checked) {
    .el-checkbox__inner {
      background-color: #409EFF;
      border-color: #409EFF;
    }
  }
}

.platform-icon {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: linear-gradient(135deg, #a0cfff 0%, #79bbff 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  box-shadow: 0 4px 12px var(--el-color-primary-light-6);

  .el-icon {
    font-size: 20px;
    color: #ffffff;
  }
}

.platform-name {
  font-size: 15px;
  font-weight: 600;
  color: #303133;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 180px;
}

.status-badge {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 20px;
  background: #f5f7fa;
  flex-shrink: 0;

  &.online {
    background: var(--el-color-success-light-8);
  }

  &.offline {
    background: var(--el-color-danger-light-8);
  }
}

.status-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #F56C6C;
  flex-shrink: 0;
  box-shadow: 0 0 0 4px var(--el-color-danger-light-9);

  &.online {
    background: #67C23A;
    box-shadow: 0 0 0 4px var(--el-color-success-light-9);
  }

  &.offline {
    background: #F56C6C;
    box-shadow: 0 0 0 4px var(--el-color-danger-light-9);
  }

  &.pulse {
    animation: statusPulse 2s ease-in-out infinite;
  }

  &.breathe {
    animation: statusBreathe 2s ease-in-out infinite;
  }
}

@keyframes statusPulse {
  0%, 100% {
    box-shadow: 0 0 0 4px var(--el-color-success-light-9), 0 0 0 0 rgba(16, 185, 129, 0.4);
    opacity: 1;
  }
  50% {
    box-shadow: 0 0 0 4px var(--el-color-success-light-9), 0 0 0 12px rgba(16, 185, 129, 0);
    opacity: 0.8;
  }
}

@keyframes statusBreathe {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.4;
  }
}

.status-text {
  font-size: 12px;
  font-weight: 600;
  color: #303133;
}

.card-body {
  padding: 16px;
  flex: 1;
}

.info-row {
  display: flex;
  gap: 12px;
  margin-bottom: 12px;

  &:last-child {
    margin-bottom: 0;
  }
}

.info-item {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 4px;

  &.full {
    flex: 0 0 100%;
  }
}

.info-label {
  font-size: 12px;
  color: #909399;
  font-weight: 500;
}

.info-value {
  font-size: 13px;
  color: #303133;
  font-weight: 600;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  padding: 6px 10px;
  background: #f5f7fa;
  border-radius: 6px;
}

.card-footer {
  padding: 0 16px 16px;
  display: flex;
  align-items: center;
  gap: 12px;
  border-top: 1px solid #ebeef5;
  padding-top: 14px;
}

.btn-primary {
  flex: 1;
  font-weight: 600;
}

.footer-actions {
  display: flex;
  gap: 6px;
}

.footer-actions .el-button {
  color: #ffffffimportant;
}

.footer-actions .el-button--primary,
.footer-actions .el-button--primary[text],
.footer-actions .el-button--primary[text][bg] {
  color: #ffffffimportant;
  background-color: #409EFF !important;
  border-color: #409EFF !important;
}

.footer-actions .el-button--danger,
.footer-actions .el-button--danger[text],
.footer-actions .el-button--danger[text][bg] {
  color: #ffffffimportant;
  background-color: #F56C6C !important;
  border-color: #F56C6C !important;
}

.footer-actions .el-button--success,
.footer-actions .el-button--success[text],
.footer-actions .el-button--success[text][bg] {
  color: #ffffffimportant;
  background-color: #67C23A !important;
  border-color: #67C23A !important;
}

.footer-actions .el-button--warning,
.footer-actions .el-button--warning[text],
.footer-actions .el-button--warning[text][bg] {
  color: #ffffffimportant;
  background-color: #E6A23C !important;
  border-color: #E6A23C !important;
}

.footer-actions .el-button--info,
.footer-actions .el-button--info[text],
.footer-actions .el-button--info[text][bg] {
  color: #ffffffimportant;
  background-color: var(--el-color-info) !important;
  border-color: var(--el-color-info) !important;
}
</style>
