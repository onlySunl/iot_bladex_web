<template>
  <div class="app-container">
    <div class="search-box">
      <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px" class="query-form">
        <el-form-item label="设备名称" prop="deviceName">
          <el-input
            v-model="queryParams.deviceName"
            placeholder="请输入设备名称"
            clearable
            @keyup.enter="handleQuery"
            prefix-icon="el-icon-video-camera"
          />
        </el-form-item>
        <el-form-item label="IP地址" prop="ipAddress">
          <el-input
            v-model="queryParams.ipAddress"
            placeholder="请输入IP地址"
            clearable
            @keyup.enter="handleQuery"
            prefix-icon="el-icon-map-location"
          />
        </el-form-item>
        <el-form-item label="接入类型" prop="type">
          <el-select v-model="queryParams.type" placeholder="请选择直播流接入类型" clearable style="width: 240px;">
            <el-option
              v-for="dict in qs_live_stream_type"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="queryParams.status" placeholder="请选择状态" clearable style="width: 240px;">
            <el-option
              v-for="dict in qs_status"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="设备状态" prop="deviceStatus">
          <el-select v-model="queryParams.deviceStatus" placeholder="请选择设备状态" clearable style="width: 240px;">
            <el-option
              v-for="dict in qs_device_status"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item class="form-actions">
          <div class="button-group">
            <el-button type="primary" icon="Search" @click="handleQuery" class="search-btn">搜索</el-button>
            <el-button icon="Refresh" @click="resetQuery" class="reset-btn">重置</el-button>
          </div>
        </el-form-item>
      </el-form>

      <el-row :gutter="10" class="mb8 toolbar-row action-buttons">
        <el-col :span="1.5">
          <el-button
            type="primary"
            plain
            icon="Plus"
            @click="handleAdd"
            class="action-btn add-btn"
          >新增
          </el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
            type="success"
            plain
            icon="Edit"
            :disabled="single"
            @click="handleUpdate"
            class="action-btn edit-btn"
          >修改
          </el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
            type="danger"
            plain
            icon="Delete"
            :disabled="multiple"
            @click="handleDelete"
            class="action-btn delete-btn"
          >删除
          </el-button>
        </el-col>
        <right-toolbar v-model:showSearch="showSearch" v-model:viewMode="viewMode" :showViewSwitch="true" @queryTable="getList"></right-toolbar>
      </el-row>
    </div>

    <div v-if="viewMode === 'list'" class="table-wrapper">
      <el-table
        v-loading="loading"
        :data="deviceList"
        @selection-change="handleSelectionChange"
        class="custom-table"
        highlight-current-row
      >
        <el-table-column type="selection" width="55" align="center" fixed/>
        <el-table-column label="编号" align="center" prop="id" width="70">
          <template #default="scope">
            <span class="id-badge">{{ scope.row.id }}</span>
          </template>
<script>

import {
  getHaiKangIsupDeviceConfig,
  setHaiKangIsupDeviceConfig,
  getHaiKangIsupVersionInfo
} from "@/api/nvr/haikang-isup";
import EasyPlayer from '@/components/nvr/EasyPlayer";
import {
  addDevice,
  changeDeviceStatus,
  delDevice,
  getDevice,
  getVideoSnapshot,
  listDevice,
  updateDevice,
  startPtz,
  endPtz,
  getPresetList,
  setPreset,
  gotoPreset,
  deletePreset,
  controlLight,
  controlWiper
} from "@/api/nvr/device"
import {
  listHaiKangIsupDevice,
  rebootHaiKangIsupDevice,
  getHaiKangIsupDevTime,
  setHaiKangIsupDevTime,
  captureHaiKangIsupAndSave,
  downloadHaikangIsupRecordDirect,
  getHaiKangIsupDeviceInfo,
  getHaiKangIsupStorageInfo,
  getHaiKangIsupSDCardInfo,
  getHaiKangIsupBitrateInfo,
  getHaiKangIsupNetworkStatusInfo,
  getHaiKangIsupSoftwareVersionInfo,
  getHaiKangIsupPowerStateInfo,
  getHaiKangIsupCameraInfo,
  getHaiKangIsupSystemParam,
  getHaiKangIsupVideoParam,
  getHaiKangIsupSystemStatus,
  getHaiKangIsupDeviceInfoXml,
  upgradeHaiKangIsupDevice
} from "@/api/nvr/haikang-isup";
import {
  listDaHuaDevice, getDaHuaTime, setDaHuaTime, rebootDaHuaDevice, getDaHuaDeviceInfo, getDaHuaSystemParam,
  getDaHuaVideoParam, setDaHuaVideoParam, getDaHuaDeviceVideoParam, setDaHuaDeviceVideoParam, captureDaHuaAndSave,
  getDaHuaStorageInfo, getDaHuaSystemResourceInfo, getDaHuaSDCardInfo, getDaHuaBitrateInfo,
  getDaHuaNetworkStatusInfo, getDaHuaSoftwareVersionInfo, getDaHuaRecordStateInfo, getDaHuaPowerStateInfo,
  getDaHuaAlarmArmInfo, getDaHuaCameraInfo, getDaHuaRtspUrlInfo, downloadDaHuaRecord, downloadDaHuaRecordDirect
} from "@/api/nvr/dahua";
import {
  queryHaiKangRecord,
  downloadHaikangRecordDirect,
  captureHaikangAndSave,
  getHaiKangDeviceInfo,
  getHaiKangStorageInfo,
  getHaiKangSDCardInfo,
  getHaiKangBitrateInfo,
  getHaiKangNetworkStatusInfo,
  getHaiKangSoftwareVersionInfo,
  getHaiKangRecordStateInfo,
  getHaiKangPowerStateInfo,
  getHaiKangAlarmArmInfo,
  getHaiKangCameraInfo,
  getHaiKangRtspUrlInfo,
  getHaiKangSystemParam,
  getHaiKangVideoParam,
  getHaiKangDevTime,
  setHaiKangDevTime,
  rebootHaiKangDevice
} from "@/api/nvr/haikang";
import { saveAs } from "file-saver";
import {
  closeStreams,
  getStreamPushAddress,
  loadRecord,
  rtpPlay,
  stopRtpPlay,
  stopStreamPullPlay,
  streamPullPlay, streamPullPush,
  startGb28181Play, stopGb28181Play,
  startJt1078Play, stopJt1078Play
} from "@/api/nvr/zlm";
import StreamDropdown from '@/components/nvr/Channel/streamDropdown.vue";
import { queryTerminalParams, setTerminalParams, querySpecificTerminalParams, terminalControl, queryTerminalAttribute, queryLocation, tempLocationTrack, confirmAlarm, linkCheck, sendText, eventSetting, sendQuestion, menuSetting, infoService, phoneCallback, setPhoneBook, vehicleControl, setCircleArea, deleteCircleArea, setRectArea, deleteRectArea, setPolygonArea, deletePolygonArea, setRoute, deleteRoute, queryAreaOrRoute, tachographDataCollect, tachographParamSend, reportDriverInfo, queryTerminalAVProperties, cameraShoot, searchMultimedia, uploadMultimedia, startRecording, searchUploadMultimedia, terminalUpgrade } from "@/api/nvr/jt1078";
import MediaInfo from '@/components/nvr/Channel/mediaInfo.vue";
import SelectMapPosition from '@/components/nvr/SelectMapPosition';
import ChannelCode from '@/views/components/common/channelCode.vue';
import DeviceSnapshotDialog from '@/components/nvr/DeviceSnapshotDialog/index.vue';
import {getOnvifDeviceList, onvifLogin, restartOnvifDevice, syncOnvifDeviceTime, getOnvifDeviceTime, getOnvifDeviceInfo, captureOnvifAndSave, getOnvifStorageConfigurations, getOnvifStorageCapabilities, getOnvifStorageState, getOnvifNetworkInterfaces, getOnvifNetworkProtocols, getOnvifVideoSourceConfigs, getOnvifVideoEncoderConfigs, getOnvifAudioSourceConfigs, getOnvifAudioEncoderConfigs, getOnvifVideoOutputConfigs} from "@/api/nvr/onvif";
import {getAllDevices, getChannelsByDeviceId, refreshDevice, rebootGb28181Device, recordCmd, queryDeviceStatus, queryDeviceInfo, subscribeCatalog, unsubscribeCatalog, queryDeviceConfig, updateDeviceConfig, queryHomePosition, updateHomePosition, queryCruiseTrackList, queryCruiseTrack, queryPTZPosition, homePositionControl, ptzPreciseControl, startCruise, stopCruise, querySDCardStatus, formatSDCardControl} from "@/api/nvr/gb28181";
import {getAllDevice} from "@/api/nvr/jt1078";
import {captureFromStream, listSnapshot, delSnapshot} from "@/api/nvr/snapshot";





 // 'list' 或 'card'

















// GB28181设备刷新进度


const refreshProgressColor = 'var(--el-color-primary)'

// 播放


;
;
;
;
;
;
;
;
; // 是否支持预置点功能
; // 是否是 GB28181 设备
;
;
;
;

// 抓图列表相关
;
;
;
;

// 云台
;
;
;
; // 保存上一次的云台命令

// 预置点
;
;
;
;
;
;

// 预置点表单数据
;

// 预置点表单校验规则
const presetRules = {
  index: [
    { required: true, message: '预置点编号不能为空', trigger: 'blur' }
  ],
  name: [
    { required: true, message: '预置点名称不能为空', trigger: 'blur' }
  ]
};

// 灯光和雨刷
;
;

// GB28181高级功能
;

;

;

;

;

// 大华设备校时
;
;
;

// 大华设备信息
;
;
;
;
// ONVIF 设备信息
;
;
;
;
// ONVIF 存储信息
;
;
;
;
;
;
;
// ONVIF 网络配置信息
;
;
// ONVIF 媒体配置信息
;
;
;
;
;
;
;
;
;
;
;
// GB28181 存储卡管理相关数据
;
;
;
;
;
;
;
;
;
;
// JT1078终端参数
;
;
;
;
;
// JT1078终端属性
;
// JT1078终端属性字段名映射
const jt1078AttributeFieldMap: Record<string, string> = {
  messageId: '消息ID',
  properties: '属性',
  protocolVersion: '协议版本',
  clientId: '客户端ID',
  serialNo: '流水号',
  verified: '已验证',
  version: '版本',
  reserved: '保留',
  subpackage: '分包',
  bodyLength: '消息体长度',
  encryption: '加密方式',
  deviceType: '终端类型',
  makerId: '制造商ID',
  deviceModel: '终端型号',
  deviceId: '终端ID',
  iccid: '终端SIM卡ICCID',
  hardwareVersion: '硬件版本号',
  firmwareVersion: '固件版本号',
  gnssAttribute: 'GNSS模块属性',
  networkAttribute: '通信模块属性'
};
// JT1078驾驶员身份信息字段名映射
const jt1078DriverInfoFieldMap: Record<string, string> = {
  messageId: '消息ID',
  properties: '属性',
  protocolVersion: '协议版本',
  clientId: '客户端ID',
  serialNo: '流水号',
  verified: '已验证',
  status: '状态',
  dateTime: '日期时间',
  cardStatus: '卡状态',
  version: '版本',
  reserved: '保留',
  subpackage: '分包',
  bodyLength: '消息体长度',
  encryption: '加密方式'
};
// JT1078终端音视频属性字段名映射
const jt1078TerminalAVPropertiesFieldMap: Record<string, string> = {
  messageId: '消息ID',
  properties: '属性',
  protocolVersion: '协议版本',
  clientId: '客户端ID',
  serialNo: '流水号',
  verified: '已验证',
  audioFormat: '音频编码格式',
  audioChannels: '音频通道数',
  audioSamplingRate: '音频采样率',
  audioBitDepth: '音频采样精度',
  audioFrameLength: '音频帧长度',
  audioSupport: '音频输出支持',
  videoFormat: '视频编码格式',
  maxAudioChannels: '最大音频通道数',
  maxVideoChannels: '最大视频通道数',
  version: '版本',
  reserved: '保留',
  subpackage: '分包',
  bodyLength: '消息体长度',
  encryption: '加密方式'
};
// JT1078位置信息字段名映射
const jt1078LocationFieldMap: Record<string, string> = {
  messageId: '消息ID',
  properties: '属性',
  protocolVersion: '协议版本',
  clientId: '客户端ID',
  serialNo: '流水号',
  verified: '已验证',
  warnBit: '报警标志位',
  statusBit: '状态标志位',
  latitude: '原始纬度',
  longitude: '原始经度',
  altitude: '海拔高度',
  speed: '原始速度',
  direction: '方向',
  deviceTime: '设备时间',
  responseSerialNo: '应答流水号',
  lng: '经度',
  lat: '纬度',
  speedKph: '速度(公里/小时)',
  version: '版本',
  reserved: '保留',
  subpackage: '分包',
  bodyLength: '消息体长度',
  encryption: '加密方式'
};
// JT1078位置信息
;
// JT1078临时位置跟踪控制表单
;
// JT1078人工确认报警消息表单
;
// JT1078链路检测结果
;
// JT1078文本信息下发表单
;
// JT1078事件设置表单
const jt1078EventForm = reactive({
  type: 1,
  events: [] as { id: number; content: string }[]
});
// JT1078提问下发表单
const jt1078QuestionForm = reactive({
  signBits: [][],
  content: '',
  options: [] as { id: number; content: string }[]
});
// JT1078信息点播菜单设置表单
const jt1078MenuForm = reactive({
  type: 1,
  infos: [] as { type: number; name: string }[]
});
// JT1078信息服务表单
;
// JT1078电话回拨表单
;
// JT1078设置电话本表单
const jt1078PhoneBookForm = reactive({
  type: 1,
  contacts: [] as { sign: number; phone: string; name: string }[]
});
// JT1078车辆控制表单
;
// JT1078车辆控制结果
;
// JT1078设置圆形区域表单
const jt1078CircleAreaForm = reactive({
  action: 1,
  items: [] as { id: number, attribute: number, latitude: number, longitude: number, radius: number, startTime: string, endTime: string, maxSpeed: number | null, duration: number | null, nightMaxSpeed: number | null, name: string }[]
});
// JT1078删除圆形区域表单
;
// JT1078设置矩形区域表单
const jt1078RectAreaForm = reactive({
  action: 1,
  items: [] as { id: number, attribute: number, latitudeUL: number, longitudeUL: number, latitudeLR: number, longitudeLR: number, startTime: string, endTime: string, maxSpeed: number | null, duration: number | null, nightMaxSpeed: number | null, name: string }[]
});
// JT1078删除矩形区域表单
;
// JT1078设置多边形区域表单
const jt1078PolygonAreaForm = reactive({
  id: 0,
  attribute: 0,
  startTime: '',
  endTime: '',
  maxSpeed: null | null,
  duration: null | null,
  nightMaxSpeed: null | null,
  name: '',
  points: [] as { latitude: number, longitude: number }[]
});
// JT1078删除多边形区域表单
;
// JT1078设置路线表单
const jt1078RouteForm = reactive({
  id: 0,
  attribute: 0,
  startTime: '',
  endTime: '',
  name: '',
  items: [] as { id: number, routeId: number, latitude: number, longitude: number, width: number, attribute: number, upperLimit: number | null, lowerLimit: number | null, maxSpeed: number | null, duration: number | null, nightMaxSpeed: number | null }[]
});
// JT1078删除路线表单
;
// JT1078查询区域或线路表单
;
// JT1078查询结果
;
// JT1078行驶记录仪数据采集命令表单
;
// JT1078行驶记录仪参数下传命令表单
;
// JT1078上报驾驶员身份信息请求结果
;
// JT1078查询终端音视频属性结果
;
// JT1078摄像头立即拍摄命令表单
;
// JT1078存储多媒体数据检索表单
;
// JT1078存储多媒体数据检索结果
;
// JT1078存储多媒体数据上传表单
;
// JT1078录音开始命令表单
;
// JT1078单条存储多媒体数据检索上传命令表单
;
// JT1078下发终端升级包表单
;
const jt1078SetParamsForm = reactive({
  parametersInt: {},
  parametersStr: {}
});
;
;
;
;

// 查询指定参数表单
;
;
;

// 终端控制表单
;
;

// 可编辑参数的计算属性
 {
    for (const [key, value] of Object.entries(jt1078TerminalParams)) {
      // 处理对象类型，转换为JSON字符串
      let displayValue = value;
      let editableValue = value;
      if (value && typeof value === 'object') {
        displayValue = JSON.stringify(value, null, 2);
        editableValue = JSON.stringify(value, null, 2);
      }
      params.push({
        key,
        value: displayValue,
        editableValue,
        originalValue: value,
        isNew: false
      });
    }
  }
  // 从新添加的数值参数添加
  if (jt1078SetParamsForm.parametersInt) {
    for (const [key, value] of Object.entries(jt1078SetParamsForm.parametersInt)) {
      // 避免重复
      if (!params.find(p => p.key === String(key))) {
        params.push({
          key: String(key),
          value: value,
          editableValue: value,
          originalValue: value,
          isNew: true
        });
      }
    }
  }
  // 从新添加的字符参数添加
  if (jt1078SetParamsForm.parametersStr) {
    for (const [key, value] of Object.entries(jt1078SetParamsForm.parametersStr)) {
      // 避免重复
      if (!params.find(p => p.key === String(key))) {
        params.push({
          key: String(key),
          value: value,
          editableValue: value,
          originalValue: value,
          isNew: true
        });
      }
    }
  }
  return params;
});

// 判断是否有可编辑参数
;

// 判断是否有参数被修改（用于提示）
 {
      return true;
    }
    // 比较原始值和当前值是否不同
    return String(param.originalValue) !== String(param.editableValue);
  });
});

// 判断查询指定参数是否有修改
 !== String(param.editableValue);
  });
});
// 设备配置
;
;
;
;
;
;
const updateConfigLoading = ref<Record<string, boolean>>({});
;
// 配置类型名称映射
const configTypeNameMap: Record<string, string> = {
  'BasicParam': '基本参数',
  'VideoParamOpt': '视频参数范围',
  'SVACEncodeConfig': 'SVAC编码配置',
  'SVACDecodeConfig': 'SVAC解码配置',
  'VideoParamAttribute': '视频参数属性配置',
  'VideoRecordPlan': '录像计划',
  'VideoAlarmRecord': '报警录像',
  'PictureMask': '视频画面遮挡',
  'FrameMirror': '画面翻转',
  'AlarmReport': '报警上报开关',
  'OSDConfig': '前端OSD设置',
  'Snapshot': '图像抓拍配置'
};
// 配置字段中文名称映射
const configFieldNameMap: Record<string, Record<string, string>> = {
  'BasicParam': {
    'DeviceID': '设备ID',
    'Name': '设备名称',
    'Manufacturer': '制造商',
    'Model': '设备型号',
    'Firmware': '固件版本',
    'SerialNumber': '序列号',
    'Hardware': '硬件版本',
    'Software': '软件版本',
    'IPAddress': 'IP地址',
    'Port': '端口号',
    'HeartBeatInterval': '心跳间隔',
    'HeartBeatCount': '心跳次数',
    'PositionCapability': '定位能力',
    'Expiration': '注册有效期'
  },
  'VideoParamOpt': {
    'DeviceID': '设备ID',
    'Resolution': '分辨率',
    'FrameRate': '帧率',
    'BitRate': '码率',
    'BitRateType': '码率类型',
    'Quality': '画质',
    'SVQ': '空间编码',
    'TVQ': '时间编码',
    'GovLength': 'I帧间隔',
    'Profile': '编码级别',
    'SVACProfile': 'SVAC编码级别'
  },
  'VideoParamAttribute': {
    'DeviceID': '设备ID',
    'MaxStream': '最大码流数',
    'InputNum': '输入数量',
    'AEC': '回声消除',
    'AGC': '自动增益',
    'ABF': '自动背景滤除'
  },
  'AlarmReport': {
    'DeviceID': '设备ID',
    'MobileSubscription': '移动侦测订阅',
    'AlarmSubscription': '报警事件订阅'
  },
  'VideoRecordPlan': {
    'DeviceID': '设备ID',
    'RecordPlan': '录像计划'
  },
  'OSDConfig': {
    'DeviceID': '设备ID',
    'OSD': 'OSD叠加配置'
  },
  'SVACEncodeConfig': {
    'DeviceID': '设备ID',
    'SVACCode': 'SVAC编码模式',
    'SVACCompression': 'SVAC压缩级别',
    'SVACProfile': 'SVAC编码级别'
  },
  'SVACDecodeConfig': {
    'DeviceID': '设备ID',
    'SVACDecode': 'SVAC解码模式'
  },
  'VideoAlarmRecord': {
    'DeviceID': '设备ID',
    'AlarmRecord': '报警录像配置'
  },
  'PictureMask': {
    'DeviceID': '设备ID',
    'PictureMask': '遮挡区域配置'
  },
  'FrameMirror': {
    'DeviceID': '设备ID',
    'FrameMirror': '镜像翻转配置'
  },
  'Snapshot': {
    'DeviceID': '设备ID',
    'Snapshot': '抓拍配置'
  }
};
// 大华设备录像下载
;
;
;
;
;
;
;

// 接入地址
;

const data = reactive({
  showAdvanced: false,
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    deviceName: undefined,
    ipAddress: undefined,
    type: undefined,
    status: undefined,
    deviceStatus: undefined,
  },
  rules: {
    deviceName: [
      {required: true, message: "设备名称不能为空", trigger: "blur"}
    ],
    ipAddress: [
      {required: true, message: "IP地址不能为空", trigger: "blur"}
    ],
    liveAddress: [
      {required: true, message: "直播流地址不能为空", trigger: "blur"}
    ],
    port: [
      {required: true, message: "端口号不能为空", trigger: "blur"}
    ],
    userName: [
      {required: true, message: "用户名不能为空", trigger: "blur"}
    ],
    password: [
      {required: true, message: "密码不能为空", trigger: "blur"}
    ],
    fileAddress: [
      {required: true, message: "视频文件不能为空", trigger: "blur"}
    ],
    channel: [
      {required: true, message: "通道号不能为空", trigger: "blur"}
    ],
    deviceCode: [
      {required: true, message: "设备唯一标识不能为空", trigger: "change"}
    ],
  }
})

const {queryParams, form, rules, showAdvanced} = toRefs(data)

/** 查询视频监控设备列表 */
function getList() {
  loading.value = true
  queryParams.value.params = {}
  listDevice(queryParams.value).then(response => {
    // 为每个设备添加 checked 属性用于卡片视图的选择
    deviceList.value = response.rows.map((item: any) => ({
      ...item,
      checked: ids.value.includes(item.id)
    }))
    total.value = response.total
    loading.value = false
  })
}

// 取消按钮
function cancel() {
  open.value = false
  reset()
}

// 表单重置
function reset() {
  form.value = {
    id: null,
    deviceCode: null,
    deviceName: null,
    ipAddress: null,
    port: null,
    userName: null,
    password: null,
    type: "1",
    deviceType: null,
    onlineType: null,
    channel: null,
    alarmChannelId: null,
    status: "ENABLE",
    streamType: "1",
    protocol: "TCP",
    enableAudio: "0",
    enableMp4: "0",
    enableDisableNoneReader: "0",
    onvifAuth: "1",
    onvifHostName: null,
    gbDeviceId: null,
    gbChannelId: null,
    streamMode: "TCP-PASSIVE",
    manufacturer: null,
    address: null,
    ptzType: null,
    createBy: null,
    createTime: null,
    updateBy: null,
    updateTime: null,
    remark: null,
    jtMobileNo: null,
    jtPlateNo: null,
    jtPlateColor: null,
    gbCode: null,
    gbModel: null,
    gbOwner: null,
    gbBlock: null,
    gbAddress: null,
    gbRegisterWay: null,
    gbUseType: null,
    gbLongitude: null,
    gbLatitude: null,
    gbLongitudeDouble: null,
    gbLatitudeDouble: null
  }
  showAdvanced.value = false
  proxy.resetForm("deviceRef")
}

/** 搜索按钮操作 */
function handleQuery() {
  queryParams.value.pageNum = 1
  getList()
}

/** 重置按钮操作 */
function resetQuery() {
  proxy.resetForm("queryRef")
  getList()
}

// 多选框选中数据
function handleSelectionChange(selection: QsDevice[]) {
  ids.value = selection.map(item => item.id)
  single.value = selection.length != 1
  multiple.value = !selection.length
}

// 卡片视图多选框选中处理
function handleCardSelection() {
  const selectedItems = deviceList.value.filter(item => item.checked)
  ids.value = selectedItems.map(item => item.id)
  single.value = selectedItems.length != 1
  multiple.value = !selectedItems.length
}

/** 新增按钮操作 */
function handleAdd() {
  reset()
  open.value = true
  title.value = "添加视频监控设备"
}

/** 修改按钮操作 */
function handleUpdate(row: QsDevice) {
  reset()
  const _id = row.id || ids.value[0]
  getDevice(_id).then(response => {
    form.value = response.data
    open.value = true
    title.value = "修改视频监控设备"

    // 海康isup
    if (form.value.type === '8') {
      listHaiKangIsupDevice().then((res) => {
        haiKangIsupDeviceList.value = res.data
      })
    }

    // 大华主动上线
    if (form.value.type === '9' && form.value.onlineType === '2') {
      listDaHuaDevice().then((res) => {
        res.data.forEach((item) => {
          item.deviceId = "device_" + item.deviceId
        })
        dahuaDeviceList.value = res.data
      })
    }

    if (form.value.type === '5') {
      getOnvifDeviceList().then((res) => {
        onvifDeviceList.value = res.data
      })
    }

    // 国标28181
    if (form.value.type === '12') {
      getAllDevices().then((res) => {
        gb28181DeviceList.value = res.data
        // 如果有选中的国标设备，自动填充生产厂商
        if (form.value.gbDeviceId) {
          const device = res.data.find((item: any) => item.deviceId === form.value.gbDeviceId)
          if (device?.manufacturer && !form.value.manufacturer) {
            form.value.manufacturer = device.manufacturer
          }
        }
      })
      if (form.value.gbDeviceId) {
        getChannelsByDeviceId(form.value.gbDeviceId).then((res) => {
          gb28181ChannelList.value = res.data
        })
      }
    }

    // JT1078
    if (form.value.type === '14') {
      getAllDevice().then((res) => {
        jt1078DeviceList.value = res.data
        // 如果有选中的 JT1078 设备，自动填充信息
        let device = null;
        // 优先用 deviceCode 查找
        if (form.value.deviceCode) {
          device = res.data.find((item: any) => item.deviceId === form.value.deviceCode)
        }
        // 如果用 deviceCode 没找到，尝试用 mobileNo 查找（兼容旧数据）
        if (!device && form.value.jtMobileNo) {
          device = res.data.find((item: any) => item.mobileNo === form.value.jtMobileNo)
          if (device) {
            form.value.deviceCode = device.deviceId
          }
        }

        if (device) {
          if (device?.makerId) {
            form.value.manufacturer = device.makerId
          }
          if (device?.mobileNo) {
            form.value.jtMobileNo = device.mobileNo
          }
          if (device?.plateNo) {
            form.value.jtPlateNo = device.plateNo
          }
          if (device?.plateColor !== undefined && device?.plateColor !== null) {
            form.value.jtPlateColor = String(device.plateColor)
          }
        }
      })
    }
  })
}

/** 提交按钮 */
function submitForm() {
  this.$refs["deviceRef"].validate((valid: boolean) => {
    if (valid) {
      if (form.value.id != null) {
        updateDevice(form.value).then(() => {
          this.$modal.msgSuccess("修改成功")
          open.value = false
          getList()
        })
      } else {
        addDevice(form.value).then(() => {
          this.$modal.msgSuccess("新增成功")
          open.value = false
          getList()
        })
      }
    }
  })
}

/** 删除按钮操作 */
function handleDelete(row: QsDevice) {
  const _ids = row.id || ids.value
  this.$modal.confirm('是否确认删除视频监控设备编号为"' + _ids + '"的数据项？').then(function () {
    return delDevice(_ids)
  }).then(() => {
    getList()
    this.$modal.msgSuccess("删除成功")
  }).catch(() => {
  })
}

/**
 * 复制内容到粘贴板
 *
 * @param text
 */
const handleCopy = async (text: string) => {
  if (!text) {
    this.$modal.msgError('内容为空，无法复制');
    return;
  }

  try {
    await toClipboard(text)
    this.$modal.msgSuccess('成功拷贝到粘贴板');
  } catch (e) {
    console.error(e)
  }
};

/**
 * 格式化容量显示
 */
const formatCapacity = (capacity: any) => {
  if (!capacity && capacity !== 0) return '-';
  const num = Number(capacity);
  if (isNaN(num)) return capacity;

  if (num >= 1024 * 1024 * 1024) {
    return (num / (1024 * 1024 * 1024)).toFixed(2) + ' GB';
  } else if (num >= 1024 * 1024) {
    return (num / (1024 * 1024)).toFixed(2) + ' MB';
  } else if (num >= 1024) {
    return (num / 1024).toFixed(2) + ' KB';
  } else {
    return num + ' B';
  }
};

/**
 * 计算存储使用百分比
 */
const calculateStoragePercentage = (used: any, total: any) => {
  const usedNum = Number(used);
  const totalNum = Number(total);
  if (!totalNum || isNaN(usedNum) || isNaN(totalNum)) return 0;
  return Math.min(100, Math.round((usedNum / totalNum) * 100));
};

/**
 * 根据存储使用比例获取颜色
 */
const getStorageColor = (used: any, total: any) => {
  const percentage = calculateStoragePercentage(used, total);
  if (percentage >= 90) return '#f56c6c'; // 红色
  if (percentage >= 70) return '#e6a23c'; // 橙色
  return '#67c23a'; // 绿色
};

/**
 * 直播流接入类型
 *
 * @param text
 */
const liveStreamChange = (e: string) => {
  // 清空所有设备相关字段
  form.value.deviceCode = null
  form.value.deviceName = null
  form.value.ipAddress = null
  form.value.port = null
  form.value.userName = null
  form.value.password = null
  form.value.channel = null
  form.value.alarmChannelId = null
  form.value.hostName = null
  form.value.gbDeviceId = null
  form.value.gbChannelId = null
  form.value.onvifAuth = '1'
  form.value.onvifHostName = null
  form.value.manufacturer = null
  form.value.address = null
  form.value.ptzType = null
  form.value.deviceType = null
  form.value.onlineType = null
  form.value.jtMobileNo = null
  form.value.jtPlateNo = null
  form.value.jtPlateColor = null

  // 根据接入类型设置默认值
  if (e === '12' || e === '14') {
    form.value.streamMode = 'TCP-PASSIVE'
  }

  // 海康sdk
  if (e === '7') {
    form.value.port = '8000';
    return
  }

  // 海康isup
  if (e === '8') {
    listHaiKangIsupDevice().then((res) => {
      haiKangIsupDeviceList.value = res.data
    })
  }

  // 大华sdk
  if (e === '9') {
    form.value.port = '37777';
    form.value.onlineType = '1';
    return
  }

  if (e === '5') {
    getOnvifDeviceList().then((res) => {
      onvifDeviceList.value = res.data
    })
  }

  // 国标28181
  if (e === '12') {
    getAllDevices().then((res) => {
      gb28181DeviceList.value = res.data
    })
  }

  // JT1078
  if (e === '14') {
    getAllDevice().then((res) => {
      jt1078DeviceList.value = res.data
    })
  }
}

/**
 * 国标设备选择变化
 * @param gbDeviceId 国标设备ID
 */
const gbDeviceChange = (gbDeviceId: string) => {
  form.value.gbChannelId = null
  if (gbDeviceId) {
    getChannelsByDeviceId(gbDeviceId).then((res) => {
      gb28181ChannelList.value = res.data
    })
    const device = gb28181DeviceList.value.find(item => item.deviceId === gbDeviceId)
    if (device) {
      if (device.manufacturer) {
        form.value.manufacturer = device.manufacturer
      }
      if (device.ip) {
        form.value.ipAddress = device.ip
      }
      if (device.port) {
        form.value.port = device.port
      }
    }
  } else {
    form.value.manufacturer = null
    form.value.ipAddress = null
    form.value.port = null
  }
}

/**
 * 国标通道选择变化
 * @param gbChannelId 国标通道ID
 */
const gbChannelChange = (gbChannelId: string) => {
  // 可以在这里添加处理逻辑
}

/**
 * JT1078 设备选择变化
 * @param deviceId JT1078 设备ID
 */
const jt1078DeviceChange = (deviceId: string) => {
  if (deviceId) {
    const device = jt1078DeviceList.value.find(item => item.deviceId === deviceId)
    if (device) {
      if (device.makerId) {
        form.value.manufacturer = device.makerId
      }
      if (device.mobileNo) {
        form.value.jtMobileNo = device.mobileNo
      }
      if (device.plateNo) {
        form.value.jtPlateNo = device.plateNo
      }
      if (device.plateColor) {
        form.value.jtPlateColor = String(device.plateColor)
      }
    }
  } else {
    form.value.manufacturer = null
    form.value.deviceName = null
    form.value.jtMobileNo = null
    form.value.jtPlateNo = null
    form.value.jtPlateColor = null
  }
}

/**
 * 直播流接入类型
 *
 * @param text
 */
const handleNumberInput = (val: string) => {
  form.value.channel = val.replace(/\D/g, '');
}

/** 状态修改  */
function handleStatusChange(row: QsDevice) {
  const text = row.status === "ENABLE" ? "启用" : "停用"
  this.$modal.confirm('确认要"' + text + '"该设备吗?').then(function () {
    return changeDeviceStatus(row.id, row.status)
  }).then(() => {
    this.$modal.msgSuccess(text + "成功")
  }).catch(function () {
    row.status = row.status === "DEACTIVATE" ? "ENABLE" : "DEACTIVATE"
  })
}

/**
 * 海康isup设备code改变
 *
 * @param e
 */
const haikangIsupDeviceCodeChange = (e: string) => {
  const device = haiKangIsupDeviceList.value.find(item => item.deviceId === e);
  form.value.ipAddress = device.ip
}

/**
 * 上线类型改变
 *
 * @param e
 */
const onlineTypeChange = (e: string) => {
  if (e === '2') {
    listDaHuaDevice().then((res: any) => {
      res.data.forEach((item) => {
        item.deviceId = "device_" + item.deviceId
        if (item.deviceCode === form.value.deviceCode) {
          form.value.ipAddress = item.ip
          form.value.port = item.port
        }
      })
      dahuaDeviceList.value = res.data
    })
  } else {
    form.value.port = "37777"
  }
}

/**
 * 大华设备code改变
 *
 * @param e
 */
const dahuaDeviceCodeChange = (e: string) => {
  const device = dahuaDeviceList.value.find(item => item.deviceId === e);
  form.value.ipAddress = device.ip
  form.value.port = device.port
}

/**
 * onvif设备code改变
 *
 * @param e
 */
const onvifDeviceCodeChange = (e: string) => {
  const device = onvifDeviceList.value.find(item => item.ip === e);
  if (device) {
    form.value.onvifHostName = device.hostName
  } else {
    // 手动输入的 IP，不自动填充 hostName
    form.value.onvifHostName = null
  }
}

/**
 * onvif 设备登录
 *
 * @param e
 */
const onvifAuthLogin = () => {

  if (!form.value.ipAddress) {
    this.$modal.msgError('请选择onvif设备IP');
    return
  }

  if (!form.value.userName) {
    this.$modal.msgError('请输入设备用户名');
    return
  }

  if (!form.value.password) {
    this.$modal.msgError('请输入设备密码');
    return
  }

  let data = {
    ip: form.value.ipAddress,
    auth: form.value.onvifAuth,
    hostName: form.value.onvifHostName,
    username: form.value.userName,
    password: form.value.password,
  };

  onvifLogin(data).then((res: any) => {
    streamUris.value = res.data.streamUris

    this.$modal.msgSuccess('认证成功');
  })
}

/**
 * 播放
 *
 * @param row
 */
