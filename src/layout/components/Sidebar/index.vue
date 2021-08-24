<template>
  <div :class="{'has-logo':showLogo}">
    <logo v-if="showLogo" :collapse="isCollapse" />
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <el-menu
        :default-active="activeMenu"
        :collapse="false"
        :background-color="variables.menuBg"
        :text-color="variables.menuText"
        :unique-opened="$store.state.settings.uniqueOpened"
        :active-text-color="variables.menuActiveText"
        mode="vertical"
        @select="selMenu"
      >
        <sidebar-item v-for="route in sidebarRoutersCopy" :key="route.path" :item="route" :active-route-path="activeRoutePath" :base-path="route.path" />
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Logo from './Logo'
import SidebarItem from './SidebarItem'
import variables from '@/assets/styles/variables.scss'
import { deepClone } from '../../../utils/common'

export default {
  components: { SidebarItem, Logo },
  data() {
    return {
      activeRoutePath: '',
      sidebarRoutersCopy: ''
    }
  },
  computed: {
    ...mapGetters([
      'sidebarRouters',
      'sidebar'
    ]),
    activeMenu() {
      const route = this.$route
      const { meta, path } = route
      // if set path, the sidebar will highlight the path you set
      if (meta.activeMenu) {
        return meta.activeMenu
      }
      return path
    },
    showLogo() {
      return this.$store.state.settings.sidebarLogo
    },
    variables() {
      return variables
    },
    isCollapse() {
      return !this.sidebar.opened
    }
  },
  mounted() {
    this.activeRoutePath = this.$route.path
    this.sidebarRoutersCopy = deepClone(this.sidebarRouters)
  },
  methods: {
    selMenu(index, indexPath) {
      this.activeRoutePath = index
      this.sidebarRoutersCopy = deepClone(this.sidebarRouters)
    }
  }
}
</script>
