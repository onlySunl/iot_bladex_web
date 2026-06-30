<template>
  <el-form ref="formRef" :model="formData" :rules="rules" label-width="100px" :disabled="disabled">
    <el-row :gutter="20">
      <el-col :span="12">
        <el-form-item label="网桥名称" prop="bridgeName">
          <el-input v-model="formData.bridgeName" placeholder="请输入网桥名称" :disabled="disabled" />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="网桥类型" prop="bridgeType">
          <el-select v-model="formData.bridgeType" placeholder="请选择网桥类型" :disabled="disabled" style="width: 100%">
            <el-option v-for="item in bridgeTypeOptions" :key="item.dictKey" :label="item.dictValue" :value="Number(item.dictKey)" />
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
        <el-form-item label="是否启用" prop="isEnabled">
          <el-switch v-model="formData.isEnabled" :active-value="1" :inactive-value="0" :disabled="disabled" />
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label="描述" prop="description">
          <el-input v-model="formData.description" type="textarea" :rows="4" placeholder="请输入描述" :disabled="disabled" />
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>

<script>
export default {
  name: 'BridgeForm',
  props: {
    formData: { type: Object, default: function() { return {} } },
    type: { type: String, default: 'add' },
    disabled: { type: Boolean, default: false }
  },
  data() {
    return {
      rules: {
        bridgeName: [{ required: true, message: '请输入网桥名称', trigger: 'blur' }],
        bridgeType: [{ required: true, message: '请选择网桥类型', trigger: 'change' }],
        host: [{ required: true, message: '请输入主机', trigger: 'blur' }],
        port: [{ required: true, message: '请输入端口', trigger: 'blur' }]
      },
      bridgeTypeOptions: []
    }
  },
  mounted() {
    this.fetchDict('/api/blade-system/dict/dictionary?code=iot_product_type', 'bridgeTypeOptions')
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