const handlePlay = (row: QsDevice) => {
  row.loading = true

  if (row.type === '1' || row.type === '2' || row.type === '3' || row.type === '4' || row.type === '5') {
    let data = {
      deviceId: row.id,
      app: '',
      stream: row.deviceCode,
      url: row.liveAddress,
      enable_audio: false,
      enable_mp4: false,
      rtp_type: '1',
      timeOut: 10,
    };

    if (row.type === '1') {
      data.app = "rtsp"
    } else if (row.type === '2') {
      data.app = "rtmp"
    } else if (row.type === '3') {
      data.app = "flv"
    } else if (row.type === '4') {
      data.app = "hls"
    } else if (row.type === '5') {
      data.app = "onvif"

      controSpeedMin.value = 1
      controSpeed.value = 50
      controSpeedMax.value = 100
    }

    if (row.type === '3' && row.flvType === 'ws') {
      if (row.liveAddress != null) {
        data.url = convertWsToHttp(row.liveAddress)
      }
    }

    if (row.protocol === 'UDP') {
      data.rtp_type = '0'
    } else if (row.protocol === 'TCP') {
      data.rtp_type = '1'
    }

    if (row.enableAudio === '1') {
      data.enable_audio = true
    }

    if (row.enableMp4 === '1') {
      data.enable_mp4 = true
    }

    streamPullPlay(data).then(async (res: any) => {
      await nextTick(async () => {
        if (location.protocol === "https:") {
          flvUrl.value = res.data.https_flv;
          rtcUrl.value = res.data.rtcs;
          wsUrl.value = res.data.wss_flv;
        } else {
          flvUrl.value = res.data.flv;
          rtcUrl.value = res.data.rtc;
          wsUrl.value = res.data.ws_flv;
        }

        sharedIframe.value = '<iframe src="' + window.location.origin + '/easyPlayer?url=' + encodeURIComponent(wsUrl.value) + '"></iframe>'

        streamInfo.value = res.data;
        quality.value = []
        defaultQuality.value = ''
        isPtz.value = row.type === '5' // ONVIF 支持云台
        isPresetSupported.value = row.type === '5' // ONVIF 支持预置点
        isGb28181Device.value = false // 不是 GB28181 设备
        isQuality.value = false
        isLive.value = true
        deviceRow.value = row
        row.loading = false
        easyPlayerOpen.value = true

        await nextTick()
        if (this.$refs['EasyPlayerRef']) {
          this.$refs['EasyPlayerRef'].play(wsUrl.value)
        }
      })
    }).catch((err) => {
      row.loading = false
    })
  } else if (row.type === '6') {
    loadRecord(row.id).then(async (res: any) => {
      await nextTick(async () => {
        if (location.protocol === "https:") {
          flvUrl.value = res.data.https_flv;
          rtcUrl.value = res.data.rtcs;
          wsUrl.value = res.data.wss_flv;
        } else {
          flvUrl.value = res.data.flv;
          rtcUrl.value = res.data.rtc;
          wsUrl.value = res.data.ws_flv;
        }

        sharedIframe.value = '<iframe src="' + window.location.origin + '/easyPlayer?url=' + encodeURIComponent(wsUrl.value) + '"></iframe>'

        streamInfo.value = res.data;
        quality.value = []
        defaultQuality.value = ''
        isPtz.value = false // 视频文件不支持云台
        isGb28181Device.value = false // 不是 GB28181 设备
        isQuality.value = false
        isLive.value = true
        deviceRow.value = row
        row.loading = false
        easyPlayerOpen.value = true

        await nextTick()
        if (this.$refs['EasyPlayerRef']) {
          this.$refs['EasyPlayerRef'].play(wsUrl.value)
        }

        getVideoSnapshot(row.id);
      })
    }).catch((err) => {
      row.loading = false
    })
  } else if (row.type === '7' || row.type === '8' || row.type === '9') {
    let data = {
      app: "haikang",
      streamId: row.deviceCode,
      tcpMode: "0",
      type: row.type,
      id: row.id
    };

    if (row.type === '7') {
      data.app = "haikang"
      controSpeedMin.value = 1
      controSpeed.value = 5
      controSpeedMax.value = 10
    } else if (row.type === '8') {
      data.app = "haikang_isup"
      controSpeed.value = 5
      controSpeedMin.value = 1
      controSpeedMax.value = 5
    } else if (row.type === '9') {
      data.app = "dahua"
      controSpeed.value = 5
      controSpeedMin.value = 1
      controSpeedMax.value = 15
    }

    rtpPlay(data).then(async (res: any) => {
      await nextTick(async () => {
        if (location.protocol === "https:") {
          flvUrl.value = res.data.https_flv;
          rtcUrl.value = res.data.rtcs;
          wsUrl.value = res.data.wss_flv;
        } else {
          flvUrl.value = res.data.flv;
          rtcUrl.value = res.data.rtc;
          wsUrl.value = res.data.ws_flv;
        }

        sharedIframe.value = '<iframe src="' + window.location.origin + '/easyPlayer?url=' + encodeURIComponent(wsUrl.value) + '"></iframe>'

        streamInfo.value = res.data;
        quality.value = []
        defaultQuality.value = ''
        isPtz.value = true // 海康、海康ISUP、大华支持云台
        isPresetSupported.value = true // 海康、海康ISUP、大华支持预置点
        isGb28181Device.value = false // 不是 GB28181 设备
        isQuality.value = false
        isLive.value = true
        deviceRow.value = row
        row.loading = false
        easyPlayerOpen.value = true

        await nextTick()
        if (this.$refs['EasyPlayerRef']) {
          this.$refs['EasyPlayerRef'].play(wsUrl.value)
        }
      })
    }).catch((err) => {
      row.loading = false
    })
  } else if (row.type === '13') {
    streamPullPush(row.id).then(async (res: any) => {
      await nextTick(async () => {
        if (location.protocol === "https:") {
          flvUrl.value = res.data.https_flv;
          rtcUrl.value = res.data.rtcs;
          wsUrl.value = res.data.wss_flv;
        } else {
          flvUrl.value = res.data.flv;
          rtcUrl.value = res.data.rtc;
          wsUrl.value = res.data.ws_flv;
        }

        sharedIframe.value = '<iframe src="' + window.location.origin + '/easyPlayer?url=' + encodeURIComponent(wsUrl.value) + '"></iframe>'

        streamInfo.value = res.data;
        quality.value = []
        defaultQuality.value = ''
        isPtz.value = false // PUSH 不支持云台
        isGb28181Device.value = false // 不是 GB28181 设备
        isQuality.value = false
        isLive.value = true
        deviceRow.value = row
        row.loading = false
        easyPlayerOpen.value = true

        await nextTick()
        if (this.$refs['EasyPlayerRef']) {
          this.$refs['EasyPlayerRef'].play(wsUrl.value)
        }
      })
    }).catch((err) => {
      row.loading = false
    })
  } else if (row.type === '12') {
    // GB28181 协议 - 设置云台控制速度
    controSpeedMin.value = 1
    controSpeed.value = 50
    controSpeedMax.value = 100

    startGb28181Play(row.id).then(async (res: any) => {
      await nextTick(async () => {
        if (location.protocol === "https:") {
          flvUrl.value = res.data.https_flv;
          rtcUrl.value = res.data.rtcs;
          wsUrl.value = res.data.wss_flv;
        } else {
          flvUrl.value = res.data.flv;
          rtcUrl.value = res.data.rtc;
          wsUrl.value = res.data.ws_flv;
        }

        sharedIframe.value = '<iframe src="' + window.location.origin + '/easyPlayer?url=' + encodeURIComponent(wsUrl.value) + '"></iframe>'

        streamInfo.value = res.data;
        quality.value = []
        defaultQuality.value = ''
        isPtz.value = true // GB28181 支持云台
        isPresetSupported.value = true // GB28181 支持预置点
        isGb28181Device.value = true // 是 GB28181 设备
        isQuality.value = false
        isLive.value = true
        deviceRow.value = row
        row.loading = false
        easyPlayerOpen.value = true

        await nextTick()
        if (this.$refs['EasyPlayerRef']) {
          this.$refs['EasyPlayerRef'].play(wsUrl.value)
        }
      })
    }).catch((err) => {
      row.loading = false
    })
  } else if (row.type === '14') {
    // JT1078协议 - 设置云台控制速度
    controSpeedMin.value = 1
    controSpeed.value = 50
    controSpeedMax.value = 255

    startJt1078Play(row.id).then(async (res: any) => {
      await nextTick(async () => {
        if (location.protocol === "https:") {
          flvUrl.value = res.data.https_flv;
          rtcUrl.value = res.data.rtcs;
          wsUrl.value = res.data.wss_flv;
        } else {
          flvUrl.value = res.data.flv;
          rtcUrl.value = res.data.rtc;
          wsUrl.value = res.data.ws_flv;
        }

        sharedIframe.value = '<iframe src="' + window.location.origin + '/easyPlayer?url=' + encodeURIComponent(wsUrl.value) + '"></iframe>'

        streamInfo.value = res.data;
        quality.value = []
        defaultQuality.value = ''
        isPtz.value = true // JT1078 支持云台
        isPresetSupported.value = false // JT1078 不支持预置点
        isGb28181Device.value = false // 不是 GB28181 设备
        isQuality.value = false
        isLive.value = true
        deviceRow.value = row
        row.loading = false
        easyPlayerOpen.value = true

        await nextTick()
        if (this.$refs['EasyPlayerRef']) {
          this.$refs['EasyPlayerRef'].play(wsUrl.value)
        }
      })
    }).catch((err) => {
      row.loading = false
    })
  }

}

/**
 * 跳转到云端录像
 */
const handleCloudRecord = (row: QsDevice) => {
  this.$tab.openPage("[" + row.deviceName + "]云端录像", '/zlm/deviceRecordPlayback/index', {
    deviceId: row.id,
    type: 'cloud'
  })
}

/**
 * 跳转到设备录像
 */
const handleDeviceRecord = (row: QsDevice) => {
  this.$tab.openPage("[" + row.deviceName + "]设备录像", '/zlm/deviceRecordPlayback/index', {
    deviceId: row.id,
    type: 'device'
  })
}

const convertWsToHttp = (wsUrl: string) => {
  if (!wsUrl) return wsUrl;

  // 正则解释：
  // ^ 表示开头
  // wss? 匹配 "ws" 或 "wss"
  // :\/\/ 匹配 "://"
  const regex = /^wss?:\/\//;

  if (regex.test(wsUrl)) {
    // 如果是 wss:// 开头，替换为 https://
    if (wsUrl.startsWith('wss://')) {
      return wsUrl.replace(regex, 'https://');
    }
    // 如果是 ws:// 开头，替换为 http://
    else {
      return wsUrl.replace(regex, 'http://');
    }
  }

  // 如果已经是 http/https，直接返回
  return wsUrl;
}

/**
 * 停止播放
 */
const handleStopPlay = (row: QsDevice) => {
  if (row.type === '1' || row.type === '2' || row.type === '3' || row.type === '4' || row.type === '5') {
    let data = {
      deviceId: row.id,
      mediaServerId: row.mediaServerId,
      streamKey: row.streamKey,
    }
    stopStreamPullPlay(data).then((res) => {
      getList()
      this.$modal.msgSuccess("停止播放成功");
    })
  } else if (row.type === '6') {
    closeStreams(row.id).then((res) => {
      getList()
      this.$modal.msgSuccess("停止播放成功");
    })
  } else if (row.type === '7' || row.type === '8' || row.type === '9') {
    let data = {
      type: row.type,
      streamId: streamInfo.value.stream,
      id: row.id
    }
    stopRtpPlay(data).then((res) => {
      getList()
      this.$modal.msgSuccess("停止播放成功");
    })
  } else if (row.type === '12') {
    stopGb28181Play(row.id).then((res) => {
      getList()
      this.$modal.msgSuccess("停止播放成功");
    })
  } else if (row.type === '14') {
    stopJt1078Play(row.id).then((res) => {
      getList()
      this.$modal.msgSuccess("停止播放成功");
    })
  }
}



const selectMapPositionFun = () => {
  this.$refs["selectMapPositionRef"].openDialog({
    lat: form.value.latitude,
    lng: form.value.longitude,
  })
}

const selectMapPositionSubmit = (data: any) => {
  form.value.longitude = data.lng
  form.value.latitude = data.lat
}

const handleChannelCode = () => {
  this.$refs["channelCodeRef"].openDialog(null, form.value.gbCode)
}

const channelCodeOk = (code: string) => {
  form.value.gbCode = code
}

/**
 * 接入地址
 */
const handleAccessAddress = (row: QsDevice) => {
  if (row.id != null) {
    ElMessageBox.prompt('请输入callId', '温馨提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      inputPattern:
        /^[a-zA-Z0-9]+$/,
      inputErrorMessage: '输入callId不合法',
    })
      .then(({value}) => {
        getStreamPushAddress(row.id, value).then((res: any) => {
          deviceRow.value = row
          streamPushAddressForm.value = res.data
          accessAddressOpen.value = true
        })
      })
      .catch(() => {

      })
  }
}

/**
 * EasyPlayer 云台事件处理
 * @param data 云台数据 'up'|'down'|'left'|'right'|'zoomin'|'zoomout'|'near'|'far'|'in'|'out'|'stop'
 */
const handlePtz = async (data: any) => {
  console.log('handlePtz', data);
  if (!deviceRow.value || !deviceRow.value.id) {
    this.$modal.msgError('请先选择设备');
    return;
  }

  if (!isPtz.value) {
    this.$modal.msgWarning('当前设备不支持云台控制');
    return;
  }

  try {
    if (data === 'stop') {
      // 结束云台控制，使用上一次保存的命令
      await endPtz(deviceRow.value.id, lastPtzCommand.value, controSpeed.value);
    } else {
      // 保存当前命令
      lastPtzCommand.value = data;
      // 开始云台控制
      await startPtz(deviceRow.value.id, data, controSpeed.value);
    }
  } catch (error) {
    console.error('云台控制失败:', error);
    this.$modal.msgError('云台控制失败');
  }
}

/**
 * 云台方向
 * @param command
 * @returns {Promise<void>}
 */
const ptzCamera = async (command) => {
  if (!deviceRow.value || !deviceRow.value.id) {
    this.$modal.msgError('请先选择设备');
    return;
  }

  if (!isPtz.value) {
    this.$modal.msgWarning('当前设备不支持云台控制');
    return;
  }

  try {
    if (command !== 'stop') {
      // 开始云台控制
      await startPtz(deviceRow.value.id, command, controSpeed.value);
    } else {
      // 结束云台控制，这里我们传入一个默认的方向或者上一个方向
      // 为了简单，我们传入 'up' 作为方向，但实际上后端可能只需要 id 和速度
      await endPtz(deviceRow.value.id, 'up', controSpeed.value);
    }
  } catch (error) {
    console.error('云台控制失败:', error);
    this.$modal.msgError('云台控制失败');
  }
}

let timer = null
/**
 * 获取列表
 */
const startTimer = () => {
  // 清除可能存在的旧定时器，防止重复创建
  if (timer) clearInterval(timer);

  // 立即先执行一次
  getList();

  // 30000 毫秒 = 30 秒
  timer = setInterval(() => {
    getList();
  }, 30000);
};

startTimer()

// 组件卸载时清理定时器，防止内存泄漏
beforeDestroy() {
  if (timer) {
    clearInterval(timer);
    timer = null;
  }
})

// ==================== 预置点功能 ====================

// 加载预置点列表
const loadPresetList = async () => {
  if (!isPresetSupported.value || !deviceRow.value || !deviceRow.value.id) {
    return;
  }
  try {
    const res = await getPresetList(deviceRow.value.id, deviceRow.value.channel);
    if (res && res.data) {
      presetList.value = res.data;
    }
  } catch (error) {
    console.error('获取预置点列表失败:', error);
    this.$modal.msgError('获取预置点列表失败');
  }
}

// 预置点选择
const handlePresetSelect = (index) => {
  selectedPresetIndex.value = index;
  if (index) {
    newPresetIndex.value = index;
    const preset = presetList.value.find(p => p.index === index);
    if (preset) {
      newPresetName.value = preset.name || '';
    }
  }
}

// 打开设置预置点对话框
const openSetPresetDialog = () => {
  // 如果没有选择预置点也没有输入预置点编号，默认设为1
  presetForm.index = newPresetIndex.value || 1;
  presetForm.name = '';
  // 如果选择了预置点，自动填充名称
  if (selectedPresetIndex.value) {
    const preset = presetList.value.find(p => p.index === selectedPresetIndex.value);
    if (preset) {
      presetForm.index = preset.index;
      presetForm.name = preset.name || '';
    }
  }
  presetDialogVisible.value = true;
  // 重置表单校验
  nextTick(() => {
    presetFormRef.value?.resetFields();
  });
}

// 设置预置点
const handleSetPreset = async () => {
  if (!deviceRow.value || !deviceRow.value.id) {
    this.$modal.msgError('请先选择设备');
    return;
  }
  // 校验表单
  if (!presetFormRef.value) return;
  await presetFormRef.value.validate(async (valid) => {
    if (valid) {
      try {
        await setPreset(deviceRow.value.id, deviceRow.value.channel, presetForm.index, presetForm.name);
        this.$modal.msgSuccess('设置预置点成功');
        presetDialogVisible.value = false;
        await loadPresetList();
      } catch (error) {
        console.error('设置预置点失败:', error);
        this.$modal.msgError('设置预置点失败');
      }
    }
  });
}

// 调用预置点
const handleGotoPreset = async () => {
  if (!deviceRow.value || !deviceRow.value.id) {
    this.$modal.msgError('请先选择设备');
    return;
  }
  const presetIndex = selectedPresetIndex.value || newPresetIndex.value;
  if (!presetIndex) {
    this.$modal.msgWarning('请先选择或输入预置点');
    return;
  }
  try {
    await gotoPreset(deviceRow.value.id, deviceRow.value.channel, presetIndex);
    this.$modal.msgSuccess('调用预置点成功');
  } catch (error) {
    console.error('调用预置点失败:', error);
    this.$modal.msgError('调用预置点失败');
  }
}

// 删除预置点
const handleDeletePreset = async () => {
  if (!deviceRow.value || !deviceRow.value.id) {
    this.$modal.msgError('请先选择设备');
    return;
  }
  const presetIndex = selectedPresetIndex.value || newPresetIndex.value;
  if (!presetIndex) {
    this.$modal.msgWarning('请先选择或输入预置点');
    return;
  }
  try {
    await this.$modal.confirm('确定要删除该预置点吗？');
    await deletePreset(deviceRow.value.id, deviceRow.value.channel, presetIndex);
    this.$modal.msgSuccess('删除预置点成功');
    selectedPresetIndex.value = null;
    await loadPresetList();
  } catch (error) {
    if (error !== 'cancel') {
      console.error('删除预置点失败:', error);
      this.$modal.msgError('删除预置点失败');
    }
  }
}

// ==================== 灯光和雨刷控制 ====================

// 灯光控制
const handleLightControl = async (value) => {
  if (!deviceRow.value || !deviceRow.value.id) {
    this.$modal.msgError('请先选择设备');
    lightOn.value = !value;
    return;
  }
  try {
    await controlLight(deviceRow.value.id, deviceRow.value.channel, value);
    this.$modal.msgSuccess(value ? '灯光已开启' : '灯光已关闭');
  } catch (error) {
    console.error('灯光控制失败:', error);
    this.$modal.msgError('灯光控制失败');
    lightOn.value = !value;
  }
}

// 雨刷控制
const handleWiperControl = async (value) => {
  if (!deviceRow.value || !deviceRow.value.id) {
    this.$modal.msgError('请先选择设备');
    wiperOn.value = !value;
    return;
  }
  try {
    await controlWiper(deviceRow.value.id, deviceRow.value.channel, value);
    this.$modal.msgSuccess(value ? '雨刷已开启' : '雨刷已关闭');
  } catch (error) {
    console.error('雨刷控制失败:', error);
    this.$modal.msgError('雨刷控制失败');
    wiperOn.value = !value;
  }
}

// ==================== GB28181高级功能 ====================

// 查询看守位
const handleQueryHomePosition = async () => {
  if (!deviceRow.value || !deviceRow.value.gbDeviceId) {
    this.$modal.msgError('请先选择设备');
    return;
  }
  try {
    const res = await queryHomePosition(deviceRow.value.gbDeviceId, deviceRow.value.gbChannelId);
    if (res.data) {
      homePositionForm.presetId = res.data.presetId || 1;
      homePositionForm.dwellTime = res.data.dwellTime || 10;
      this.$modal.msgSuccess('查询看守位成功');
    }
  } catch (error) {
    console.error('查询看守位失败:', error);
    this.$modal.msgError('查询看守位失败');
  }
}

// 设置看守位
const handleSetHomePosition = async () => {
  if (!deviceRow.value || !deviceRow.value.gbDeviceId) {
    this.$modal.msgError('请先选择设备');
    return;
  }
  try {
    await updateHomePosition(deviceRow.value.gbDeviceId, deviceRow.value.gbChannelId, {
      homePosition: {
        presetId: homePositionForm.presetId,
        dwellTime: homePositionForm.dwellTime
      }
    });
    this.$modal.msgSuccess('设置看守位成功');
  } catch (error) {
    console.error('设置看守位失败:', error);
    this.$modal.msgError('设置看守位失败');
  }
}

// 调用看守位
const handleHomePositionControl = async () => {
  if (!deviceRow.value || !deviceRow.value.gbDeviceId) {
    this.$modal.msgError('请先选择设备');
    return;
  }
  try {
    await homePositionControl(deviceRow.value.gbDeviceId, deviceRow.value.gbChannelId);
    this.$modal.msgSuccess('调用看守位成功');
  } catch (error) {
    console.error('调用看守位失败:', error);
    this.$modal.msgError('调用看守位失败');
  }
}

// 查询巡航轨迹列表
const handleQueryCruiseTrackList = async () => {
  if (!deviceRow.value || !deviceRow.value.gbDeviceId) {
    this.$modal.msgError('请先选择设备');
    return;
  }
  try {
    const res = await queryCruiseTrackList(deviceRow.value.gbDeviceId, deviceRow.value.gbChannelId);
    if (res.data) {
      cruiseTrackList.value = res.data;
      this.$modal.msgSuccess('查询巡航轨迹列表成功');
    }
  } catch (error) {
    console.error('查询巡航轨迹列表失败:', error);
    this.$modal.msgError('查询巡航轨迹列表失败');
  }
}

// 查询巡航轨迹详情
const handleQueryCruiseTrack = async () => {
  if (!deviceRow.value || !deviceRow.value.gbDeviceId) {
    this.$modal.msgError('请先选择设备');
    return;
  }
  if (cruiseTrackForm.trackId === null || cruiseTrackForm.trackId === undefined) {
    this.$modal.msgWarning('请选择轨迹编号');
    return;
  }
  try {
    const res = await queryCruiseTrack(deviceRow.value.gbDeviceId, deviceRow.value.gbChannelId, cruiseTrackForm.trackId);
    if (res.data) {
      this.$modal.msgSuccess('查询巡航轨迹详情成功');
    }
  } catch (error) {
    console.error('查询巡航轨迹详情失败:', error);
    this.$modal.msgError('查询巡航轨迹详情失败');
  }
}

// 查询PTZ位置
const handleQueryPTZPosition = async () => {
  if (!deviceRow.value || !deviceRow.value.gbDeviceId) {
    this.$modal.msgError('请先选择设备');
    return;
  }
  try {
    const res = await queryPTZPosition(deviceRow.value.gbDeviceId, deviceRow.value.gbChannelId);
    if (res.data) {
      ptzPosition.pan = res.data.pan;
      ptzPosition.tilt = res.data.tilt;
      ptzPosition.zoom = res.data.zoom;
      this.$modal.msgSuccess('查询PTZ位置成功');
    }
  } catch (error) {
    console.error('查询PTZ位置失败:', error);
    this.$modal.msgError('查询PTZ位置失败');
  }
}

// PTZ精准控制
const handlePtzPreciseControl = async () => {
  if (!deviceRow.value || !deviceRow.value.gbDeviceId) {
    this.$modal.msgError('请先选择设备');
    return;
  }
  try {
    await ptzPreciseControl(deviceRow.value.gbDeviceId, deviceRow.value.gbChannelId, {
      pan: ptzPreciseForm.pan,
      tilt: ptzPreciseForm.tilt,
      zoom: ptzPreciseForm.zoom
    });
    this.$modal.msgSuccess('PTZ精准控制成功');
  } catch (error) {
    console.error('PTZ精准控制失败:', error);
    this.$modal.msgError('PTZ精准控制失败');
  }
}

// 开始巡航
const handleStartCruise = async () => {
  if (!deviceRow.value || !deviceRow.value.gbDeviceId) {
    this.$modal.msgError('请先选择设备');
    return;
  }
  try {
    await startCruise(deviceRow.value.gbDeviceId, deviceRow.value.gbChannelId, cruiseTrackForm.trackId);
    this.$modal.msgSuccess('开始巡航成功');
  } catch (error) {
    console.error('开始巡航失败:', error);
    this.$modal.msgError('开始巡航失败');
  }
}

// 停止巡航
const handleStopCruise = async () => {
  if (!deviceRow.value || !deviceRow.value.gbDeviceId) {
    this.$modal.msgError('请先选择设备');
    return;
  }
  try {
    await stopCruise(deviceRow.value.gbDeviceId, deviceRow.value.gbChannelId, cruiseTrackForm.trackId);
    this.$modal.msgSuccess('停止巡航成功');
  } catch (error) {
    console.error('停止巡航失败:', error);
    this.$modal.msgError('停止巡航失败');
  }
}

// 查询 GB28181 存储卡状态
const handleQueryGb28181SdCardStatus = async () => {
  if (!currentDeviceRow.value?.gbDeviceId) {
    this.$modal.msgError('设备未配置国标设备ID');
    return;
  }
  try {
    const response = await querySDCardStatus(currentDeviceRow.value.gbDeviceId, currentDeviceRow.value.gbChannelId);
    if (response.code === 200) {
      Object.assign(gb28181SdCardInfo, response.data || {});
      this.$modal.msgSuccess('查询存储卡状态成功');
    } else {
      this.$modal.msgError(response.msg || '查询失败');
    }
  } catch (error) {
    console.error('查询存储卡状态失败:', error);
    this.$modal.msgError('查询存储卡状态失败');
  }
}

// 格式化 GB28181 存储卡
const handleFormatGb28181SdCard = async () => {
  if (!currentDeviceRow.value?.gbDeviceId) {
    this.$modal.msgError('设备未配置国标设备ID');
    return;
  }

  try {
    await ElMessageBox.confirm(
      '确定要格式化存储卡吗？此操作将清除所有数据！',
      '警告',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    );

    const response = await formatSDCardControl(
      currentDeviceRow.value.gbDeviceId,
      currentDeviceRow.value.gbChannelId,
      gb28181SdCardForm.sdCardId
    );

    if (response.code === 200) {
      this.$modal.msgSuccess('格式化存储卡成功');
    } else {
      this.$modal.msgError(response.msg || '格式化失败');
    }
  } catch (error) {
    if (error !== 'cancel') {
      console.error('格式化存储卡失败:', error);
      this.$modal.msgError('格式化存储卡失败');
    }
  }
}

// ==================== 大华设备校时 ====================

// 目录订阅
const handleSubscribeCatalog = async (row: QsDevice) => {
  if (row.deviceStatus !== 'ON') {
    this.$modal.msgWarning('设备离线，无法订阅目录');
    return;
  }

  try {
    await subscribeCatalog(row.id);
    this.$modal.msgSuccess('目录订阅成功');
    // 订阅成功后更新本地状态
    row.subscribeCatalogStatus = 1;
  } catch (error) {
    console.error('目录订阅失败:', error);
    this.$modal.msgError('目录订阅失败');
  }
};

// 取消目录订阅
const handleUnsubscribeCatalog = async (row: QsDevice) => {
  if (row.deviceStatus !== 'ON') {
    this.$modal.msgWarning('设备离线，无法取消订阅目录');
    return;
  }

  try {
    await unsubscribeCatalog(row.id);
    this.$modal.msgSuccess('取消目录订阅成功');
    // 取消订阅后更新本地状态
    row.subscribeCatalogStatus = 0;
  } catch (error) {
    console.error('取消目录订阅失败:', error);
    this.$modal.msgError('取消目录订阅失败');
  }
};

// 打开设备配置对话框
const openDeviceConfigDialog = (row: QsDevice) => {
  currentConfigDevice.value = row;
  deviceConfigData.value = {};
  selectedConfigTypes.value = [];
  deviceConfigDialogVisible.value = true;
};

// 获取配置类型名称
const getConfigTypeName = (key: string): string => {
  return configTypeNameMap[key] || key;
};

// 获取配置字段名称
const getConfigFieldName = (configType: string, fieldKey: string): string => {
  const fieldMap = configFieldNameMap[configType];
  return fieldMap ? (fieldMap[fieldKey] || fieldKey) : fieldKey;
};

// 查询设备配置
const handleQueryDeviceConfig = async () => {
  if (!currentConfigDevice.value?.gbDeviceId) {
    this.$modal.msgError('设备未配置国标设备ID');
    return;
  }
  if (selectedConfigTypes.value.length === 0) {
    this.$modal.msgWarning('请至少选择一个配置类型');
    return;
  }

  try {
    deviceConfigLoading.value = true;
    const configTypeStr = selectedConfigTypes.value.join('/');
    const response = await queryDeviceConfig(currentConfigDevice.value.gbDeviceId, configTypeStr);

    if (response.code === 200 && response.data) {
      deviceConfigData.value = response.data;
      this.$modal.msgSuccess('查询成功');
    } else {
      this.$modal.msgError(response.msg || '查询失败');
    }
  } catch (error) {
    console.error('查询设备配置失败:', error);
    this.$modal.msgError('查询设备配置失败');
  } finally {
    deviceConfigLoading.value = false;
  }
};

// 更新单个配置
const handleUpdateSingleConfig = async (configType: string) => {
  if (!currentConfigDevice.value?.gbDeviceId) {
    this.$modal.msgError('设备未配置国标设备ID');
    return;
  }

  try {
    updateConfigLoading.value[configType] = true;
    // 构建配置对象
    const configParam: any = {
      cmdType: 'DeviceControl'
    };
    // 添加对应的配置项
    configParam[configType] = deviceConfigData.value[configType];
    const response = await updateDeviceConfig(currentConfigDevice.value.gbDeviceId, configParam);

    if (response.code === 200) {
      this.$modal.msgSuccess(`更新${getConfigTypeName(configType)}成功`);
    } else {
      this.$modal.msgError(response.msg || '更新失败');
    }
  } catch (error) {
    console.error('更新设备配置失败:', error);
    this.$modal.msgError('更新设备配置失败');
  } finally {
    updateConfigLoading.value[configType] = false;
  }
};

// 更新全部配置
const handleUpdateAllConfig = async () => {
  if (!currentConfigDevice.value?.gbDeviceId) {
    this.$modal.msgError('设备未配置国标设备ID');
    return;
  }

  try {
    updateAllConfigLoading.value = true;
    // 构建配置对象
    const configParam: any = {
      cmdType: 'DeviceControl',
      ...deviceConfigData.value
    };
    const response = await updateDeviceConfig(currentConfigDevice.value.gbDeviceId, configParam);

    if (response.code === 200) {
      this.$modal.msgSuccess('更新全部配置成功');
    } else {
      this.$modal.msgError(response.msg || '更新失败');
    }
  } catch (error) {
    console.error('更新全部配置失败:', error);
    this.$modal.msgError('更新全部配置失败');
  } finally {
    updateAllConfigLoading.value = false;
  }
};

// 更多操作处理
const handleMoreAction = (command: string, row: QsDevice) => {
  switch (command) {
    case 'edit':
      handleUpdate(row);
      break;
    case 'viewSnapshots':
      snapshotDialogRef.value?.openDialog(row.id, row.deviceName);
      break;
    case 'delete':
      handleDelete(row);
      break;
    case 'refresh':
      handleRefreshDevice(row);
      break;
    case 'timeSync':
      if (row.deviceStatus !== 'ON') {
        this.$modal.msgWarning('设备离线，无法校时');
        return;
      }
      openTimeSyncDialog(row);
      break;
    case 'deviceInfo':
      if (row.deviceStatus !== 'ON') {
        this.$modal.msgWarning('设备离线，无法查看设备信息');
        return;
      }
      openDeviceInfoDialog(row);
      break;
    case 'capture':
      if (row.deviceStatus !== 'ON') {
        this.$modal.msgWarning('设备离线，无法抓图');
        return;
      }
      handleCapture(row);
      break;
    case 'reboot':
      if (row.deviceStatus !== 'ON') {
        this.$modal.msgWarning('设备离线，无法重启');
        return;
      }
      handleReboot(row);
      break;
    case 'recordControl':
      if (row.deviceStatus !== 'ON') {
        this.$modal.msgWarning('设备离线，无法进行录像控制');
        return;
      }
      handleRecordControl(row);
      break;
    case 'downloadRecord':
      if (row.deviceStatus !== 'ON') {
        this.$modal.msgWarning('设备离线，无法下载录像');
        return;
      }
      openDownloadRecordDialog(row);
      break;
    case 'subscribeCatalog':
      handleSubscribeCatalog(row);
      break;
    case 'unsubscribeCatalog':
      handleUnsubscribeCatalog(row);
      break;
    case 'deviceConfig':
      if (row.deviceStatus !== 'ON') {
        this.$modal.msgWarning('设备离线，无法查询设备配置');
        return;
      }
      openDeviceConfigDialog(row);
      break;
    case 'jt1078Params':
      if (row.deviceStatus !== 'ON') {
        this.$modal.msgWarning('设备离线，无法操作终端参数');
        return;
      }
      openJt1078ParamsDialog(row);
      break;
  }
}

// 打开JT1078终端参数对话框
const openJt1078ParamsDialog = (row: QsDevice) => {
  currentDeviceRow.value = row;
  jt1078CurrentDevice.deviceId = row.deviceCode || '';
  jt1078CurrentDevice.mobileNo = row.jtMobileNo || '';
  // 清空参数
  Object.keys(jt1078TerminalParams).forEach(key => {
    delete jt1078TerminalParams[key];
  });
  // 重置设置表单
  Object.keys(jt1078SetParamsForm.parametersInt).forEach(key => {
    delete jt1078SetParamsForm.parametersInt[key];
  });
  Object.keys(jt1078SetParamsForm.parametersStr).forEach(key => {
    delete jt1078SetParamsForm.parametersStr[key];
  });
  jt1078TempParamId.value = 0;
  jt1078TempParamValue.value = 0;
  jt1078TempStrParamId.value = 0;
  jt1078TempStrParamValue.value = '';
  // 重置查询指定参数表单
  jt1078QuerySpecificForm.ids = '';
  Object.keys(jt1078QuerySpecificResult).forEach(key => {
    delete jt1078QuerySpecificResult[key];
  });
  jt1078QuerySpecificEditableParams.value = [];
  // 重置终端控制表单
  jt1078ControlForm.command = 1;
  jt1078ControlForm.parameter = '';
  jt1078ControlResult.value = null;
  // 重置标签页
  jt1078ParamsTabActive.value = 'params';
  jt1078ParamsDialogVisible.value = true;
  // 自动查询参数
  nextTick(() => {
    handleQueryJt1078Params();
  });
};

// 删除参数
const removeParam = (key: string) => {
  // 从查询结果删除
  if (jt1078TerminalParams[key]) {
    delete jt1078TerminalParams[key];
  }
  // 从数值参数删除
  if (jt1078SetParamsForm.parametersInt[key]) {
    delete jt1078SetParamsForm.parametersInt[key];
  }
  // 从字符参数删除
  if (jt1078SetParamsForm.parametersStr[key]) {
    delete jt1078SetParamsForm.parametersStr[key];
  }
};

// 添加数值参数
const addIntParam = () => {
  if (jt1078TempParamId.value === null || jt1078TempParamId.value === undefined) {
    this.$modal.msgWarning('请输入参数ID');
    return;
  }
  if (jt1078TempParamValue.value === null || jt1078TempParamValue.value === undefined) {
    this.$modal.msgWarning('请输入参数值');
    return;
  }
  const key = String(jt1078TempParamId.value);
  // 添加到查询结果中（统一展示）
  jt1078TerminalParams[key] = jt1078TempParamValue.value;
  jt1078TempParamId.value = 0;
  jt1078TempParamValue.value = 0;
};

// 删除数值参数（保留以兼容）
const removeIntParam = (key: number) => {
  removeParam(String(key));
};

// 添加字符参数
const addStrParam = () => {
  if (jt1078TempStrParamId.value === null || jt1078TempStrParamId.value === undefined) {
    this.$modal.msgWarning('请输入参数ID');
    return;
  }
  if (!jt1078TempStrParamValue.value) {
    this.$modal.msgWarning('请输入参数值');
    return;
  }
  const key = String(jt1078TempStrParamId.value);
  // 添加到查询结果中（统一展示）
  jt1078TerminalParams[key] = jt1078TempStrParamValue.value;
  jt1078TempStrParamId.value = 0;
  jt1078TempStrParamValue.value = '';
};

// 删除字符参数（保留以兼容）
const removeStrParam = (key: number) => {
  removeParam(String(key));
};

// 查询JT1078终端参数
const handleQueryJt1078Params = async () => {
  if (!jt1078CurrentDevice.mobileNo) {
    this.$modal.msgError('设备手机号不能为空');
    return;
  }

  try {
    jt1078ParamsLoading.value = true;
    const response = await queryTerminalParams({
      clientId: jt1078CurrentDevice.mobileNo
    });

    if (response.code === 200 && response.data) {
      // 清空旧参数
      Object.keys(jt1078TerminalParams).forEach(key => {
        delete jt1078TerminalParams[key];
      });
      // 清空设置表单
      Object.keys(jt1078SetParamsForm.parametersInt).forEach(key => {
        delete jt1078SetParamsForm.parametersInt[key];
      });
      Object.keys(jt1078SetParamsForm.parametersStr).forEach(key => {
        delete jt1078SetParamsForm.parametersStr[key];
      });
      // 复制新参数
      if (response.data.parameters) {
        Object.assign(jt1078TerminalParams, response.data.parameters);
      }
      this.$modal.msgSuccess('查询终端参数成功');
    } else {
      this.$modal.msgError(response.msg || '查询失败');
    }
  } catch (error) {
    console.error('查询终端参数失败:', error);
    this.$modal.msgError('查询终端参数失败');
  } finally {
    jt1078ParamsLoading.value = false;
  }
};

// 查询JT1078终端属性
const handleQueryJt1078Attribute = async () => {
  if (!jt1078CurrentDevice.mobileNo) {
    this.$modal.msgError('设备手机号不能为空');
    return;
  }

  try {
    jt1078ParamsLoading.value = true;
    const response = await queryTerminalAttribute({
      clientId: jt1078CurrentDevice.mobileNo
    });

    if (response.code === 200 && response.data) {
      // 清空旧属性
      Object.keys(jt1078TerminalAttribute).forEach(key => {
        delete jt1078TerminalAttribute[key];
      });
      // 复制新属性
      Object.assign(jt1078TerminalAttribute, response.data);
      this.$modal.msgSuccess('查询终端属性成功');
    } else {
      this.$modal.msgError(response.msg || '查询失败');
    }
  } catch (error) {
    console.error('查询终端属性失败:', error);
    this.$modal.msgError('查询终端属性失败');
  } finally {
    jt1078ParamsLoading.value = false;
  }
};

