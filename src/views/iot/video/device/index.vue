<template>
  <basic-container>
    <avue-crud
      :data="tableData"
      :option="option"
      :page="page"
      v-model="form"
      ref="crud"
      @on-load="onLoad"
      @search-change="searchChange"
      @search-reset="searchReset"
      @row-save="handleRowSave"
      @row-update="handleRowUpdate"
      @row-del="rowDel"
      @selection-change="selectionChange"
    >
      <template slot-scope="{ row, type, disabled }" slot="menuForm">
        <video-form ref="formRef" :form-data="form" :type="type" :disabled="disabled" @submit="handleFormSubmit" />
      </template>
      <!-- 自定义操作按钮 -->
      <template slot-scope="{ row }" slot="menu">
        <el-button type="text" icon="el-icon-video-play" @click="handlePlay(row)">播放</el-button>
        <el-button type="text" icon="el-icon-camera" @click="handleSnapshot(row)">截图</el-button>
        <el-button type="text" icon="el-icon-rank" @click="handlePtz(row)">云台</el-button>
        <el-button type="text" icon="el-icon-download" @click="handleStartPull(row)">拉流</el-button>
        <el-button type="text" icon="el-icon-upload2" @click="handleStartPush(row)">推流</el-button>
        <el-button type="text" icon="el-icon-view" @click="handleView(row)">查看</el-button>
        <el-button type="text" icon="el-icon-edit" @click="handleEdit(row)">编辑</el-button>
        <el-button type="text" icon="el-icon-delete" @click="rowDel(row)">删除</el-button>
      </template>
    </avue-crud>

    <!-- 视频播放弹窗 -->
    <el-dialog title="视频播放" :visible.sync="playDialogVisible" width="800px" append-to-body>
      <div class="video-player-wrapper">
        <video ref="videoPlayer" :src="playUrl" controls autoplay style="width: 100%; max-height: 500px" />
      </div>
    </el-dialog>

    <!-- 云台控制弹窗 -->
    <el-dialog title="云台控制" :visible.sync="ptzDialogVisible" width="400px" append-to-body>
      <div class="ptz-control">
        <el-row :gutter="10" type="flex" justify="center">
          <el-col :span="8"><el-button @click="ptzCmd('leftUp')">左上</el-button></el-col>
          <el-col :span="8"><el-button @click="ptzCmd('up')">上</el-button></el-col>
          <el-col :span="8"><el-button @click="ptzCmd('rightUp')">右上</el-button></el-col>
        </el-row>
        <el-row :gutter="10" type="flex" justify="center" style="margin-top: 10px">
          <el-col :span="8"><el-button @click="ptzCmd('left')">左</el-button></el-col>
          <el-col :span="8"><el-button type="danger" @click="ptzCmd('stop')">停</el-button></el-col>
          <el-col :span="8"><el-button @click="ptzCmd('right')">右</el-button></el-col>
        </el-row>
        <el-row :gutter="10" type="flex" justify="center" style="margin-top: 10px">
          <el-col :span="8"><el-button @click="ptzCmd('leftDown')">左下</el-button></el-col>
          <el-col :span="8"><el-button @click="ptzCmd('down')">下</el-button></el-col>
          <el-col :span="8"><el-button @click="ptzCmd('rightDown')">右下</el-button></el-col>
        </el-row>
        <el-row :gutter="10" type="flex" justify="center" style="margin-top: 20px">
          <el-col :span="12"><el-button @click="ptzCmd('zoomIn')">放大+</el-button></el-col>
          <el-col :span="12"><el-button @click="ptzCmd('zoomOut')">缩小-</el-button></el-col>
        </el-row>
      </div>
    </el-dialog>
  </basic-container>
</template>

<script>
import { getList, getDetail, add, update, remove, play, snapshot, ptzControl, startPull, startPush } from '@/api/iot/video/video'
import VideoForm from './video-form'

