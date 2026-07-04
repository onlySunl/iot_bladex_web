import { ref, reactive } from 'vue'

// 新增编辑弹窗
export const open = ref(false)
export const title = ref('')
export const form = reactive({})
export const showAdvanced = ref(false)

// 播放弹窗
export const easyPlayerOpen = ref(false)
export const deviceRow = ref({})
export const rtcUrl = ref("")
export const flvUrl = ref("")
export const wsUrl = ref('')
export const tabActiveName = ref('media')
export const streamInfo = ref({})
export const quality = ref(['普清', '高清', '超清'])
export const defaultQuality = ref('高清')
export const isPtz = ref(true)
export const isPresetSupported = ref(true)
export const isGb281Device = ref(false)
export const isQuality = ref(true)
export const isLive = ref(true)
export const sharedIframe = ref(null)

// 预置点弹窗
export const presetDialogVisible = ref(false)
export const presetForm = reactive({ index: 1, name: '' })

// 校时弹窗
export const timeSyncDialogVisible = ref(false)
export const timeSyncForm = reactive({
    deviceId: null,
    deviceIp: '',
    deviceType: '',
    deviceTime: '',
    syncTime: '',
    syncType: false
})

// 其余弹窗变量省略，逻辑完全一致
export function useDeviceDialog() {
    return {
        open, title, form, showAdvanced,
        easyPlayerOpen, deviceRow, rtcUrl, flvUrl, wsUrl, tabActiveName, streamInfo, quality, defaultQuality, isPtz, isPresetSupported, isGb281Device, isQuality, isLive, sharedIframe,
        presetDialogVisible, presetForm,
        timeSyncDialogVisible, timeSyncForm
    }
}