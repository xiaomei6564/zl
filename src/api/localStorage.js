import request from '@/utils/request'

export function add(data) {
  return request({
    url: 'api/localStorage',
    method: 'post',
    data
  })
}

export function del(ids) {
  return request({
    url: 'api/localStorage/del',
    method: 'post',
    data: {ids}
  })
}

export function delAll(ids) {
  return request({
    url: 'api/localStorage/del',
    method: 'post',
    data: {ids}
  })
}

export function edit(data) {
  return request({
    url: 'api/localStorage/edit',
    method: 'post',
    data
  })
}

export function downloadStorage(params) {
  return request({
    url: 'api/localStorage/download',
    method: 'get',
    params,
    responseType: 'blob'
  })
}
