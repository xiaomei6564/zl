import request from '@/utils/request'

export function list(data) {
  return request({
    url: `viewcode`,
    method: 'post',
    data
  })
}

export function whetherConfiguration(params) {
  return request({
    url: 'api/whetherConfiguration',
    method: 'get',
    params
  })
}

