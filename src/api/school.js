import request from '@/mUtils/request'

export function getGradeList(data) {
  return request({
    url: '/mbs/org/getOrgGradeTreeList',
    method: 'get',
    params: data
  })
}
// 获取班级列表
export function getClazzList(data) {
  return request({
    url: '/mbs/org/getOrgClassList',
    method: 'post',
    data
  })
}
// 获取验证码
export function getTelCode(data) {
  return request({
    url: '/user/register/sms',
    method: 'post',
    data
  })
}
// 获取学生列表
export function getStudentList(data) {
  return request({
    url: '/mbs/person/getPersonStudentList',
    method: 'post',
    data
  })
}
// 家长注册接口
export function parentRegister(data) {
  return request({
    url: '/user/register',
    method: 'post',
    data
  })
}

export function parentInfo(data) {
  return request({
    url: '/person/login/verifyParentInfo',
    method: 'post',
    data
  })
}
