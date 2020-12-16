import request from '@/utils/request'

export function getList(params) {
  return request({
    url: 'api/materialGroup',
    method: 'get',
    params
  })
}

export function getListTree(params) {
  return request({
    url: 'api/materialGroup/tree',
    method: 'get',
    params
  })
}

export function add(data) {
  return request({
    url: 'api/materialGroup',
    method: 'post',
    data
  })
}

export function del(id) {
  return request({
    url: 'api/materialGroup/del',
    method: 'post',
    data: {id}
  })
}

export function edit(data) { 
  return request({
    url: 'api/materialGroup/edit',
    method: 'post',
    data
  })
}

export function downloadDept(params) {
  return request({
    url: 'api/materialGroup/download',
    method: 'get',
    params,
    responseType: 'blob'
  })
}