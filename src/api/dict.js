import request from '@/utils/request'

export function add(data) {
  return request({
    url: 'api/dict',
    method: 'post',
    data
  })
}

export function del(id) {
  return request({
    url: 'api/dict/del',
    method: 'post',
    data: {id}
  })
}

export function edit(data) {
  return request({
    url: 'api/dict/edit',
    method: 'post',
    data
  })
}

export function downloadDict(params) {
  return request({
    url: 'api/dict/download',
    method: 'get',
    params,
    responseType: 'blob'
  })
}
