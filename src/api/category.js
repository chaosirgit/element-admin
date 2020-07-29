import request from '@/utils/request'

export function postAdd(data) {
  return request({
    url: 'categories',
    method: 'post',
    data
  })
}

export function putEdit(data) {
  return request({
    url: 'categories',
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
    url: 'categories',
    method: 'delete',
    params
  })
}
