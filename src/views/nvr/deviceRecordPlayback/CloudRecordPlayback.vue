<template>

  <div class="app-container">
    <el-row :gutter="0">
      <splitpanes class="default-theme record-splitpanes">
        <!-- 录像列表 -->
        <pane size="20">
          <el-col class="list-col">
            <div class="panel-header">
              <div class="header-accent"></div>
              <div class="header-icon-wrap">
                <i class="el-icon-video-play"></i>
              </div>
              <span>录像列表</span>
              <span class="device-name" v-if="currentDevice">{{ currentDevice.deviceName }}</span>
            </div>
            <div class="list-container">
              <!-- 日期选择 -->
              <div class="date-panel">
                <el-button :icon="ArrowLeft" @click="prevDay" circle class="date-nav-btn" />
                <el-date-picker
                  :clearable="false"
                  v-model="selectedDate"
                  type="date"
                  placeholder="选择日期"
                  format="YYYY-MM-DD"
                  value-format="YYYY-MM-DD"
                  @change="handleDateChange"
                  class="record-date-picker"
                />
                <el-button :icon="ArrowRight" @click="nextDay" circle class="date-nav-btn" />
                <el-button type="primary" @click="handleToday" plain class="today-btn">今天</el-button>
              </div>

              <!-- 录像列表 -->
              <div class="record-list" v-loading="loading">
                <div v-if="cloudRecordList.length > 0" class="record-items-wrap">
                  <div
                    v-for="(record, idx) in cloudRecordList"
                    :key="record.id"
                    class="record-item"
                    :class="{ active: selectedRecord && selectedRecord.id === record.id }"
                    @click="handleRecordItemClick(record)">
                    <div class="record-indicator">
                      <div class="record-dot"></div>
                      <div class="record-line" v-if="idx !== cloudRecordList.length - 1"></div>
                    </div>
                    <div class="record-body">
                      <div class="record-time">
                        <el-icon><Timer /></el-icon>
                        <span>{{ formatShortTime(record.startTime) }} - {{ formatShortTime(record.endTime) }}</span>
                      </div>
                      <div class="record-info">
                        <el-tag type="success" size="small" effect="light" class="duration-tag">
                          {{ formatTime(record.timeLen) }}
                        </el-tag>
                      </div>
                    </div>
                  </div>
                </div>
                <div v-else class="list-empty">
                  <div class="empty-animation">
                    <el-icon size="48"><VideoPlay /></el-icon>
                  </div>
                  <span>暂无录像数据</span>
                  <p v-if="currentDevice">当前设备在所选日期无录像</p>
                </div>
              </div>
            </div>
          </el-col>
        </pane>

        <!-- 右侧播放器 -->
        <pane size="80">
          <el-col class="player-col">
            <div class="panel-header">
              <div class="header-accent"></div>
              <div class="header-icon-wrap">
                <i class="el-icon-monitor"></i>
              </div>
              <span>录像播放</span>
              <span v-if="selectedRecord" class="record-meta">
                <el-icon size="12"><VideoCamera /></el-icon>
                {{ currentDevice?.deviceName || '' }} · {{ selectedDateText }} · {{ formatShortTime(selectedRecord.startTime) }}
              </span>
            </div>
            <div class="player-area">
              <div id="recordPlayer" class="player-wrapper">
                <div class="player-container" :style="'height:' + jessibucaHeight">
                  <!-- 空状态提示 -->
                  <div v-if="!selectedRecord" class="player-empty-overlay">
                    <div class="empty-content">
                      <div class="empty-icon-wrap">
                        <el-icon size="64"><VideoPlay /></el-icon>
                      </div>
                      <div class="empty-text">请选择录像文件</div>
                      <div class="empty-hint">在录像列表选择录像进行播放</div>
                    </div>
                  </div>
                  <!-- 播放器 -->
                  <EasyPlayer
                    v-else
                    :style="'height:' + jessibucaHeight"
                    :ref="'EasyPlayerRef_' + currentDevice.id"
                    :id="`EasyPlayerRef_${currentDevice.id}`"
                    style="width: 100%"
                    width="100"
                    height="100"
                    @error="easyPlayeError"
                    :isPercentage="true"
                    :quality="quality"
                    :defaultQuality="defaultQuality"
                    :isPtz="isPtz"
                    :isQuality="isQuality"
                    :hasAudio="true"
                    :isMute="true"
                    :isLive="isLive"
                    :videoUrl="wsUrl"
                  />
                </div>

                <div class="player-controls" :class="{ 'disabled': !selectedRecord }">
                  <div class="player-time start-time">{{ showPlayTimeValue }}</div>
                  <div class="player-progress-wrap">
                    <div
                      class="player-progress"
                      ref="timeProcess"
                      @click="selectedRecord && timeProcessClick($event)"
                      @mouseenter="selectedRecord && timeProcessMouseEnter($event)"
                      @mousemove="selectedRecord && timeProcessMouseMove($event)"
                      @mouseleave="selectedRecord && timeProcessMouseLeave($event)"
                    >
                      <div v-if="streamInfo" class="player-progress-track">
                        <div class="player-progress-bar" :style="playTimeValue"></div>
                        <div class="player-progress-glow" :style="playTimeValue"></div>
                      </div>
                      <transition name="el-fade-in-linear">
                        <div v-show="showTimeLeft" class="player-progress-tooltip" :style="playTimeTitleStyle">
                          <div class="tooltip-arrow"></div>
                          {{ showPlayTimeTitle }}
                        </div>
                      </transition>
                    </div>
                  </div>
                  <div class="player-time end-time">{{ showPlayTimeTotal }}</div>
                </div>

                <div class="player-toolbar" :class="{ 'disabled': !selectedRecord }">
                  <div class="player-toolbar-left">
                    <el-tooltip content="截图" placement="top">
                      <el-button circle size="small" class="toolbar-btn" :disabled="!selectedRecord" @click="snap">
                        <i class="el-icon-camera"></i>
                      </el-button>
                    </el-tooltip>
                    <el-tooltip content="刷新" placement="top">
                      <el-button circle size="small" class="toolbar-btn" :disabled="!selectedRecord" @click="refresh">
                        <i class="el-icon-refresh"></i>
                      </el-button>
                    </el-tooltip>
                    <el-tooltip content="下载" placement="top">
                      <el-button circle size="small" class="toolbar-btn" :disabled="!selectedRecord" @click="download">
                        <i class="el-icon-download"></i>
                      </el-button>
                    </el-tooltip>
                  </div>

                  <div class="player-toolbar-center">
                    <el-tooltip content="快退五秒" placement="top">
                      <el-button circle size="small" class="toolbar-btn" :disabled="!selectedRecord" @click="seekBackward">
                        <el-icon><DArrowLeft /></el-icon>
                      </el-button>
                    </el-tooltip>
                    <el-tooltip content="停止" placement="top">
                      <el-button circle class="toolbar-btn stop-btn" :disabled="!selectedRecord" @click="stopPLay">
                        <i class="el-icon-video-pause"></i>
                      </el-button>
                    </el-tooltip>
                    <el-tooltip :content="playing ? '暂停' : '播放'" placement="top">
                      <el-button
                        circle
                        class="toolbar-btn play-btn"
                        :disabled="!selectedRecord"
                        @click="playing ? pausePlay() : playRecord()"
                      >
                        <i v-if="playing" class="el-icon-video-pause"></i>
                        <i v-else class="el-icon-video-play"></i>
                      </el-button>
                    </el-tooltip>
                    <el-tooltip content="快进五秒" placement="top">
                      <el-button circle size="small" class="toolbar-btn" :disabled="!selectedRecord" @click="seekForward">
                        <el-icon><DArrowRight /></el-icon>
                      </el-button>
                    </el-tooltip>
                    <el-dropdown @command="changePlaySpeed" :popper-append-to-body="false" :disabled="!selectedRecord">
                      <el-button class="toolbar-btn speed-btn" size="small" :disabled="!selectedRecord">
                        {{ playSpeed }}X
                        <i class="el-icon-arrow-down"></i>
                      </el-button>
                      <template slot="dropdown">
                        <el-dropdown-menu class="speed-dropdown-menu">
                          <el-dropdown-item
                            v-for="item in playSpeedRange"
                            :key="item"
                            :command="item"
                            :class="{ 'is-active': playSpeed === item }"
                          >{{ item }}X</el-dropdown-item>
                        </el-dropdown-menu>
                      
