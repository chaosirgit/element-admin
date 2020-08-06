import request from '@/utils/request'

export function postAdd(data) {
  return request({
    url: 'role',
    method: 'post',
    data
  })
}

export function putEdit(data) {
  return request({
    url: 'role',
    method: 'put',
    data
  })
}

export function getList(params) {
  return request({
    url: 'role/list',
    method: 'get',
    params
  })
}

export function getAll(params) {
  return request({
    url: 'role/list/noPage',
    method: 'get',
    params
  })
}

export function delItem(params) {
  return request({
    url: 'role',
    method: 'delete',
    params
  })
}

export function scopeList(params) {
  return request({
    url: 'scopes/list',
    method: 'get',
    params
  })
}

export function grantScope(params) {
  return request({
    url: 'role/scopes',
    method: 'post',
    params
  })
}
