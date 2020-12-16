import request from '@/utils/request'

export function add(data) {
  return request({
    url: 'api/myApp',
    method: 'post',
    data
  })
}

export function del(id) {
  return request({
    url: 'api/myApp/del',
    method: 'post',
    data: {id}
  })
}

export function edit(data) {
  return request({
    url: 'api/myApp/edit',
    method: 'post',
    data
  })
}

export function downloadMyApp(params) {
  return request({
    url: 'api/myApp/download',
    method: 'get',
    params,
    responseType: 'blob'
  })
}
