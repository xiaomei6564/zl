import request from '@/utils/request'

export function get() {
  return request({
    url: 'api/qiNiuContent/config',
    method: 'get'
  })
}

export function update(data) {
  return request({
    url: 'api/qiNiuContent/config',
    data,
    method: 'post'
  })
}

export function del(id) {
  return request({
    url: 'api/qiNiuContent/del',
    method: 'post',
    data: {id}
  })
}

export function download(id) {
  return request({
    url: 'api/qiNiuContent/download/' + id,
    method: 'get'
  })
}

export function sync() {
  return request({
    url: 'api/qiNiuContent/synchronize',
    method: 'post'
  })
}

export function delAll(ids) {
  return request({
    url: 'api/qiNiuContent/',
    method: 'delete',
    data: ids
  })
}

export function downloadQiNiu(params) {
  return request({
    url: 'api/qiNiuContent/download/list',
    method: 'get',
    params,
    responseType: 'blob'
  })
}
