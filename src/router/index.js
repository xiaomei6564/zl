import router from './routers'
import store from '@/store'
import Config from '@/config'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css'// progress bar style
import { getToken } from '@/utils/auth' // getToken from cookie
import { buildMenus } from '@/api/menu'
import { filterAsyncRouter } from '@/store/modules/permission'
import { pathStr } from '@/utils'
NProgress.configure({ showSpinner: false })// NProgress Configuration

const whiteList = [`${pathStr()}/login`, '/401', '/netWorkError']// 没有重定向白名单
var state = false
const Base64 = require('js-base64').Base64

// router.beforeEach((to, from, next) => {
//   store.commit('SET_SHOW_TITLE', to.meta.title)
//   if (to.meta.title) {
//     document.title = to.meta.title + ' - ' + Config.webName
//   }
//   NProgress.start() // start progress bar
//   if (getToken()) {
//     if (to.query.utk && to.query.utk !== '' && !state) {
//       const UTK = {utk: to.query.utk}
//       state = true
//       store.dispatch('LygRz', UTK).then(res => {
//         // store.dispatch('IsOnlineUser', Base64.decode(UTK)).then(res1 => {
//           loadMenus(next, to)
//           store.dispatch('GetLevel')
//         // })
//       })
//     }
//     // 已登录且要跳转的页面是登录页
//     if (to.path === `${pathStr()}/login`) {
//       next({path: '/'})
//       NProgress.done() // 如果当前的页面是仪表盘，每次挂起后都不会触发，所以要手动处理
//     } else {
//       if (store.getters.roles.length === 0) { // 判断当前用户是否已拉取完user_info信息
//         store.dispatch('GetInfo').then(res => { // 拉取user_info
//           // 动态路由，拉取菜单
//           // store.dispatch('IsOnlineUser').then(res1 => {
//             loadMenus(next, to)
//             store.dispatch('GetLevel')
//           // })
//         }).catch((err) => {
//           console.log(err)
//           store.dispatch('LogOut').then(() => {
//             location.reload() // 为了重新实例化vue-router对象 避免bug
//           })
//         })
//         // 登录时未拉取 菜单，在此处拉取
//       } else if (store.getters.loadMenus) {
//         // 修改成false，防止死循环
//         // store.dispatch('IsOnlineUser').then(res1 => {
//           store.dispatch('updateLoadMenus').then(res => {
//           })
//           loadMenus(next, to)
//           store.dispatch('GetLevel')
//         // })
//       } else {
//         next()
//       }
//     }
//   } else {
//     /**地址中存在单点登录信息utk*/
//     if (to.query.utk && to.query.utk !== '') {
//       const UTK = {utk: to.query.utk}
//       store.dispatch('LygRz', UTK).then(res => {
//         // store.dispatch('IsOnlineUser', Base64.decode(UTK)).then(res1 => {
//           // 动态路由，拉取菜单
//           loadMenus(next, to)
//           store.dispatch('GetLevel')
//         // })
//       })

//     } else {
//       /* has no token*/
//       if (whiteList.indexOf(to.path) !== -1) { // 在免登录白名单，直接进入
//         next()
//       } else {
//         next(`${pathStr()}/login?redirect=${to.path}`) // 否则全部重定向到登录页
//         NProgress.done()
//       }
//     }

//   }
// })

export const loadMenus = (next, to) => {
  buildMenus().then(res => {
    const asyncRouter = filterAsyncRouter(res)
    asyncRouter.push({ path: '*', redirect: '/404', hidden: true })
    store.dispatch('GenerateRoutes', asyncRouter).then(() => { // 存储路由
      router.addRoutes(asyncRouter) // 动态添加可访问路由表
      next({ ...to, replace: true })
    })
  })
}

router.afterEach(() => {
  NProgress.done() // finish progress bar
})
