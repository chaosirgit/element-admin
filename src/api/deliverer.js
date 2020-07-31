import request from '@/utils/request'

export function putMove(data) {
  return request({
    url: 'deliverer/move',
    method: 'put',
    data
  })
}

export function getList(params) {
  return request({
    url: 'deliverer',
    method: 'get',
    params
  })
}

export function getAll(params) {
  return request({
    url: 'deliverer/all',
    method: 'get',
    params
  })
}
