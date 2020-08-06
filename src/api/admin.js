import request from '@/utils/request'

export function login(data) {
  return request({
    url: 'login',
    method: 'post',
    data
  })
}

export function getInfo() {
  return request({
    url: 'info',
    method: 'get'
    // params: { token }
  })
}

export function logout() {
  return request({
    url: 'logout',
    method: 'post'
  })
}

export function getList(params) {
  return request({
    url: 'admin/list',
    method: 'get',
    params
  })
}

export function postAdd(data) {
  return request({
    url: 'admin',
    method: 'post',
    data
  })
}

export function putEdit(data) {
  return request({
    url: 'admin',
    method: 'put',
    data
  })
}

export function getScopes() {
  return request({
    url: 'scopes',
    method: 'get'
  })
}
