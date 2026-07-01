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
      @row-save="rowSave"
      @row-update="rowUpdate"
      @row-del="rowDel"
    >
      <template slot-scope="{ row }" slot="enable">
        <el-switch v-model="row.enable" :active-value="1" :inactive-value="0" @change="handleEnableChange(row)" />
      </template>
      <template slot-scope="{ row }" slot="menu">
        <el-button size="small" type="primary" icon="el-icon-video-play" v-if="row.enable === 1" @click="handlePlay(row)">播放</el-button>
      </template>
    </avue-crud>
  </basic-container>
</template>

<script>
import { getMediaServerList, getDetail, saveMediaServer, delMediaServer, checkMediaServer, restartServer } from '@/api/nvr/zlm'

export default {
  name: 'NvrMediaServer',
  data() {
    return {
      form: {},
      tableData: [],
      page: { currentPage: 1, pageSize: 20, total: 0 },
      query: {},
      option: {
        grid: true,
        gridBtn: true,
        index: true,
        viewBtn: true,
        border: true,
        align: 'center',
        menuAlign: 'center',
        column: [
          {
            label: '媒体节点ID',
            prop: 'id',
            rules: [{ required: true, message: '请输入媒体节点ID', trigger: 'blur' }]
          },
          {
            label: 'IP',
            prop: 'ip',
            rules: [{ required: true, message: '请输入IP', trigger: 'blur' }]
          },
          {
            label: 'HTTP端口',
            prop: 'httpPort',
            rules: [{ required: true, message: '请输入HTTP端口', trigger: 'blur' }],
            type: 'number'
          },
          {
            label: 'HTTPS端口',
            prop: 'httpsPort',
            type: 'number'
          },
          {
            label: 'RTMP端口',
            prop: 'rtmpPort',
            type: 'number'
          },
          {
            label: 'RTSP端口',
            prop: 'rtspPort',
            type: 'number'
          },
          {
            label: '密钥',
            prop: 'secret',
            hide: true,
            rules: [{ required: true, message: '请输入密钥', trigger: 'blur' }]
          },
          {
            label: 'RTP端口',
            prop: 'rtpProxyPort',
            hide: true,
            type: 'number'
          },
          {
            label: '自动同步',
            prop: 'autoSync',
            hide: true,
            type: 'switch',
            dicData: [
              { label: '是', value: 1 },
              { label: '否', value: 0 }
            ]
          },
          {
            label: '启用',
            prop: 'enable',
            type: 'switch',
            dicData: [
              { label: '启用', value: 1 },
              { label: '禁用', value: 0 }
            ]
          }
        ]
      }
    }
  },
  methods: {
    async onLoad(page) {
      const res = await getMediaServerList()
      this.tableData = res.data.data || []
      this.page.total = this.tableData.length
    },
    searchChange(params, done) {
      this.query = params
      this.onLoad(this.page)
      done()
    },
    searchReset() {
      this.query = {}
      this.onLoad(this.page)
    },
    async rowSave(row, done, loading) {
      await saveMediaServer(row)
      this.$message.success('新增成功')
      done()
      this.onLoad(this.page)
    },
    async rowUpdate(row, index, done, loading) {
      await saveMediaServer(row)
      this.$message.success('修改成功')
      done()
      this.onLoad(this.page)
    },
    async rowDel(row, index, done) {
      await this.$confirm('确定删除该流媒体服务吗？', '提示', { type: 'warning' })
      await delMediaServer(row.id)
      this.$message.success('删除成功')
      done()
      this.onLoad(this.page)
    },
    async handleEnableChange(row) {
      await saveMediaServer(row)
      this.$message.success('状态更新成功')
    },
    handlePlay(row) {
      this.$router.push({ path: '/nvr/cloudRecord', query: { mediaServerId: row.id } })
    }
  }
}
</script>
