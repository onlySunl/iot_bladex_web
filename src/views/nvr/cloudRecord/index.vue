<template>

  <div class="app-container">
    <div class="search-box">
      <!-- 查询表单 -->
      <el-form
        :model="queryParams"
        ref="queryRef"
        :inline="true"
        v-show="showSearch"
        label-width="68px"
        class="query-form"
      >
        <el-form-item label="应用名" prop="app">
          <el-input
            v-model="queryParams.app"
            placeholder="请输入应用名"
            clearable
            @keyup.enter="handleQuery"
          />
        </el-form-item>
        <el-form-item label="流id" prop="stream">
          <el-input
            v-model="queryParams.stream"
            placeholder="请输入流id"
            clearable
            @keyup.enter="handleQuery"
          />
        </el-form-item>
        <el-form-item label="开始时间" prop="queryStartTime">
          <el-date-picker
            v-model="queryParams.queryStartTime"
            type="datetime"
            style="width: 240px"
            value-format="YYYY-MM-DD HH:mm:ss"
            placeholder="选择日期时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="结束时间" prop="queryEndTime">
          <el-date-picker
            v-model="queryParams.queryEndTime"
            type="datetime"
            style="width: 240px"
            value-format="YYYY-MM-DD HH:mm:ss"
            placeholder="选择日期时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="媒体节点" prop="mediaServerId">
          <el-select
            v-model="queryParams.mediaServerId"
            style="width: 240px"
            placeholder="请选择节点选择"
            clearable
          >
            <el-option
              v-for="item in mediaServerList"
              :key="item.id"
              :label="item.id"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item class="form-actions">
          <div class="button-group">
            <el-button type="primary" icon="el-icon-search" @click="handleQuery" class="search-btn">搜索</el-button>
            <el-button icon="el-icon-refresh" @click="resetQuery" class="reset-btn">重置</el-button>
          </div>
        </el-form-item>
      </el-form>

      <!-- 操作按钮区 -->
      <el-row :gutter="10" class="mb8 toolbar-row action-buttons">
        <el-col :span="1.5">
          <el-button
            type="danger"
            plain
            icon="el-icon-delete"
            :disabled="multiple"
            @click="handleDelete"
            class="action-btn delete-btn"
          >删除
          </el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
            type="warning"
            plain
            icon="el-icon-download"
            :disabled="multiple"
            @click="downloadZip"
            class="action-btn download-btn"
          >下载
          </el-button>
        </el-col>
        <right-toolbar :showSearch.sync="showSearch" :viewMode.sync="viewMode" :showViewSwitch="true" @queryTable="getList"></right-toolbar>
      </el-row>
    </div>

    <!-- 数据表格 -->
    <div v-if="viewMode === 'list'" class="table-wrapper">
      <el-table
        v-loading="loading"
        :data="cloudRecordList"
        @selection-change="handleSelectionChange"
        class="custom-table"
        highlight-current-row
      >
        <el-table-column type="selection" width="55" align="center" fixed/>
        <el-table-column label="编号" align="center" prop="id" width="70">
          <template slot-scope="scope">
            <span class="id-badge">{{ scope.row.id }}</span>
          
</template>