// 查询JT1078位置信息
const handleQueryJt1078Location = async () => {
  if (!jt1078CurrentDevice.mobileNo) {
    this.$modal.msgError('设备手机号不能为空');
    return;
  }

  try {
    jt1078ParamsLoading.value = true;
    const response = await queryLocation({
      clientId: jt1078CurrentDevice.mobileNo
    });

    if (response.code === 200 && response.data) {
      // 清空旧位置
      Object.keys(jt1078Location).forEach(key => {
        delete jt1078Location[key];
      });
      // 复制新位置
      Object.assign(jt1078Location, response.data);
      this.$modal.msgSuccess('查询位置信息成功');
    } else {
      this.$modal.msgError(response.msg || '查询失败');
    }
  } catch (error) {
    console.error('查询位置信息失败:', error);
    this.$modal.msgError('查询位置信息失败');
  } finally {
    jt1078ParamsLoading.value = false;
  }
};

// JT1078临时位置跟踪控制
const handleTempLocationTrack = async () => {
  if (!jt1078CurrentDevice.mobileNo) {
    this.$modal.msgError('设备手机号不能为空');
    return;
  }

  try {
    jt1078ParamsLoading.value = true;
    const response = await tempLocationTrack({
      clientId: jt1078CurrentDevice.mobileNo,
      interval: jt1078TempLocationForm.interval,
      validityPeriod: jt1078TempLocationForm.validityPeriod
    });

    if (response.code === 200) {
      this.$modal.msgSuccess('临时位置跟踪控制成功');
    } else {
      this.$modal.msgError(response.msg || '控制失败');
    }
  } catch (error) {
    console.error('临时位置跟踪控制失败:', error);
    this.$modal.msgError('临时位置跟踪控制失败');
  } finally {
    jt1078ParamsLoading.value = false;
  }
};

// JT1078人工确认报警消息
const handleConfirmAlarm = async () => {
  if (!jt1078CurrentDevice.mobileNo) {
    this.$modal.msgError('设备手机号不能为空');
    return;
  }

  try {
    jt1078ParamsLoading.value = true;
    const response = await confirmAlarm({
      clientId: jt1078CurrentDevice.mobileNo,
      responseSerialNo: jt1078AlarmConfirmForm.responseSerialNo,
      type: jt1078AlarmConfirmForm.type
    });

    if (response.code === 200) {
      this.$modal.msgSuccess('人工确认报警消息成功');
    } else {
      this.$modal.msgError(response.msg || '确认失败');
    }
  } catch (error) {
    console.error('人工确认报警消息失败:', error);
    this.$modal.msgError('人工确认报警消息失败');
  } finally {
    jt1078ParamsLoading.value = false;
  }
};

// JT1078链路检测
const handleLinkCheck = async () => {
  if (!jt1078CurrentDevice.mobileNo) {
    this.$modal.msgError('设备手机号不能为空');
    return;
  }

  try {
    jt1078ParamsLoading.value = true;
    const response = await linkCheck({
      clientId: jt1078CurrentDevice.mobileNo
    });

    if (response.code === 200) {
      jt1078LinkCheckResult.value = response.data;
      this.$modal.msgSuccess('链路检测成功');
    } else {
      this.$modal.msgError(response.msg || '检测失败');
    }
  } catch (error) {
    console.error('链路检测失败:', error);
    this.$modal.msgError('链路检测失败');
  } finally {
    jt1078ParamsLoading.value = false;
  }
};

// JT1078文本信息下发
const handleSendText = async () => {
  if (!jt1078CurrentDevice.mobileNo) {
    this.$modal.msgError('设备手机号不能为空');
    return;
  }

  if (!jt1078TextForm.content) {
    this.$modal.msgError('文本内容不能为空');
    return;
  }

  try {
    jt1078ParamsLoading.value = true;
    let sign = 0;
    jt1078TextForm.signBits.forEach(bit => {
      sign |= bit;
    });
    const response = await sendText({
      clientId: jt1078CurrentDevice.mobileNo,
      sign: sign,
      type: jt1078TextForm.type,
      content: jt1078TextForm.content
    });

    if (response.code === 200) {
      this.$modal.msgSuccess('文本信息下发成功');
    } else {
      this.$modal.msgError(response.msg || '下发失败');
    }
  } catch (error) {
    console.error('文本信息下发失败:', error);
    this.$modal.msgError('文本信息下发失败');
  } finally {
    jt1078ParamsLoading.value = false;
  }
};

// JT1078事件设置
const handleEventSetting = async () => {
  if (!jt1078CurrentDevice.mobileNo) {
    this.$modal.msgError('设备手机号不能为空');
    return;
  }

  try {
    jt1078ParamsLoading.value = true;
    const response = await eventSetting({
      clientId: jt1078CurrentDevice.mobileNo,
      type: jt1078EventForm.type,
      events: jt1078EventForm.events
    });

    if (response.code === 200) {
      this.$modal.msgSuccess('事件设置成功');
    } else {
      this.$modal.msgError(response.msg || '设置失败');
    }
  } catch (error) {
    console.error('事件设置失败:', error);
    this.$modal.msgError('事件设置失败');
  } finally {
    jt1078ParamsLoading.value = false;
  }
};

// JT1078提问下发
const handleSendQuestion = async () => {
  if (!jt1078CurrentDevice.mobileNo) {
    this.$modal.msgError('设备手机号不能为空');
    return;
  }

  if (!jt1078QuestionForm.content) {
    this.$modal.msgError('问题内容不能为空');
    return;
  }

  try {
    jt1078ParamsLoading.value = true;
    let sign = 0;
    jt1078QuestionForm.signBits.forEach(bit => {
      sign |= bit;
    });
    const response = await sendQuestion({
      clientId: jt1078CurrentDevice.mobileNo,
      sign: sign,
      content: jt1078QuestionForm.content,
      options: jt1078QuestionForm.options
    });

    if (response.code === 200) {
      this.$modal.msgSuccess('提问下发成功');
    } else {
      this.$modal.msgError(response.msg || '下发失败');
    }
  } catch (error) {
    console.error('提问下发失败:', error);
    this.$modal.msgError('提问下发失败');
  } finally {
    jt1078ParamsLoading.value = false;
  }
};

// JT1078信息点播菜单设置
const handleMenuSetting = async () => {
  if (!jt1078CurrentDevice.mobileNo) {
    this.$modal.msgError('设备手机号不能为空');
    return;
  }

  try {
    jt1078ParamsLoading.value = true;
    const response = await menuSetting({
      clientId: jt1078CurrentDevice.mobileNo,
      type: jt1078MenuForm.type,
      infos: jt1078MenuForm.infos
    });

    if (response.code === 200) {
      this.$modal.msgSuccess('信息点播菜单设置成功');
    } else {
      this.$modal.msgError(response.msg || '设置失败');
    }
  } catch (error) {
    console.error('信息点播菜单设置失败:', error);
    this.$modal.msgError('信息点播菜单设置失败');
  } finally {
    jt1078ParamsLoading.value = false;
  }
};

// JT1078信息服务
const handleInfoService = async () => {
  if (!jt1078CurrentDevice.mobileNo) {
    this.$modal.msgError('设备手机号不能为空');
    return;
  }

  if (!jt1078InfoServiceForm.content) {
    this.$modal.msgError('信息内容不能为空');
    return;
  }

  try {
    jt1078ParamsLoading.value = true;
    const response = await infoService({
      clientId: jt1078CurrentDevice.mobileNo,
      type: jt1078InfoServiceForm.type,
      content: jt1078InfoServiceForm.content
    });

    if (response.code === 200) {
      this.$modal.msgSuccess('信息服务成功');
    } else {
      this.$modal.msgError(response.msg || '服务失败');
    }
  } catch (error) {
    console.error('信息服务失败:', error);
    this.$modal.msgError('信息服务失败');
  } finally {
    jt1078ParamsLoading.value = false;
  }
};

// JT1078电话回拨
const handlePhoneCallback = async () => {
  if (!jt1078CurrentDevice.mobileNo) {
    this.$modal.msgError('设备手机号不能为空');
    return;
  }

  if (!jt1078PhoneCallbackForm.phoneNumber) {
    this.$modal.msgError('电话号码不能为空');
    return;
  }

  try {
    jt1078ParamsLoading.value = true;
    const response = await phoneCallback({
      clientId: jt1078CurrentDevice.mobileNo,
      type: jt1078PhoneCallbackForm.type,
      phoneNumber: jt1078PhoneCallbackForm.phoneNumber
    });

    if (response.code === 200) {
      this.$modal.msgSuccess('电话回拨成功');
    } else {
      this.$modal.msgError(response.msg || '回拨失败');
    }
  } catch (error) {
    console.error('电话回拨失败:', error);
    this.$modal.msgError('电话回拨失败');
  } finally {
    jt1078ParamsLoading.value = false;
  }
};

// JT1078设置电话本
const handleSetPhoneBook = async () => {
  if (!jt1078CurrentDevice.mobileNo) {
    this.$modal.msgError('设备手机号不能为空');
    return;
  }

  try {
    jt1078ParamsLoading.value = true;
    const response = await setPhoneBook({
      clientId: jt1078CurrentDevice.mobileNo,
      type: jt1078PhoneBookForm.type,
      contacts: jt1078PhoneBookForm.contacts
    });

    if (response.code === 200) {
      this.$modal.msgSuccess('设置电话本成功');
    } else {
      this.$modal.msgError(response.msg || '设置失败');
    }
  } catch (error) {
    console.error('设置电话本失败:', error);
    this.$modal.msgError('设置电话本失败');
  } finally {
    jt1078ParamsLoading.value = false;
  }
};

// JT1078车辆控制
const handleVehicleControl = async () => {
  if (!jt1078CurrentDevice.mobileNo) {
    this.$modal.msgError('设备手机号不能为空');
    return;
  }

  try {
    jt1078ParamsLoading.value = true;
    const response = await vehicleControl({
      clientId: jt1078CurrentDevice.mobileNo,
      type: jt1078VehicleControlForm.type,
      param: jt1078VehicleControlForm.param
    });

    if (response.code === 200) {
      jt1078VehicleControlResult.value = response.data;
      this.$modal.msgSuccess('车辆控制成功');
    } else {
      this.$modal.msgError(response.msg || '控制失败');
    }
  } catch (error) {
    console.error('车辆控制失败:', error);
    this.$modal.msgError('车辆控制失败');
  } finally {
    jt1078ParamsLoading.value = false;
  }
};

// JT1078设置圆形区域
const handleSetCircleArea = async () => {
  if (!jt1078CurrentDevice.mobileNo) {
    this.$modal.msgError('设备手机号不能为空');
    return;
  }

  try {
    jt1078ParamsLoading.value = true;
    const response = await setCircleArea({
      clientId: jt1078CurrentDevice.mobileNo,
      action: jt1078CircleAreaForm.action,
      items: jt1078CircleAreaForm.items
    });

    if (response.code === 200) {
      this.$modal.msgSuccess('设置圆形区域成功');
    } else {
      this.$modal.msgError(response.msg || '设置失败');
    }
  } catch (error) {
    console.error('设置圆形区域失败:', error);
    this.$modal.msgError('设置圆形区域失败');
  } finally {
    jt1078ParamsLoading.value = false;
  }
};

// JT1078删除圆形区域
const handleDeleteCircleArea = async () => {
  if (!jt1078CurrentDevice.mobileNo) {
    this.$modal.msgError('设备手机号不能为空');
    return;
  }

  try {
    jt1078ParamsLoading.value = true;
    const response = await deleteCircleArea({
      clientId: jt1078CurrentDevice.mobileNo,
      id: jt1078DeleteCircleForm.ids
    });

    if (response.code === 200) {
      this.$modal.msgSuccess('删除圆形区域成功');
    } else {
      this.$modal.msgError(response.msg || '删除失败');
    }
  } catch (error) {
    console.error('删除圆形区域失败:', error);
    this.$modal.msgError('删除圆形区域失败');
  } finally {
    jt1078ParamsLoading.value = false;
  }
};

// JT1078设置矩形区域
const handleSetRectArea = async () => {
  if (!jt1078CurrentDevice.mobileNo) {
    this.$modal.msgError('设备手机号不能为空');
    return;
  }

  try {
    jt1078ParamsLoading.value = true;
    const response = await setRectArea({
      clientId: jt1078CurrentDevice.mobileNo,
      action: jt1078RectAreaForm.action,
      items: jt1078RectAreaForm.items
    });

    if (response.code === 200) {
      this.$modal.msgSuccess('设置矩形区域成功');
    } else {
      this.$modal.msgError(response.msg || '设置失败');
    }
  } catch (error) {
    console.error('设置矩形区域失败:', error);
    this.$modal.msgError('设置矩形区域失败');
  } finally {
    jt1078ParamsLoading.value = false;
  }
};

// JT1078删除矩形区域
const handleDeleteRectArea = async () => {
  if (!jt1078CurrentDevice.mobileNo) {
    this.$modal.msgError('设备手机号不能为空');
    return;
  }

  try {
    jt1078ParamsLoading.value = true;
    const response = await deleteRectArea({
      clientId: jt1078CurrentDevice.mobileNo,
      id: jt1078DeleteRectForm.ids
    });

    if (response.code === 200) {
      this.$modal.msgSuccess('删除矩形区域成功');
    } else {
      this.$modal.msgError(response.msg || '删除失败');
    }
  } catch (error) {
    console.error('删除矩形区域失败:', error);
    this.$modal.msgError('删除矩形区域失败');
  } finally {
    jt1078ParamsLoading.value = false;
  }
};

// JT1078设置多边形区域
const handleSetPolygonArea = async () => {
  if (!jt1078CurrentDevice.mobileNo) {
    this.$modal.msgError('设备手机号不能为空');
    return;
  }

  try {
    jt1078ParamsLoading.value = true;
    const response = await setPolygonArea({
      clientId: jt1078CurrentDevice.mobileNo,
      id: jt1078PolygonAreaForm.id,
      attribute: jt1078PolygonAreaForm.attribute,
      startTime: jt1078PolygonAreaForm.startTime,
      endTime: jt1078PolygonAreaForm.endTime,
      maxSpeed: jt1078PolygonAreaForm.maxSpeed,
      duration: jt1078PolygonAreaForm.duration,
      nightMaxSpeed: jt1078PolygonAreaForm.nightMaxSpeed,
      name: jt1078PolygonAreaForm.name,
      points: jt1078PolygonAreaForm.points
    });

    if (response.code === 200) {
      this.$modal.msgSuccess('设置多边形区域成功');
    } else {
      this.$modal.msgError(response.msg || '设置失败');
    }
  } catch (error) {
    console.error('设置多边形区域失败:', error);
    this.$modal.msgError('设置多边形区域失败');
  } finally {
    jt1078ParamsLoading.value = false;
  }
};

// JT1078删除多边形区域
const handleDeletePolygonArea = async () => {
  if (!jt1078CurrentDevice.mobileNo) {
    this.$modal.msgError('设备手机号不能为空');
    return;
  }

  try {
    jt1078ParamsLoading.value = true;
    const response = await deletePolygonArea({
      clientId: jt1078CurrentDevice.mobileNo,
      id: jt1078DeletePolygonForm.ids
    });

    if (response.code === 200) {
      this.$modal.msgSuccess('删除多边形区域成功');
    } else {
      this.$modal.msgError(response.msg || '删除失败');
    }
  } catch (error) {
    console.error('删除多边形区域失败:', error);
    this.$modal.msgError('删除多边形区域失败');
  } finally {
    jt1078ParamsLoading.value = false;
  }
};

// JT1078设置路线
const handleSetRoute = async () => {
  if (!jt1078CurrentDevice.mobileNo) {
    this.$modal.msgError('设备手机号不能为空');
    return;
  }

  try {
    jt1078ParamsLoading.value = true;
    const response = await setRoute({
      clientId: jt1078CurrentDevice.mobileNo,
      id: jt1078RouteForm.id,
      attribute: jt1078RouteForm.attribute,
      startTime: jt1078RouteForm.startTime,
      endTime: jt1078RouteForm.endTime,
      name: jt1078RouteForm.name,
      items: jt1078RouteForm.items
    });

    if (response.code === 200) {
      this.$modal.msgSuccess('设置路线成功');
    } else {
      this.$modal.msgError(response.msg || '设置失败');
    }
  } catch (error) {
    console.error('设置路线失败:', error);
    this.$modal.msgError('设置路线失败');
  } finally {
    jt1078ParamsLoading.value = false;
  }
};

// JT1078删除路线
const handleDeleteRoute = async () => {
  if (!jt1078CurrentDevice.mobileNo) {
    this.$modal.msgError('设备手机号不能为空');
    return;
  }

  try {
    jt1078ParamsLoading.value = true;
    const response = await deleteRoute({
      clientId: jt1078CurrentDevice.mobileNo,
      id: jt1078DeleteRouteForm.ids
    });

    if (response.code === 200) {
      this.$modal.msgSuccess('删除路线成功');
    } else {
      this.$modal.msgError(response.msg || '删除失败');
    }
  } catch (error) {
    console.error('删除路线失败:', error);
    this.$modal.msgError('删除路线失败');
  } finally {
    jt1078ParamsLoading.value = false;
  }
};

// JT1078查询区域或线路数据
const handleQueryAreaOrRoute = async () => {
  if (!jt1078CurrentDevice.mobileNo) {
    this.$modal.msgError('设备手机号不能为空');
    return;
  }

  try {
    jt1078ParamsLoading.value = true;
    const response = await queryAreaOrRoute({
      clientId: jt1078CurrentDevice.mobileNo,
      type: jt1078QueryAreaForm.type,
      id: jt1078QueryAreaForm.ids
    });

    if (response.code === 200) {
      jt1078QueryAreaResult.value = response.data;
      this.$modal.msgSuccess('查询成功');
    } else {
      this.$modal.msgError(response.msg || '查询失败');
    }
  } catch (error) {
    console.error('查询失败:', error);
    this.$modal.msgError('查询失败');
  } finally {
    jt1078ParamsLoading.value = false;
  }
};

// JT1078行驶记录仪数据采集命令
const handleTachographDataCollect = async () => {
  if (!jt1078CurrentDevice.mobileNo) {
    this.$modal.msgError('设备手机号不能为空');
    return;
  }

  try {
    jt1078ParamsLoading.value = true;
    const response = await tachographDataCollect({
      clientId: jt1078CurrentDevice.mobileNo
    });

    if (response.code === 200) {
      this.$modal.msgSuccess('行驶记录仪数据采集命令发送成功');
    } else {
      this.$modal.msgError(response.msg || '发送失败');
    }
  } catch (error) {
    console.error('行驶记录仪数据采集命令发送失败:', error);
    this.$modal.msgError('行驶记录仪数据采集命令发送失败');
  } finally {
    jt1078ParamsLoading.value = false;
  }
};

// JT1078行驶记录仪参数下传命令
const handleTachographParamSend = async () => {
  if (!jt1078CurrentDevice.mobileNo) {
    this.$modal.msgError('设备手机号不能为空');
    return;
  }

  try {
    jt1078ParamsLoading.value = true;
    const response = await tachographParamSend({
      clientId: jt1078CurrentDevice.mobileNo,
      type: jt1078TachographParamSendForm.type,
      content: jt1078TachographParamSendForm.content
    });

    if (response.code === 200) {
      this.$modal.msgSuccess('行驶记录仪参数下传成功');
    } else {
      this.$modal.msgError(response.msg || '下传失败');
    }
  } catch (error) {
    console.error('行驶记录仪参数下传失败:', error);
    this.$modal.msgError('行驶记录仪参数下传失败');
  } finally {
    jt1078ParamsLoading.value = false;
  }
};

// JT1078上报驾驶员身份信息请求
const handleReportDriverInfo = async () => {
  if (!jt1078CurrentDevice.mobileNo) {
    this.$modal.msgError('设备手机号不能为空');
    return;
  }

  try {
    jt1078ParamsLoading.value = true;
    const response = await reportDriverInfo({
      clientId: jt1078CurrentDevice.mobileNo
    });

    if (response.code === 200) {
      jt1078DriverInfoResult.value = response.data;
      this.$modal.msgSuccess('上报驾驶员身份信息请求成功');
    } else {
      this.$modal.msgError(response.msg || '请求失败');
    }
  } catch (error) {
    console.error('上报驾驶员身份信息请求失败:', error);
    this.$modal.msgError('上报驾驶员身份信息请求失败');
  } finally {
    jt1078ParamsLoading.value = false;
  }
};

// JT1078查询终端音视频属性
const handleQueryTerminalAVProperties = async () => {
  if (!jt1078CurrentDevice.mobileNo) {
    this.$modal.msgError('设备手机号不能为空');
    return;
  }

  try {
    jt1078ParamsLoading.value = true;
    const response = await queryTerminalAVProperties({
      clientId: jt1078CurrentDevice.mobileNo
    });

    if (response.code === 200) {
      jt1078TerminalAVPropertiesResult.value = response.data;
      this.$modal.msgSuccess('查询终端音视频属性成功');
    } else {
      this.$modal.msgError(response.msg || '查询失败');
    }
  } catch (error) {
    console.error('查询终端音视频属性失败:', error);
    this.$modal.msgError('查询终端音视频属性失败');
  } finally {
    jt1078ParamsLoading.value = false;
  }
};

// JT1078摄像头立即拍摄命令
const handleCameraShoot = async () => {
  if (!jt1078CurrentDevice.mobileNo) {
    this.$modal.msgError('设备手机号不能为空');
    return;
  }

  try {
    jt1078ParamsLoading.value = true;
    const response = await cameraShoot({
      clientId: jt1078CurrentDevice.mobileNo,
      ...jt1078CameraShootForm
    });

    if (response.code === 200) {
      this.$modal.msgSuccess('摄像头立即拍摄命令发送成功');
    } else {
      this.$modal.msgError(response.msg || '发送失败');
    }
  } catch (error) {
    console.error('摄像头立即拍摄命令发送失败:', error);
    this.$modal.msgError('摄像头立即拍摄命令发送失败');
  } finally {
    jt1078ParamsLoading.value = false;
  }
};

// JT1078存储多媒体数据检索
const handleSearchMultimedia = async () => {
  if (!jt1078CurrentDevice.mobileNo) {
    this.$modal.msgError('设备手机号不能为空');
    return;
  }

  try {
    jt1078ParamsLoading.value = true;
    const response = await searchMultimedia({
      clientId: jt1078CurrentDevice.mobileNo,
      ...jt1078SearchMultimediaForm
    });

    if (response.code === 200) {
      jt1078SearchMultimediaResult.value = response.data;
      this.$modal.msgSuccess('存储多媒体数据检索成功');
    } else {
      this.$modal.msgError(response.msg || '检索失败');
    }
  } catch (error) {
    console.error('存储多媒体数据检索失败:', error);
    this.$modal.msgError('存储多媒体数据检索失败');
  } finally {
    jt1078ParamsLoading.value = false;
  }
};

// JT1078存储多媒体数据上传
const handleUploadMultimedia = async () => {
  if (!jt1078CurrentDevice.mobileNo) {
    this.$modal.msgError('设备手机号不能为空');
    return;
  }

  try {
    jt1078ParamsLoading.value = true;
    const response = await uploadMultimedia({
      clientId: jt1078CurrentDevice.mobileNo,
      ...jt1078UploadMultimediaForm
    });

    if (response.code === 200) {
      this.$modal.msgSuccess('存储多媒体数据上传命令发送成功');
    } else {
      this.$modal.msgError(response.msg || '发送失败');
    }
  } catch (error) {
    console.error('存储多媒体数据上传失败:', error);
    this.$modal.msgError('存储多媒体数据上传失败');
  } finally {
    jt1078ParamsLoading.value = false;
  }
};

// JT1078录音开始命令
const handleStartRecording = async () => {
  if (!jt1078CurrentDevice.mobileNo) {
    this.$modal.msgError('设备手机号不能为空');
    return;
  }

  try {
    jt1078ParamsLoading.value = true;
    const response = await startRecording({
      clientId: jt1078CurrentDevice.mobileNo,
      ...jt1078StartRecordingForm
    });

    if (response.code === 200) {
      this.$modal.msgSuccess('录音命令发送成功');
    } else {
      this.$modal.msgError(response.msg || '发送失败');
    }
  } catch (error) {
    console.error('录音命令发送失败:', error);
    this.$modal.msgError('录音命令发送失败');
  } finally {
    jt1078ParamsLoading.value = false;
  }
};

// JT1078单条存储多媒体数据检索上传命令
const handleSearchUploadMultimedia = async () => {
  if (!jt1078CurrentDevice.mobileNo) {
    this.$modal.msgError('设备手机号不能为空');
    return;
  }

  try {
    jt1078ParamsLoading.value = true;
    const response = await searchUploadMultimedia({
      clientId: jt1078CurrentDevice.mobileNo,
      ...jt1078SearchUploadMultimediaForm
    });

    if (response.code === 200) {
      this.$modal.msgSuccess('单条存储多媒体数据检索上传命令发送成功');
    } else {
      this.$modal.msgError(response.msg || '发送失败');
    }
  } catch (error) {
    console.error('单条存储多媒体数据检索上传命令发送失败:', error);
    this.$modal.msgError('单条存储多媒体数据检索上传命令发送失败');
  } finally {
    jt1078ParamsLoading.value = false;
  }
};

// JT1078下发终端升级包
const handleTerminalUpgrade = async () => {
  if (!jt1078CurrentDevice.mobileNo) {
    this.$modal.msgError('设备手机号不能为空');
    return;
  }

  try {
    jt1078ParamsLoading.value = true;
    const response = await terminalUpgrade({
      clientId: jt1078CurrentDevice.mobileNo,
      ...jt1078TerminalUpgradeForm
    });

    if (response.code === 200) {
      this.$modal.msgSuccess('终端升级包下发成功');
    } else {
      this.$modal.msgError(response.msg || '下发失败');
    }
  } catch (error) {
    console.error('终端升级包下发失败:', error);
    this.$modal.msgError('终端升级包下发失败');
  } finally {
    jt1078ParamsLoading.value = false;
  }
};

// 设置JT1078终端参数
const handleSetJt1078Params = async () => {
  if (!jt1078CurrentDevice.mobileNo) {
    this.$modal.msgError('设备手机号不能为空');
    return;
  }

  if (!hasModifiedParams.value) {
    this.$modal.msgWarning('没有修改任何参数');
    return;
  }

  try {
    jt1078ParamsLoading.value = true;
    const requestData: any = {
      clientId: jt1078CurrentDevice.mobileNo,
      parametersLong: {},
      parametersStr: {}
    };

    // 遍历可编辑参数，只发送修改过的
    jt1078EditableParams.value.forEach(param => {
      const key = Number(param.key);
      let value = param.editableValue;

      // 检查是否是新添加的或者被修改过
      const isModified = param.isNew || String(param.originalValue) !== String(value);
      if (!isModified) {
        return; // 跳过未修改的参数
      }

      // 尝试解析JSON字符串，但只有当originalValue是对象时才解析
      let isObject = false;
      if (typeof value === 'string' && param.originalValue && typeof param.originalValue === 'object') {
        try {
          value = JSON.parse(value);
          isObject = true;
        } catch (e) {
          // 不是JSON，保持原样
        }
      }

      // 对象类型的参数跳过，不发送（这些是复杂对象，需要专门处理）
      if (isObject || (value && typeof value === 'object')) {
        console.warn('跳过对象类型参数，不建议编辑:', key, value);
        return;
      }

      // 尝试把值转换为数值，能成功就用parametersLong，否则用parametersStr
      const numValue = Number(value);
      if (!isNaN(numValue) && value !== '' && value !== null && value !== undefined) {
        // 能转换为数值，用parametersLong发送
        // 确保我们发送的是数值类型，而不是字符串
        requestData.parametersLong[key] = numValue;
      } else {
        // 不能转换为数值，用parametersStr发送
        requestData.parametersStr[key] = String(value);
      }
    });

    // 如果没有参数，直接返回
    const hasLongParams = Object.keys(requestData.parametersLong).length > 0;
    const hasStrParams = Object.keys(requestData.parametersStr).length > 0;

    if (!hasLongParams && !hasStrParams) {
      this.$modal.msgWarning('没有可保存的参数（对象类型参数不支持编辑）');
      return;
    }

    // 清理数据，确保没有parameters字段，只保留需要的字段
    const cleanRequestData: any = {
      clientId: requestData.clientId
    };

    if (hasLongParams) {
      cleanRequestData.parametersLong = requestData.parametersLong;
    }
    if (hasStrParams) {
      cleanRequestData.parametersStr = requestData.parametersStr;
    }

    console.log('发送保存请求:', cleanRequestData);

    const response = await setTerminalParams(cleanRequestData);

    if (response.code === 200) {
      this.$modal.msgSuccess('设置终端参数成功');
      // 设置成功后重新查询
      await handleQueryJt1078Params();
    } else {
      this.$modal.msgError(response.msg || '设置失败');
    }
  } catch (error) {
    console.error('设置终端参数失败:', error);
    this.$modal.msgError('设置终端参数失败');
  } finally {
    jt1078ParamsLoading.value = false;
  }
};

// 查询指定终端参数
const handleQuerySpecificTerminalParams = async () => {
  if (!jt1078CurrentDevice.mobileNo) {
    this.$modal.msgError('设备手机号不能为空');
    return;
  }

  if (!jt1078QuerySpecificForm.ids.trim()) {
    this.$modal.msgWarning('请输入参数ID列表');
    return;
  }

  try {
    jt1078ParamsLoading.value = true;

    // 解析参数ID列表
    const idArray = jt1078QuerySpecificForm.ids
      .split(',')
      .map(id => parseInt(id.trim()))
      .filter(id => !isNaN(id));

    if (idArray.length === 0) {
      this.$modal.msgWarning('参数ID格式无效');
      return;
    }

    const response = await querySpecificTerminalParams({
      clientId: jt1078CurrentDevice.mobileNo,
      id: idArray
    });

    if (response.code === 200 && response.data) {
      // 清空旧结果
      Object.keys(jt1078QuerySpecificResult).forEach(key => {
        delete jt1078QuerySpecificResult[key];
      });
      // 复制新结果
      if (response.data.parameters) {
        Object.assign(jt1078QuerySpecificResult, response.data.parameters);
      }
      // 初始化可编辑参数
      jt1078QuerySpecificEditableParams.value = [];
      for (const [key, value] of Object.entries(jt1078QuerySpecificResult)) {
        let displayValue = value;
        let editableValue = value;
        if (value && typeof value === 'object') {
          displayValue = JSON.stringify(value, null, 2);
          editableValue = JSON.stringify(value, null, 2);
        }
        jt1078QuerySpecificEditableParams.value.push({
          key,
          value: displayValue,
          editableValue,
          originalValue: value,
          isNew: false
        });
      }
      this.$modal.msgSuccess('查询指定参数成功');
    } else {
      this.$modal.msgError(response.msg || '查询失败');
    }
  } catch (error) {
    console.error('查询指定终端参数失败:', error);
    this.$modal.msgError('查询指定终端参数失败');
  } finally {
    jt1078ParamsLoading.value = false;
  }
};

// 终端控制
const handleTerminalControl = async () => {
  if (!jt1078CurrentDevice.mobileNo) {
    this.$modal.msgError('设备手机号不能为空');
    return;
  }

  try {
    jt1078ParamsLoading.value = true;

    const requestData: any = {
      clientId: jt1078CurrentDevice.mobileNo,
      command: jt1078ControlForm.command
    };

    if (jt1078ControlForm.parameter.trim()) {
      requestData.parameter = jt1078ControlForm.parameter.trim();
    }

    const response = await terminalControl(requestData);

    if (response.code === 200) {
      jt1078ControlResult.value = {
        success: true,
        message: '终端控制执行成功'
      };
      this.$modal.msgSuccess('终端控制执行成功');
    } else {
      jt1078ControlResult.value = {
        success: false,
        message: response.msg || '执行失败'
      };
      this.$modal.msgError(response.msg || '执行失败');
    }
  } catch (error) {
    console.error('终端控制失败:', error);
    jt1078ControlResult.value = {
      success: false,
      message: '终端控制执行失败'
    };
    this.$modal.msgError('终端控制执行失败');
  } finally {
    jt1078ParamsLoading.value = false;
  }
};

// 保存查询指定参数的修改
const handleSetQuerySpecificParams = async () => {
  if (!jt1078CurrentDevice.mobileNo) {
    this.$modal.msgError('设备手机号不能为空');
    return;
  }

  if (!hasQuerySpecificModifiedParams.value) {
    this.$modal.msgWarning('没有修改任何参数');
    return;
  }

  try {
    jt1078ParamsLoading.value = true;
    const requestData: any = {
      clientId: jt1078CurrentDevice.mobileNo,
      parametersLong: {},
      parametersStr: {}
    };

    // 遍历可编辑参数，只发送修改过的
    jt1078QuerySpecificEditableParams.value.forEach(param => {
      const key = Number(param.key);
      let value = param.editableValue;

      // 检查是否被修改过
      const isModified = String(param.originalValue) !== String(value);
      if (!isModified) {
        return; // 跳过未修改的参数
      }

      // 尝试解析JSON字符串，但只有当originalValue是对象时才解析
      let isObject = false;
      if (typeof value === 'string' && param.originalValue && typeof param.originalValue === 'object') {
        try {
          value = JSON.parse(value);
          isObject = true;
        } catch (e) {
          // 不是JSON，保持原样
        }
      }

      // 对象类型的参数跳过，不发送（这些是复杂对象，需要专门处理）
      if (isObject || (value && typeof value === 'object')) {
        console.warn('跳过对象类型参数，不建议编辑:', key, value);
        return;
      }

      // 尝试把值转换为数值，能成功就用parametersLong，否则用parametersStr
      const numValue = Number(value);
      if (!isNaN(numValue) && value !== '' && value !== null && value !== undefined) {
        // 能转换为数值，用parametersLong发送
        // 确保我们发送的是数值类型，而不是字符串
        requestData.parametersLong[key] = numValue;
      } else {
        // 不能转换为数值，用parametersStr发送
        requestData.parametersStr[key] = String(value);
      }
    });

    // 如果没有参数，直接返回
    const hasLongParams = Object.keys(requestData.parametersLong).length > 0;
    const hasStrParams = Object.keys(requestData.parametersStr).length > 0;

    if (!hasLongParams && !hasStrParams) {
      this.$modal.msgWarning('没有可保存的参数（对象类型参数不支持编辑）');
      return;
    }

    // 清理数据，确保没有parameters字段，只保留需要的字段
    const cleanRequestData: any = {
      clientId: requestData.clientId
    };

    if (hasLongParams) {
      cleanRequestData.parametersLong = requestData.parametersLong;
    }
    if (hasStrParams) {
      cleanRequestData.parametersStr = requestData.parametersStr;
    }

    console.log('发送保存查询指定参数请求:', cleanRequestData);

    const response = await setTerminalParams(cleanRequestData);

    if (response.code === 200) {
      this.$modal.msgSuccess('设置终端参数成功');
      // 设置成功后重新查询
      await handleQuerySpecificTerminalParams();
    } else {
      this.$modal.msgError(response.msg || '设置失败');
    }
  } catch (error) {
    console.error('设置终端参数失败:', error);
    this.$modal.msgError('设置终端参数失败');
  } finally {
    jt1078ParamsLoading.value = false;
  }
};

// 刷新设备状态和通道（GB28181）
const handleRefreshDevice = async (row: QsDevice) => {
  if (!row.gbDeviceId) {
    this.$modal.msgError('设备未配置国标设备ID');
    return;
  }

  try {
    // 设置刷新状态
    row.refreshing = true;
    refreshProgress.value = 0;
    refreshProgressDialogVisible.value = true;

    // 模拟进度条跳动
    const progressInterval = setInterval(() => {
      if (refreshProgress.value < 90) {
        refreshProgress.value += Math.floor(Math.random() * 10) + 1;
      }
    }, 300);

    // 调用刷新接口
    const response = await refreshDevice(row.gbDeviceId);

    // 清除进度条定时器
    clearInterval(progressInterval);

    if (response.code === 200) {
      // 设置为100%
      refreshProgress.value = 100;

      // 延迟关闭对话框，让用户看到100%
      setTimeout(() => {
        refreshProgressDialogVisible.value = false;
        this.$modal.msgSuccess('刷新成功');
        // 重新获取国标设备列表，更新通道信息
        getAllDevices().then((res) => {
          gb28181DeviceList.value = res.data;
        });
        // 刷新设备列表
        getList();
      }, 2000);
    } else {
      refreshProgressDialogVisible.value = false;
      this.$modal.msgError(response.msg || '刷新失败');
    }
  } catch (error) {
    console.error('刷新失败:', error);
    refreshProgressDialogVisible.value = false;
    this.$modal.msgError('刷新失败');
  } finally {
    row.refreshing = false;
  }
}

// 计算属性：判断是否应该显示抓图按钮
 && streamInfo.value?.app && streamInfo.value?.stream;
});

// 获取设备抓图列表
function getDeviceSnapshotList() {
  deviceSnapshotLoading.value = true;
  listSnapshot({
    ...deviceSnapshotQuery,
    deviceId: deviceRow.value?.id
  }).then(response => {
    deviceSnapshotList.value = response.rows;
    deviceSnapshotTotal.value = response.total;
    deviceSnapshotLoading.value = false;
  }).catch(() => {
    deviceSnapshotLoading.value = false;
  });
}

// 删除单个抓图记录
function handleDeleteDeviceSnapshot(row: QsDeviceSnapshot) {
  this.$modal.confirm('是否确认删除该抓图记录?').then(() => {
    return delSnapshot(row.id);
  }).then(() => {
    getDeviceSnapshotList();
    this.$modal.msgSuccess("删除成功");
  }).catch(() => {});
}

// 下载抓图
// 下载抓图
async function handleDownloadDeviceSnapshot(row: QsDeviceSnapshot) {
  if (row.fileUrl) {
    try {
      // 用 fetch 获取 blob，确保真正下载而不是预览
      const response = await fetch(row.fileUrl);
      if (!response.ok) {
        throw new Error('下载失败');
      }
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      // 从URL中提取文件名作为默认下载名
      const urlFileName = row.fileUrl.split('/').pop();
      link.download = row.fileName || urlFileName || 'snapshot.jpg';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('下载失败:', error);
      ElMessage.error('下载失败，请稍后重试');
    }
  }
}

