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
      <template slot-scope="{ row }" slot="isEnabled">
        <el-switch :value="row.isEnabled === 1" @change="handleToggle(row)" />
      </template>
    </avue-crud>
  </basic-container>
</template>

<script>
import { getList, getDetail, add, update, remove } from '@/api/iot/link/sub-gateway'

export default {
  name: 'SubGateway',
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
                "label": "网关名称",
                "prop": "gatewayName",
                "search": true,
                "rules": [
                        {
                                "required": true,
                                "message": "请输入网关名称",
                                "trigger": "blur"
                        }
                ]
        },
        {
                "label": "网关类型",
                "prop": "gatewayType",
                "type": "select",
                "dicUrl": "/api/blade-system/dict/dictionary?code=iot_product_type",
                "props": {
                        "label": "dictValue",
                        "value": "dictKey"
                },
                "dataType": "number",
                "search": true,
                "width": 120
        },
        {
                "label": "父设备ID",
                "prop": "parentDeviceId",
                "width": 120
        },
        {
                "label": "协议ID",
                "prop": "protocolId",
                "width": 120
        },
        {
                "label": "是否启用",
                "prop": "isEnabled",
                "type": "select",
                "dicUrl": "/api/blade-system/dict/dictionary?code=iot_enable_status",
                "props": {
                        "label": "dictValue",
                        "value": "dictKey"
                },
                "dataType": "number",
                "slot": true,
                "search": true,
                "width": 100
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
    },
    async handleToggle(row) {
      try {
        await update({ id: row.id, isEnabled: row.isEnabled === 1 ? 0 : 1 })
        this.$message.success('操作成功')
        this.onLoad(this.page)
      } catch (e) {
        this.$message.error('操作失败')
      }
    }
  }
}
</script>
