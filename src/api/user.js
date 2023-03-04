import resource from './index'

// 登录接口
export const mobileLogin = resource('/mobile/user/login')
export const configLogin = resource('/config/login')
export const mobilelogout = resource('/mobile/user/logout')
export const sess = resource('/user/sess')
export const getSchool = resource('/user/school')
export const getInfo = resource('/user/info')
export const getPublicId = resource('/mw/public-config/school/:schoolCode')
export const getUserSchools = resource('/user/schools')
export const getSchoolList = resource('/get/school/list')
export const getWebOpenid = resource('/web/user/openid')
export const getWebUserInfo = resource('/web/user/info')
export const getUrlUpload = resource('/mfs/upload-params/get')
