import request from '@/utils/request'

export function add(data) {
  return request({
    url: 'api/businessExecutionOverview',
    method: 'post',
    data
  })
}

export function del(id) {
  return request({
    url: 'api/businessExecutionOverview/del',
    method: 'post',
    data: {id}
  })
}

export function edit(data) {
  return request({
    url: 'api/businessExecutionOverview/edit',
    method: 'post',
    data
  })
}

export function downloadBusinessExecutionOverview(params) {
  return request({
    url: 'api/businessExecutionOverview/download',
    method: 'get',
    params,
    responseType: 'blob'
  })
}

export function initReportList(params) {
  return request({
    url: 'api/businessExecutionOverview/tree',
    method: 'get',
    params
  })
}
