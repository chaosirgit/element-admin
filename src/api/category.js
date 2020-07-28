import request from '@/utils/request'

export function postAdd(data) {
  return request({
    url: 'seller',
    method: 'post',
    data
  })
}

export function putEdit(data) {
  return request({
    url: 'seller',
    method: 'put',
    data
  })
}

export function getList(params) {
  return request({
    url: 'categories',
    method: 'get',
    params
  })
}

export function delItem(params) {
  return request({
    url: 'seller',
    method: 'delete',
    params
  })
}
