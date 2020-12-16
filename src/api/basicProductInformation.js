import request from '@/utils/request'

export function getMsg() {
  return request({
    url: 'api/basicProductInformation',
    method: 'get',
  })
}

export function add(data) {
  return request({
    url: 'api/basicProductInformation',
    method: 'post',
    data
  })
}

export function del(id) {
  return request({
    url: 'api/basicProductInformation/del',
    method: 'post',
    data: {id}
  })
}

export function edit(data) {
  return request({
    url: 'api/basicProductInformation/edit',
    method: 'post',
    data
  })
}

export function downloadBasicProductInformation(params) {
  return request({
    url: 'api/basicProductInformation/download',
    method: 'get',
    params,
    responseType: 'blob'
  })
}
