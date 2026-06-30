<template>
  <el-form ref="formRef" :model="formData" :rules="rules" label-width="100px" :disabled="disabled">
    <el-row :gutter="20">
      <el-col :span="12">
        <el-form-item label="设备名称" prop="deviceName">
          <el-input v-model="formData.deviceName" placeholder="请输入设备名称" :disabled="disabled" />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="设备类型" prop="deviceType">
          <el-select v-model="formData.deviceType" placeholder="请选择设备类型" :disabled="disabled" style="width: 100%">
            <el-option v-for="item in deviceTypeOptions" :key="item.dictKey" :label="item.dictValue" :value="Number(item.dictKey)" />
          </el-select>
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
        <el-form-item label="设备编号" prop="deviceCode">
          <el-input v-model="formData.deviceCode" placeholder="请输入设备编号" :disabled="disabled" />
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
  name: 'DeviceForm',
  props: {
    formData: { type: Object, default: function() { return {} } },
    type: { type: String, default: 'add' },
    disabled: { type: Boolean, default: false }
  },
  data() {
    return {
      rules: {
        deviceName: [{ required: true, message: '请输入设备名称', trigger: 'blur' }],
        deviceType: [{ required: true, message: '请选择设备类型', trigger: 'change' }],
        productId: [{ required: true, message: '请输入产品ID', trigger: 'blur' }]
      },
      deviceTypeOptions: []
    }
  },
  mounted() {
    this.fetchDict('/api/blade-system/dict/dictionary?code=iot_product_type', 'deviceTypeOptions')
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
