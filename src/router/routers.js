import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '../layout/Layout'

/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
*                                if not set alwaysShow, only more than one route under the children
*                                it will becomes nested mode, otherwise not show the root menu
* redirect: noredirect           if `redirect:noredirect` will no redirect in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
  }
**/
import { pathStr } from '@/utils'

export const constantRouterMap = [
  {
    path: `${pathStr()}/login`,
    meta: { title: '登录', noCache: true },
    component: () => import('@/views/login'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/features/404'),
    hidden: true
  },
  {
    path: '/netWorkError',
    component: () => import('@/views/features/netWorkError'),
    hidden: true
  },
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path*',
        component: () => import('@/views/features/redirect')
      }
    ]
  },
  {
    path: '/',
    component: Layout,
    redirect: `${pathStr()}/dashboard/index`,
    hidden: true,
    children: [
      {
        path: `${pathStr()}/dashboard/index`,
        component: () => import('@/views/home'),
        name: '首页',
        meta: { title: '首页', icon: 'index', noCache: true, affix: true }
      }, {
        path: '/401',
        component: () => import('@/views/features/401'),
        hidden: true
      }
    ]
  },
  {
    path: '/user',
    component: Layout,
    hidden: true,
    redirect: 'noredirect',
    children: [
      {
        path: 'center',
        component: () => import('@/views/system/user/center'),
        name: '个人中心',
        meta: { title: '个人中心', icon: 'user' }
      }
    ]
  },
  // 我添加的
  {
    path: '/zl',
    component: resolve => require(['@/views/zl/home'], resolve),
    hidden: true,
    children: [
      {
        // 销售达成
        path: 'xsdc',
        component: () => import('@/views/zl/xsdc'),
        name: '销售达成'
      },
      {
        // 粮源保障
        path: 'lybz',
        component: () => import('@/views/zl/lybz'),
        name: '粮源保障'
      },
      {
        // 库存分布
        path: 'kcfb',
        component: () => import('@/views/zl/kcfb'),
        name: '库存分布'
      }
    ]
  }
  // { path: '*', redirect: '/404', hidden: true }
]

export default new Router({
  mode: 'history',
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})

