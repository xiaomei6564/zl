import request from '@/utils/request'

export function get(dictName) {
  const params = {
    dictName,
    page: 0,
    size: 9999
  }
  return request({
    url: 'api/dictDetail',
    method: 'get',
    params
  })
}

export function getDictMap(dictName) {
  const params = {
    dictName,
    page: 0,
    size: 9999
  }
  return request({
    url: 'api/dictDetail/map',
    method: 'get',
    params
  })
}

export function add(data) {
  return request({
    url: 'api/dictDetail',
    method: 'post',
    data
  })
}

export function del(id) {
  return request({
    url: 'api/dictDetail/del',
    method: 'post',
    data: {id}
  })
}

export function edit(data) {
  return request({
    url: 'api/dictDetail/edit',
    method: 'post',
    data
  })
}

export function enumerated(enumerated) {
  const params = {
    enumerated,
  }
  return request({
    url: 'enumerated',
    method: 'get',
    params
  })
}