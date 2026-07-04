<template>
  <basic-container>
    <avue-crud
      :option="option"
      :table-loading="loading"
      :data="data"
      ref="crud"
      v-model="form"
      :page="page"
      :permission="permissionList"
      :before-open="beforeOpen"
      @row-del="rowDel"
      @row-save="rowSave"
      @row-update="rowUpdate"
      @search-change="searchChange"
      @search-reset="searchReset"
      @selection-change="selectionChange"
      @current-change="currentChange"
      @size-change="sizeChange"
      @refresh-change="refreshChange"
      @on-load="onLoad"
    >
      <template #menu="{ row }">
        <el-button type="success" text icon="el-icon-connection" @click="handleAssociated(row)">关联通道</el-button>
        <el-button v-if="row.enable === 1 && row.status === 0" type="primary" text icon="el-icon-connection" @click="handleRegister(row)">上线</el-button>
        <el-button v-if="row.enable === 1 && row.status === 1" type="warning" text icon="el-icon-switch-button" @click="handleUnregister(row)">注销</el-button>
        <el-button v-if="row.enable === 1 && row.status === 1" type="info" text icon="el-icon-upload" @click="handlePushCatalog(row)">推送通道</el-button>
      </template>
      <template #status="{ row }">
        <el-tag :type="row.status === 1 ? 'success' : 'danger'">
          {{ row.status === 1 ? '在线' : '离线' }}
        </el-tag>
      </template>
      <template #enable="{ row }">
        <el-switch
          v-model="row.enable"
          :active-value="1"
          :inactive-value="0"
          @change="handleEnableChange(row)"
        />
      </template>
      <template #deviceCount="{ row }">
        <el-tag type="info" effect="plain">{{ row.deviceCount || 0 }}</el-tag>
      </template>
    </avue-crud>

    <!-- 关联通道对话框 -->
    <el-dialog title="关联通道" v-model="associatedOpen" width="1300px" append-to-body destroy-on-close>
      <associated-channel :platform-id="associatedPlatformId" v-if="associatedOpen"/>
    </el-dialog>
  </basic-container>
</template>

<script>
import { listPlatform, getPlatform, delPlatform, addPlatform, updatePlatform, unregisterPlatform, registerPlatform, pushCatalog } from '@/api/nvr/platform'
import AssociatedChannel from './associatedChannel.vue'
import { mapGetters } from 'vuex'

