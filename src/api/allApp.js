import request from '@/utils/request'

export function add(data) {
  return request({
    url: 'api/allApp',
    method: 'post',
    data
  })
}

export function del(id) {
  return request({
    url: 'api/allApp/del',
    method: 'post',
    data: {id}
  })
}

export function edit(data) {
  return request({
    url: 'api/allApp/edit',
    method: 'post',
    data
  })
}

export function downloadAllApp(params) {
  return request({
    url: 'api/allApp/download',
    method: 'get',
    params,
    responseType: 'blob'
  })
}
