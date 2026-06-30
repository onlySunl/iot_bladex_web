<template>
  <el-form ref="formRef" :model="formData" :rules="rules" label-width="100px" :disabled="disabled">
    <el-row :gutter="20">
      <el-col :span="12">
        <el-form-item label="产品名称" prop="productName">
          <el-input v-model="formData.productName" placeholder="请输入产品名称" :disabled="disabled" />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="产品类型" prop="productType">
          <el-select v-model="formData.productType" placeholder="请选择产品类型" :disabled="disabled" style="width: 100%">
            <el-option v-for="item in productTypeOptions" :key="item.dictKey" :label="item.dictValue" :value="Number(item.dictKey)" />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="协议ID" prop="protocolId">
          <el-input v-model="formData.protocolId" placeholder="请输入协议ID" :disabled="disabled" />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="协议名称" prop="protocolName">
          <el-input v-model="formData.protocolName" placeholder="请输入协议名称" :disabled="disabled" />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="传输方式" prop="transport">
          <el-select v-model="formData.transport" placeholder="请选择传输方式" :disabled="disabled" style="width: 100%">
            <el-option v-for="item in transportOptions" :key="item.dictKey" :label="item.dictValue" :value="Number(item.dictKey)" />
          </el-select>
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
  name: 'ProductForm',
  props: {
    formData: { type: Object, default: function() { return {} } },
    type: { type: String, default: 'add' },
    disabled: { type: Boolean, default: false }
  },
  data() {
    return {
      rules: {
        productName: [{ required: true, message: '请输入产品名称', trigger: 'blur' }],
        productType: [{ required: true, message: '请选择产品类型', trigger: 'change' }],
        protocolId: [{ required: true, message: '请输入协议ID', trigger: 'blur' }],
        transport: [{ required: true, message: '请选择传输方式', trigger: 'change' }]
      },
      productTypeOptions: [],
      transportOptions: []
    }
  },
  mounted() {
    this.fetchDict('/api/blade-system/dict/dictionary?code=iot_product_type', 'productTypeOptions')
    this.fetchDict('/api/blade-system/dict/dictionary?code=iot_connect_status', 'transportOptions')
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
