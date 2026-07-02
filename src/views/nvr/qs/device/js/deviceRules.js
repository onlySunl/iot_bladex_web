/**
 * NVR设备新增/编辑表单校验规则
 */
export const deviceFormRules = {
    regionId: [
        { required: true, message: '请选择所属区域', trigger: 'change' }
    ],
    deviceName: [
        { required: true, message: '请输入设备名称', trigger: 'blur' },
        { min: 1, max: 64, message: '设备名称长度1-64位', trigger: 'blur' }
    ],
    ip: [
        { required: true, message: '请输入设备IP地址', trigger: 'blur' },
        {
            pattern: /^((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$/,
            message: 'IP地址格式不正确',
            trigger: 'blur'
        }
    ],
    port: [
        { required: true, message: '请输入端口号', trigger: 'blur' }
    ],
    username: [
        { required: true, message: '请输入登录账号', trigger: 'blur' }
    ],
    password: [
        { required: true, message: '请输入登录密码', trigger: 'blur' }
    ]
}