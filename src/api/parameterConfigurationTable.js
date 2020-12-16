import request from '@/utils/request'

export function add(data) {
  return request({
    url: 'api/parameterConfigurationTable',
    method: 'post',
    data
  })
}

export function del(id) {
  return request({
    url: 'api/parameterConfigurationTable/del',
    data: {id},
    method: 'post'
  })
}

export function edit(data) {
  return request({
    url: 'api/parameterConfigurationTable/edit',
    method: 'post',
    data
  })
}

export function downloadParameterConfigurationTable(params) {
  return request({
    url: 'api/parameterConfigurationTable/download',
    method: 'get',
    params,
    responseType: 'blob'
  })
}

export function update(data) {
  return request({
    url: 'api/parameterConfigurationTable/parameter',
    method: 'post',
    data
  })
}