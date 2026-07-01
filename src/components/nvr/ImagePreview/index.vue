<template>
  <el-image
    :src="realSrc"
    fit="cover"
    :style="imageStyle"
    :preview-src-list="realSrcList"
  >
    <template slot="error">
      <div class="image-slot">
        <i class="el-icon-picture-outline"></i>
      </div>
    </template>
  </el-image>
</template>

<script>
export default {
  name: 'ImagePreview',
  props: {
    src: { type: String, default: '' },
    width: { type: [Number, String], default: '' },
    height: { type: [Number, String], default: '' }
  },
  computed: {
    realSrc: function () {
      if (!this.src) return undefined
      var real_src = this.src.split(',')[0]
      var separator = real_src.indexOf('?') > -1 ? '&' : '?'
      return real_src + separator + '_=' + Date.now()
    },
    realSrcList: function () {
      if (!this.src) return undefined
      var real_src_list = this.src.split(',')
      var srcList = []
      var self = this
      real_src_list.forEach(function (item) {
        var separator = item.indexOf('?') > -1 ? '&' : '?'
        srcList.push(item + separator + '_=' + Date.now())
      })
      return srcList
    },
    realWidth: function () {
      return typeof this.width === 'string' ? this.width : this.width + 'px'
    },
    realHeight: function () {
      return typeof this.height === 'string' ? this.height : this.height + 'px'
    },
    imageStyle: function () {
      return 'width:' + this.realWidth + ';height:' + this.realHeight + ';'
    }
  }
}
</script>

<style lang="scss" scoped>
.el-image {
  border-radius: 12px;
  background-color: #f3f4f6;
  box-shadow: 0 1px 3px rgba(0,0,0,0.06), 0 4px 8px rgba(0,0,0,0.04);
  overflow: hidden;
  .image-slot {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    color: #a0aec0;
    font-size: 30px;
  }
}
</style>
