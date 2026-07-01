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
      @row-del="rowDel"
      @selection-change="selectionChange"
    >
      <template slot-scope="{ row }" slot="sdkType">
        <el-tag :type="getSdkTypeTag(row.sdkType)" size="small">{{ getSdkTypeLabel(row.sdkType) }}</el-tag>
      </template>
      <template slot-scope="{ row }" slot="alarmType">
        <span>{{ getAlarmTypeLabel(row.alarmType) }}</span>
      </template>
      <template slot-scope="{ row }" slot="alarmLevel">
        <el-tag :type="getAlarmLevelTag(row.alarmLevel)" size="small">{{ getAlarmLevelLabel(row.alarmLevel) }}</el-tag>
      </template>
      <template slot-scope="{ row }" slot="handled">
        <el-tag :type="row.handled === 1 ? 'success' : 'warning'" size="small">{{ row.handled === 1 ? '已处理' : '未处理' }}</el-tag>
      </template>
      <template slot-scope="{ row }" slot="menu">
        <el-button size="small" type="primary" icon="el-icon-check" @click="handleAlarm(row)">处理</el-button>
      </template>
    </avue-crud>
  </basic-container>
</template>

<script>
import { getList, getDetail, update, remove, batchHandleAlarm } from '@/api/nvr/alarm'

export default {
  name: 'NvrAlarm',
  data() {
    return {
      form: {},
      tableData: [],
      page: { currentPage: 1, pageSize: 20, total: 0 },
      query: {},
      selectionList: [],
      option: {
        grid: true,
        gridBtn: true,
        index: true,
        selection: true,
        viewBtn: true,
        border: true,
        align: 'center',
        menuAlign: 'center',
        column: [
          {
            label: '设备名称',
            prop: 'deviceName',
            search: true,
            width: 150
          },
          {
            label: 'SDK类型',
            prop: 'sdkType',
            search: true,
            type: 'select',
            width: 120,
            dicData: [
              { label: '海康', value: 'hik' },
              { label: '海康ISUP', value: 'hik_isup' },
              { label: '大华', value: 'dahua' },
              { label: '宇视', value: 'uniview' },
              { label: '天地伟业', value: 'tiandy' },
              { label: '国标28181', value: 'gb28181' },
              { label: '其他', value: 'other' }
            ]
          },
          {
            label: '告警类型',
            prop: 'alarmType',
            search: true,
            type: 'select',
            width: 120,
            dicData: [
              { label: '动态检测', value: 'motion' },
              { label: '视频丢失', value: 'video_loss' },
              { label: '视频遮挡', value: 'cover' },
              { label: '外部报警', value: 'alarm_in' },
              { label: '硬盘满', value: 'disk_full' },
              { label: '硬盘错误', value: 'disk_error' },
              { label: '越界检测', value: 'cross_line' },
              { label: '区域入侵', value: 'enter_area' },
              { label: '人脸检测', value: 'face_detection' },
              { label: '其他', value: 'other' }
            ]
          },
          {
            label: '告警级别',
            prop: 'alarmLevel',
            search: true,
            type: 'select',
            width: 100,
            dicData: [
              { label: '低', value: 'low' },
              { label: '中', value: 'medium' },
              { label: '高', value: 'high' },
              { label: '紧急', value: 'critical' }
            ]
          },
          {
            label: '处理状态',
            prop: 'handled',
            search: true,
            type: 'select',
            width: 100,
            dicData: [
              { label: '未处理', value: 0 },
              { label: '已处理', value: 1 }
            ]
          },
          {
            label: '告警时间',
            prop: 'alarmTime',
            width: 160
          },
          {
            label: '告警描述',
            prop: 'description',
            overHidden: true,
            width: 200
          }
        ]
      }
    }
  },
  methods: {
    async onLoad(page) {
      const res = await getList(page.currentPage, page.pageSize, this.query)
      this.tableData = res.data.data.records
      this.page.total = res.data.data.total
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
    async rowDel(row, index, done) {
      await this.$confirm('确定删除该条告警记录吗？', '提示', { type: 'warning' })
      await remove(row.id)
      this.$message.success('删除成功')
      done()
    },
    selectionChange(list) {
      this.selectionList = list
    },
    async handleAlarm(row) {
      await this.$confirm('确定处理该告警吗？', '提示', { type: 'warning' })
      await update({ id: row.id, handled: 1 })
      this.$message.success('处理成功')
      this.onLoad(this.page)
    },
    getSdkTypeTag(type) {
      const map = { hik: 'danger', hik_isup: 'danger', dahua: 'warning', uniview: 'success', tiandy: 'info', gb28181: '' }
      return map[type] || 'info'
    },
    getSdkTypeLabel(type) {
      const map = { hik: '海康', hik_isup: '海康ISUP', dahua: '大华', uniview: '宇视', tiandy: '天地伟业', gb28181: '国标28181', other: '其他' }
      return map[type] || type
    },
    getAlarmLevelTag(level) {
      const map = { low: 'info', medium: 'warning', high: 'danger', critical: 'danger' }
      return map[level] || 'info'
    },
    getAlarmLevelLabel(level) {
      const map = { low: '低', medium: '中', high: '高', critical: '紧急' }
      return map[level] || level
    },
    getAlarmTypeLabel(type) {
      const map = { motion: '动态检测', motion_ex: '动态检测扩展', video_loss: '视频丢失', video_loss_ex: '视频丢失扩展', cover: '视频遮挡', cover_ex: '视频遮挡扩展', alarm_in: '外部报警', alarm_ex: '外部报警扩展', disk_full: '硬盘满', disk_error: '硬盘错误', cross_line: '越界检测', enter_area: '区域入侵', leave_area: '区域离开', object_remove: '物品移除', object_leave: '物品遗留', face_detection: '人脸检测', other: '其他' }
      return map[type] || type
    }
  }
}
</script>
