<template>
  <el-dialog
    title="云台控制"
    :visible.sync="dialogVisible"
    width="400px"
    @close="handleClose"
  >
    <div class="ptz-control">
      <div class="direction-pad">
        <el-button class="btn-up" circle @mousedown="startControl('up')" @mouseup="stopControl">
          <i class="el-icon-arrow-up"></i>
        </el-button>
        <el-button class="btn-left" circle @mousedown="startControl('left')" @mouseup="stopControl">
          <i class="el-icon-arrow-left"></i>
        </el-button>
        <el-button class="btn-center" circle @click="stopControl">
          <i class="el-icon-video-pause"></i>
        </el-button>
        <el-button class="btn-right" circle @mousedown="startControl('right')" @mouseup="stopControl">
          <i class="el-icon-arrow-right"></i>
        </el-button>
        <el-button class="btn-down" circle @mousedown="startControl('down')" @mouseup="stopControl">
          <i class="el-icon-arrow-down"></i>
        </el-button>
      </div>
      <div class="zoom-control">
        <div class="control-label">缩放</div>
        <el-button @mousedown="startControl('zoom_in')" @mouseup="stopControl">
          <i class="el-icon-zoom-in"></i> 放大
        </el-button>
        <el-button @mousedown="startControl('zoom_out')" @mouseup="stopControl">
          <i class="el-icon-zoom-out"></i> 缩小
        </el-button>
      </div>
      <div class="focus-control">
        <div class="control-label">聚焦</div>
        <el-button @mousedown="startControl('focus_near')" @mouseup="stopControl">
          近
        </el-button>
        <el-button @mousedown="startControl('focus_far')" @mouseup="stopControl">
          远
        </el-button>
      </div>
      <div class="speed-control">
        <div class="control-label">速度</div>
        <el-slider v-model="speed" :min="1" :max="10" />
      </div>
    </div>
    <div slot="footer">
      <el-button @click="dialogVisible = false">关闭</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: 'DevicePtzControl',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    device: {
      type: Object,
      default: null
    },
    channel: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      speed: 5,
      controlTimer: null
    };
  },
  computed: {
    dialogVisible: {
      get() {
        return this.visible;
      },
      set(val) {
        this.$emit('update:visible', val);
      }
    }
  },
  beforeDestroy() {
    this.stopControl();
  },
  methods: {
    startControl(direction) {
      this.$emit('control-start', {
        device: this.device,
        channel: this.channel,
        direction: direction,
        speed: this.speed
      });
    },
    stopControl() {
      this.$emit('control-stop', {
        device: this.device,
        channel: this.channel
      });
    },
    handleClose() {
      this.stopControl();
      this.$emit('close');
    }
  }
};
</script>

<style scoped>
.ptz-control {
  padding: 20px;
}
.direction-pad {
  display: grid;
  grid-template-columns: repeat(3, 60px);
  grid-template-rows: repeat(3, 60px);
  gap: 10px;
  justify-content: center;
  margin-bottom: 20px;
}
.btn-up { grid-column: 2; grid-row: 1; }
.btn-left { grid-column: 1; grid-row: 2; }
.btn-center { grid-column: 2; grid-row: 2; }
.btn-right { grid-column: 3; grid-row: 2; }
.btn-down { grid-column: 2; grid-row: 3; }
.zoom-control,
.focus-control,
.speed-control {
  margin-bottom: 20px;
}
.control-label {
  margin-bottom: 10px;
  font-weight: bold;
}
</style>
