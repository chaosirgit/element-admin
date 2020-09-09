import request from '@/utils/request'

export function postAdd(data) {
  return request({
    url: 'coupon',
    method: 'post',
    data
  })
}

export function putEdit(data) {
  return request({
    url: 'coupon',
    method: 'put',
    data
  })
}

export function getList(params) {
  return request({
    url: 'coupon',
    method: 'get',
    params
  })
}

export function getAll(params) {
  return request({
    url: 'coupon/all',
    method: 'get',
    params
  })
}

export function couponRelation(params) {
  return request({
    url: 'coupon/relation',
    method: 'put',
    params
  })
}

export function delItem(params) {
  return request({
    url: 'coupon',
    method: 'delete',
    params
  })
}

export function openCheck(params) {
  return request({
    url: 'coupon/open',
    method: 'put',
    params
  })
}
