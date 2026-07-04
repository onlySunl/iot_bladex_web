<template>
  <div className="app-container">
<!--    <DeviceSearch
        :query-params="queryParams"
        @search="handleQuery"
        @reset="resetQuery"
    />
    <DeviceToolbar
        :single="single"
        :multiple="multiple"
        v-model:view-mode="viewMode"
        @add="openAddDialog"
        @edit="openEditDialog"
        @batch-del="batchDelete"
        @refresh="getList"
    />-->
    <component
        :is="currentView"
        :loading="loading"
        :device-list="deviceList"
        :dictObject="dictObject"
        @selection-change="handleSelectionChange"
        @card-select="handleCardSelection"
        @open-play="openPlayer"
        @more-action="handleMoreAction"
    />
<!--    <DevicePagination
        v-show="total > 0"
        v-model:page-num="queryParams.pageNum"
        v-model:page-size="queryParams.pageSize"
        :total="total"
        @change="getList"
    />-->

    <DeviceFormDialog v-model="open" :title="title" :form="form" :dictObject="dictObject" @success="getList"/>
    <DevicePlayerDialog v-model="easyPlayerOpen" :device-row="deviceRow" :dictObject="dictObject"/>
    <DevicePresetDialog v-model="presetDialogVisible" :form="presetForm" :dictObject="dictObject" @save="savePreset"/>
    <DeviceTimeSync v-model="timeSyncDialogVisible" :form="timeSyncForm" :dictObject="dictObject" @sync="syncTimeSuccess"/>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import {importAllComponents} from '@/views/nvr/qs/device/js/importComp'
// 正确路径 + eager:true
const modules = import.meta.glob('@/views/nvr/qs/device/components/*.vue', { eager: true })
const components = importAllComponents(modules)

console.log(components);
const DeviceSearch = components.DeviceSearch
const DeviceToolbar = components.DeviceToolbar
const DeviceTable = components.DeviceTable
const DeviceCard = components.DeviceCard
const DevicePagination = components.DevicePagination
const DeviceFormDialog = components.DeviceFormDialog
const DevicePlayerDialog = components.DevicePlayerDialog
const DevicePresetDialog = components.DevicePresetDialog
const DeviceTimeSync = components.DeviceTimeSync

import {useDeviceList} from '@/views/nvr/qs/device/js/useDeviceList'
import {useDeviceDialog} from '@/views/nvr/qs/device/js/useDeviceDialog'
import {useDeviceDict} from "@/views/nvr/qs/device/js/useDeviceDict";
const dictObject = useDeviceDict();
const currentView = computed(() => {
  return viewMode.value === 'list' ? DeviceTable : DeviceCard
})

const {
  loading, total, viewMode, ids, single, multiple, deviceList, queryParams,
  getList, handleQuery, resetQuery, handleSelectionChange, batchDelete, handleDeleteRow
} = useDeviceList()

const {
  open, title, form, easyPlayerOpen, deviceRow, presetDialogVisible, presetForm,
  timeSyncDialogVisible, timeSyncForm
} = useDeviceDialog()

const openAddDialog = () => {
  title.value = '新增设备'
  form.value = {}
  open.value = true
}

const openEditDialog = () => {
  const row = deviceList.value.find(item => item.id === ids.value[0])
  title.value = '编辑设备'
  form.value = {...row}
  open.value = true
}

const openPlayer = (row) => {
  deviceRow.value = row
  easyPlayerOpen.value = true
}

const handleMoreAction = (command, row) => {
  switch (command) {
    case 'edit':
      openEditDialog();
      break
    case 'delete':
      handleDeleteRow(row);
      break
    case 'timeSync':
      openTimeSync(row);
      break
  }
}

const handleCardSelection = () => {
  const selected = deviceList.value.filter(i => i.checked)
  handleSelectionChange(selected)
}

const openTimeSync = (row) => {
  timeSyncForm.deviceId = row.id
  timeSyncForm.deviceIp = row.ipAddress
  timeSyncForm.deviceType = row.type
  timeSyncDialogVisible.value = true
}

const savePreset = () => getList()
const syncTimeSuccess = () => getList()
</script>

<style scoped>
@import './styles/device.scss';
</style>