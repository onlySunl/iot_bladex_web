import { ref, reactive } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
    pageQsDevice,
    addQsDevice,
    updateQsDevice,
    removeQsDevice,
    changeDeviceStatus
} from '@/api/nvr/device'

export function useDeviceTable() {
    // 表格基础
    const tableData = ref([])
    const loading = ref(false)
    const selectedIds = ref([])
    const form = ref({})

    // 分页
    const page = reactive({
        currentPage: 1,
        pageSize: 20,
        total: 0
    })

    // 搜索参数
    const searchParams = reactive({
        deviceName: '',
        deviceCode: '',
        type: '',
        status: '',
        deviceStatus: ''
    })

    // 加载列表
    const loadData = async () => {
        loading.value = true
        try {
            const params = {
                ...searchParams,
                current: page.currentPage,
                size: page.pageSize
            }
            const res = await pageQsDevice(params)
            tableData.value = res.data.records || []
            page.total = res.data.total || 0
        } catch (e) {
            ElMessage.error(e.message || '加载数据失败')
        } finally {
            loading.value = false
        }
    }

    // 搜索
    const handleSearchChange = (params, done) => {
        Object.assign(searchParams, params)
        page.currentPage = 1
        loadData()
        done()
    }
    const handleSearchReset = () => {
        Object.assign(searchParams, {
            deviceName: '',
            deviceCode: '',
            type: '',
            status: '',
            deviceStatus: ''
        })
        page.currentPage = 1
        loadData()
    }

    // 分页切换
    const handleCurrentChange = (current) => {
        page.currentPage = current
        loadData()
    }
    const handleSizeChange = (size) => {
        page.pageSize = size
        page.currentPage = 1
        loadData()
    }

    // 多选
    const handleSelectionChange = (list) => {
        selectedIds.value = list.map(item => item.id)
    }

    // 弹窗打开前置
    const handleBeforeOpen = (done, type) => {
        if (type === 'edit') {
            form.value = {...form.value}
        } else {
            form.value = {
                status: 1,
                streamType: 0,
                protocol: 0
            }
        }
        done()
    }

    // 新增保存
    const handleRowSave = async (row, done, loadingFn) => {
        try {
            await addQsDevice(row)
            ElMessage.success('新增成功')
            done()
            loadData()
        } catch (e) {
            loadingFn()
            ElMessage.error(e.message || '新增失败')
        }
    }

    // 编辑更新
    const handleRowUpdate = async (row, index, done, loadingFn) => {
        try {
            await updateQsDevice({...row})
            ElMessage.success('修改成功')
            done()
            loadData()
        } catch (e) {
            loadingFn()
            ElMessage.error(e.message || '修改失败')
        }
    }

    // 删除单条
    const handleRowDel = async (row) => {
        try {
            await ElMessageBox.confirm('确定删除该设备？删除后无法恢复', '提示', {type: 'warning'})
            await removeQsDevice(row.id)
            ElMessage.success('删除成功')
            loadData()
        } catch (e) {
            if (e !== 'cancel') {
                ElMessage.error(e.message || '删除失败')
            }
        }
    }

    // 状态开关
    const handleStatusChange = async (row, val) => {
        const newStatus = val ? 1 : 0
        try {
            await changeDeviceStatus(row.id, newStatus)
            row.status = newStatus
            ElMessage.success('状态修改成功')
        } catch (e) {
            ElMessage.error(e.message || '状态修改失败')
        }
    }

    return {
        tableData,
        loading,
        selectedIds,
        form,
        page,
        searchParams,
        loadData,
        handleSearchChange,
        handleSearchReset,
        handleCurrentChange,
        handleSizeChange,
        handleSelectionChange,
        handleBeforeOpen,
        handleRowSave,
        handleRowUpdate,
        handleRowDel,
        handleStatusChange
    }
}