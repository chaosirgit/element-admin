import request from '@/utils/request'

export function postAdd(data) {
  return request({
    url: 'plan',
    method: 'post',
    data
  })
}

export function putEdit(data) {
  return request({
    url: 'plan',
    method: 'put',
    data
  })
}

export function getList(params) {
  return request({
    url: 'plan',
    method: 'get',
    params
  })
}

export function getAll(params) {
  return request({
    url: 'plan/all',
    method: 'get',
    params
  })
}

export function planRelation(params) {
  return request({
    url: 'plan/relation',
    method: 'put',
    params
  })
}

export function delItem(params) {
  return request({
    url: 'plan',
    method: 'delete',
    params
  })
}

export function openCheck(params) {
  return request({
    url: 'plan/open',
    method: 'put',
    params
  })
}
