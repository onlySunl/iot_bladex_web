<template>
  <div class="app-container">
    <basic-container>
      <el-row :gutter="20">
        <el-col :span="6">
          <GroupTree ref="groupTree" @node-click="handleGroupClick" />
        </el-col>
        <el-col :span="18">
          <h3>分组管理</h3>
          <p>分组管理功能。完整实现待补充。</p>
        </el-col>
      </el-row>
    </basic-container>
  </div>
</template>

<script>
import GroupTree from '@/components/common/GroupTree.vue'

export default {
  name: 'Group',
  components: { GroupTree },
  data() {
    return {}
  },
  methods: {
    handleGroupClick(data) {
      console.log('Group clicked:', data)
    }
  }
}
</script>
