<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-col :span="5">
        <device-tree @clickEvent="clickEvent" :isContextmenu="false"></device-tree>
      </el-col>
      <el-col :span="19">
        <div id="live" class="live-container">
          <div v-loading="loading" class="live-content" element-loading-text="拼命加载中">
            <div class="video-container">
              <div class="control-bar">
                <div class="split-controls">
                  <span class="split-label">
                    <i class="el-icon-monitor"></i> 分屏
                  </span>
                  <div class="split-grid">
                    <div
                      v-for="(item, index) in splitOptions"
                      :key="index"
                      class="split-item"
                      :class="{ active: spiltIndex === index }"
                      @click="handleSplitChange(index)"
                    >
                      <div class="split-preview" :data-split="item.label">
                        <div v-for="i in parseInt(item.label)" :key="i" class="preview-dot"></div>
                      </div>
                      <span class="split-text">{{ item.label }}屏</span>
                    </div>
                  </div>
                </div>
                <div class="toolbar-right">
                  <el-tooltip content="一键清空" placement="top">
                    <el-button circle @click="handleClearAll" icon="el-icon-delete" class="toolbar-btn danger"></el-button>
                  </el-tooltip>
                  <el-tooltip content="保存布局" placement="top">
                    <el-button circle @click="handleSaveLayout" icon="el-icon-document" class="toolbar-btn"></el-button>
                  </el-tooltip>
                  <el-tooltip content="恢复布局" placement="top">
                    <el-button circle @click="handleRestoreLayout" icon="el-icon-refresh-left" class="toolbar-btn"></el-button>
                  </el-tooltip>
                  <el-tooltip content="全屏" placement="top">
                    <el-button circle @click="fullScreen" icon="el-icon-full-screen" class="toolbar-btn"></el-button>
                  </el-tooltip>
                </div>
              </div>
              <div class="player-container">
                <div ref="playBox" class="play-grid" :style="liveStyle">
                  <div
                    v-for="i in layout[spiltIndex].spilt"
                    :key="i"
                    class="play-box"
                    :class="{ active: playerIdx === (i-1) }"
                    @click="playerIdx = (i-1)"
                  >
                    <div v-if="!videoUrl[i-1]" class="no-signal">
                      <div class="no-signal-icon">
                        <i class="el-icon-video-play" style="font-size: 32px;"></i>
                      </div>
                      <span>{{ videoTip[i - 1] ? videoTip[i - 1] : '无信号' }}</span>
                    </div>
                    <div v-else class="player-wrapper">
                      <div class="close-btn" @click.stop="deleteClick(i-1)">
                        <i class="el-icon-close" style="font-size: 16px;"></i>
                      </div>
                      <easy-player
                        :ref="'player' + (i-1)"
                        :id="'player' + (i-1)"
                        class="easy-player"
                        width="100"
                        height="100"
                        :isPercentage="true"
                        :quality="quality"
                        :defaultQuality="defaultQuality"
                        :isPtz="isPtz"
                        :isQuality="isQuality"
                        :hasAudio="enableAudio[i-1] === '1'"
                        :isMute="enableAudio[i-1] === '1'"
                        :isLive="isLive"
                        :videoUrl="videoUrl[i-1]"
                        @ptz="handlePtz($event, i-1)"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import EasyPlayer from '@/components/nvr/EasyPlayer'
import DeviceTree from '@/components/nvr/DeviceTree'
import screenFull from 'screenfull'
import { loadRecord, rtpPlay, streamPullPlay, streamPullPush, startGb28181Play, startJt1078Play } from '@/api/nvr/zlm'
import { getDevice, getVideoSnapshot, startPtz, endPtz } from '@/api/nvr/device'

