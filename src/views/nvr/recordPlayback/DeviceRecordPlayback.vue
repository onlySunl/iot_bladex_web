<template>

  <div class="app-container">
    <el-row :gutter="0">
      <splitpanes class="default-theme record-splitpanes">
        <pane size="20">
          <el-col class="tree-col">
            <div class="panel-header">
              <div class="header-accent"></div>
              <div class="header-icon-wrap">
                <i class="el-icon-video-camera"></i>
              </div>
              <span>设备列表</span>
              <div class="header-switch">
                <el-switch
                    v-model="showRegion"
                    active-text="行政区划"
                    inactive-text="业务分组"
                    @change="handleTreeTypeChange"
                />
              </div>
            </div>
            <div class="tree-container">
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
              <div v-if="showRegion">
                <RegionTree
                    ref="regionTree"
                    :showIndex="false"
                    :showContextmenu="false"
                    :hasDevice="true"
                    @handleNodeClick="handleDeviceClick"
                    :isContextmenu="false"
                />
              </div>
              <div v-else>
                <GroupTree
                    ref="groupTree"
                    :showIndex="false"
                    :showContextmenu="false"
                    :hasDevice="true"
                    @handleNodeClick="handleDeviceClick"
                    :isContextmenu="false"
                />
              </div>
            </div>
          </el-col>
        </pane>

        <pane size="80">
          <el-col class="player-col">
            <div class="panel-header">
              <div class="header-accent"></div>
              <div class="header-icon-wrap">
                <i class="el-icon-monitor"></i>
              </div>
              <span>录像播放</span>
              <span v-if="currentDevice" class="device-name">{{ currentDevice.deviceName }}</span>
            </div>
            <div class="player-area">
              <div id="recordPlayer" class="device-record-wrapper">
                <div class="player-container" :style="'height:' + jessibucaHeight">
                  <div v-if="!currentDevice" class="player-empty-overlay">
                    <div class="empty-content">
                      <div class="empty-icon-wrap">
                        <el-icon size="64"><VideoPlay /></el-icon>
                      </div>
                      <div class="empty-text">
                        {{ !currentDevice ? '请选择设备' : '暂无录像数据' }}
                      </div>
                      <div v-if="currentDevice" class="empty-hint">
                        当前设备在所选日期无录像
                      </div>
                    </div>
                  </div>
                  <EasyPlayer
                    v-if="wsUrl && currentDevice"
                    :style="'height:' + jessibucaHeight"
                    :ref="'EasyPlayerRef_' + currentDevice.id"
                    :id="`EasyPlayerRef_${currentDevice.id}`"
                    style="width: 100%"
                    width="100"
                    height="100"
                    @error="easyPlayeError"
                    @play="handlePlaySuccess"
                    :isPercentage="true"
                    :quality="quality"
                    :defaultQuality="defaultQuality"
                    :isPtz="isPtz"
                    :isQuality="isQuality"
                    :hasAudio="false"
                    :isMute="true"
                    :isLive="isLive"
                    :videoUrl="wsUrl"
                  />
                </div>

                <div class="player-option-box" :class="{ 'timeline-disabled': !currentDevice || timeSegments.length === 0 }">
                  <VideoTimeline
                      ref="Timeline"
                      :init-time="initTime"
                      :time-segments="timeSegments"
                      :init-zoom-index="4"
                      :enable-zoom="!!currentDevice && timeSegments.length > 0"
                      :enable-drag="!!currentDevice && timeSegments.length > 0"
                      :show-hover-time="!!currentDevice && timeSegments.length > 0"
                      @timeChange="playTimeChange"
                      @dragTimeChange="playTimeChange"
                      @mousedown="timelineMouseDown"
                      @mouseup="mouseupTimeline"
                  />
                  <div v-if="showTime && playTime && currentDevice && timeSegments.length > 0" class="time-line-show">
                    <span>{{ showTimeValue }}</span>
                  </div>
                </div>

                <div class="player-toolbar" :class="{ 'disabled': !currentDevice || timeSegments.length === 0 }">
                  <div class="player-toolbar-left">
                    <el-tooltip content="截图" placement="top">
                      <el-button circle size="small" class="toolbar-btn" :disabled="!currentDevice || timeSegments.length === 0" @click="snap">
                        <i class="el-icon-camera"></i>
                      </el-button>
                    </el-tooltip>
                    <el-tooltip content="下载" placement="top">
                      <el-button circle size="small" class="toolbar-btn" :disabled="!currentDevice || timeSegments.length === 0">
                        <i class="el-icon-download"></i>
                      </el-button>
                    </el-tooltip>
                  </div>

                  <div class="player-toolbar-center">
                    <el-tooltip :content="playing ? '停止' : '播放'" placement="top">
                      <el-button
                          circle
                          :class="playing ? 'toolbar-btn stop-btn' : 'toolbar-btn play-btn'"
                          :disabled="!currentDevice || timeSegments.length === 0"
                          @click="playing ? stopPlay() : playRecord()"
                      >
                        <i v-if="playing" class="el-icon-video-pause"></i>
                        <i v-else class="el-icon-video-play"></i>
                      </el-button>
                    </el-tooltip>
                    <el-dropdown :popper-append-to-body="false" :disabled="!currentDevice || timeSegments.length === 0">
                      <el-button class="toolbar-btn speed-btn" size="small" :disabled="!currentDevice || timeSegments.length === 0">
                        1X
                        <i class="el-icon-arrow-down"></i>
                      </el-button>
                      <template slot="dropdown">
                        <el-dropdown-menu class="speed-dropdown-menu">
                          <el-dropdown-item>1X</el-dropdown-item>
                          <el-dropdown-item>2X</el-dropdown-item>
                          <el-dropdown-item>4X</el-dropdown-item>
                        </el-dropdown-menu>
                      
