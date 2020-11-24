import request from '@/utils/request'

export function postAdd(data) {
  return request({
    url: 'order',
    method: 'post',
    data
  })
}

export function putEdit(data) {
  return request({
    url: 'order',
    method: 'put',
    data
  })
}

export function getList(params) {
  return request({
    url: 'order',
    method: 'get',
    params
  })
}

export function delItem(params) {
  return request({
    url: 'order',
    method: 'delete',
    params
  })
}

export function upCheck(params) {
  return request({
    url: 'order/up',
    method: 'put',
    params
  })
}

export function getAll(params) {
  return request({
    url: 'order/all',
    method: 'get',
    params
  })
}

export function getTicketCount(data) {
  return request({
    url: 'getTicketCount',
    method: 'post',
    data
  })
}

export function generateOrder(data) {
  return request({
    url: 'generateOrder',
    method: 'post',
    data
  })
}
