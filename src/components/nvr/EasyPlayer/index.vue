<template>
  <div
    class="easy-player-wrapper"
    :class="{
      'is-loading': isLoading,
      'is-error': hasError,
      'is-fullscreen': isFullscreen
    }"
    :style="wrapperStyle"
  >
    <div class="player-container">
      <div class="player_box" :id="id ? id : 'player_box'"/>
    </div>

    <div v-if="poster && !isPlaying && !hasError" class="player-poster" :style="{ backgroundImage: 'url(' + poster + ')' }">
      <div class="poster-overlay">
        <div class="play-button" @click="handlePlayClick">
          <i class="el-icon-video-play" style="font-size: 48px; color: #fff;"></i>
        </div>
        <div v-if="videoTitle" class="poster-title">{{ videoTitle }}</div>
      </div>
    </div>

    <div v-if="isLoading" class="player-loading">
      <div class="loading-spinner"><div class="spinner-ring"></div></div>
      <div class="loading-text">正在加载视频...</div>
      <div class="loading-sub">{{ loadingProgress }}</div>
    </div>

    <div v-if="hasError" class="player-error">
      <div class="error-icon"><i class="el-icon-warning" style="font-size: 40px; color: #f56c6c;"></i></div>
      <div class="error-title">视频加载失败</div>
      <div class="error-desc">请检查网络连接或视频地址是否正确</div>
      <el-button type="primary" class="error-retry" @click="handleRetry">
        <i class="el-icon-refresh-right"></i> 重新加载
      </el-button>
    </div>

    <div v-if="videoTitle && isPlaying" class="player-info-bar">
      <div class="info-left">
        <i class="el-icon-video-camera info-icon"></i>
        <span class="info-title">{{ videoTitle }}</span>
      </div>
      <div class="info-right">
        <span v-if="isLive" class="live-badge"><span class="live-dot"></span> 直播中</span>
      </div>
    </div>

    <div v-if="showCustomControls && isPlaying" class="player-controls-overlay">
      <div class="controls-main">
        <el-button type="text" class="control-btn" @click="togglePlay">
          <i :class="isPlayingState ? 'el-icon-video-pause' : 'el-icon-video-play'" style="font-size: 18px;"></i>
        </el-button>
        <el-button type="text" class="control-btn" @click="toggleMute">
          <i :class="isMuted ? 'el-icon-mute' : 'el-icon-microphone'" style="font-size: 18px;"></i>
        </el-button>
        <el-button type="text" class="control-btn" @click="handleScreenshot">
          <i class="el-icon-camera" style="font-size: 18px;"></i>
        </el-button>
        <el-button type="text" class="control-btn" @click="handleFullscreen">
          <i class="el-icon-full-screen" style="font-size: 18px;"></i>
        </el-button>
      </div>
    </div>

    <div v-if="showNetworkStatus && networkStatus" class="network-status" :class="networkStatus.type">
      <i class="el-icon-connection" style="font-size: 14px;"></i>
      <span>{{ networkStatus.text }}</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'EasyPlayer',
  props: {
    videoUrl: { type: String, default: '' },
    width: { type: [Number, String], default: 1000 },
    height: { type: [Number, String], default: 500 },
    isPercentage: { type: Boolean, default: false },
    isLive: { type: Boolean, default: true },
    hasAudio: { type: Boolean, default: true },
    watermark: { type: Object, default: null },
    fullWatermark: { type: Object, default: null },
    quality: { type: Array, default: function() { return ['普清', '高清', '超清'] } },
    defaultQuality: { type: String, default: '高清' },
    isPtz: { type: Boolean, default: true },
    isQuality: { type: Boolean, default: true },
    poster: { type: String, default: '' },
    isMute: { type: Boolean, default: true },
    id: { type: String, default: '' },
    videoTitle: { type: String, default: '' },
    showCustomControls: { type: Boolean, default: false },
    showNetworkStatus: { type: Boolean, default: false }
  },
  data: function() {
    return {
      easyplayer: null,
      live: 'STOP',
      isLoading: false,
      hasError: false,
      isPlaying: false,
      isPlayingState: false,
      isMuted: this.isMute,
      isFullscreen: false,
      loadingProgress: '',
      networkStatus: null
    }
  },
  computed: {
    wrapperStyle: function() {
      var w = typeof this.width === 'number' ? this.width + 'px' : this.width
      var h = typeof this.height === 'number' ? this.height + 'px' : this.height
      return { width: w, height: h }
    }
  },
  watch: {
    videoUrl: function(newUrl) {
      if (newUrl && this.easyplayer) {
        this.hasError = false
        this.isLoading = true
        this.play(newUrl)
      }
    }
  },
  mounted: function() {
    if (this.videoUrl) {
      this.isLoading = true
      this.playCreate()
    }
  },
  beforeDestroy: function() {
    if (this.easyplayer) {
      this.destroy()
    }
  },
  methods: {
    playCreate: function() {
      var self = this
      var container = this.id
        ? document.getElementById(this.id)
        : document.getElementById('player_box')
      if (!container) return

      var config = {
        isLive: this.isLive,
        hasAudio: this.hasAudio,
        isMute: this.isMute,
        stretch: false,
        poster: this.poster,
        bufferTime: 0.2,
        loadTimeOut: 10,
        loadTimeReplay: 3,
        MSE: false, WCS: false, WASM: false, WASMSIMD: false,
        gpuDecoder: false, isFlv: false, webGPU: false, canvasRender: false,
        isRtcSRS: false, isRtcZLM: false, isFlow: false,
        quality: this.quality,
        defaultQuality: this.defaultQuality,
        ptzConfig: { ptz: true, ptzMore: true },
        debug: false,
        isBand: true,
        btns: {
          play: true, audio: true, record: true, zoom: true,
          ptz: this.isPtz, quality: this.isQuality,
          stretch: true, screenshot: true, fullscreen: true
        }
      }
      if (this.watermark) config.watermark = this.watermark
      if (this.fullWatermark) config.fullWatermark = this.fullWatermark

      try {
        self.easyplayer = new window.EasyPlayerPro(container, config)
        self.bindEvents()
      } catch (e) {
        console.error('EasyPlayer init failed:', e)
        self.hasError = true
        self.isLoading = false
      }
    },
    bindEvents: function() {
      var self = this
      if (!self.easyplayer) return

      self.easyplayer.on('play', function(data) {
        self.isLoading = false
        self.isPlaying = true
        self.isPlayingState = true
        self.$emit('play', data)
      })
      self.easyplayer.on('pause', function(data) {
        self.isPlayingState = false
        self.$emit('pause', data)
      })
      self.easyplayer.on('fullscreen', function(data) {
        self.isFullscreen = data
        self.$emit('fullscreen', data)
      })
      self.easyplayer.on('mute', function(data) { self.isMuted = data })
      self.easyplayer.on('screenshots', function(data) { self.$emit('screenshot', data) })
      self.easyplayer.on('error', function(data) {
        self.isLoading = false
        self.hasError = true
        self.$emit('error', data)
      })
      self.easyplayer.on('timeout', function() {
        self.isLoading = false
        self.hasError = true
      })
      self.easyplayer.on('liveEnd', function() { self.isPlayingState = false })
      self.easyplayer.on('kBps', function(data) {
        if (!self.showNetworkStatus) return
        var speed = Number(data)
        if (speed > 500) self.networkStatus = { type: 'excellent', text: '网络优秀 ' + speed + 'KB/s' }
        else if (speed > 200) self.networkStatus = { type: 'good', text: '网络良好 ' + speed + 'KB/s' }
        else if (speed > 50) self.networkStatus = { type: 'normal', text: '网络一般 ' + speed + 'KB/s' }
        else self.networkStatus = { type: 'poor', text: '网络较差 ' + speed + 'KB/s' }
      })
      self.easyplayer.on('ptz', function(data) {
        var unsupported = ['leftUp', 'leftdown', 'rightup', 'rightdown', 'upleft', 'downleft', 'upright', 'downright']
        if (unsupported.indexOf(data) >= 0) return
        self.$emit('ptz', data)
      })
    },
    play: function(url) {
      var targetUrl = url || this.videoUrl
      if (!targetUrl) return
      this.hasError = false
      this.isLoading = true
      if (this.easyplayer && this.live === 'STOP') {
        this.live = 'LIVE'
        this.easyplayer.play(targetUrl)
      } else if (this.easyplayer && this.live === 'PAUSE') {
        this.live = 'LIVE'
        this.easyplayer.play(targetUrl)
      } else if (!this.easyplayer) {
        this.playCreate()
        this.live = 'LIVE'
        if (this.easyplayer) this.easyplayer.play(targetUrl)
      }
    },
    playback: function(url) {
      if (!url) return
      this.hasError = false
      this.isLoading = true
      if (this.easyplayer) this.easyplayer.playback(url)
    },
    pause: function() {
      this.live = 'PAUSE'
      if (this.easyplayer) this.easyplayer.pause()
    },
    togglePlay: function() {
      if (this.isPlayingState) this.pause()
      else this.play()
    },
    setMute: function(mute) {
      if (this.easyplayer) this.easyplayer.setMute(mute)
    },
    toggleMute: function() { this.setMute(!this.isMuted) },
    isMute: function() { return this.easyplayer ? this.easyplayer.isMute() : false },
    screenshot: function(data) { if (this.easyplayer) this.easyplayer.screenshot(data) },
    handleScreenshot: function() {
      this.screenshot({ name: 'screenshot', type: 'png', compress: 0.8, download: 'download' })
    },
    setFullscreen: function() { if (this.easyplayer) this.easyplayer.setFullscreen() },
    exitFullscreen: function() { if (this.easyplayer) this.easyplayer.exitFullscreen() },
    handleFullscreen: function() {
      if (this.isFullscreen) this.exitFullscreen()
      else this.setFullscreen()
    },
    setQuality: function() { if (this.easyplayer) this.easyplayer.setQuality() },
    setRate: function() { if (this.easyplayer) this.easyplayer.setRate() },
    seekTime: function() { if (this.easyplayer) this.easyplayer.seekTime() },
    getVideoInfo: function() { return this.easyplayer ? this.easyplayer.getVideoInfo() : null },
    getAudioInfo: function() { return this.easyplayer ? this.easyplayer.getAudioInfo() : null },
    setMic: function(mic) { if (this.easyplayer) this.easyplayer.setMic(mic) },
    destroy: function() {
      if (this.easyplayer) {
        this.live = 'STOP'
        this.easyplayer.destroy()
        this.easyplayer = null
      }
    },
    handlePlayClick: function() { if (this.videoUrl) this.play(this.videoUrl) },
    handleRetry: function() {
      this.hasError = false
      this.isLoading = true
      if (this.easyplayer) this.destroy()
      this.playCreate()
      if (this.videoUrl) this.play(this.videoUrl)
    }
  }
}
</script>