</template>

<script>
import {getCurrentInstance, nextTick, onMounted, onUnmounted} from 'vue'
import screenfull from 'screenfull'
import { ElLoading, ElMessage } from 'element-plus'
import RegionTree from '@/views/components/common/RegionTree.vue'
import GroupTree from '@/views/components/common/GroupTree.vue'
import {Pane, Splitpanes} from 'splitpanes'
import 'splitpanes/dist/splitpanes.css'
import {getDevice} from "@/api/nvr/device"
import {queryDeviceRecord} from "@/api/nvr/gb28181"
import {queryDaHuaRecord} from "@/api/nvr/dahua"
import {queryHaiKangRecord} from "@/api/nvr/haikang"
import {queryHaiKangIsupRecord} from "@/api/nvr/haikang-isup"
import {queryOnvifRecord} from "@/api/nvr/onvif"
import {queryJt1078Record} from "@/api/nvr/jt1078"
import {rtpPlayback, stopRtpPlayback, onvifPlayback, stopOnvifPlayback, startGb28181Playback, stopGb28181Playback} from "@/api/nvr/zlm"
import moment from 'moment'
import VideoTimeline from '@/views/components/common/VideoTimeLine/index.vue'
import EasyPlayer from '@/components/nvr/EasyPlayer'

export default {
  name: 'DeviceRecordPlayback',
  data() {
    return {
      recordList: [],
      showRegion: false,
      initTime: moment(,
      timeSegments: [],
      showTime: true,
      showTimeValue: '',
      quality: ['普清', '高清', '超清'],
      defaultQuality: '高清',
      isPtz: true,
      isQuality: true,
      isLive: true,
      wsUrl: '',
      playing: false,
      isPaused: false,
      isFullScreen: false,
      Timeline: null,
    }
  },
  mounted() {
    document.addEventListener('fullscreenchange', updateFullscreenState)
      setTimeout(()=>{
        nextTick(()=>{
          this.selectedDate = moment().format('YYYY-MM-DD')
          this.timeSegments = []
        })
      },300)
  },
  beforeDestroy() {
    document.removeEventListener('fullscreenchange', updateFullscreenState)
      // 关闭加载动画
      if (loadingInstance) {
        loadingInstance.close()
        loadingInstance = null
      }
  },
  methods: {
    playTimeChange(time) {
      this.playTime = time
        this.showTimeValue = moment(time).format('YYYY-MM-DD HH:mm:ss')
    },
    timelineMouseDown() {
      isDraggingTimeline = true
        if (animationFrameId) {
          cancelAnimationFrame(animationFrameId)
          animationFrameId = null
        }
    },
    mouseupTimeline() {
      // 只有真正拖动过时间轴才执行
        if (!isDraggingTimeline) {
          return
        }
        
        isDraggingTimeline = false
        
        // 找到整个录像的最早开始时间和最晚结束时间
        let overallStartTime = Infinity
        let overallEndTime = 0
        if (this.recordList.length > 0) {
          for (let i = 0; i < this.recordList.length; i++) {
            const recStartTime = new Date(this.recordList[i].startTime || this.recordList[i].start).getTime()
            const recEndTime = new Date(this.recordList[i].endTime || this.recordList[i].end).getTime()
            if (recStartTime < overallStartTime) overallStartTime = recStartTime
            if (recEndTime > overallEndTime) overallEndTime = recEndTime
          }
        }
        
        // 检查是否小于整个录像的开始时间
        if (this.playTime < overallStartTime && this.recordList.length > 0) {
          this.playTime = overallStartTime
          if (this.Timeline && this.Timeline.setTime) {
            this.Timeline.setTime(this.playTime)
          }
        }
        
        // 检查是否大于整个录像的结束时间
        if (this.playTime > overallEndTime && this.recordList.length > 0) {
          this.playTime = overallEndTime
          if (this.Timeline && this.Timeline.setTime) {
            this.Timeline.setTime(this.playTime)
          }
        }
        
        if (playDebounceTimer) {
          clearTimeout(playDebounceTimer)
        }
        
        playDebounceTimer = window.setTimeout(async () => {
          if (this.playing || this.isPaused) {
            isDraggingStop = true
            await stopPlay()
            setTimeout(() => {
              playRecord()
            }, 300)
          } else {
            if (this.selectedRecord || this.recordList.length > 0) {
              playRecord()
            }
          }
        }, 200)
    },
    findRecordByTime(time) {
      for (const record of this.recordList) {
          const recStartTime = new Date(record.startTime || record.start).getTime()
          const recEndTime = new Date(record.endTime || record.end).getTime()
          if (time >= recStartTime && time <= recEndTime) {
            return record
          }
        }
        return null
    },
    handlePlaySuccess() {
      // 播放成功后启动时间轴动画
        lastUpdateTime = performance.now()
        if (this.currentStartTime && this.currentEndTime) {
          startSmoothAnimation(this.currentStartTime, this.currentEndTime)
        }
        // 关闭加载动画
        if (loadingInstance) {
          loadingInstance.close()
          loadingInstance = null
        }
    },
    async playRecord() {
      // 如果是暂停后恢复播放
        if (this.isPaused && this.wsUrl) {
          this.playing = true
          this.isPaused = false
          if (proxy && this.$refs && this.$refs['EasyPlayerRef_' + this.currentDevice.id]) {
            this.$refs['EasyPlayerRef_' + this.currentDevice.id].play()
          }
          handlePlaySuccess()
          return
        }
        
        // 否则是全新播放
        if (loadingInstance) {
          return
        }
        if (!this.currentDevice || this.timeSegments.length === 0) {
          return
        }
        
        if (this.playing) {
          await stopPlay()
        }
        
        // 显示加载动画
        loadingInstance = ElLoading.service({
          lock: true,
          text: '加载中...',
          background: 'rgba(0, 0, 0, 0.7)',
        })
      
        let targetRecord = findRecordByTime(this.playTime || 0)
        
        if (!targetRecord) {
          // 如果当前时间没有匹配的录像，使用第一段录像
          if (this.recordList.length > 0) {
            targetRecord = this.recordList[0]
            this.playTime = new Date(targetRecord.startTime || targetRecord.start).getTime()
          } else {
            loadingInstance.close()
            loadingInstance = null
            return
          }
        }
      
        // 找到整个录像的最早开始时间和最晚结束时间
        let overallStartTime = Infinity
        let overallEndTime = 0
        for (let i = 0; i < this.recordList.length; i++) {
          const recStartTime = new Date(this.recordList[i].startTime || this.recordList[i].start).getTime()
          const recEndTime = new Date(this.recordList[i].endTime || this.recordList[i].end).getTime()
          if (recStartTime < overallStartTime) overallStartTime = recStartTime
          if (recEndTime > overallEndTime) overallEndTime = recEndTime
        }
        
        this.selectedRecord = targetRecord
        
        const actualStartTimeVal = this.playTime || overallStartTime
        this.currentStartTime = actualStartTimeVal
        this.currentEndTime = overallEndTime
      
        this.playTime = actualStartTimeVal
        lastUpdateTime = performance.now()
      
        currentStreamId = `${this.currentDevice.deviceCode}_${Date.now()}`
        
        // GB28181 设备类型处理
        if (this.currentDevice.type == '12') {
          // GB28181 设备回放
          try {
            const res: any = await startGb28181Playback(
              this.currentDevice.id,
              moment(actualStartTimeVal).format('YYYY-MM-DD HH:mm:ss'),
              moment(overallEndTime).format('YYYY-MM-DD HH:mm:ss')
            )
            if (res && res.data) {
              if (location.protocol === 'https:') {
                this.wsUrl = res.data.wssFlv || res.data.wss_flv
              } else {
                this.wsUrl = res.data.wsFlv || res.data.ws_flv
              }
              this.playing = true
              this.isPaused = false
      
              await nextTick()
              setTimeout(async () => {
                await nextTick()
                if (proxy && this.$refs && this.$refs['EasyPlayerRef_' + this.currentDevice.id]) {
                  this.$refs['EasyPlayerRef_' + this.currentDevice.id].play()
                }
              }, 1000)
            } else {
              loadingInstance.close()
              loadingInstance = null
            }
          } catch (error) {
            console.error('播放失败', error)
            loadingInstance.close()
            loadingInstance = null
          }
        } else if (this.currentDevice.type == '5') {
          // ONVIF 设备播放
          const onvifParam: any = {
            deviceId: this.currentDevice.id,
            deviceIp: this.currentDevice.ipAddress || '',
            username: this.currentDevice.userName || '',
            password: this.currentDevice.password || '',
            recordingToken: targetRecord.recordingToken || '',
            trackToken: targetRecord.trackToken || '',
            app: 'onvif',
            stream: currentStreamId,
            enableAudio: true,
            rtpType: '0',
            timeOut: 30000
          }
          
          try {
            const res: any = await onvifPlayback(onvifParam)
            if (res && res.data) {
              if (location.protocol === 'https:') {
                this.wsUrl = res.data.wssFlv || res.data.wss_flv
              } else {
                this.wsUrl = res.data.wsFlv || res.data.ws_flv
              }
              this.playing = true
              this.isPaused = false
      
              await nextTick()
              setTimeout(async () => {
                await nextTick()
                if (proxy && this.$refs && this.$refs['EasyPlayerRef_' + this.currentDevice.id]) {
                  this.$refs['EasyPlayerRef_' + this.currentDevice.id].play()
                }
              }, 1000)
            } else {
              loadingInstance.close()
              loadingInstance = null
            }
          } catch (error) {
            console.error('播放失败', error)
            loadingInstance.close()
            loadingInstance = null
          }
        } else {
          // 其他设备类型处理
          const param: any = {
            id: this.currentDevice.id,
            app: this.currentDevice.type == '7' ? 'haikang' : this.currentDevice.type == '8' ? 'haikang_isup' : 'dahua',
            streamId: currentStreamId,
            type: this.currentDevice.type,
            tcpMode: 0,
            playback: true,
            channel: this.currentDevice.channel
          }
      
          // 使用整个录像的时间范围
          if (actualStartTimeVal && overallEndTime) {
            param.startTime = moment(actualStartTimeVal).format('YYYY-MM-DD HH:mm:ss')
            param.endTime = moment(overallEndTime).format('YYYY-MM-DD HH:mm:ss')
          }
      
          try {
            const res: any = await rtpPlayback(param)
            if (res && res.data) {
              if (location.protocol === 'https:') {
                this.wsUrl = res.data.wssFlv || res.data.wss_flv
              } else {
                this.wsUrl = res.data.wsFlv || res.data.ws_flv
              }
              this.playing = true
              this.isPaused = false
      
              await nextTick()
              setTimeout(async () => {
                await nextTick()
                if (proxy && this.$refs && this.$refs['EasyPlayerRef_' + this.currentDevice.id]) {
                  this.$refs['EasyPlayerRef_' + this.currentDevice.id].play()
                }
              }, 1000)
            } else {
              loadingInstance.close()
              loadingInstance = null
            }
          } catch (error) {
            console.error('播放失败', error)
            loadingInstance.close()
            loadingInstance = null
          }
        }
    },
    pausePlay() {
      if (proxy && this.$refs && this.$refs['EasyPlayerRef_' + this.currentDevice.id]) {
          this.$refs['EasyPlayerRef_' + this.currentDevice.id].pause()
        }
        this.playing = false
        this.isPaused = true
        if (animationFrameId) {
          cancelAnimationFrame(animationFrameId)
          animationFrameId = null
        }
    },
    async stopPlay() {
      // 关闭加载动画
        if (loadingInstance) {
          loadingInstance.close()
          loadingInstance = null
        }
      
        if (playDebounceTimer) {
          clearTimeout(playDebounceTimer)
          playDebounceTimer = null
        }
      
        if (this.currentDevice && proxy && this.$refs && this.$refs['EasyPlayerRef_' + this.currentDevice.id]) {
          this.$refs['EasyPlayerRef_' + this.currentDevice.id].destroy()
        }
      
        if (animationFrameId) {
          cancelAnimationFrame(animationFrameId)
          animationFrameId = null
        }
      
        if (this.currentDevice && currentStreamId) {
          try {
            // GB28181 设备类型处理
            if (this.currentDevice.type == '12') {
              await stopGb28181Playback(this.currentDevice.id)
            } else if (this.currentDevice.type == '5') {
              // ONVIF 设备类型处理
              const onvifParam: any = {
                deviceId: this.currentDevice.id,
                streamKey: currentStreamId,
                mediaServerId: this.currentDevice.playbackMediaServerId || '',
                playback: true
              }
              await stopOnvifPlayback(onvifParam)
            } else {
              // 其他设备类型处理
              const param: any = {
                id: this.currentDevice.id,
                app: this.currentDevice.type == '7' ? 'haikang' : this.currentDevice.type == '8' ? 'haikang_isup' : 'dahua',
                streamId: currentStreamId,
                type: this.currentDevice.type,
                tcpMode: 0,
                playback: true
              }
              await stopRtpPlayback(param)
            }
          } catch (error) {
            console.error('停止播放失败', error)
          }
        }
      
        this.playing = false
        this.isPaused = false
        this.wsUrl = ''
        
        // 只有不是拖动时才重置播放时间到开始
        if (!isDraggingStop && this.selectedRecord) {
          const startTimeVal = this.selectedRecord.startTime || this.selectedRecord.start
          this.playTime = new Date(startTimeVal).getTime()
          if (this.Timeline && this.Timeline.setTime) {
            this.Timeline.setTime(this.playTime)
          }
        }
        
        isDraggingStop = false
    },
    startSmoothAnimation(startTimeVal | string, endTimeVal | string) {
      lastTimelineUpdate = performance.now()
        
        // 找到整个录像的最早开始时间和最晚结束时间
        let overallStartTime = Infinity
        let overallEndTime = 0
        for (let i = 0; i < this.recordList.length; i++) {
          const recStartTime = new Date(this.recordList[i].startTime || this.recordList[i].start).getTime()
          const recEndTime = new Date(this.recordList[i].endTime || this.recordList[i].end).getTime()
          if (recStartTime < overallStartTime) overallStartTime = recStartTime
          if (recEndTime > overallEndTime) overallEndTime = recEndTime
        }
        
        const animate = () => {
          if (!this.playing || this.isPaused) {
            animationFrameId = null
            return
          }
          
          const now = performance.now()
          const deltaTime = now - lastUpdateTime
          lastUpdateTime = now
          
          const timeToAdd = deltaTime * this.playSpeed
          this.playTime += timeToAdd
          
          if (now - lastTimelineUpdate >= 100 && this.Timeline && this.Timeline.setTime) {
            this.Timeline.setTime(this.playTime)
            lastTimelineUpdate = now
          }
          
          // 使用整个录像的结束时间
          if (this.playTime >= overallEndTime) {
            this.playing = false
            animationFrameId = null
            return
          }
          
          animationFrameId = requestAnimationFrame(animate)
        }
        
        if (this.Timeline && this.Timeline.setTime) {
          this.Timeline.setTime(this.playTime)
        }
        
        animationFrameId = requestAnimationFrame(animate)
    },
    easyPlayeError() {
      // 关闭加载动画
        if (loadingInstance) {
          loadingInstance.close()
          loadingInstance = null
        }
        // 停止时间轴动画
        if (animationFrameId) {
          cancelAnimationFrame(animationFrameId)
          animationFrameId = null
        }
        // 重置播放状态
        this.playing = false
        this.isPaused = false
    },
    updateInitTimeByRecord(recordStartTime) {
      const dayStart = moment(this.selectedDate).startOf('day').valueOf()
        const recordTime = moment(recordStartTime).valueOf()
      
        if (recordTime >= dayStart) {
          this.initTime = recordTime
        } else {
          this.initTime = dayStart
        }
    },
    handleDateChange() {
      stopPlay()
        getList()
    },
    prevDay() {
      this.selectedDate = moment(this.selectedDate).subtract(1, 'day').format('YYYY-MM-DD')
        stopPlay()
        getList()
    },
    nextDay() {
      this.selectedDate = moment(this.selectedDate).add(1, 'day').format('YYYY-MM-DD')
        stopPlay()
        getList()
    },
    handleToday() {
      this.selectedDate = moment().format('YYYY-MM-DD')
        stopPlay()
        getList()
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
    fullScreen() {
      if (this.isFullScreen) {
          screenfull.exit()
          this.isFullScreen = false
          this.jessibucaHeight = document.documentElement.clientHeight - 310 + 'px;'
          return
        }
        screenfull.request(document.getElementById('recordPlayer'))
        screenfull.on('change', (event) => {
          this.isFullScreen = screenfull.isFullscreen
        })
        this.isFullScreen = true
        this.jessibucaHeight = '100%'
    },
    updateFullscreenState() {
      this.isFullScreen = !!document.fullscreenElement
        if (!this.isFullScreen) {
          screenfull.exit()
          this.isFullScreen = false
          this.jessibucaHeight = document.documentElement.clientHeight - 310 + 'px;'
        }
    },
  },
}
</script>

<style lang="scss" scoped>
@import './style.scss';

.device-record-wrapper {
  overflow: hidden;
  display: flex;
  flex-direction: column;
  background: #0a0a0a;
  border: 1px solid rgba(255, 255, 255, 0.06);
}

.player-option-box {
  height: 60px
}

.time-line-show {
  position: relative;
  color: rgba(250, 249, 249, 0.89);
  left: calc(50% - 85px);
  top: -72px;
  z-index: 99;
  text-shadow: 1px 0 #5f6b7c, -1px 0 #5f6b7c, 0 1px #5f6b7c, 0 -1px #5f6b7c, 1.1px 1.1px #5f6b7c, 1.1px -1.1px #5f6b7c, -1.1px 1.1px #5f6b7c, -1.1px -1.1px #5f6b7c;
}

.player-container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding-top: 10px;
}
</style>
