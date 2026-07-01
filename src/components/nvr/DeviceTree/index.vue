<template>
  <div class="device-tree-container" style="height: 100%">
    <div v-if="showHeader" class="panel-header">
      <i class="el-icon-video-camera"></i>
      <span>设备列表</span>
      <el-switch
        v-model="showRegion"
        active-text="行政区划"
        inactive-text="业务分组"
        @change="change"
      />
    </div>
    <div class="tree-content">
      <div v-if="!showHeader" class="switch-container">
        <el-switch
          v-model="showRegion"
          active-text="行政区划"
          inactive-text="业务分组"
          @change="change"
        />
      </div>
      <div class="tree-wrapper">
        <region-tree
          v-if="showRegion"
          ref="regionTree"
          :showIndex="false"
          :showContextmenu="false"
          :hasDevice="true"
          @handleNodeClick="treeNodeClickEvent"
          :isContextmenu="isContextmenu"
          @playChannel="playChannelFun($event, 'region')"
          @updatePosition="updatePositionFun($event, 'region')"
        />
        <group-tree
          v-if="!showRegion"
          ref="groupTree"
          :showIndex="false"
          :showContextmenu="false"
          :hasDevice="true"
          @handleNodeClick="treeNodeClickEvent"
          :isContextmenu="isContextmenu"
          @playChannel="playChannelFun($event, 'group')"
          @updatePosition="updatePositionFun($event, 'group')"
        />
      </div>
    </div>
  </div>
</template>

<script>
import GroupTree from '@/views/nvr/components/common/GroupTree.vue'
import RegionTree from '@/views/nvr/components/common/RegionTree.vue'

export default {
  name: 'DeviceTree',
  components: { GroupTree, RegionTree },
  props: {
    device: { type: Object, default: function () { return {} } },
    isContextmenu: { type: Boolean, default: false },
    showHeader: { type: Boolean, default: true }
  },
  data: function () {
    return {
      showRegion: false
    }
  },
  methods: {
    treeNodeClickEvent: function (data) {
      if (data.leaf) {
        this.$emit('clickEvent', data.id)
      }
    },
    refresh: function (id) {
      if (this.showRegion) {
        this.$refs.regionTree.refresh(id)
      } else {
        this.$refs.groupTree.refresh(id)
      }
    },
    playChannelFun: function (data, type) {
      this.$emit('playChannel', data, type)
    },
    updatePositionFun: function (data, type) {
      this.$emit('updatePosition', data, type)
    },
    change: function () {
      this.$emit('change', this.showRegion)
    }
  }
}
</script>

<style lang="scss" scoped>
.device-tree-container {
  .panel-header {
    display: flex;
    align-items: center;
    padding: 10px;
    font-size: 14px;
    border-bottom: 1px solid #eee;
    .el-icon-video-camera { margin-right: 6px; font-size: 16px; }
    span { flex: 1; }
  }
  .tree-content { height: calc(100% - 50px); overflow: auto; }
  .switch-container { padding: 10px; }
}
</style>
