import request from '@/utils/request'

export function list() {
  return request({
    url: 'api/componentInformation',
    method: 'get',
  })
}

export function add(data) {
  return request({
    url: 'api/componentInformation',
    method: 'post',
    data
  })
}

export function del(id) {
  return request({
    url: 'api/componentInformation/del',
    method: 'post',
    data: {id}
  })
}

export function edit(data) {
  return request({
    url: 'api/componentInformation/edit',
    method: 'post',
    data
  })
}

export function downloadComponentInformation(params) {
  return request({
    url: 'api/componentInformation/download',
    method: 'get',
    params,
    responseType: 'blob'
  })
}
