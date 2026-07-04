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
      @row-del="rowDel"
      @search-change="searchChange"
      @search-reset="searchReset"
      @selection-change="selectionChange"
      @current-change="currentChange"
      @size-change="sizeChange"
      @refresh-change="refreshChange"
      @on-load="onLoad"
    >
      <template #menu-left>
        <el-button
          type="danger"
          icon="el-icon-delete"
          plain
          @click="handleBatchHandle"
          :disabled="selectionList.length === 0"
        >批量处理</el-button>
        <el-button
          type="warning"
          icon="el-icon-download"
          plain
          @click="handleExport"
        >导出</el-button>
      </template>
      <template #menu="{ row }">
        <el-button
          v-if="row.handled !== 1"
          type="primary"
          text
          icon="el-icon-check"
          @click="handleHandle(row)"
        >处理</el-button>
      </template>
      <template #sdkType="{ row }">
        <el-tag v-if="row.sdkType === 'hik'" type="danger">海康</el-tag>
        <el-tag v-else-if="row.sdkType === 'hik_isup'" type="danger">海康ISUP</el-tag>
        <el-tag v-else-if="row.sdkType === 'dahua'" type="warning">大华</el-tag>
        <el-tag v-else-if="row.sdkType === 'uniview'" type="success">宇视</el-tag>
        <el-tag v-else-if="row.sdkType === 'tiandy'" type="info">天地伟业</el-tag>
        <el-tag v-else-if="row.sdkType === 'gb28181'" type="primary">国标28181</el-tag>
        <el-tag v-else>其他</el-tag>
      </template>
      <template #alarmType="{ row }">
        <el-tag v-if="row.alarmType === 'motion'" type="danger">动态检测</el-tag>
        <el-tag v-else-if="row.alarmType === 'motion_ex'" type="danger">动态检测扩展</el-tag>
        <el-tag v-else-if="row.alarmType === 'video_loss'" type="warning">视频丢失</el-tag>
        <el-tag v-else-if="row.alarmType === 'video_loss_ex'" type="warning">视频丢失扩展</el-tag>
        <el-tag v-else-if="row.alarmType === 'cover'" type="info">视频遮挡</el-tag>
        <el-tag v-else-if="row.alarmType === 'cover_ex'" type="info">视频遮挡扩展</el-tag>
        <el-tag v-else-if="row.alarmType === 'alarm_in'" type="danger">外部报警</el-tag>
        <el-tag v-else-if="row.alarmType === 'alarm_ex'" type="danger">外部报警扩展</el-tag>
        <el-tag v-else-if="row.alarmType === 'disk_full'" type="warning">硬盘满</el-tag>
        <el-tag v-else-if="row.alarmType === 'disk_error'" type="danger">硬盘错误</el-tag>
        <el-tag v-else-if="row.alarmType === 'cross_line'" type="danger">越界检测</el-tag>
        <el-tag v-else-if="row.alarmType === 'enter_area'" type="warning">区域入侵</el-tag>
        <el-tag v-else-if="row.alarmType === 'leave_area'" type="info">区域离开</el-tag>
        <el-tag v-else-if="row.alarmType === 'object_remove'" type="danger">物品移除</el-tag>
        <el-tag v-else-if="row.alarmType === 'object_leave'" type="warning">物品遗留</el-tag>
        <el-tag v-else-if="row.alarmType === 'face_detection'" type="primary">人脸检测</el-tag>
        <el-tag v-else-if="row.alarmType && row.alarmType.startsWith('other_')" type="info">{{ row.alarmType }}</el-tag>
        <el-tag v-else>其他</el-tag>
      </template>
      <template #alarmLevel="{ row }">
        <el-tag v-if="row.alarmLevel === 'low'" type="success">低</el-tag>
        <el-tag v-else-if="row.alarmLevel === 'medium'" type="warning">中</el-tag>
        <el-tag v-else-if="row.alarmLevel === 'high'" type="danger">高</el-tag>
        <el-tag v-else-if="row.alarmLevel === 'critical'" type="danger">紧急</el-tag>
        <el-tag v-else>其他</el-tag>
      </template>
      <template #handled="{ row }">
        <el-tag v-if="row.handled === 1" type="success">已处理</el-tag>
        <el-tag v-else type="danger">未处理</el-tag>
      </template>
      <template #imageUrl="{ row }">
        <image-preview v-if="row.imageUrl" :src="row.imageUrl" :width="80" :height="50"/>
      </template>
    </avue-crud>
  </basic-container>
</template>

<script>
import { delAlarm, listAlarm, exportAlarm, updateAlarm, batchHandleAlarm } from '@/api/nvr/alarm'
import { mapGetters } from 'vuex'
import { downloadXls } from '@/utils/util'

