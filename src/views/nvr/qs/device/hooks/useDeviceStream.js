import { ElMessage } from 'element-plus'

export function useDeviceStream(mediaServerList) {
    const ACCESS_TYPE_ENUM = {
        RTSP: '1',
        RTMP: '2',
        HTTP_FLV: '3',
        HLS: '4',
        GB28181: '5',
        JT1078: '6'
    }

    const getDefaultPort = (type, server) => {
        if (!server) return '80'
        switch (type) {
            case ACCESS_TYPE_ENUM.RTSP:
                return String(server.rtspPort ?? 554)
            case ACCESS_TYPE_ENUM.RTMP:
                return String(server.rtmpPort ?? 1935)
            case ACCESS_TYPE_ENUM.HTTP_FLV:
                return String(server.flvPort ?? 8080)
            case ACCESS_TYPE_ENUM.HLS:
                return String(server.hlsPort ?? 8080)
            case ACCESS_TYPE_ENUM.GB28181:
                return '5060'
            case ACCESS_TYPE_ENUM.JT1078:
                return '1078'
            default:
                return '80'
        }
    }

    const handleAccessTypeChange = (value, column, formData) => {
        if (!formData) return
        const serverList = mediaServerList.value || []
        if (serverList.length <= 0) {
            ElMessage.error('未启用流媒体服务器，请先配置流媒体服务')
            formData.liveAddress = ''
            return
        }
        const server = serverList[0]
        if (!server?.ip) {
            ElMessage.error('流媒体服务器配置缺失IP地址，请检查配置')
            formData.liveAddress = ''
            return
        }

        const accessType = String(value)
        const { channel, deviceCode } = formData
        const channelId = channel || 1
        const serverIp = server.ip.trim()
        const port = getDefaultPort(accessType, server)
        let streamAddress = ''
        switch (accessType) {
            case ACCESS_TYPE_ENUM.RTSP:
                streamAddress = `rtsp://${serverIp}:${port}/${deviceCode}/${channelId}`
                break
            case ACCESS_TYPE_ENUM.RTMP:
                streamAddress = `rtmp://${serverIp}:${port}/${deviceCode}/${channelId}`
                break
            case ACCESS_TYPE_ENUM.HTTP_FLV:
                streamAddress = `http://${serverIp}:${port}/${deviceCode}/${channelId}.flv`
                break
            case ACCESS_TYPE_ENUM.HLS:
                streamAddress = `http://${serverIp}:${port}/${deviceCode}/${channelId}/hls.m3u8`
                break
            case ACCESS_TYPE_ENUM.GB28181:
                streamAddress = `gb28181://${channelId}`
                break
            case ACCESS_TYPE_ENUM.JT1078:
                streamAddress = `jt1078://${deviceCode}:${channelId}`
                break
        }
        formData.liveAddress = streamAddress
    }

    return {
        ACCESS_TYPE_ENUM,
        getDefaultPort,
        handleAccessTypeChange
    }
}