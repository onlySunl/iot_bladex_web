<template>
  <div class="group-tree">
    <el-input v-model="filterText" placeholder="搜索分组" size="small" prefix-icon="el-icon-search" clearable style="margin-bottom: 10px;"></el-input>
    <el-tree :data="treeData" :props="defaultProps" :filter-node-method="filterNode" ref="tree" @node-click="handleNodeClick" highlight-current default-expand-all></el-tree>
  </div>
</template>

<script>
export default {
  name: 'GroupTree',
  props: {
    multiple: { type: Boolean, default: false }
  },
  data() {
    return {
      filterText: '',
      treeData: [],
      defaultProps: { children: 'children', label: 'name' }
    }
  },
  watch: {
    filterText(val) { this.$refs.tree.filter(val) }
  },
  mounted() { this.loadData() },
  methods: {
    loadData() {
      this.treeData = []
    },
    filterNode(value, data) {
      if (!value) return true
      return data.name && data.name.indexOf(value) !== -1
    },
    handleNodeClick(data) {
      this.$emit('node-click', data)
    }
  }
}
</script>
