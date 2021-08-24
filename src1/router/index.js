import router from './routers'
import store from '@/store'
import Config from '@/settings'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css'// progress bar style
import { getToken, setToken } from '@/utils/auth' // getToken from cookie
import { menuNav } from '@/api/syst/syst'
import { filterAsyncRouter } from '@/store/modules/permission'

NProgress.configure({ showSpinner: false })// NProgress Configuration

const whiteList = ['/login', '/info/parkTitle', '/noRegistration/generalOverview', '/noRegistration/infoPublish']// no redirect whitelist

router.beforeEach((to, from, next) => {
  if (to.meta.title) {
    document.title = to.meta.title + ' - ' + Config.title
  }
  NProgress.start()
  if (getToken()) {
    // 已登录且要跳转的页面是登录页
    if (to.path === '/login') {
      next({ path: '/' })
      NProgress.done()
    } else {
      if (store.getters.roles.length === 0) { // 判断当前用户是否已拉取完user_info信息
        // store.dispatch('SetSidebarRouters', [])
        // next()
        store.dispatch('GetInfo').then(() => { // 拉取user_info
          // 动态路由，拉取菜单
          loadMenus(next, to)
        }).catch(() => {
          store.dispatch('LogOut').then(() => {
            location.reload() // 为了重新实例化vue-router对象 避免bug
          })
        })
      // 登录时未拉取 菜单，在此处拉取
      } else if (store.getters.loadMenus) {
        // 修改成false，防止死循环
        store.dispatch('updateLoadMenus')
        loadMenus(next, to)
      } else {
        next()
      }
    }
  } else {
    /* has no token*/
    if (whiteList.indexOf(to.path) !== -1) { // 在免登录白名单，直接进入
      // 免登token，直接访问综合概览
      if (to.path === '/noRegistration/generalOverview' || to.path === '/noRegistration/infoPublish') {
        const noLoginToken = store.getters.noLoginToken
        setToken(noLoginToken, false)
        store.commit('SET_TOKEN', noLoginToken)
        store.dispatch('updateLoadMenus')
        loadMenus(next, to)
      } else {
        next()
      }
    } else {
      next(`/login?redirect=${to.fullPath}`) // 否则全部重定向到登录页
      NProgress.done()
    }
  }
})

export const loadMenus = (next, to) => {
  menuNav().then(res => {
    const newData = build(res)
    const sdata = JSON.parse(JSON.stringify(newData))
    const rdata = JSON.parse(JSON.stringify(newData))
    const sidebarRoutes = filterAsyncRouter(sdata)
    const rewriteRoutes = filterAsyncRouter(rdata, true)
    rewriteRoutes.push({ path: '*', redirect: '/404', hidden: true })

    store.dispatch('GenerateRoutes', rewriteRoutes).then(() => { // 存储路由
      // router.options.routes = rewriteRoutes
      router.addRoutes(rewriteRoutes) // 动态添加可访问路由表
      if (to.path === '/noRegistration/infoPublish') {
        next(`/info/infoPublish`)
      } else {
        next({ ...to, replace: true })
      }
    })
    store.dispatch('SetSidebarRouters', sidebarRoutes)
  })
}
function build(data) {
  const res = []
  if (data !== null) {
    const menuList = data.menuList
    for (let i = 0; i < menuList.length; i++) {
      const menu = menuList[i]
      const children = menu.children
      const data_child = []
      const hidden = menu.name === '全景展示'
      if (hidden) {
        for (let j = 0; j < children.length; j++) {
          const child = children[j]
          const data1 = '{"component":"' + child.url + '","hidden":true,"meta":{"icon":"' + child.icon + '","noCache":true,"title":"' + child.name + '"},"name":"' + child.name + '","path":"' + child.url + '"}'
          const obj1 = JSON.parse(data1)
          res.push(obj1)
        }
      } else {
        for (let j = 0; j < children.length; j++) {
          const child = children[j]
          const data1 = '{"component":"' + child.url + '","hidden":false,"meta":{"icon":"' + child.icon + '","noCache":true,"title":"' + child.name + '"},"name":"' + child.name + '","path":"' + child.url + '"}'
          const obj1 = JSON.parse(data1)
          data_child.push(obj1)
        }
      }
      const data2 = '{"component":"Layout","hidden":' + hidden + ',"meta":{"icon":"' + menu.icon + '","noCache":true,"title":"' + menu.name + '"},"name":"' + menu.name + '","path":"' + menu.url + '","redirect":"noredirect"}'
      const obj2 = JSON.parse(data2)
      obj2.children = data_child
      res.push(obj2)
    }
  }
  return res
}

router.afterEach(() => {
  NProgress.done() // finish progress bar
})
