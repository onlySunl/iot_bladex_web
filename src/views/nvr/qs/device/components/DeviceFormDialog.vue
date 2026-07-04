<template>
  <el-dialog
    :title="isEdit ? '编辑设备' : '新增设备'"
    :visible.sync="dialogVisible"
    width="600px"
    @close="handleClose"
  >
    <el-form
      ref="formRef"
      :model="form"
      :rules="rules"
      label-width="100px"
    >
      <el-form-item label="设备名称" prop="deviceName">
        <el-input v-model="form.deviceName" placeholder="请输入设备名称" />
      </el-form-item>
      <el-form-item label="设备ID" prop="deviceId">
        <el-input v-model="form.deviceId" placeholder="请输入设备ID" :disabled="isEdit" />
      </el-form-item>
      <el-form-item label="协议" prop="protocol">
        <el-select v-model="form.protocol" placeholder="请选择协议" style="width: 100%">
          <el-option
            v-for="item in protocolDict"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="厂商" prop="vendor">
        <el-select v-model="form.vendor" placeholder="请选择厂商" style="width: 100%">
          <el-option
            v-for="item in vendorDict"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="IP地址" prop="ip">
        <el-input v-model="form.ip" placeholder="请输入IP地址" />
      </el-form-item>
      <el-form-item label="端口" prop="port">
        <el-input v-model="form.port" placeholder="请输入端口" />
      </el-form-item>
      <el-form-item label="分组" prop="groupId">
        <el-tree-select
          v-model="form.groupId"
          :data="groupList"
          placeholder="请选择分组"
          check-strictly
          :render-after-expand="false"
          style="width: 100%"
        />
      </el-form-item>
      <el-form-item label="媒体服务器" prop="mediaServerId">
        <el-select v-model="form.mediaServerId" placeholder="请选择媒体服务器" style="width: 100%">
          <el-option
            v-for="item in mediaServerList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button @click="dialogVisible = false">取消</el-button>
      <el-button type="primary" :loading="submitting" @click="handleSubmit">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: 'DeviceFormDialog',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    editData: {
      type: Object,
      default: null
    },
    protocolDict: {
      type: Array,
      default: () => []
    },
    vendorDict: {
      type: Array,
      default: () => []
    },
    groupList: {
      type: Array,
      default: () => []
    },
    mediaServerList: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      form: {
        deviceName: '',
        deviceId: '',
        protocol: '',
        vendor: '',
        ip: '',
        port: '',
        groupId: '',
        mediaServerId: ''
      },
      rules: {
        deviceName: [{ required: true, message: '请输入设备名称', trigger: 'blur' }],
        deviceId: [{ required: true, message: '请输入设备ID', trigger: 'blur' }],
        protocol: [{ required: true, message: '请选择协议', trigger: 'change' }],
        ip: [{ required: true, message: '请输入IP地址', trigger: 'blur' }],
        port: [{ required: true, message: '请输入端口', trigger: 'blur' }]
      },
      submitting: false
    };
  },
  computed: {
    dialogVisible: {
      get() {
        return this.visible;
      },
      set(val) {
        this.$emit('update:visible', val);
      }
    },
    isEdit() {
      return !!this.editData;
    }
  },
  watch: {
    editData: {
      handler(val) {
        if (val) {
          this.form = { ...val };
        } else {
          this.resetForm();
        }
      },
      immediate: true
    }
  },
  methods: {
    resetForm() {
      this.form = {
        deviceName: '',
        deviceId: '',
        protocol: '',
        vendor: '',
        ip: '',
        port: '',
        groupId: '',
        mediaServerId: ''
      };
      this.$nextTick(() => {
        if (this.$refs.formRef) {
          this.$refs.formRef.clearValidate();
        }
      });
    },
    handleSubmit() {
      this.$refs.formRef.validate(valid => {
        if (valid) {
          this.$emit('submit', { ...this.form });
        }
      });
    },
    handleClose() {
      this.resetForm();
      this.$emit('close');
    }
  }
};
</script>
