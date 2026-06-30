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
      @row-save="rowSave"
      @row-update="rowUpdate"
      @row-del="rowDel"
      @selection-change="selectionChange"
    >
    </avue-crud>
  </basic-container>
</template>

<script>
import { getList, getDetail, add, update, remove } from '@/api/iot/rule/scene-model'

export default {
  name: 'SceneModel',
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
          { label: "模型名称", prop: "modelName", search: true, rules: [{ required: true, message: "请输入模型名称", trigger: "blur" }] },
          { label: "模型类型", prop: "modelType", type: "select", dicUrl: "/api/blade-system/dict/dictionary?code=iot_model_type", props: { label: "dictValue", value: "dictKey" }, dataType: "number", search: true, width: 120 },
          { label: "场景ID", prop: "sceneId", search: true, width: 120 },
          { label: "描述", prop: "description", width: 200, overHidden: true },
          { label: "是否启用", prop: "isEnabled", type: "select", dicUrl: "/api/blade-system/dict/dictionary?code=iot_enable_status", props: { label: "dictValue", value: "dictKey" }, dataType: "number", search: true, width: 100 },
          { label: "创建时间", prop: "createTime", width: 160 }
        ]
      }
    }
  },
  methods: {
    async onLoad(page) {
      const res = await getList(page.currentPage, page.pageSize, this.query)
      this.tableData = res.data.records
      this.page.total = res.data.total
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
    async rowSave(row, done, loading) {
      await add(row)
      this.$message.success('新增成功')
      done()
      this.onLoad(this.page)
    },
    async rowUpdate(row, index, done, loading) {
      await update(row)
      this.$message.success('修改成功')
      done()
      this.onLoad(this.page)
    },
    async rowDel(row, index, done) {
      await this.$confirm('确定删除该条数据吗？', '提示', { type: 'warning' })
      await remove(row.id)
      this.$message.success('删除成功')
      done()
    },
    selectionChange(list) {
      this.selectionList = list
    }
  }
}
</script>
