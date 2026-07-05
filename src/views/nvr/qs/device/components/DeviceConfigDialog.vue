<template>
  <el-dialog
    title="设备配置"
    v-model="dialogVisible"
    width="600px"
    @close="handleClose"
  >
    <el-tabs v-model="activeTab">
      <el-tab-pane label="基础配置" name="basic">
        <el-form :model="basicForm" label-width="120px">
          <el-form-item label="设备名称">
            <el-input v-model="basicForm.deviceName" />
          </el-form-item>
          <el-form-item label="设备ID">
            <el-input v-model="basicForm.deviceId" disabled />
          </el-form-item>
          <el-form-item label="协议">
            <el-select v-model="basicForm.protocol" style="width: 100%">
              <el-option
                v-for="item in protocolDict"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="厂商">
            <el-select v-model="basicForm.vendor" style="width: 100%">
              <el-option
                v-for="item in vendorDict"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="连接配置" name="connection">
        <el-form :model="connectionForm" label-width="120px">
          <el-form-item label="IP地址">
            <el-input v-model="connectionForm.ip" />
          </el-form-item>
          <el-form-item label="端口">
            <el-input v-model="connectionForm.port" />
          </el-form-item>
          <el-form-item label="用户名">
            <el-input v-model="connectionForm.username" />
          </el-form-item>
          <el-form-item label="密码">
            <el-input v-model="connectionForm.password" type="password" show-password />
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="媒体配置" name="media">
        <el-form :model="mediaForm" label-width="120px">
          <el-form-item label="媒体服务器">
            <el-select v-model="mediaForm.mediaServerId" style="width: 100%">
              <el-option
                v-for="item in mediaServerList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="流传输协议">
            <el-select v-model="mediaForm.streamProtocol" style="width: 100%">
              <el-option label="TCP" value="tcp" />
              <el-option label="UDP" value="udp" />
            </el-select>
          </el-form-item>
        </el-form>
      </el-tab-pane>
    </el-tabs>
    <template #footer>
      <el-button @click="dialogVisible = false">取消</el-button>
      <el-button type="primary" :loading="saving" @click="handleSave">保存</el-button>
    </template>
  </el-dialog>
</template>

<script>
export default {
  name: 'DeviceConfigDialog',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    device: {
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
    mediaServerList: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      activeTab: 'basic',
      saving: false,
      basicForm: {
        deviceName: '',
        deviceId: '',
        protocol: '',
        vendor: ''
      },
      connectionForm: {
        ip: '',
        port: '',
        username: '',
        password: ''
      },
      mediaForm: {
        mediaServerId: '',
        streamProtocol: 'tcp'
      }
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
    }
  },
  watch: {
    device: {
      handler(val) {
        if (val) {
          this.basicForm = {
            deviceName: val.deviceName || '',
            deviceId: val.deviceId || '',
            protocol: val.protocol || '',
            vendor: val.vendor || ''
          };
          this.connectionForm = {
            ip: val.ip || '',
            port: val.port || '',
            username: val.username || '',
            password: val.password || ''
          };
          this.mediaForm = {
            mediaServerId: val.mediaServerId || '',
            streamProtocol: val.streamProtocol || 'tcp'
          };
        }
      },
      immediate: true
    }
  },
  methods: {
    handleSave() {
      this.saving = true;
      const config = {
        ...this.basicForm,
        ...this.connectionForm,
        ...this.mediaForm
      };
      this.$emit('save', config);
      setTimeout(() => {
        this.saving = false;
      }, 500);
    },
    handleClose() {
      this.activeTab = 'basic';
      this.$emit('close');
    }
  }
};
</script>
