import request from '@/utils/request'

export function submitData(params) {
  return request({
    url: '/api/myHomeApp/replaceMagnet',
    method: 'post',
    headers:{
      'Content-type': 'application/x-www-form-urlencoded'
    },
    params
  })
}

