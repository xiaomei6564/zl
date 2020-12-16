import request from '@/utils/request'

export function add(data) {
  return request({
    url: 'api/myHomeApp',
    method: 'post',
    data
  })
}

export function del(id) {
  return request({
    url: 'api/myHomeApp/del',
    method: 'post',
    data: {id}
  })
}

export function edit(data) {
  return request({
    url: 'api/myHomeApp/edit',
    method: 'post',
    data
  })
}

export function downloadMyHomeApp(params) {
  return request({
    url: 'api/myHomeApp/download',
    method: 'get',
    params,
    responseType: 'blob'
  })
}
