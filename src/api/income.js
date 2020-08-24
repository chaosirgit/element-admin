import request from '@/utils/request'

export function postAdd(data) {
  return request({
    url: 'income',
    method: 'post',
    data
  })
}

export function putEdit(data) {
  return request({
    url: 'income',
    method: 'put',
    data
  })
}

export function getList(params) {
  return request({
    url: 'income',
    method: 'get',
    params
  })
}

export function postSettle(data) {
  return request({
    url: 'income/settle',
    method: 'post',
    data
  })
}

export function delItem(params) {
  return request({
    url: 'income',
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
