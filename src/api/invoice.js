import request from '@/utils/request'

export function getList(params) {
  return request({
    url: 'invoice',
    method: 'get',
    params
  })
}

export function postAdd(data) {
  return request({
    url: 'invoice',
    method: 'post',
    data
  })
}
