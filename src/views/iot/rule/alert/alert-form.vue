<template>
  <el-form ref="formRef" :model="formData" :rules="rules" label-width="100px" :disabled="disabled">
    <el-row :gutter="20">
      <el-col :span="12">
        <el-form-item label="告警名称" prop="alertName">
          <el-input v-model="formData.alertName" placeholder="请输入告警名称" :disabled="disabled" />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="告警级别" prop="alertLevel">
          <el-select v-model="formData.alertLevel" placeholder="请选择告警级别" :disabled="disabled" style="width: 100%">
            <el-option v-for="item in alertLevelOptions" :key="item.dictKey" :label="item.dictValue" :value="Number(item.dictKey)" />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="告警类型" prop="alertType">
          <el-select v-model="formData.alertType" placeholder="请选择告警类型" :disabled="disabled" style="width: 100%">
            <el-option v-for="item in alertTypeOptions" :key="item.dictKey" :label="item.dictValue" :value="Number(item.dictKey)" />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="设备ID" prop="deviceId">
          <el-input v-model="formData.deviceId" placeholder="请输入设备ID" :disabled="disabled" />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="设备名称" prop="deviceName">
          <el-input v-model="formData.deviceName" placeholder="请输入设备名称" :disabled="disabled" />
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label="告警内容" prop="alertContent">
          <el-input v-model="formData.alertContent" type="textarea" :rows="4" placeholder="请输入告警内容" :disabled="disabled" />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="处理人" prop="handleUser">
          <el-input v-model="formData.handleUser" placeholder="请输入处理人" :disabled="disabled" />
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label="处理备注" prop="handleRemark">
          <el-input v-model="formData.handleRemark" type="textarea" :rows="4" placeholder="请输入处理备注" :disabled="disabled" />
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>

<script>
export default {
  name: 'AlertForm',
  props: {
    formData: { type: Object, default: function() { return {} } },
    type: { type: String, default: 'add' },
    disabled: { type: Boolean, default: false }
  },
  data() {
    return {
      rules: {
        alertName: [{ required: true, message: '请输入告警名称', trigger: 'blur' }],
        alertLevel: [{ required: true, message: '请选择告警级别', trigger: 'change' }],
        alertType: [{ required: true, message: '请选择告警类型', trigger: 'change' }],
        deviceId: [{ required: true, message: '请输入设备ID', trigger: 'blur' }],
        alertContent: [{ required: true, message: '请输入告警内容', trigger: 'blur' }]
      },
      alertLevelOptions: [],
      alertTypeOptions: []
    }
  },
  mounted() {
    this.fetchDict('/api/blade-system/dict/dictionary?code=iot_alert_level', 'alertLevelOptions')
    this.fetchDict('/api/blade-system/dict/dictionary?code=iot_alert_level', 'alertTypeOptions')
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
