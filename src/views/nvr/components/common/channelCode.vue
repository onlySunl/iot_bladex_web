<template>
  <el-dialog title="通道编码" :visible.sync="dialogVisible" width="500px" @close="handleClose">
    <el-form :model="form" label-width="100px">
      <el-form-item label="通道编码">
        <el-input v-model="form.code" placeholder="请输入通道编码" />
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button @click="handleClose">取消</el-button>
      <el-button type="primary" @click="handleOk">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: 'ChannelCode',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    code: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      form: {
        code: this.code || ''
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
        this.form.code = this.code || ''
      }
    }
  },
  methods: {
    handleClose() {
      this.$emit('update:visible', false)
    },
    handleOk() {
      this.$emit('ok', this.form.code)
      this.handleClose()
    }
  }
}
</script>
