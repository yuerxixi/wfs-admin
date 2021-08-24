import Vue from 'vue'
import Router from 'vue-router'
import Layout from '../layout/index'

Vue.use(Router)

export const constantRouterMap = [
  { path: '/login',
    meta: { title: '登录', noCache: true },
    component: (resolve) => require(['@/views/login'], resolve),
    hidden: true
  },
  {
    path: '/404',
    component: (resolve) => require(['@/views/features/404'], resolve),
    hidden: true
  },
  {
    path: '/401',
    component: (resolve) => require(['@/views/features/401'], resolve),
    hidden: true
  },
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path*',
        component: (resolve) => require(['@/views/features/redirect'], resolve)
      }
    ]
  },
  // {
  //   path: '/',
  //   component: Layout,
  //   redirect: '/dashboard',
  //   hidden: true,
  //   children: [
  //     {
  //       path: '/dashboard',
  //       component: (resolve) => require(['@/views/light/lightingStrategy'], resolve),
  //       name: 'Dashboard',
  //       meta: { title: '总览', icon: 'index', affix: true, noCache: true }
  //     }
  //   ]
  // },
  {
    path: '/noRegistration/generalOverview',
    component: () => import('@/views/features/generalOverview'),
    name: 'generalOverview2',
    hidden: true,
    meta: { title: '综合概览', icon: 'message', noCache: true }
  },
  {
    path: '/',
    component: () => import('@/views/features/generalOverview'),
    name: 'generalOverview',
    hidden: true,
    meta: { title: '综合概览', icon: 'gonggao', noCache: true }
  }
  // 全屏概览切换
  // {
  //   path: '/',
  //   component: Layout,
  //   redirect: '/404',
  //   children: [
  //     {
  //       path: '/404',
  //       component: (resolve) => require(['@/views/features/404'], resolve),
  //       name: '404',
  //       hidden: true,
  //       meta: { title: '概览', icon: 'index', affix: true, noCache: true }
  //     }
  //     {
  //       path: '/dashboard',
  //       component: (resolve) => require(['@/views/home'], resolve),
  //       name: 'Dashboard',
  //       meta: { title: '总览', icon: 'index', affix: true, noCache: true }
  //     }
  //   ]
  // },
  // {
  //   path: '/wisdomParking',
  //   component: () => import('@/views/features/wisdomParking'),
  //   name: 'wisdomParking',
  //   hidden: true,
  //   meta: { title: '智慧停车', icon: 'gonggao', noCache: true }
  // },
  // {
  //   path: '/light',
  //   component: Layout,
  //   redirect: '/light/lightingStrategy',
  //   meta: {
  //     title: '照明管理',
  //     icon: 'zmgl'
  //   },
  //   children: [
  //     {
  //       path: '/light/lightingStrategy',
  //       component: () => import('@/views/light/lightingStrategy/index'),
  //       name: 'lightingStrategy',
  //       meta: { title: '照明策略', icon: 'zmgl' }
  //     }
  //   ]
  // },
  // {
  //   path: '/parking',
  //   component: Layout,
  //   redirect: '/parking/parkingLot',
  //   meta: {
  //     title: '停车管理',
  //     icon: 'tcgl'
  //   },
  //   children: [
  //     {
  //       path: '/parking/parkingArea',
  //       component: () => import('@/views/parking/parkingArea'),
  //       name: 'parkingArea',
  //       meta: {
  //         title: '停车管理',
  //         icon: 'tcgl'
  //       }
  //     }
  //   ]
  // },
  // {
  //   path: '/video',
  //   component: Layout,
  //   redirect: '/video/RealTimeMonitor',
  //   meta: {
  //     title: '视频监控',
  //     icon: 'spjk'
  //   },
  //   children: [
  //     {
  //       path: '/video/RealTimeMonitor',
  //       component: () => import('@/views/video/realTimeMonitor'),
  //       name: 'realTimeMonitor',
  //       meta: {
  //         title: '实时监控',
  //         icon: 'spjk'
  //       }
  //     },
  //     {
  //       path: '/video/videoPlayBack',
  //       component: () => import('@/views/video/videoPlayBack'),
  //       name: 'videoPlayBack',
  //       meta: {
  //         title: '录像回放',
  //         icon: 'spjk'
  //       }
  //     }
  //   ]
  // },
  // {
  //   path: '/info',
  //   component: Layout,
  //   redirect: '/info/infoPublish',
  //   meta: {
  //     title: '信息发布',
  //     icon: 'xxfb'
  //   },
  //   children: [
  //     {
  //       path: '/info/infoPublish',
  //       component: () => import('@/views/info/infoPublish'),
  //       name: 'infoPublish',
  //       meta: {
  //         title: '信息发布',
  //         icon: 'xxfb'
  //       }
  //     }
  //   ]
  // },
  // {
  //   path: '/info/parkTitle',
  //   component: () => import('@/views/info/template/parkTitle'),
  //   name: 'parkTitle',
  //   hidden: true,
  //   meta: { title: '停车信息模板', icon: 'message', noCache: true }
  // },
  // {
  //   path: '/info/parkBigLed',
  //   component: () => import('@/views/info/template/ParkBigLed'),
  //   name: 'parkBigLed',
  //   hidden: true,
  //   meta: { title: '全彩屏模板', icon: 'message', noCache: true }
  // }
  // {
  //   path: '/alarm',
  //   component: Layout,
  //   redirect: '/alarm/alarmManagement',
  //   meta: {
  //     title: '告警管理',
  //     icon: 'gjgl'
  //   },
  //   children: [
  //     {
  //       path: '/alarm/alarmManagement',
  //       component: () => import('@/views/alarm/alarmManagement'),
  //       name: 'alarmManagement',
  //       meta: {
  //         title: '告警管理',
  //         icon: 'gjgl'
  //       }
  //     }
  //   ]
  // },
  // {
  //   path: '/device',
  //   component: Layout,
  //   redirect: '/device',
  //   meta: {
  //     title: '设备管理',
  //     icon: 'sbgl'
  //   },
  //   children: [
  //     {
  //       path: '/device/deviceDictionary',
  //       component: () => import('@/views/device/deviceDictionary'),
  //       name: 'deviceDictionary',
  //       meta: { title: '设备字典', icon: 'sbgl' }
  //     },
  //     {
  //       path: '/device/deviceManage',
  //       component: () => import('@/views/device/deviceManage'),
  //       name: 'deviceManage',
  //       meta: { title: '设备管理22', icon: 'sbgl' }
  //     }
  //   ]
  // },
  // {
  //   path: '/syst',
  //   component: Layout,
  //   redirect: '/syst/role',
  //   meta: {
  //     title: '系统管理',
  //     icon: 'xtgl'
  //   },
  //   children: [
  //     {
  //       path: '/syst/role',
  //       component: () => import('@/views/syst/role/index'),
  //       name: 'role',
  //       meta: { title: '权限管理', icon: 'xtgl' }
  //     }
  //   ]
  // }
]

export default new Router({
  // mode: 'hash',
  mode: 'history',
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})
