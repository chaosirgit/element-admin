import request from '@/utils/request'

export function postAdd(data) {
  return request({
    url: 'ticket',
    method: 'post',
    data
  })
}

export function putEdit(data) {
  return request({
    url: 'ticket',
    method: 'put',
    data
  })
}

export function getList(params) {
  return request({
    url: 'ticket',
    method: 'get',
    params
  })
}

export function getAll(params) {
  return request({
    url: 'ticket/all',
    method: 'get',
    params
  })
}

export function ticketRelation(params) {
  return request({
    url: 'ticket/relation',
    method: 'put',
    params
  })
}

export function delItem(params) {
  return request({
    url: 'ticket',
    method: 'delete',
    params
  })
}

export function openCheck(params) {
  return request({
    url: 'ticket/open',
    method: 'put',
    params
  })
}