<script>
import screenfull from 'screenfull'
import moment from 'moment'
import EasyPlayer from "@/components/nvr/EasyPlayer";
import {
import StreamDropdown from "@/components/nvr/Channel/streamDropdown.vue";
import MediaInfo from "@/components/nvr/Channel/mediaInfo.vue";
import {getAllOnlineMediaServe} from "@/api/nvr/zlm";

export default {
  name: 'small-padding fixed-width',
  data() {
    return {
      easyPlayerOpen: false,
      cloudRecordRow: {},
      rtcUrl: "",
      flvUrl: "",
      wsUrl: '',
      tabActiveName: 'media',
      streamInfo: {},
      quality: ['普清', '高清', '超清'],
      defaultQuality: '高清',
      isPtz: true,
      isQuality: true,
      isLive: true,
      currentWidth: 0,
      playerTime: 0,
      showTimeLeft: 0,
      step: 0,
      showPlayTime: '',
      timeLen: null,
      startTime: null,
      playing: false,
      timer: null,
      playSpeed: 1,
      isFullScreen: false,
      lastDiable: true,
      nextDiable: false,
      playData: {},
      playSpeedRange: [1, 2, 4],
      jessibucaHeight: "400px",
      isPaused: false,
      mediaServerList: [],
      pageNum: 1,
      pageSize: 10,
      app: undefined,
      stream: undefined,
      callId: undefined,
      queryStartTime: undefined,
      queryEndTime: undefined,
      mediaServerId: undefined,
    }
  },
  computed: {
    showPlayTimeValue() {
      return return this.streamInfo === null ? '--:--:-- --:--:--' : formatTimeStamp(this.cloudRecordRow.startTime)
    },
    showPlayTimeTotal() {
      return if (this.streamInfo === null) {
    return '--:--:-- --:--:--'
  } else {
    return formatTimeStamp(this.cloudRecordRow.endTime)
  }
    },
    showPlayTimeTitle() {
      return if (this.showTimeLeft) {
    let time = this.showTimeLeft / this.$refs["timeProcess"].clientWidth * this.cloudRecordRow.timeLen
    let realTime = this.timeLen / this.cloudRecordRow.timeLen * time + this.startTime
    return `${moment(time + 1000).format('mm:ss')}(${moment(realTime).format('HH:mm:ss')})`
  } else {
    return ''
  }
    },
    playTimeTitleStyle() {
      return return {left: (this.showTimeLeft - 32) + 'px'}
    },
    playTimeValue() {
      return return {width: this.currentWidth + '%'}
    },
  },
  mounted() {
    document.addEventListener('fullscreenchange', updateFullscreenState);
      getList()
      getAllOnlineMediaServeFun()
  },
  beforeDestroy() {
    document.removeEventListener('fullscreenchange', updateFullscreenState);
  },
  methods: {
    getList() {
      this.loading = true
        listCloudRecord(this.queryParams).then(response => {
          this.cloudRecordList = response.rows.map((item: any) => ({
            ...item,
            checked: this.ids.includes(item.id)
          }))
          this.total = response.total
          this.loading = false
        })
    },
    handleQuery() {
      this.queryParams.pageNum = 1
        getList()
    },
    resetQuery() {
      this.resetForm("queryRef")
        handleQuery()
    },
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
        this.multiple = !selection.length
    },
    handleCardSelection() {
      const selectedItems = this.cloudRecordList.filter(item => item.checked)
        this.ids = selectedItems.map(item => item.id!)
        this.multiple = !selectedItems.length
    },
    handleDelete(row) {
      const _ids = row.id || this.ids
        this.$modal.confirm('是否确认删除云端录像编号为"' + _ids + '"的数据项？').then(function () {
          return delCloudRecord(_ids)
        }).then(() => {
          getList()
          this.$modal.msgSuccess("删除成功")
        }).catch(() => {
        })
    },
    downloadZip(row) {
      let cloudRecordIds = []
        if (row.id) {
          cloudRecordIds.push(row.id)
        } else {
          cloudRecordIds = this.ids
        }
      
        let idsStr = cloudRecordIds.join(',')
        const link = document.createElement('a')
        link.target = '_blank'
        let baseUri = process.env.VITE_APP_BASE_API
        let downloadUrl = `${location.origin}${baseUri}/zlm/cloudRecord/download/zip?ids=${idsStr}`
        link.href = downloadUrl
        link.click()
    },
    stopPLay() {
      // 停止
        if (this.$refs["EasyPlayerRef"]) {
          this.$refs["EasyPlayerRef"].destroy()
        }
        this.playing = false
        this.playSpeed = 1
        handleCloseStreams()
    },
    timeProcessClick(event) {
      let x = event.offsetX
        let clientWidth = this.$refs["timeProcess"].clientWidth
        seekRecord(x / clientWidth * this.timeLen)
    },
    seekRecord(playSeekValue) {
      seekCloudRecord({
          mediaServerId: this.streamInfo.mediaServerId,
          app: this.streamInfo.app,
          stream: this.streamInfo.stream,
          stamp: playSeekValue,
          schema: 'fmp4'
        }).then((data) => {
          this.currentWidth = playSeekValue / 1000 * this.step
        }).catch((error) => {
          console.log(error)
        })
    },
    timeProcessMouseEnter(event) {
      this.showTimeLeft = event.offsetX
    },
    timeProcessMouseMove(event) {
      this.showTimeLeft = event.offsetX
    },
    timeProcessMouseLeave(event) {
      this.showTimeLeft = null
    },
    formatTimeStamp(time) {
      return moment.unix(time / 1000).format('yyyy-MM-DD HH:mm:ss')
    },
    formatTime(time) {
      const h = parseInt(time / 3600 / 1000)
        const minute = parseInt((time - h * 3600 * 1000) / 60 / 1000)
        let second = Math.ceil((time - h * 3600 * 1000 - minute * 60 * 1000) / 1000)
        if (second < 0) {
          second = 0
        }
        return (h > 0 ? h + `小时` : '') + (minute > 0 ? minute + '分' : '') + (second > 0 ? second + '秒' : '')
    },
    formatBytes(bytes, decimals = 2) {
      if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    },
    getAllOnlineMediaServeFun() {
      getAllOnlineMediaServe().then((res) => {
          this.mediaServerList = res.data
        })
    },
    async handlePlay(row) {
      // 先停止当前播放
        if (this.easyPlayerOpen) {
          stopPLay()
        }
        
        await loadRecord(row.id).then(async res => {
          await nextTick(async () => {
            if (location.protocol === "https:") {
              this.flvUrl = res.data.https_flv;
              this.rtcUrl = res.data.rtcs;
              this.wsUrl = res.data.wss_flv;
            } else {
              this.flvUrl = res.data.flv;
              this.rtcUrl = res.data.rtc;
              this.wsUrl = res.data.ws_flv;
            }
      
            this.streamInfo = res.data;
            this.quality = []
            this.defaultQuality = ''
            this.isPtz = false
            this.isQuality = false
            this.isLive = true
            this.cloudRecordRow = row
            row.loading = false
            this.playing = true
      
            this.currentWidth = 0
            this.playerTime = 0
            this.playSpeed = 1
            this.isFullScreen = false
            this.jessibucaHeight = "400px"
            this.step = 100 / (this.cloudRecordRow.timeLen / 1000);
            this.timer = setInterval(() => {
      
              if (this.isPaused) return;
      
              // 增加进度
              this.currentWidth = this.currentWidth + this.step * this.playSpeed;
      
              this.playerTime += 1000 * this.playSpeed
      
              // 判断是否结束
              if (this.currentWidth >= 100) {
                this.currentWidth = 100;
                clearInterval(this.timer); // 停止计时器
              }
            }, 1000)
      
            this.timeLen = row.timeLen
            this.startTime = row.startTime
            this.easyPlayerOpen = true
      
            await nextTick()
            if (this.$refs["EasyPlayerRef"]) {
              this.$refs["EasyPlayerRef"].play(this.wsUrl)
            }
          })
        })
    },
    handleCloseStreams() {
      this.streamInfo = null
        this.currentWidth = 0
        this.playerTime = 0
        this.playSpeed = 0
        this.isPaused = false
        clearInterval(this.timer); // 停止计时器
        closeStreams(this.cloudRecordRow.id)
    },
    easyPlayeError() {
      clearInterval(this.timer); // 停止计时器
        this.currentWidth = 0
        this.playerTime = 0
        this.playSpeed = 0
        this.isPaused = false
    },
    async handleCopy(text) {
      if (!text) {
          this.$modal.msgError('内容为空，无法复制');
          return;
        }
      
        try {
          await toClipboard(text)
          this.$modal.msgSuccess('成功拷贝到粘贴板');
        } catch (e) {
          console.error(e)
        }
    },
    fullScreen() {
      if (this.isFullScreen) {
          screenfull.exit()
          this.isFullScreen = false
          this.jessibucaHeight = "400px"
          return
        }
        screenfull.request(document.getElementById('cloudRecordPlayer'))
        screenfull.on('change', (event) => {
          this.isFullScreen= screenfull.isFullscreen
        })
        this.isFullScreen = true
        this.jessibucaHeight = "95%"
    },
    changePlaySpeed(speed) {
      if (!this.streamInfo) {
          return
        }
        this.playSpeed = speed
        setCloudRecordSpeed({
          mediaServerId: this.streamInfo.mediaServerId,
          app: this.streamInfo.app,
          stream: this.streamInfo.stream,
          key: this.streamInfo.key,
          speed: this.playSpeed,
          schema: 'ts'
        }).then((res)=>{
      
        })
    },
    pausePlay() {
      this.$refs["EasyPlayerRef"].pause()
        this.playing = false
        togglePause()
    },
    playRecord() {
      this.playing = true
        togglePause()
        if (!this.streamInfo) {
          handlePlay(this.cloudRecordRow)
          return
        }
        this.$refs["EasyPlayerRef"].play()
    },
    togglePause() {
      this.isPaused = !this.isPaused;
    },
    seekBackward() {
      if (!this.streamInfo) {
          return
        }
        const newVal = (this.playerTime || 0) - 5 * 1000
        this.playerTime = newVal < 0 ? 0 : newVal
        seekRecord(this.playerTime)
    },
    seekForward() {
      if (!this.streamInfo) {
          return
        }
        this.playerTime = this.playerTime + 5 * 1000
        seekRecord(this.playerTime)
    },
    download() {
      downloadZip(this.cloudRecordRow);
    },
    snap() {
      this.$refs["EasyPlayerRef"].screenshot()
    },
    refresh() {
      this.$refs["EasyPlayerRef"].play()
    },
    updateFullscreenState() {
      this.isFullScreen = !!document.fullscreenElement;
        if (!this.isFullScreen) {
          screenfull.exit()
          this.isFullScreen = false
          this.jessibucaHeight = "400px"
        }
    },
  },
}
</script>

