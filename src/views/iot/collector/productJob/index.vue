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
import { getList, getDetail, add, update, remove } from '@/api/iot/collector/product-modbus-job'

export default {
  name: 'ProductModbusJob',
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
                "label": "产品ID",
                "prop": "productId",
                "search": true,
                "width": 120
        },
        {
                "label": "产品名称",
                "prop": "productName",
                "search": true,
                "width": 120
        },
        {
                "label": "任务名称",
                "prop": "jobName",
                "search": true,
                "rules": [
                        {
                                "required": true,
                                "message": "请输入任务名称",
                                "trigger": "blur"
                        }
                ]
        },
        {
                "label": "从站ID",
                "prop": "slaveId",
                "width": 100
        },
        {
                "label": "功能码",
                "prop": "functionCode",
                "width": 100
        },
        {
                "label": "起始地址",
                "prop": "startAddress",
                "width": 100
        },
        {
                "label": "数量",
                "prop": "quantity",
                "width": 80
        }
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
