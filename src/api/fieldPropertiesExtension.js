import request from '@/utils/request'

export function add(data) {
  return request({
    url: 'api/fieldPropertiesExtension',
    method: 'post',
    data
  })
}

export function list(params) {
  return request({
    url: 'api/fieldPropertiesExtension/one',
    method: 'get',
    params
  })
}

export function del(techcode) {
  return request({
    url: 'api/fieldPropertiesExtension/del',
    method: 'post',
    data: {techcode}
  })
}

export function edit(data) {
  return request({
    url: 'api/fieldPropertiesExtension/edit',
    method: 'post',
    data
  })
}

export function downloadFieldPropertiesExtension(params) {
  return request({
    url: 'api/fieldPropertiesExtension/download',
    method: 'get',
    params,
    responseType: 'blob'
  })
}
