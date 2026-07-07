import { ref, nextTick } from 'vue'

export function useDeviceDialog(form) {
    // 弹窗开关
    const playerDialogVisible = ref(false)
    const configDialogVisible = ref(false)
    const presetDialogVisible = ref(false)
    const ptzDialogVisible = ref(false)
    const timeSyncDialogVisible = ref(false)
    const recordDownloadVisible = ref(false)
    const snapshotDialogVisible = ref(false)

    // 当前操作设备
    const currentDevice = ref(null)
    // 地图弹窗
    const mapSelectVisible = ref(false)
    const selectMapPositionRef = ref(null)

    const openMapSelect = () => {
        mapSelectVisible.value = true
        nextTick(() => {
            if (selectMapPositionRef.value) {
                selectMapPositionRef.value.openDialog({
                    lat: form.value.latitude,
                    lng: form.value.longitude
                })
            }
        })
    }

    const handleMapSelect = (data) => {
        if (data && data.lat && data.lng) {
            form.value.latitude = data.lat
            form.value.longitude = data.lng
            if (data.address) form.value.address = data.address
        }
        mapSelectVisible.value = false
    }

    // 打开播放弹窗：仅赋值设备+打开，自动由子组件watch执行播放
    const handlePlay = (row) => {
        currentDevice.value = row
        playerDialogVisible.value = true
    }
    const handleSnapshot = (row) => {
        currentDevice.value = row
        snapshotDialogVisible.value = true
    }
    const handleConfig = (row) => {
        currentDevice.value = row
        configDialogVisible.value = true
    }

    return {
        selectMapPositionRef,
        playerDialogVisible,
        configDialogVisible,
        presetDialogVisible,
        ptzDialogVisible,
        timeSyncDialogVisible,
        recordDownloadVisible,
        snapshotDialogVisible,
        currentDevice,
        mapSelectVisible,
        openMapSelect,
        handleMapSelect,
        handlePlay,
        handleSnapshot,
        handleConfig
    }
}