import request from '@/utils/request'

export function getList(params) {
  return request({
    url: 'api/executeObject',
    method: 'get',
    params
  })
}

export function add(data) {
  return request({
    url: 'api/executeObject',
    method: 'post',
    data
  })
}

export function del(id) {
  return request({
    url: 'api/executeObject/del',
    method: 'post',
    data: {id}
  })
}

export function edit(data) {
  return request({
    url: 'api/executeObject/edit',
    method: 'post',
    data
  })
}

export function downloadExecuteObject(params) {
  return request({
    url: 'api/executeObject/download',
    method: 'get',
    params,
    responseType: 'blob'
  })
}