<style lang="scss" scoped>
.app-container {
  padding: 16px;
  animation: fadeIn 0.4s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.search-box {
  margin-bottom: 16px;
}

/* ========== 查询表单 ========== */
.query-form {
  padding: 10px 15px;
  background: #fff;
  border-radius: 10px;
  border: 1px solid #ebeef5;
  box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.04);
  margin-bottom: 0 !important;
  animation: fadeInUp 0.4s ease-out 0.15s both;
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  gap: 10px;

  :deep(.el-form-item) {
    margin-bottom: 0;
    margin-right: 0;
  }

  :deep(.el-input__wrapper),
  :deep(.el-select .el-input__wrapper) {
    box-shadow: 0 0 0 1px #dcdfe6 inset;
    transition: all 0.3s;

    &:hover,
    &:focus-within {
      box-shadow: 0 0 0 1px #a0cfff inset;
    }

    &:focus-within {
      box-shadow: 0 0 0 1px #409EFF inset, 0 0 0 3px #d9ecff;
    }
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(12px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.form-actions {
  margin-left: auto !important;
  margin-right: 0 !important;
  padding-left: 16px;
  border-left: 1px solid #ebeef5;
  margin-left: 12px !important;
}

.button-group {
  display: flex;
  gap: 12px;
}

.search-btn {
  transition: all 0.3s;
}

.search-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px #c6e2ff;
}

.search-btn:active {
  transform: translateY(0);
}

.reset-btn {
  transition: all 0.3s;
}

.reset-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
}

.reset-btn:active {
  transform: translateY(0);
}

/* ===== 工具栏样式优化 ===== */
.toolbar-row {
  padding: 4px 0;
  animation: fadeInUp 0.4s ease-out 0.2s both;
}

.action-buttons {
  display: flex;
  gap: 12px;
  margin-top: 12px;
  align-items: center;
}

.action-btn {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.action-btn:not(:disabled):hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.1);
}

