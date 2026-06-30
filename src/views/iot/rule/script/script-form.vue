<template>
  <el-form ref="formRef" :model="formData" :rules="rules" label-width="100px" :disabled="disabled">
    <el-row :gutter="20">
      <el-col :span="12">
        <el-form-item label="脚本名称" prop="scriptName">
          <el-input v-model="formData.scriptName" placeholder="请输入脚本名称" :disabled="disabled" />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="脚本类型" prop="scriptType">
          <el-select v-model="formData.scriptType" placeholder="请选择脚本类型" :disabled="disabled" style="width: 100%">
            <el-option v-for="item in scriptTypeOptions" :key="item.dictKey" :label="item.dictValue" :value="Number(item.dictKey)" />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="脚本语言" prop="scriptLanguage">
          <el-select v-model="formData.scriptLanguage" placeholder="请选择脚本语言" :disabled="disabled" style="width: 100%">
            <el-option v-for="item in scriptLanguageOptions" :key="item.dictKey" :label="item.dictValue" :value="Number(item.dictKey)" />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label="脚本内容" prop="scriptContent">
          <el-input v-model="formData.scriptContent" type="textarea" :rows="10" placeholder="请输入脚本内容" :disabled="disabled" />
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
  name: 'ScriptForm',
  props: {
    formData: { type: Object, default: function() { return {} } },
    type: { type: String, default: 'add' },
    disabled: { type: Boolean, default: false }
  },
  data() {
    return {
      rules: {
        scriptName: [{ required: true, message: '请输入脚本名称', trigger: 'blur' }],
        scriptType: [{ required: true, message: '请选择脚本类型', trigger: 'change' }],
        scriptLanguage: [{ required: true, message: '请选择脚本语言', trigger: 'change' }],
        scriptContent: [{ required: true, message: '请输入脚本内容', trigger: 'blur' }]
      },
      scriptTypeOptions: [],
      scriptLanguageOptions: []
    }
  },
  mounted() {
    this.fetchDict('/api/blade-system/dict/dictionary?code=iot_model_type', 'scriptTypeOptions')
    this.fetchDict('/api/blade-system/dict/dictionary?code=iot_config_type', 'scriptLanguageOptions')
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
