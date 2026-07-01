<template>
  <div class="app-container">
    <div class="header-bar">
      <el-button type="primary" plain icon="el-icon-plus" @click="handleAdd">新增</el-button>
    </div>

    <div class="server-grid">
      <transition-group name="card-list" tag="div">
        <div v-for="item in wvpMediaServerList" :key="item.id" class="server-card">
          <div v-if="item.type === 'zlm'" class="card-img-zlm"></div>
          <div v-if="item.type === 'abl'" class="card-img-abl"></div>
          <div class="card-content">
            <div class="card-info">
              <div class="server-id">{{ item.id }}</div>
              <div class="server-ip">{{ item.ip }}</div>
              <div class="server-status">
                <span :class="['status-dot', item.status === 'ON' ? 'online' : 'offline']"></span>
                <span class="status-text">{{ item.status === 'ON' ? '在线' : '离线' }}</span>
              </div>
            </div>

            <div class="card-toolbar">
              <div class="toolbar-actions">
                <el-tooltip content="查看" placement="top">
                  <el-button type="primary" size="small" icon="el-icon-view" @click="handleView(item)" />
                </el-tooltip>
                <el-tooltip content="编辑" placement="top" v-if="!item.defaultServer">
                  <el-button type="success" size="small" icon="el-icon-edit" @click="handleUpdate(item)" />
                </el-tooltip>
                <el-tooltip content="移除" placement="top" v-if="!item.defaultServer">
                  <el-button type="danger" size="small" icon="el-icon-delete" @click="handleDelete(item)" />
                </el-tooltip>
                <el-tooltip content="重启" placement="top">
                  <el-button type="warning" size="small" icon="el-icon-refresh-right" @click="handleRestartServer(item)" />
                </el-tooltip>
              </div>
            </div>
          </div>
          <i v-if="item.defaultServer" class="default-icon el-icon-success" style="color: #67C23A;"></i>
          <el-tag v-if="item.defaultServer" type="success" class="default-tag">默认</el-tag>
        </div>
      </transition-group>
    </div>

    <el-dialog title="媒体节点详情" :visible.sync="openView" width="720px" append-to-body class="server-detail-dialog">
      <div class="detail-container">
        <div class="detail-section">
          <div class="section-title">
            <i class="el-icon-info"></i>
            <span>基本信息</span>
          </div>
          <div class="info-grid">
            <div class="info-item">
              <span class="info-label">节点ID</span>
              <span class="info-value">{{ rowData.id }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">服务IP</span>
              <span class="info-value">{{ rowData.ip }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">服务类型</span>
              <el-tag v-if="rowData.type === 'zlm'" type="primary">ZLMediaKit</el-tag>
              <el-tag v-if="rowData.type === 'abl'" type="success">ABLMediaServer</el-tag>
            </div>
            <div class="info-item">
              <span class="info-label">自动配置</span>
              <el-tag v-if="rowData.autoConfig" type="success">已启用</el-tag>
              <el-tag v-else type="info">未启用</el-tag>
            </div>
          </div>
        </div>

        <div class="detail-section">
          <div class="section-title">
            <i class="el-icon-connection"></i>
            <span>端口配置</span>
          </div>
          <div class="info-grid">
            <div class="info-item">
              <span class="info-label">HTTP端口</span>
              <span class="info-value">{{ rowData.httpPort }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">HTTPS端口</span>
              <span class="info-value">{{ rowData.httpSslPort }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">RTMP端口</span>
              <span class="info-value">{{ rowData.rtmpPort }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">RTSP端口</span>
              <span class="info-value">{{ rowData.rtspPort }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">录像管理端口</span>
              <span class="info-value">{{ rowData.recordAssistPort }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">收流端口模式</span>
              <el-tag v-if="rowData.rtpEnable" type="warning">多端口</el-tag>
              <el-tag v-else type="info">单端口</el-tag>
            </div>
            <div class="info-item full-width">
              <span class="info-label">收流端口范围</span>
              <span class="info-value">{{ rowData.rtpPortRange }}</span>
            </div>
          </div>
        </div>

        <div class="detail-section">
          <div class="section-title">
            <i class="el-icon-monitor"></i>
            <span>网络配置</span>
          </div>
          <div class="info-grid">
            <div class="info-item">
              <span class="info-label">流IP</span>
              <span class="info-value">{{ rowData.streamIp }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">HOOK IP</span>
              <span class="info-value">{{ rowData.hookIp }}</span>
            </div>
            <div class="info-item full-width">
              <span class="info-label">SDP IP</span>
              <span class="info-value">{{ rowData.sdpIp }}</span>
            </div>
          </div>
        </div>

        <div class="detail-section">
          <div class="section-title">
            <i class="el-icon-lock"></i>
            <span>安全配置</span>
          </div>
          <div class="info-grid">
            <div class="info-item full-width">
              <span class="info-label">SECRET</span>
              <span class="info-value secret-value">{{ rowData.secret }}</span>
            </div>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { delMediaServer, getMediaServerList, restartServer } from '@/api/nvr/zlm.js'

export default {
  name: 'MediaServer',
  data() {
    return {
      wvpMediaServerList: [],
      openView: false,
      loading: true,
      rowData: {}
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    getList() {
      this.loading = true
      getMediaServerList().then(response => {
        this.wvpMediaServerList = response.data
        this.loading = false
      })
    },
    handleQuery() {
      this.getList()
    },
    handleAdd() {
      this.$router.push('/mediaServer/addMediaServer/index')
    },
    handleUpdate(row) {
      this.$router.push({
        path: '/mediaServer/updateMediaServer/index',
        query: { id: row.id }
      })
    },
    handleDelete(row) {
      const _ids = row.id
      this.$confirm('确认删除此节点？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        return delMediaServer(_ids)
      }).then(() => {
        this.getList()
        this.$message.success('删除成功')
      }).catch(() => {})
    },
    handleView(row) {
      this.openView = true
      this.rowData = row
    },
    handleRestartServer(row) {
      const _ids = row.id
      this.$confirm('重启服务器,只有 Daemon 方式才能重启，否则是直接关闭！是否继续？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        return restartServer(_ids)
      }).then(() => {
        this.getList()
        this.$message.success('重启成功')
      }).catch(() => {})
    }
  }
}
</script>

<style lang="scss" scoped>
.app-container {
  padding: 16px;
}

.header-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.server-grid {
  > div {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
    gap: 16px;
  }
}

.card-list-enter-active,
.card-list-leave-active {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.card-list-enter,
.card-list-leave-to {
  opacity: 0;
  transform: scale(0.8) translateY(20px);
}

.card-list-move {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.server-card {
  position: relative;
  background: white;
  border-radius: 12px;
  border: 1px solid #e8e8e8;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  animation: fadeInUp 0.5s ease forwards;

  &:hover {
    border-color: #409eff;
    box-shadow: 0 8px 24px rgba(64, 158, 255, 0.15);
    transform: translateY(-4px);

    .card-img-zlm,
    .card-img-abl {
      transform: scale(1.05);
    }
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.card-img-zlm,
.card-img-abl {
  width: 100%;
  height: 160px;
  background: url('../../../assets/images/zlm-logo.png') no-repeat center;
  background-size: contain;
  background-color: #f8fafc;
  transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.card-content {
  padding: 16px;
}

.card-info {
  margin-bottom: 12px;
}

.server-id {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 6px;
}

.server-ip {
  font-size: 13px;
  color: #909399;
  margin-bottom: 8px;
}

.server-status {
  display: flex;
  align-items: center;
  gap: 6px;
}

.status-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  position: relative;

  &.online {
    background: #67c23a;
    animation: pulse-green 2s ease-in-out infinite;
  }

  &.offline {
    background: #f56c6c;
  }

  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background: inherit;
    opacity: 0.4;
    animation: pulse 2s ease-in-out infinite;
  }
}

@keyframes pulse {
  0%, 100% {
    transform: translate(-50%, -50%) scale(1);
    opacity: 0.4;
  }
  50% {
    transform: translate(-50%, -50%) scale(1.8);
    opacity: 0;
  }
}

@keyframes pulse-green {
  0%, 100% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(103, 194, 58, 0.4);
  }
  50% {
    transform: scale(1.1);
    box-shadow: 0 0 0 8px rgba(103, 194, 58, 0);
  }
}

.status-text {
  font-size: 13px;
  color: #606266;
}

.card-toolbar {
  display: flex;
  justify-content: flex-end;
  padding-top: 12px;
  border-top: 1px solid #f5f7fa;
}

.toolbar-actions {
  display: flex;
  gap: 8px;
}

.default-icon {
  position: absolute;
  right: 12px;
  top: 12px;
  font-size: 20px;
  background: white;
  border-radius: 50%;
  padding: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.default-tag {
  position: absolute;
  left: 12px;
  top: 12px;
}

.detail-container {
  padding: 8px 0;
}

.detail-section {
  margin-bottom: 24px;

  &:last-child {
    margin-bottom: 0;
  }
}

.section-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 15px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid #f0f0f0;

  .el-icon {
    color: #409eff;
    font-size: 18px;
  }
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 6px;

  &.full-width {
    grid-column: 1 / -1;
  }
}

.info-label {
  font-size: 13px;
  color: #909399;
  font-weight: 500;
}

.info-value {
  font-size: 14px;
  color: #303133;
  font-weight: 500;
  word-break: break-all;

  &.secret-value {
    font-family: 'Courier New', monospace;
    color: #f56c6c;
    background: #fef0f0;
    padding: 4px 8px;
    border-radius: 4px;
    display: inline-block;
  }
}
</style>
