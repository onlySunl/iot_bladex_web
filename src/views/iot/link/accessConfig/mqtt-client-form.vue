<template>
  <el-form ref="formRef" :model="formData" :rules="rules" label-width="100px" :disabled="disabled">
    <el-row :gutter="20">
      <el-col :span="12">
        <el-form-item label="客户端名称" prop="clientName">
          <el-input v-model="formData.clientName" placeholder="请输入客户端名称" :disabled="disabled" />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="Broker地址" prop="brokerUrl">
          <el-input v-model="formData.brokerUrl" placeholder="请输入Broker地址" :disabled="disabled" />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="ClientId" prop="clientId">
          <el-input v-model="formData.clientId" placeholder="请输入ClientId" :disabled="disabled" />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="formData.username" placeholder="请输入用户名" :disabled="disabled" />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="密码" prop="password">
          <el-input v-model="formData.password" type="password" placeholder="请输入密码" :disabled="disabled" show-password />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="订阅Topic" prop="topic">
          <el-input v-model="formData.topic" placeholder="请输入订阅Topic" :disabled="disabled" />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="QoS" prop="qos">
          <el-input-number v-model="formData.qos" :disabled="disabled" style="width: 100%" />
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
  name: 'MqttClientForm',
  props: {
    formData: { type: Object, default: function() { return {} } },
    type: { type: String, default: 'add' },
    disabled: { type: Boolean, default: false }
  },
  data() {
    return {
      rules: {
        clientName: [{ required: true, message: '请输入客户端名称', trigger: 'blur' }],
        brokerUrl: [{ required: true, message: '请输入Broker地址', trigger: 'blur' }],
        clientId: [{ required: true, message: '请输入ClientId', trigger: 'blur' }],
        topic: [{ required: true, message: '请输入订阅Topic', trigger: 'blur' }]
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
