<template>
  <el-dropdown trigger="click" @command="handleCommand">
    <el-button size="mini" type="text">
      <i class="el-icon-video-play"></i> 播放
      <i class="el-icon-arrow-down"></i>
    </el-button>
    <el-dropdown-menu slot="dropdown">
      <el-dropdown-item command="flv">FLV</el-dropdown-item>
      <el-dropdown-item command="hls">HLS</el-dropdown-item>
      <el-dropdown-item command="rtsp">RTSP</el-dropdown-item>
      <el-dropdown-item command="rtmp">RTMP</el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script>
export default {
  name: 'StreamDropdown',
  props: {
    device: {
      type: Object,
      default: function() {
        return {}
      }
    }
  },
  methods: {
    handleCommand(type) {
      this.$emit('play', { device: this.device, streamType: type })
    }
  }
}
</script>
