import { ElMessage } from 'element-plus'
import { listGroup } from '@/api/nvr/group'
import { getMediaServerList } from '@/api/nvr/zlm'
import { getDictionary } from '@/api/system/dict'

export function useDeviceDict() {
    const dict = ref({
        qs_live_stream_type: [],
        qs_device_status: [],
        qs_status: [],
        qs_stream_type: [],
        qs_protocol: [],
        qs_online_type: [],
        qs_onvif_auth: []
    })
    const groupList = ref([])
    const mediaServerList = ref([])

    // 加载字典
    const loadDict = async () => {
        const dictKeys = ['qs_stream_mode','qs_live_stream_type', 'qs_device_status', 'qs_status', 'qs_stream_type', 'qs_protocol', 'qs_online_type', 'qs_onvif_auth']
        for (const key of dictKeys) {
            try {
                const res = await getDictionary({code: key})
                dict[key] = res.data?.data || []
            } catch (e) {
                console.warn(`加载字典 ${key} 失败`, e)
            }
        }
    }

    // 加载分组
    const loadGroupList = async () => {
        try {
            const res = await listGroup({})
            groupList.value = res.data.data || []
        } catch (e) {
            console.warn('加载分组列表失败', e)
        }
    }

    // 加载流媒体服务
    const loadMediaServerList = async () => {
        try {
            const res = await getMediaServerList({})
            mediaServerList.value = res.data.data || []
        } catch (e) {
            console.warn('加载媒体服务器列表失败', e)
        }
    }

    return {
        dict,
        groupList,
        mediaServerList,
        loadDict,
        loadGroupList,
        loadMediaServerList
    }
}