<template>
  <div class="device-tree">
    <el-input v-model="filterText" placeholder="搜索设备" size="small" prefix-icon="el-icon-search" clearable style="margin-bottom: 10px;" />
    <el-tree
      ref="tree"
      :data="treeData"
      :props="treeProps"
      :filter-node-method="filterNode"
      :highlight-current="true"
      :default-expand-all="false"
      :expand-on-click-node="false"
      @node-click="handleNodeClick"
      @node-contextmenu="handleContextMenu"
    >
      <span class="custom-tree-node" slot-scope="{ node, data }">
        <span>
          <i :class="getNodeIcon(data)"></i>
          {{ node.label }}
        </span>
        <span v-if="isContextmenu" class="tree-node-actions">
          <el-dropdown trigger="click" @command="handleCommand">
            <i class="el-icon-more"></i>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item :command="{ action: 'play', data: data }">
                <i class="el-icon-video-play"></i> 播放
              </el-dropdown-item>
              <el-dropdown-item :command="{ action: 'snapshot', data: data }">
                <i class="el-icon-camera"></i> 抓图
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </span>
      </span>
    </el-tree>
  </div>
</template>

<script>
import { listDevice } from '@/api/nvr/device'
import { getGroupTree } from '@/api/nvr/group'
import { getRegionTree } from '@/api/nvr/region'

export default {
  name: 'DeviceTree',
  props: {
    isContextmenu: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      filterText: '',
      treeData: [],
      treeProps: {
        children: 'children',
        label: 'label'
      }
    }
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val)
    }
  },
  mounted() {
    this.loadTree()
  },
  methods: {
    async loadTree() {
      try {
        var res = await getGroupTree()
        if (res.data && res.data.length > 0) {
          this.treeData = res.data
          return
        }
        var res2 = await getRegionTree()
        if (res2.data && res2.data.length > 0) {
          this.treeData = res2.data
          return
        }
        var res3 = await listDevice({ current: 1, size: 1000 })
        if (res3.data && res3.data.rows) {
          this.treeData = res3.data.rows.map(function(item) {
            return {
              id: item.id,
              label: item.deviceName || item.deviceCode,
              deviceCode: item.deviceCode,
              type: item.type,
              children: []
            }
          })
        }
      } catch (e) {
        console.error('加载设备树失败', e)
      }
    },
    filterNode(value, data) {
      if (!value) return true
      return data.label && data.label.indexOf(value) !== -1
    },
    handleNodeClick(data) {
      if (data.id) {
        this.$emit('clickEvent', data.id)
      }
    },
    handleContextMenu(event, data) {
      if (this.isContextmenu) {
        event.preventDefault()
        this.$emit('contextMenu', { event: event, data: data })
      }
    },
    handleCommand(command) {
      this.$emit('command', command)
    },
    getNodeIcon(data) {
      if (data.children) return 'el-icon-folder'
      if (data.type === '1') return 'el-icon-camera'
      if (data.type === '12') return 'el-icon-monitor'
      return 'el-icon-video-camera'
    }
  }
}
</script>

<style scoped lang="scss">
.device-tree {
  padding: 10px;
  height: 100%;
  overflow-y: auto;
}
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}
.tree-node-actions {
  cursor: pointer;
}
</style>