.action-btn:not(:disabled):active {
  transform: translateY(0);
}

.delete-btn:hover {
  box-shadow: 0 4px 12px rgba(245, 108, 108, 0.35);
}

.download-btn:hover {
  box-shadow: 0 4px 12px rgba(230, 162, 60, 0.35);
}

/* ===== 卡片视图按钮样式 - 白色图标 ===== */
/* 播放按钮 */
.card-toolbar .btn-play {
  color: #ffffff !important;
}

.card-toolbar .btn-play .el-icon {
  color: #ffffff !important;
}

/* 操作按钮 - 强制覆盖 text bg 样式 */
.toolbar-actions .el-button--primary,
.toolbar-actions .el-button--primary[text],
.toolbar-actions .el-button--primary[text][bg] {
  color: #ffffff !important;
  background-color: #409EFF !important;
  border-color: #409EFF !important;
}

.toolbar-actions .el-button--danger,
.toolbar-actions .el-button--danger[text],
.toolbar-actions .el-button--danger[text][bg] {
  color: #ffffff !important;
  background-color: #F56C6C !important;
  border-color: #F56C6C !important;
}

.toolbar-actions .el-button--success,
.toolbar-actions .el-button--success[text],
.toolbar-actions .el-button--success[text][bg] {
  color: #ffffff !important;
  background-color: #67C23A !important;
  border-color: #67C23A !important;
}

.toolbar-actions .el-button .el-icon {
  color: #ffffff !important;
}

/* 悬停时稍微浅一点 */
.toolbar-actions .el-button--primary:hover,
.toolbar-actions .el-button--primary[text]:hover,
.toolbar-actions .el-button--primary[text][bg]:hover {
  background-color: #79bbff !important;
  border-color: #79bbff !important;
  color: #ffffff !important;
}

.toolbar-actions .el-button--primary:hover .el-icon {
  color: #ffffff !important;
}

