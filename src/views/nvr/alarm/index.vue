<template>

  <div class="app-container">
    <div class="search-box">
      <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px" class="query-form">
        <el-form-item label="设备名称" prop="deviceName">
          <el-input
            v-model="queryParams.deviceName"
            placeholder="请输入设备名称"
            clearable
            @keyup.enter="handleQuery"
          />
        </el-form-item>
        <el-form-item label="SDK类型" prop="sdkType">
          <el-select v-model="queryParams.sdkType" placeholder="请选择SDK类型" clearable style="width: 240px">
            <el-option label="海康" value="hik" />
            <el-option label="海康ISUP" value="hik_isup" />
            <el-option label="大华" value="dahua" />
            <el-option label="宇视" value="uniview" />
            <el-option label="天地伟业" value="tiandy" />
            <el-option label="国标28181" value="gb28181" />
            <el-option label="其他" value="other" />
          </el-select>
        </el-form-item>
        <el-form-item label="告警类型" prop="alarmType">
          <el-select v-model="queryParams.alarmType" placeholder="请选择告警类型" clearable style="width: 240px">
            <el-option label="动态检测" value="motion" />
            <el-option label="动态检测扩展" value="motion_ex" />
            <el-option label="视频丢失" value="video_loss" />
            <el-option label="视频丢失扩展" value="video_loss_ex" />
            <el-option label="视频遮挡" value="cover" />
            <el-option label="视频遮挡扩展" value="cover_ex" />
            <el-option label="外部报警" value="alarm_in" />
            <el-option label="外部报警扩展" value="alarm_ex" />
            <el-option label="硬盘满" value="disk_full" />
            <el-option label="硬盘错误" value="disk_error" />
            <el-option label="越界检测" value="cross_line" />
            <el-option label="区域入侵" value="enter_area" />
            <el-option label="区域离开" value="leave_area" />
            <el-option label="物品移除" value="object_remove" />
            <el-option label="物品遗留" value="object_leave" />
            <el-option label="人脸检测" value="face_detection" />
            <el-option label="其他" value="other" />
          </el-select>
        </el-form-item>
        <el-form-item label="告警级别" prop="alarmLevel">
          <el-select v-model="queryParams.alarmLevel" placeholder="请选择告警级别" clearable style="width: 240px">
            <el-option label="低" value="low" />
            <el-option label="中" value="medium" />
            <el-option label="高" value="high" />
            <el-option label="紧急" value="critical" />
          </el-select>
        </el-form-item>
        <el-form-item label="处理状态" prop="handled">
          <el-select v-model="queryParams.handled" placeholder="请选择处理状态" clearable style="width: 240px">
            <el-option label="未处理" :value="0" />
            <el-option label="已处理" :value="1" />
          </el-select>
        </el-form-item>
        <el-form-item label="告警时间">
          <el-date-picker
            v-model="dateRange"
            type="daterange"
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="YYYY-MM-DD"
          ></el-date-picker>
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
            icon="el-icon-check"
            :disabled="multiple"
            @click="handleBatchHandle"
            class="action-btn handle-btn"
          >批量处理
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
        <el-col :span="1.5">
          <el-button
            type="warning"
            plain
            icon="el-icon-download"
            @click="handleExport"
          >导出</el-button>
        </el-col>
        <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
      </el-row>
    </div>

    <div class="table-wrapper">
      <el-table
        v-loading="loading"
        :data="alarmList"
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
import { delAlarm, listAlarm, exportAlarm, updateAlarm, batchHandleAlarm } from '@/api/nvr/alarm'
import useUserStore from '@/store/modules/user'
import { ElMessage, ElMessageBox } from 'element-plus'

export default {
  name: 'small-padding fixed-width',
  data() {
    return {
      pageNum: 1,
      pageSize: 10,
      deviceName: undefined,
      sdkType: undefined,
      alarmType: undefined,
      alarmLevel: undefined,
      handled: undefined,
      beginTime: undefined,
      loading: true,
      showSearch: true,
      ids: [] as number[],
      single: true,
      multiple: true,
      total: 0,
    }
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
  padding: 4px 0;
  animation: fadeInUp 0.4s ease-out 0.2s both;
}

.action-buttons {
  display: flex;
  gap: 12px;
  margin-top: 12px;
  align-items: center;
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

.handle-btn:not(:disabled):hover {
  box-shadow: 0 6px 16px #c6e2ff;
}

.delete-btn:not(:disabled):hover {
  box-shadow: 0 6px 16px var(--el-color-danger-light-7);
}

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

.table-wrapper {
  background: #fff;
  border-radius: 10px;
  border: 1px solid #ebeef5;
  box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.04);
  overflow: hidden;
  animation: fadeInUp 0.4s ease-out 0.25s both;
  transition: box-shadow 0.3s;
}

.table-wrapper:hover {
  box-shadow: 0 4px 16px 0 rgba(0, 0, 0, 0.06);
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
  color: #ffffff !important;
}

.table-actions .el-button--primary,
.table-actions .el-button--primary[text],
.table-actions .el-button--primary[text][bg] {
  color: #ffffff !important;
  background-color: #409EFF !important;
  border-color: #409EFF !important;
}

.table-actions .el-button--success,
.table-actions .el-button--success[text],
.table-actions .el-button--success[text][bg] {
  color: #ffffff !important;
  background-color: #67C23A !important;
  border-color: #67C23A !important;
}

.table-actions .el-button--danger,
.table-actions .el-button--danger[text],
.table-actions .el-button--danger[text][bg] {
  color: #ffffff !important;
  background-color: #F56C6C !important;
  border-color: #F56C6C !important;
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
</style>
