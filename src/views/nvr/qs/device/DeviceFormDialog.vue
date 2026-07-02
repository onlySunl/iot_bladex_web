<template>
  <el-dialog v-model="visible" :title="dialogTitle" width="600px" append-to-body @close="handleClose">
    <el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
      <el-form-item label="接入类型" prop="type">
        <el-select v-model="form.type" placeholder="请选择接入类型" @change="handleTypeChange" style="width: 100%">
          <el-option
            v-for="dict in liveStreamTypeDict"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>

      <!-- 通用字段 -->
      <el-form-item label="设备名称" prop="deviceName">
        <el-input v-model="form.deviceName" placeholder="请输入设备名称" />
      </el-form-item>

      <!-- GB28181 设备 -->
      <template v-if="isGb28181">
        <el-form-item label="国标设备" prop="gbDeviceId">
          <el-select v-model="form.gbDeviceId" placeholder="请选择国标设备" @change="handleGbDeviceChange" style="width: 100%">
            <el-option
              v-for="device in gb28181DeviceList"
              :key="device.deviceId"
              :label="device.name || device.deviceId"
              :value="device.deviceId"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="国标通道" prop="gbChannelId" v-if="gb28181ChannelList.length > 0">
          <el-select v-model="form.gbChannelId" placeholder="请选择国标通道" style="width: 100%">
            <el-option
              v-for="channel in gb28181ChannelList"
              :key="channel.channelId"
              :label="channel.name || channel.channelId"
              :value="channel.channelId"
            />
          </el-select>
        </el-form-item>
      </template>

      <!-- 海康 ISUP 设备 -->
      <template v-if="isHaiKangIsup">
        <el-form-item label="ISUP设备" prop="haikangIsupDeviceCode">
          <el-select v-model="form.haikangIsupDeviceCode" placeholder="请选择ISUP设备" @change="handleHaiKangIsupChange" style="width: 100%">
            <el-option
              v-for="device in haiKangIsupDeviceList"
              :key="device.deviceCode"
              :label="device.deviceName || device.deviceCode"
              :value="device.deviceCode"
            />
          </el-select>
        </el-form-item>
      </template>

      <!-- 大华设备 -->
      <template v-if="isDahua">
        <el-form-item label="大华设备" prop="dahuaDeviceCode">
          <el-select v-model="form.dahuaDeviceCode" placeholder="请选择大华设备" @change="handleDahuaChange" style="width: 100%">
            <el-option
              v-for="device in dahuaDeviceList"
              :key="device.deviceCode"
              :label="device.deviceName || device.deviceCode"
              :value="device.deviceCode"
            />
          </el-select>
        </el-form-item>
      </template>

      <!-- ONVIF 设备 -->
      <template v-if="isOnvif">
        <el-form-item label="ONVIF设备" prop="onvifDeviceCode">
          <el-select v-model="form.onvifDeviceCode" placeholder="请选择ONVIF设备" @change="handleOnvifChange" style="width: 100%">
            <el-option
              v-for="device in onvifDeviceList"
              :key="device.deviceCode"
              :label="device.deviceName || device.deviceCode"
              :value="device.deviceCode"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="认证登录" prop="onvifAuth">
          <el-radio-group v-model="form.onvifAuth">
            <el-radio label="1">需要认证</el-radio>
            <el-radio label="0">无需认证</el-radio>
          </el-radio-group>
        </el-form-item>
        <template v-if="form.onvifAuth === '1'">
          <el-form-item label="用户名" prop="userName">
            <el-input v-model="form.userName" placeholder="请输入用户名" />
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input v-model="form.password" type="password" placeholder="请输入密码" show-password />
          </el-form-item>
        </template>
      </template>

      <!-- JT1078 设备 -->
      <template v-if="isJt1078">
        <el-form-item label="手机号" prop="jtMobileNo">
          <el-input v-model="form.jtMobileNo" placeholder="请输入手机号" />
        </el-form-item>
        <el-form-item label="车牌号" prop="jtPlateNo">
          <el-input v-model="form.jtPlateNo" placeholder="请输入车牌号" />
        </el-form-item>
        <el-form-item label="车牌颜色" prop="jtPlateColor">
          <el-select v-model="form.jtPlateColor" placeholder="请选择车牌颜色" style="width: 100%">
            <el-option label="蓝色" value="1" />
            <el-option label="黄色" value="2" />
            <el-option label="黑色" value="3" />
            <el-option label="白色" value="4" />
            <el-option label="绿色" value="5" />
          </el-select>
        </el-form-item>
      </template>

      <!-- IP/端口（非GB28181） -->
      <template v-if="!isGb28181 && !isHaiKangIsup && !isDahua && !isOnvif && !isJt1078">
        <el-form-item label="IP地址" prop="ipAddress">
          <el-input v-model="form.ipAddress" placeholder="请输入IP地址" />
        </el-form-item>
        <el-form-item label="端口" prop="port">
          <el-input v-model="form.port" placeholder="请输入端口" />
        </el-form-item>
        <el-form-item label="用户名" prop="userName">
          <el-input v-model="form.userName" placeholder="请输入用户名" />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="form.password" type="password" placeholder="请输入密码" show-password />
        </el-form-item>
      </template>

      <el-form-item label="备注" prop="remark">
        <el-input v-model="form.remark" type="textarea" placeholder="请输入备注" />
      </el-form-item>
    </el-form>

    <template #footer>
      <div class="dialog-footer">
        <el-button type="primary" @click="handleSubmit">确 定</el-button>
        <el-button @click="handleClose">取 消</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts" name="DeviceFormDialog">
