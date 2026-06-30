<template>
  <el-form ref="formRef" :model="formData" :rules="rules" label-width="100px" :disabled="disabled">
    <el-row :gutter="20">
      <el-col :span="12">
        <el-form-item label="配置名称" prop="configName">
          <el-input v-model="formData.configName" placeholder="请输入配置名称" :disabled="disabled" />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="通信类型" prop="communicationType">
          <el-select v-model="formData.communicationType" placeholder="请选择通信类型" :disabled="disabled" style="width: 100%">
            <el-option v-for="item in communicationTypeOptions" :key="item.dictKey" :label="item.dictValue" :value="Number(item.dictKey)" />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="主机" prop="host">
          <el-input v-model="formData.host" placeholder="请输入主机" :disabled="disabled" />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="端口" prop="port">
          <el-input-number v-model="formData.port" :disabled="disabled" style="width: 100%" />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="波特率" prop="baudRate">
          <el-input-number v-model="formData.baudRate" :disabled="disabled" style="width: 100%" />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="数据位" prop="dataBits">
          <el-input-number v-model="formData.dataBits" :disabled="disabled" style="width: 100%" />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="停止位" prop="stopBits">
          <el-input-number v-model="formData.stopBits" :disabled="disabled" style="width: 100%" />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="校验位" prop="parity">
          <el-input v-model="formData.parity" placeholder="请输入校验位" :disabled="disabled" />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="是否启用" prop="isEnabled">
          <el-switch v-model="formData.isEnabled" :active-value="1" :inactive-value="0" :disabled="disabled" />
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>

<script>
export default {
  name: 'ModbusConfigForm',
  props: {
    formData: { type: Object, default: function() { return {} } },
    type: { type: String, default: 'add' },
    disabled: { type: Boolean, default: false }
  },
  data() {
    return {
      rules: {
        configName: [{ required: true, message: '请输入配置名称', trigger: 'blur' }],
        communicationType: [{ required: true, message: '请选择通信类型', trigger: 'change' }],
        host: [{ required: true, message: '请输入主机', trigger: 'blur' }],
        port: [{ required: true, message: '请输入端口', trigger: 'blur' }]
      },
      communicationTypeOptions: []
    }
  },
  mounted() {
    this.fetchDict('/api/blade-system/dict/dictionary?code=iot_connect_status', 'communicationTypeOptions')
  },
  methods: {
    validate() {
      return this.$refs.formRef.validate()
    },
    getFormData() {
      return { ...this.formData }
    },
    fetchDict(url, key) {
      this.$http.get(url).then(res => {
        this[key] = res.data.data || []
      }).catch(() => {
        this[key] = []
      })
    }
  }
}
</script>
