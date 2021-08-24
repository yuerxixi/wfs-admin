import Vue from 'vue'

import Cookies from 'js-cookie'

import 'normalize.css/normalize.css'

import Element from 'element-ui'
//
// import mavonEditor from 'mavon-editor'
// import 'mavon-editor/dist/css/index.css'

// 数据字典
// import dict from './components/Dict'

// hls播放器
const hls = require('videojs-contrib-hls')
Vue.use(hls)

// 权限指令
// import checkPer from '@/utils/permission'
// import permission from './components/Permission'
import './assets/styles/element-variables.scss'
// global css
import './assets/styles/index.scss'

// 代码高亮
import VueHighlightJS from 'vue-highlightjs'
import 'highlight.js/styles/atom-one-dark.css'
import './assets/ttf/font.css'

import App from './App'
import store from './store'
import router from './router/routers'

// import { mockXHR } from './mock/index'
// if (process.env.NODE_ENV === 'development') {
// mockXHR()
// }

import './assets/icons' // icon
import './router/index' // permission control
// import 'echarts-gl'
// import * as echarts from 'echarts'
// Vue.prototype.$echarts = echarts

// 引入基本模板
const echarts = require('echarts/lib/echarts')

// 引入折线图等组件
require('echarts/lib/chart/line')
require('echarts/lib/chart/bar')
require('echarts/lib/chart/pie')

// 引入提示框和title组件，图例
require('echarts/lib/component/tooltip')
require('echarts/lib/component/title')
require('echarts/lib/component/legend')
require('echarts/lib/component/legendScroll')

Vue.prototype.$echarts = echarts

// Vue.use(checkPer)
Vue.use(VueHighlightJS)
// Vue.use(mavonEditor)
// Vue.use(permission)
// Vue.use(dict)
Vue.use(Element, {
  size: Cookies.get('size') || 'small' // set element-ui default size
})

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
