import request from '@/utils/request'

export function login(username, password, code, uuid) {
  return request({
    url: 'auth/login',
    method: 'post',
    data: {
      username,
      password,
      code,
      uuid
    }
  })
}

export function getInfo() {
  return request({
    url: 'auth/info',
    method: 'get'
  })
}

export function getCodeImg() {
  return request({
    url: 'auth/code',
    method: 'get'
  })
}

export function logout() {
  return request({
    url: 'auth/logout',
    method: 'post'
  })
}
export function lygRz(data) {
  return request({
    url: 'auth/single',
    method: 'post',
    data
  })
}

export function onlineUser(params) {
  return request({
    url: `/auth/online/user?filter=${params}`,
    method: 'get'
  })
}

export function deleteOnline(key) {
  return request({
    url: `/auth/online/user?key=${key}`,
    method: 'post'
  })
}
