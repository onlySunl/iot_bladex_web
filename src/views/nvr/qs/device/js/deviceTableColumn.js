import { h } from 'vue'
import { ArrowDown, Location } from '@element-plus/icons-vue'
import { DictTag } from '@smallwei/avue'

// ===================== 业务常量配置 =====================
const NO_RECORD_TYPE = [1, 2, 3, 4, 6, 13]
const TIME_SYNC_CAPTURE_TYPE = [5, 7, 8, 9]
const DEVICE_INFO_REBOOT_TYPE = [5, 7, 8, 9, 12, 14]
const DOWNLOAD_RECORD_TYPE = [7, 8, 9]

// ===================== 公共工具渲染函数 =====================
function renderTooltipBtn(tip = '', btnProps = {}, click) {
    return h('avue-tooltip', { content: tip }, {
        default: () => h('avue-button', { ...btnProps, onClick: click })
    })
}

function renderDropdownItem(cmd, label, icon, disabled = false, type = '') {
    return h('avue-dropdown-item', {
        command: cmd,
        icon,
        disabled,
        type
    }, label)
}

function renderDictTag(dictList, value) {
    // value 为空直接赋值 '-'
    const realValue = value ?? ''
    if (!Array.isArray(dictList) || dictList.length === 0) {
        return h('span', '-')
    }
    const curVal = String(realValue)
    const matchDict = dictList.find(item => String(item.dictKey) === curVal)
    const showLabel = matchDict?.dictValue || '-'
    return h(DictTag, {
        options: dictList,
        value: realValue,
        label: showLabel
    })
}

function renderTextCell(value) {
    return h('span', value ?? '-')
}

/** 表格地图按钮 */
function renderMapBtn(row, emit) {
    return h('avue-button', {
        type: 'primary',
        text: true,
        size: 'small',
        icon: Location,
        onClick: () => emit('openMap', row)
    }, '地图选点')
}

