import request from '@/utils/request'

export function list(params) {
  return request({
    url: 'api/dataSourceDefine',
    method: 'get',
    params
  })
}

export function add(data) {
  return request({
    url: 'api/dataSourceDefine',
    method: 'post',
    data
  })
}

export function del(id) {
  return request({
    url: 'api/dataSourceDefine/del',
    method: 'post',
    data: {id}
  })
}

export function edit(data) {
  return request({
    url: 'api/dataSourceDefine/edit',
    method: 'post',
    data
  })
}

export function downloadDataSourceDefine(params) {
  return request({
    url: 'api/dataSourceDefine/download',
    method: 'get',
    params,
    responseType: 'blob'
  })
}



