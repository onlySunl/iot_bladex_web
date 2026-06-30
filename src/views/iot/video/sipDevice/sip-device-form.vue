<template>
  <el-form ref="formRef" :model="formData" :rules="rules" label-width="100px" :disabled="disabled">
    <el-row :gutter="20">
      <el-col :span="12">
        <el-form-item label="设备名称" prop="deviceName">
          <el-input v-model="formData.deviceName" placeholder="请输入设备名称" :disabled="disabled" />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="设备ID" prop="deviceId">
          <el-input v-model="formData.deviceId" placeholder="请输入设备ID" :disabled="disabled" />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="SIP服务ID" prop="sipServerId">
          <el-input v-model="formData.sipServerId" placeholder="请输入SIP服务ID" :disabled="disabled" />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="厂商" prop="manufacturer">
          <el-input v-model="formData.manufacturer" placeholder="请输入厂商" :disabled="disabled" />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="型号" prop="model">
          <el-input v-model="formData.model" placeholder="请输入型号" :disabled="disabled" />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="固件版本" prop="firmware">
          <el-input v-model="formData.firmware" placeholder="请输入固件版本" :disabled="disabled" />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="传输协议" prop="transport">
          <el-input v-model="formData.transport" placeholder="请输入传输协议" :disabled="disabled" />
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>

<script>
export default {
  name: 'SipDeviceForm',
  props: {
    formData: { type: Object, default: function() { return {} } },
    type: { type: String, default: 'add' },
    disabled: { type: Boolean, default: false }
  },
  data() {
    return {
      rules: {
        deviceName: [{ required: true, message: '请输入设备名称', trigger: 'blur' }],
        deviceId: [{ required: true, message: '请输入设备ID', trigger: 'blur' }],
        sipServerId: [{ required: true, message: '请输入SIP服务ID', trigger: 'blur' }],
        transport: [{ required: true, message: '请输入传输协议', trigger: 'blur' }]
      }
    }
  },
  methods: {
    validate() {
      return this.$refs.formRef.validate()
    },
    getFormData() {
      return { ...this.formData }
    }
  }
}
</script>
