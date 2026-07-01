<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-col :span="5">
        <DeviceTree @clickEvent="clickEvent" :isContextmenu="false"></DeviceTree>
      </el-col>
      <el-col :span="19">
        <div id="live" class="live-container">
          <div v-loading="loading" class="live-content" element-loading-text="拼命加载中">
            <div class="video-container">
              <div class="control-bar">
                <div class="split-controls">
                  <span class="split-label">
                    <i class="el-icon-monitor"></i>
                    分屏
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
                    <el-button circle @click="handleClearAll" icon="el-icon-delete" class="toolbar-btn danger" />
                  </el-tooltip>
                  <el-tooltip content="保存布局" placement="top">
                    <el-button circle @click="handleSaveLayout" icon="el-icon-document" class="toolbar-btn" />
                  </el-tooltip>
                  <el-tooltip content="恢复布局" placement="top">
                    <el-button circle @click="handleRestoreLayout" icon="el-icon-refresh-left" class="toolbar-btn" />
                  </el-tooltip>
                  <el-tooltip content="全屏" placement="top">
                    <el-button circle @click="fullScreen()" icon="el-icon-full-screen" class="toolbar-btn" />
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
                    :style="layout[spiltIndex].style && layout[spiltIndex].style(i-1)"
                    @click="playerIdx = (i-1)"
                  >
                    <div v-if="!videoUrl[i-1]" class="no-signal">
                      <div class="no-signal-icon">
                        <i class="el-icon-video-play" style="font-size: 32px;"></i>
                      </div>
                      <span>{{ videoTip[i - 1] ? videoTip[i - 1] : "无信号" }}</span>
                    </div>
                    <div v-else class="player-wrapper">
                      <div class="close-btn" @click.stop="deleteClick(i-1)">
                        <i class="el-icon-close" style="font-size: 16px;"></i>
                      </div>
                      <EasyPlayer
                        :ref="`player${i-1}`"
                        :id="`player${i-1}`"
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
                        @ptz="(data) => handlePtz(data, i-1)"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div v-if="playerIdx >= 0 && videoUrl[playerIdx]" class="ptz-control">
              <el-card class="box-card">
                <div slot="header" class="clearfix">
                  <span>云台控制</span>
                </div>
                <div class="ptz-content">
                  <div class="speed-control">
                    <span>速度:</span>
                    <el-slider v-model="controSpeed" :min="1" :max="10" :step="1" />
                  </div>
                </div>
              </el-card>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import EasyPlayer from '@/components/nvr/EasyPlayer/index.vue'
import DeviceTree from '@/components/nvr/DeviceTree/index.vue'
import screenfull from 'screenfull'
import { getDevice } from '@/api/nvr/device'
import { streamPullPlay, streamPullPush } from '@/api/nvr/zlm'
import { rtpPlay } from '@/api/nvr/haikang'
import { startPtz, endPtz } from '@/api/nvr/gb28181'
import { loadRecord } from '@/api/nvr/cloudRecord'
import { startGb28181Play } from '@/api/nvr/gb28181'
import { startJt1078Play } from '@/api/nvr/jt1078'

const STORAGE_KEY = 'live_layout_config'

