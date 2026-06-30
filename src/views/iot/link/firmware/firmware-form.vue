<template>
  <el-form ref="formRef" :model="formData" :rules="rules" label-width="100px" :disabled="disabled">
    <el-row :gutter="20">
      <el-col :span="12">
        <el-form-item label="固件名称" prop="firmwareName">
          <el-input v-model="formData.firmwareName" placeholder="请输入固件名称" :disabled="disabled" />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="固件版本" prop="firmwareVersion">
          <el-input v-model="formData.firmwareVersion" placeholder="请输入固件版本" :disabled="disabled" />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="产品ID" prop="productId">
          <el-input v-model="formData.productId" placeholder="请输入产品ID" :disabled="disabled" />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="产品名称" prop="productName">
          <el-input v-model="formData.productName" placeholder="请输入产品名称" :disabled="disabled" />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="固件地址" prop="firmwareUrl">
          <el-input v-model="formData.firmwareUrl" placeholder="请输入固件地址" :disabled="disabled" />
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
  name: 'FirmwareForm',
  props: {
    formData: { type: Object, default: function() { return {} } },
    type: { type: String, default: 'add' },
    disabled: { type: Boolean, default: false }
  },
  data() {
    return {
      rules: {
        firmwareName: [{ required: true, message: '请输入固件名称', trigger: 'blur' }],
        firmwareVersion: [{ required: true, message: '请输入固件版本', trigger: 'blur' }],
        productId: [{ required: true, message: '请输入产品ID', trigger: 'blur' }],
        firmwareUrl: [{ required: true, message: '请输入固件地址', trigger: 'blur' }]
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
