import request from '@/utils/request'

export function postAdd(data) {
  return request({
    url: 'setting',
    method: 'post',
    data
  })
}

export function getSetting(params) {
  return request({
    url: 'setting',
    method: 'get',
    params
  })
}

