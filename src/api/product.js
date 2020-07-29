import request from '@/utils/request'

export function postAdd(data) {
  return request({
    url: 'product',
    method: 'post',
    data
  })
}

export function putEdit(data) {
  return request({
    url: 'product',
    method: 'put',
    data
  })
}

export function getList(params) {
  return request({
    url: 'product',
    method: 'get',
    params
  })
}

export function delItem(params) {
  return request({
    url: 'product',
    method: 'delete',
    params
  })
}
