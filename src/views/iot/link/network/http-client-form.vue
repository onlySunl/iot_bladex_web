<template>
  <el-form ref="formRef" :model="formData" :rules="rules" label-width="100px" :disabled="disabled">
    <el-row :gutter="20">
      <el-col :span="12">
        <el-form-item label="客户端名称" prop="clientName">
          <el-input v-model="formData.clientName" placeholder="请输入客户端名称" :disabled="disabled" />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="请求地址" prop="requestUrl">
          <el-input v-model="formData.requestUrl" placeholder="请输入请求地址" :disabled="disabled" />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="请求方法" prop="requestMethod">
          <el-select v-model="formData.requestMethod" placeholder="请选择请求方法" :disabled="disabled" style="width: 100%">
            <el-option v-for="item in requestMethodOptions" :key="item.dictKey" :label="item.dictValue" :value="Number(item.dictKey)" />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label="请求头" prop="headers">
          <el-input v-model="formData.headers" type="textarea" :rows="3" placeholder="请输入请求头" :disabled="disabled" />
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label="请求体" prop="body">
          <el-input v-model="formData.body" type="textarea" :rows="4" placeholder="请输入请求体" :disabled="disabled" />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="超时时间(ms)" prop="timeout">
          <el-input-number v-model="formData.timeout" :disabled="disabled" style="width: 100%" />
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
  name: 'HttpClientForm',
  props: {
    formData: { type: Object, default: function() { return {} } },
    type: { type: String, default: 'add' },
    disabled: { type: Boolean, default: false }
  },
  data() {
    return {
      rules: {
        clientName: [{ required: true, message: '请输入客户端名称', trigger: 'blur' }],
        requestUrl: [{ required: true, message: '请输入请求地址', trigger: 'blur' }],
        requestMethod: [{ required: true, message: '请选择请求方法', trigger: 'change' }]
      },
      requestMethodOptions: []
    }
  },
  mounted() {
    this.fetchDict('/api/blade-system/dict/dictionary?code=iot_config_type', 'requestMethodOptions')
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