// 简单的文件大小格式化
function formatDeviceSnapshotFileSize(bytes: number | undefined): string {
  if (bytes === undefined) return '-';
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}

// 从流中抓图
const handleCaptureFromStream = async () => {
  try {
    await this.$modal.confirm(`是否确认对设备"${deviceRow.value?.deviceName}"进行抓图？`);

    captureLoading.value = true;
    let response;
    const deviceType = deviceRow.value?.type;
    const deviceId = deviceRow.value?.id;
    const channelId = deviceRow.value?.channel || 0;

    // 根据设备类型调用不同的API
    if (deviceType === '5') {
      // ONVIF 设备
      response = await captureOnvifAndSave(deviceId, channelId, 'manual');
    } else if (deviceType === '7') {
      // 海康设备
      response = await captureHaikangAndSave(deviceId, channelId, 'manual');
    } else if (deviceType === '8') {
      // 海康ISUP设备
      response = await captureHaiKangIsupAndSave(deviceId, channelId, 'manual');
    } else if (deviceType === '9') {
      // 大华设备
      response = await captureDaHuaAndSave(deviceId, channelId, 'manual');
    } else {
      // 其他设备（RTSP/RTMP/FLV/HLS等）
      if (!streamInfo.value?.app || !streamInfo.value?.stream) {
        this.$modal.msgError('流信息不完整，无法抓图');
        return;
      }
      response = await captureFromStream({
        deviceId: deviceId,
        app: streamInfo.value.app,
        stream: streamInfo.value.stream,
        snapshotType: 'manual'
      });
    }

    if (response.code === 200) {
      this.$modal.msgSuccess('抓图成功，已保存到数据库');
      // 刷新抓图列表
      getDeviceSnapshotList();
    } else {
      this.$modal.msgError(response.msg || '抓图失败');
    }
  } catch (error) {
    if (error !== 'cancel') {
      console.error('抓图失败:', error);
      this.$modal.msgError('抓图失败');
    }
  } finally {
    captureLoading.value = false;
  }
};

// 设备抓图
const handleCapture = async (row: QsDevice) => {
  try {
    await this.$modal.confirm(`是否确认对设备"${row.deviceName}"进行抓图？`);

    const channelId = row.channel || 0;
    let response;

    // 根据设备类型调用不同的API
    if (row.type === '5') {
      // ONVIF 设备
      response = await captureOnvifAndSave(row.id, channelId, 'manual');
    } else if (row.type === '7') {
      // 海康设备
      response = await captureHaikangAndSave(row.id, channelId, 'manual');
    } else if (row.type === '8') {
      // 海康ISUP设备
      response = await captureHaiKangIsupAndSave(row.id, channelId, 'manual');
    } else if (row.type === '9') {
      // 大华设备
      response = await captureDaHuaAndSave(row.id, channelId, 'manual');
    } else {
      this.$modal.msgError('不支持的设备类型');
      return;
    }

    if (response.code === 200) {
      this.$modal.msgSuccess('抓图成功，已保存到数据库');
    } else {
      this.$modal.msgError(response.msg || '抓图失败');
    }
  } catch (error) {
    if (error !== 'cancel') {
      console.error('抓图失败:', error);
      this.$modal.msgError('抓图失败');
    }
  }
}

// 重启设备（支持海康/大华/海康ISUP/GB28181/JT1078/ONVIF）
const handleReboot = async (row: QsDevice) => {
  try {
    await this.$modal.confirm(`是否确认重启设备"${row.deviceName}"？`);

    let response;
    // 根据设备类型调用不同的API
    if (row.type === '5') {
      // ONVIF 设备
      response = await restartOnvifDevice(row.id);
    } else if (row.type === '7') {
      // 海康设备
      response = await rebootHaiKangDevice(row.id);
    } else if (row.type === '8') {
      // 海康ISUP设备
      response = await rebootHaiKangIsupDevice(row.id);
    } else if (row.type === '9') {
      // 大华设备
      response = await rebootDaHuaDevice(row.id);
    } else if (row.type === '12') {
      // GB28181 设备
      if (!row.gbDeviceId) {
        this.$modal.msgError('设备未配置国标设备ID');
        return;
      }
      response = await rebootGb28181Device(row.gbDeviceId);
    } else if (row.type === '14') {
      // JT1078 设备 - 终端控制命令字4是终端复位（重启）
      if (!row.jtMobileNo) {
        this.$modal.msgError('设备未配置JT1078手机号');
        return;
      }
      response = await terminalControl({
        clientId: row.jtMobileNo,
        command: 4, // 4表示终端复位（重启）
        parameter: ''
      });
    } else {
      this.$modal.msgError('不支持的设备类型');
      return;
    }

    if (response.code === 200) {
      this.$modal.msgSuccess('重启命令已发送，设备正在重启...');
    } else {
      this.$modal.msgError(response.msg || '重启失败');
    }
  } catch (error) {
    if (error !== 'cancel') {
      console.error('重启设备失败:', error);
      this.$modal.msgError('重启设备失败');
    }
  }
}

// 录像控制对话框
;
;
;

// GB28181设备信息对话框
;
;
;
;
;


// 查询设备信息数据
const queryDeviceInfoData = async () => {
  if (!currentDeviceRow.value?.gbDeviceId) {
    this.$modal.msgError('设备未配置国标设备ID');
    return;
  }
  gb28181DeviceInfoLoading.value = true;
  try {
    const response = await queryDeviceInfo(currentDeviceRow.value.gbDeviceId);
    if (response.code === 200 && response.data) {
      gb28181DeviceInfo.value = {
        deviceId: response.data.deviceId || '',
        cmdType: response.data.cmdType || '',
        sn: response.data.sn || '',
        deviceName: response.data.deviceName || '',
        result: response.data.result || '',
        manufacturer: response.data.manufacturer || '',
        model: response.data.model || '',
        firmware: response.data.firmware || '',
        channel: response.data.channel || null,
        extraInfo: response.data.extraInfo || []
      };
    } else {
      this.$modal.msgError(response.msg || '查询设备信息失败');
    }
  } catch (error) {
    console.error('查询设备信息失败:', error);
    this.$modal.msgError('查询设备信息失败');
  } finally {
    gb28181DeviceInfoLoading.value = false;
  }
};

// 查询设备状态数据
const queryDeviceStatusData = async () => {
  if (!currentDeviceRow.value?.gbDeviceId) {
    this.$modal.msgError('设备未配置国标设备ID');
    return;
  }
  gb28181DeviceInfoLoading.value = true;
  try {
    const response = await queryDeviceStatus(currentDeviceRow.value.gbDeviceId);
    if (response.code === 200 && response.data) {
      gb28181DeviceStatus.value = {
        deviceId: response.data.deviceId || '',
        cmdType: response.data.cmdType || '',
        sn: response.data.sn || '',
        result: response.data.result || '',
        online: response.data.online || '',
        status: response.data.status || '',
        reason: response.data.reason || '',
        encode: response.data.encode || '',
        record: response.data.record || '',
        deviceTime: response.data.deviceTime || '',
        alarmStatus: response.data.alarmStatus || [],
        extraInfo: response.data.extraInfo || []
      };
    } else {
      this.$modal.msgError(response.msg || '查询设备状态失败');
    }
  } catch (error) {
    console.error('查询设备状态失败:', error);
    this.$modal.msgError('查询设备状态失败');
  } finally {
    gb28181DeviceInfoLoading.value = false;
  }
};

// 标签页切换处理
const handleTabChange = (tabName: string) => {
  if (tabName === 'deviceInfo') {
    queryDeviceInfoData();
  } else if (tabName === 'deviceStatus') {
    queryDeviceStatusData();
  } else if (tabName === 'sdCard') {
    handleQueryGb28181SdCardStatus();
  }
};

// 刷新当前标签页
const handleRefreshCurrentTab = () => {
  if (gb28181DeviceInfoTabActive.value === 'deviceInfo') {
    queryDeviceInfoData();
  } else if (gb28181DeviceInfoTabActive.value === 'deviceStatus') {
    queryDeviceStatusData();
  } else if (gb28181DeviceInfoTabActive.value === 'sdCard') {
    handleQueryGb28181SdCardStatus();
  }
};

// ONVIF标签页切换处理
const handleOnvifTabChange = (tabName: string) => {
  if (tabName === 'deviceInfo') {
    handleRefreshOnvifDeviceInfo();
  } else if (tabName === 'storageConfigurations') {
    handleGetOnvifStorageConfigurations();
  } else if (tabName === 'storageCapabilities') {
    handleGetOnvifStorageCapabilities();
  } else if (tabName === 'storageState') {
    handleGetOnvifStorageState();
  } else if (tabName === 'networkInterfaces') {
    handleGetOnvifNetworkInterfaces();
  } else if (tabName === 'networkProtocols') {
    handleGetOnvifNetworkProtocols();
  } else if (tabName === 'videoSourceConfigs') {
    handleGetOnvifVideoSourceConfigs();
  } else if (tabName === 'videoEncoderConfigs') {
    handleGetOnvifVideoEncoderConfigs();
  } else if (tabName === 'audioSourceConfigs') {
    handleGetOnvifAudioSourceConfigs();
  } else if (tabName === 'audioEncoderConfigs') {
    handleGetOnvifAudioEncoderConfigs();
  } else if (tabName === 'videoOutputConfigs') {
    handleGetOnvifVideoOutputConfigs();
  }
};

// 设备信息标签页切换处理
const handleDeviceInfoTabChange = (tabName: string) => {
  if (tabName === 'deviceInfo') {
    handleRefreshDeviceInfo();
  } else if (tabName === 'systemParam') {
    handleGetSystemParam();
  } else if (tabName === 'videoParam') {
    handleGetVideoParam();
  } else if (tabName === 'deviceVideoParam') {
    handleGetDeviceVideoParam();
  } else if (tabName === 'storageInfo') {
    handleGetStorageInfo();
  } else if (tabName === 'systemResourceInfo') {
    handleGetSystemResourceInfo();
  } else if (tabName === 'sdCardInfo') {
    handleGetSDCardInfo();
  } else if (tabName === 'bitrateInfo') {
    handleGetBitrateInfo();
  } else if (tabName === 'networkStatusInfo') {
    handleGetNetworkStatusInfo();
  } else if (tabName === 'softwareVersionInfo') {
    handleGetSoftwareVersionInfo();
  } else if (tabName === 'recordStateInfo') {
    handleGetRecordStateInfo();
  } else if (tabName === 'powerStateInfo') {
    handleGetPowerStateInfo();
  } else if (tabName === 'alarmArmInfo') {
    handleGetAlarmArmInfo();
  } else if (tabName === 'cameraInfo') {
    handleGetCameraInfo();
  } else if (tabName === 'rtspUrlInfo') {
    handleGetRtspUrlInfo();
  }
};

// 海康设备信息标签页切换处理
const handleHaikangDeviceInfoTabChange = (tabName: string) => {
  if (tabName === 'deviceInfo') {
    handleRefreshHaikangDeviceInfo();
  } else if (tabName === 'storageInfo') {
    handleGetHaikangStorageInfo();
  } else if (tabName === 'sdCardInfo') {
    handleGetHaikangSdCardInfo();
  } else if (tabName === 'bitrateInfo') {
    handleGetHaikangBitrateInfo();
  } else if (tabName === 'networkStatusInfo') {
    handleGetHaikangNetworkStatusInfo();
  } else if (tabName === 'softwareVersionInfo') {
    handleGetHaikangSoftwareVersionInfo();
  } else if (tabName === 'recordStateInfo') {
    handleGetHaikangRecordStateInfo();
  } else if (tabName === 'powerStateInfo') {
    handleGetHaikangPowerStateInfo();
  } else if (tabName === 'alarmArmInfo') {
    handleGetHaikangAlarmArmInfo();
  } else if (tabName === 'cameraInfo') {
    handleGetHaikangCameraInfo();
  } else if (tabName === 'rtspUrlInfo') {
    handleGetHaikangRtspUrlInfo();
  }
};

// 海康ISUP设备信息标签页切换处理
const handleHaikangIsupDeviceInfoTabChange = (tabName: string) => {
  if (tabName === 'deviceInfo') {
    handleRefreshHaikangIsupDeviceInfo();
  } else if (tabName === 'storageInfo') {
    handleGetHaikangIsupStorageInfo();
  } else if (tabName === 'sdCardInfo') {
    handleGetHaikangIsupSdCardInfo();
  } else if (tabName === 'bitrateInfo') {
    handleGetHaikangIsupBitrateInfo();
  } else if (tabName === 'networkStatus') {
    handleGetHaikangIsupNetworkStatusInfo();
  } else if (tabName === 'softwareVersion') {
    handleGetHaikangIsupSoftwareVersionInfo();
  } else if (tabName === 'powerState') {
    handleGetHaikangIsupPowerStateInfo();
  } else if (tabName === 'cameraInfo') {
    handleGetHaikangIsupCameraInfo();
  } else if (tabName === 'deviceConfig') {
    handleGetHaikangIsupDeviceConfig();
  } else if (tabName === 'versionInfo') {
    handleGetHaikangIsupVersionInfo();
  } else if (tabName === 'systemStatus') {
    handleGetHaikangIsupSystemStatus();
  }
};

// JT1078设备信息标签页切换处理
const handleJt1078TabChange = (tabName: string) => {
  if (tabName === 'params') {
    handleQueryJt1078Params();
  } else if (tabName === 'terminalAVProperties') {
    handleQueryTerminalAVProperties();
  }
  // 注意：querySpecific 和 control 标签页不需要自动查询，因为它们需要用户主动输入
};

// 打开录像控制对话框
const handleRecordControl = async (row: QsDevice) => {
  if (row.type !== '12') {
    this.$modal.msgError('仅支持GB28181设备的录像控制');
    return;
  }
  if (!row.gbDeviceId) {
    this.$modal.msgError('设备未配置国标设备ID');
    return;
  }
  if (!row.gbChannelId) {
    this.$modal.msgError('设备未配置国标通道ID');
    return;
  }
  // 直接使用设备中已保存的 gbChannelId
  recordDialogForm.value = {
    device: row,
    channelId: row.gbChannelId,
    recordCmd: '1',
    streamNumber: 0
  };
  recordDialogVisible.value = true;
};

// 提交录像控制
const submitRecordControl = async () => {
  if (!recordDialogForm.value.device || !recordDialogForm.value.channelId) {
    this.$modal.msgError('请选择设备和通道');
    return;
  }
  try {
    const response = await recordCmd(
      recordDialogForm.value.device.gbDeviceId,
      recordDialogForm.value.channelId,
      recordDialogForm.value.recordCmd,
      recordDialogForm.value.streamNumber
    );
    if (response.code === 200) {
      this.$modal.msgSuccess('录像控制命令已发送');
      recordDialogVisible.value = false;
    } else {
      this.$modal.msgError(response.msg || '录像控制失败');
    }
  } catch (error) {
    console.error('录像控制失败:', error);
    this.$modal.msgError('录像控制失败');
  }
};

// 设备信息对话框中的重启按钮处理
const handleDeviceInfoReboot = async () => {
  if (!currentDeviceRow.value) {
    this.$modal.msgError('设备信息未加载');
    return;
  }
  await handleReboot(currentDeviceRow.value);
}

// 设备信息对话框中的校时按钮处理
const handleDeviceInfoTimeSync = () => {
  if (!currentDeviceRow.value) {
    this.$modal.msgError('设备信息未加载');
    return;
  }
  openTimeSyncDialog(currentDeviceRow.value);
}

// 当前下载的设备行
let currentDownloadDevice: QsDevice | null = null;

// 海康设备信息弹窗
;
;
;

// 海康设备信息数据
;

// 海康存储信息
;

// 海康SD卡信息
;

// 海康码流信息
;

// 海康网络状态信息
;

// 海康软件版本信息
;

// 海康录像状态信息
;

// 海康电源状态信息
;

// 海康报警布防信息
;

// 海康摄像头属性信息
;

// 海康RTSP URL信息
;

// 海康ISUP设备信息弹窗
;
;
;

// 海康ISUP设备信息数据
;

// 海康ISUP存储信息
;

// 海康ISUP SD卡信息
;

// 海康ISUP码流信息
;

// 海康ISUP网络状态信息
;

// 海康ISUP软件版本信息
;

// 海康ISUP电源状态信息
;

// 海康ISUP摄像头属性信息
;

// 海康ISUP系统状态信息
;

// 海康ISUP远程升级
;
;
;
const haikangIsupUpgradeResult = reactive({
  success: false,
  message: '',
  upgradeResult: '',
  beforeInfo: {}
});

// 海康ISUP设备配置
;

// 海康ISUP版本信息
;



// 获取下载对话框标题
const getDownloadDialogTitle = () => {
  if (!currentDownloadDevice) {
    return '设备录像下载';
  }
  const deviceType = String(currentDownloadDevice.type);
  if (deviceType === '9') {
    return '大华设备录像下载';
  } else if (deviceType === '7') {
    return '海康SDK设备录像下载';
  } else if (deviceType === '8') {
    return '海康ISUP设备录像下载';
  }
  return '设备录像下载';
};

// 打开录像下载对话框
const openDownloadRecordDialog = (row: QsDevice) => {
  currentDownloadDevice = row;
  downloadRecordForm.deviceId = row.id;
  downloadRecordForm.deviceName = row.deviceName || '';
  downloadRecordForm.channelId = row.channel || 0;

  // 默认设置时间为过去10分钟到现在
  const now = new Date();
  const tenMinutesAgo = new Date(now.getTime() - 10 * 60 * 1000);

  downloadRecordForm.startTime = formatDateTime(tenMinutesAgo);
  downloadRecordForm.endTime = formatDateTime(now);
  downloadRecordForm.recordFileType = 0;

  downloadResult.value = null;
  downloadRecordDialogVisible.value = true;
}

// 格式化日期时间
const formatDateTime = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hour = String(date.getHours()).padStart(2, '0');
  const minute = String(date.getMinutes()).padStart(2, '0');
  const second = String(date.getSeconds()).padStart(2, '0');
  return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
}

// 处理录像下载
const handleDownloadRecord = async () => {
  if (!downloadRecordForm.deviceId) {
    this.$modal.msgError('设备ID不能为空');
    return;
  }
  if (!downloadRecordForm.startTime) {
    this.$modal.msgError('请选择开始时间');
    return;
  }
  if (!downloadRecordForm.endTime) {
    this.$modal.msgError('请选择结束时间');
    return;
  }

  // 验证时间差是否超过10分钟
  const start = new Date(downloadRecordForm.startTime);
  const end = new Date(downloadRecordForm.endTime);
  const diffMinutes = (end.getTime() - start.getTime()) / (1000 * 60);

  if (diffMinutes > 10) {
    this.$modal.msgWarning('下载时间范围不能超过10分钟');
    return;
  }
  if (diffMinutes <= 0) {
    this.$modal.msgError('结束时间必须大于开始时间');
    return;
  }

  if (!currentDownloadDevice) {
    this.$modal.msgError('请先选择设备');
    return;
  }

  downloadRecordLoading.value = true;
  downloadResult.value = null;

  // 显示加载提示
  const loading = ElLoading.service({
    lock: true,
    text: "正在下载录像，请稍候...",
    background: "rgba(0, 0, 0, 0.7)",
  });

  try {
    const deviceType = String(currentDownloadDevice.type);
    const isDaHuaDevice = deviceType === '9'; // 9=大华SDK
    const isHaikangDevice = deviceType === '7' || deviceType === '8'; // 7=海康SDK,8=海康ISUP

    let blob: any;
    let extension: string = '.dav';

    if (isDaHuaDevice) {
      const request: DaHuaRecordDownloadRequest = {
        id: downloadRecordForm.deviceId,
        channelId: downloadRecordForm.channelId,
        startTime: downloadRecordForm.startTime,
        endTime: downloadRecordForm.endTime,
        recordFileType: downloadRecordForm.recordFileType
      };

      blob = await downloadDaHuaRecordDirect(request);
      extension = '.dav';
    } else if (isHaikangDevice) {
      const request = {
        id: downloadRecordForm.deviceId,
        channelId: downloadRecordForm.channelId,
        startTime: downloadRecordForm.startTime,
        endTime: downloadRecordForm.endTime,
        recordFileType: downloadRecordForm.recordFileType
      };

      if (deviceType === '8') {
        // 海康ISUP设备
        blob = await downloadHaikangIsupRecordDirect(request);
      } else {
        // 海康SDK设备
        blob = await downloadHaikangRecordDirect(request);
      }
      extension = '.mp4';
    } else {
      this.$modal.msgError('仅支持大华和海康设备录像下载');
      return;
    }

    // 如果 size > 0，直接当作文件下载
    if (blob.size > 0) {
      const fileName = `device_${downloadRecordForm.deviceId}_channel_${downloadRecordForm.channelId}_${downloadRecordForm.startTime.replace(/[:\s]/g, '-')}${extension}`;
      saveAs(blob, fileName);
      this.$modal.msgSuccess('录像下载成功');
    } else {
      // 尝试解析错误信息
      const text = await blob.text();
      try {
        const errorData = JSON.parse(text);
        this.$modal.msgError(errorData.msg || errorData.data?.errorMessage || '录像下载失败');
      } catch (e) {
        this.$modal.msgError('录像下载失败');
      }
    }
  } catch (error) {
    console.error('录像下载失败:', error);
    this.$modal.msgError('录像下载失败');
  } finally {
    downloadRecordLoading.value = false;
    // 关闭加载提示
    loading.close();
  }
}

// 打开设备信息对话框
const openDeviceInfoDialog = (row: QsDevice) => {
  currentDeviceId.value = row.id;
  currentDeviceRow.value = row;

  const isOnvifDevice = row.type === '5';
  const isHaikangSdkDevice = row.type === '7';
  const isHaikangIsupDevice = row.type === '8';
  const isDaHuaDevice = row.type === '9';
  const isGB28181Device = row.type === '12';
  const isJT1078Device = row.type === '14';

  if (isOnvifDevice) {
    onvifDeviceInfoTabActive.value = 'deviceInfo';
    onvifDeviceInfo.success = false;
    onvifDeviceInfo.manufacturer = '';
    onvifDeviceInfo.model = '';
    onvifDeviceInfo.firmwareVersion = '';
    onvifDeviceInfo.streamUris = [];
    onvifDeviceInfo.profileCount = 0;
    onvifDeviceInfo.profiles = [];

    // 重置存储信息状态
    onvifStorageDevice.value = row;
    onvifStorageConfigurations.success = false;
    Object.keys(onvifStorageConfigurations).forEach(key => {
      if (key !== 'success') {
        delete onvifStorageConfigurations[key];
      }
    });
    onvifStorageCapabilities.success = false;
    Object.keys(onvifStorageCapabilities).forEach(key => {
      if (key !== 'success') {
        delete onvifStorageCapabilities[key];
      }
    });
    onvifStorageState.success = false;
    Object.keys(onvifStorageState).forEach(key => {
      if (key !== 'success') {
        delete onvifStorageState[key];
      }
    });

    onvifDeviceInfoDialogVisible.value = true;
    handleRefreshOnvifDeviceInfo();
    return;
  }

  if (isJT1078Device) {
    // 打开JT1078终端参数对话框
    openJt1078ParamsDialog(row);
  } else if (isHaikangSdkDevice) {
    // 打开海康SDK设备信息弹窗
    haikangDeviceInfoTabActive.value = 'deviceInfo';
    Object.assign(haikangDeviceInfo, {
      serialNumber: '',
      alarmInPortNum: undefined,
      alarmOutPortNum: undefined,
      diskNum: undefined,
      dvrType: undefined,
      channelNum: undefined,
      limitLoginTime: undefined,
      leftLogTimes: undefined,
      lockLeftTime: undefined
    });
    Object.assign(haikangStorageInfo, {
      diskList: [],
      diskCount: 0,
      success: false
    });
    Object.assign(haikangSdCardInfo, {
      success: false,
      exists: false
    });
    Object.assign(haikangBitrateInfo, {
      success: false,
      channelBitrates: []
    });
    Object.assign(haikangNetworkStatusInfo, {
      success: false
    });
    Object.assign(haikangSoftwareVersionInfo, {
      success: false
    });
    Object.assign(haikangRecordStateInfo, {
      success: false
    });
    Object.assign(haikangPowerStateInfo, {
      success: false
    });
    Object.assign(haikangAlarmArmInfo, {
      success: false
    });
    Object.assign(haikangCameraInfo, {
      success: false
    });
    Object.assign(haikangRtspUrlInfo, {
      success: false
    });
    haikangDeviceInfoDialogVisible.value = true;
    handleRefreshHaikangDeviceInfo();
  } else if (isHaikangIsupDevice) {
    // 打开海康ISUP设备信息弹窗
    haikangIsupDeviceInfoTabActive.value = 'deviceInfo';
    Object.assign(haikangIsupDeviceInfo, {
      serialNumber: '',
      alarmInPortNum: undefined,
      alarmOutPortNum: undefined,
      diskNum: undefined,
      dvrType: undefined,
      channelNum: undefined,
      limitLoginTime: undefined,
      leftLogTimes: undefined,
      lockLeftTime: undefined
    });
    Object.assign(haikangIsupStorageInfo, {
      diskList: [],
      diskCount: 0,
      success: false
    });
    Object.assign(haikangIsupSdCardInfo, {
      success: false,
      exists: false
    });
    Object.assign(haikangIsupBitrateInfo, {
      success: false,
      channelBitrates: []
    });
    Object.assign(haikangIsupNetworkStatusInfo, {
      success: false
    });
    Object.assign(haikangIsupSoftwareVersionInfo, {
      success: false
    });
    Object.assign(haikangIsupPowerStateInfo, {
      success: false
    });
    Object.assign(haikangIsupCameraInfo, {
      success: false
    });
    Object.assign(haikangIsupDeviceConfig, {
      success: false,
      deviceName: '',
      deviceDescription: '',
      deviceLocation: '',
      systemContact: '',
      model: '',
      serialNumber: '',
      macAddress: '',
      firmwareVersion: '',
      hardwareVersion: '',
      manufacturer: '',
      deviceType: ''
    });
    Object.assign(haikangIsupVersionInfo, {
      success: false,
      softwareVersion: '',
      encodeVersion: '',
      panelVersion: '',
      hardwareVersion: ''
    });
    haikangIsupDeviceInfoDialogVisible.value = true;
    handleRefreshHaikangIsupDeviceInfo();
  } else if (isDaHuaDevice) {
    // 打开大华设备信息弹窗
    deviceInfoTabActive.value = 'deviceInfo';
    Object.assign(deviceInfo, {
      serialNumber: '',
      alarmInPortNum: undefined,
      alarmOutPortNum: undefined,
      diskNum: undefined,
      dvrType: undefined,
      channelNum: undefined,
      limitLoginTime: undefined,
      leftLogTimes: undefined,
      lockLeftTime: undefined
    });
    Object.assign(systemParam, {
      videoStandard: undefined,
      country: ''
    });
    Object.assign(videoParam, {
      channelId: 0,
      streamType: 0,
      formatType: undefined,
      videoEnable: undefined,
      compression: undefined,
      width: undefined,
      height: undefined,
      bitRateControl: undefined,
      bitRate: undefined,
      frameRate: undefined,
      iframeInterval: undefined,
      imageQuality: undefined
    });
    Object.assign(deviceVideoParam, {
      channelId: 0,
      brightness: undefined,
      contrast: undefined,
      saturation: undefined,
      chroma: undefined,
      sharpness: undefined,
      hue: undefined,
      gain: undefined,
      blackWhiteMode: undefined
    });
    storageInfo.storageDevices = [];
    Object.assign(systemResourceInfo, {
      success: false,
      cpuUsage: 0,
      memoryUsage: 0
    });
    Object.assign(sdCardInfo, {
      success: false,
      exists: false
    });
    Object.assign(bitrateInfo, {
      success: false,
      channelBitrates: []
    });
    Object.assign(networkStatusInfo, {
      success: false
    });
    Object.assign(softwareVersionInfo, {
      success: false
    });
    deviceInfoDialogVisible.value = true;
    handleRefreshDeviceInfo();
  } else if (isGB28181Device) {
    // 打开GB28181设备信息弹窗
    gb28181DeviceInfoTabActive.value = 'deviceInfo';
    Object.assign(gb28181DeviceInfo, {
      deviceId: '',
      cmdType: '',
      sn: '',
      deviceName: '',
      result: '',
      manufacturer: '',
      model: '',
      firmware: '',
      channel: null,
      extraInfo: []
    });
    Object.assign(gb28181DeviceStatus, {
      deviceId: '',
      cmdType: '',
      sn: '',
      result: '',
      online: '',
      status: '',
      reason: '',
      encode: '',
      record: '',
      deviceTime: '',
      alarmStatus: [],
      extraInfo: []
    });
    Object.assign(gb28181SdCardForm, {
      sdCardId: 0
    });
    Object.assign(gb28181SdCardInfo, {});
    gb28181DeviceInfoDialogVisible.value = true;
    queryDeviceInfoData();
  }
}

// 获取系统参数
const handleGetSystemParam = async () => {
  if (!currentDeviceId.value) {
    this.$modal.msgError('设备ID不能为空');
    return;
  }
  try {
    deviceInfoLoading.value = true;
    const isHaikangDevice = currentDeviceRow.value.type === '7' || currentDeviceRow.value.type === '8';
    const isDaHuaDevice = currentDeviceRow.value.type === '9';
    let res;

    if (isHaikangDevice) {
      res = await getHaiKangSystemParam(currentDeviceId.value);
    } else if (isDaHuaDevice) {
      res = await getDaHuaSystemParam(currentDeviceId.value);
    }

    if (res.data) {
      Object.assign(systemParam, res.data);
      this.$modal.msgSuccess('获取系统参数成功');
    }
  } catch (error) {
    console.error('获取系统参数失败:', error);
    this.$modal.msgError('获取系统参数失败');
  } finally {
    deviceInfoLoading.value = false;
  }
}

// 获取视频参数
const handleGetVideoParam = async () => {
  if (!currentDeviceId.value) {
    this.$modal.msgError('设备ID不能为空');
    return;
  }
  try {
    deviceInfoLoading.value = true;
    const isHaikangDevice = currentDeviceRow.value.type === '7' || currentDeviceRow.value.type === '8';
    const isDaHuaDevice = currentDeviceRow.value.type === '9';
    let res;

    if (isHaikangDevice) {
      res = await getHaiKangVideoParam(currentDeviceId.value, videoParam.channelId, videoParam.streamType);
    } else if (isDaHuaDevice) {
      res = await getDaHuaVideoParam(currentDeviceId.value, videoParam.channelId, videoParam.streamType);
    }

    if (res.data) {
      Object.assign(videoParam, res.data);
      this.$modal.msgSuccess('获取视频参数成功');
    }
  } catch (error) {
    console.error('获取视频参数失败:', error);
    this.$modal.msgError('获取视频参数失败');
  } finally {
    deviceInfoLoading.value = false;
  }
}

// 设置视频参数
const handleSetVideoParam = async () => {
  if (!currentDeviceId.value) {
    this.$modal.msgError('设备ID不能为空');
    return;
  }
  try {
    deviceInfoLoading.value = true;
    const res = await setDaHuaVideoParam(currentDeviceId.value, videoParam.channelId, videoParam.streamType, videoParam);
    if (res.code === 200) {
      this.$modal.msgSuccess('设置视频参数成功');
    } else {
      this.$modal.msgError(res.msg || '设置视频参数失败');
    }
  } catch (error) {
    console.error('设置视频参数失败:', error);
    this.$modal.msgError('设置视频参数失败');
  } finally {
    deviceInfoLoading.value = false;
  }
}

// 获取设备视频参数
const handleGetDeviceVideoParam = async () => {
  if (!currentDeviceId.value) {
    this.$modal.msgError('设备ID不能为空');
    return;
  }
  try {
    deviceInfoLoading.value = true;
    const res = await getDaHuaDeviceVideoParam(currentDeviceId.value, deviceVideoParam.channelId);
    if (res.data) {
      Object.assign(deviceVideoParam, res.data);
      this.$modal.msgSuccess('获取设备视频参数成功');
    }
  } catch (error) {
    console.error('获取设备视频参数失败:', error);
    this.$modal.msgError('获取设备视频参数失败');
  } finally {
    deviceInfoLoading.value = false;
  }
}

// 设置设备视频参数
const handleSetDeviceVideoParam = async () => {
  if (!currentDeviceId.value) {
    this.$modal.msgError('设备ID不能为空');
    return;
  }
  try {
    deviceInfoLoading.value = true;
    const res = await setDaHuaDeviceVideoParam(currentDeviceId.value, deviceVideoParam.channelId, deviceVideoParam);
    if (res.code === 200) {
      this.$modal.msgSuccess('设置设备视频参数成功');
    } else {
      this.$modal.msgError(res.msg || '设置设备视频参数失败');
    }
  } catch (error) {
    console.error('设置设备视频参数失败:', error);
    this.$modal.msgError('设置设备视频参数失败');
  } finally {
    deviceInfoLoading.value = false;
  }
}

// 获取存储信息
const handleGetStorageInfo = async () => {
  if (!currentDeviceId.value) {
    this.$modal.msgError('设备ID不能为空');
    return;
  }
  try {
    deviceInfoLoading.value = true;
    const isHaikangDevice = currentDeviceRow.value.type === '7' || currentDeviceRow.value.type === '8';
    const isDaHuaDevice = currentDeviceRow.value.type === '9';
    let res;

    if (isHaikangDevice) {
      res = await getHaiKangStorageInfo(currentDeviceId.value);
    } else if (isDaHuaDevice) {
      res = await getDaHuaStorageInfo(currentDeviceId.value);
    }

    if (res.data) {
      storageInfo.storageDevices = res.data.storageDevices || [];
      this.$modal.msgSuccess('获取存储信息成功');
    }
  } catch (error) {
    console.error('获取存储信息失败:', error);
    this.$modal.msgError('获取存储信息失败');
  } finally {
    deviceInfoLoading.value = false;
  }
}

// 获取系统资源信息
const handleGetSystemResourceInfo = async () => {
  if (!currentDeviceId.value) {
    this.$modal.msgError('设备ID不能为空');
    return;
  }
  try {
    deviceInfoLoading.value = true;
    const isHaikangDevice = currentDeviceRow.value.type === '7' || currentDeviceRow.value.type === '8';
    const isDaHuaDevice = currentDeviceRow.value.type === '9';
    let res;

    if (isHaikangDevice) {
      // 海康系统资源信息暂未实现
      this.$modal.msgInfo('海康系统资源信息暂未实现');
      return;
    } else if (isDaHuaDevice) {
      res = await getDaHuaSystemResourceInfo(currentDeviceId.value);
    }

    if (res.data) {
      Object.assign(systemResourceInfo, res.data);
      this.$modal.msgSuccess('获取系统资源信息成功');
    }
  } catch (error) {
    console.error('获取系统资源信息失败:', error);
    this.$modal.msgError('获取系统资源信息失败');
  } finally {
    deviceInfoLoading.value = false;
  }
}

// 获取SD卡信息
// 获取磁盘状态文本
const getDiskStatusText = (diskStatus: number | undefined, status: number | undefined) => {
  if (diskStatus !== undefined) {
    const statusMap: Record<number, string> = {
      0: '未知',
      1: '正常',
      2: '异常',
      3: '未格式化',
      4: '格式化中',
      5: '正在检测',
      6: '休眠',
      7: '离线'
    };
    return statusMap[diskStatus] || `状态(${diskStatus})`;
  }
  if (status !== undefined) {
    return `状态(${status})`;
  }
  return '-';
};

const getDiskStatusType = (diskStatus: number | undefined, status: number | undefined) => {
  const targetStatus = diskStatus !== undefined ? diskStatus : status;
  if (targetStatus === undefined) return 'info';

  const typeMap: Record<number, string> = {
    0: 'info',
    1: 'success',
    2: 'danger',
    3: 'warning',
    4: 'warning',
    5: 'warning',
    6: 'info',
    7: 'danger'
  };
  return typeMap[targetStatus] || 'info';
};

const getProgressColor = (percentage: number | undefined) => {
  if (percentage === undefined) return '#409EFF';
  if (percentage < 50) return '#67C23A';
  if (percentage < 80) return '#E6A23C';
  return '#F56C6C';
};

const handleGetSDCardInfo = async () => {
  if (!currentDeviceId.value) {
    this.$modal.msgError('设备ID不能为空');
    return;
  }
  try {
    deviceInfoLoading.value = true;
    const isHaikangDevice = currentDeviceRow.value.type === '7' || currentDeviceRow.value.type === '8';
    const isDaHuaDevice = currentDeviceRow.value.type === '9';
    let res;

    if (isHaikangDevice) {
      res = await getHaiKangSDCardInfo(currentDeviceId.value);
    } else if (isDaHuaDevice) {
      res = await getDaHuaSDCardInfo(currentDeviceId.value);
    }

    if (res.data) {
      Object.assign(sdCardInfo, res.data);
      this.$modal.msgSuccess('获取SD卡信息成功');
    }
  } catch (error) {
    console.error('获取SD卡信息失败:', error);
    this.$modal.msgError('获取SD卡信息失败');
  } finally {
    deviceInfoLoading.value = false;
  }
}

// 获取码流信息
const handleGetBitrateInfo = async () => {
  if (!currentDeviceId.value) {
    this.$modal.msgError('设备ID不能为空');
    return;
  }
  try {
    deviceInfoLoading.value = true;
    const isHaikangDevice = currentDeviceRow.value.type === '7' || currentDeviceRow.value.type === '8';
    const isDaHuaDevice = currentDeviceRow.value.type === '9';
    let res;

    if (isHaikangDevice) {
      res = await getHaiKangBitrateInfo(currentDeviceId.value);
    } else if (isDaHuaDevice) {
      res = await getDaHuaBitrateInfo(currentDeviceId.value);
    }

    if (res.data) {
      Object.assign(bitrateInfo, res.data);
      this.$modal.msgSuccess('获取码流信息成功');
    }
  } catch (error) {
    console.error('获取码流信息失败:', error);
    this.$modal.msgError('获取码流信息失败');
  } finally {
    deviceInfoLoading.value = false;
  }
}

