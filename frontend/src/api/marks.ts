import request from '@/utils/request'

export function getMarks(params) {
  return request({
    url: '/api/marks',
    params
  })
}

export function createMark(data) {
  return request({
    url: '/api/marks',
    data,
    method: 'post'
  })
}

export function deleteMark(id) {
  return request({
    url: '/api/marks/' + id,
    method: 'delete'
  })
}