.toolbar-actions .el-button--danger:hover,
.toolbar-actions .el-button--danger[text]:hover,
.toolbar-actions .el-button--danger[text][bg]:hover {
  background-color: #f89898 !important;
  border-color: #f89898 !important;
  color: #ffffff !important;
}

.toolbar-actions .el-button--danger:hover .el-icon {
  color: #ffffff !important;
}

.toolbar-actions .el-button--success:hover,
.toolbar-actions .el-button--success[text]:hover,
.toolbar-actions .el-button--success[text][bg]:hover {
  background-color: #95d475 !important;
  border-color: #95d475 !important;
  color: #ffffff !important;
}

.toolbar-actions .el-button--success:hover .el-icon {
  color: #ffffff !important;
}

.view-switch {
  display: flex;
  align-items: center;
  justify-content: center;
}

.view-switch :deep(.el-radio-group) {
  background: #f5f7fa;
  border-radius: 6px;
  padding: 2px;
  box-shadow: none;
  border: none;
  display: flex;
}

.view-switch :deep(.el-radio-button) {
  margin: 0;
}

.view-switch :deep(.el-radio-button__inner) {
  border: none;
  border-radius: 4px;
  padding: 6px 10px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  background: transparent;
  color: #909399;
  font-weight: 500;
  position: relative;
}

.view-switch :deep(.el-radio-button__inner:hover) {
  color: #409EFF;
  background: #ebeef5;
  transform: translateY(-1px);
}

.view-switch :deep(.el-radio-button__orig-radio:checked + .el-radio-button__inner) {
  background: #fff;
  color: #409EFF;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.12);
  transform: translateY(-1px);
}

.view-switch :deep(.el-icon) {
  font-size: 16px;
  vertical-align: middle;
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.view-switch :deep(.el-radio-button__inner:hover .el-icon) {
  transform: scale(1.1);
}

.view-switch :deep(.el-radio-button__orig-radio:checked + .el-radio-button__inner .el-icon) {
  transform: scale(1.15);
}

/* 卡片视图样式 */
.card-view {
  padding: 8px 0;
}

.device-card {
  position: relative;
  margin-bottom: 16px;
  background: #fff;
  border: 1px solid #ebeef5;
  border-radius: 16px;
  overflow: hidden;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  animation: cardFadeIn 0.5s ease-out forwards;
  opacity: 0;
  transform: translateY(16px);
  box-shadow: 
    0 1px 2px rgba(0,0,0,0.04),
    0 4px 8px rgba(0,0,0,0.04),
    0 8px 16px rgba(0,0,0,0.02);
}

.device-card:nth-child(1) { animation-delay: 0.04s; }
.device-card:nth-child(2) { animation-delay: 0.08s; }
.device-card:nth-child(3) { animation-delay: 0.12s; }
.device-card:nth-child(4) { animation-delay: 0.16s; }
.device-card:nth-child(5) { animation-delay: 0.20s; }
.device-card:nth-child(6) { animation-delay: 0.24s; }
.device-card:nth-child(7) { animation-delay: 0.28s; }
.device-card:nth-child(8) { animation-delay: 0.32s; }

@keyframes cardFadeIn {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.device-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
  border-color: #a0cfff;
}

.device-card.is-selected {
  border-color: #409EFF;
  box-shadow: 
    0 0 0 3px #ecf5ff,
    0 8px 24px -4px rgba(64, 158, 255, 0.2),
    0 4px 12px rgba(64, 158, 255, 0.1);
}

/* 头部区域（替代图片区） */
.card-header-area {
  position: relative;
  padding: 16px;
  background: linear-gradient(135deg, #ecf5ff 0%, #f5f7fa 100%);
  border-bottom: 1px solid #ebeef5;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  min-height: 64px;
}

.card-header-area .card-checkbox {
  position: relative;
  top: auto;
  left: auto;
  z-index: 2;
}

.card-header-area .card-checkbox :deep(.el-checkbox__inner) {
  border-radius: 6px;
  width: 18px;
  height: 18px;
  transition: all 0.2s ease;
}

.header-content {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
}

.header-icon {
  font-size: 20px;
  color: #409EFF;
  flex-shrink: 0;
  animation: iconPulse 2s ease-in-out infinite;
  filter: drop-shadow(0 0 4px rgba(64, 158, 255, 0.3));
}

@keyframes iconPulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.15); }
}

.header-title {
  font-size: 14px;
  font-weight: 600;
  color: #303133;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.4;
}

.header-tag {
  flex-shrink: 0;
}

/* 信息区 */
.card-info {
  padding: 14px 16px 10px;
}

.info-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 10px;
}

