import request from '@/mUtils/request'

export function mRequest(data) {
  if (data) {
    if (data.method === 'get') {
      return request({
        url: data.url,
        method: data.method,
        params: data.data
      })
    } else if (data.method === 'post') {
      return request({
        url: data.url,
        method: data.method,
        data: data.data
      })
    } else if (data.method === 'delete') {
      return request({
        url: data.url,
        method: data.method,
        params: data.data
      })
    }
  }
  return ''
}

