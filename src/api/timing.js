import request from '@/utils/request'

export function add(data) {
  return request({
    url: 'api/jobs',
    method: 'post',
    data
  })
}

export function del(id) {
  return request({
    url: 'api/jobs/del',
    method: 'post',
    data: {id}
  })
}

export function edit(data) {
  return request({
    url: 'api/jobs/edit',
    method: 'post',
    data
  })
}

export function updateIsPause(id) {
  return request({
    url: 'api/jobs/' + id,
    method: 'post'
  })
}

export function execution(id) {
  return request({
    url: 'api/jobs/exec/' + id,
    method: 'post'
  })
}

export function downloadJobs(params) {
  return request({
    url: 'api/jobs/download',
    method: 'get',
    params,
    responseType: 'blob'
  })
}

export function downloadLogs(params) {
  return request({
    url: 'api/jobs/download/log',
    method: 'get',
    params,
    responseType: 'blob'
  })
}
