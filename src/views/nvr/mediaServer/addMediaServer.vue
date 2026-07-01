<template>
  <div class="app-container">
    <!-- 步骤条 -->
    <div class="step-bar">
      <el-steps :active="activeStep" finish-status="success" align-center>
        <el-step title="基础配置" description="IP、端口、密钥"></el-step>
        <el-step title="端口配置" description="RTSP、RTMP、RTP等"></el-step>
        <el-step title="确认提交" description="检查配置信息"></el-step>
      </el-steps>
    </div>

    <!-- 步骤1：基础配置 -->
    <div class="step-panel" :class="{ 'is-active': activeStep === 0 }">
      <div class="form-group">
        <h3 class="group-title"><i class="el-icon-connection"></i> 服务器连接</h3>
        <el-form ref="mediaServerFormRef" :model="form" :rules="rules" label-width="120px">
          <el-form-item label="服务器IP" prop="ip">
            <el-input v-model="form.ip" placeholder="请输入服务器IP地址" clearable></el-input>
          </el-form-item>
          <el-form-item label="HTTP端口" prop="httpPort">
            <el-input v-model="form.httpPort" placeholder="请输入HTTP端口" clearable></el-input>
          </el-form-item>
          <el-form-item label="密钥" prop="secret">
            <el-input v-model="form.secret" placeholder="请输入密钥" show-password clearable></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitCheckMediaServerForm" :loading="isConnected">
              <i class="el-icon-connection" v-if="!isConnected"></i>
              <i class="el-icon-success" v-else></i>
              {{ isConnected ? '已连接' : '测试连接' }}
            </el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>

    <!-- 步骤2：端口配置 -->
    <div class="step-panel" :class="{ 'is-active': activeStep === 1 }">
      <div class="form-group">
        <h3 class="group-title"><i class="el-icon-setting"></i> 流媒体端口</h3>
        <el-form :model="form" label-width="140px">
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="RTSP端口">
                <el-input v-model="form.rtspPort" placeholder="RTSP端口"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="RTSP SSL端口">
                <el-input v-model="form.rtspSslPort" placeholder="RTSP SSL端口"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="RTMP端口">
                <el-input v-model="form.rtmpPort" placeholder="RTMP端口"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="RTMP SSL端口">
                <el-input v-model="form.rtmpSslPort" placeholder="RTMP SSL端口"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="HTTP SSL端口">
                <el-input v-model="form.httpSslPort" placeholder="HTTP SSL端口"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="录制辅助端口">
                <el-input v-model="form.recordAssistPort" placeholder="录制辅助端口"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <div class="form-group" style="margin-top: 20px;">
        <h3 class="group-title"><i class="el-icon-monitor"></i> RTP配置</h3>
        <el-form :model="form" label-width="140px">
          <el-form-item label="启用RTP">
            <el-switch v-model="form.rtpEnable"></el-switch>
          </el-form-item>
          <el-form-item label="RTP端口范围" v-if="form.rtpEnable">
            <el-col :span="11">
              <el-input v-model="rtpPortRange1" placeholder="起始端口" @change="portRangeChange"></el-input>
            </el-col>
            <el-col :span="2" style="text-align: center;">-</el-col>
            <el-col :span="11">
              <el-input v-model="rtpPortRange2" placeholder="结束端口" @change="portRangeChange"></el-input>
            </el-col>
          </el-form-item>
          <el-form-item label="发送RTP端口范围" v-if="form.rtpEnable">
            <el-col :span="11">
              <el-input v-model="sendRtpPortRange1" placeholder="起始端口" @change="portRangeChange"></el-input>
            </el-col>
            <el-col :span="2" style="text-align: center;">-</el-col>
            <el-col :span="11">
              <el-input v-model="sendRtpPortRange2" placeholder="结束端口" @change="portRangeChange"></el-input>
            </el-col>
          </el-form-item>
          <el-form-item label="RTP代理端口">
            <el-input v-model="form.rtpProxyPort" placeholder="RTP代理端口"></el-input>
          </el-form-item>
        </el-form>
      </div>
    </div>

    <!-- 步骤3：确认提交 -->
    <div class="step-panel" :class="{ 'is-active': activeStep === 2 }">
      <div class="form-group">
        <h3 class="group-title"><i class="el-icon-info"></i> 配置确认</h3>
        <el-descriptions :column="2" border>
          <el-descriptions-item label="服务器IP">{{ form.ip }}</el-descriptions-item>
          <el-descriptions-item label="HTTP端口">{{ form.httpPort }}</el-descriptions-item>
          <el-descriptions-item label="RTSP端口">{{ form.rtspPort || '-' }}</el-descriptions-item>
          <el-descriptions-item label="RTMP端口">{{ form.rtmpPort || '-' }}</el-descriptions-item>
          <el-descriptions-item label="RTP启用">{{ form.rtpEnable ? '是' : '否' }}</el-descriptions-item>
          <el-descriptions-item label="RTP端口范围" v-if="form.rtpEnable">{{ form.rtpPortRange }}</el-descriptions-item>
        </el-descriptions>
      </div>
    </div>

    <!-- 操作按钮 -->
    <div class="form-group" style="margin-top: 20px;">
      <div style="display: flex; justify-content: space-between;">
        <el-button @click="handlePrev" :disabled="activeStep === 0">
          <i class="el-icon-arrow-left"></i> 上一步
        </el-button>
        <div>
          <el-button v-if="activeStep < 2" type="primary" @click="handleNext">
            下一步 <i class="el-icon-arrow-right"></i>
          </el-button>
          <el-button v-else type="success" @click="submitForm">
            <i class="el-icon-check"></i> 提交
          </el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { checkMediaServer, saveMediaServer } from "@/api/nvr/zlm.js";