.info-tag {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 3px 10px;
  border-radius: 6px;
  background: #f5f7fa;
  border: 1px solid #ebeef5;
  font-size: 11.5px;
  line-height: 1.5;
  backdrop-filter: blur(4px);
  transition: all 0.2s ease;
}

.info-tag:hover {
  border-color: #a0cfff;
  background: #ecf5ff;
}

.type-tag {
  margin-left: auto;
}

.tag-label {
  color: #909399;
  font-weight: 500;
}

.tag-val {
  color: #303133;
  font-weight: 500;
}

/* 通道/节点单独一行 */
.info-channel {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 10px;
  margin-bottom: 10px;
  border-radius: 6px;
  background: #f5f7fa;
  border: 1px solid #ebeef5;
  font-size: 12px;
  transition: all 0.2s ease;
}

.info-channel:hover {
  border-color: #a0cfff;
  background: #ecf5ff;
}

.channel-label {
  color: #909399;
  font-weight: 500;
  flex-shrink: 0;
}

.channel-val {
  color: #303133;
  font-weight: 500;
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  text-align: right;
}

.info-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.time-range {
  font-size: 12px;
  color: #909399;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  flex: 1;
  text-align: right;
}

/* 操作栏 */
.card-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 10px 16px 14px;
  border-top: 1px solid #ebeef5;
}

.card-toolbar .el-button.btn-play {
  flex-shrink: 0;
  min-width: 72px;
  box-shadow: 0 2px 8px rgba(64, 158, 255, 0.25) !important;
  transition: all 0.3s ease;
}

.card-toolbar .el-button.btn-play:not(:disabled):hover {
  box-shadow: 0 4px 14px rgba(64, 158, 255, 0.4) !important;
  transform: translateY(-1px);
}

.toolbar-actions {
  display: flex;
  align-items: center;
  gap: 6px;
}

.toolbar-actions .el-button {
  padding: 7px 10px;
  height: auto;
  font-size: 14px;
  transition: all 0.2s ease;
}

.toolbar-actions .el-button:hover {
  transform: scale(1.08);
}

/* 表格容器优化 */
.table-wrapper {
  background: #fff;
  border-radius: 10px;
  border: 1px solid #ebeef5;
  box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.04);
  overflow: hidden;
  animation: fadeInUp 0.4s ease-out 0.25s both;
  transition: box-shadow 0.3s;
}

.table-wrapper:hover {
  box-shadow: 0 4px 16px 0 rgba(0, 0, 0, 0.06);
}

.custom-table {
  --el-table-header-bg-color: #ebeef5;

  :deep(.el-table__header-wrapper) {
    th {
      background-color: #ebeef5 !important;
      color: #303133;
      font-weight: 600;
      font-size: 13px;
      letter-spacing: 0.3px;
      transition: background-color 0.3s;
    }
  }

  :deep(.el-table__body-wrapper) {
    .el-table__row {
      transition: all 0.25s ease;
      animation: rowFadeIn 0.4s ease-out both;

      @for $i from 1 through 20 {
        &:nth-child(#{$i}) {
          animation-delay: #{$i * 0.03 + 0.25}s;
        }
      }

      &:hover {
        background-color: #ecf5ff !important;
        transform: scale(1.002);
      }

      &.current-row {
        background-color: #ecf5ff !important;
      }
    }
  }

  :deep(.el-table__empty-block) {
    padding: 40px 0;
  }
}

