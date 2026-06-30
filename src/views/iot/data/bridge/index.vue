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
    >
    </avue-crud>
  </basic-container>
</template>

<script>
export default {
  name: 'DataBridgePage',
  data() {
    return {
      form: {},
      tableData: [],
      page: { currentPage: 1, pageSize: 20, total: 0 },
      query: {},
      option: {
        grid: true,
        index: true,
        selection: true,
        viewBtn: true,
        border: true,
        align: 'center',
        menuAlign: 'center',
        column: [
          { label: '桥接名称', prop: 'name', search: true },
          { label: '桥接类型', prop: 'type', type: 'select', dicData: [{ label: 'Kafka', value: 'kafka' }, { label: 'RabbitMQ', value: 'rabbitmq' }, { label: 'HTTP推送', value: 'http' }, { label: 'MQTT', value: 'mqtt' }] },
          { label: '状态', prop: 'status', type: 'select', dicData: [{ label: '已启用', value: 1 }, { label: '已禁用', value: 0 }] },
          { label: '创建时间', prop: 'createTime' }
        ]
      }
    }
  },
  methods: {
    onLoad(page, params = {}) {
      // TODO: 加载数据桥接列表
    },
    searchChange(params, done) { done() },
    searchReset() {},
    handleRowSave(row, done, loading) { done() },
    handleRowUpdate(row, index, done, loading) { done() },
    rowDel(row, index, done) { done() }
  }
}
</script>
