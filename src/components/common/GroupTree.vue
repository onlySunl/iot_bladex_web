<template>
  <div class="group-tree">
    <el-input
      v-if="filterable"
      v-model="filterText"
      placeholder="搜索分组"
      size="small"
      clearable
      style="margin-bottom: 10px"
    />
    <el-tree
      ref="tree"
      :data="treeData"
      :props="treeProps"
      :node-key="nodeKey"
      :show-checkbox="checkbox"
      :default-expand-all="defaultExpandAll"
      :expand-on-click-node="false"
      :filter-node-method="filterNode"
      :highlight-current="!checkbox"
      :default-checked-keys="defaultCheckedKeys"
      :default-expanded-keys="defaultExpandedKeys"
      @node-click="handleNodeClick"
      @check="handleCheck"
    >
      <span slot-scope="{ node, data }" class="group-tree-node">
        <i class="el-icon-folder" style="margin-right: 5px; color: #e6a23c" />
        <span>{{ node.label }}</span>
      </span>
    </el-tree>
  </div>
</template>

<script>
import { queryForGroupTree } from '@/api/nvr/group'

export default {
  name: 'GroupTree',
  props: {
    filterable: {
      type: Boolean,
      default: true
    },
    checkbox: {
      type: Boolean,
      default: false
    },
    nodeKey: {
      type: String,
      default: 'id'
    },
    defaultExpandAll: {
      type: Boolean,
      default: false
    },
    defaultCheckedKeys: {
      type: Array,
      default: () => []
    },
    defaultExpandedKeys: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      filterText: '',
      treeData: [],
      treeProps: {
        children: 'children',
        label: 'name'
      }
    }
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val)
    }
  },
  mounted() {
    this.loadData()
  },
  methods: {
    async loadData() {
      try {
        const res = await queryForGroupTree({})
        if (res && res.data) {
          this.treeData = res.data || []
        }
      } catch (e) {
        console.error('Failed to load group tree:', e)
      }
    },
    filterNode(value, data) {
      if (!value) return true
      return data.name && data.name.indexOf(value) !== -1
    },
    handleNodeClick(data, node) {
      this.$emit('node-click', data, node)
    },
    handleCheck(data, checked) {
      this.$emit('check', data, checked)
    },
    getCheckedNodes() {
      return this.$refs.tree.getCheckedNodes()
    },
    getCheckedKeys() {
      return this.$refs.tree.getCheckedKeys()
    },
    setCheckedKeys(keys) {
      this.$refs.tree.setCheckedKeys(keys)
    }
  }
}
</script>

<style scoped>
.group-tree {
  padding: 10px;
}
.group-tree-node {
  font-size: 14px;
}
</style>
