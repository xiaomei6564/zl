import request from '@/utils/request'

export function del(ids) {
  return request({
    url: 'api/pictures/del',
    method: 'post',
    data: {ids}
  })
}

export function delAll(ids) {
  return request({
    url: 'api/pictures/del',
    method: 'post',
    data: {ids}
  })
}

export function downloadPicture(params) {
  return request({
    url: 'api/pictures/download',
    method: 'get',
    params,
    responseType: 'blob'
  })
}