// 获取网络状态信息
const handleGetNetworkStatusInfo = async () => {
  if (!currentDeviceId.value) {
    this.$modal.msgError('设备ID不能为空');
    return;
  }
  try {
    deviceInfoLoading.value = true;
    const isHaikangDevice = currentDeviceRow.value.type === '7' || currentDeviceRow.value.type === '8';
    const isDaHuaDevice = currentDeviceRow.value.type === '9';
    let res;

    if (isHaikangDevice) {
      res = await getHaiKangNetworkStatusInfo(currentDeviceId.value);
    } else if (isDaHuaDevice) {
      res = await getDaHuaNetworkStatusInfo(currentDeviceId.value);
    }

    if (res.data) {
      Object.assign(networkStatusInfo, res.data);
      this.$modal.msgSuccess('获取网络状态信息成功');
    }
  } catch (error) {
    console.error('获取网络状态信息失败:', error);
    this.$modal.msgError('获取网络状态信息失败');
  } finally {
    deviceInfoLoading.value = false;
  }
}

// 获取软件版本信息
const handleGetSoftwareVersionInfo = async () => {
  if (!currentDeviceId.value) {
    this.$modal.msgError('设备ID不能为空');
    return;
  }
  try {
    deviceInfoLoading.value = true;
    const isHaikangDevice = currentDeviceRow.value.type === '7' || currentDeviceRow.value.type === '8';
    const isDaHuaDevice = currentDeviceRow.value.type === '9';
    let res;

    if (isHaikangDevice) {
      res = await getHaiKangSoftwareVersionInfo(currentDeviceId.value);
    } else if (isDaHuaDevice) {
      res = await getDaHuaSoftwareVersionInfo(currentDeviceId.value);
    }

    if (res.data) {
      Object.assign(softwareVersionInfo, res.data);
      this.$modal.msgSuccess('获取软件版本信息成功');
    }
  } catch (error) {
    console.error('获取软件版本信息失败:', error);
    this.$modal.msgError('获取软件版本信息失败');
  } finally {
    deviceInfoLoading.value = false;
  }
}

const handleGetRecordStateInfo = async () => {
  if (!currentDeviceId.value) {
    this.$modal.msgError('设备ID不能为空');
    return;
  }
  try {
    deviceInfoLoading.value = true;
    const isHaikangDevice = currentDeviceRow.value.type === '7' || currentDeviceRow.value.type === '8';
    const isDaHuaDevice = currentDeviceRow.value.type === '9';
    let res;

    if (isHaikangDevice) {
      res = await getHaiKangRecordStateInfo(currentDeviceId.value);
    } else if (isDaHuaDevice) {
      res = await getDaHuaRecordStateInfo(currentDeviceId.value);
    }

    if (res.data) {
      Object.assign(recordStateInfo, res.data);
      this.$modal.msgSuccess('获取录像状态信息成功');
    }
  } catch (error) {
    console.error('获取录像状态信息失败:', error);
    this.$modal.msgError('获取录像状态信息失败');
  } finally {
    deviceInfoLoading.value = false;
  }
}

const handleGetPowerStateInfo = async () => {
  if (!currentDeviceId.value) {
    this.$modal.msgError('设备ID不能为空');
    return;
  }
  try {
    deviceInfoLoading.value = true;
    const isHaikangDevice = currentDeviceRow.value.type === '7' || currentDeviceRow.value.type === '8';
    const isDaHuaDevice = currentDeviceRow.value.type === '9';
    let res;

    if (isHaikangDevice) {
      res = await getHaiKangPowerStateInfo(currentDeviceId.value);
    } else if (isDaHuaDevice) {
      res = await getDaHuaPowerStateInfo(currentDeviceId.value);
    }

    if (res.data) {
      Object.assign(powerStateInfo, res.data);
      this.$modal.msgSuccess('获取电源状态信息成功');
    }
  } catch (error) {
    console.error('获取电源状态信息失败:', error);
    this.$modal.msgError('获取电源状态信息失败');
  } finally {
    deviceInfoLoading.value = false;
  }
}

const handleGetAlarmArmInfo = async () => {
  if (!currentDeviceId.value) {
    this.$modal.msgError('设备ID不能为空');
    return;
  }
  try {
    deviceInfoLoading.value = true;
    const isHaikangDevice = currentDeviceRow.value.type === '7' || currentDeviceRow.value.type === '8';
    const isDaHuaDevice = currentDeviceRow.value.type === '9';
    let res;

    if (isHaikangDevice) {
      res = await getHaiKangAlarmArmInfo(currentDeviceId.value);
    } else if (isDaHuaDevice) {
      res = await getDaHuaAlarmArmInfo(currentDeviceId.value);
    }

    if (res.data) {
      Object.assign(alarmArmInfo, res.data);
      this.$modal.msgSuccess('获取报警布防信息成功');
    }
  } catch (error) {
    console.error('获取报警布防信息失败:', error);
    this.$modal.msgError('获取报警布防信息失败');
  } finally {
    deviceInfoLoading.value = false;
  }
}

const handleGetCameraInfo = async () => {
  if (!currentDeviceId.value) {
    this.$modal.msgError('设备ID不能为空');
    return;
  }
  try {
    deviceInfoLoading.value = true;
    const isHaikangDevice = currentDeviceRow.value.type === '7' || currentDeviceRow.value.type === '8';
    const isDaHuaDevice = currentDeviceRow.value.type === '9';
    let res;

    if (isHaikangDevice) {
      res = await getHaiKangCameraInfo(currentDeviceId.value);
    } else if (isDaHuaDevice) {
      res = await getDaHuaCameraInfo(currentDeviceId.value);
    }

    if (res.data) {
      Object.assign(cameraInfo, res.data);
      this.$modal.msgSuccess('获取摄像头属性信息成功');
    }
  } catch (error) {
    console.error('获取摄像头属性信息失败:', error);
    this.$modal.msgError('获取摄像头属性信息失败');
  } finally {
    deviceInfoLoading.value = false;
  }
}

const handleGetRtspUrlInfo = async () => {
  if (!currentDeviceId.value) {
    this.$modal.msgError('设备ID不能为空');
    return;
  }
  try {
    deviceInfoLoading.value = true;
    const isHaikangDevice = currentDeviceRow.value.type === '7' || currentDeviceRow.value.type === '8';
    const isDaHuaDevice = currentDeviceRow.value.type === '9';
    let res;

    if (isHaikangDevice) {
      res = await getHaiKangRtspUrlInfo(currentDeviceId.value);
    } else if (isDaHuaDevice) {
      res = await getDaHuaRtspUrlInfo(currentDeviceId.value);
    }

    if (res.data) {
      Object.assign(rtspUrlInfo, res.data);
      this.$modal.msgSuccess('获取RTSP URL信息成功');
    }
  } catch (error) {
    console.error('获取RTSP URL信息失败:', error);
    this.$modal.msgError('获取RTSP URL信息失败');
  } finally {
    deviceInfoLoading.value = false;
  }
}

// 刷新设备信息
const handleRefreshDeviceInfo = async () => {
  if (!currentDeviceId.value) {
    this.$modal.msgError('设备ID不能为空');
    return;
  }
  try {
    deviceInfoLoading.value = true;
    const isHaikangDevice = currentDeviceRow.value.type === '7' || currentDeviceRow.value.type === '8';
    const isDaHuaDevice = currentDeviceRow.value.type === '9';
    let res;

    if (isHaikangDevice) {
      res = await getHaiKangDeviceInfo(currentDeviceId.value);
    } else if (isDaHuaDevice) {
      res = await getDaHuaDeviceInfo(currentDeviceId.value);
    }

    if (res.data) {
      Object.assign(deviceInfo, res.data);
      this.$modal.msgSuccess('获取设备信息成功');
    }
  } catch (error) {
    console.error('获取设备信息失败:', error);
    this.$modal.msgError('获取设备信息失败');
  } finally {
    deviceInfoLoading.value = false;
  }
}

// 海康设备信息 - 刷新设备信息
const handleRefreshHaikangDeviceInfo = async () => {
  if (!currentDeviceId.value) {
    this.$modal.msgError('设备ID不能为空');
    return;
  }
  try {
    haikangDeviceInfoLoading.value = true;
    const res = await getHaiKangDeviceInfo(currentDeviceId.value);
    if (res.data) {
      Object.assign(haikangDeviceInfo, res.data);
      this.$modal.msgSuccess('获取设备信息成功');
    }
  } catch (error) {
    console.error('获取设备信息失败:', error);
    this.$modal.msgError('获取设备信息失败');
  } finally {
    haikangDeviceInfoLoading.value = false;
  }
}

// 海康设备信息 - 获取存储信息
const handleGetHaikangStorageInfo = async () => {
  if (!currentDeviceId.value) {
    this.$modal.msgError('设备ID不能为空');
    return;
  }
  try {
    haikangDeviceInfoLoading.value = true;
    const res = await getHaiKangStorageInfo(currentDeviceId.value);
    if (res.data) {
      Object.assign(haikangStorageInfo, res.data);
      this.$modal.msgSuccess('获取存储信息成功');
    }
  } catch (error) {
    console.error('获取存储信息失败:', error);
    this.$modal.msgError('获取存储信息失败');
  } finally {
    haikangDeviceInfoLoading.value = false;
  }
}

// 海康设备信息 - 获取SD卡信息
const handleGetHaikangSdCardInfo = async () => {
  if (!currentDeviceId.value) {
    this.$modal.msgError('设备ID不能为空');
    return;
  }
  try {
    haikangDeviceInfoLoading.value = true;
    const res = await getHaiKangSDCardInfo(currentDeviceId.value);
    if (res.data) {
      Object.assign(haikangSdCardInfo, res.data);
      this.$modal.msgSuccess('获取SD卡信息成功');
    }
  } catch (error) {
    console.error('获取SD卡信息失败:', error);
    this.$modal.msgError('获取SD卡信息失败');
  } finally {
    haikangDeviceInfoLoading.value = false;
  }
}

// 海康设备信息 - 获取码率信息
const handleGetHaikangBitrateInfo = async () => {
  if (!currentDeviceId.value) {
    this.$modal.msgError('设备ID不能为空');
    return;
  }
  try {
    haikangDeviceInfoLoading.value = true;
    const res = await getHaiKangBitrateInfo(currentDeviceId.value);
    if (res.data) {
      Object.assign(haikangBitrateInfo, res.data);
      this.$modal.msgSuccess('获取码率信息成功');
    }
  } catch (error) {
    console.error('获取码率信息失败:', error);
    this.$modal.msgError('获取码率信息失败');
  } finally {
    haikangDeviceInfoLoading.value = false;
  }
}

// 海康设备信息 - 获取网络状态信息
const handleGetHaikangNetworkStatusInfo = async () => {
  if (!currentDeviceId.value) {
    this.$modal.msgError('设备ID不能为空');
    return;
  }
  try {
    haikangDeviceInfoLoading.value = true;
    const res = await getHaiKangNetworkStatusInfo(currentDeviceId.value);
    if (res.data) {
      Object.assign(haikangNetworkStatusInfo, res.data);
      this.$modal.msgSuccess('获取网络状态信息成功');
    }
  } catch (error) {
    console.error('获取网络状态信息失败:', error);
    this.$modal.msgError('获取网络状态信息失败');
  } finally {
    haikangDeviceInfoLoading.value = false;
  }
}

// 海康设备信息 - 获取软件版本信息
const handleGetHaikangSoftwareVersionInfo = async () => {
  if (!currentDeviceId.value) {
    this.$modal.msgError('设备ID不能为空');
    return;
  }
  try {
    haikangDeviceInfoLoading.value = true;
    const res = await getHaiKangSoftwareVersionInfo(currentDeviceId.value);
    if (res.data) {
      Object.assign(haikangSoftwareVersionInfo, res.data);
      this.$modal.msgSuccess('获取软件版本信息成功');
    }
  } catch (error) {
    console.error('获取软件版本信息失败:', error);
    this.$modal.msgError('获取软件版本信息失败');
  } finally {
    haikangDeviceInfoLoading.value = false;
  }
}

// 海康设备信息 - 获取录像状态信息
const handleGetHaikangRecordStateInfo = async () => {
  if (!currentDeviceId.value) {
    this.$modal.msgError('设备ID不能为空');
    return;
  }
  try {
    haikangDeviceInfoLoading.value = true;
    const res = await getHaiKangRecordStateInfo(currentDeviceId.value);
    if (res.data) {
      Object.assign(haikangRecordStateInfo, res.data);
      this.$modal.msgSuccess('获取录像状态信息成功');
    }
  } catch (error) {
    console.error('获取录像状态信息失败:', error);
    this.$modal.msgError('获取录像状态信息失败');
  } finally {
    haikangDeviceInfoLoading.value = false;
  }
}

// 海康设备信息 - 获取电源状态信息
const handleGetHaikangPowerStateInfo = async () => {
  if (!currentDeviceId.value) {
    this.$modal.msgError('设备ID不能为空');
    return;
  }
  try {
    haikangDeviceInfoLoading.value = true;
    const res = await getHaiKangPowerStateInfo(currentDeviceId.value);
    if (res.data) {
      Object.assign(haikangPowerStateInfo, res.data);
      this.$modal.msgSuccess('获取电源状态信息成功');
    }
  } catch (error) {
    console.error('获取电源状态信息失败:', error);
    this.$modal.msgError('获取电源状态信息失败');
  } finally {
    haikangDeviceInfoLoading.value = false;
  }
}

// 海康设备信息 - 获取报警布防信息
const handleGetHaikangAlarmArmInfo = async () => {
  if (!currentDeviceId.value) {
    this.$modal.msgError('设备ID不能为空');
    return;
  }
  try {
    haikangDeviceInfoLoading.value = true;
    const res = await getHaiKangAlarmArmInfo(currentDeviceId.value);
    if (res.data) {
      Object.assign(haikangAlarmArmInfo, res.data);
      this.$modal.msgSuccess('获取报警布防信息成功');
    }
  } catch (error) {
    console.error('获取报警布防信息失败:', error);
    this.$modal.msgError('获取报警布防信息失败');
  } finally {
    haikangDeviceInfoLoading.value = false;
  }
}

// 海康设备信息 - 获取摄像头属性信息
const handleGetHaikangCameraInfo = async () => {
  if (!currentDeviceId.value) {
    this.$modal.msgError('设备ID不能为空');
    return;
  }
  try {
    haikangDeviceInfoLoading.value = true;
    const res = await getHaiKangCameraInfo(currentDeviceId.value);
    if (res.data) {
      Object.assign(haikangCameraInfo, res.data);
      this.$modal.msgSuccess('获取摄像头属性信息成功');
    }
  } catch (error) {
    console.error('获取摄像头属性信息失败:', error);
    this.$modal.msgError('获取摄像头属性信息失败');
  } finally {
    haikangDeviceInfoLoading.value = false;
  }
}

// 海康设备信息 - 获取RTSP URL信息
const handleGetHaikangRtspUrlInfo = async () => {
  if (!currentDeviceId.value) {
    this.$modal.msgError('设备ID不能为空');
    return;
  }
  try {
    haikangDeviceInfoLoading.value = true;
    const res = await getHaiKangRtspUrlInfo(currentDeviceId.value);
    if (res.data) {
      Object.assign(haikangRtspUrlInfo, res.data);
      this.$modal.msgSuccess('获取RTSP URL信息成功');
    }
  } catch (error) {
    console.error('获取RTSP URL信息失败:', error);
    this.$modal.msgError('获取RTSP URL信息失败');
  } finally {
    haikangDeviceInfoLoading.value = false;
  }
}

// 海康ISUP设备信息 - 刷新设备信息
const handleRefreshHaikangIsupDeviceInfo = async () => {
  if (!currentDeviceId.value) {
    this.$modal.msgError('设备ID不能为空');
    return;
  }
  try {
    haikangIsupDeviceInfoLoading.value = true;
    const res = await getHaiKangIsupDeviceInfo(currentDeviceId.value);
    if (res.data) {
      Object.assign(haikangIsupDeviceInfo, res.data);
      this.$modal.msgSuccess('获取设备信息成功');
    }
  } catch (error) {
    console.error('获取设备信息失败:', error);
    this.$modal.msgError('获取设备信息失败');
  } finally {
    haikangIsupDeviceInfoLoading.value = false;
  }
}

// ONVIF设备信息 - 刷新设备信息
const handleRefreshOnvifDeviceInfo = async () => {
  if (!currentDeviceId.value) {
    this.$modal.msgError('设备ID不能为空');
    return;
  }
  try {
    onvifDeviceInfoLoading.value = true;
    const res = await getOnvifDeviceInfo(currentDeviceId.value);

    // 从 res.data 中获取实际数据，兼容两种返回格式
    const data = res.data || res;

    if (data.success !== undefined ? data.success : true) {
      onvifDeviceInfo.success = true;
      onvifDeviceInfo.manufacturer = data.manufacturer || '';
      onvifDeviceInfo.model = data.model || '';
      onvifDeviceInfo.firmwareVersion = data.firmwareVersion || '';

      // 处理流地址数据 - 后端返回的是字符串数组，需要转换为对象数组
      const streamUris = data.streamUris || [];
      onvifDeviceInfo.streamUris = streamUris.map((uri, index) => ({
        uri: uri,
        type: index === 0 ? 'main' : 'sub'  // 第一个默认是主码流，后续是子码流
      }));

      onvifDeviceInfo.profileCount = data.profileCount || 0;

      // 处理 Profiles 数据 - 后端返回的是字符串数组，需要转换为对象数组
      const profiles = data.profiles || [];
      onvifDeviceInfo.profiles = profiles.map((token, index) => ({
        token: token,
        name: `Profile ${index + 1}`
      }));

      this.$modal.msgSuccess('获取设备信息成功');
    } else {
      this.$modal.msgError(data.message || '获取设备信息失败');
    }
  } catch (error) {
    console.error('获取设备信息失败:', error);
    this.$modal.msgError('获取设备信息失败');
  } finally {
    onvifDeviceInfoLoading.value = false;
  }
}

// ONVIF存储信息 - 获取存储配置
const handleGetOnvifStorageConfigurations = async () => {
  if (!currentDeviceId.value) {
    this.$modal.msgError('设备ID不能为空');
    return;
  }
  try {
    onvifStorageLoading.value = true;
    const res = await getOnvifStorageConfigurations(currentDeviceId.value);

    // 从 res.data 中获取实际数据，兼容两种返回格式
    const data = res.data || res;

    // 清空并设置新数据
    Object.keys(onvifStorageConfigurations).forEach(key => {
      delete onvifStorageConfigurations[key];
    });
    onvifStorageConfigurations.success = true;
    Object.assign(onvifStorageConfigurations, data);

    this.$modal.msgSuccess('获取存储配置成功');
  } catch (error) {
    console.error('获取存储配置失败:', error);
    this.$modal.msgError('获取存储配置失败');
  } finally {
    onvifStorageLoading.value = false;
  }
}

// ONVIF存储信息 - 获取存储能力
const handleGetOnvifStorageCapabilities = async () => {
  if (!currentDeviceId.value) {
    this.$modal.msgError('设备ID不能为空');
    return;
  }
  try {
    onvifStorageLoading.value = true;
    const res = await getOnvifStorageCapabilities(currentDeviceId.value);

    // 从 res.data 中获取实际数据，兼容两种返回格式
    const data = res.data || res;

    // 清空并设置新数据
    Object.keys(onvifStorageCapabilities).forEach(key => {
      delete onvifStorageCapabilities[key];
    });
    onvifStorageCapabilities.success = true;
    Object.assign(onvifStorageCapabilities, data);

    this.$modal.msgSuccess('获取存储能力成功');
  } catch (error) {
    console.error('获取存储能力失败:', error);
    this.$modal.msgError('获取存储能力失败');
  } finally {
    onvifStorageLoading.value = false;
  }
}

// ONVIF存储信息 - 获取存储状态
const handleGetOnvifStorageState = async () => {
  if (!currentDeviceId.value) {
    this.$modal.msgError('设备ID不能为空');
    return;
  }
  try {
    onvifStorageLoading.value = true;
    const res = await getOnvifStorageState(currentDeviceId.value);

    // 从 res.data 中获取实际数据，兼容两种返回格式
    const data = res.data || res;

    // 清空并设置新数据
    Object.keys(onvifStorageState).forEach(key => {
      delete onvifStorageState[key];
    });
    onvifStorageState.success = true;
    Object.assign(onvifStorageState, data);

    this.$modal.msgSuccess('获取存储状态成功');
  } catch (error) {
    console.error('获取存储状态失败:', error);
    this.$modal.msgError('获取存储状态失败');
  } finally {
    onvifStorageLoading.value = false;
  }
}

// ONVIF网络配置 - 获取网络接口配置
const handleGetOnvifNetworkInterfaces = async () => {
  if (!currentDeviceId.value) {
    this.$modal.msgError('设备ID不能为空');
    return;
  }
  try {
    onvifStorageLoading.value = true;
    const res = await getOnvifNetworkInterfaces(currentDeviceId.value);

    // 从 res.data 中获取实际数据，兼容两种返回格式
    const data = res.data || res;

    // 清空并设置新数据
    Object.keys(onvifNetworkInterfaces).forEach(key => {
      delete onvifNetworkInterfaces[key];
    });
    onvifNetworkInterfaces.success = true;
    Object.assign(onvifNetworkInterfaces, data);

    this.$modal.msgSuccess('获取网络接口配置成功');
  } catch (error) {
    console.error('获取网络接口配置失败:', error);
    this.$modal.msgError('获取网络接口配置失败');
  } finally {
    onvifStorageLoading.value = false;
  }
}

// ONVIF网络配置 - 获取网络协议配置
const handleGetOnvifNetworkProtocols = async () => {
  if (!currentDeviceId.value) {
    this.$modal.msgError('设备ID不能为空');
    return;
  }
  try {
    onvifStorageLoading.value = true;
    const res = await getOnvifNetworkProtocols(currentDeviceId.value);

    // 从 res.data 中获取实际数据，兼容两种返回格式
    const data = res.data || res;

    // 清空并设置新数据
    Object.keys(onvifNetworkProtocols).forEach(key => {
      delete onvifNetworkProtocols[key];
    });
    onvifNetworkProtocols.success = true;
    Object.assign(onvifNetworkProtocols, data);

    this.$modal.msgSuccess('获取网络协议配置成功');
  } catch (error) {
    console.error('获取网络协议配置失败:', error);
    this.$modal.msgError('获取网络协议配置失败');
  } finally {
    onvifStorageLoading.value = false;
  }
}

// ONVIF媒体配置 - 获取视频源配置
const handleGetOnvifVideoSourceConfigs = async () => {
  if (!currentDeviceId.value) {
    this.$modal.msgError('设备ID不能为空');
    return;
  }
  try {
    onvifStorageLoading.value = true;
    const res = await getOnvifVideoSourceConfigs(currentDeviceId.value);

    // 从 res.data 中获取实际数据，兼容两种返回格式
    const data = res.data || res;

    // 清空并设置新数据
    Object.keys(onvifVideoSourceConfigs).forEach(key => {
      delete onvifVideoSourceConfigs[key];
    });
    onvifVideoSourceConfigs.success = true;
    Object.assign(onvifVideoSourceConfigs, data);

    this.$modal.msgSuccess('获取视频源配置成功');
  } catch (error) {
    console.error('获取视频源配置失败:', error);
    this.$modal.msgError('获取视频源配置失败');
  } finally {
    onvifStorageLoading.value = false;
  }
}

// ONVIF媒体配置 - 获取视频编码器配置
const handleGetOnvifVideoEncoderConfigs = async () => {
  if (!currentDeviceId.value) {
    this.$modal.msgError('设备ID不能为空');
    return;
  }
  try {
    onvifStorageLoading.value = true;
    const res = await getOnvifVideoEncoderConfigs(currentDeviceId.value);

    // 从 res.data 中获取实际数据，兼容两种返回格式
    const data = res.data || res;

    // 清空并设置新数据
    Object.keys(onvifVideoEncoderConfigs).forEach(key => {
      delete onvifVideoEncoderConfigs[key];
    });
    onvifVideoEncoderConfigs.success = true;
    Object.assign(onvifVideoEncoderConfigs, data);

    this.$modal.msgSuccess('获取视频编码器配置成功');
  } catch (error) {
    console.error('获取视频编码器配置失败:', error);
    this.$modal.msgError('获取视频编码器配置失败');
  } finally {
    onvifStorageLoading.value = false;
  }
}

// ONVIF媒体配置 - 获取音频源配置
const handleGetOnvifAudioSourceConfigs = async () => {
  if (!currentDeviceId.value) {
    this.$modal.msgError('设备ID不能为空');
    return;
  }
  try {
    onvifStorageLoading.value = true;
    const res = await getOnvifAudioSourceConfigs(currentDeviceId.value);

    // 从 res.data 中获取实际数据，兼容两种返回格式
    const data = res.data || res;

    // 清空并设置新数据
    Object.keys(onvifAudioSourceConfigs).forEach(key => {
      delete onvifAudioSourceConfigs[key];
    });
    onvifAudioSourceConfigs.success = true;
    Object.assign(onvifAudioSourceConfigs, data);

    this.$modal.msgSuccess('获取音频源配置成功');
  } catch (error) {
    console.error('获取音频源配置失败:', error);
    this.$modal.msgError('获取音频源配置失败');
  } finally {
    onvifStorageLoading.value = false;
  }
}

// ONVIF媒体配置 - 获取音频编码器配置
const handleGetOnvifAudioEncoderConfigs = async () => {
  if (!currentDeviceId.value) {
    this.$modal.msgError('设备ID不能为空');
    return;
  }
  try {
    onvifStorageLoading.value = true;
    const res = await getOnvifAudioEncoderConfigs(currentDeviceId.value);

    // 从 res.data 中获取实际数据，兼容两种返回格式
    const data = res.data || res;

    // 清空并设置新数据
    Object.keys(onvifAudioEncoderConfigs).forEach(key => {
      delete onvifAudioEncoderConfigs[key];
    });
    onvifAudioEncoderConfigs.success = true;
    Object.assign(onvifAudioEncoderConfigs, data);

    this.$modal.msgSuccess('获取音频编码器配置成功');
  } catch (error) {
    console.error('获取音频编码器配置失败:', error);
    this.$modal.msgError('获取音频编码器配置失败');
  } finally {
    onvifStorageLoading.value = false;
  }
}

// ONVIF媒体配置 - 获取视频输出配置
const handleGetOnvifVideoOutputConfigs = async () => {
  if (!currentDeviceId.value) {
    this.$modal.msgError('设备ID不能为空');
    return;
  }
  try {
    onvifStorageLoading.value = true;
    const res = await getOnvifVideoOutputConfigs(currentDeviceId.value);

    // 从 res.data 中获取实际数据，兼容两种返回格式
    const data = res.data || res;

    // 清空并设置新数据
    Object.keys(onvifVideoOutputConfigs).forEach(key => {
      delete onvifVideoOutputConfigs[key];
    });
    onvifVideoOutputConfigs.success = true;
    Object.assign(onvifVideoOutputConfigs, data);

    this.$modal.msgSuccess('获取视频输出配置成功');
  } catch (error) {
    console.error('获取视频输出配置失败:', error);
    this.$modal.msgError('获取视频输出配置失败');
  } finally {
    onvifStorageLoading.value = false;
  }
}

// 海康ISUP设备信息 - 获取存储信息
const handleGetHaikangIsupStorageInfo = async () => {
  if (!currentDeviceId.value) {
    this.$modal.msgError('设备ID不能为空');
    return;
  }
  try {
    haikangIsupDeviceInfoLoading.value = true;
    const res = await getHaiKangIsupStorageInfo(currentDeviceId.value);
    if (res.data) {
      Object.assign(haikangIsupStorageInfo, res.data);
      this.$modal.msgSuccess('获取存储信息成功');
    }
  } catch (error) {
    console.error('获取存储信息失败:', error);
    this.$modal.msgError('获取存储信息失败');
  } finally {
    haikangIsupDeviceInfoLoading.value = false;
  }
}

// 海康ISUP设备信息 - 获取SD卡信息
const handleGetHaikangIsupSdCardInfo = async () => {
  if (!currentDeviceId.value) {
    this.$modal.msgError('设备ID不能为空');
    return;
  }
  try {
    haikangIsupDeviceInfoLoading.value = true;
    const res = await getHaiKangIsupSDCardInfo(currentDeviceId.value);
    if (res.data) {
      Object.assign(haikangIsupSdCardInfo, res.data);
      this.$modal.msgSuccess('获取SD卡信息成功');
    }
  } catch (error) {
    console.error('获取SD卡信息失败:', error);
    this.$modal.msgError('获取SD卡信息失败');
  } finally {
    haikangIsupDeviceInfoLoading.value = false;
  }
}

// 海康ISUP设备信息 - 获取码率信息
const handleGetHaikangIsupBitrateInfo = async () => {
  if (!currentDeviceId.value) {
    this.$modal.msgError('设备ID不能为空');
    return;
  }
  try {
    haikangIsupDeviceInfoLoading.value = true;
    const res = await getHaiKangIsupBitrateInfo(currentDeviceId.value);
    if (res.data) {
      Object.assign(haikangIsupBitrateInfo, res.data);
      this.$modal.msgSuccess('获取码率信息成功');
    }
  } catch (error) {
    console.error('获取码率信息失败:', error);
    this.$modal.msgError('获取码率信息失败');
  } finally {
    haikangIsupDeviceInfoLoading.value = false;
  }
}

// 海康ISUP设备信息 - 获取网络状态信息
const handleGetHaikangIsupNetworkStatusInfo = async () => {
  if (!currentDeviceId.value) {
    this.$modal.msgError('设备ID不能为空');
    return;
  }
  try {
    haikangIsupDeviceInfoLoading.value = true;
    const res = await getHaiKangIsupNetworkStatusInfo(currentDeviceId.value);
    if (res.data) {
      Object.assign(haikangIsupNetworkStatusInfo, res.data);
      this.$modal.msgSuccess('获取网络状态信息成功');
    }
  } catch (error) {
    console.error('获取网络状态信息失败:', error);
    this.$modal.msgError('获取网络状态信息失败');
  } finally {
    haikangIsupDeviceInfoLoading.value = false;
  }
}

// 海康ISUP设备信息 - 获取软件版本信息
const handleGetHaikangIsupSoftwareVersionInfo = async () => {
  if (!currentDeviceId.value) {
    this.$modal.msgError('设备ID不能为空');
    return;
  }
  try {
    haikangIsupDeviceInfoLoading.value = true;
    const res = await getHaiKangIsupSoftwareVersionInfo(currentDeviceId.value);
    if (res.data) {
      Object.assign(haikangIsupSoftwareVersionInfo, res.data);
      this.$modal.msgSuccess('获取软件版本信息成功');
    }
  } catch (error) {
    console.error('获取软件版本信息失败:', error);
    this.$modal.msgError('获取软件版本信息失败');
  } finally {
    haikangIsupDeviceInfoLoading.value = false;
  }
}

// 海康ISUP设备信息 - 获取电源状态信息
const handleGetHaikangIsupPowerStateInfo = async () => {
  if (!currentDeviceId.value) {
    this.$modal.msgError('设备ID不能为空');
    return;
  }
  try {
    haikangIsupDeviceInfoLoading.value = true;
    const res = await getHaiKangIsupPowerStateInfo(currentDeviceId.value);
    if (res.data) {
      Object.assign(haikangIsupPowerStateInfo, res.data);
      this.$modal.msgSuccess('获取电源状态信息成功');
    }
  } catch (error) {
    console.error('获取电源状态信息失败:', error);
    this.$modal.msgError('获取电源状态信息失败');
  } finally {
    haikangIsupDeviceInfoLoading.value = false;
  }
}

// 海康ISUP设备信息 - 获取摄像头属性信息
const handleGetHaikangIsupCameraInfo = async () => {
  if (!currentDeviceId.value) {
    this.$modal.msgError('设备ID不能为空');
    return;
  }
  try {
    haikangIsupDeviceInfoLoading.value = true;
    const res = await getHaiKangIsupCameraInfo(currentDeviceId.value);
    if (res.data) {
      Object.assign(haikangIsupCameraInfo, res.data);
      this.$modal.msgSuccess('获取摄像头属性信息成功');
    }
  } catch (error) {
    console.error('获取摄像头属性信息失败:', error);
    this.$modal.msgError('获取摄像头属性信息失败');
  } finally {
    haikangIsupDeviceInfoLoading.value = false;
  }
}

// 获取海康ISUP系统状态信息
const handleGetHaikangIsupSystemStatus = async () => {
  if (!currentDeviceId.value) {
    this.$modal.msgError('设备ID不能为空');
    return;
  }
  try {
    haikangIsupDeviceInfoLoading.value = true;
    const res = await getHaiKangIsupSystemStatus(currentDeviceId.value);
    console.log('系统状态返回结果:', res);
    if (res.data) {
      // 如果有data对象，优先使用data
      if (res.data.data) {
        Object.assign(haikangIsupSystemStatusInfo, res.data.data);
      } else {
        // 直接使用顶层字段
        Object.assign(haikangIsupSystemStatusInfo, res.data);
      }
      haikangIsupSystemStatusInfo.success = true;
      this.$modal.msgSuccess('获取系统状态信息成功');
    }
  } catch (error) {
    console.error('获取系统状态信息失败:', error);
    this.$modal.msgError('获取系统状态信息失败');
  } finally {
    haikangIsupDeviceInfoLoading.value = false;
  }
}

// 获取海康ISUP设备配置
const handleGetHaikangIsupDeviceConfig = async () => {
  if (!currentDeviceId.value) {
    this.$modal.msgError('设备ID不能为空');
    return;
  }
  try {
    haikangIsupDeviceInfoLoading.value = true;
    const res = await getHaiKangIsupDeviceConfig(currentDeviceId.value);
    console.log('设备配置返回结果:', res);
    if (res.data) {
      if (res.data.data) {
        Object.assign(haikangIsupDeviceConfig, res.data.data);
      } else {
        Object.assign(haikangIsupDeviceConfig, res.data);
      }
      haikangIsupDeviceConfig.success = true;
      this.$modal.msgSuccess('获取设备配置成功');
    }
  } catch (error) {
    console.error('获取设备配置失败:', error);
    this.$modal.msgError('获取设备配置失败');
  } finally {
    haikangIsupDeviceInfoLoading.value = false;
  }
}

// 设置海康ISUP设备配置
const handleSetHaikangIsupDeviceConfig = async () => {
  if (!currentDeviceId.value) {
    this.$modal.msgError('设备ID不能为空');
    return;
  }
  try {
    haikangIsupDeviceInfoLoading.value = true;
    const res = await setHaiKangIsupDeviceConfig(currentDeviceId.value, haikangIsupDeviceConfig);
    if (res.code === 200) {
      this.$modal.msgSuccess('保存设备配置成功');
    } else {
      this.$modal.msgError('保存设备配置失败');
    }
  } catch (error) {
    console.error('保存设备配置失败:', error);
    this.$modal.msgError('保存设备配置失败');
  } finally {
    haikangIsupDeviceInfoLoading.value = false;
  }
}

// 获取海康ISUP版本信息
const handleGetHaikangIsupVersionInfo = async () => {
  if (!currentDeviceId.value) {
    this.$modal.msgError('设备ID不能为空');
    return;
  }
  try {
    haikangIsupDeviceInfoLoading.value = true;
    const res = await getHaiKangIsupVersionInfo(currentDeviceId.value);
    console.log('版本信息返回结果:', res);
    if (res.data) {
      if (res.data.data) {
        Object.assign(haikangIsupVersionInfo, res.data.data);
      } else {
        Object.assign(haikangIsupVersionInfo, res.data);
      }
      haikangIsupVersionInfo.success = true;
      this.$modal.msgSuccess('获取版本信息成功');
    }
  } catch (error) {
    console.error('获取版本信息失败:', error);
    this.$modal.msgError('获取版本信息失败');
  } finally {
    haikangIsupDeviceInfoLoading.value = false;
  }
}

// 打开海康ISUP远程升级对话框
const openHaikangIsupUpgradeDialog = () => {
  if (!currentDeviceId.value) {
    this.$modal.msgError('设备ID不能为空');
    return;
  }
  haikangIsupUpgradeForm.deviceId = currentDeviceId.value;
  haikangIsupUpgradeForm.ftpServerIp = '';
  haikangIsupUpgradeForm.ftpServerPort = 21;
  haikangIsupUpgradeForm.ftpAccount = '';
  haikangIsupUpgradeForm.ftpPassword = '';
  haikangIsupUpgradeForm.fileName = '';
  haikangIsupUpgradeForm.channel = 0;
  haikangIsupUpgradeResult.success = false;
  haikangIsupUpgradeResult.message = '';
  haikangIsupUpgradeResult.upgradeResult = '';
  haikangIsupUpgradeResult.beforeInfo = {};
  haikangIsupUpgradeDialogVisible.value = true;
}

// 执行海康ISUP远程升级
const handleHaikangIsupUpgrade = async () => {
  if (!haikangIsupUpgradeForm.deviceId) {
    this.$modal.msgError('设备ID不能为空');
    return;
  }
  if (!haikangIsupUpgradeForm.ftpServerIp) {
    this.$modal.msgError('FTP服务器IP不能为空');
    return;
  }
  if (!haikangIsupUpgradeForm.fileName) {
    this.$modal.msgError('升级文件名不能为空');
    return;
  }
  try {
    haikangIsupUpgradeLoading.value = true;
    const res = await upgradeHaiKangIsupDevice(haikangIsupUpgradeForm);
    if (res.data) {
      Object.assign(haikangIsupUpgradeResult, res.data);
      if (res.data.success) {
        this.$modal.msgSuccess('升级命令已发送，请等待设备完成升级');
      } else {
        this.$modal.msgError('升级失败：' + res.data.message);
      }
    }
  } catch (error) {
    console.error('远程升级失败:', error);
    this.$modal.msgError('远程升级失败');
  } finally {
    haikangIsupUpgradeLoading.value = false;
  }
}



