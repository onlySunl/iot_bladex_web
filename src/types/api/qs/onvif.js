/**
 * WSDiscoveryDevice 返回前端类型
 */

/**
 * WSOnvifDevice 设备信息类型
 */

/**
 * OnvifDevice 设备信息类型
 */
export interface OnvifDevice {
    /**
     * IP 地址
     */
    ip: string;

    /**
     * 用户名
     */
    userName: string;

    /**
     * 密码
     */
    password: string;

    /**
     * Host 名称
     */
    hostName: string;

    /**
     * 设备厂商
     */
    firm: string;

    /**
     * 设备型号
     */
    model: string;

    /**
     * 固件版本
     */
    firmwareVersion: string;

    /**
     * 球机多条播放流 URI 列表
     */
    streamUris: string[];
}