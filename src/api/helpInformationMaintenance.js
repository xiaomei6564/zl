import request from '@/utils/request'

export function add(data) {
  return request({
    url: 'api/helpInformationMaintenance',
    method: 'post',
    data
  })
}

export function del(id) {
  return request({
    url: 'api/helpInformationMaintenance/del',
    data: {id},
    method: 'post'
  })
}

export function edit(data) {
  return request({
    url: 'api/helpInformationMaintenance/edit',
    method: 'post',
    data
  })
}

export function downloadHelpInformationMaintenance(params) {
  return request({
    url: 'api/helpInformationMaintenance/download',
    method: 'get',
    params,
    responseType: 'blob'
  })
}

export function helpMsg(params) {
  return request({
    url: 'api/helpInformationMaintenance',
    method: 'get',
    params
  })
}
