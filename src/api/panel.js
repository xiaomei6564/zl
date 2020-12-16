import request from '@/utils/request'

// 获取磁贴展示数据（磁贴与数据接口一对一）
export function getPanelData(postUrl) {
  return request({
    url: postUrl,
    method: 'get'
  })
}
//获取磁贴所有列表
export function getPanelAllList() {
  return request({
    url: '/api/allApp/magnet',
    method: 'get'
  })
}
//获取个人首页磁贴
export function getPanelListByUser(params) {
  return request({
    url: '/api/myHomeApp/magnet',
    method: 'get',
    params
  })
}
