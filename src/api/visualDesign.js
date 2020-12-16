import request from '@/utils/request'

export function findReportPageList(data) {// all
  return request({
    url: 'api/reportCustomize/findReportPageList',
    method: 'post',
    data
  })
}

export function packageDataSourceTree(data) { //!all
  return request({
    url: 'api/reportCustomize/packageDataSourceTree',
    method: 'post',
    data
  })
}

export function fieldList(data) { // 字段列表
  return request({
    url: 'api/reportCustomize/field/list',
    method: 'post',
    data
  })
}

export function fieldDetail(data) { // 字段详情
  return request({
    url: 'api/reportCustomize/field/detail',
    method: 'post',
    data
  })
}

export function reportCustomizeAdd(data) { // 另存为
  return request({
    url: 'api/reportCustomize/add',
    method: 'post',
    data
  })
}

export function reportDataList(data) { // 表格数据
  return request({
    url: 'api/reportCustomize/reportDataList',
    method: 'post',
    data
  })
}