// 打开校时对话框
const openTimeSyncDialog = (row: QsDevice) => {
  timeSyncForm.deviceId = row.id;
  timeSyncForm.deviceIp = row.ipAddress || '';
  timeSyncForm.deviceType = row.type || '';
  timeSyncForm.deviceTime = '';
  timeSyncForm.syncTime = '';
  timeSyncForm.syncType = false;
  timeSyncDialogVisible.value = true;
}

// 获取设备时间（支持海康/大华/海康ISUP/ONVIF）
const handleGetTime = async () => {
  if (!timeSyncForm.deviceId) {
    this.$modal.msgError('设备ID不能为空');
    return;
  }
  try {
    timeSyncLoading.value = true;
    let res;
    // 根据设备类型调用不同的API
    if (timeSyncForm.deviceType === '7') {
      // 海康设备
      res = await getHaiKangDevTime(timeSyncForm.deviceId);
    } else if (timeSyncForm.deviceType === '8') {
      // 海康ISUP设备
      res = await getHaiKangIsupDevTime(timeSyncForm.deviceId);
    } else if (timeSyncForm.deviceType === '9') {
      // 大华设备
      res = await getDaHuaTime(timeSyncForm.deviceIp);
    } else if (timeSyncForm.deviceType === '5') {
      // ONVIF设备
      res = await getOnvifDeviceTime(timeSyncForm.deviceId);
    } else {
      this.$modal.msgError('不支持的设备类型');
      return;
    }
    timeSyncForm.deviceTime = res.data || '';
    this.$modal.msgSuccess('获取时间成功');
  } catch (error) {
    console.error('获取设备时间失败:', error);
    this.$modal.msgError('获取设备时间失败');
  } finally {
    timeSyncLoading.value = false;
  }
}

// 设置为当前时间
const handleSetCurrentTime = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  timeSyncForm.syncTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

// 执行时间同步（支持海康/大华/海康ISUP/ONVIF）
const handleTimeSync = async () => {
  if (!timeSyncForm.deviceId) {
    this.$modal.msgError('设备ID不能为空');
    return;
  }
  try {
    timeSyncLoading.value = true;
    let response;
    // 根据设备类型调用不同的API
    if (timeSyncForm.deviceType === '7') {
      // 海康设备（只支持本地时间同步到设备）
      if (!timeSyncForm.syncTime) {
        this.$modal.msgError('请选择同步时间');
        return;
      }
      response = await setHaiKangDevTime(timeSyncForm.deviceId, timeSyncForm.syncTime);
    } else if (timeSyncForm.deviceType === '8') {
      // 海康ISUP设备
      if (!timeSyncForm.syncTime) {
        this.$modal.msgError('请选择同步时间');
        return;
      }
      response = await setHaiKangIsupDevTime(timeSyncForm.deviceId, timeSyncForm.syncTime);
    } else if (timeSyncForm.deviceType === '9') {
      // 大华设备
      if (!timeSyncForm.syncTime) {
        this.$modal.msgError('请选择同步时间');
        return;
      }
      response = await setDaHuaTime(timeSyncForm.deviceId, timeSyncForm.syncTime, timeSyncForm.syncType);
    } else if (timeSyncForm.deviceType === '5') {
      // ONVIF设备：直接传递 yyyy-MM-dd HH:mm:ss 格式的时间，由后端处理时区转换
      response = await syncOnvifDeviceTime(timeSyncForm.deviceId, timeSyncForm.syncTime);
    } else {
      this.$modal.msgError('不支持的设备类型');
      return;
    }
    if (response.code === 200) {
      this.$modal.msgSuccess('时间同步成功');
      timeSyncDialogVisible.value = false;
    } else {
      this.$modal.msgError(response.msg || '时间同步失败');
    }
  } catch (error) {
    console.error('时间同步失败:', error);
    this.$modal.msgError('时间同步失败');
  } finally {
    timeSyncLoading.value = false;
  }
}

// 监听播放对话框打开，加载预置点列表
watch(easyPlayerOpen, (newVal) => {
  if (newVal && isPtz.value && isPresetSupported.value) {
    setTimeout(() => {
      loadPresetList();
    }, 500);
  }
});

// 监听tab切换，当切换到抓图记录时自动加载数据
watch(tabActiveName, (newVal) => {
  if (newVal === 'snapshots') {
    deviceSnapshotQuery.pageNum = 1;
    getDeviceSnapshotList();
  }
});


