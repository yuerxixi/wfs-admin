<!--分页-->
<template>
  <el-pagination
    :total="page.total"
    :current-page.sync="page.page"
    background
    layout="total, prev, pager, next"
    @size-change="crud.sizeChangeHandler($event)"
    @current-change="crud.pageChangeHandler"
  />
</template>
<script>
import { pagination } from '@crud/crud'
export default {
  mixins: [pagination()]
}
</script>