export default {
  name: 'AddMediaServer',
  data() {
    return {
      activeStep: 0,
      isConnected: false,
      isUpdatingForm: false,
      rtpPortRange1: 30000,
      rtpPortRange2: 30500,
      sendRtpPortRange1: 50000,
      sendRtpPortRange2: 60000,
      form: {
        id: null,
        ip: '',
        httpPort: '',
        secret: '',
        type: 'zlm',
        autoConfig: true,
        hookIp: null,
        sdpIp: null,
        streamIp: null,
        httpSslPort: null,
        recordAssistPort: null,
        rtmpPort: null,
        rtmpSslPort: null,
        rtpEnable: true,
        rtpPortRange: null,
        sendRtpPortRange: null,
        rtpProxyPort: null,
        rtspPort: null,
        rtspSslPort: null,
      },
      rules: {
        ip: [{ required: true, validator: this.isValidIp, message: '请输入有效的IP地址', trigger: 'blur' }],
        httpPort: [{ required: true, validator: this.isValidPort, message: '请输入有效的端口号', trigger: 'blur' }],
        secret: [{ required: true, message: "请输入secret", trigger: "blur" }],
      },
    };
  },
  watch: {
    'form.ip'() {
      if (!this.isUpdatingForm) {
        this.isConnected = false;
      }
    },
    'form.httpPort'() {
      if (!this.isUpdatingForm) {
        this.isConnected = false;
      }
    },
    'form.secret'() {
      if (!this.isUpdatingForm) {
        this.isConnected = false;
      }
    },
  },
  mounted() {
    this.reset();
  },
  methods: {
    isValidIp(rule, value, callback) {
      const reg = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/;
      if (!reg.test(value)) {
        return callback(new Error('请输入有效的IP地址'));
      } else {
        callback();
      }
    },
    isValidPort(rule, value, callback) {
      const reg = /^(([0-9]|[1-9]\d{1,3}|[1-5]\d{4}|6[0-5]{2}[0-3][0-5]))$/;
      if (!reg.test(value)) {
        return callback(new Error('请输入有效的端口号'));
      } else {
        callback();
      }
    },
    cancel() {
      this.reset();
      this.$tab.closeOpenPage({ path: "/mediaServer" });
    },
    reset() {
      this.activeStep = 0;
      this.isConnected = false;
      this.form = {
        id: null,
        ip: '',
        httpPort: '',
        secret: '',
        type: 'zlm',
        autoConfig: true,
        hookIp: null,
        sdpIp: null,
        streamIp: null,
        httpSslPort: null,
        recordAssistPort: null,
        rtmpPort: null,
        rtmpSslPort: null,
        rtpEnable: true,
        rtpPortRange: null,
        sendRtpPortRange: null,
        rtpProxyPort: null,
        rtspPort: null,
        rtspSslPort: null,
      };
      this.rtpPortRange1 = 30000;
      this.rtpPortRange2 = 30500;
      this.sendRtpPortRange1 = 50000;
      this.sendRtpPortRange2 = 60000;
      this.$refs.mediaServerFormRef && this.$refs.mediaServerFormRef.resetFields();
    },
    handleNext() {
      if (this.activeStep === 0) {
        this.$refs.mediaServerFormRef.validateField(['ip', 'httpPort', 'secret']).then(() => {
          if (!this.isConnected) {
            this.$modal.msgWarning("请先测试连接");
            return;
          }
          this.activeStep++;
        }).catch(() => {});
      } else if (this.activeStep < 2) {
        this.activeStep++;
      }
    },
    handlePrev() {
      if (this.activeStep > 0) {
        this.activeStep--;
      }
    },
    submitCheckMediaServerForm() {
      this.$refs.mediaServerFormRef.validateField(['ip', 'httpPort', 'secret']).then(() => {
        checkMediaServer(
          this.form.ip,
          this.form.httpPort,
          this.form.secret,
          this.form.type,
        ).then(response => {
          const httpPort = this.form.httpPort;
          this.isUpdatingForm = true;
          Object.assign(this.form, response.data);
          this.form.httpPort = httpPort;
          this.form.autoConfig = true;
          this.form.rtpEnable = true;
          this.rtpPortRange1 = 30000;
          this.rtpPortRange2 = 30500;
          this.sendRtpPortRange1 = 50000;
          this.sendRtpPortRange2 = 60000;
          this.isConnected = true;
          this.$nextTick(() => {
            this.isUpdatingForm = false;
          });
          this.$modal.msgSuccess("该ZLMediaKit可用");
        }).catch(() => {
          this.$modal.msgError("测试连接失败，请检查配置");
        });
      }).catch(() => {});
    },
    portRangeChange() {
      if (this.form.rtpEnable) {
        this.form.rtpPortRange = this.rtpPortRange1 + "," + this.rtpPortRange2;
        this.form.sendRtpPortRange = this.sendRtpPortRange1 + "," + this.sendRtpPortRange2;
      }
    },
    submitForm() {
      this.$refs.mediaServerFormRef.validate(valid => {
        if (valid) {
          saveMediaServer(this.form).then(() => {
            this.$modal.msgSuccess("新增成功");
            this.cancel();
          });
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.app-container {
  padding: 20px;
}

.step-bar {
  margin-bottom: 24px;
  padding: 20px 32px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.step-panel {
  display: none;
}

.step-panel.is-active {
  display: block;
}

.form-group {
  padding: 24px 28px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.group-title {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  font-size: 16px;
  font-weight: 600;
  color: #303133;

  i {
    margin-right: 8px;
    color: #409EFF;
  }
}
</style>