export default {
  name: 'Device',
  data() {
    return {
      deviceList: [],
      viewMode: 'card',
      open: false,
      loading: true,
      showSearch: true,
      ids: [],
      single: true,
      multiple: true,
      total: 0,
      title: "",
      haiKangIsupDeviceList: [],
      dahuaDeviceList: [],
      onvifDeviceList: [],
      streamUris: [],
      gb28181DeviceList: [],
      gb28181ChannelList: [],
      jt1078DeviceList: [],
      refreshProgressDialogVisible: false,
      refreshProgress: 0,
      easyPlayerOpen: false,
      deviceRow: {},
      rtcUrl: "",
      flvUrl: "",
      wsUrl: '',
      tabActiveName: 'media',
      streamInfo: {},
      quality: ['普清', '高清', '超清'],
      defaultQuality: '高清',
      isPtz: true,
      isPresetSupported: true,
      isGb28181Device: false,
      isQuality: true,
      isLive: true,
      sharedIframe: null,
      captureLoading: false,
      deviceSnapshotList: [],
      deviceSnapshotTotal: 0,
      deviceSnapshotLoading: false,
      controSpeed: 5,
      controSpeedMax: 10,
      controSpeedMin: 1,
      lastPtzCommand: 'up',
      presetList: [],
      selectedPresetIndex: null,
      newPresetIndex: 1,
      newPresetName: '',
      presetDialogVisible: false,
      presetFormRef: null,
      lightOn: false,
      wiperOn: false,
      cruiseTrackList: [],
      timeSyncDialogVisible: false,
      timeSyncLoading: false,
      deviceInfoDialogVisible: false,
      deviceInfoLoading: false,
      deviceInfoTabActive: 'deviceInfo',
      onvifDeviceInfoDialogVisible: false,
      onvifDeviceInfoLoading: false,
      onvifDeviceInfoTabActive: 'deviceInfo',
      onvifStorageDialogVisible: false,
      onvifStorageLoading: false,
      onvifStorageTabActive: 'storageConfigurations',
      onvifStorageDevice: null,
      jt1078ParamsDialogVisible: false,
      jt1078ParamsTabActive: 'params',
      jt1078ParamsLoading: false,
      jt1078LinkCheckResult: null,
      jt1078VehicleControlResult: null,
      jt1078QueryAreaResult: null,
      jt1078DriverInfoResult: null,
      jt1078TerminalAVPropertiesResult: null,
      jt1078SearchMultimediaResult: null,
      jt1078TempParamId: 0,
      jt1078TempParamValue: 0,
      jt1078TempStrParamId: 0,
      jt1078TempStrParamValue: '',
      jt1078QuerySpecificEditableParams: [],
      jt1078ControlResult: null,
      deviceConfigDialogVisible: false,
      deviceConfigLoading: false,
      deviceConfigData: {},
      selectedConfigTypes: [],
      currentConfigDevice: null,
      activeConfigPanels: [],
      updateAllConfigLoading: false,
      downloadRecordDialogVisible: false,
      downloadRecordLoading: false,
      downloadResult: null,
      currentDeviceId: null,
      currentDeviceRow: null,
      snapshotDialogRef: null,
      streamPushAddressForm: {},
      accessAddressOpen: false,
      recordDialogVisible: false,
      recordDialogForm: {
  device: null | null,
  channelId: '',
  recordCmd: '1',
  streamNumber: 0
},
      gbChannelsList: [],
      gb28181DeviceInfoDialogVisible: false,
      gb28181DeviceInfoTabActive: 'deviceInfo',
      gb28181DeviceInfoLoading: false,
      gb28181DeviceInfo: {
  deviceId: '',
  cmdType: '',
  sn: '',
  deviceName: '',
  result: '',
  manufacturer: '',
  model: '',
  firmware: '',
  channel: null | null,
  extraInfo: [][]
},
      gb28181DeviceStatus: {
  deviceId: '',
  cmdType: '',
  sn: '',
  result: '',
  online: '',
  status: '',
  reason: '',
  encode: '',
  record: '',
  deviceTime: '',
  alarmStatus: [],
  extraInfo: [][]
},
      haikangDeviceInfoDialogVisible: false,
      haikangDeviceInfoTabActive: 'deviceInfo',
      haikangDeviceInfoLoading: false,
      haikangIsupDeviceInfoDialogVisible: false,
      haikangIsupDeviceInfoTabActive: 'deviceInfo',
      haikangIsupDeviceInfoLoading: false,
      haikangIsupUpgradeDialogVisible: false,
      haikangIsupUpgradeLoading: false,
      deviceSnapshotQuery: {
  deviceId: undefined | undefined,
  pageNum: 1,
  pageSize: 10,
  snapshotType: undefined,
  sdkType: undefined
},
      presetForm: {
  index: 1,
  name: ''
},
      homePositionForm: {
  presetId: 1,
  dwellTime: 10
},
      cruiseTrackForm: {
  trackId: 0
},
      ptzPreciseForm: {
  pan: 0,
  tilt: 0,
  zoom: 0
},
      ptzPosition: {
  pan: undefined | undefined,
  tilt: undefined | undefined,
  zoom: undefined | undefined
},
      timeSyncForm: {
  deviceId: null | null,
  deviceIp: '',
  deviceType: '',
  deviceTime: '',
  syncTime: '',
  syncType: false
},
      deviceInfo: {
  serialNumber: '',
  alarmInPortNum: undefined,
  alarmOutPortNum: undefined,
  diskNum: undefined,
  dvrType: undefined,
  channelNum: undefined,
  limitLoginTime: undefined,
  leftLogTimes: undefined,
  lockLeftTime: undefined
},
      onvifDeviceInfo: {
  success: false,
  manufacturer: '',
  model: '',
  firmwareVersion: '',
  streamUris: [],
  profileCount: 0,
  profiles: []
},
      onvifStorageConfigurations: {
  success: false
},
      onvifStorageCapabilities: {
  success: false
},
      onvifStorageState: {
  success: false
},
      onvifNetworkInterfaces: {
  success: false
},
      onvifNetworkProtocols: {
  success: false
},
      onvifVideoSourceConfigs: {
  success: false
},
      onvifVideoEncoderConfigs: {
  success: false
},
      onvifAudioSourceConfigs: {
  success: false
},
      onvifAudioEncoderConfigs: {
  success: false
},
      onvifVideoOutputConfigs: {
  success: false
},
      systemParam: {
  videoStandard: undefined | undefined,
  country: ''
},
      videoParam: {
  channelId: 0,
  streamType: 0,
  formatType: undefined,
  videoEnable: undefined,
  compression: undefined,
  width: undefined,
  height: undefined,
  bitRateControl: undefined,
  bitRate: undefined,
  frameRate: undefined,
  iframeInterval: undefined,
  imageQuality: undefined
},
      deviceVideoParam: {
  channelId: 0,
  brightness: undefined,
  contrast: undefined,
  saturation: undefined,
  chroma: undefined,
  sharpness: undefined,
  hue: undefined,
  gain: undefined,
  blackWhiteMode: undefined
},
      storageInfo: {
  storageDevices: []
},
      systemResourceInfo: {
  success: false,
  cpuUsage: 0,
  memoryUsage: 0
},
      sdCardInfo: {
  success: false,
  exists: false
},
      gb28181SdCardForm: {
  sdCardId: 0
},
      gb28181SdCardInfo: {},
      bitrateInfo: {
  success: false,
  channelBitrates: []
},
      networkStatusInfo: {
  success: false
},
      softwareVersionInfo: {
  success: false
},
      recordStateInfo: {
  success: false,
  wholeRecording: false,
  wholeEncoding: false,
  channelStates: []
},
      powerStateInfo: {
  success: false,
  powerStates: []
},
      alarmArmInfo: {
  success: false,
  alarmStates: []
},
      cameraInfo: {
  success: false,
  cameraProperties: []
},
      rtspUrlInfo: {
  success: false,
  rtspUrls: []
},
      jt1078CurrentDevice: {
  deviceId: '',
  mobileNo: ''
},
      jt1078TerminalParams: {},
      jt1078TerminalAttribute: {},
      jt1078Location: {},
      jt1078TempLocationForm: {
  interval: 10,
  validityPeriod: 600
},
      jt1078AlarmConfirmForm: {
  responseSerialNo: 0,
  type: 0
},
      jt1078TextForm: {
  signBits: [][],
  type: 1,
  content: ''
},
      jt1078InfoServiceForm: {
  type: 0,
  content: ''
},
      jt1078PhoneCallbackForm: {
  type: 0,
  phoneNumber: ''
},
      jt1078VehicleControlForm: {
  type: 1,
  param: 0
},
      jt1078DeleteCircleForm: {
  ids: [][]
},
      jt1078DeleteRectForm: {
  ids: [][]
},
      jt1078DeletePolygonForm: {
  ids: [][]
},
      jt1078DeleteRouteForm: {
  ids: [][]
},
      jt1078QueryAreaForm: {
  type: 1,
  ids: [][]
},
      jt1078TachographDataCollectForm: {},
      jt1078TachographParamSendForm: {
  type: 130,
  content: ''
},
      jt1078CameraShootForm: {
  channelId: 1,
  command: 1,
  time: 0,
  save: 1,
  resolution: 2,
  quality: 5,
  brightness: 128,
  contrast: 64,
  saturation: 64,
  chroma: 128
},
      jt1078SearchMultimediaForm: {
  type: 0,
  channelId: 0,
  event: 0,
  startTime: '',
  endTime: ''
},
      jt1078UploadMultimediaForm: {
  type: 0,
  channelId: 0,
  event: 0,
  startTime: '',
  endTime: '',
  delete: 0
},
      jt1078StartRecordingForm: {
  command: 1,
  time: 0,
  save: 1,
  audioSamplingRate: 0
},
      jt1078SearchUploadMultimediaForm: {
  id: 0,
  delete: 0
},
      jt1078TerminalUpgradeForm: {
  type: 0,
  makerId: '',
  version: '',
  packet: ''
},
      jt1078QuerySpecificForm: {
  ids: ''
},
      jt1078QuerySpecificResult: {},
      jt1078ControlForm: {
  command: 1,
  parameter: ''
},
      downloadRecordForm: {
  deviceId: null | null,
  deviceName: '',
  channelId: 0,
  startTime: '',
  endTime: '',
  recordFileType: 0
},
      haikangDeviceInfo: {
  success: false,
  deviceName: '',
  deviceType: '',
  serialNumber: '',
  ipAddress: '',
  channelNum: undefined | undefined,
  analogChanNum: undefined | undefined,
  ipChanNum: undefined | undefined,
  dvrType: undefined | undefined,
  devType: undefined | undefined,
  devClass: undefined | undefined,
  alarmInPortNum: undefined | undefined,
  alarmOutPortNum: undefined | undefined,
  diskNum: undefined | undefined
},
      haikangStorageInfo: {
  diskList: [],
  diskCount: 0,
  success: false
},
      haikangSdCardInfo: {
  success: false,
  sdCardCount: undefined | undefined,
  sdCardList: []
},
      haikangBitrateInfo: {
  success: false,
  streamList: []
},
      haikangNetworkStatusInfo: {
  success: false,
  clientList: [],
  clientCount: undefined | undefined,
  bitRate: undefined | undefined,
  allBitRate: undefined | undefined,
  ipLinkNum: undefined | undefined,
  exceedMaxLink: undefined | undefined
},
      haikangSoftwareVersionInfo: {
  success: false,
  deviceStatic: undefined | undefined,
  deviceStaticDesc: '',
  localDisplay: undefined | undefined,
  localDisplayDesc: ''
},
      haikangRecordStateInfo: {
  success: false,
  channelRecordList: []
},
      haikangPowerStateInfo: {
  success: false,
  deviceStatic: undefined | undefined,
  deviceStaticDesc: '',
  devicePowerStatus: undefined | undefined,
  localDisplay: undefined | undefined
},
      haikangAlarmArmInfo: {
  success: false,
  alarmInList: [],
  alarmOutList: []
},
      haikangCameraInfo: {
  success: false,
  cameraList: []
},
      haikangRtspUrlInfo: {
  success: false,
  rtspUrl: ''
},
      haikangIsupDeviceInfo: {
  success: false,
  deviceName: '',
  deviceType: '',
  serialNumber: '',
  ipAddress: '',
  channelNum: undefined | undefined,
  analogChanNum: undefined | undefined,
  ipChanNum: undefined | undefined,
  dvrType: undefined | undefined,
  devType: undefined | undefined,
  devClass: undefined | undefined,
  alarmInPortNum: undefined | undefined,
  alarmOutPortNum: undefined | undefined,
  diskNum: undefined | undefined
},
      haikangIsupStorageInfo: {
  diskList: [],
  diskCount: 0,
  success: false
},
      haikangIsupSdCardInfo: {
  success: false,
  sdCardCount: undefined | undefined,
  sdCardList: []
},
      haikangIsupBitrateInfo: {
  success: false,
  streamList: []
},
      haikangIsupNetworkStatusInfo: {
  success: false,
  clientList: [],
  clientCount: undefined | undefined,
  bitRate: undefined | undefined,
  allBitRate: undefined | undefined,
  ipLinkNum: undefined | undefined,
  exceedMaxLink: undefined | undefined
},
      haikangIsupSoftwareVersionInfo: {
  success: false,
  deviceStatic: undefined | undefined,
  deviceStaticDesc: '',
  localDisplay: undefined | undefined,
  localDisplayDesc: ''
},
      haikangIsupPowerStateInfo: {
  success: false,
  deviceStatic: undefined | undefined,
  deviceStaticDesc: '',
  devicePowerStatus: undefined | undefined,
  localDisplay: undefined | undefined
},
      haikangIsupCameraInfo: {
  success: false,
  cameraList: []
},
      haikangIsupSystemStatusInfo: {
  success: false,
  currentDeviceTime: '',
  deviceUpTime: 0,
  cpuList: [],
  memoryList: [],
  netPortStatusList: []
},
      haikangIsupUpgradeForm: {
  deviceId: null | null,
  ftpServerIp: '',
  ftpServerPort: 21,
  ftpAccount: '',
  ftpPassword: '',
  fileName: '',
  channel: 0
},
      haikangIsupDeviceConfig: {
  success: false,
  deviceName: '',
  deviceDescription: '',
  deviceLocation: '',
  systemContact: '',
  model: '',
  serialNumber: '',
  macAddress: '',
  firmwareVersion: '',
  hardwareVersion: '',
  manufacturer: '',
  deviceType: ''
},
      haikangIsupVersionInfo: {
  success: false,
  softwareVersion: '',
  encodeVersion: '',
  panelVersion: '',
  hardwareVersion: ''
},
      qs_status: [],
      qs_live_stream_type: [],
      qs_stream_type: [],
      qs_protocol: [],
      qs_device_status: [],
      qs_online_type: [],
      qs_onvif_auth: [],
      : []
    }
  },
  computed: {
    jt1078EditableParams() {
      return {
  const params = [];
  // 从查询结果添加
  if (jt1078TerminalParams
    },
    hasEditableParams() {
      return {
  return jt1078EditableParams.value.length > 0;
}
    },
    hasModifiedParams() {
      return {
  return jt1078EditableParams.value.some(param => {
    // 新添加的参数总是认为被修改了
    if (param.isNew
    },
    hasQuerySpecificModifiedParams() {
      return {
  return jt1078QuerySpecificEditableParams.value.some(param => {
    return String(param.originalValue
    },
    shouldShowCaptureBtn() {
      return {
  const supportedTypes = ['1', '2', '3', '4', '5', '6', '13', '14']; // 1=RTSP, 2=RTMP, 3=FLV, 4=HLS, 5=ONVIF, 6=视频文件, 13=PUSH, 14=部标1078
  const deviceType = deviceRow.value?.type;
  return supportedTypes.includes(deviceType
    },

  },
  methods: {
  }
}
</script>
<style lang="scss" scoped>
/* ========== 基础容器 ========== */
.app-container {
  padding: 16px;
  animation: fadeIn 0.4s ease-out;
  max-height: calc(100vh - 32px);
  overflow-y: auto;
}

/* 滚动条美化 */
.app-container::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

.app-container::-webkit-scrollbar-track {
  background: var(--el-fill-color-lighter);
  border-radius: 4px;
}

.app-container::-webkit-scrollbar-thumb {
  background: var(--el-border-color);
  border-radius: 4px;
  transition: background 0.3s;

  &:hover {
    background: var(--el-text-color-secondary);
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.search-box {
  margin-bottom: 16px;
}

/* ========== 查询表单 ========== */
.query-form {
  padding: 10px 15px;
  background: var(--el-bg-color-overlay);
  border-radius: 10px;
  border: 1px solid var(--el-border-color-lighter);
  box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.04);
  margin-bottom: 0 !important;
  animation: fadeInUp 0.4s ease-out 0.15s both;
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  gap: 10px;

  :deep(.el-form-item) {
    margin-bottom: 0;
    margin-right: 0;
  }

  :deep(.el-input__wrapper),
  :deep(.el-select .el-input__wrapper) {
    box-shadow: 0 0 0 1px var(--el-border-color-light) inset;
    transition: all 0.3s;

    &:hover,
    &:focus-within {
      box-shadow: 0 0 0 1px var(--el-color-primary-light-5) inset;
    }

    &:focus-within {
      box-shadow: 0 0 0 1px var(--el-color-primary) inset, 0 0 0 3px var(--el-color-primary-light-8);
    }
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(12px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.search-btn {
  transition: all 0.3s;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px var(--el-color-primary-light-7);
  }

  &:active {
    transform: translateY(0);
  }
}

.reset-btn {
  transition: all 0.3s;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
  }

  &:active {
    transform: translateY(0);
  }
}

/* ========== 工具栏 ========== */
.toolbar-row {
  padding: 4px 0;
  animation: fadeInUp 0.4s ease-out 0.2s both;
}

.action-buttons {
  display: flex;
  gap: 12px;
  margin-top: 12px;
  align-items: center;
}

.action-btn {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  &:not(:disabled):hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.1);
  }

  &:not(:disabled):active {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
}

.delete-btn:not(:disabled):hover {
  box-shadow: 0 6px 16px var(--el-color-danger-light-7);
}

/* 按钮区域 */
.form-actions {
  margin-left: auto !important;
  margin-right: 0 !important;
  padding-left: 16px;
  border-left: 1px solid var(--el-border-color-lighter);
  margin-left: 12px !important;

  .button-group {
    display: flex;
    gap: 12px;
  }
}

.view-switch {
  display: flex;
  align-items: center;
  justify-content: center;
}

.view-switch :deep(.el-radio-group) {
  background: var(--el-fill-color-lighter);
  border-radius: 6px;
  padding: 2px;
  box-shadow: none;
  border: none;
  display: flex;
}

.view-switch :deep(.el-radio-button) {
  margin: 0;
}

.view-switch :deep(.el-radio-button__inner) {
  border: none;
  border-radius: 4px;
  padding: 6px 10px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  background: transparent;
  color: var(--el-text-color-secondary);
  font-weight: 500;
  position: relative;
}

.view-switch :deep(.el-radio-button__inner:hover) {
  color: var(--el-color-primary);
  background: var(--el-fill-color-light);
  transform: translateY(-1px);
}

.view-switch :deep(.el-radio-button__orig-radio:checked + .el-radio-button__inner) {
  background: var(--el-bg-color);
  color: var(--el-color-primary);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.12);
  transform: translateY(-1px);
}

.view-switch :deep(.el-icon) {
  font-size: 16px;
  vertical-align: middle;
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.view-switch :deep(.el-radio-button__inner:hover .el-icon) {
  transform: scale(1.1);
}

.view-switch :deep(.el-radio-button__orig-radio:checked + .el-radio-button__inner .el-icon) {
  transform: scale(1.15);
}

/* 卡片视图样式 */
.card-view {
  padding: 8px 0;
}

/* 5列网格布局 */
.card-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 16px;
}

@media (max-width: 1600px) {
  .card-grid { grid-template-columns: repeat(4, 1fr); }
}
@media (max-width: 1200px) {
  .card-grid { grid-template-columns: repeat(3, 1fr); }
}
@media (max-width: 768px) {
  .card-grid { grid-template-columns: repeat(2, 1fr); }
}
@media (max-width: 480px) {
  .card-grid { grid-template-columns: 1fr; }
}

.device-card {
  position: relative;
  background: var(--el-bg-color);
  border: 1px solid var(--el-border-color-lighter);
  border-radius: 16px;
  overflow: hidden;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  animation: cardFadeIn 0.5s ease-out forwards;
  opacity: 0;
  transform: translateY(16px);
  box-shadow:
    0 1px 2px rgba(0,0,0,0.04),
    0 4px 8px rgba(0,0,0,0.04),
    0 8px 16px rgba(0,0,0,0.02);
}

.device-card:nth-child(1) { animation-delay: 0.02s; }
.device-card:nth-child(2) { animation-delay: 0.04s; }
.device-card:nth-child(3) { animation-delay: 0.06s; }
.device-card:nth-child(4) { animation-delay: 0.08s; }
.device-card:nth-child(5) { animation-delay: 0.10s; }
.device-card:nth-child(6) { animation-delay: 0.12s; }
.device-card:nth-child(7) { animation-delay: 0.14s; }
.device-card:nth-child(8) { animation-delay: 0.16s; }
.device-card:nth-child(9) { animation-delay: 0.18s; }
.device-card:nth-child(10) { animation-delay: 0.20s; }

@keyframes cardFadeIn {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.device-card:hover {
  transform: translateY(-6px);
  box-shadow: var(--el-box-shadow-light);
  border-color: var(--el-color-primary-light-5);
}

.device-card.is-selected {
  border-color: var(--el-color-primary);
  box-shadow:
    0 0 0 3px var(--el-color-primary-light-9),
    0 8px 24px -4px rgba(var(--el-color-primary-rgb), 0.2),
    0 4px 12px rgba(var(--el-color-primary-rgb), 0.1);
}

/* 头部区域（替代图片区） */
.card-header-area {
  position: relative;
  padding: 16px;
  background: linear-gradient(135deg, var(--el-color-primary-light-9) 0%, var(--el-fill-color-lighter) 100%);
  border-bottom: 1px solid var(--el-border-color-lighter);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  min-height: 64px;
}

.card-header-area .card-checkbox {
  position: relative;
  top: auto;
  left: auto;
  z-index: 2;
}

.card-header-area .card-checkbox :deep(.el-checkbox__inner) {
  border-radius: 6px;
  width: 18px;
  height: 18px;
  transition: all 0.2s ease;
}

.header-content {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
}

.header-icon {
  font-size: 20px;
  color: var(--el-color-primary);
  flex-shrink: 0;
  animation: iconPulse 2s ease-in-out infinite;
  filter: drop-shadow(0 0 4px rgba(var(--el-color-primary-rgb), 0.3));
}

@keyframes iconPulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.15); }
}

.header-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--el-text-color-primary);
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.4;
}

.header-tag {
  flex-shrink: 0;
}

/* 信息区 */
.card-info {
  padding: 14px 16px 10px;
}

.info-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 10px;
}

.info-tag {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 3px 10px;
  border-radius: 6px;
  background: var(--el-fill-color-lighter);
  border: 1px solid var(--el-border-color-lighter);
  font-size: 11.5px;
  line-height: 1.5;
  backdrop-filter: blur(4px);
  transition: all 0.2s ease;
}

.info-tag:hover {
  border-color: var(--el-color-primary-light-5);
  background: var(--el-color-primary-light-9);
}

.type-tag {
  margin-left: auto;
}

.tag-label {
  color: var(--el-text-color-secondary);
  font-weight: 500;
}

.tag-val {
  color: var(--el-text-color-primary);
  font-weight: 500;
}

/* 通道/节点单独一行 */
.info-channel {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 10px;
  margin-bottom: 10px;
  border-radius: 6px;
  background: var(--el-fill-color-lighter);
  border: 1px solid var(--el-border-color-lighter);
  font-size: 12px;
  transition: all 0.2s ease;
}

.info-channel:hover {
  border-color: var(--el-color-primary-light-5);
  background: var(--el-color-primary-light-9);
}

.channel-label {
  color: var(--el-text-color-secondary);
  font-weight: 500;
  flex-shrink: 0;
}

.channel-val {
  color: var(--el-text-color-primary);
  font-weight: 500;
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  text-align: right;
}

.info-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

/* 操作栏 */
.card-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 10px 16px 14px;
  border-top: 1px solid var(--el-border-color-lighter);
}

.card-toolbar .el-button.btn-play {
  flex-shrink: 0;
  min-width: 72px;
  box-shadow: 0 2px 8px rgba(var(--el-color-primary-rgb), 0.25) !important;
  transition: all 0.3s ease;
}

.card-toolbar .el-button.btn-play:not(:disabled):hover {
  box-shadow: 0 4px 14px rgba(var(--el-color-primary-rgb), 0.4) !important;
  transform: translateY(-1px);
}

.toolbar-actions {
  display: flex;
  align-items: center;
  gap: 6px;
}

.toolbar-actions .el-button {
  padding: 7px 10px;
  height: auto;
  font-size: 14px;
  transition: all 0.2s ease;
}

.toolbar-actions .el-button:hover {
  transform: scale(1.08);
}

/* 表格容器优化 */
.table-wrapper {
  background: var(--el-bg-color-overlay);
  border-radius: 10px;
  border: 1px solid var(--el-border-color-lighter);
  box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.04);
  overflow: hidden;
  animation: fadeInUp 0.4s ease-out 0.25s both;
  transition: box-shadow 0.3s;
}

.table-wrapper:hover {
  box-shadow: 0 4px 16px 0 rgba(0, 0, 0, 0.06);
}

.custom-table {
  --el-table-header-bg-color: var(--el-fill-color-light);

  :deep(.el-table__header-wrapper) {
    th {
      background-color: var(--el-fill-color-light) !important;
      color: var(--el-text-color-primary);
      font-weight: 600;
      font-size: 13px;
      letter-spacing: 0.3px;
      transition: background-color 0.3s;
    }
  }

  :deep(.el-table__body-wrapper) {
    .el-table__row {
      transition: all 0.25s ease;
      animation: rowFadeIn 0.4s ease-out both;

      @for $i from 1 through 20 {
        &:nth-child(#{$i}) {
          animation-delay: #{$i * 0.03 + 0.25}s;
        }
      }

      &:hover {
        background-color: var(--el-color-primary-light-9) !important;
        transform: scale(1.002);
      }

      &.current-row {
        background-color: var(--el-color-primary-light-9) !important;
      }
    }
  }

  :deep(.el-table__empty-block) {
    padding: 40px 0;
  }
}

@keyframes rowFadeIn {
  from {
    opacity: 0;
    transform: translateX(-10px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

/* 编号徽章 */
.id-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 28px;
  height: 22px;
  padding: 0 8px;
  background: var(--el-color-primary-light-9);
  color: var(--el-color-primary);
  border-radius: 11px;
  font-size: 12px;
  font-weight: 600;
  transition: all 0.3s;

  .el-table__row:hover & {
    background: var(--el-color-primary-light-8);
    transform: scale(1.05);
  }
}

/* 分页优化 */
:deep(.el-pagination) {
  padding: 12px 0;
  animation: fadeInUp 0.4s ease-out 0.3s both;
}

:deep(.el-pagination__total) {
  color: var(--el-text-color-secondary);
}

:deep(.el-pagination__sizes) .el-input__wrapper {
  box-shadow: 0 0 0 1px var(--el-border-color-light) inset;
}

:deep(.el-pager li) {
  transition: all 0.3s;
}

:deep(.el-pager li:hover:not(.is-active)) {
  color: var(--el-color-primary);
  transform: translateY(-1px);
}

:deep(.el-pager li.is-active) {
  box-shadow: 0 2px 8px var(--el-color-primary-light-5);
}

/* ========== 播放器对话框 ========== */
.play-dialog {
  :deep(.el-dialog) {
    border-radius: 16px;
    background: var(--el-bg-color-page);
    backdrop-filter: blur(20px);
    border: 1px solid var(--el-border-color-lighter);
    box-shadow: var(--el-box-shadow-light);
    overflow: hidden;
  }

  :deep(.el-dialog__header) {
    padding: 16px 20px;
    margin-right: 0;
    border-bottom: 1px solid var(--el-border-color-lighter);
  }

  :deep(.el-dialog__title) {
    font-size: 15px;
    font-weight: 600;
    color: var(--el-text-color-primary);
  }

  :deep(.el-dialog__headerbtn) {
    top: 14px;
    right: 16px;
    width: 30px;
    height: 30px;
    border-radius: 6px;
    transition: all 0.2s;
  }

  :deep(.el-dialog__headerbtn:hover) {
    background: var(--el-fill-color-light);
  }

  :deep(.el-dialog__close) {
    color: var(--el-text-color-secondary);
    font-size: 18px;
  }

  :deep(.el-dialog__headerbtn:hover .el-dialog__close) {
    color: var(--el-color-primary);
  }

  :deep(.el-dialog__body) {
    padding: 0;
  }
}

.player-container {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #000;
  position: relative;
}

.player-controls {
  height: 20px;
  width: 100%;
  display: grid;
  grid-template-columns: 140px auto 140px;
  background-color: rgb(0, 0, 0);
}

.player-progress {
  width: 100%;
  height: 8px;
  margin: 6px 0;
  border-radius: 4px;
  border: 1px solid #505050;
  background-color: rgb(56, 56, 56);
  cursor: pointer;
  position: relative;
}

.player-time {
  color: #FFFFFF;
  text-align: center;
  font-size: 14px;
  line-height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.player-progress-bar {
  width: 100%;
  height: 6px;
  background-color: var(--el-color-primary);
  border-radius: 4px;
  transition: width 0.1s linear;
}

.player-progress-tooltip {
  width: fit-content;
  text-align: center;
  position: absolute;
  top: -35px;
  color: rgb(217, 217, 217);
  font-size: 14px;
  text-shadow: -1px -1px 0 black, 1px -1px 0 black, -1px 1px 0 black, 1px 1px 0 black;
  pointer-events: none;
  white-space: nowrap;
  z-index: 99;
}

.player-toolbar {
  height: 48px;
  background-color: #1a1a1a;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 0 16px;
}

.player-toolbar-left,
.player-toolbar-center,
.player-toolbar-right {
  display: flex;
  align-items: center;
}

.toolbar-btn {
  margin-left: 4px;
  background: rgba(255, 255, 255, 0.1);
  border: none;
  color: #fff;
  transition: all 0.2s;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
  }

  &.primary {
    background: var(--el-color-primary);
  }

  &.danger {
    background: rgba(var(--el-color-danger-rgb), 0.2);
  }

  &.speed-btn {
    border-radius: 12px;
    padding: 0 8px;
    height: 24px;
    display: flex;
    align-items: center;
    gap: 2px;
    font-size: 12px;
  }
}

/* ========== 云台控制样式 ========== */
.player {
  width: 100%;
  height: 450px;
}

::v-deep(.el-icon) {
  height: auto !important;
}

.control-wrapper {
  position: relative;
  width: 100px;
  height: 100px;
  max-width: 100px;
  max-height: 100px;
  border-radius: 100%;
  margin-top: 24px;
  margin-left: 8px;
  float: left;
}

.control-btn {
  display: flex;
  justify-content: center;
  position: absolute;
  width: 44%;
  height: 44%;
  border-radius: 5px;
  border: 1px solid var(--el-color-primary-light-3);
  box-sizing: border-box;
  transition: all 0.3s linear;
}

.control-btn:hover {
  cursor: pointer;
}

.control-btn .icon {
  width: 100%;
  font-size: 20px;
  color: var(--el-color-primary-light-3);
  display: flex;
  justify-content: center;
  align-items: center;
}

.control-btn .icon:hover {
  cursor: pointer;
}

.control-zoom-btn:hover {
  cursor: pointer;
}

.control-round {
  position: absolute;
  top: 21%;
  left: 21%;
  width: 58%;
  height: 58%;
  background: var(--el-bg-color);
  border-radius: 100%;
}

.control-round-inner {
  position: absolute;
  left: 13%;
  top: 13%;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 70%;
  height: 70%;
  font-size: 40px;
  color: var(--el-color-primary-light-3);
  border: 1px solid var(--el-color-primary-light-3);
  border-radius: 100%;
  transition: all 0.3s linear;
}

.control-inner-btn {
  position: absolute;
  width: 60%;
  height: 60%;
  background: var(--el-fill-color-lighter);
}

.control-top {
  top: -12px;
  left: 27%;
  transform: rotate(-45deg);
  border-radius: 5px 100% 5px 0;
}

.control-top .icon {
  transform: rotate(45deg);
  border-radius: 5px 100% 5px 0;
}

.control-top .control-inner {
  left: -1px;
  bottom: 0;
  border-top: 1px solid var(--el-color-primary-light-3);
  border-right: 1px solid var(--el-color-primary-light-3);
  border-radius: 0 100% 0 0;
}

.control-top .fa {
  transform: rotate(45deg) translateY(-7px);
}

.control-left {
  top: 27%;
  left: -12px;
  transform: rotate(45deg);
  border-radius: 5px 0 5px 100%;
}

.control-left .icon {
  transform: rotate(-45deg);
}

.control-left .control-inner {
  right: -1px;
  top: -1px;
  border-bottom: 1px solid var(--el-color-primary-light-3);
}

/* ========== 大华设备信息对话框样式 ========== */
:deep(.glass-dialog.device-info-dialog .el-dialog) {
  border-radius: 20px;
  background: var(--el-bg-color-page);
  backdrop-filter: blur(20px) saturate(1.3);
  -webkit-backdrop-filter: blur(20px) saturate(1.3);
  border: 1px solid var(--el-border-color-lighter);
  box-shadow: var(--el-box-shadow-light);
  overflow: hidden;
  animation: dialogEnter 0.45s cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes dialogEnter {
  from {
    opacity: 0;
    transform: translateY(-20px) scale(0.96);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

/* 头部 */
:deep(.glass-dialog.device-info-dialog .el-dialog__header) {
  padding: 20px 24px 16px;
  margin-right: 0;
  border-bottom: 1px solid var(--el-border-color-lighter);
  position: relative;
}

:deep(.glass-dialog.device-info-dialog .el-dialog__header::after) {
  content: '';
  position: absolute;
  bottom: 0;
  left: 24px;
  width: 60px;
  height: 3px;
  background: linear-gradient(90deg, var(--el-color-primary), var(--el-color-primary-light-5));
  border-radius: 2px;
}

:deep(.glass-dialog.device-info-dialog .el-dialog__title) {
  font-size: 16px;
  font-weight: 600;
  color: var(--el-text-color-primary);
  letter-spacing: 0.3px;
}

:deep(.glass-dialog.device-info-dialog .el-dialog__headerbtn) {
  top: 18px;
  right: 20px;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}

:deep(.glass-dialog.device-info-dialog .el-dialog__headerbtn:hover) {
  background: var(--el-fill-color-light);
  transform: rotate(90deg);
}

:deep(.glass-dialog.device-info-dialog .el-dialog__close) {
  color: var(--el-text-color-secondary);
  font-size: 20px;
  transition: color 0.25s;
}

:deep(.glass-dialog.device-info-dialog .el-dialog__headerbtn:hover .el-dialog__close) {
  color: var(--el-color-primary);
}

/* 主体 */
:deep(.glass-dialog.device-info-dialog .el-dialog__body) {
  padding: 0;
}

/* 标签页样式 */
:deep(.glass-dialog.device-info-dialog .el-tabs) {
  border: none;
}

:deep(.glass-dialog.device-info-dialog .el-tabs--border-card) {
  border: none;
  box-shadow: none;
}

:deep(.glass-dialog.device-info-dialog .el-tabs__header) {
  margin: 0;
  background: var(--el-fill-color-lighter);
  border: none;
  padding: 0 24px;
}

:deep(.glass-dialog.device-info-dialog .el-tabs__nav-wrap::after) {
  display: none;
}

:deep(.glass-dialog.device-info-dialog .el-tabs__nav) {
  border: none;
}

:deep(.glass-dialog.device-info-dialog .el-tabs__item) {
  padding: 14px 20px;
  font-size: 14px;
  font-weight: 500;
  color: var(--el-text-color-secondary);
  border: none;
  background: transparent;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
}

:deep(.glass-dialog.device-info-dialog .el-tabs__item:hover) {
  color: var(--el-color-primary);
  background: var(--el-fill-color-light);
}

:deep(.glass-dialog.device-info-dialog .el-tabs__item.is-active) {
  color: var(--el-color-primary);
  background: var(--el-bg-color);
  font-weight: 600;
}

:deep(.glass-dialog.device-info-dialog .el-tabs__active-bar) {
  height: 3px;
  background: linear-gradient(90deg, var(--el-color-primary), var(--el-color-primary-light-5));
  border-radius: 2px 2px 0 0;
}

:deep(.glass-dialog.device-info-dialog .el-tabs__content) {
  padding: 24px;
  background: var(--el-bg-color);
}

/* 描述列表优化 */
:deep(.glass-dialog.device-info-dialog .el-descriptions) {
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
  animation: fadeInUp 0.4s ease-out;
}

:deep(.glass-dialog.device-info-dialog .el-descriptions__header) {
  background: var(--el-fill-color-light);
}

:deep(.glass-dialog.device-info-dialog .el-descriptions__label) {
  background: var(--el-fill-color-lighter);
  font-weight: 600;
  color: var(--el-text-color-primary);
  padding: 14px 16px;
}

:deep(.glass-dialog.device-info-dialog .el-descriptions__body .el-descriptions__cell) {
  padding: 14px 16px;
}

/* 表格优化 */
:deep(.glass-dialog.device-info-dialog .el-table) {
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
}

:deep(.glass-dialog.device-info-dialog .el-table__header-wrapper th) {
  background: var(--el-fill-color-light) !important;
  font-weight: 600;
  color: var(--el-text-color-primary);
  padding: 14px 0;
}

:deep(.glass-dialog.device-info-dialog .el-table__body-wrapper tr) {
  transition: all 0.25s ease;
}

:deep(.glass-dialog.device-info-dialog .el-table__body-wrapper tr:hover) {
  background-color: var(--el-color-primary-light-9) !important;
}

:deep(.glass-dialog.device-info-dialog .el-table__body-wrapper td) {
  padding: 12px 0;
}

/* 折叠面板优化 */
:deep(.glass-dialog.device-info-dialog .el-collapse) {
  border: none;
}

:deep(.glass-dialog.device-info-dialog .el-collapse-item) {
  border: 1px solid var(--el-border-color-lighter);
  border-radius: 12px;
  margin-bottom: 12px;
  overflow: hidden;
  transition: all 0.3s ease;
}

:deep(.glass-dialog.device-info-dialog .el-collapse-item:last-child) {
  margin-bottom: 0;
}

:deep(.glass-dialog.device-info-dialog .el-collapse-item:hover) {
  border-color: var(--el-color-primary-light-5);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

:deep(.glass-dialog.device-info-dialog .el-collapse-item__header) {
  padding: 14px 18px;
  background: var(--el-fill-color-lighter);
  font-weight: 600;
  transition: all 0.3s ease;
}

:deep(.glass-dialog.device-info-dialog .el-collapse-item__wrap) {
  background: var(--el-bg-color);
  border: none;
}

:deep(.glass-dialog.device-info-dialog .el-collapse-item__content) {
  padding: 18px;
}

/* 表单优化 */
:deep(.glass-dialog.device-info-dialog .el-form-item) {
  margin-bottom: 20px;
}

:deep(.glass-dialog.device-info-dialog .el-form-item__label) {
  font-weight: 600;
  color: var(--el-text-color-primary);
}

:deep(.glass-dialog.device-info-dialog .el-input__wrapper) {
  border-radius: 10px;
  transition: all 0.3s ease;
}

:deep(.glass-dialog.device-info-dialog .el-select .el-input__wrapper:hover) {
  box-shadow: 0 0 0 1px var(--el-color-primary-light-5) inset;
}

:deep(.glass-dialog.device-info-dialog .el-select .el-input__wrapper.is-focus) {
  box-shadow: 0 0 0 1px var(--el-color-primary) inset, 0 0 0 3px var(--el-color-primary-light-8);
}

/* 按钮底部区域 */
:deep(.glass-dialog.device-info-dialog .dialog-footer) {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding-top: 24px;
  border-top: 1px solid var(--el-border-color-lighter);
  margin-top: 24px;
}

:deep(.glass-dialog.device-info-dialog .dialog-footer .el-button) {
  border-radius: 10px;
  padding: 10px 24px;
  font-weight: 500;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

:deep(.glass-dialog.device-info-dialog .dialog-footer .el-button:not(:disabled):hover) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

:deep(.glass-dialog.device-info-dialog .dialog-footer .el-button--primary:not(:disabled):hover) {
  box-shadow: 0 4px 14px rgba(var(--el-color-primary-rgb), 0.3);
}

:deep(.glass-dialog.device-info-dialog .dialog-footer .el-button--success:not(:disabled):hover) {
  box-shadow: 0 4px 14px rgba(var(--el-color-success-rgb), 0.3);
}

/* 进度条优化 */
:deep(.glass-dialog.device-info-dialog .el-progress-bar__outer) {
  border-radius: 10px;
  background: var(--el-fill-color-lighter);
}

:deep(.glass-dialog.device-info-dialog .el-progress-bar__inner) {
  border-radius: 10px;
}

/* 标签优化 */
:deep(.glass-dialog.device-info-dialog .el-tag) {
  border-radius: 8px;
  padding: 6px 12px;
  font-weight: 500;
  font-size: 13px;
}

/* 空状态优化 */
:deep(.glass-dialog.device-info-dialog .el-empty) {
  padding: 40px 0;
}

/* 加载动画 */
:deep(.glass-dialog.device-info-dialog .el-loading-mask) {
  border-radius: 12px;
}

/* 深色模式适配 */
@media (prefers-color-scheme: dark) {
  :deep(.glass-dialog.device-info-dialog .el-dialog) {
    border-color: var(--el-border-color);
  }

  :deep(.glass-dialog.device-info-dialog .el-dialog__header) {
    border-color: var(--el-border-color);
  }

  :deep(.glass-dialog.device-info-dialog .dialog-footer) {
    border-color: var(--el-border-color);
  }
}

.control-left .fa {
  transform: rotate(-45deg) translateX(-7px);
}

.control-right {
  top: 27%;
  right: -12px;
  transform: rotate(45deg);
  border-radius: 5px 100% 5px 0;
}

.control-right .icon {
  transform: rotate(-45deg);
}

.control-right .control-inner {
  left: -1px;
  bottom: -1px;
  border-top: 1px solid var(--el-color-primary-light-3);
  border-right: 1px solid var(--el-color-primary-light-3);
  border-radius: 0 100% 0 0;
}

.control-right .fa {
  transform: rotate(-45deg) translateX(7px);
}

.control-bottom {
  left: 27%;
  bottom: -12px;
  transform: rotate(45deg);
  border-radius: 0 5px 100% 5px;
}

.control-bottom .icon {
  transform: rotate(-45deg);
}

.control-bottom .control-inner {
  top: -1px;
  left: -1px;
  border-bottom: 1px solid var(--el-color-primary-light-3);
  border-right: 1px solid var(--el-color-primary-light-3);
  border-radius: 0 0 100% 0;
}

.control-bottom .fa {
  transform: rotate(-45deg) translateY(7px);
}

.trank {
  width: 100%;
  height: 185px;
  text-align: left;
  padding: 0 10%;
  overflow: auto;
}

.trankInfo {
  width: 100%;
  padding: 0 10%;
}

.ptz-btn-box {
  display: grid;
  grid-template-columns: 1fr 1fr;
  padding: 0 32px;
  height: 48px;
  line-height: 64px;
}

/* ========== 表单卡片样式 ========== */
.form-card {
  margin-bottom: 16px;
  background: rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(12px) saturate(1.2);
  -webkit-backdrop-filter: blur(12px) saturate(1.2);
  border: 1px solid rgba(255, 255, 255, 0.4);
  border-radius: 16px;
  box-shadow:
    0 1px 3px rgba(0, 0, 0, 0.03),
    0 4px 12px rgba(0, 0, 0, 0.04),
    0 8px 24px rgba(0, 0, 0, 0.02);
  transition: all 0.3s ease;
  animation: cardEnter 0.5s cubic-bezier(0.4, 0, 0.2, 1) backwards;
}

.form-card:hover {
  box-shadow:
    0 4px 8px rgba(0, 0, 0, 0.05),
    0 8px 24px rgba(0, 0, 0, 0.06),
    0 16px 48px rgba(0, 0, 0, 0.04);
  transform: translateY(-2px);
  border-color: rgba(var(--el-color-primary-rgb), 0.25);
}

.form-card:last-child {
  margin-bottom: 0;
}

@keyframes cardEnter {
  from {
    opacity: 0;
    transform: translateY(16px) scale(0.98);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

:deep(.el-card__header) {
  background: transparent;
  border-bottom: 1px solid rgba(0, 0, 0, 0.04);
  padding: 14px 20px;
}

:deep(.el-card__header span) {
  color: var(--el-text-color-primary) !important;
}

:deep(.el-form-item) {
  margin-bottom: 20px;
}

:deep(.el-input) {
  transition: all 0.2s ease;
}

:deep(.el-input:hover .el-input__wrapper) {
  box-shadow: 0 0 0 1px var(--el-input-border-color, #c0c4cc) inset;
}

:deep(.el-button--primary.is-plain) {
  transition: all 0.2s ease;
}

:deep(.el-button--primary.is-plain:hover) {
  transform: translateY(-1px);
}



:deep(.el-radio-group .el-radio) {
  margin-right: 24px;
}

/* ========== 玻璃对话框 ========== */
.glass-dialog.device-dialog :deep(.el-dialog) {
  background: rgba(255, 255, 255, 0.78);
  backdrop-filter: blur(20px) saturate(1.3);
  -webkit-backdrop-filter: blur(20px) saturate(1.3);
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.4);
  box-shadow:
    0 8px 32px rgba(0, 0, 0, 0.08),
    0 2px 8px rgba(0, 0, 0, 0.04),
    0 0 0 1px rgba(255, 255, 255, 0.5) inset;
  animation: dialogEnter 0.45s cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes dialogEnter {
  from {
    opacity: 0;
    transform: translateY(-20px) scale(0.96);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.glass-dialog.device-dialog :deep(.el-dialog__header) {
  border-bottom: 1px solid rgba(0, 0, 0, 0.04);
  padding: 18px 24px;
  margin-right: 0;
}

.glass-dialog.device-dialog :deep(.el-dialog__header .el-dialog__title) {
  color: var(--el-text-color-primary);
  font-weight: 600;
  font-size: 16px;
  letter-spacing: 0.3px;
}

.glass-dialog.device-dialog :deep(.el-dialog__headerbtn) {
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.glass-dialog.device-dialog :deep(.el-dialog__headerbtn:hover) {
  background: rgba(var(--el-color-primary-rgb), 0.1);
  transform: rotate(90deg) scale(1.1);
}

.glass-dialog.device-dialog :deep(.el-dialog__body) {
  padding: 16px 24px;
}

.glass-dialog.device-dialog :deep(.el-dialog__footer) {
  border-top: 1px solid rgba(0, 0, 0, 0.04);
  padding: 16px 24px;
}

.glass-dialog.device-dialog :deep(.el-dialog__footer .el-button) {
  min-width: 88px;
  transition: all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
  height: 36px;
}

.glass-dialog.device-dialog :deep(.el-dialog__footer .el-button--primary:hover) {
  transform: translateY(-2px);
  box-shadow: 0 4px 14px rgba(var(--el-color-primary-rgb), 0.35);
}

.glass-dialog.device-dialog :deep(.el-dialog__footer .el-button:not(.el-button--primary):hover) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

/* ========== 输入框 focus 光晕 ========== */
.glass-dialog.device-dialog :deep(.el-input__wrapper) {
  transition: all 0.25s ease;
}

.glass-dialog.device-dialog :deep(.el-input__wrapper.is-focus) {
  box-shadow: 0 0 0 1px var(--el-color-primary) inset, 0 0 10px rgba(var(--el-color-primary-rgb), 0.12);
}

/* ========== 表单项入场动画 ========== */
.glass-dialog.device-dialog :deep(.el-form-item) {
  animation: formItemEnter 0.4s cubic-bezier(0.4, 0, 0.2, 1) backwards;
}

@keyframes formItemEnter {
  from {
    opacity: 0;
    transform: translateX(-8px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

/* ========== 暗黑模式适配 ========== */
html.dark {
  .query-form {
    border-color: var(--el-border-color);
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.2);
  }

  .table-wrapper {
    border-color: var(--el-border-color);
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.2);
  }

  .table-wrapper:hover {
    box-shadow: 0 4px 20px 0 rgba(0, 0, 0, 0.3);
  }

  .custom-table :deep(.el-table__header-wrapper th) {
    background-color: var(--el-bg-color-overlay) !important;
  }

  .custom-table :deep(.el-table__row:hover) {
    background-color: rgba(255, 255, 255, 0.06) !important;
  }

  .custom-table :deep(.el-table__cell),
  .custom-table :deep(.el-table__cell *),
  .custom-table :deep(.el-link),
  .custom-table :deep(.el-link *),
  .custom-table :deep(.el-text),
  .custom-table :deep(.el-text *) {
    color: #ffffff !important;
  }

  .player-toolbar {
    background: linear-gradient(to bottom, #0d0d0d, #1a1a1a);
  }

  /* 播放器对话框暗黑模式 */
  .play-dialog :deep(.el-dialog) {
    background: var(--el-bg-color-page);
    border-color: var(--el-border-color);
    box-shadow: var(--el-box-shadow-dark);
  }

  .play-dialog :deep(.el-dialog__header) {
    border-bottom-color: var(--el-border-color);
  }

  /* 卡片暗黑增强 */
  .device-card {
    box-shadow: var(--el-box-shadow-dark);
  }

  .device-card:hover {
    box-shadow:
      0 4px 8px rgba(0,0,0,0.35),
      0 12px 24px rgba(0,0,0,0.3),
      0 24px 48px rgba(0,0,0,0.2);
    border-color: var(--el-color-primary-light-3);
  }

  .device-card.is-selected {
    border-color: var(--el-color-primary);
    box-shadow:
      0 0 0 3px var(--el-color-primary-light-9),
      0 8px 24px -4px rgba(var(--el-color-primary-rgb), 0.25),
      0 4px 12px rgba(var(--el-color-primary-rgb), 0.15);
  }

  .card-header-area {
    background: linear-gradient(135deg, rgba(var(--el-color-primary-rgb), 0.12) 0%, var(--el-fill-color) 100%);
  }

  /* 玻璃对话框暗黑模式 */
  .glass-dialog.device-dialog :deep(.el-dialog) {
    background: var(--el-bg-color-overlay);
    border-color: var(--el-border-color);
    box-shadow: var(--el-box-shadow-dark);
  }

  /* device/index.vue 特有暗黑模式样式 */
  .glass-dialog.device-dialog :deep(.el-dialog) {
    background: rgba(30, 30, 40, 0.78);
    border-color: rgba(255, 255, 255, 0.08);
    box-shadow:
      0 8px 32px rgba(0, 0, 0, 0.25),
      0 2px 8px rgba(0, 0, 0, 0.15),
      0 0 0 1px rgba(255, 255, 255, 0.05) inset;
  }

  .glass-dialog.device-dialog :deep(.el-dialog__header) {
    border-bottom-color: rgba(255, 255, 255, 0.06);
  }

  .glass-dialog.device-dialog :deep(.el-dialog__footer) {
    border-top-color: rgba(255, 255, 255, 0.06);
  }

  .glass-dialog.device-dialog :deep(.el-input__wrapper.is-focus) {
    box-shadow: 0 0 0 1px var(--el-color-primary) inset, 0 0 12px rgba(var(--el-color-primary-rgb), 0.2);
  }

  .form-card {
    background: rgba(30, 30, 40, 0.55);
    border-color: rgba(255, 255, 255, 0.06);
    box-shadow:
      0 1px 3px rgba(0, 0, 0, 0.2),
      0 4px 12px rgba(0, 0, 0, 0.15),
      0 8px 24px rgba(0, 0, 0, 0.1);
  }

  .form-card:hover {
    box-shadow:
      0 4px 8px rgba(0, 0, 0, 0.25),
      0 8px 24px rgba(0, 0, 0, 0.2),
      0 16px 48px rgba(0, 0, 0, 0.15);
  }

  :deep(.el-card__header) {
    border-bottom-color: rgba(255, 255, 255, 0.06);
  }

  .card-checkbox :deep(.el-checkbox__inner) {
    background: rgba(30, 30, 30, 0.85);
    border-color: rgba(255, 255, 255, 0.4);
  }

  .card-checkbox :deep(.el-checkbox__inner:hover) {
    background: rgba(50, 50, 50, 0.9);
    border-color: rgba(255, 255, 255, 0.6);
  }

  .device-card:hover {
    box-shadow:
      0 4px 8px rgba(0,0,0,0.35),
      0 12px 24px rgba(0,0,0,0.3),
      0 24px 48px rgba(0,0,0,0.2);
    border-color: var(--el-color-primary-light-3);
  }

  .device-card.is-selected {
    border-color: var(--el-color-primary);
    box-shadow:
      0 0 0 3px var(--el-color-primary-light-9),
      0 8px 24px -4px rgba(var(--el-color-primary-rgb), 0.25),
      0 4px 12px rgba(var(--el-color-primary-rgb), 0.15);
  }
}


:deep(.el-tab-pane) {
  padding-top: 8px;
}

.mb8 {
  margin-bottom: 16px;
}

/* 云台功能面板样式 */
.ptz-function-panel {
  text-align: left;
  height: 100%;
}

.ptz-tabs {
  width: 100%;
  height: 100%;
}

:deep(.ptz-tabs .el-tabs__header) {
  margin-bottom: 0;
}

/* 预置点面板样式 */
.preset-panel {
  padding: 10px;
}

.preset-select {
  width: 100%;
  margin-bottom: 10px;
}

.preset-buttons {
  display: flex;
  gap: 8px;
  margin-bottom: 8px;
}

.preset-buttons .el-button {
  flex: 1;
}

.refresh-btn {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 4px;
}

/* 控制面板样式 */
.control-panel {
  padding: 15px 10px;
  display: flex;
}

.control-btn-on,
.control-btn-off {
  width: 100%;
}

/* 媒体区 */
.card-media {
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 9;
  background: linear-gradient(135deg, var(--el-fill-color-lighter) 0%, var(--el-fill-color) 100%);
  overflow: hidden;
}

.media-inner {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 让 image-preview / el-image 占满媒体区 */
.media-inner > * {
  width: 100% !important;
  height: 100% !important;
}

/* 覆盖 ImagePreview 组件内部的圆角和阴影 */
.media-inner :deep(.el-image) {
  border-radius: 0 !important;
  box-shadow: none !important;
}

/* 接管图片缩放动画 */
.media-inner :deep(.el-image__inner) {
  transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1) !important;
}

.media-inner :deep(.el-image__inner:hover) {
  transform: none !important;
}

.device-card:hover .media-inner :deep(.el-image__inner) {
  transform: scale(1.08) !important;
}

.snapshot-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  color: var(--el-text-color-placeholder);
  gap: 6px;
}

.snapshot-placeholder .el-icon {
  font-size: 40px;
  opacity: 0.4;
}

.snapshot-placeholder span {
  font-size: 12px;
}

/* 底部玻璃信息条 */
.media-glass-bar {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 12px 14px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  z-index: 3;
  background: linear-gradient(
      to top,
      rgba(0, 0, 0, 0.65) 0%,
      rgba(0, 0, 0, 0.4) 55%,
      transparent 100%
  );
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
}

.card-checkbox {
  position: absolute;
  top: 12px;
  left: 12px;
  z-index: 10;
}

.card-checkbox :deep(.el-checkbox__inner) {
  border-radius: 6px;
  width: 18px;
  height: 18px;
  background: rgba(255, 255, 255, 0.25);
  border-color: rgba(255, 255, 255, 0.5);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
  transition: all 0.2s ease;
}

.card-checkbox :deep(.el-checkbox__inner:hover) {
  background: rgba(255, 255, 255, 0.4);
  border-color: rgba(255, 255, 255, 0.7);
}

.card-checkbox :deep(.el-checkbox__input.is-checked .el-checkbox__inner) {
  background-color: var(--el-color-primary);
  border-color: var(--el-color-primary);
}

.card-checkbox :deep(.el-checkbox__inner::after) {
  left: 8px;
  top: 8px;
  border-color: #fff;
}

.bar-device-name {
  flex: 1;
  font-size: 14px;
  font-weight: 600;
  color: #ffffff;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  text-shadow: 0 1px 4px rgba(0, 0, 0, 0.5);
  min-width: 0;
}

/* 状态指示器 - 高对比发光版 */
.status-indicator {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 11px;
  font-weight: 600;
  flex-shrink: 0;
  letter-spacing: 0.5px;
}

.status-indicator.online {
  background: rgba(103, 194, 58, 0.92);
  color: #ffffff;
  border: 1px solid rgba(255, 255, 255, 0.35);
  animation: statusGlowOnline 3s ease-in-out infinite;
}

.status-indicator.offline {
  background: rgba(245, 108, 108, 0.92);
  color: #ffffff;
  border: 1px solid rgba(255, 255, 255, 0.35);
  animation: statusGlowOffline 4s ease-in-out infinite;
}

.status-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: currentColor;
  box-shadow: 0 0 6px currentColor;
}

.status-dot.pulse {
  animation: dotPulse 2s ease-in-out infinite;
}

.status-dot.breathe {
  animation: dotBreathe 3s ease-in-out infinite;
}

@keyframes dotPulse {
  0%, 100% {
    opacity: 1;
    box-shadow: 0 0 4px #fff, 0 0 10px currentColor;
    transform: scale(1);
  }
  50% {
    opacity: 0.85;
    box-shadow: 0 0 10px #fff, 0 0 20px currentColor;
    transform: scale(1.4);
  }
}

@keyframes dotBreathe {
  0%, 100% {
    opacity: 0.5;
    box-shadow: 0 0 2px currentColor;
    transform: scale(1);
  }
  50% {
    opacity: 0.9;
    box-shadow: 0 0 8px currentColor;
    transform: scale(1.25);
  }
}

@keyframes statusGlowOnline {
  0%, 100% {
    box-shadow:
      0 0 0 1px rgba(103, 194, 58, 0.3),
      0 4px 14px rgba(103, 194, 58, 0.45),
      inset 0 1px 0 rgba(255, 255, 255, 0.3);
  }
  50% {
    box-shadow:
      0 0 0 1px rgba(103, 194, 58, 0.3),
      0 4px 22px rgba(103, 194, 58, 0.65),
      inset 0 1px 0 rgba(255, 255, 255, 0.3);
  }
}

@keyframes statusGlowOffline {
  0%, 100% {
    box-shadow:
      0 0 0 1px rgba(245, 108, 108, 0.3),
      0 4px 14px rgba(245, 108, 108, 0.45),
      inset 0 1px 0 rgba(255, 255, 255, 0.3);
  }
  50% {
    box-shadow:
      0 0 0 1px rgba(245, 108, 108, 0.3),
      0 4px 22px rgba(245, 108, 108, 0.55),
      inset 0 1px 0 rgba(255, 255, 255, 0.3);
  }
}

/* 信息区 */
.card-info {
  padding: 14px 16px 10px;
}

.info-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 10px;
}

.info-tag {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 3px 10px;
  border-radius: 6px;
  background: var(--el-fill-color-lighter);
  border: 1px solid var(--el-border-color-lighter);
  font-size: 11.5px;
  line-height: 1.5;
  backdrop-filter: blur(4px);
  transition: all 0.2s ease;
}

.info-tag:hover {
  border-color: var(--el-color-primary-light-5);
  background: var(--el-color-primary-light-9);
}

.type-tag {
  margin-left: auto;
}

.tag-label {
  color: var(--el-text-color-secondary);
  font-weight: 500;
}

.tag-val {
  color: var(--el-text-color-primary);
  font-weight: 500;
}

/* 通道单独一行 */
.info-channel {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 10px;
  margin-bottom: 10px;
  border-radius: 6px;
  background: var(--el-fill-color-lighter);
  border: 1px solid var(--el-border-color-lighter);
  font-size: 12px;
  transition: all 0.2s ease;
}

.info-channel:hover {
  border-color: var(--el-color-primary-light-5);
  background: var(--el-color-primary-light-9);
}

.channel-label {
  color: var(--el-text-color-secondary);
  font-weight: 500;
  flex-shrink: 0;
}

.channel-val {
  color: var(--el-text-color-primary);
  font-weight: 500;
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  text-align: right;
}

.info-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.remark {
  font-size: 12px;
  color: var(--el-text-color-secondary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  flex: 1;
  text-align: right;
}

/* 操作栏 */
.card-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 10px 16px 14px;
  border-top: 1px solid var(--el-border-color-lighter);
}

.btn-play {
  flex-shrink: 0;
  min-width: 72px;
  box-shadow: 0 2px 8px rgba(64, 158, 255, 0.25);
  transition: all 0.3s ease;
}

.btn-play:not(:disabled):hover {
  box-shadow: 0 4px 14px rgba(var(--el-color-primary-rgb), 0.4);
  transform: translateY(-1px);
}

.toolbar-actions {
  display: flex;
  align-items: center;
  gap: 6px;
}

.toolbar-actions .el-button {
  padding: 7px 10px;
  height: auto;
  font-size: 14px;
  transition: all 0.2s ease;
}

.toolbar-actions .el-button:hover {
  transform: scale(1.08);
}

/* ===== 卡片视图按钮样式 - 白色图标 ===== */
/* 播放按钮 */
.card-toolbar .btn-play {
  color: #ffffff !important;
}

.card-toolbar .btn-play .el-icon {
  color: #ffffff !important;
}

/* 操作按钮 - 强制覆盖 text bg 样式 */
.toolbar-actions .el-button--primary,
.toolbar-actions .el-button--primary[text],
.toolbar-actions .el-button--primary[text][bg] {
  color: #ffffff !important;
  background-color: var(--el-color-primary) !important;
  border-color: var(--el-color-primary) !important;
}

.toolbar-actions .el-button--danger,
.toolbar-actions .el-button--danger[text],
.toolbar-actions .el-button--danger[text][bg] {
  color: #ffffff !important;
  background-color: var(--el-color-danger) !important;
  border-color: var(--el-color-danger) !important;
}

.toolbar-actions .el-button--success,
.toolbar-actions .el-button--success[text],
.toolbar-actions .el-button--success[text][bg] {
  color: #ffffff !important;
  background-color: var(--el-color-success) !important;
  border-color: var(--el-color-success) !important;
}

.toolbar-actions .el-button .el-icon {
  color: #ffffff !important;
}

/* 悬停时稍微浅一点 */
.toolbar-actions .el-button--primary:hover,
.toolbar-actions .el-button--primary[text]:hover,
.toolbar-actions .el-button--primary[text][bg]:hover {
  background-color: var(--el-color-primary-light-3) !important;
  border-color: var(--el-color-primary-light-3) !important;
  color: #ffffff !important;
}

.toolbar-actions .el-button--primary:hover .el-icon {
  color: #ffffff !important;
}

.toolbar-actions .el-button--danger:hover,
.toolbar-actions .el-button--danger[text]:hover,
.toolbar-actions .el-button--danger[text][bg]:hover {
  background-color: var(--el-color-danger-light-3) !important;
  border-color: var(--el-color-danger-light-3) !important;
  color: #ffffff !important;
}

.toolbar-actions .el-button--danger:hover .el-icon {
  color: #ffffff !important;
}

.toolbar-actions .el-button--success:hover,
.toolbar-actions .el-button--success[text]:hover,
.toolbar-actions .el-button--success[text][bg]:hover {
  background-color: var(--el-color-success-light-3) !important;
  border-color: var(--el-color-success-light-3) !important;
  color: #ffffff !important;
}

.toolbar-actions .el-button--success:hover .el-icon {
  color: #ffffff !important;
}

/* ===== 播放对话框玻璃拟态 ===== */
.glass-dialog.play-dialog :deep(.el-dialog),
.glass-dialog.access-dialog :deep(.el-dialog) {
  background: rgba(255, 255, 255, 0.78);
  backdrop-filter: blur(20px) saturate(1.3);
  -webkit-backdrop-filter: blur(20px) saturate(1.3);
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.4);
  box-shadow:
    0 8px 32px rgba(0, 0, 0, 0.08),
    0 2px 8px rgba(0, 0, 0, 0.04),
    0 0 0 1px rgba(255, 255, 255, 0.5) inset;
  animation: dialogEnter 0.45s cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes dialogEnter {
  from {
    opacity: 0;
    transform: translateY(-20px) scale(0.96);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.glass-dialog.play-dialog :deep(.el-dialog__header),
.glass-dialog.access-dialog :deep(.el-dialog__header) {
  border-bottom: 1px solid rgba(0, 0, 0, 0.04);
  padding: 18px 24px;
  margin-right: 0;
}

.glass-dialog.play-dialog :deep(.el-dialog__header .el-dialog__title),
.glass-dialog.access-dialog :deep(.el-dialog__header .el-dialog__title) {
  color: var(--el-text-color-primary);
  font-weight: 600;
  font-size: 16px;
  letter-spacing: 0.3px;
}

.glass-dialog.play-dialog :deep(.el-dialog__headerbtn),
.glass-dialog.access-dialog :deep(.el-dialog__headerbtn) {
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.glass-dialog.play-dialog :deep(.el-dialog__headerbtn:hover),
.glass-dialog.access-dialog :deep(.el-dialog__headerbtn:hover) {
  background: rgba(var(--el-color-primary-rgb), 0.1);
  transform: rotate(90deg) scale(1.1);
}

.glass-dialog.play-dialog :deep(.el-dialog__body),
.glass-dialog.access-dialog :deep(.el-dialog__body) {
  padding: 16px 24px;
}

.glass-dialog.play-dialog :deep(.el-dialog__footer),
.glass-dialog.access-dialog :deep(.el-dialog__footer) {
  border-top: 1px solid rgba(0, 0, 0, 0.04);
  padding: 16px 24px;
}

/* ===== 播放对话框内输入框 focus 光晕 ===== */
.glass-dialog.play-dialog :deep(.el-input__wrapper),
.glass-dialog.access-dialog :deep(.el-input__wrapper) {
  transition: all 0.25s ease;
}

.glass-dialog.play-dialog :deep(.el-input__wrapper.is-focus),
.glass-dialog.access-dialog :deep(.el-input__wrapper.is-focus) {
  box-shadow: 0 0 0 1px var(--el-color-primary) inset, 0 0 10px rgba(var(--el-color-primary-rgb), 0.12);
}

/* ===== 云台控制玻璃效果 ===== */
.control-round {
  background: var(--el-bg-color);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.control-round-inner {
  background: var(--el-bg-color);
  box-shadow: 0 2px 8px rgba(var(--el-color-primary-rgb), 0.1);
}

.control-inner-btn {
  background: var(--el-fill-color-lighter);
}

.control-btn:hover {
  background: rgba(var(--el-color-primary-rgb), 0.06);
  box-shadow: 0 0 12px rgba(var(--el-color-primary-rgb), 0.15);
}

.control-zoom-btn {
  color: var(--el-color-primary-light-3);
  transition: all 0.25s ease;
}

.control-zoom-btn:hover {
  color: var(--el-color-primary);
  transform: scale(1.15);
  filter: drop-shadow(0 0 6px rgba(var(--el-color-primary-rgb), 0.3));
}

/* ===== 预置点面板动画 ===== */
.preset-panel {
  animation: panelFadeIn 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes panelFadeIn {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* ===== 暗黑模式 ===== */
html.dark .glass-dialog.play-dialog :deep(.el-dialog),
html.dark .glass-dialog.access-dialog :deep(.el-dialog) {
  background: rgba(30, 30, 40, 0.78);
  border-color: rgba(255, 255, 255, 0.08);
  box-shadow:
    0 8px 32px rgba(0, 0, 0, 0.25),
    0 2px 8px rgba(0, 0, 0, 0.15),
    0 0 0 1px rgba(255, 255, 255, 0.05) inset;
}

html.dark .glass-dialog.play-dialog :deep(.el-dialog__header),
html.dark .glass-dialog.access-dialog :deep(.el-dialog__header) {
  border-bottom-color: rgba(255, 255, 255, 0.06);
}

html.dark .glass-dialog.play-dialog :deep(.el-dialog__footer),
html.dark .glass-dialog.access-dialog :deep(.el-dialog__footer) {
  border-top-color: rgba(255, 255, 255, 0.06);
}

html.dark .glass-dialog.play-dialog :deep(.el-input__wrapper.is-focus),
html.dark .glass-dialog.access-dialog :deep(.el-input__wrapper.is-focus) {
  box-shadow: 0 0 0 1px var(--el-color-primary) inset, 0 0 12px rgba(var(--el-color-primary-rgb), 0.2);
}

html.dark .control-round {
  background: var(--el-bg-color);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

html.dark .control-round-inner {
  background: var(--el-bg-color);
  box-shadow: 0 2px 8px rgba(var(--el-color-primary-rgb), 0.15);
}

html.dark .control-inner-btn {
  background: var(--el-fill-color-darker);
}

html.dark .control-btn:hover {
  background: rgba(var(--el-color-primary-rgb), 0.1);
}

/* ===== search-box 样式 ===== */
.search-box {
  margin-bottom: 16px;
}

/* ===== 查询表单优化样式 ===== */
.query-form {
  padding: 10px 15px;
  background: var(--el-bg-color-overlay);
  border-radius: 10px;
  border: 1px solid var(--el-border-color-lighter);
  box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.04);
  margin-bottom: 0 !important;
  animation: fadeInUp 0.4s ease-out 0.15s both;
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  gap: 10px;
}

.query-form :deep(.el-form-item) {
  margin-bottom: 0;
  margin-right: 0;
}

.query-form :deep(.el-input__wrapper),
.query-form :deep(.el-select .el-input__wrapper) {
  box-shadow: 0 0 0 1px var(--el-border-color-light) inset;
  transition: all 0.3s;
}

.query-form :deep(.el-input__wrapper:hover),
.query-form :deep(.el-input__wrapper:focus-within),
.query-form :deep(.el-select .el-input__wrapper:hover),
.query-form :deep(.el-select .el-input__wrapper:focus-within) {
  box-shadow: 0 0 0 1px var(--el-color-primary-light-5) inset;
}

.query-form :deep(.el-input__wrapper:focus-within),
.query-form :deep(.el-select .el-input__wrapper:focus-within) {
  box-shadow: 0 0 0 1px var(--el-color-primary) inset, 0 0 0 3px var(--el-color-primary-light-8);
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(12px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.form-actions {
  margin-left: auto !important;
  margin-right: 0 !important;
  padding-left: 16px;
  border-left: 1px solid var(--el-border-color-lighter);
  margin-left: 12px !important;
}

.button-group {
  display: flex;
  gap: 12px;
}

.search-btn {
  transition: all 0.3s;
}

.search-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px var(--el-color-primary-light-7);
}

.search-btn:active {
  transform: translateY(0);
}

.reset-btn {
  transition: all 0.3s;
}

.reset-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
}

.reset-btn:active {
  transform: translateY(0);
}

/* ===== 工具栏样式优化 ===== */
.toolbar-row {
  padding: 4px 0;
  animation: fadeInUp 0.4s ease-out 0.2s both;
}

.action-buttons {
  display: flex;
  gap: 12px;
  margin-top: 12px;
  align-items: center;
}

.action-btn {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.action-btn:not(:disabled):hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.1);
}

.action-btn:not(:disabled):active {
  transform: translateY(0);
}

.add-btn:hover {
  box-shadow: 0 4px 14px rgba(var(--el-color-primary-rgb), 0.35);
}

.edit-btn:hover {
  box-shadow: 0 4px 12px rgba(103, 194, 58, 0.35);
}

.delete-btn:hover {
  box-shadow: 0 4px 12px rgba(245, 108, 108, 0.35);
}

/* 表格容器优化 */
.table-wrapper {
  margin-top: 12px;
  background: var(--el-bg-color-overlay);
  border-radius: 10px;
  border: 1px solid var(--el-border-color-lighter);
  box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.04);
  overflow: hidden;
  animation: fadeInUp 0.4s ease-out 0.25s both;
  transition: box-shadow 0.3s;
}

.table-wrapper:hover {
  box-shadow: 0 4px 16px 0 rgba(0, 0, 0, 0.06);
}

.custom-table {
  --el-table-header-bg-color: var(--el-fill-color-light);

  :deep(.el-table__header-wrapper) {
    th {
      background-color: var(--el-fill-color-light) !important;
      color: var(--el-text-color-primary);
      font-weight: 600;
      font-size: 13px;
      letter-spacing: 0.3px;
      transition: background-color 0.3s;
    }
  }

  :deep(.el-table__body-wrapper) {
    .el-table__row {
      transition: all 0.25s ease;
      animation: rowFadeIn 0.4s ease-out both;

      &:hover {
        background-color: var(--el-color-primary-light-9) !important;
        transform: scale(1.002);
      }

      &.current-row {
        background-color: var(--el-color-primary-light-9) !important;
      }
    }
  }

  :deep(.el-table__empty-block) {
    padding: 40px 0;
  }
}

@keyframes rowFadeIn {
  from {
    opacity: 0;
    transform: translateX(-10px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

/* 编号徽章 */
.id-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 28px;
  height: 22px;
  padding: 0 8px;
  background: var(--el-color-primary-light-9);
  color: var(--el-color-primary);
  border-radius: 11px;
  font-size: 12px;
  font-weight: 600;
  transition: all 0.3s;

  .el-table__row:hover & {
    background: var(--el-color-primary-light-8);
    transform: scale(1.05);
  }
}

/* 分页优化 */
:deep(.el-pagination) {
  padding: 12px 0;
  animation: fadeInUp 0.4s ease-out 0.3s both;
}

:deep(.el-pagination__total) {
  color: var(--el-text-color-secondary);
}

:deep(.el-pagination__sizes) .el-input__wrapper {
  box-shadow: 0 0 0 1px var(--el-border-color-light) inset;
}

:deep(.el-pager li) {
  transition: all 0.3s;
}

:deep(.el-pager li:hover:not(.is-active)) {
  color: var(--el-color-primary);
  transform: translateY(-1px);
}

:deep(.el-pager li.is-active) {
  box-shadow: 0 2px 8px var(--el-color-primary-light-5);
}

/* ===== 暗黑模式适配 ===== */
html.dark {
  .query-form {
    border-color: var(--el-border-color);
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.2);
  }

  .form-actions {
    border-left-color: rgba(255, 255, 255, 0.08);
  }

  .table-wrapper {
    border-color: var(--el-border-color);
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.2);
  }

  .table-wrapper:hover {
    box-shadow: 0 4px 20px 0 rgba(0, 0, 0, 0.3);
  }

  .custom-table :deep(.el-table__header-wrapper th) {
    background-color: var(--el-bg-color-overlay) !important;
  }

  .custom-table :deep(.el-table__row:hover) {
    background-color: rgba(255, 255, 255, 0.06) !important;
  }

  .custom-table :deep(.el-table__cell),
  .custom-table :deep(.el-table__cell *),
  .custom-table :deep(.el-link),
  .custom-table :deep(.el-link *),
  .custom-table :deep(.el-text),
  .custom-table :deep(.el-text *) {
    color: #ffffff !important;
  }
}

/* ===== 表单核心信息样式 ===== */
.core-info {
  padding: 8px 0;
  margin-bottom: 8px;
}

/* ===== 展开/收起按钮样式 ===== */
.expand-toggle {
  display: flex;
  justify-content: center;
  margin: 8px 0 16px 0;
  padding: 8px 0;
  border-top: 1px dashed var(--el-border-color-lighter);
}

.expand-toggle .el-button {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  transition: all 0.3s ease;
}

.expand-toggle .el-button:hover {
  transform: translateY(-1px);
}

.expand-toggle .el-icon {
  transition: transform 0.3s ease;
}

.table-actions {
  display: flex;
  align-items: center;
  gap: 6px;
  justify-content: center;
  flex-wrap: wrap;
}

.table-actions .el-button {
  padding: 7px 10px;
  height: auto;
  font-size: 14px;
  transition: all 0.2s ease;
}

.table-actions .el-button:hover {
  transform: scale(1.08);
}

.table-actions .el-button .el-icon {
  color: #ffffff !important;
}

.table-actions .el-button--primary,
.table-actions .el-button--primary[text],
.table-actions .el-button--primary[text][bg] {
  color: #ffffff !important;
  background-color: var(--el-color-primary) !important;
  border-color: var(--el-color-primary) !important;
}

.table-actions .el-button--success,
.table-actions .el-button--success[text],
.table-actions .el-button--success[text][bg] {
  color: #ffffff !important;
  background-color: var(--el-color-success) !important;
  border-color: var(--el-color-success) !important;
}

.table-actions .el-button--danger,
.table-actions .el-button--danger[text],
.table-actions .el-button--danger[text][bg] {
  color: #ffffff !important;
  background-color: var(--el-color-danger) !important;
  border-color: var(--el-color-danger) !important;
}

.table-actions .el-button--info,
.table-actions .el-button--info[text],
.table-actions .el-button--info[text][bg] {
  color: #ffffff !important;
  background-color: var(--el-color-info) !important;
  border-color: var(--el-color-info) !important;
}

/* ===== 高级配置区域样式 ===== */
.advanced-config {
  padding: 16px;
  background: var(--el-fill-color-lighter);
  border-radius: 12px;
  border: 1px solid var(--el-border-color-lighter);
  animation: slideDown 0.3s ease-out;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* ===== 配置分区样式 ===== */
.config-section {
  margin-bottom: 20px;
}

.config-section:last-child {
  margin-bottom: 0;
}

.config-section .section-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--el-text-color-primary);
  margin-bottom: 12px;
  padding-bottom: 8px;
  border-bottom: 1px solid var(--el-border-color-lighter);
  display: flex;
  align-items: center;
  gap: 6px;
}

.config-section .section-title::before {
  content: '';
  width: 4px;
  height: 14px;
  background: var(--el-color-primary);
  border-radius: 2px;
}

/* ===== 响应式布局优化 ===== */
@media (max-width: 768px) {
  .query-form {
    padding: 8px 10px;
  }

  .form-actions {
    padding-left: 10px;
    margin-left: 8px !important;
  }

  .button-group {
    gap: 8px;
  }

  .action-buttons {
    gap: 8px;
    flex-wrap: wrap;
  }

  .advanced-config {
    padding: 12px;
  }
}

/* ===== 暗黑模式适配 - 表单样式 ===== */
html.dark {
  .expand-toggle {
    border-top-color: rgba(255, 255, 255, 0.08);
  }

  .advanced-config {
    background: rgba(255, 255, 255, 0.03);
    border-color: rgba(255, 255, 255, 0.08);
  }

  .config-section .section-title {
    border-bottom-color: rgba(255, 255, 255, 0.06);
  }
}

/* ========== 设备信息仪表板高级样式 ========== */
.device-info-dashboard {
  padding: 4px;
}

/* 仪表板头部 */
.dashboard-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
  padding: 0 4px;
  animation: fadeInDown 0.5s cubic-bezier(0.4, 0, 0.2, 1) both;
}

@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translateY(-12px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.dashboard-title {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 16px;
  font-weight: 600;
  color: var(--el-text-color-primary);
}

.dashboard-title .dashboard-icon {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: linear-gradient(135deg, var(--el-color-primary) 0%, var(--el-color-primary-light-3) 100%);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  box-shadow: 0 4px 12px rgba(var(--el-color-primary-rgb), 0.3);
  animation: iconFloat 3s ease-in-out infinite;
}

@keyframes iconFloat {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-3px); }
}

.dashboard-badge {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  border-radius: 20px;
  background: var(--el-fill-color-lighter);
  border: 1px solid var(--el-border-color-lighter);
  font-size: 13px;
  font-weight: 500;
  color: var(--el-text-color-secondary);
  transition: all 0.3s ease;
}

.dashboard-badge:hover {
  border-color: var(--el-color-primary-light-5);
  background: var(--el-color-primary-light-9);
  color: var(--el-color-primary);
  transform: translateY(-1px);
}

/* 卡片网格 */
.info-cards-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 14px;
}

.info-cards-grid.cols-3 {
  grid-template-columns: repeat(3, 1fr);
}

@media (max-width: 768px) {
  .info-cards-grid,
  .info-cards-grid.cols-3 {
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
  }
}

@media (max-width: 480px) {
  .info-cards-grid,
  .info-cards-grid.cols-3 {
    grid-template-columns: 1fr;
  }
}

/* 信息卡片 */
.info-card {
  position: relative;
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 16px 18px;
  border-radius: 14px;
  background: var(--el-bg-color-overlay);
  border: 1px solid var(--el-border-color-lighter);
  overflow: hidden;
  animation: cardPopIn 0.5s cubic-bezier(0.4, 0, 0.2, 1) both;
  transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: default;
}

@keyframes cardPopIn {
  from {
    opacity: 0;
    transform: translateY(16px) scale(0.96);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.info-card:hover {
  transform: translateY(-4px) scale(1.01);
  box-shadow: 0 12px 28px rgba(0, 0, 0, 0.08);
  border-color: transparent;
}

/* 光晕效果 */
.info-card-glow {
  position: absolute;
  top: -50%;
  right: -50%;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  opacity: 0;
  transition: opacity 0.4s ease;
  pointer-events: none;
  filter: blur(24px);
}

.info-card:hover .info-card-glow {
  opacity: 0.12;
}

/* 卡片图标 */
.info-card-icon {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  flex-shrink: 0;
  transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
  color: #fff;
}

.info-card:hover .info-card-icon {
  transform: scale(1.1) rotate(-4deg);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
}

/* 卡片内容 */
.info-card-content {
  flex: 1;
  min-width: 0;
  z-index: 1;
}

.info-card-label {
  font-size: 12px;
  font-weight: 500;
  color: var(--el-text-color-secondary);
  margin-bottom: 4px;
  transition: color 0.3s ease;
}

.info-card:hover .info-card-label {
  color: var(--el-text-color-primary);
}

.info-card-value {
  font-size: 15px;
  font-weight: 600;
  color: var(--el-text-color-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  transition: all 0.3s ease;
}

.info-card:hover .info-card-value {
  transform: translateX(2px);
}

/* 主题色 - primary */
.info-card.primary .info-card-icon {
  background: linear-gradient(135deg, #409eff 0%, #79bbff 100%);
  box-shadow: 0 4px 12px rgba(64, 158, 255, 0.3);
}
.info-card.primary .info-card-glow { background: #409eff; }
.info-card.primary:hover { border-color: rgba(64, 158, 255, 0.3); }

/* 主题色 - success */
.info-card.success .info-card-icon {
  background: linear-gradient(135deg, #67c23a 0%, #95d475 100%);
  box-shadow: 0 4px 12px rgba(103, 194, 58, 0.3);
}
.info-card.success .info-card-glow { background: #67c23a; }
.info-card.success:hover { border-color: rgba(103, 194, 58, 0.3); }

/* 主题色 - warning */
.info-card.warning .info-card-icon {
  background: linear-gradient(135deg, #e6a23c 0%, #f3d19e 100%);
  box-shadow: 0 4px 12px rgba(230, 162, 60, 0.3);
}
.info-card.warning .info-card-glow { background: #e6a23c; }
.info-card.warning:hover { border-color: rgba(230, 162, 60, 0.3); }

/* 主题色 - danger */
.info-card.danger .info-card-icon {
  background: linear-gradient(135deg, #f56c6c 0%, #fab6b6 100%);
  box-shadow: 0 4px 12px rgba(245, 108, 108, 0.3);
}
.info-card.danger .info-card-glow { background: #f56c6c; }
.info-card.danger:hover { border-color: rgba(245, 108, 108, 0.3); }

/* 主题色 - info */
.info-card.info .info-card-icon {
  background: linear-gradient(135deg, #909399 0%, #c8c9cc 100%);
  box-shadow: 0 4px 12px rgba(144, 147, 153, 0.3);
}
.info-card.info .info-card-glow { background: #909399; }
.info-card.info:hover { border-color: rgba(144, 147, 153, 0.3); }

/* 主题色 - purple */
.info-card.purple .info-card-icon {
  background: linear-gradient(135deg, #8e44ad 0%, #bb8fce 100%);
  box-shadow: 0 4px 12px rgba(142, 68, 173, 0.3);
}
.info-card.purple .info-card-glow { background: #8e44ad; }
.info-card.purple:hover { border-color: rgba(142, 68, 173, 0.3); }

/* 主题色 - teal */
.info-card.teal .info-card-icon {
  background: linear-gradient(135deg, #1abc9c 0%, #76d7c4 100%);
  box-shadow: 0 4px 12px rgba(26, 188, 156, 0.3);
}
.info-card.teal .info-card-glow { background: #1abc9c; }
.info-card.teal:hover { border-color: rgba(26, 188, 156, 0.3); }

/* 主题色 - orange */
.info-card.orange .info-card-icon {
  background: linear-gradient(135deg, #e67e22 0%, #f5b041 100%);
  box-shadow: 0 4px 12px rgba(230, 126, 34, 0.3);
}
.info-card.orange .info-card-glow { background: #e67e22; }
.info-card.orange:hover { border-color: rgba(230, 126, 34, 0.3); }

/* 主题色 - pink */
.info-card.pink .info-card-icon {
  background: linear-gradient(135deg, #e84393 0%, #fd79a8 100%);
  box-shadow: 0 4px 12px rgba(232, 67, 147, 0.3);
}
.info-card.pink .info-card-glow { background: #e84393; }
.info-card.pink:hover { border-color: rgba(232, 67, 147, 0.3); }

/* 主题色 - cyan */
.info-card.cyan .info-card-icon {
  background: linear-gradient(135deg, #00bcd4 0%, #4dd0e1 100%);
  box-shadow: 0 4px 12px rgba(0, 188, 212, 0.3);
}
.info-card.cyan .info-card-glow { background: #00bcd4; }
.info-card.cyan:hover { border-color: rgba(0, 188, 212, 0.3); }

/* 主题色 - lime */
.info-card.lime .info-card-icon {
  background: linear-gradient(135deg, #cddc39 0%, #dce775 100%);
  box-shadow: 0 4px 12px rgba(205, 220, 57, 0.3);
}
.info-card.lime .info-card-glow { background: #cddc39; }
.info-card.lime:hover { border-color: rgba(205, 220, 57, 0.3); }

/* 主题色 - indigo */
.info-card.indigo .info-card-icon {
  background: linear-gradient(135deg, #3f51b5 0%, #7986cb 100%);
  box-shadow: 0 4px 12px rgba(63, 81, 181, 0.3);
}
.info-card.indigo .info-card-glow { background: #3f51b5; }
.info-card.indigo:hover { border-color: rgba(63, 81, 181, 0.3); }

/* ========== 标签页内容面板统一样式 ========== */
.tab-content-wrapper {
  position: relative;
  padding: 24px 20px 20px;
  animation: fadeInUp 0.4s cubic-bezier(0.4, 0, 0.2, 1) both;
  overflow: hidden;
}

/* 终端参数对话框容器 */
.terminal-params-dialog-wrapper {
  position: relative;
  padding: 24px 20px 20px;
  animation: fadeInUp 0.4s cubic-bezier(0.4, 0, 0.2, 1) both;
  overflow: hidden;
}

/* 终端参数表格容器 */
.terminal-params-table-wrapper {
  max-height: 300px;
  overflow-y: auto;
  border: 1px solid var(--el-border-color);
  border-radius: 4px;
}

.terminal-params-table-wrapper::-webkit-scrollbar {
  width: 8px;
}

.terminal-params-table-wrapper::-webkit-scrollbar-track {
  background: var(--el-fill-color-lighter);
  border-radius: 4px;
}

.terminal-params-table-wrapper::-webkit-scrollbar-thumb {
  background: var(--el-border-color);
  border-radius: 4px;
  transition: background 0.3s;
}

.terminal-params-table-wrapper::-webkit-scrollbar-thumb:hover {
  background: var(--el-text-color-secondary);
}

.tab-content-wrapper::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, var(--el-color-primary), var(--el-color-primary-light-3), var(--el-color-success-light-3), var(--el-color-primary));
  background-size: 200% 100%;
  animation: gradientFlow 3s linear infinite;
  border-radius: 2px 2px 0 0;
}

@keyframes gradientFlow {
  0% { background-position: 0% 50%; }
  100% { background-position: 200% 50%; }
}

/* 面板头部 */
.panel-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
  padding-bottom: 14px;
  border-bottom: 1px solid var(--el-border-color-lighter);
  animation: fadeInDown 0.45s ease both;
}

.panel-header .el-icon {
  width: 32px;
  height: 32px;
  border-radius: 10px;
  background: linear-gradient(135deg, var(--el-color-primary) 0%, var(--el-color-primary-light-3) 100%);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  box-shadow: 0 4px 10px rgba(var(--el-color-primary-rgb), 0.25);
}

.panel-header span {
  font-size: 15px;
  font-weight: 600;
  color: var(--el-text-color-primary);
}

/* 分段标题 */
.panel-section-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 600;
  color: var(--el-text-color-primary);
  margin-bottom: 14px;
  padding-left: 10px;
  position: relative;
  animation: fadeInLeft 0.4s ease both;
}

.panel-section-title::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 3px;
  height: 14px;
  background: linear-gradient(180deg, var(--el-color-primary), var(--el-color-primary-light-5));
  border-radius: 2px;
}

@keyframes fadeInLeft {
  from {
    opacity: 0;
    transform: translateX(-8px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

/* 数据表单美化 */
.data-form {
  padding: 4px;
}

.data-form .el-form-item {
  margin-bottom: 18px;
  animation: formItemEnter 0.4s cubic-bezier(0.4, 0, 0.2, 1) both;
}

.data-form .el-form-item:nth-child(1) { animation-delay: 0.05s; }
.data-form .el-form-item:nth-child(2) { animation-delay: 0.10s; }
.data-form .el-form-item:nth-child(3) { animation-delay: 0.15s; }
.data-form .el-form-item:nth-child(4) { animation-delay: 0.20s; }
.data-form .el-form-item:nth-child(5) { animation-delay: 0.25s; }
.data-form .el-form-item:nth-child(6) { animation-delay: 0.30s; }
.data-form .el-form-item:nth-child(7) { animation-delay: 0.35s; }
.data-form .el-form-item:nth-child(8) { animation-delay: 0.40s; }
.data-form .el-form-item:nth-child(9) { animation-delay: 0.45s; }
.data-form .el-form-item:nth-child(10) { animation-delay: 0.50s; }

.data-form .el-form-item__label {
  font-weight: 600;
  color: var(--el-text-color-primary);
}

/* 设备信息对话框中的表格增强 */
:deep(.glass-dialog.device-info-dialog .el-table) {
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
  animation: fadeInUp 0.5s ease both;
}

:deep(.glass-dialog.device-info-dialog .el-table__header-wrapper th) {
  background: linear-gradient(180deg, var(--el-fill-color-light) 0%, var(--el-fill-color) 100%) !important;
  font-weight: 600;
  color: var(--el-text-color-primary);
  padding: 14px 0;
  font-size: 13px;
  letter-spacing: 0.3px;
}

:deep(.glass-dialog.device-info-dialog .el-table__body-wrapper tr) {
  transition: all 0.25s ease;
}

:deep(.glass-dialog.device-info-dialog .el-table__body-wrapper tr:hover) {
  background-color: var(--el-color-primary-light-9) !important;
  transform: scale(1.002);
}

:deep(.glass-dialog.device-info-dialog .el-table__body-wrapper td) {
  padding: 12px 0;
  transition: all 0.2s ease;
}

/* 描述列表增强 */
:deep(.glass-dialog.device-info-dialog .el-descriptions) {
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
  animation: fadeInUp 0.5s ease both;
}

:deep(.glass-dialog.device-info-dialog .el-descriptions__label) {
  background: linear-gradient(180deg, var(--el-fill-color-lighter) 0%, var(--el-fill-color) 100%);
  font-weight: 600;
  color: var(--el-text-color-primary);
  padding: 14px 16px;
  transition: all 0.3s ease;
}

:deep(.glass-dialog.device-info-dialog .el-descriptions__body .el-descriptions__cell) {
  padding: 14px 16px;
  transition: all 0.2s ease;
}

:deep(.glass-dialog.device-info-dialog .el-descriptions__row:hover .el-descriptions__cell) {
  background-color: var(--el-color-primary-light-9);
}

/* 折叠面板增强 */
:deep(.glass-dialog.device-info-dialog .el-collapse) {
  border: none;
  animation: fadeInUp 0.5s ease both;
}

:deep(.glass-dialog.device-info-dialog .el-collapse-item) {
  border: 1px solid var(--el-border-color-lighter);
  border-radius: 12px;
  margin-bottom: 12px;
  overflow: hidden;
  transition: all 0.3s ease;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
}

:deep(.glass-dialog.device-info-dialog .el-collapse-item:last-child) {
  margin-bottom: 0;
}

:deep(.glass-dialog.device-info-dialog .el-collapse-item:hover) {
  border-color: var(--el-color-primary-light-5);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  transform: translateY(-1px);
}

:deep(.glass-dialog.device-info-dialog .el-collapse-item__header) {
  padding: 14px 18px;
  background: linear-gradient(180deg, var(--el-fill-color-lighter) 0%, var(--el-fill-color) 100%);
  font-weight: 600;
  font-size: 14px;
  transition: all 0.3s ease;
}

:deep(.glass-dialog.device-info-dialog .el-collapse-item__wrap) {
  background: var(--el-bg-color);
  border: none;
}

:deep(.glass-dialog.device-info-dialog .el-collapse-item__content) {
  padding: 18px;
}

/* 输入框增强 */
:deep(.glass-dialog.device-info-dialog .el-input__wrapper) {
  border-radius: 10px;
  transition: all 0.3s ease;
}

:deep(.glass-dialog.device-info-dialog .el-input__wrapper.is-focus) {
  box-shadow: 0 0 0 1px var(--el-color-primary) inset, 0 0 10px rgba(var(--el-color-primary-rgb), 0.12);
}

/* 标签增强 */
:deep(.glass-dialog.device-info-dialog .el-tag) {
  border-radius: 8px;
  padding: 6px 12px;
  font-weight: 500;
  font-size: 13px;
  transition: all 0.3s ease;
}

:deep(.glass-dialog.device-info-dialog .el-tag:hover) {
  transform: translateY(-1px);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);
}

/* 进度条增强 */
:deep(.glass-dialog.device-info-dialog .el-progress-bar__outer) {
  border-radius: 10px;
  background: var(--el-fill-color-lighter);
}

:deep(.glass-dialog.device-info-dialog .el-progress-bar__inner) {
  border-radius: 10px;
  transition: width 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

/* 空状态增强 - 高级设计 */
:deep(.glass-dialog.device-info-dialog .el-empty) {
  padding: 60px 0 50px;
  animation: emptyAppear 0.6s cubic-bezier(0.4, 0, 0.2, 1) both;
  position: relative;
  overflow: hidden;
}

@keyframes emptyAppear {
  from {
    opacity: 0;
    transform: translateY(20px) scale(0.96);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

/* 背景装饰圆 */
:deep(.glass-dialog.device-info-dialog .el-empty::before) {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -55%);
  width: 140px;
  height: 140px;
  background: radial-gradient(circle, var(--el-color-primary-light-8) 0%, transparent 70%);
  border-radius: 50%;
  opacity: 0.5;
  animation: emptyAura 4s ease-in-out infinite;
  pointer-events: none;
  z-index: 0;
}

:deep(.glass-dialog.device-info-dialog .el-empty::after) {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -55%);
  width: 200px;
  height: 200px;
  background: radial-gradient(circle, var(--el-color-primary-light-9) 0%, transparent 60%);
  border-radius: 50%;
  opacity: 0.3;
  animation: emptyAura 4s ease-in-out infinite 1s;
  pointer-events: none;
  z-index: 0;
}

@keyframes emptyAura {
  0%, 100% {
    transform: translate(-50%, -55%) scale(1);
    opacity: 0.5;
  }
  50% {
    transform: translate(-50%, -55%) scale(1.3);
    opacity: 0.2;
  }
}

/* 图标增强 */
:deep(.glass-dialog.device-info-dialog .el-empty__image) {
  position: relative;
  z-index: 1;
  filter: drop-shadow(0 6px 16px rgba(var(--el-color-primary-rgb), 0.2));
  animation: emptyFloat 3s ease-in-out infinite;
}

/* 给SVG图标上色 */
:deep(.glass-dialog.device-info-dialog .el-empty__image svg) {
  fill: url(#emptyGradient) !important;
}

:deep(.glass-dialog.device-info-dialog .el-empty__image svg path) {
  fill: var(--el-color-primary-light-3) !important;
  opacity: 0.7;
}

@keyframes emptyFloat {
  0%, 100% {
    transform: translateY(0) rotate(0deg);
  }
  33% {
    transform: translateY(-10px) rotate(1deg);
  }
  66% {
    transform: translateY(-4px) rotate(-1deg);
  }
}

/* 文字增强 */
:deep(.glass-dialog.device-info-dialog .el-empty__description) {
  position: relative;
  z-index: 1;
  margin-top: 24px;
  font-size: 15px;
  font-weight: 500;
  color: var(--el-text-color-secondary);
  letter-spacing: 0.8px;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);
}

/* 底部装饰点 */
:deep(.glass-dialog.device-info-dialog .el-empty__description::after) {
  content: '';
  display: block;
  width: 24px;
  height: 3px;
  background: linear-gradient(90deg, transparent, var(--el-color-primary-light-5), transparent);
  border-radius: 2px;
  margin: 16px auto 0;
  animation: emptyLine 2s ease-in-out infinite;
}

@keyframes emptyLine {
  0%, 100% {
    opacity: 0.4;
    transform: scaleX(1);
  }
  50% {
    opacity: 0.8;
    transform: scaleX(1.3);
  }
}

/* 警告提示增强 */
:deep(.glass-dialog.device-info-dialog .el-alert) {
  border-radius: 12px;
  animation: shakeIn 0.5s cubic-bezier(0.4, 0, 0.2, 1) both;
}

@keyframes shakeIn {
  from {
    opacity: 0;
    transform: translateX(-10px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

/* 深色模式适配 */
html.dark {
  .info-card {
    background: rgba(255, 255, 255, 0.04);
    border-color: rgba(255, 255, 255, 0.06);
  }

  .info-card:hover {
    background: rgba(255, 255, 255, 0.06);
    box-shadow: 0 12px 28px rgba(0, 0, 0, 0.25);
  }

  .dashboard-badge {
    background: rgba(255, 255, 255, 0.04);
    border-color: rgba(255, 255, 255, 0.06);
  }

  .dashboard-badge:hover {
    background: rgba(var(--el-color-primary-rgb), 0.12);
  }

  .panel-header {
    border-bottom-color: rgba(255, 255, 255, 0.06);
  }

  .panel-section-title::before {
    background: linear-gradient(180deg, var(--el-color-primary-light-3), var(--el-color-primary-light-5));
  }

  :deep(.glass-dialog.device-info-dialog .el-descriptions__label) {
    background: linear-gradient(180deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.02) 100%);
  }

  :deep(.glass-dialog.device-info-dialog .el-collapse-item__header) {
    background: linear-gradient(180deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.02) 100%);
  }

  :deep(.glass-dialog.device-info-dialog .el-table__header-wrapper th) {
    background: linear-gradient(180deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.02) 100%) !important;
  }
}

/* === GB28181设备刷新进度对话框 - 居中版本 === */
:deep(.refresh-progress-dialog .el-dialog__body) {
  padding: 0;
}

.refresh-progress-center {
  padding: 36px 24px 28px;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: #fff;
  border-radius: 12px;
}

.refresh-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 28px;
}

.refresh-icon-wrapper {
  width: 42px;
  height: 42px;
  border-radius: 10px;
  background: var(--el-color-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(var(--el-color-primary-rgb), 0.25);
}

.refresh-icon {
  color: #fff;
  font-size: 22px;
}

.refresh-icon.spinning {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.refresh-title {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #303133;
}

.progress-circle-wrapper {
  position: relative;
  margin-bottom: 28px;
}

.progress-circle-wrapper :deep(.el-progress-circle__path) {
  transition: stroke-dashoffset 0.3s ease;
}

.progress-percent {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  align-items: baseline;
  gap: 2px;
}

.percent-num {
  font-size: 36px;
  font-weight: 700;
  line-height: 1;
  color: var(--el-color-primary);
}

.percent-unit {
  font-size: 18px;
  font-weight: 600;
  color: #909399;
}

.refresh-steps {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-bottom: 20px;
  width: 100%;
}

.step-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  opacity: 0.4;
  transition: all 0.3s ease;
}

.step-item.active {
  opacity: 1;
}

.step-item.completed {
  opacity: 1;
}

.step-icon {
  font-size: 20px;
  color: #c0c4cc;
  transition: all 0.3s ease;
}

.step-item.active .step-icon,
.step-item.completed .step-icon {
  color: var(--el-color-primary);
}

.step-item.completed .step-icon {
  color: #67c23a;
}

.step-text {
  font-size: 12px;
  color: #909399;
  font-weight: 500;
  white-space: nowrap;
}

.step-item.active .step-text,
.step-item.completed .step-text {
  color: #606266;
}

.step-divider {
  width: 32px;
  height: 2px;
  background: #e4e7ed;
  border-radius: 1px;
  transition: all 0.3s ease;
}

.refresh-tip {
  text-align: center;
  padding-top: 4px;
}

.tip-content {
  margin: 0;
  font-size: 13px;
  color: #909399;
  font-weight: 400;
}

/* 设备配置对话框样式 */
.device-config-dialog {
  :deep(.el-dialog__body) {
    padding: 20px 24px;
  }
}

.device-config-header {
  margin-bottom: 20px;
}

.device-info-row {
  display: flex;
  flex-wrap: wrap;
  gap: 16px 24px;
}

.device-info-item {
  font-size: 14px;
  color: var(--el-text-color-regular);
}

.query-form {
  position: relative;
  margin-bottom: 0;
  padding: 14px 20px 14px 18px !important;
  background: var(--el-bg-color) !important;
  border-radius: 10px !important;
  border: 1px solid var(--el-border-color-lighter) !important;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06) !important;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 12px;
    bottom: 12px;
    width: 3px;
    background: linear-gradient(to bottom, var(--el-color-primary), var(--el-color-primary-light-5));
    border-radius: 0 3px 3px 0;
  }

  :deep(.el-form-item) {
    margin-bottom: 0;
  }

  :deep(.el-form-item__label) {
    font-weight: 500;
    color: var(--el-text-color-primary);
    padding-right: 10px;
  }

  .query-actions {
    display: flex;
    align-items: center;
    gap: 8px;
    width: 100%;
  }

  :deep(.el-button--primary) {
    height: 34px;
    padding: 0 18px;
    font-size: 13px;
    font-weight: 500;
    border-radius: 6px;
    transition: all 0.25s ease;
    flex-shrink: 0;

    &:not(:disabled):hover {
      transform: translateY(-1px);
      box-shadow: 0 6px 16px rgba(64, 158, 255, 0.4);
    }

    &:not(:disabled):active {
      transform: translateY(0);
    }

    .el-icon {
      font-size: 14px;
      margin-right: 4px;
    }
  }

  :deep(.el-button.is-link) {
    height: 34px;
    padding: 0 8px;
    font-size: 13px;
    font-weight: 400;
    flex-shrink: 0;

    &:not(.is-disabled):hover {
      color: var(--el-color-danger);
    }
  }

  :deep(.el-select) {
    width: 100%;

    .el-input__wrapper {
      height: 34px;
      border-radius: 6px;
      box-shadow: 0 0 0 1px var(--el-border-color) inset;
      transition: all 0.2s ease;

      &:hover {
        box-shadow: 0 0 0 1px var(--el-border-color-hover) inset;
      }

      &.is-focus {
        box-shadow: 0 0 0 1px var(--el-color-primary) inset !important;
      }
    }

    .el-input__inner {
      font-size: 13px;
    }
  }
}

.config-content {
  max-height: 520px;
  overflow-y: auto;
  padding: 4px;
  background: var(--el-fill-color-lighter);
  border-radius: 8px;
}

.config-collapse {
  :deep(.el-collapse-item__header) {
    background: var(--el-bg-color);
    border-radius: 6px;
    margin-bottom: 8px;
    padding-left: 16px;
    padding-right: 16px;
    border: 1px solid var(--el-border-color-lighter);
    transition: all 0.3s ease;

    &:hover {
      background: var(--el-fill-color-light);
      border-color: var(--el-border-color);
    }
  }

  :deep(.el-collapse-item__wrap) {
    border: none;
    border-radius: 6px;
    margin-bottom: 8px;
    background: transparent;
  }

  :deep(.el-collapse-item__content) {
    padding: 0;
  }
}

.collapse-title {
  display: flex;
  align-items: center;
  width: 100%;
}

.title-icon {
  color: var(--el-color-primary);
  font-size: 18px;
  margin-right: 8px;
}

.title-text {
  font-size: 15px;
  font-weight: 600;
  color: var(--el-text-color-primary);
}

.config-card {
  background: var(--el-bg-color);
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 8px;
  border: 1px solid var(--el-border-color-lighter);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.config-form {
  margin-bottom: 16px;
}

.config-actions {
  display: flex;
  justify-content: flex-end;
  padding-top: 12px;
  border-top: 1px solid var(--el-border-color-lighter);
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

/* 滚动条美化 */
.config-content::-webkit-scrollbar {
  width: 6px;
}

.config-content::-webkit-scrollbar-track {
  background: var(--el-fill-color-lighter);
  border-radius: 3px;
}

.config-content::-webkit-scrollbar-thumb {
  background: var(--el-border-color);
  border-radius: 3px;

  &:hover {
    background: var(--el-text-color-secondary);
  }
}

/* 抓图记录操作按钮样式 */
.snapshot-actions .el-button {
  transition: all 0.2s ease;
}

.snapshot-actions .el-button:hover {
  transform: scale(1.08);
}

/* 强制保持白色图标 */
.snapshot-actions .el-button .el-icon {
  color: #ffffff !important;
}

.snapshot-actions .el-button--success,
.snapshot-actions .el-button--success[text],
.snapshot-actions .el-button--success[text][bg] {
  color: #ffffff !important;
  background-color: var(--el-color-success) !important;
  border-color: var(--el-color-success) !important;
}

/* ========== 存储状态卡片样式 ========== */
.storage-state-card {
  background: linear-gradient(135deg, #f5f7fa 0%, #fff 100%);
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 16px;
  border: 1px solid var(--el-border-color-lighter);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  transition: all 0.3s ease;

  &:last-child {
    margin-bottom: 0;
  }

  &:hover {
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
    transform: translateY(-2px);
  }
}

.storage-state-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.storage-state-name {
  font-size: 16px;
  font-weight: 600;
  color: var(--el-text-color-primary);
}

.storage-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-bottom: 20px;
}

.stat-item {
  text-align: center;
  padding: 12px;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 8px;
}

.stat-label {
  display: block;
  font-size: 13px;
  color: var(--el-text-color-secondary);
  margin-bottom: 6px;
}

.stat-value {
  display: block;
  font-size: 18px;
  font-weight: 600;
  color: var(--el-color-primary);
}

.storage-progress {
  margin-bottom: 12px;
}

.storage-updated {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: var(--el-text-color-secondary);
  padding-top: 12px;
  border-top: 1px dashed var(--el-border-color-lighter);
}

/* ========== 网络协议卡片样式 ========== */
.protocol-cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
}

.protocol-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px;
  background: linear-gradient(135deg, #f5f7fa 0%, #fff 100%);
  border-radius: 12px;
  border: 1px solid var(--el-border-color-lighter);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
    transform: translateY(-2px);
  }
}

.protocol-icon {
  width: 56px;
  height: 56px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  flex-shrink: 0;

  &.http {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  }

  &.https {
    background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  }

  &.rtsp {
    background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  }
}

.protocol-info {
  flex: 1;
  min-width: 0;
}

.protocol-name {
  font-size: 18px;
  font-weight: 600;
  color: var(--el-text-color-primary);
  margin-bottom: 10px;
}

.protocol-details {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: center;
}

.detail-item {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 14px;
  color: var(--el-text-color-secondary);

  .el-icon {
    font-size: 14px;
  }
}

.snapshot-actions .el-button--danger,
.snapshot-actions .el-button--danger[text],
.snapshot-actions .el-button--danger[text][bg] {
  color: #ffffff !important;
  background-color: var(--el-color-danger) !important;
  border-color: var(--el-color-danger) !important;
}
</style>