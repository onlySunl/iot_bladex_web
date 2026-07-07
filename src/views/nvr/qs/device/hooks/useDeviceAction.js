import { ElMessageBox, ElMessage } from 'element-plus'
import { copyText } from 'vue3-clipboard'
import { rebootDevice, exportQsDevice, removeQsDevice } from '@/api/nvr/device'

export function useDeviceAction(tableHook, dialogHook) {
    const { selectedIds, loadData, handleRowDel } = tableHook
    const { currentDevice, presetDialogVisible, ptzDialogVisible, timeSyncDialogVisible, recordDownloadVisible } = dialogHook

    // 菜单命令分发
    const handleCommand = async (command, row) => {
        currentDevice.value = row
        switch (command) {
            case 'play':
                dialogHook.handlePlay(row)
                break
            case 'snapshot':
                dialogHook.handleSnapshot(row)
                break
            case 'config':
                dialogHook.handleConfig(row)
                break
            case 'reboot':
                await handleReboot(row)
                break
            case 'preset':
                presetDialogVisible.value = true
                break
            case 'ptz':
                ptzDialogVisible.value = true
                break
            case 'timeSync':
                timeSyncDialogVisible.value = true
                break
            case 'recordDownload':
                recordDownloadVisible.value = true
                break
            case 'delete':
                await handleRowDel(row)
                break
        }
    }

    // 重启设备
    const handleReboot = async (row) => {
        try {
            await ElMessageBox.confirm('确定重启该设备？', '提示', {type: 'warning'})
            await rebootDevice(row.id)
            ElMessage.success('重启指令已发送')
        } catch (e) {
            if (e !== 'cancel') {
                ElMessage.error(e.message || '重启失败')
            }
        }
    }

    // 批量删除
    const handleBatchDelete = async () => {
        if (selectedIds.value.length === 0) {
            ElMessage.warning('请选择设备')
            return
        }
        try {
            await ElMessageBox.confirm(`确定删除选中的 ${selectedIds.value.length} 台设备？`, '提示', {type: 'warning'})
            for (const id of selectedIds.value) {
                await removeQsDevice(id)
            }
            ElMessage.success('批量删除成功')
            loadData()
        } catch (e) {
            if (e !== 'cancel') {
                ElMessage.error(e.message || '删除失败')
            }
        }
    }

    // 导出
    const handleExport = async () => {
        try {
            const res = await exportQsDevice(tableHook.searchParams)
            const blob = new Blob([res.data], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'})
            const url = window.URL.createObjectURL(blob)
            const link = document.createElement('a')
            link.href = url
            link.download = '设备列表.xlsx'
            link.click()
            window.URL.revokeObjectURL(url)
            ElMessage.success('导出成功')
        } catch (e) {
            ElMessage.error(e.message || '导出失败')
        }
    }

    // 复制文本
    const handleCopy = (text) => {
        copyText(text)
        ElMessage.success('复制成功')
    }

    // avue内置编辑/查看
    const handleUpdate = (row, crudRef) => {
        crudRef.value?.rowInit(row)
    }
    const handleView = (row, crudRef) => {
        crudRef.value?.rowInit(row, 'view')
    }

    // 设备类型判断
    const canReboot = (row) => [5, 7, 8, 9, 12, 14].includes(row.type)
    const isGb28181 = (row) => row.type === 5
    const canTimeSync = (row) => [5, 7, 8, 9].includes(row.type)
    const canDownloadRecord = (row) => [7, 8, 9].includes(row.type)

    return {
        handleCommand,
        handleReboot,
        handleBatchDelete,
        handleExport,
        handleCopy,
        handleUpdate,
        handleView,
        canReboot,
        isGb28181,
        canTimeSync,
        canDownloadRecord
    }
}