export default {
  name: 'Platform',
  components: {
    AssociatedChannel
  },
  data() {
    return {
      form: {},
      selectionList: [],
      loading: true,
      query: {},
      data: [],
      associatedOpen: false,
      associatedPlatformId: null,
      page: {
        pageSize: 10,
        currentPage: 1,
        total: 0
      },
      option: {
        tip: false,
        simplePage: true,
        searchShow: true,
        searchMenuSpan: 6,
        border: true,
        index: true,
        selection: true,
        viewBtn: true,
        labelWidth: 120,
        dialogWidth: 900,
        dialogClickModal: false,
        column: [
          {
            label: '编号',
            prop: 'id',
            width: 70,
            search: true,
            addDisplay: false,
            editDisplay: false
          },
          {
            label: '平台名称',
            prop: 'name',
            search: true,
            rules: [{ required: true, message: '平台名称不能为空', trigger: 'blur' }]
          },
          {
            label: '国标编码',
            prop: 'serverGbId',
            search: true,
            overHidden: true,
            rules: [{ required: true, message: '平台国标编码不能为空', trigger: 'blur' }]
          },
          {
            label: '服务器IP',
            prop: 'serverIp',
            span: 12
          },
          {
            label: '服务器端口',
            prop: 'serverPort',
            type: 'number',
            span: 12
          },
          {
            label: '传输协议',
            prop: 'transport',
            type: 'radio',
            dicData: [
              { label: 'UDP', value: 'UDP' },
              { label: 'TCP', value: 'TCP' }
            ],
            value: 'UDP'
          },
          {
            label: '启用状态',
            prop: 'enable',
            type: 'radio',
            dicData: [
              { label: '禁用', value: 0 },
              { label: '启用', value: 1 }
            ],
            value: 1,
            slot: true
          },
          {
            label: '在线状态',
            prop: 'status',
            type: 'radio',
            dicData: [
              { label: '离线', value: 0 },
              { label: '在线', value: 1 }
            ],
            slot: true,
            addDisplay: false,
            editDisplay: false
          },
          {
            label: '关联设备',
            prop: 'deviceCount',
            slot: true,
            addDisplay: false,
            editDisplay: false
          },
          {
            label: '创建时间',
            prop: 'createTime',
            type: 'datetime',
            addDisplay: false,
            editDisplay: false,
            viewDisplay: true
          },
          {
            label: '平台域',
            prop: 'serverGbDomain',
            span: 12,
            hide: true
          },
          {
            label: '设备国标编码',
            prop: 'deviceGbId',
            span: 12,
            hide: true,
            value: '34020000001320000001'
          },
          {
            label: '设备IP',
            prop: 'deviceIp',
            span: 12,
            hide: true
          },
          {
            label: '设备端口',
            prop: 'devicePort',
            span: 12,
            hide: true
          },
          {
            label: '用户名',
            prop: 'username',
            span: 12,
            hide: true,
            value: '34020000001320000001'
          },
          {
            label: '密码',
            prop: 'password',
            span: 12,
            hide: true,
            type: 'password'
          },
          {
            label: '注册有效期',
            prop: 'expires',
            span: 12,
            hide: true,
            value: 3600
          },
          {
            label: '心跳超时',
            prop: 'keepTimeout',
            span: 12,
            hide: true,
            value: 60
          },
          {
            label: '行政区划',
            prop: 'civilCode',
            span: 12,
            hide: true
          },
          {
            label: '字符编码',
            prop: 'characterSet',
            type: 'radio',
            dicData: [
              { label: 'GB2312', value: 'GB2312' },
              { label: 'UTF-8', value: 'UTF-8' }
            ],
            value: 'GB2312',
            span: 12,
            hide: true
          },
          {
            label: '设备厂商',
            prop: 'manufacturer',
            span: 12,
            hide: true
          },
          {
            label: '设备型号',
            prop: 'model',
            span: 12,
            hide: true
          },
          {
            label: '安装地址',
            prop: 'address',
            span: 24,
            hide: true
          },
          {
            label: '云台控制',
            prop: 'ptz',
            type: 'switch',
            dicData: [
              { label: '关闭', value: 0 },
              { label: '开启', value: 1 }
            ],
            value: 1,
            span: 12,
            hide: true
          },
          {
            label: '启用RTCP',
            prop: 'rtcp',
            type: 'switch',
            dicData: [
              { label: '关闭', value: 0 },
              { label: '开启', value: 1 }
            ],
            value: 1,
            span: 12,
            hide: true
          },
          {
            label: '消息通道',
            prop: 'asMessageChannel',
            type: 'switch',
            dicData: [
              { label: '关闭', value: 0 },
              { label: '开启', value: 1 }
            ],
            value: 1,
            span: 12,
            hide: true
          },
          {
            label: '自动推送通道',
            prop: 'autoPushChannel',
            type: 'switch',
            dicData: [
              { label: '关闭', value: 0 },
              { label: '开启', value: 1 }
            ],
            value: 1,
            span: 12,
            hide: true
          },
          {
            label: '查询分组目录',
            prop: 'catalogWithGroup',
            type: 'switch',
            dicData: [
              { label: '关闭', value: 0 },
              { label: '开启', value: 1 }
            ],
            value: 0,
            span: 12,
            hide: true
          },
          {
            label: '查询区域目录',
            prop: 'catalogWithRegion',
            type: 'switch',
            dicData: [
              { label: '关闭', value: 0 },
              { label: '开启', value: 1 }
            ],
            value: 0,
            span: 12,
            hide: true
          }
        ]
      }
    }
  },
  computed: {
    ...mapGetters(['permission']),
    permissionList() {
      return {
        delBtn: true,
        addBtn: true,
        viewBtn: true,
        editBtn: true
      }
    }
  },
  methods: {
    onLoad(page, params = {}) {
      this.loading = true
      const query = {
        ...params,
        pageNum: page.currentPage,
        pageSize: page.pageSize
      }
      listPlatform(query).then(res => {
        this.data = res.data.records || res.data.rows || []
        this.page.total = res.data.total || 0
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    searchChange(query, done) {
      this.query = query
      this.page.currentPage = 1
      done()
    },
    searchReset() {
      this.query = {}
      this.page.currentPage = 1
    },
    selectionChange(list) {
      this.selectionList = list
    },
    currentChange(currentPage) {
      this.page.currentPage = currentPage
    },
    sizeChange(pageSize) {
      this.page.pageSize = pageSize
    },
    refreshChange() {
      this.onLoad(this.page, this.query)
    },
    beforeOpen(done, type) {
      if (type === 'edit') {
        getPlatform(this.form.id).then(res => {
          this.form = res.data.data || res.data
          done()
        }).catch(() => {
          done()
        })
      } else {
        done()
      }
    },
    rowSave(row, done, loading) {
      addPlatform(row).then(() => {
        this.$message.success('新增成功')
        done()
        this.onLoad(this.page, this.query)
      }).catch(() => {
        loading()
      })
    },
    rowUpdate(row, index, done, loading) {
      updatePlatform(row).then(() => {
        this.$message.success('修改成功')
        done()
        this.onLoad(this.page, this.query)
      }).catch(() => {
        loading()
      })
    },
    rowDel(row) {
      this.$confirm('是否确认删除国标GB28181平台配置编号为"' + row.id + '"的数据项？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        return delPlatform(row.id)
      }).then(() => {
        this.$message.success('删除成功')
        this.onLoad(this.page, this.query)
      }).catch(() => {})
    },
    handleAssociated(row) {
      this.associatedPlatformId = row.id
      this.associatedOpen = true
    },
    handleRegister(row) {
      this.$confirm('是否确认上线平台"' + row.name + '"？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        return registerPlatform(row.id)
      }).then(() => {
        this.$message.success('上线成功')
        this.onLoad(this.page, this.query)
      }).catch(() => {})
    },
    handleUnregister(row) {
      this.$confirm('是否确认注销平台"' + row.name + '"？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        return unregisterPlatform(row.id)
      }).then(() => {
        this.$message.success('注销成功')
        this.onLoad(this.page, this.query)
      }).catch(() => {})
    },
    handlePushCatalog(row) {
      this.$confirm('是否确认推送通道到平台"' + row.name + '"？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        return pushCatalog(row.id)
      }).then(() => {
        this.$message.success('推送成功')
      }).catch(() => {})
    },
    handleEnableChange(row) {
      const text = row.enable === 1 ? '启用' : '禁用'
      this.$confirm('是否确认' + text + '平台"' + row.name + '"？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        return updatePlatform({ id: row.id, enable: row.enable })
      }).then(() => {
        this.$message.success(text + '成功')
      }).catch(() => {
        row.enable = row.enable === 1 ? 0 : 1
      })
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
