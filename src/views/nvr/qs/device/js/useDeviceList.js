import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { listDevice, addDevice, updateDevice, delDevice, changeDeviceStatus } from '@/api/nvr/qs/device'

export function useDeviceList() {
    const loading = ref(true)
    const total = ref(0)
    const viewMode = ref('list')
    const ids = ref([])
    const single = ref(true)
    const multiple = ref(true)
    const deviceList = ref([])

    const queryParams = reactive({
        pageNum: 1,
        pageSize: 10,
        deviceName: '',
        ipAddress: '',
        type: undefined,
        status: undefined,
        deviceStatus: undefined
    })

    const getList = async () => {
        loading.value = true
        const res = await listDevice(queryParams)
        deviceList.value = res.data.records
        total.value = res.total
        loading.value = false
    }

    const handleQuery = () => {
        queryParams.pageNum = 1
        getList()
    }

    const resetQuery = () => {
        queryParams.deviceName = ''
        queryParams.ipAddress = ''
        queryParams.type = undefined
        queryParams.status = undefined
        queryParams.deviceStatus = undefined
        queryParams.pageNum = 1
        getList()
    }

    const handleSelectionChange = (val) => {
        ids.value = val.map(item => item.id)
        single.value = val.length !== 1
        multiple.value = val.length === 0
    }

    const handleStatusChange = async (row) => {
        await changeDeviceStatus(row.id, row.status)
        ElMessage.success('状态修改成功')
        getList()
    }

    const handleDeleteRow = async (row) => {
        await ElMessageBox.confirm('确定删除该设备？删除后无法恢复', '提示')
        await delDevice(row.id)
        ElMessage.success('删除成功')
        getList()
    }

    const batchDelete = async () => {
        if (ids.value.length === 0) return ElMessage.warning('请选择设备')
        await ElMessageBox.confirm(`确定删除${ids.value.length}台设备？`, '提示')
        for (const id of ids.value) await delDevice(id)
        ElMessage.success('批量删除完成')
        getList()
    }

    onMounted(getList)

    return {
        loading, total, viewMode, ids, single, multiple, deviceList, queryParams,
        getList, handleQuery, resetQuery, handleSelectionChange, handleStatusChange, handleDeleteRow, batchDelete
    }
}