import {getCurrentInstance} from 'vue'
import {getDict, getDictionary} from '@/api/system/dict';

export function useDeviceDict() {
    const dictObj = {};
    const keys = [
        'qs_status',
        'qs_live_stream_type',
        'qs_stream_type',
        'qs_protocol',
        'qs_device_status',
        'qs_online_type',
        'qs_onvif_auth'
    ]
    keys.forEach(key => {
        getDictionary({ code: key }).then(res => {
            dictObj[key] = res.data.data;
        });
    })

    return dictObj
}