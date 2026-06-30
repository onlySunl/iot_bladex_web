<template>
  <el-form ref="formRef" :model="formData" :rules="rules" label-width="100px" :disabled="disabled">
    <el-row :gutter="20">
      <el-col :span="12">
        <el-form-item label="数据源名称" prop="sourceName">
          <el-input v-model="formData.sourceName" placeholder="请输入数据源名称" :disabled="disabled" />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="数据源类型" prop="sourceType">
          <el-select v-model="formData.sourceType" placeholder="请选择数据源类型" :disabled="disabled" style="width: 100%">
            <el-option v-for="item in sourceTypeOptions" :key="item.dictKey" :label="item.dictValue" :value="Number(item.dictKey)" />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="JDBC地址" prop="jdbcUrl">
          <el-input v-model="formData.jdbcUrl" placeholder="请输入JDBC地址" :disabled="disabled" />
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
        <el-form-item label="驱动类" prop="driverClassName">
          <el-input v-model="formData.driverClassName" placeholder="请输入驱动类" :disabled="disabled" />
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
  name: 'DataSourceForm',
  props: {
    formData: { type: Object, default: function() { return {} } },
    type: { type: String, default: 'add' },
    disabled: { type: Boolean, default: false }
  },
  data() {
    return {
      rules: {
        sourceName: [{ required: true, message: '请输入数据源名称', trigger: 'blur' }],
        sourceType: [{ required: true, message: '请选择数据源类型', trigger: 'change' }],
        jdbcUrl: [{ required: true, message: '请输入JDBC地址', trigger: 'blur' }],
        username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
        driverClassName: [{ required: true, message: '请输入驱动类', trigger: 'blur' }]
      },
      sourceTypeOptions: []
    }
  },
  mounted() {
    this.fetchDict('/api/blade-system/dict/dictionary?code=iot_product_type', 'sourceTypeOptions')
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
