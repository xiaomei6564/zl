import request from '@/utils/request'

export function add(data) {
  return request({
    url: 'api/realTimeDataList',
    method: 'post',
    data
  })
}

export function del(id) {
  return request({
    url: 'api/realTimeDataList/del',
    data: {id},
    method: 'post'
  })
}

export function edit(data) {
  return request({
    url: 'api/realTimeDataList/edit',
    method: 'post',
    data
  })
}

export function downloadRealTimeDataList(params) {
  return request({
    url: 'api/realTimeDataList/download',
    method: 'get',
    params,
    responseType: 'blob'
  })
}

export function initReportList(params) {
  return request({
    url: 'api/realTimeDataList/tree',
    method: 'get',
    params
  })
}