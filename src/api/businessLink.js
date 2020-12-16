import request from '@/utils/request'

export function add(data) {
  return request({
    url: 'api/businessLink',
    method: 'post',
    data
  })
}

export function del(id) {
  return request({
    url: 'api/businessLink/del',
    method: 'post',
    data: {id}
  })
}

export function edit(data) {
  return request({
    url: 'api/businessLink/edit',
    method: 'post',
    data
  })
}

export function downloadBusinessLink(params) {
  return request({
    url: 'api/businessLink/download',
    method: 'get',
    params,
    responseType: 'blob'
  })
}
export function initReportList(params) {
  return request({
    url: '/api/businessLink/tree',
    method: 'get',
    params
    // responseType: 'blob'
  })
}
