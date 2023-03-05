import Vue from 'vue'
import Router from 'vue-router'
import { AUTHS_MAP } from '../auths'

Vue.use(Router, AUTHS_MAP)

/* Layout */

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */
export const routeGroups = {
  BASIC: {
    name: '基础管理',
    key: 'basic'
  }, // 基础管理
  EDU_MGT: {
    name: '教务管理',
    key: 'edu'
  }, // 教务管理
  EXAM_MGT: {
    name: '考试管理',
    key: 'exam'
  }, // 教务管理
  ATTND: {
    name: '考勤管理',
    key: 'attnd'
  },
  INFO: {
    name: '信发管理',
    key: 'info'
  },
  RESERVE: {
    name: '预约管理',
    key: 'reserve'
  },
  DORM: {
    name: '宿舍管理',
    key: 'dorm'
  },
  DEV: {
    name: '设备管理',
    key: 'dev'
  },
  USER: {
    name: '用户权限',
    key: 'user'
  },
  USERADMIN: {
    name: '后台用户权限',
    key: 'useradmin'
  },
  BIGDATA: {
    name: '大数据编辑',
    key: 'bigdata'
  }
}

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRouterMap = [
  {
    path: '/',
    component: () => {
      return import('@/pages/mobile/mViews/index')
    }
  },
  {
    path: '/register',
    component: () => {
      return import('@/pages/mobile/mViews/components/register/index')
    }
  },
  // {
  //   path: '/mobile',
  //   component: () => {
  //     return import('@/pages/mobile/mViews/index')
  //   }
  // },
  {
    path: '/mobile/:page',
    component: () => {
      return import('@/pages/mobile/mViews/index')
    }
  },
  // {
  //   path: '/whoisyourdaddy',
  //   component: () => {
  //     return import('@/pages/mobile/mViews/create')
  //   }
  // },
  {
    path: '/whoisyourdaddy/:page',
    component: () => {
      return import('@/pages/mobile/mViews/create')
    }
  }
]

export const asyncRouterMap = [
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  // scrollBehavior: () => {
  //   history.pushState(null, null, document.URL)
  // },
  routes: constantRouterMap
})

console.log('路由解析1111111111111111', this)
const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
