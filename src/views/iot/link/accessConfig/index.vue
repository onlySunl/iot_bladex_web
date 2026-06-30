<template>
  <basic-container>
    <el-tabs v-model="activeTab" @tab-click="handleTabClick">
      <el-tab-pane label="网关桥接" name="bridge">
        <bridge-page ref="bridge" />
      </el-tab-pane>
      <el-tab-pane label="MQTT客户端" name="mqtt">
        <mqtt-client-page ref="mqtt" />
      </el-tab-pane>
      <el-tab-pane label="子网关" name="subGateway">
        <sub-gateway-page ref="subGateway" />
      </el-tab-pane>
    </el-tabs>
  </basic-container>
</template>

<script>
import BridgePage from './bridge'
import MqttClientPage from './mqtt-client'
import SubGatewayPage from './sub-gateway'

export default {
  name: 'AccessConfigPage',
  components: { BridgePage, MqttClientPage, SubGatewayPage },
  data() {
    return {
      activeTab: 'bridge'
    }
  },
  methods: {
    handleTabClick(tab) {
      // Tab切换时触发子组件刷新
    }
  }
}
</script>
