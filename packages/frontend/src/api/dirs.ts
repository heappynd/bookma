import request from '@/utils/request'

export function getDirs(params) {
  return request({
    url: '/api/dirs',
    params
  })
}

export function createDir(data) {
  return request({
    url: '/api/dirs',
    data,
    method: 'post'
  })
}

export function deleteDir(id) {
  return request({
    url: '/api/dirs/' + id,
    method: 'delete'
  })
}
