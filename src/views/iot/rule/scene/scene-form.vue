<template>
  <el-form ref="formRef" :model="formData" :rules="rules" label-width="100px" :disabled="disabled">
    <el-row :gutter="20">
      <el-col :span="12">
        <el-form-item label="场景名称" prop="sceneName">
          <el-input v-model="formData.sceneName" placeholder="请输入场景名称" :disabled="disabled" />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="场景类型" prop="sceneType">
          <el-select v-model="formData.sceneType" placeholder="请选择场景类型" :disabled="disabled" style="width: 100%">
            <el-option v-for="item in sceneTypeOptions" :key="item.dictKey" :label="item.dictValue" :value="Number(item.dictKey)" />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="触发类型" prop="triggerType">
          <el-select v-model="formData.triggerType" placeholder="请选择触发类型" :disabled="disabled" style="width: 100%">
            <el-option v-for="item in triggerTypeOptions" :key="item.dictKey" :label="item.dictValue" :value="Number(item.dictKey)" />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label="条件表达式" prop="conditionExpression">
          <el-input v-model="formData.conditionExpression" type="textarea" :rows="4" placeholder="请输入条件表达式" :disabled="disabled" />
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
  name: 'SceneForm',
  props: {
    formData: { type: Object, default: function() { return {} } },
    type: { type: String, default: 'add' },
    disabled: { type: Boolean, default: false }
  },
  data() {
    return {
      rules: {
        sceneName: [{ required: true, message: '请输入场景名称', trigger: 'blur' }],
        sceneType: [{ required: true, message: '请选择场景类型', trigger: 'change' }],
        triggerType: [{ required: true, message: '请选择触发类型', trigger: 'change' }]
      },
      sceneTypeOptions: [],
      triggerTypeOptions: []
    }
  },
  mounted() {
    this.fetchDict('/api/blade-system/dict/dictionary?code=iot_product_type', 'sceneTypeOptions')
    this.fetchDict('/api/blade-system/dict/dictionary?code=iot_task_status', 'triggerTypeOptions')
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
