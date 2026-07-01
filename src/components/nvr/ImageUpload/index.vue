<template>
  <div class="component-upload-image">
    <el-upload
      multiple
      :disabled="disabled"
      :action="uploadImgUrl"
      list-type="picture-card"
      :on-success="handleUploadSuccess"
      :before-upload="handleBeforeUpload"
      :data="uploadData"
      :limit="limit"
      :on-error="handleUploadError"
      :on-exceed="handleExceed"
      ref="imageUpload"
      :before-remove="handleDelete"
      :show-file-list="true"
      :headers="headers"
      :file-list="fileList"
      :on-preview="handlePictureCardPreview"
      :class="{ hide: fileList.length >= limit }"
    >
      <i class="el-icon-plus avatar-uploader-icon"></i>
    </el-upload>
    <div class="el-upload__tip" v-if="showTip && !disabled">
      请上传
      <template v-if="fileSize">
        大小不超过 <b style="color: #f56c6c">{{ fileSize }}MB</b>
      </template>
      <template v-if="fileType && fileType.length">
        格式为 <b style="color: #f56c6c">{{ fileType.join("/") }}</b>
      </template>
      的文件
    </div>
    <el-dialog :visible.sync="dialogVisible" title="预览" width="800px" append-to-body>
      <img :src="dialogImageUrl" style="display: block; max-width: 100%; margin: 0 auto" />
    </el-dialog>
  </div>
</template>

<script>
import { getToken } from '@/util/auth'

export default {
  name: 'ImageUpload',
  props: {
    value: [String, Object, Array],
    action: { type: String, default: '/file/upload' },
    data: { type: Object, default: function () { return {} } },
    limit: { type: Number, default: 5 },
    fileSize: { type: Number, default: 5 },
    fileType: { type: Array, default: function () { return ['png', 'jpg', 'jpeg'] } },
    isShowTip: { type: Boolean, default: true },
    disabled: { type: Boolean, default: false },
    drag: { type: Boolean, default: true }
  },
  data: function () {
    return {
      dialogVisible: false,
      dialogImageUrl: '',
      fileList: [],
      showTip: this.isShowTip
    }
  },
  computed: {
    uploadImgUrl: function () {
      return this.action
    },
    uploadData: function () {
      return this.data
    },
    headers: function () {
      return { Authorization: 'Bearer ' + getToken() }
    }
  },
  watch: {
    value: {
      handler: function (val) {
        this.updateFileList(val)
      },
      immediate: true
    }
  },
  methods: {
    updateFileList: function (val) {
      if (!val) {
        this.fileList = []
        return
      }
      if (typeof val === 'string') {
        this.fileList = val.split(',').filter(Boolean).map(function (url, i) {
          return { name: 'image-' + i, url: url }
        })
      } else if (Array.isArray(val)) {
        this.fileList = val.map(function (item) {
          return typeof item === 'string' ? { name: item, url: item } : item
        })
      } else {
        this.fileList = [val]
      }
    },
    handleUploadSuccess: function (res, file) {
      if (res.code === 200) {
        file.url = res.data
        this.emitChange()
      } else {
        this.$message.error(res.msg || '上传失败')
      }
    },
    handleBeforeUpload: function (file) {
      var isOk = true
      if (this.fileSize && file.size / 1024 / 1024 > this.fileSize) {
        this.$message.error('文件大小不能超过 ' + this.fileSize + 'MB')
        isOk = false
      }
      if (this.fileType && this.fileType.length) {
        var ext = file.name.split('.').pop().toLowerCase()
        if (this.fileType.indexOf(ext) === -1) {
          this.$message.error('文件格式不支持，请上传 ' + this.fileType.join('/') + ' 格式')
          isOk = false
        }
      }
      return isOk
    },
    handleUploadError: function () {
      this.$message.error('上传失败')
    },
    handleExceed: function () {
      this.$message.error('最多只能上传 ' + this.limit + ' 张图片')
    },
    handleDelete: function (file) {
      var index = this.fileList.indexOf(file)
      if (index > -1) {
        this.fileList.splice(index, 1)
      }
      this.emitChange()
      return true
    },
    handlePictureCardPreview: function (file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    emitChange: function () {
      var urls = this.fileList.map(function (f) { return f.url }).filter(Boolean)
      this.$emit('input', urls.join(','))
      this.$emit('change', urls)
    }
  }
}
</script>

<style scoped>
.component-upload-image .hide .el-upload--picture-card { display: none; }
.avatar-uploader-icon { font-size: 28px; color: #8c939d; }
</style>
