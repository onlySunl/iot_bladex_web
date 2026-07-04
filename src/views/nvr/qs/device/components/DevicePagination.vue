<template>
  <div style="margin-top:16px;display:flex;justify-content:flex-end;">
    <el-pagination
        :current-page="pageNum"
        :page-size="pageSize"
        :total="total"
        :page-sizes="[10, 20, 50, 100]"
        layout="total, sizes, prev, pager, next, jumper"
        @change="handlePageChange"
    />
  </div>
</template>

<script setup>
const props = defineProps({
  pageNum: Number,
  pageSize: Number,
  total: Number
})

const emit = defineEmits(['update:page-num', 'update:page-size', 'change'])

const handlePageChange = ({ currentPage, pageSize }) => {
  emit('update:page-num', currentPage)
  emit('update:page-size', pageSize)
  emit('change')
}
</script>