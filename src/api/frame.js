import request from '@/mUtils/request'

// 获取模板列表
export function getFrameList(params) {
  return request({
    url: '/query/fram',
    method: 'get',
    params
  })
}

// 创建模板
export function createFrameList(data) {
  return request({
    url: '/create/fram',
    method: 'post',
    data
  })
}

// 删除模板
export function delFrameList(data) {
  return request({
    url: '/delete/fram',
    method: 'post',
    data
  })
}

// 更新模板
export function updateFrameList(data) {
  return request({
    url: '/update/fram',
    method: 'post',
    data
  })
}
