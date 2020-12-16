import request from '@/utils/request'

// 获取所有的Role
export function getAll() {
  return request({
    url: 'api/roles/all',
    method: 'get'
  })
}

export function add(data) {
  return request({
    url: 'api/roles',
    method: 'post',
    data
  })
}

export function get(id) {
  return request({
    url: 'api/roles/' + id,
    method: 'get'
  })
}

export function getLevel() {
  return request({
    url: 'api/roles/level',
    method: 'get'
  })
}

export function del(id) {
  return request({
    url: 'api/roles/del',
    method: 'post',
    data: {id}
  })
}

export function edit(data) {
  return request({
    url: 'api/roles/edit',
    method: 'post',
    data
  })
}

export function editPermission(data) {
  return request({
    url: 'api/roles/permission',
    method: 'post',
    data
  })
}

export function editMenu(data) {
  return request({
    url: 'api/roles/menu',
    method: 'post',
    data
  })
}

export function downloadRole(params) {
  return request({
    url: 'api/roles/download',
    method: 'get',
    params,
    responseType: 'blob'
  })
}
