import request from '@/utils/request'

export function login(data) {
  return request({
    url: 'login',
    method: 'post',
    data
  })
}

export function getList(params) {
  return request({
    url: 'seller/list',
    method: 'get',
    params
  })
}

export function logout() {
  return request({
    url: 'logout',
    method: 'post'
  })
}
