import request from '@/utils/request'

export function add(data) {
  return request({
    url: 'api/jumpParameters',
    method: 'post',
    data
  })
}

export function list(params) {
  return request({
    url: 'api/jumpParameters/one',
    method: 'get',
    params
  })
}

export function del(data) {
  return request({
    url: 'api/jumpParameters/del',
    method: 'post',
    data: JSON.stringify(data)
  })
}

export function edit(data) {
  return request({
    url: 'api/jumpParameters/edit',
    method: 'post',
    data
  })
}

export function downloadJumpParameters(params) {
  return request({
    url: 'api/jumpParameters/download',
    method: 'get',
    params,
    responseType: 'blob'
  })
}
