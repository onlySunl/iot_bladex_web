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
import { getList, getDetail, add, update, remove, getTree } from '@/api/iot/device/device-group'

export default {
  name: 'DeviceGroup',
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
        rowKey: 'id',
        lazy: true,
        treeProps: { children: 'children', hasChildren: 'hasChildren' },
        column: [
        {
                "label": "分组名称",
                "prop": "groupName",
                "search": true,
                "rules": [
                        {
                                "required": true,
                                "message": "请输入分组名称",
                                "trigger": "blur"
                        }
                ]
        },
        {
                "label": "父级ID",
                "prop": "parentId",
                "type": "select",
                "dicUrl": "/api/iot/device-group/tree",
                "props": {
                        "label": "groupName",
                        "value": "id"
                },
                "hide": true,
                "width": 120
        },
        {
                "label": "排序",
                "prop": "sort",
                "type": "number",
                "width": 80
        },
        {
                "label": "描述",
                "prop": "description",
                "width": 200,
                "overHidden": true
        },
        {
                "label": "创建时间",
                "prop": "createTime",
                "width": 160
        }
]
      }
    }
  },
  methods: {
    async onLoad(page) {
      const res = await getTree(this.query)
      this.tableData = res.data
    },
    searchChange(params, done) {
      this.query = params
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
