import request from '@/utils/request'

//业务单位下拉
export function getBusinessUnits(params) {
  return request({
    url: 'onlineInquiry/businessUnits',
    method: 'get',
    params
  })
  
}
// 采购方式
export function getPurchaseWay(params) {
  return request({
    url: 'onlineInquiry/purchaseWay',
    method: 'get',
    params
  })
}
//采购模式
export function getBusinessModel(params) {
  return request({
    url: 'onlineInquiry/businessModel',
    method: 'get'
  })
}

//实时库存
export function getPurchaseContract(data) {
  return request({
    url: '/onlineInquiry/contract',
    method: 'post',
    data
  })
}

//采购合同清单
export function getTimePointData(data) {
  return request({
    url: '/timePointData/contract',
    method: 'post',
    data
  })
}
//可研报告全貌清单
export function getBusinessExecution(data) {
  return request({
    url: '/businessExecution/contract',
    method: 'post',
    data
  })
}


//业务环节头部
export function viewcode(params) {
  return request({
    url: `/viewcode/${params}`,
    method: 'get',
  })
}

//时点数据头部
export function timeviewcode(params) {
  return request({
    url: `/viewcode/timePointData/${params}`,
    method: 'get',
  })
}

//业务执行全貌
export function fullviewcode(params) {
  return request({
    url: `/viewcode/businessExecution/${params}`,
    method: 'get',
  })
}

//导出
export function downloadPurchase(data) {
  return request({
    url: '/onlineInquiry/contract/download',
    method: 'post',
    data,
    responseType: 'blob'
  })
}

//导出
export function downloadBusiness(data) {
  return request({
    url: '/businessExecution/contract/download',
    method: 'post',
    data,
    responseType: 'blob'
  })
}

//导出
export function downloadtimePoint(data) {
  return request({
    url: '/timePointData/contract/download',
    method: 'post',
    data,
    responseType: 'blob'
  })
}

 
export function merge(params) {
  return request({
    url: `configuration/merge`,
    method: 'get',
    params
  })
}