import { ref, computed, watch } from 'vue';
import type { FormInstance, FormRules } from 'element-plus';

interface QsDevice {
  id?: number;
  type?: string;
  deviceName?: string;
  gbDeviceId?: string;
  gbChannelId?: string;
  haikangIsupDeviceCode?: string;
  dahuaDeviceCode?: string;
  onvifDeviceCode?: string;
  onvifAuth?: string;
  userName?: string;
  password?: string;
  jtMobileNo?: string;
  jtPlateNo?: string;
  jtPlateColor?: string;
  ipAddress?: string;
  port?: string;
  remark?: string;
  [key: string]: any;
}

interface DictItem {
  label: string;
  value: string;
}

interface Gb28181Device {
  deviceId: string;
  name?: string;
}

interface Gb28181Channel {
  channelId: string;
  name?: string;
}

interface HaiKangIsupDevice {
  deviceCode: string;
  deviceName?: string;
}

interface DaHuaDevice {
  deviceCode: string;
  deviceName?: string;
}

interface OnvifDevice {
  deviceCode: string;
  deviceName?: string;
}

const props = defineProps<{
  modelValue: boolean;
  title: string;
  form: QsDevice;
  liveStreamTypeDict: DictItem[];
  gb28181DeviceList: Gb28181Device[];
  gb28181ChannelList: Gb28181Channel[];
  haiKangIsupDeviceList: HaiKangIsupDevice[];
  dahuaDeviceList: DaHuaDevice[];
  onvifDeviceList: OnvifDevice[];
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
  (e: 'submit', form: QsDevice): void;
  (e: 'type-change', type: string): void;
  (e: 'gb-device-change', deviceId: string): void;
  (e: 'haikang-isup-change', deviceCode: string): void;
  (e: 'dahua-change', deviceCode: string): void;
  (e: 'onvif-change', deviceCode: string): void;
}>();

const formRef = ref<FormInstance>();

const visible = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
});

const dialogTitle = computed(() => props.title);

// 判断接入类型
const isGb28181 = computed(() => ['1', '2'].includes(props.form.type || ''));
const isHaiKangIsup = computed(() => props.form.type === '8');
const isDahua = computed(() => props.form.type === '9');
const isOnvif = computed(() => props.form.type === '10');
const isJt1078 = computed(() => ['11', '12', '13', '14'].includes(props.form.type || ''));

// 表单验证规则
const rules = computed<FormRules>(() => ({
  type: [{ required: true, message: '请选择接入类型', trigger: 'change' }],
  deviceName: [{ required: true, message: '请输入设备名称', trigger: 'blur' }],
  gbDeviceId: isGb28181.value ? [{ required: true, message: '请选择国标设备', trigger: 'change' }] : [],
  ipAddress: !isGb28181.value && !isHaiKangIsup.value && !isDahua.value && !isOnvif.value && !isJt1078.value
    ? [{ required: true, message: '请输入IP地址', trigger: 'blur' }]
    : [],
  port: !isGb28181.value && !isHaiKangIsup.value && !isDahua.value && !isOnvif.value && !isJt1078.value
    ? [{ required: true, message: '请输入端口', trigger: 'blur' }]
    : []
}));

const handleTypeChange = (type: string) => {
  emit('type-change', type);
};

const handleGbDeviceChange = (deviceId: string) => {
  emit('gb-device-change', deviceId);
};

const handleHaiKangIsupChange = (deviceCode: string) => {
  emit('haikang-isup-change', deviceCode);
};

const handleDahuaChange = (deviceCode: string) => {
  emit('dahua-change', deviceCode);
};

const handleOnvifChange = (deviceCode: string) => {
  emit('onvif-change', deviceCode);
};

const handleSubmit = async () => {
  if (!formRef.value) return;
  
  await formRef.value.validate((valid) => {
    if (valid) {
      emit('submit', props.form);
    }
  });
};

const handleClose = () => {
  visible.value = false;
  formRef.value?.resetFields();
};

// 暴露方法
defineExpose({
  formRef,
  resetForm: () => formRef.value?.resetFields()
});
</script>

<style scoped lang="scss">
.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}
</style>