export default {
  name: 'Live',
  components: { EasyPlayer, DeviceTree },
  data() {
    return {
      STORAGE_KEY: 'live-layout-config',
      enableAudio: [''],
      videoUrl: [''],
      videoTip: [''],
      spiltIndex: 1,
      playerIdx: 0,
      count: 15,
      total: 0,
      loading: false,
      wsUrl: '',
      quality: ['普清', '高清', '超清'],
      defaultQuality: '高清',
      isPtz: true,
      isQuality: true,
      isLive: true,
      controSpeed: 5,
      controSpeedMax: 10,
      lastPtzCommand: 'up',
      deviceRows: [],
      splitOptions: [
        { label: '1', value: 0 },
        { label: '4', value: 1 },
        { label: '6', value: 2 },
        { label: '9', value: 3 },
        { label: '12', value: 4 },
        { label: '16', value: 5 },
        { label: '25', value: 6 }
      ],
      layout: [
        { spilt: 1, columns: '1fr', rows: '1fr' },
        { spilt: 4, columns: '1fr 1fr', rows: '1fr 1fr' },
        { spilt: 6, columns: '1fr 1fr 1fr', rows: '1fr 1fr' },
        { spilt: 9, columns: '1fr 1fr 1fr', rows: '1fr 1fr 1fr' },
        { spilt: 12, columns: '1fr 1fr 1fr 1fr', rows: '1fr 1fr 1fr' },
        { spilt: 16, columns: '1fr 1fr 1fr 1fr', rows: '1fr 1fr 1fr 1fr' },
        { spilt: 25, columns: '1fr 1fr 1fr 1fr 1fr', rows: '1fr 1fr 1fr 1fr 1fr' }
      ]
    }
  },
  computed: {
    liveStyle() {
      var config = this.layout[this.spiltIndex]
      var gap = config.spilt <= 9 ? '8px' : (config.spilt <= 16 ? '6px' : '4px')
      return {
        display: 'grid',
        gridTemplateColumns: config.columns,
        gridTemplateRows: config.rows,
        gap: gap
      }
    }
  },
  mounted() {
    this.handleRestoreLayout()
  },
  methods: {
    clickEvent(id) {
      this.sendDevicePush(id)
    },
    async sendDevicePush(id, targetIdx, loadingCounter) {
      var idxTmp = targetIdx !== undefined ? targetIdx : this.playerIdx
      if (loadingCounter) {
        loadingCounter.count++
        this.loading = true
      } else {
        this.loading = true
      }
      this.$set(this.videoTip, idxTmp, '正在拉流...')
      try {
        var res = await getDevice(id)
        var row = res.data
        if (row.type === '1' || row.type === '2' || row.type === '3' || row.type === '4' || row.type === '5') {
          var data = {
            deviceId: row.id,
            app: '',
            stream: row.deviceCode,
            url: row.liveAddress,
            enable_audio: false,
            enable_mp4: false,
            rtp_type: '1',
            timeOut: 10
          }
          if (row.type === '1') data.app = 'rtsp'
          else if (row.type === '2') data.app = 'rtmp'
          else if (row.type === '3') data.app = 'flv'
          else if (row.type === '4') data.app = 'hls'
          else if (row.type === '5') data.app = 'onvif'
          if (row.type === '3' && row.flvType === 'ws' && row.liveAddress) {
            data.url = this.convertWsToHttp(row.liveAddress)
          }
          if (row.protocol === 'UDP') data.rtp_type = '0'
          else if (row.protocol === 'TCP') data.rtp_type = '1'
          if (row.enableAudio === '1') data.enable_audio = true
          if (row.enableMp4 === '1') data.enable_mp4 = true
          var playRes = await streamPullPlay(data)
          await this.$nextTick()
          var videoUrl = location.protocol === 'https:' ? playRes.data.wss_flv : playRes.data.ws_flv
          this.setPlayUrl(videoUrl, idxTmp)
          this.setEnableAudio(row.enableAudio, idxTmp)
          this.quality = []
          this.defaultQuality = ''
          this.isPtz = row.type === '5' || row.type === '12'
          this.isQuality = false
          this.isLive = true
          this.$set(this.deviceRows, idxTmp, row)
          await this.$nextTick()
          var playerRef = this.$refs['player' + idxTmp]
          if (playerRef && playerRef.length > 0) {
            playerRef[0].play(videoUrl)
          }
        } else if (row.type === '6') {
          var playRes2 = await loadRecord(row.id)
          await this.$nextTick()
          var videoUrl2 = location.protocol === 'https:' ? playRes2.data.wss_flv : playRes2.data.ws_flv
          this.setPlayUrl(videoUrl2, idxTmp)
          this.setEnableAudio(row.enableAudio, idxTmp)
          this.quality = []
          this.defaultQuality = ''
          this.isPtz = row.type === '5' || row.type === '12'
          this.isQuality = false
          this.isLive = true
          this.$set(this.deviceRows, idxTmp, row)
          await this.$nextTick()
          var playerRef2 = this.$refs['player' + idxTmp]
          if (playerRef2 && playerRef2.length > 0) {
            playerRef2[0].play(videoUrl2)
          }
          getVideoSnapshot(row.id)
        } else if (row.type === '7' || row.type === '8' || row.type === '9') {
          var rtpData = { app: 'haikang', streamId: row.deviceCode, tcpMode: '0', type: row.type, id: row.id }
          if (row.type === '7') rtpData.app = 'haikang'
          else if (row.type === '8') rtpData.app = 'haikang_isup'
          else if (row.type === '9') rtpData.app = 'dahua'
          var playRes3 = await rtpPlay(rtpData)
          await this.$nextTick()
          var videoUrl3 = location.protocol === 'https:' ? playRes3.data.wss_flv : playRes3.data.ws_flv
          this.setPlayUrl(videoUrl3, idxTmp)
          this.setEnableAudio(row.enableAudio, idxTmp)
          this.quality = []
          this.defaultQuality = ''
          this.isPtz = row.type === '5' || row.type === '12'
          this.isQuality = false
          this.isLive = true
          this.$set(this.deviceRows, idxTmp, row)
          await this.$nextTick()
          var playerRef3 = this.$refs['player' + idxTmp]
          if (playerRef3 && playerRef3.length > 0) {
            playerRef3[0].play(videoUrl3)
          }
        } else if (row.type === '13') {
          var playRes4 = await streamPullPush(row.id)
          await this.$nextTick()
          var videoUrl4 = location.protocol === 'https:' ? playRes4.data.wss_flv : playRes4.data.ws_flv
          this.setPlayUrl(videoUrl4, idxTmp)
          this.setEnableAudio(row.enableAudio, idxTmp)
          this.quality = []
          this.defaultQuality = ''
          this.isPtz = row.type === '5' || row.type === '12'
          this.isQuality = false
          this.isLive = true
          this.$set(this.deviceRows, idxTmp, row)
          await this.$nextTick()
          var playerRef4 = this.$refs['player' + idxTmp]
          if (playerRef4 && playerRef4.length > 0) {
            playerRef4[0].play(videoUrl4)
          }
        } else if (row.type === '12') {
          var playRes5 = await startGb28181Play(row.id)
          await this.$nextTick()
          var videoUrl5 = location.protocol === 'https:' ? playRes5.data.wss_flv : playRes5.data.ws_flv
          this.setPlayUrl(videoUrl5, idxTmp)
          this.setEnableAudio(row.enableAudio, idxTmp)
          this.quality = []
          this.defaultQuality = ''
          this.isPtz = row.type === '5' || row.type === '12'
          this.isQuality = false
          this.isLive = true
          this.$set(this.deviceRows, idxTmp, row)
          await this.$nextTick()
          var playerRef5 = this.$refs['player' + idxTmp]
          if (playerRef5 && playerRef5.length > 0) {
            playerRef5[0].play(videoUrl5)
          }
        } else if (row.type === '14') {
          var playRes6 = await startJt1078Play(row.id)
          await this.$nextTick()
          var videoUrl6 = location.protocol === 'https:' ? playRes6.data.wss_flv : playRes6.data.ws_flv
          this.setPlayUrl(videoUrl6, idxTmp)
          this.setEnableAudio(row.enableAudio, idxTmp)
          this.quality = []
          this.defaultQuality = ''
          this.isPtz = row.type === '5' || row.type === '12'
          this.isQuality = false
          this.isLive = true
          this.$set(this.deviceRows, idxTmp, row)
          await this.$nextTick()
          var playerRef6 = this.$refs['player' + idxTmp]
          if (playerRef6 && playerRef6.length > 0) {
            playerRef6[0].play(videoUrl6)
          }
        }
      } catch (err) {
        console.error('拉流失败', err)
        this.$set(this.videoTip, idxTmp, '播放失败')
      } finally {
        if (loadingCounter) {
          loadingCounter.count--
          if (loadingCounter.count === 0) this.loading = false
        } else {
          this.loading = false
        }
      }
    },
    setPlayUrl(url, idx) {
      this.$set(this.videoUrl, idx, url)
    },
    setEnableAudio(val, idx) {
      this.$set(this.enableAudio, idx, val)
    },
    fullScreen() {
      if (screenFull.isEnabled) {
        screenFull.toggle(this.$refs.playBox)
      }
    },
    deleteClick(index) {
      this.$confirm('是否删除该播放端口?', '温馨提示！', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function() {
        this.videoUrl.splice(index, 1)
        this.videoTip.splice(index, 1)
        this.deviceRows.splice(index, 1)
        this.$modal.msgSuccess('删除成功')
      }.bind(this)).catch(function() {})
    },
    handleSplitChange(index) {
      this.spiltIndex = index
      var targetLength = this.layout[index].spilt
      while (this.videoUrl.length < targetLength) {
        this.videoUrl.push('')
        this.videoTip.push('')
        this.enableAudio.push('')
        this.deviceRows.push(null)
      }
    },
    handleClearAll() {
      this.$confirm('确定要清空所有分屏播放吗?', '温馨提示！', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function() {
        var total = this.layout[this.spiltIndex].spilt
        this.videoUrl = Array(total).fill('')
        this.videoTip = Array(total).fill('')
        this.enableAudio = Array(total).fill('')
        this.deviceRows = Array(total).fill(null)
        this.$modal.msgSuccess('清空成功')
      }.bind(this)).catch(function() {})
    },
    handleSaveLayout() {
      var config = {
        spiltIndex: this.spiltIndex,
        videoUrl: this.videoUrl.slice(),
        videoTip: this.videoTip.slice(),
        enableAudio: this.enableAudio.slice(),
        deviceRows: this.deviceRows.slice()
      }
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(config))
      this.$modal.msgSuccess('布局已保存')
    },
    async handleRestoreLayout() {
      var saved = localStorage.getItem(this.STORAGE_KEY)
      if (saved) {
        try {
          var config = JSON.parse(saved)
          this.spiltIndex = config.spiltIndex
          var targetLength = this.layout[this.spiltIndex].spilt
          while (this.videoUrl.length < targetLength) {
            this.videoUrl.push('')
            this.videoTip.push('')
            this.enableAudio.push('')
            this.deviceRows.push(null)
          }
          this.videoUrl = config.videoUrl.slice()
          this.videoTip = config.videoTip.slice()
          this.enableAudio = config.enableAudio.slice()
          this.deviceRows = config.deviceRows ? config.deviceRows.slice() : []
          this.$modal.msgSuccess('布局已恢复')
          await this.$nextTick()
          await this.restorePlayStreams()
        } catch (e) {
          console.error('恢复布局失败', e)
        }
      }
    },
    async restorePlayStreams() {
      var loadingCounter = { count: 0 }
      var promises = []
      for (var i = 0; i < this.deviceRows.length; i++) {
        var device = this.deviceRows[i]
        if (device && device.id) {
          this.$set(this.videoTip, i, '正在恢复...')
          promises.push(this.sendDevicePush(device.id, i, loadingCounter))
        }
      }
      await Promise.all(promises)
    },
    convertWsToHttp(wsUrl) {
      if (!wsUrl) return wsUrl
      var regex = /^wss?:\/\//
      if (regex.test(wsUrl)) {
        if (wsUrl.indexOf('wss://') === 0) {
          return wsUrl.replace(regex, 'https://')
        } else {
          return wsUrl.replace(regex, 'http://')
        }
      }
      return wsUrl
    },
    async ptzCamera(command, idx) {
      if (!this.deviceRows[idx] || !this.deviceRows[idx].id) {
        this.$modal.msgError('请先选择设备')
        return
      }
      try {
        if (command !== 'stop') {
          await startPtz(this.deviceRows[idx].id, command, this.controSpeed)
        } else {
          await endPtz(this.deviceRows[idx].id, 'up', this.controSpeed)
        }
      } catch (error) {
        console.error('云台控制失败', error)
        this.$modal.msgError('云台控制失败')
      }
    },
    async handlePtz(data, idx) {
      if (!this.deviceRows[idx] || !this.deviceRows[idx].id) {
        this.$modal.msgError('请先选择设备')
        return
      }
      try {
        if (data === 'stop') {
          await endPtz(this.deviceRows[idx].id, this.lastPtzCommand, this.controSpeed)
        } else {
          this.lastPtzCommand = data
          await startPtz(this.deviceRows[idx].id, data, this.controSpeed)
        }
      } catch (error) {
        console.error('云台控制失败', error)
        this.$modal.msgError('云台控制失败')
      }
    }
  }
}
</script>

