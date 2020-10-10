import request from '@/utils/request'

export function postAdd(data) {
  return request({
    url: 'cash',
    method: 'post',
    data
  })
}

export function getList(params) {
  return request({
    url: 'cash',
    method: 'get',
    params
  })
}

export function postUserAdd(data) {
  return request({
    url: 'userCash',
    method: 'post',
    data
  })
}

export function getUserList(params) {
  return request({
    url: 'userCash',
    method: 'get',
    params
  })
}