export default {
  name: 'DeviceAlarm',
  data() {
    return {
      form: {},
      selectionList: [],
      loading: true,
      query: {},
      data: [],
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
        labelWidth: 100,
        dialogClickModal: false,
        column: [
          {
            label: '编号',
            prop: 'id',
            width: 70,
            search: true,
            searchType: 'input'
          },
          {
            label: '设备编号',
            prop: 'deviceCode',
            search: true
          },
          {
            label: '设备名称',
            prop: 'deviceName',
            search: true,
            overHidden: true
          },
          {
            label: 'SDK类型',
            prop: 'sdkType',
            search: true,
            type: 'select',
            dicData: [
              { label: '海康', value: 'hik' },
              { label: '海康ISUP', value: 'hik_isup' },
              { label: '大华', value: 'dahua' },
              { label: '宇视', value: 'uniview' },
              { label: '天地伟业', value: 'tiandy' },
              { label: '国标28181', value: 'gb28181' },
              { label: '其他', value: 'other' }
            ],
            slot: true
          },
          {
            label: '通道号',
            prop: 'channel'
          },
          {
            label: '告警图片',
            prop: 'imageUrl',
            slot: true
          },
          {
            label: '告警类型',
            prop: 'alarmType',
            search: true,
            type: 'select',
            dicData: [
              { label: '动态检测', value: 'motion' },
              { label: '动态检测扩展', value: 'motion_ex' },
              { label: '视频丢失', value: 'video_loss' },
              { label: '视频丢失扩展', value: 'video_loss_ex' },
              { label: '视频遮挡', value: 'cover' },
              { label: '视频遮挡扩展', value: 'cover_ex' },
              { label: '外部报警', value: 'alarm_in' },
              { label: '外部报警扩展', value: 'alarm_ex' },
              { label: '硬盘满', value: 'disk_full' },
              { label: '硬盘错误', value: 'disk_error' },
              { label: '越界检测', value: 'cross_line' },
              { label: '区域入侵', value: 'enter_area' },
              { label: '区域离开', value: 'leave_area' },
              { label: '物品移除', value: 'object_remove' },
              { label: '物品遗留', value: 'object_leave' },
              { label: '人脸检测', value: 'face_detection' },
              { label: '其他', value: 'other' }
            ],
            slot: true
          },
          {
            label: '告警级别',
            prop: 'alarmLevel',
            search: true,
            type: 'select',
            dicData: [
              { label: '低', value: 'low' },
              { label: '中', value: 'medium' },
              { label: '高', value: 'high' },
              { label: '紧急', value: 'critical' }
            ],
            slot: true
          },
          {
            label: '处理状态',
            prop: 'handled',
            search: true,
            type: 'select',
            dicData: [
              { label: '未处理', value: 0 },
              { label: '已处理', value: 1 }
            ],
            slot: true
          },
          {
            label: '告警时间',
            prop: 'alarmTime',
            search: true,
            searchType: 'daterange',
            type: 'date'
          },
          {
            label: '告警内容',
            prop: 'alarmContent',
            overHidden: true
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
        addBtn: false,
        viewBtn: true,
        editBtn: false
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
      listAlarm(query).then(res => {
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
    rowDel(row) {
      this.$confirm('是否确认删除告警记录?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        return delAlarm(row.id)
      }).then(() => {
        this.$message.success('删除成功')
        this.onLoad(this.page, this.query)
      }).catch(() => {})
    },
    handleHandle(row) {
      this.$confirm('是否确认处理该告警?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const updateData = {
          id: row.id,
          handled: 1,
          handler: this.$store.getters.name || 'admin',
          handleTime: new Date().toISOString()
        }
        return updateAlarm(updateData)
      }).then(() => {
        this.$message.success('处理成功')
        this.onLoad(this.page, this.query)
      }).catch(() => {})
    },
    handleBatchHandle() {
      if (this.selectionList.length === 0) {
        this.$message.warning('请先选择要处理的告警记录')
        return
      }
      this.$confirm(`是否确认处理选中的 ${this.selectionList.length} 条告警记录?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const data = {
          ids: this.selectionList.map(item => Number(item.id)),
          handler: this.$store.getters.name || 'admin',
          handleTime: new Date().toISOString()
        }
        return batchHandleAlarm(data)
      }).then(() => {
        this.$message.success('批量处理成功')
        this.onLoad(this.page, this.query)
      }).catch(() => {})
    },
    handleExport() {
      this.$confirm('是否确认导出告警数据?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        return exportAlarm(this.query)
      }).then(res => {
        downloadXls(res, `alarm_${new Date().getTime()}.xlsx`)
      }).catch(() => {})
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