<style scoped>
.easy-player-wrapper { position: relative; background-color: #000; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.08); transition: box-shadow 250ms ease; }
.easy-player-wrapper:hover { box-shadow: 0 8px 24px rgba(0,0,0,0.12); }
.easy-player-wrapper.is-fullscreen { border-radius: 0; box-shadow: none; }
.player-container { width: 100%; height: 100%; position: relative; }
.player_box { width: 100%; height: 100%; }
.player-poster { position: absolute; top: 0; left: 0; right: 0; bottom: 0; background-size: cover; background-position: center; z-index: 10; cursor: pointer; }
.poster-overlay { position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.3) 60%, rgba(0,0,0,0.6) 100%); display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 16px; }
.play-button { width: 64px; height: 64px; border-radius: 50%; background: rgba(255,255,255,0.15); backdrop-filter: blur(8px); display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 200ms ease; }
.play-button:hover { background: rgba(255,255,255,0.25); transform: scale(1.1); }
.poster-title { color: #fff; font-size: 16px; font-weight: 500; text-shadow: 0 2px 4px rgba(0,0,0,0.5); }
.player-loading { position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.7); display: flex; flex-direction: column; align-items: center; justify-content: center; z-index: 20; }
.loading-spinner { position: relative; width: 48px; height: 48px; }
.spinner-ring { position: absolute; width: 100%; height: 100%; border: 3px solid transparent; border-top-color: #409eff; border-radius: 50%; animation: spin 1s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }
.loading-text { color: #fff; margin-top: 16px; font-size: 14px; }
.loading-sub { color: rgba(255,255,255,0.6); margin-top: 4px; font-size: 12px; }
.player-error { position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.8); display: flex; flex-direction: column; align-items: center; justify-content: center; z-index: 20; }
.error-icon { margin-bottom: 12px; }
.error-title { color: #fff; font-size: 16px; font-weight: 500; margin-bottom: 8px; }
.error-desc { color: rgba(255,255,255,0.6); font-size: 13px; margin-bottom: 16px; }
.player-info-bar { position: absolute; top: 0; left: 0; right: 0; padding: 8px 12px; background: linear-gradient(180deg, rgba(0,0,0,0.6) 0%, transparent 100%); display: flex; align-items: center; justify-content: space-between; z-index: 15; }
.info-left { display: flex; align-items: center; gap: 8px; }
.info-icon { color: #fff; font-size: 16px; }
.info-title { color: #fff; font-size: 13px; font-weight: 500; }
.live-badge { display: flex; align-items: center; gap: 4px; padding: 2px 8px; background: rgba(245,108,108,0.9); border-radius: 4px; color: #fff; font-size: 11px; font-weight: 600; }
.live-dot { width: 6px; height: 6px; border-radius: 50%; background: #fff; animation: pulse 1.5s ease-in-out infinite; }
@keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
.player-controls-overlay { position: absolute; bottom: 0; left: 0; right: 0; padding: 8px 12px; background: linear-gradient(0deg, rgba(0,0,0,0.6) 0%, transparent 100%); z-index: 15; }
.controls-main { display: flex; align-items: center; gap: 4px; }
.control-btn { color: #fff !important; padding: 6px !important; }
.control-btn:hover { background: rgba(255,255,255,0.1) !important; border-radius: 4px; }
.network-status { position: absolute; top: 8px; right: 8px; padding: 2px 8px; border-radius: 4px; display: flex; align-items: center; gap: 4px; font-size: 11px; color: #fff; z-index: 15; }
.network-status.excellent { background: rgba(103,194,58,0.8); }
.network-status.good { background: rgba(64,158,255,0.8); }
.network-status.normal { background: rgba(230,162,60,0.8); }
.network-status.poor { background: rgba(245,108,108,0.8); }
</style>
