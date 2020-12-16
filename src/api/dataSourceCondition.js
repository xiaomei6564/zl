import request from '@/utils/request'

export function initData(params) {
  return request({
    url: `api/dataSourceCondition/one`,
    params,
    method: 'get'
  })
}

export function add(data) {
  return request({
    url: 'api/dataSourceCondition',
    method: 'post',
    data
  })
}

export function del(data) {
  return request({
    url: `api/dataSourceCondition/del`,
    method: 'post',
    data: JSON.stringify(data)
  })
}

export function edit(data) {
  return request({
    url: 'api/dataSourceCondition/edit',
    method: 'post',
    data
  })
}

export function downloadDataSourceCondition(params) {
  return request({
    url: 'api/dataSourceCondition/download',
    method: 'get',
    params,
    responseType: 'blob'
  })
}