@keyframes rowFadeIn {
  from {
    opacity: 0;
    transform: translateX(-10px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

/* 编号徽章 */
.id-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 28px;
  height: 22px;
  padding: 0 8px;
  background: #ecf5ff;
  color: #409EFF;
  border-radius: 11px;
  font-size: 12px;
  font-weight: 600;
  transition: all 0.3s;

  .el-table__row:hover & {
    background: #d9ecff;
    transform: scale(1.05);
  }
}

/* 分页优化 */
:deep(.el-pagination) {
  padding: 12px 0;
  animation: fadeInUp 0.4s ease-out 0.3s both;
}

:deep(.el-pagination__total) {
  color: #909399;
}

:deep(.el-pagination__sizes) .el-input__wrapper {
  box-shadow: 0 0 0 1px #dcdfe6 inset;
}

:deep(.el-pager li) {
  transition: all 0.3s;
}

:deep(.el-pager li:hover:not(.is-active)) {
  color: #409EFF;
  transform: translateY(-1px);
}

:deep(.el-pager li.is-active) {
  box-shadow: 0 2px 8px #a0cfff;
}

.player-dialog {
  :deep(.el-dialog) {
    border-radius: 16px;
    background: #f5f7fa;
    backdrop-filter: blur(20px);
    border: 1px solid #ebeef5;
    box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
    overflow: hidden;
  }

  :deep(.el-dialog__header) {
    padding: 16px 20px;
    margin-right: 0;
    border-bottom: 1px solid #ebeef5;
  }

  :deep(.el-dialog__title) {
    font-size: 15px;
    font-weight: 600;
    color: #303133;
  }

  :deep(.el-dialog__headerbtn) {
    top: 14px;
    right: 16px;
    width: 30px;
    height: 30px;
    border-radius: 6px;
    transition: all 0.2s;
  }

  :deep(.el-dialog__headerbtn:hover) {
    background: #ebeef5;
  }

  :deep(.el-dialog__close) {
    color: #909399;
    font-size: 18px;
  }

  :deep(.el-dialog__headerbtn:hover .el-dialog__close) {
    color: #409EFF;
  }

  :deep(.el-dialog__body) {
    padding: 0;
  }
}

.player-container {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #000;
  position: relative;
}

.player-controls {
  height: 20px;
  width: 100%;
  display: grid;
  grid-template-columns: 140px auto 140px;
  background-color: rgb(0, 0, 0);
}

.player-progress {
  width: 100%;
  height: 8px;
  margin: 6px 0;
  border-radius: 4px;
  border: 1px solid #505050;
  background-color: rgb(56, 56, 56);
  cursor: pointer;
  position: relative;
}

.player-time {
  color: #FFFFFF;
  text-align: center;
  font-size: 14px;
  line-height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.player-progress-bar {
  width: 100%;
  height: 6px;
  background-color: #409EFF;
  border-radius: 4px;
  transition: width 0.1s linear;
}

.player-progress-tooltip {
  width: fit-content;
  text-align: center;
  position: absolute;
  top: -35px;
  color: rgb(217, 217, 217);
  font-size: 14px;
  text-shadow: -1px -1px 0 black, 1px -1px 0 black, -1px 1px 0 black, 1px 1px 0 black;
  pointer-events: none;
  white-space: nowrap;
  z-index: 99;
}

.player-toolbar {
  height: 48px;
  background-color: #1a1a1a;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 0 16px;
}

.player-toolbar-left,
.player-toolbar-center,
.player-toolbar-right {
  display: flex;
  align-items: center;
}

.toolbar-btn {
  margin-left: 4px;
  background: rgba(255, 255, 255, 0.1);
  border: none;
  color: #fff;
  transition: all 0.2s;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
  }

  &.primary {
    background: #409EFF;
  }

  &.danger {
    background: rgba(245, 108, 108, 0.2);
  }

  &.speed-btn {
    border-radius: 12px;
    padding: 0 8px;
    height: 24px;
    display: flex;
    align-items: center;
    gap: 2px;
    font-size: 12px;
  }
}



/* 暗黑模式适配 */


  .table-wrapper {
    border-color: #dcdfe6;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.2);
  }

  .table-wrapper:hover {
    box-shadow: 0 4px 20px 0 rgba(0, 0, 0, 0.3);
  }

  .custom-table :deep(.el-table__header-wrapper th) {
    background-color: #fff !important;
  }

  .custom-table :deep(.el-table__row:hover) {
    background-color: #0c2a5e !important;
  }

  .custom-table :deep(.el-table__cell),
  .custom-table :deep(.el-table__cell *),
  .custom-table :deep(.el-link),
  .custom-table :deep(.el-link *),
  .custom-table :deep(.el-text),
  .custom-table :deep(.el-text *) {
    color: #ffffff !important;
  }

  .player-toolbar {
    background: linear-gradient(to bottom, #0d0d0d, #1a1a1a);
  }

  /* 播放器对话框暗黑模式 */
  .player-dialog :deep(.el-dialog) {
    background: #f5f7fa;
    border-color: #dcdfe6;
    box-shadow: 0 2px 12px 0 rgba(0,0,0,.3);
  }

  .player-dialog :deep(.el-dialog__header) {
    border-bottom-color: #dcdfe6;
  }

  /* 卡片暗黑增强 */
  .device-card {
    box-shadow: 0 2px 12px 0 rgba(0,0,0,.3);
  }

  .device-card:hover {
    box-shadow: 
      0 4px 8px rgba(0,0,0,0.35),
      0 12px 24px rgba(0,0,0,0.3),
      0 24px 48px rgba(0,0,0,0.2);
    border-color: #79bbff;
  }

  .device-card.is-selected {
    border-color: #409EFF;
    box-shadow:
      0 0 0 3px #ecf5ff,
      0 8px 24px -4px rgba(64, 158, 255, 0.25),
      0 4px 12px rgba(64, 158, 255, 0.15);
  }

  .card-header-area {
    background: linear-gradient(135deg, rgba(64, 158, 255, 0.12) 0%, #ebeef5 100%);
  }

  .info-tag,
  .info-channel {
    background: #ebeef5;
    border-color: #dcdfe6;
  }

  .info-tag:hover,
  .info-channel:hover {
    border-color: #79bbff;
    background: rgba(64, 158, 255, 0.08);
  }

  .card-toolbar {
    border-color: #dcdfe6;
  }

  .card-toolbar .el-button.btn-play {
    box-shadow: 0 2px 8px rgba(64, 158, 255, 0.35) !important;
  }

  .card-toolbar .el-button.btn-play:not(:disabled):hover {
    box-shadow: 0 4px 14px rgba(64, 158, 255, 0.5) !important;
  }
}

/* 滚动条美化 */
:deep(.el-table__body-wrapper::-webkit-scrollbar) {
  width: 6px;
  height: 6px;
}

:deep(.el-table__body-wrapper::-webkit-scrollbar-thumb) {
  background: #dcdfe6;
  border-radius: 3px;
  transition: background 0.3s;
}

:deep(.el-table__body-wrapper::-webkit-scrollbar-thumb:hover) {
  background: #a0cfff;
}

:deep(.el-table__body-wrapper::-webkit-scrollbar-track) {
  background: transparent;
}

.table-actions {
  display: flex;
  align-items: center;
  gap: 6px;
  justify-content: center;
}

.table-actions .el-button {
  padding: 7px 10px;
  height: auto;
  font-size: 14px;
  transition: all 0.2s ease;
}

.table-actions .el-button:hover {
  transform: scale(1.08);
}

.table-actions .el-button .el-icon {
  color: #ffffff !important;
}

.table-actions .el-button--primary,
.table-actions .el-button--primary[text],
.table-actions .el-button--primary[text][bg] {
  color: #ffffff !important;
  background-color: #409EFF !important;
  border-color: #409EFF !important;
}

.table-actions .el-button--success,
.table-actions .el-button--success[text],
.table-actions .el-button--success[text][bg] {
  color: #ffffff !important;
  background-color: #67C23A !important;
  border-color: #67C23A !important;
}

.table-actions .el-button--danger,
.table-actions .el-button--danger[text],
.table-actions .el-button--danger[text][bg] {
  color: #ffffff !important;
  background-color: #F56C6C !important;
  border-color: #F56C6C !important;
}

/* 悬停效果 - 保持白色图标 */
.table-actions .el-button--primary:hover,
.table-actions .el-button--primary[text]:hover,
.table-actions .el-button--primary[text][bg]:hover {
  background-color: #79bbff !important;
  border-color: #79bbff !important;
  color: #ffffff !important;
}

.table-actions .el-button--primary:hover .el-icon {
  color: #ffffff !important;
}

.table-actions .el-button--success:hover,
.table-actions .el-button--success[text]:hover,
.table-actions .el-button--success[text][bg]:hover {
  background-color: #95d475 !important;
  border-color: #95d475 !important;
  color: #ffffff !important;
}

.table-actions .el-button--success:hover .el-icon {
  color: #ffffff !important;
}

.table-actions .el-button--danger:hover,
.table-actions .el-button--danger[text]:hover,
.table-actions .el-button--danger[text][bg]:hover {
  background-color: #f89898 !important;
  border-color: #f89898 !important;
  color: #ffffff !important;
}

.table-actions .el-button--danger:hover .el-icon {
  color: #ffffff !important;
}

.table-actions .el-button--primary,
.table-actions .el-button--primary[text],
.table-actions .el-button--primary[text][bg] {
  color: #ffffff !important;
  background-color: #409EFF !important;
  border-color: #409EFF !important;
}

.table-actions .el-button--success,
.table-actions .el-button--success[text],
.table-actions .el-button--success[text][bg] {
  color: #ffffff !important;
  background-color: #67C23A !important;
  border-color: #67C23A !important;
}

.table-actions .el-button--danger,
.table-actions .el-button--danger[text],
.table-actions .el-button--danger[text][bg] {
  color: #ffffff !important;
  background-color: #F56C6C !important;
  border-color: #F56C6C !important;
}
</style>
