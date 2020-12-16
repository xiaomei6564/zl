import request from '@/utils/request'

export function getList(data) {
  return request({
    url: 'warehouse',
    method: 'post',
    data
  })
}