// ===================== 表格列配置【按表单指定顺序重排】 =====================
export function initDeviceTableColumn(
    emit,
    qs_live_stream_type,
    qs_device_status,
    qs_status,
    qs_stream_type,
    qs_protocol,
    qs_online_type
) {
    return [
        // 1.设备名称
        {
            label: '设备名称',
            prop: 'deviceName',
            width: 160,
            align: 'center',
            fixed: 'left',
            type: 'input',
            placeholder: '请输入设备名称',
            rules: [{ required: true, message: '请输入设备名称', trigger: 'blur' }],
            search: true,
            searchLabelWidth: 100,
            slot: true,
            slotRender: ({ row }) => renderTextCell(row.deviceName)
        },
        // 2.设备编号
        {
            label: '设备编号',
            prop: 'deviceCode',
            width: 160,
            align: 'center',
            type: 'input',
            placeholder: '请输入设备编号',
            span: 12,
            search: true,
            slot: true,
            slotRender: ({ row }) => renderTextCell(row.deviceCode)
        },
        // 3.接入类型
        {
            label: '接入类型',
            prop: 'type',
            width: 120,
            align: 'center',
            type: 'select',
            dicData: qs_live_stream_type,
            placeholder: '请选择接入类型',
            search: true,
            searchType: 'select',
            slot: true,
            props: {
                label: 'dictValue',
                value: 'dictKey',
            },
        },
        // 4.启用状态
        {
            label: '启用状态',
            prop: 'status',
            width: 110,
            align: 'center',
            type: 'switch',
            activeValue: 1,
            inactiveValue: 0,
            defaultValue: 1,
            dicData: qs_status,
            search: true,
            searchType: 'select',
            slot: true,
            slotRender: ({ row }) => h('avue-switch', {
                modelValue: row.status ?? 1,
                'onUpdate:modelValue': (val) => emit('handleStatusChange', { ...row, status: val }),
                activeValue: 1,
                inactiveValue: 0
            })
        },
        // 5.码流类型
        {
            label: '码流类型',
            prop: 'streamType',
            width: 110,
            align: 'center',
            type: 'select',
            dicData: qs_stream_type,
            placeholder: '请选择码流类型',
            span: 12,
            slot: true,
            props: {
                label: 'dictValue',
                value: 'dictKey',
            },
        },
        // 6.传输协议
        {
            label: '传输协议',
            prop: 'protocol',
            width: 120,
            align: 'center',
            type: 'select',
            dicData: qs_protocol,
            placeholder: '请选择传输协议',
            span: 12,
            slot: true,
            props: {
                label: 'dictValue',
                value: 'dictKey',
            },
        },
        // 7.传输模式
        {
            label: '传输模式',
            prop: 'streamMode',
            width: 120,
            align: 'center',

            type: 'select',
            placeholder: '请输入传输模式',
            span: 12,
            slot: true,
            dicData: [
                {
                    label: 'UDP',
                    value: 'UDP',
                },
                {
                    label: 'TCP被动',
                    value: 'TCP-PASSIVE',
                }
            ],
        },
        // 8.通道号
        {
            label: '通道号',
            prop: 'channel',
            width: 100,
            align: 'center',
            type: 'input',
            placeholder: '请输入通道号',
            span: 12,
            slot: true,
            slotRender: ({ row }) => renderTextCell(row.channel ?? row.gbChannelId)
        },
        // 9.直播流地址
        {
            label: '直播流地址',
            prop: 'liveAddress',
            minWidth: 200,
            align: 'center',
            type: 'input',
            placeholder: '请输入直播流地址',
            span: 24,
            slot: true,
            slotRender: ({ row }) => {
                if (!row.liveAddress) return renderTextCell('-')
                return h('div', { style: 'display:flex;align-items:center;gap:8px' }, [
                    h('span', { style: 'max-width:160px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap' }, row.liveAddress),
                    h('avue-button', {
                        link: true,
                        type: 'primary',
                        size: 'small',
                        onClick: () => emit('handleCopy', row.liveAddress)
                    }, '复制')
                ])
            }
        },

        // 12.经纬度【地图联动，和地址共用弹窗回填】
        {
            label: '经度',
            width: 200,
            align: 'center',
            prop: 'longitude',

            type: 'map',
            span: 12,
            change:({column,value})=>{
                console.log('地图', value);
            },
            mapChange: (params) => {
                console.log('高德回调参数', params);
            }

        },
        {
            label: '纬度',
            width: 200,
            align: 'center',
            prop: 'latitude',
            type: 'map',
            span: 12,
            change:({column,value})=>{
                console.log('地图', value);
            },
            mapChange: (params) => {
                console.log('高德回调参数', params);
            }

        },
        // 11.安装地址【地图联动】
        {
            label: '安装地址',
            prop: 'address',
            minWidth: 180,
            type: 'map',
            placeholder: '点击地图选点自动填充',
            span: 24,
            change:({column,value})=>{
                console.log('地图', value);
            },
            mapChange: (params) => {
                console.log('高德回调参数', params);
            }


        },
        // ========== 以下字段：add:false edit:false 新增/抽屉表单完全隐藏 ==========
        // 端口 隐藏
        {
            label: '端口',
            prop: 'port',
            display:false,
            addDisplay:false,
            editDisplay:false,
            viewDisplay:false,
            width: 90,
            align: 'center',
            slot: true,
            slotRender: ({ row }) => renderTextCell(row.port)
        },
        // 用户名 隐藏
        {
            label: '用户名',
            prop: 'userName',
            display:false,
            addDisplay:false,
            editDisplay:false,
            viewDisplay:false,
            width: 120,
            align: 'center',
            slot: true,
            slotRender: ({ row }) => renderTextCell(row.userName)
        },
        // 密码 隐藏
        {
            label: '密码',
            prop: 'password',
            display:false,
            addDisplay:false,
            editDisplay:false,
            viewDisplay:false,
            width: 120,
            align: 'center',
            edit: false,
            add: false,
            slot: true,
            slotRender: () => h('span', '******')
        },
        // 设备在线状态（仅表格展示）
        {
            label: '设备在线状态',
            prop: 'deviceStatus',

            addDisplay:false,
            editDisplay:false,
            viewDisplay:false,
            width: 120,
            align: 'center',
            edit: false,
            add: false,
            search: true,
            searchType: 'select',
            dicData: qs_device_status,
            slot: true,
            slotRender: ({ row }) => renderDictTag(qs_device_status, row.deviceStatus)
        },
        // 上线类型（仅表格展示）
        {
            label: '上线类型',
            prop: 'onlineType',
            width: 110,
            align: 'center',
            addDisplay:false,
            editDisplay:false,
            viewDisplay:false,
            dicData: qs_online_type,
            slot: true,
            slotRender: ({ row }) => renderDictTag(qs_online_type, row.onlineType)
        }
    ]
}

// ===================== 表格全局配置（抽屉模式、移除折叠面板） =====================
export function initTableOption(
    emit,
    qs_live_stream_type,
    qs_device_status,
    qs_status,
    qs_stream_type,
    qs_protocol,
    qs_online_type
) {
    return {
        lazy: true,
        tip: false,
        simplePage: true,
        searchShow: true,
        searchMenuSpan: 6,
        tree: true,
        border: true,
        index: true,
        selection: true,
        viewBtn: true,
        cardImgKey: 'snap',
        menuWidth: 220,
        // 抽屉配置
        dialogType: 'drawer',
        dialogWidth: '65%',
        dialogClickModal: false,
        dialogEscape: true,
        dialogCloseBtn: true,
        dialogModal: true,
        rowEdit: true,
        // 移除collapse折叠配置，全部字段平铺展示
        column: initDeviceTableColumn(
            emit,
            qs_live_stream_type,
            qs_device_status,
            qs_status,
            qs_stream_type,
            qs_protocol,
            qs_online_type
        )
    }
}