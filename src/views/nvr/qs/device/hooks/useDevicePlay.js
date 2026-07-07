import { ref } from 'vue'
import { startPtz, endPtz, getPresetList, setPreset, gotoPreset, deletePreset } from '@/api/nvr/device'

export const controSpeed = ref(5)
export const controSpeedMax = ref(10)
export const controSpeedMin = ref(1)
export const lastPtzCommand = ref('up')
export const presetList = ref([])
export const selectedPresetIndex = ref(null)
export const newPresetIndex = ref(1)
export const newPresetName = ref('')
export const lightOn = ref(false)
export const wiperOn = ref(false)
export const captureLoading = ref(false)

export function useDevicePlay() {
    const ptzCamera = async (cmd, row) => {
        if (cmd === 'stop') {
            await endPtz(row.id)
            return
        }
        lastPtzCommand.value = cmd
        await startPtz(row.id, cmd, controSpeed.value)
    }

    const loadPresetList = async (deviceId) => {
        const res = await getPresetList(deviceId)
        presetList.value = res
    }

    const handleGotoPreset = async (deviceId) => {
        await gotoPreset(deviceId, selectedPresetIndex.value)
    }

    const handleSetPreset = async (deviceId) => {
        await setPreset(deviceId, presetForm.index, presetForm.name)
        loadPresetList(deviceId)
    }

    const handleDeletePreset = async (deviceId) => {
        await deletePreset(deviceId, selectedPresetIndex.value)
        loadPresetList(deviceId)
    }

    return {
        controSpeed,
        controSpeedMax,
        controSpeedMin,
        lastPtzCommand,
        presetList,
        selectedPresetIndex,
        newPresetIndex,
        newPresetName,
        lightOn,
        wiperOn,
        captureLoading,
        ptzCamera,
        loadPresetList,
        handleGotoPreset,
        handleSetPreset,
        handleDeletePreset
    }
}