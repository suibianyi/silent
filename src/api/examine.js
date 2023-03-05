import request from '@/mUtils/request'

// 获取审核列表
export function getExamineList(data) {
  return request({
    url: '/person/teacher/getStudentParentList',
    method: 'post',
    data
  })
}

// 审核通过
export function updExamineList(data) {
  return request({
    url: '/person/teacher/approvalStudentParentStatus',
    method: 'post',
    data
  })
}
