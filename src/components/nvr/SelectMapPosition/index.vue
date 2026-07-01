<template>
  <el-dialog title="选择地图位置" :visible.sync="dialogVisible" width="800px" @close="handleClose">
    <div class="map-container" style="height: 400px; background: #f0f2f5; display: flex; align-items: center; justify-content: center;">
      <div v-if="!mapLoaded" class="map-placeholder">
        <i class="el-icon-map-location" style="font-size: 48px; color: #909399;"></i>
        <p>地图组件加载中...</p>
      </div>
      <div v-else id="selectMapContainer" style="width: 100%; height: 100%;"></div>
    </div>
    <div class="map-info" style="margin-top: 10px;">
      <el-form :inline="true" size="small">
        <el-form-item label="经度">
          <el-input v-model="position.longitude" readonly />
        </el-form-item>
        <el-form-item label="纬度">
          <el-input v-model="position.latitude" readonly />
        </el-form-item>
      </el-form>
    </div>
    <div slot="footer">
      <el-button @click="handleClose">取消</el-button>
      <el-button type="primary" @click="handleConfirm">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: 'SelectMapPosition',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    longitude: {
      type: [String, Number],
      default: ''
    },
    latitude: {
      type: [String, Number],
      default: ''
    }
  },
  data() {
    return {
      mapLoaded: false,
      position: {
        longitude: this.longitude || '',
        latitude: this.latitude || ''
      }
    }
  },
  computed: {
    dialogVisible: {
      get() {
        return this.visible
      },
      set(val) {
        this.$emit('update:visible', val)
      }
    }
  },
  watch: {
    visible(val) {
      if (val) {
        this.position.longitude = this.longitude || ''
        this.position.latitude = this.latitude || ''
      }
    }
  },
  methods: {
    handleClose() {
      this.$emit('update:visible', false)
    },
    handleConfirm() {
      this.$emit('submit', {
        longitude: this.position.longitude,
        latitude: this.position.latitude
      })
      this.handleClose()
    }
  }
}
</script>

<style scoped lang="scss">
.map-placeholder {
  text-align: center;
  color: #909399;
}
</style>