export default {
  name: 'VideoPage',
  components: { VideoForm },
  data() {
    return {
      form: {},
      tableData: [],
      page: { currentPage: 1, pageSize: 20, total: 0 },
      query: {},
      selectionList: [],
      submitType: 'add',
      playDialogVisible: false,
      ptzDialogVisible: false,
      playUrl: '',
      currentRow: null,
      option: {
        grid: true,
        gridBtn: true,
        index: true,
        selection: true,
        viewBtn: false,
        border: true,
        align: 'center',
        menuAlign: 'center',
        menuWidth: 380,
        column: [
          { label: "视频名称", prop: "videoName", search: true, width: 150 },
          { label: "视频类型", prop: "videoType", type: "select", dicUrl: "/api/blade-system/dict/dictionary?code=iot_product_type", props: { label: "dictValue", value: "dictKey" }, dataType: "number", search: true, width: 120 },
          { label: "流地址", prop: "streamUrl", width: 200, overHidden: true },
          { label: "设备名称", prop: "deviceName", search: true, width: 120 },
          { label: "是否启用", prop: "isEnabled", type: "select", dicUrl: "/api/blade-system/dict/dictionary?code=iot_enable_status", props: { label: "dictValue", value: "dictKey" }, dataType: "number", search: true, width: 100 },
          { label: "描述", prop: "description", width: 200, overHidden: true },
          { label: "创建时间", prop: "createTime", width: 160 }
        ]
      }
    }
  },
  methods: {
    async onLoad(page) {
      const res = await getList(page.currentPage, page.pageSize, this.query)
      this.tableData = res.data.records
      this.page.total = res.data.total
    },
    searchChange(params, done) {
      this.query = params
      this.page.currentPage = 1
      this.onLoad(this.page)
      done()
    },
    searchReset() {
      this.query = {}
      this.onLoad(this.page)
    },
    handleRowSave(row, done, loading) {
      this.submitType = 'add'
      this.form = { ...row }
    },
    handleRowUpdate(row, index, done, loading) {
      this.submitType = 'edit'
      this.form = { ...row }
    },
    async handleFormSubmit(formData) {
      try {
        if (this.submitType === 'add') {
          await add(formData)
          this.$message.success('新增成功')
        } else {
          await update(formData)
          this.$message.success('修改成功')
        }
        this.$refs.crud.rowCancel()
        this.onLoad(this.page)
      } catch (e) {
        this.$message.error('操作失败')
      }
    },
    async rowDel(row) {
      await this.$confirm('确定删除该条数据吗？', '提示', { type: 'warning' })
      await remove(row.id)
      this.$message.success('删除成功')
      this.onLoad(this.page)
    },
    selectionChange(list) {
      this.selectionList = list
    },
    async handlePlay(row) {
      try {
        const res = await play(row.id)
        this.playUrl = res.data.playUrl || ''
        this.playDialogVisible = true
      } catch (e) {
        this.$message.error('获取播放地址失败')
      }
    },
    async handleSnapshot(row) {
      try {
        await snapshot(row.id)
        this.$message.success('截图指令已发送')
      } catch (e) {
        this.$message.error('截图失败')
      }
    },
    handlePtz(row) {
      this.currentRow = row
      this.ptzDialogVisible = true
    },
    async ptzCmd(command) {
      if (!this.currentRow) return
      try {
        await ptzControl(this.currentRow.id, command)
        if (command !== 'stop') {
          this.$message.success('云台控制指令已发送')
        }
      } catch (e) {
        this.$message.error('云台控制失败')
      }
    },
    async handleStartPull(row) {
      try {
        await startPull(row.id)
        this.$message.success('拉流指令已发送')
      } catch (e) {
        this.$message.error('拉流失败')
      }
    },
    async handleStartPush(row) {
      try {
        await startPush(row.id)
        this.$message.success('推流指令已发送')
      } catch (e) {
        this.$message.error('推流失败')
      }
    },
    handleView(row) {
      this.form = { ...row }
      this.$refs.crud.rowView(row)
    },
    handleEdit(row) {
      this.form = { ...row }
      this.$refs.crud.rowEdit(row)
    }
  }
}
</script>

<style scoped>
.video-player-wrapper {
  text-align: center;
}
.ptz-control {
  padding: 20px;
}
.ptz-control .el-row {
  margin-bottom: 10px;
}
.ptz-control .el-button {
  width: 100%;
}
</style>
