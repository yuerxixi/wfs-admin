<template>
  <div>
    <el-button v-if="hasQjzs" type="text" icon="el-icon-s-home" style="font-size: 16px" @click="click">全景展示</el-button>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'Screenfull',
  data() {
    return {
      isFullscreen: false
    }
  },
  computed: {
    ...mapGetters([
      'sidebarRouters',
      'sidebar'
    ]),
    hasQjzs() {
      return this.sidebarRouters.some(item => {
        return item.name === '全景展示'
      })
    }
  },
  methods: {
    click() {
      this.$router.push({
        path: '/features/generalOverview'
      })
    }
  }
}
</script>

<style scoped lang="scss">
  #screenfull{
    ::v-deep .el-button--text {
      color: #ffffff !important;
      font-weight: bold;
    }
  }
</style>
