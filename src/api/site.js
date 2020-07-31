import request from '@/utils/request'

export function postAdd(data) {
  return request({
    url: 'site',
    method: 'post',
    data
  })
}

export function putEdit(data) {
  return request({
    url: 'site',
    method: 'put',
    data
  })
}

export function getList(params) {
  return request({
    url: 'site',
    method: 'get',
    params
  })
}

export function delItem(params) {
  return request({
    url: 'site',
    method: 'delete',
    params
  })
}
