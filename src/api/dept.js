import request from '@/utils/request'

export function getDepts(params) {
  return request({
    url: 'api/dept',
    method: 'get',
    params
  })
}

export function add(data) {
  return request({
    url: 'api/dept',
    method: 'post',
    data
  })
}

export function del(id) {
  return request({
    url: 'api/dept/del',
    method: 'post',
    data: {id}
  })
}

export function edit(data) { 
  return request({
    url: 'api/dept/edit',
    method: 'post',
    data
  })
}

export function downloadDept(params) {
  return request({
    url: 'api/dept/download',
    method: 'get',
    params,
    responseType: 'blob'
  })
}

export function initCollectList(params) {
  return request({
    url: '/api/myFormDirectory/tree',
    method: 'get',
    params
    // responseType: 'blob'
  })
}

export function getCollectDirectory(params) {//获取用户收藏目录
  return request({
    url: '/api/myFormDirectory',
    method: 'get',
    params
  })
}
export function addCollectDirectory(data) {//添加用户收藏目录
  return request({
    url: '/api/myFormDirectory',
    method: 'post',
    data
  })
}
export function delCollectDirectory(data) {//删除用户收藏目录
  return request({
    url: '/api/myFormDirectory/del',
    method: 'post',
    data
  })
}

export function addCollectForm(data) {//添加用户收藏表单
  return request({
    url: '/api/favoritesForm',
    method: 'post',
    data
    // responseType: 'blob'
  })
}

export function delCollectForm(id) {//删除用户收藏表单
  return request({
    url: '/api/favoritesForm/del',
    method: 'post',
    data: {id}
  })
}

export function editCollectForm(data) { //修改用户收藏表单
  return request({
    url: '/api/favoritesForm/edit',
    method: 'post',
    data
  })
} 

export function initReportList() {
  return request({
    url: '/api/businessLink/tree',
    method: 'get'
    // responseType: 'blob'
  })
}