<style scoped lang="scss">
.live-container {
  height: calc(100vh - 124px);
  width: 100%;
}
.live-content {
  height: 100%;
  display: flex;
  flex-direction: row;
}
@media (max-width: 768px) {
  .live-content {
    flex-direction: column;
  }
}
.video-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border-radius: 8px;
  position: relative;
}
.control-bar {
  min-height: 64px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 24px;
  background: linear-gradient(135deg, rgba(255,255,255,0.98) 0%, rgba(248,250,252,0.98) 100%);
  border-bottom: 1px solid rgba(0,0,0,0.06);
  box-shadow: 0 4px 24px rgba(0,0,0,0.1);
  z-index: 10;
  flex-wrap: wrap;
  gap: 16px;
}
.split-controls {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
}
.split-label {
  font-size: 15px;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 6px;
}
.split-grid {
  display: flex;
  gap: 6px;
}
.split-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 6px 8px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
  background: transparent;
  border: 2px solid transparent;
  &:hover {
    background: rgba(64,158,255,0.08);
    transform: translateY(-2px);
  }
  &.active {
    background: rgba(64,158,255,0.15);
    border-color: #409EFF;
    box-shadow: 0 4px 16px rgba(64,158,255,0.25);
  }
}
.split-text {
  font-size: 12px;
}
.toolbar-right {
  display: flex;
  gap: 8px;
}
.toolbar-btn {
  &.danger {
    color: #F56C6C;
    border-color: #F56C6C;
  }
}
.player-container {
  flex: 1;
  padding: 8px;
  overflow: hidden;
}
.play-grid {
  height: 100%;
}
.play-box {
  position: relative;
  background: #000;
  border-radius: 4px;
  overflow: hidden;
  cursor: pointer;
  border: 2px solid transparent;
  &.active {
    border-color: #409EFF;
  }
}
.no-signal {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #999;
  background: #1a1a1a;
}
.no-signal-icon {
  margin-bottom: 8px;
}
.player-wrapper {
  width: 100%;
  height: 100%;
}
.close-btn {
  position: absolute;
  top: 4px;
  right: 4px;
  z-index: 10;
  color: #fff;
  cursor: pointer;
  background: rgba(0,0,0,0.5);
  border-radius: 50%;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  &:hover {
    background: rgba(245,108,108,0.8);
  }
}
.easy-player {
  width: 100%;
  height: 100%;
}
</style>