export default {
  name: 'Live',
  components: { EasyPlayer, DeviceTree },
  data() {
    return {
      loading: false,
      spiltIndex: 0,
      playerIdx: 0,
      videoUrl: [''],
      videoTip: [''],
      enableAudio: [''],
      deviceRows: [null],
      quality: [],
      defaultQuality: '',
      isPtz: false,
      isQuality: false,
      isLive: true,
      controSpeed: 5,
      lastPtzCommand: '',
      splitOptions: [
        { label: '1' }, { label: '4' }, { label: '6' }, { label: '9' },
        { label: '12' }, { label: '16' }, { label: '25' }
      ],
      layout: [
        { spilt: 1, columns: '1fr', rows: '1fr', style: () => ({}) },
        { spilt: 4, columns: '1fr 1fr', rows: '1fr 1fr', style: () => ({}) },
        { spilt: 6, columns: '1fr 1fr 1fr', rows: '1fr 1fr', style: () => ({}) },
        { spilt: 9, columns: '1fr 1fr 1fr', rows: '1fr 1fr 1fr', style: () => ({}) },
        { spilt: 12, columns: '1fr 1fr 1fr 1fr', rows: '1fr 1fr 1fr', style: () => ({}) },
        { spilt: 16, columns: '1fr 1fr 1fr 1fr', rows: '1fr 1fr 1fr 1fr', style: () => ({}) },
        { spilt: 25, columns: '1fr 1fr 1fr 1fr 1fr', rows: '1fr 1fr 1fr 1fr 1fr', style: () => ({}) }
      ]
    }
  },
  computed: {
    liveStyle() {
      const config = this.layout[this.spiltIndex]
      const gap = config.spilt <= 9 ? '8px' : (config.spilt <= 16 ? '6px' : '4px')
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
      const idxTmp = targetIdx !== undefined ? targetIdx : this.playerIdx
      if (loadingCounter) {
        loadingCounter.count++
        this.loading = true
      } else {
        this.loading = true
      }
      this.$set(this.videoTip, idxTmp, '正在拉流...')
      try {
        const res = await getDevice(id)
        const row = res.data
        if (row.type === '1' || row.type === '2' || row.type === '3' || row.type === '4' || row.type === '5') {
          let data = {
            deviceId: row.id, app: '', stream: row.deviceCode,
            url: row.liveAddress, enable_audio: false, enable_mp4: false,
            rtp_type: '1', timeOut: 10
          }
          if (row.type === '1') data.app = 'rtsp'
          else if (row.type === '2') data.app = 'rtmp'
          else if (row.type === '3') data.app = 'flv'
          else if (row.type === '4') data.app = 'hls'
          else if (row.type === '5') data.app = 'onvif'
          if (row.type === '3' && row.flvType === 'ws' && row.liveAddress != null) {
            data.url = this.convertWsToHttp(row.liveAddress)
          }
          if (row.protocol === 'UDP') data.rtp_type = '0'
          else if (row.protocol === 'TCP') data.rtp_type = '1'
          if (row.enableAudio === '1') data.enable_audio = true
          if (row.enableMp4 === '1') data.enable_mp4 = true
          const playRes = await streamPullPlay(data)
          await this.$nextTick()
          let videoUrl = location.protocol === 'https:' ? playRes.data.wss_flv : playRes.data.ws_flv
          this.setPlayUrl(videoUrl, idxTmp)
          this.setEnableAudio(row.enableAudio, idxTmp)
          this.quality = []
          this.defaultQuality = ''
          this.isPtz = row.type === '5' || row.type === '12'
          this.isQuality = false
          this.isLive = true
          this.$set(this.deviceRows, idxTmp, row)
          await this.$nextTick()
          const playerRef = this.$refs['player' + idxTmp]
          if (playerRef && playerRef.length > 0) playerRef[0].play(videoUrl)
        } else if (row.type === '6') {
          const playRes = await loadRecord(row.id)
          await this.$nextTick()
          let videoUrl = location.protocol === 'https:' ? playRes.data.wss_flv : playRes.data.ws_flv
          this.setPlayUrl(videoUrl, idxTmp)
          this.setEnableAudio(row.enableAudio, idxTmp)
          this.quality = []
          this.defaultQuality = ''
          this.isPtz = row.type === '5' || row.type === '12'
          this.isQuality = false
          this.isLive = true
          this.$set(this.deviceRows, idxTmp, row)
          await this.$nextTick()
          const playerRef = this.$refs['player' + idxTmp]
          if (playerRef && playerRef.length > 0) playerRef[0].play(videoUrl)
        } else if (row.type === '7' || row.type === '8' || row.type === '9') {
          let data = { app: 'haikang', streamId: row.deviceCode, tcpMode: '0', type: row.type, id: row.id }
          if (row.type === '7') data.app = 'haikang'
          else if (row.type === '8') data.app = 'haikang_isup'
          else if (row.type === '9') data.app = 'dahua'
          const playRes = await rtpPlay(data)
          await this.$nextTick()
          let videoUrl = location.protocol === 'https:' ? playRes.data.wss_flv : playRes.data.ws_flv
          this.setPlayUrl(videoUrl, idxTmp)
          this.setEnableAudio(row.enableAudio, idxTmp)
          this.quality = []
          this.defaultQuality = ''
          this.isPtz = row.type === '5' || row.type === '12'
          this.isQuality = false
          this.isLive = true
          this.$set(this.deviceRows, idxTmp, row)
          await this.$nextTick()
          const playerRef = this.$refs['player' + idxTmp]
          if (playerRef && playerRef.length > 0) playerRef[0].play(videoUrl)
        } else if (row.type === '13') {
          const playRes = await streamPullPush(row.id)
          await this.$nextTick()
          let videoUrl = location.protocol === 'https:' ? playRes.data.wss_flv : playRes.data.ws_flv
          this.setPlayUrl(videoUrl, idxTmp)
          this.setEnableAudio(row.enableAudio, idxTmp)
          this.quality = []
          this.defaultQuality = ''
          this.isPtz = row.type === '5' || row.type === '12'
          this.isQuality = false
          this.isLive = true
          this.$set(this.deviceRows, idxTmp, row)
          await this.$nextTick()
          const playerRef = this.$refs['player' + idxTmp]
          if (playerRef && playerRef.length > 0) playerRef[0].play(videoUrl)
        } else if (row.type === '12') {
          const playRes = await startGb28181Play(row.id)
          await this.$nextTick()
          let videoUrl = location.protocol === 'https:' ? playRes.data.wss_flv : playRes.data.ws_flv
          this.setPlayUrl(videoUrl, idxTmp)
          this.setEnableAudio(row.enableAudio, idxTmp)
          this.quality = []
          this.defaultQuality = ''
          this.isPtz = row.type === '5' || row.type === '12'
          this.isQuality = false
          this.isLive = true
          this.$set(this.deviceRows, idxTmp, row)
          await this.$nextTick()
          const playerRef = this.$refs['player' + idxTmp]
          if (playerRef && playerRef.length > 0) playerRef[0].play(videoUrl)
        } else if (row.type === '14') {
          const playRes = await startJt1078Play(row.id)
          await this.$nextTick()
          let videoUrl = location.protocol === 'https:' ? playRes.data.wss_flv : playRes.data.ws_flv
          this.setPlayUrl(videoUrl, idxTmp)
          this.setEnableAudio(row.enableAudio, idxTmp)
          this.quality = []
          this.defaultQuality = ''
          this.isPtz = row.type === '5' || row.type === '12'
          this.isQuality = false
          this.isLive = true
          this.$set(this.deviceRows, idxTmp, row)
          await this.$nextTick()
          const playerRef = this.$refs['player' + idxTmp]
          if (playerRef && playerRef.length > 0) playerRef[0].play(videoUrl)
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
    setEnableAudio(url, idx) {
      this.$set(this.enableAudio, idx, url)
    },
    fullScreen() {
      if (screenfull.isEnabled) {
        screenfull.toggle(this.$refs.playBox)
      }
    },
    deleteClick(index) {
      this.$confirm('是否删除该播放端口?', '温馨提示！', {
        confirmButtonText: '确实', cancelButtonText: '取消', type: 'warning'
      }).then(() => {
        this.videoUrl.splice(index, 1)
        this.videoTip.splice(index, 1)
        this.deviceRows.splice(index, 1)
        this.$modal.msgSuccess('删除成功')
      }).catch(() => {})
    },
    handleSplitChange(index) {
      this.spiltIndex = index
      const targetLength = this.layout[index].spilt
      while (this.videoUrl.length < targetLength) {
        this.videoUrl.push('')
        this.videoTip.push('')
        this.enableAudio.push('')
        this.deviceRows.push(null)
      }
    },
    handleClearAll() {
      this.$confirm('确定要清空所有分屏播放吗?', '温馨提示！', {
        confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning'
      }).then(() => {
        const total = this.layout[this.spiltIndex].spilt
        this.videoUrl = Array(total).fill('')
        this.videoTip = Array(total).fill('')
        this.enableAudio = Array(total).fill('')
        this.deviceRows = Array(total).fill(null)
        this.$modal.msgSuccess('清空成功')
      }).catch(() => {})
    },
    handleSaveLayout() {
      const config = {
        spiltIndex: this.spiltIndex,
        videoUrl: [...this.videoUrl],
        videoTip: [...this.videoTip],
        enableAudio: [...this.enableAudio],
        deviceRows: [...this.deviceRows]
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(config))
      this.$modal.msgSuccess('布局已保存')
    },
    async handleRestoreLayout() {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        try {
          const config = JSON.parse(saved)
          this.spiltIndex = config.spiltIndex
          const targetLength = this.layout[this.spiltIndex].spilt
          while (this.videoUrl.length < targetLength) {
            this.videoUrl.push('')
            this.videoTip.push('')
            this.enableAudio.push('')
            this.deviceRows.push(null)
          }
          this.videoUrl = [...config.videoUrl]
          this.videoTip = [...config.videoTip]
          this.enableAudio = [...config.enableAudio]
          this.deviceRows = config.deviceRows ? [...config.deviceRows] : []
          this.$modal.msgSuccess('布局已恢复')
          await this.$nextTick()
          await this.restorePlayStreams()
        } catch (e) {
          console.error('恢复布局失败', e)
        }
      }
    },
    async restorePlayStreams() {
      const loadingCounter = { count: 0 }
      const promises = []
      for (let i = 0; i < this.deviceRows.length; i++) {
        const device = this.deviceRows[i]
        if (device && device.id) {
          this.$set(this.videoTip, i, '正在恢复...')
          promises.push(this.sendDevicePush(device.id, i, loadingCounter))
        }
      }
      await Promise.all(promises)
    },
    convertWsToHttp(wsUrl) {
      if (!wsUrl) return wsUrl
      const regex = /^wss?:\/\//
      if (regex.test(wsUrl)) {
        if (wsUrl.startsWith('wss://')) return wsUrl.replace(regex, 'https://')
        else return wsUrl.replace(regex, 'http://')
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
  .live-content { flex-direction: column; }
}
.video-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border-radius: 20px;
  position: relative;
  margin: 0;
}
.control-bar {
  height: auto;
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
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
}
.split-controls { display: flex; align-items: center; gap: 16px; flex-wrap: wrap; }
.split-label {
  font-size: 15px; font-weight: 700; color: #303133;
  letter-spacing: 0.3px; display: flex; align-items: center; gap: 6px;
  i { color: #409EFF; }
}
.split-grid { display: flex; gap: 6px; }
.split-item {
  display: flex; flex-direction: column; align-items: center; gap: 4px;
  padding: 6px 8px; border-radius: 8px; cursor: pointer;
  transition: all 0.3s; background: transparent; border: 2px solid transparent;
  &:hover { background: rgba(64,158,255,0.08); transform: translateY(-2px); }
  &.active {
    background: linear-gradient(135deg, rgba(64,158,255,0.15) 0%, rgba(64,158,255,0.1) 100%);
    border-color: #409EFF;
    box-shadow: 0 4px 16px rgba(64,158,255,0.25);
  }
}
.split-preview { width: 36px; height: 30px; display: grid; gap: 2px; padding: 3px; }
.split-preview[data-split="1"] { grid-template-columns: 1fr; grid-template-rows: 1fr; }
.split-preview[data-split="4"] { grid-template-columns: 1fr 1fr; grid-template-rows: 1fr 1fr; }
.split-preview[data-split="6"] { grid-template-columns: 1fr 1fr 1fr; grid-template-rows: 1fr 1fr; }
.split-preview[data-split="9"] { grid-template-columns: 1fr 1fr 1fr; grid-template-rows: 1fr 1fr 1fr; }
.split-preview[data-split="12"] { grid-template-columns: 1fr 1fr 1fr 1fr; grid-template-rows: 1fr 1fr 1fr; }
.split-preview[data-split="16"] { grid-template-columns: 1fr 1fr 1fr 1fr; grid-template-rows: 1fr 1fr 1fr 1fr; }
.split-preview[data-split="25"] { grid-template-columns: repeat(5, 1fr); grid-template-rows: repeat(5, 1fr); }
.preview-dot {
  background: #c0c4cc; border-radius: 4px; transition: all 0.3s ease;
}
.split-item.active .preview-dot {
  background: #409EFF; box-shadow: 0 0 8px rgba(64,158,255,0.5);
}
.split-text {
  font-size: 10px; font-weight: 600; color: #909399; transition: color 0.3s ease;
}
.split-item.active .split-text { color: #409EFF; }
.toolbar-right { display: flex; align-items: center; gap: 12px; }
.toolbar-btn {
  width: 40px; height: 40px; color: #409EFF;
  background: rgba(64,158,255,0.08); border: none;
  transition: all 0.25s;
  &:hover { background: #409EFF; color: white; transform: scale(1.05); box-shadow: 0 4px 12px rgba(64,158,255,0.3); }
  &.danger { color: #F56C6C; background: rgba(245,108,108,0.08); }
  &.danger:hover { background: #F56C6C; color: white; box-shadow: 0 4px 12px rgba(245,108,108,0.3); }
}
.player-container { flex: 1; display: flex; justify-content: center; align-items: center; overflow: hidden; padding-top: 10px; }
.play-grid { width: 100%; height: 100%; display: grid; }
.play-box {
  background: linear-gradient(135deg, #0f0f23 0%, #1a1a2e 100%);
  border-radius: 12px; display: flex; align-items: center; justify-content: center;
  overflow: hidden; position: relative; border: 2px solid transparent;
  transition: all 0.4s; box-shadow: 0 8px 24px rgba(64,158,255,0.12);
  &:hover { border-color: #409EFF; transform: translateY(-4px); z-index: 10; }
  &.active { border-color: #409EFF; box-shadow: 0 0 0 4px rgba(64,158,255,0.12), 0 12px 40px rgba(64,158,255,0.18); z-index: 5; }
}
.no-signal { display: flex; flex-direction: column; align-items: center; gap: 12px; color: #909399; }
.no-signal-icon {
  display: flex; align-items: center; justify-content: center;
  width: 64px; height: 64px; border-radius: 20px;
  background: rgba(107,114,128,0.1); color: #6b7280;
}
.no-signal span { font-size: 13px; font-weight: 600; letter-spacing: 1.5px; text-transform: uppercase; color: #9ca3af; }
.player-wrapper { width: 100%; height: 100%; position: relative; }
.close-btn {
  position: absolute; top: 10px; right: 10px; z-index: 100;
  width: 32px; height: 32px; border-radius: 10px;
  background: rgba(239,68,68,0.95); display: flex; align-items: center; justify-content: center;
  cursor: pointer; transition: all 0.3s; color: white;
  box-shadow: 0 4px 16px rgba(239,68,68,0.4); opacity: 0;
}
.play-box:hover .close-btn { opacity: 1; }
.close-btn:hover { background: #ef4444; transform: scale(1.15) rotate(90deg); }
.easy-player { width: 100%; height: 100%; }
.ptz-control { position: absolute; bottom: 20px; right: 20px; z-index: 100; }
@media (max-width: 768px) {
  .control-bar { flex-direction: column; padding: 16px; }
  .split-controls, .toolbar-right { width: 100%; justify-content: center; }
  .split-grid { flex-wrap: wrap; justify-content: center; }
  .player-container { padding: 12px; }
}
</style>
