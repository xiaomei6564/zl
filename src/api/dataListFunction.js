import request from '@/utils/request'

export function add(data) {
  return request({
    url: 'api/dataListFunction',
    method: 'post',
    data
  })
}

export function del(id) {
  return request({
    url: 'api/dataListFunction/del',
    method: 'post',
    data: {id}
  })
}

export function edit(data) {
  return request({
    url: 'api/dataListFunction/edit',
    method: 'post',
    data
  })
}

export function downloadDataListFunction(params) {
  return request({
    url: 'api/dataListFunction/download',
    method: 'get',
    params,
    responseType: 'blob'
  })
}

export function list(params) {
  return request({
    url: 'api/dataListFunction',
    method: 'get',
    params
  })
}