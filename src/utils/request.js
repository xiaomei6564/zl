import axios from 'axios'
import router from '@/router/routers'
import { Notification, MessageBox, Message } from 'element-ui'
import store from '../store'
import { getToken } from '@/utils/auth'
import Config from '@/config'

// 创建axios实例
const service = axios.create({
  baseURL: process.env.BASE_API, // api 的 base_url
  timeout: Config.timeout // 请求超时时间
})
//出现一次弹框
let onlyAlert = true;
// request拦截器
service.interceptors.request.use(
  config => {
    if (getToken()) {
      config.headers['Authorization'] = 'Bearer ' + getToken() // 让每个请求携带自定义token 请根据实际情况自行修改
    }
    config.headers['Content-Type'] = 'application/json'
    return config
  },
  error => {
    // Do something with request error
    console.log(error) // for debug
    Promise.reject(error)
  }
)

// response 拦截器
service.interceptors.response.use(
  response => {
    const code = response.status
    if (code < 200 || code > 300) {
      Notification.error({
        title: response.message
      })
      return Promise.reject('error')
    } else {
      return response.data
    }
  },
  error => {
    let code = 0
    console.log(error)
    try {
      code = error.response.data.status || error.response.status
    } catch (e) {
      if (error.toString().indexOf('Error: timeout') !== -1) {
        Notification.error({
          title: '网络请求超时',
          duration: 2500
        })
        return Promise.reject(error)
      }
      if (error.toString().indexOf('Error: Network Error') !== -1) {
        router.push({path: '/netWorkError'})
        Notification.error({
          title: '网络请求错误',
          duration: 2500
        })
        // return Promise.reject(error)
      }
    }
    if (code === 401) {
      if (onlyAlert) {
        onlyAlert = false 
        MessageBox.confirm(
          '登录状态已过期，您可以继续留在该页面，或者重新登录',
          '系统提示',
          {
            confirmButtonText: '重新登录',
            cancelButtonText: '取消',
            type: 'warning'
          }
        ).then(() => {
          store.dispatch('LogOut').then(() => {
            location.replace('https://ssotest.cofcotrading.com:8443/cas/login?service=http%3A%2F%2Fpotest.cofcotrading.com%3A8082%2Fc%2Fportal%2Flogin')
          })
          setTimeout(() => {
            location.replace('https://ssotest.cofcotrading.com:8443/cas/login?service=http%3A%2F%2Fpotest.cofcotrading.com%3A8082%2Fc%2Fportal%2Flogin')
          }, 2000)
        })
      }
      
    } else if (code === 403) {
      // router.push({ path: '/401' })
      Message.warning('注意： 您没有该权限操作，请联系相关人员授权！')
    } else if (code === 404 && error.response.data.message.indexOf('User with name') !== -1) {
      // router.push({ path: '/401' })
      Message.warning('注意： 您没有该权限操作，请联系相关人员授权！')
    } else if (code === 502) {
      router.push({path: '/netWorkError'})
      Notification.error({
        title: '网络请求错误',
        duration: 2500
      })
    } else {
      const errorMsg = error.response.data.message
      if (errorMsg !== undefined) {
        Notification.error({
          title: errorMsg,
          duration: 3000
        })
      }
    }
    return Promise.reject(error)
  }
)
export default service
