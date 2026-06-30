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
      @row-save="handleRowSave"
      @row-update="handleRowUpdate"
      @row-del="rowDel"
      @selection-change="selectionChange"
    >
      <template slot-scope="{ row, type, disabled }" slot="menuForm">
        <firmware-form ref="formRef" :form-data="form" :type="type" :disabled="disabled" @submit="handleFormSubmit" />
      </template>
    </avue-crud>
  </basic-container>
</template>

<script>
import { getList, getDetail, add, update, remove } from '@/api/iot/link/firmware'
import FirmwareForm from './firmware-form'

export default {
  name: 'FirmwarePage',
  components: { FirmwareForm },
  data() {
    return {
      form: {},
      tableData: [],
      page: { currentPage: 1, pageSize: 20, total: 0 },
      query: {},
      selectionList: [],
      submitType: 'add',
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
                "label": "固件名称",
                "prop": "firmwareName",
                "search": true,
                "width": 150
        },
        {
                "label": "固件版本",
                "prop": "firmwareVersion",
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
                "label": "固件大小",
                "prop": "firmwareSize",
                "width": 100
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
    handleRowSave(row, done, loading) {
      this.submitType = 'add'
      this.form = { ...row }
    },
    handleRowUpdate(row, index, done, loading) {
      this.submitType = 'edit'
      this.form = { ...row }
    },
    async handleFormSubmit(formData) {
      try {
        if (this.submitType === 'add') {
          await add(formData)
          this.$message.success('新增成功')
        } else {
          await update(formData)
          this.$message.success('修改成功')
        }
        this.$refs.crud.rowCancel()
        this.onLoad(this.page)
      } catch (e) {
        this.$message.error('操作失败')
      }
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
