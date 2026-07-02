<template>
  <el-dialog
      :title="isEdit ? '编辑NVR设备' : '新增NVR设备'"
      v-model="visible"
      width="600px"
      @close="handleClose"
  >
    <el-form ref="formRef" :model="form" label-width="100px" :rules="deviceFormRules">
      <el-form-item label="所属区域" prop="regionId">
        <el-select v-model="form.regionId" placeholder="请选择区域">
          <el-option v-for="item in regionList" :key="item.id" :label="item.regionName" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="设备名称" prop="deviceName">
        <el-input v-model="form.deviceName"></el-input>
      </el-form-item>
      <el-form-item label="设备IP" prop="ip">
        <el-input v-model="form.ip"></el-input>
      </el-form-item>
      <el-form-item label="端口" prop="port">
        <el-input-number v-model="form.port" :min="1" :max="65535"></el-input-number>
      </el-form-item>
      <el-form-item label="登录账号" prop="username">
        <el-input v-model="form.username"></el-input>
      </el-form-item>
      <el-form-item label="登录密码" prop="password">
        <el-input v-model="form.password" show-password></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="handleClose">取消</el-button>
      <el-button type="primary" @click="handleSubmit">确定</el-button>
    </template>
  </el-dialog>
</template>

<script>
import { deviceFormRules } from '../js/deviceRules'
export default {
  name: 'DeviceOperate',
  props: {
    visible: Boolean,
    form: Object,
    isEdit: Boolean,
    regionList: Array
  },
  data() {
    return {
      formRef: null,
      deviceFormRules
    }
  },
  computed: {
    dialogVisible: {
      get() { return this.visible },
      set(val) { this.$emit('update:visible', val) }
    }
  },
  methods: {
    handleClose() {
      this.formRef?.clearValidate()
      this.$emit('update:visible', false)
    },
    handleSubmit() {
      this.formRef.validate(valid => {
        if (valid) this.$emit('submit')
      })
    }
  }
}
</script>

<style scoped></style>