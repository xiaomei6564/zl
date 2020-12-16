import request from '@/utils/request'

export function add(data) {
  return request({
    url: 'api/systemUpdateLog',
    method: 'post',
    data
  })
}

export function del(id) {
  return request({
    url: 'api/systemUpdateLog/del',
    method: 'post',
    data: {id}
  })
}

export function edit(data) {
  return request({
    url: 'api/systemUpdateLog/edit',
    method: 'post',
    data
  })
}

export function downloadSystemUpdateLog(params) {
  return request({
    url: 'api/systemUpdateLog/download',
    method: 'get',
    params,
    responseType: 'blob'
  })
}
