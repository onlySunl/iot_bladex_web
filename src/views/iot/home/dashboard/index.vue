<template>
  <basic-container>
    <div class="iot-dashboard">
      <el-row :gutter="20">
        <el-col :span="6">
          <el-card shadow="hover" class="dashboard-card">
            <div class="card-icon" style="background: #409EFF;">
              <i class="iconfont icon-box"></i>
            </div>
            <div class="card-info">
              <div class="card-value">{{ stats.productCount || 0 }}</div>
              <div class="card-label">产品数量</div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card shadow="hover" class="dashboard-card">
            <div class="card-icon" style="background: #67C23A;">
              <i class="iconfont icon-shebeizhuangtai"></i>
            </div>
            <div class="card-info">
              <div class="card-value">{{ stats.deviceCount || 0 }}</div>
              <div class="card-label">设备数量</div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card shadow="hover" class="dashboard-card">
            <div class="card-icon" :style="{ background: alertCount > 0 ? '#F56C6C' : '#E6A23C' }">
              <i class="iconfont icon-gaojing"></i>
            </div>
            <div class="card-info">
              <div class="card-value" :class="{ 'alert-pulse': alertCount > 0 }">{{ alertCount }}</div>
              <div class="card-label">告警数量</div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card shadow="hover" class="dashboard-card">
            <div class="card-icon" :style="{ background: onlineCount > 0 ? '#67C23A' : '#F56C6C' }">
              <i class="iconfont icon-online"></i>
            </div>
            <div class="card-info">
              <div class="card-value">{{ onlineCount }}</div>
              <div class="card-label">
                在线设备
                <el-tag v-if="wsConnected" type="success" size="mini" effect="dark" style="margin-left:5px;">实时</el-tag>
                <el-tag v-else type="info" size="mini" effect="dark" style="margin-left:5px;">离线</el-tag>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </basic-container>
</template>

<script>
import ws from '@/util/ws'

export default {
  name: 'IotDashboard',
  data() {
    return {
      stats: {
        productCount: 0,
        deviceCount: 0,
        alertCount: 0,
        onlineCount: 0
      },
      // WebSocket 相关
      wsOnlineHandler: null,
      wsOfflineHandler: null,
      wsAlertHandler: null,
      wsStatusHandler: null
    }
  },
  computed: {
    /**
     * WebSocket 连接状态
     */
    wsConnected() {
      return this.$store && this.$store