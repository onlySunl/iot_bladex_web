<template>
  <basic-container>
    <el-tabs v-model="activeTab" @tab-click="handleTabClick">
      <el-tab-pane label="设备日志" name="deviceLog">
        <device-log ref="deviceLog" />
      </el-tab-pane>
      <el-tab-pane label="事件日志" name="eventLog">
        <event-log ref="eventLog" />
      </el-tab-pane>
      <el-tab-pane label="功能日志" name="functionLog">
        <function-log ref="functionLog" />
      </el-tab-pane>
      <el-tab-pane label="模拟日志" name="simulateLog">
        <simulate-log ref="simulateLog" />
      </el-tab-pane>
    </el-tabs>
  </basic-container>
</template>

<script>
import DeviceLog from './device-log'
import EventLog from './event-log'
import FunctionLog from './function-log'
import SimulateLog from './simulate-log'

export default {
  name: 'LogPage',
  components: { DeviceLog, EventLog, FunctionLog, SimulateLog },
  data() {
    return {
      activeTab: 'deviceLog'
    }
  },
  methods: {
    handleTabClick(tab) {
      // Tab切换时触发子组件刷新
    }
  }
}
</script>
