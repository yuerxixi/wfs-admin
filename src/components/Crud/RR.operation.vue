<!--搜索与重置-->
<template>
  <span>
    <el-button size="mini" icon="el-icon-search" type="primary" style="margin-right: 7px" @click="crud.toQuery">搜 索</el-button>
    <el-button v-if="crud.optShow.reset" size="mini" icon="el-icon-refresh-left" @click="crud.resetQuery()">重 置</el-button>
  </span>
</template>
<script>
import { crud } from '@crud/crud'
export default {
  mixins: [crud()],
  props: {
    itemClass: {
      type: String,
      required: false,
      default: ''
    }
  }
}
</script>
