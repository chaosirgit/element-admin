import request from '@/utils/request'

export function getList(params) {
  return request({
    url: 'user',
    method: 'get',
    params
  })
}

export function postAdd(data) {
  return request({
    url: 'user',
    method: 'post',
    data
  })
}

export function putEdit(data) {
  return request({
    url: 'user',
    method: 'put',
    data
  })
}

