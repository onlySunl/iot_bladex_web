<template>
  <el-form ref="formRef" :model="formData" :rules="rules" label-width="100px" :disabled="disabled">
    <el-row :gutter="20">
      <el-col :span="12">
        <el-form-item label="服务名称" prop="serverName">
          <el-input v-model="formData.serverName" placeholder="请输入服务名称" :disabled="disabled" />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="服务ID" prop="serverId">
          <el-input v-model="formData.serverId" placeholder="请输入服务ID" :disabled="disabled" />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="域" prop="domain">
          <el-input v-model="formData.domain" placeholder="请输入域" :disabled="disabled" />
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
        <el-form-item label="传输协议" prop="transport">
          <el-input v-model="formData.transport" placeholder="请输入传输协议" :disabled="disabled" />
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
  name: 'SipServerForm',
  props: {
    formData: { type: Object, default: function() { return {} } },
    type: { type: String, default: 'add' },
    disabled: { type: Boolean, default: false }
  },
  data() {
    return {
      rules: {
        serverName: [{ required: true, message: '请输入服务名称', trigger: 'blur' }],
        serverId: [{ required: true, message: '请输入服务ID', trigger: 'blur' }],
        domain: [{ required: true, message: '请输入域', trigger: 'blur' }],
        host: [{ required: true, message: '请输入主机', trigger: 'blur' }],
        port: [{ required: true, message: '请输入端口', trigger: 'blur' }],
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
