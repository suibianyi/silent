import Vue from 'vue'

import Vant from 'vant'
import 'vant/lib/index.css'
import '@vant/touch-emulator'
import '@/styles/index.scss' // global css
import App from '@/pages/mobile/App'
import store from '@/store'
import router from '@/router/index'
import * as filters from '@/filters' // global filters
import { Notify } from 'vant'
import { Dialog } from 'vant'
import LiquorTree from 'liquor-tree'
// import 'echarts-liquidfill'
// import 'echarts-gl'

// import './permission' // permission control
/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online! ! !
 */

// import { mockXHR } from '../mock'
// if (process.env.NODE_ENV === 'production') {
//   mockXHR()
// }
// 重写message防止重复弹窗start
Vue.use(Vant)
Vue.use(Notify)
Vue.use(Dialog)
Vue.use(LiquorTree)
// register global utility filters
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

Vue.config.productionTip = false
Vue.prototype.$Notify = Notify
Vue.prototype.$eventBus = new Vue() // 全局总线

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
