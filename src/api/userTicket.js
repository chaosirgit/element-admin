import request from '@/utils/request'

export function postAdd(data) {
  return request({
    url: 'accountLog',
    method: 'post',
    data
  })
}

export function putEdit(data) {
  return request({
    url: 'accountLog',
    method: 'put',
    data
  })
}

export function getList(params) {
  return request({
    url: 'userTicket',
    method: 'get',
    params
  })
}

export function delItem(params) {
  return request({
    url: 'accountLog',
    method: 'delete',
    params
  })
}

export function upCheck(params) {
  return request({
    url: 'accountLog/up',
    method: 'put',
    params
  })
}

export function getAll(params) {
  return request({
    url: 'accountLog/all',
    method: 'get',
    params
  })
}
