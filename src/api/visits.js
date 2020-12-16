import request from '@/utils/request'

export function count() {
  return request({
    url: 'api/visits',
    method: 'post'
  })
}

export function get() {
  return request({
    url: 'api/visits',
    method: 'get'
  })
}

export function getChartData() {
  return request({
    url: '/homepage/salesContractQuantityChangeTrendChart',
    method: 'get'
  })
}

export function setChartData(data) {
  return request({
    url: '/api/myHomeApp/replaceMagnet',
    method: 'post',
    data
  })
}