</template>

<script>
import screenfull from 'screenfull'
import moment from 'moment'
import EasyPlayer from '@/components/nvr/EasyPlayer'
import { Pane, Splitpanes } from 'splitpanes'
import 'splitpanes/dist/splitpanes.css'
import { closeStreams, listAllCloudRecord, loadRecord, seekCloudRecord, setCloudRecordSpeed } from '@/api/nvr/cloudRecord'
import { getDevice } from '@/api/nvr/device'

export default {
  name: 'el-fade-in-linear',
  data() {
    return {
      isInitialLoading: true,
      easyPlayerOpen: false,
      cloudRecordRow: {},
      rtcUrl: '',
      flvUrl: '',
      wsUrl: '',
      tabActiveName: 'media',
      quality: ['普清', '高清', '超清'],
      defaultQuality: '高清',
      isPtz: true,
      isQuality: true,
      isLive: true,
      currentWidth: 0,
      playerTime: 0,
      step: 0,
      playing: false,
      isFullScreen: false,
      playSpeedRange: [1, 2, 4],
      isPaused: false,
      app: undefined,
      stream: undefined,
      queryStartTime: undefined,
      queryEndTime: undefined,
    }
  },
  computed: {
    showPlayTimeValue() {
      return return this.streamInfo === null ? '--:--:-- --:--:--' : this.selectedRecord ? formatTimeStamp(this.selectedRecord.startTime) : '--:--:-- --:--:--'
    },
    showPlayTimeTotal() {
      return if (this.streamInfo === null || !this.selectedRecord) {
    return '--:--:-- --:--:--'
  } else {
    return formatTimeStamp(this.selectedRecord.endTime)
  }
    },
    showPlayTimeTitle() {
      return if (this.showTimeLeft && this.timeLen && this.selectedRecord) {
    let time = (this.showTimeLeft / (this.$refs['timeProcess'] as HTMLElement).clientWidth) * this.timeLen
    let realTime = (this.timeLen / this.selectedRecord.timeLen) * time + this.selectedRecord.startTime
    return `${moment(time + 1000).format('mm:ss')}(${moment(realTime).format('HH:mm:ss')})`
  } else {
    return ''
  }
    },
    playTimeTitleStyle() {
      return return { left: (this.showTimeLeft || 0) - 32 + 'px' }
    },
    playTimeValue() {
      return return { width: this.currentWidth + '%' }
    },
  },
  mounted() {
    document.addEventListener('fullscreenchange', updateFullscreenState)
      // 初始加载设备
      if (props.deviceId) {
        loadDevice(props.deviceId)
      }
  },
  beforeDestroy() {
    document.removeEventListener('fullscreenchange', updateFullscreenState)
      handleCloseStreams()
  },
  methods: {
    download() {
      if (!this.selectedRecord) {
          return
        }
        const link = document.createElement('a')
        link.target = '_blank'
        let baseUri = process.env.VITE_APP_BASE_API
        let downloadUrl = `${location.origin}${baseUri}/zlm/cloudRecord/download/zip?ids=${this.selectedRecord.id}`
        link.href = downloadUrl
        link.click()
    },
    stopPLay() {
      if (this.$refs['EasyPlayerRef_' + this.currentDevice.id]) {
          this.$refs['EasyPlayerRef_' + this.currentDevice.id].destroy()
        }
        this.playing = false
        this.playSpeed = 1
        handleCloseStreams()
    },
    timeProcessClick(event) {
      if (!this.timeLen) return
        let x = event.offsetX
        let clientWidth = (this.$refs['timeProcess'] as HTMLElement).clientWidth
        seekRecord((x / clientWidth) * this.timeLen)
    },
    seekRecord(playSeekValue) {
      if (!this.streamInfo) return
        seekCloudRecord({
          mediaServerId: this.streamInfo.mediaServerId,
          app: this.streamInfo.app,
          stream: this.streamInfo.stream,
          stamp: playSeekValue,
          schema: 'fmp4'
        }).then((data) => {
          this.currentWidth = (playSeekValue / 1000) * this.step
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
      if (!time) return ''
        return moment.unix(time / 1000).format('YYYY-MM-DD HH:mm:ss')
    },
    formatShortTime(time) {
      if (!time) return ''
        return moment.unix(time / 1000).format('HH:mm')
    },
    formatTime(time) {
      if (!time) return '0秒'
        const h = parseInt(String(time / 3600 / 1000))
        const minute = parseInt(String((time - h * 3600 * 1000) / 60 / 1000))
        let second = Math.ceil((time - h * 3600 * 1000 - minute * 60 * 1000) / 1000)
        if (second < 0) second = 0
        return (h > 0 ? h + 'h' : '') + (minute > 0 ? minute + 'm' : '') + (second > 0 ? second + 's' : '')
    },
    handleCloseStreams() {
      this.streamInfo = null
        this.currentWidth = 0
        this.playerTime = 0
        this.playSpeed = 1
        this.isPaused = false
        if (this.timer) {
          clearInterval(this.timer) // 停止计时器
        }
        if (this.selectedRecord) {
          closeStreams(this.selectedRecord.id)
        }
    },
    easyPlayeError() {
      if (this.timer) {
          clearInterval(this.timer) // 停止计时器
        }
        this.currentWidth = 0
        this.playerTime = 0
        this.playSpeed = 1
        this.isPaused = false
    },
    async handleCopy(text) {
      if (!text) {
          this.$modal.msgError('内容为空，无法复制')
          return
        }
        try {
          await toClipboard(text)
          this.$modal.msgSuccess('成功拷贝到粘贴板')
        } catch (e) {
          console.error(e)
        }
    },
    fullScreen() {
      if (this.isFullScreen) {
          screenfull.exit()
          this.isFullScreen = false
          this.jessibucaHeight = document.documentElement.clientHeight - 300 + 'px;'
          return
        }
        screenfull.request(document.getElementById('recordPlayer'))
        screenfull.on('change', (event) => {
          this.isFullScreen = screenfull.isFullscreen
        })
        this.isFullScreen = true
        this.jessibucaHeight = '100%'
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
        }).then((res) => {})
    },
    pausePlay() {
      if (this.$refs['EasyPlayerRef_' + this.currentDevice.id]) {
          this.$refs['EasyPlayerRef_' + this.currentDevice.id].pause()
        }
        this.playing = false
        togglePause()
    },
    playRecord() {
      this.playing = true
        togglePause()
        if (!this.streamInfo && this.selectedRecord) {
          handlePlay(this.selectedRecord)
          return
        }
        if (this.$refs['EasyPlayerRef_' + this.currentDevice.id]) {
          this.$refs['EasyPlayerRef_' + this.currentDevice.id].play()
        }
    },
    togglePause() {
      this.isPaused = !this.isPaused
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
    snap() {
      if (this.$refs['EasyPlayerRef_' + this.currentDevice.id]) {
          this.$refs['EasyPlayerRef_' + this.currentDevice.id].screenshot()
        }
    },
    refresh() {
      if (this.$refs['EasyPlayerRef_' + this.currentDevice.id]) {
          this.$refs['EasyPlayerRef_' + this.currentDevice.id].play()
        }
    },
    updateFullscreenState() {
      this.isFullScreen = !!document.fullscreenElement
        if (!this.isFullScreen) {
          screenfull.exit()
          this.isFullScreen = false
          this.jessibucaHeight = document.documentElement.clientHeight - 300 + 'px;'
        }
    },
  },
}
</script>

<style lang="scss" scoped>
@import './style.scss';
</style>
