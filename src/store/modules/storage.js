import Vue from 'vue'
import { JSEncrypt } from 'jsencrypt'
import encBase64 from 'crypto-js/enc-base64'
import encUtf8 from 'crypto-js/enc-utf8'
// import { getInfo, getSchool } from '@/api/MPS/user'
import { urlencode } from '@/utils'
import { getToken, setToken, removeToken } from '@/utils/auth'
import {
  mobileLogin,
  configLogin,
  mobilelogout,
  sess,
  getSchool,
  getInfo,
  getPublicId,
  getUserSchools,
  getSchoolList,
  getWebOpenid,
  getWebUserInfo } from '@/api/user'
import {
  getFrameList
} from '@/api/frame'
import {
  mRequest
} from '@/api/request'
import {
  formatReference
} from '@/mUtils'
// 用做缓存
import setting from './settings'

const storage = {
  state: {
    schoolList: [],
    webAuth: {},
    loginForm: {},
    user: {},
    userSchools: [], // 用户学校列表
    schoolCode: '',
    userInfo: {},
    children: [],
    userChild: {},
    parentFn: '',
    pk: '',
    id: '',
    account: '',
    name: '',
    auths: '',
    type: -1, // 用户类型 -1-root 0-student 1-teacher 2-parent
    reference: {},
    pageStore: {},
    token: getToken()
  },
  mutations: {
    ADD_PAGE_STORE: (state, data) => {
      console.log('addpageStore', data)
      Vue.set(state.pageStore, data.pageStoreName, data.pageStoreData)
      // const objKey = Object.keys(state.pageStore)
      // if (objKey.length > 10) {
      //   // 这里要删除一些
      // }
      console.log('nowpageStore', state.pageStore)
    },
    SET_REFERENCE: (state, data) => {
      console.log('开始重置reference', data)
      state.reference = data
    },
    SET_USER: (state, data) => {
      state.user = data
    },
    SET_LOGINFORM: (state, data) => {
      state.loginForm = data
    },
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_PK: (state, pk) => {
      state.pk = pk
    },
    SET_ID: (state, id) => {
      state.id = id
    },
    SET_ACCOUNT: (state, account) => {
      state.account = account
    },
    SET_NAME: (state, name) => {
      state.name = name
    },
    SET_TYPE: (state, type) => {
      if (type || type === 0) {
        state.type = +type
      } else {
        state.type = -1
      }
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_SCHOOL: (state, data) => {
      state.school.id = data.schoolId
      state.school.name = data.name
      state.school.code = data.id
      state.school.type = data.school_type
    },
    SET_AUTHS: (state, auths) => {
      state.auths = auths
    },
    // 是否默认密码
    SET_MODIFY: (state, pwd_initialized) => {
      state.pwd_initialized = pwd_initialized
    },
    // 是否弱密码
    SET_WEAK: (state, pwd_weak) => {
      state.pwd_weak = pwd_weak
    },
    SET_USERSCHOOLS: (state, data) => {
      state.userSchools = data
    },
    SET_USERSCHOOL: (state, data) => {
      state.schoolCode = data
      window.localStorage.setItem('schoolCode', data)
      console.log('schoolCode', window.localStorage.getItem('schoolCode'))
    },
    SET_SCHOOLLIST: (state, data) => {
      state.schoolList = data
    },
    SET_WEBAUTH: (state, data) => {
      state.webAuth = data
    },
    SET_USERINFO: (state, data) => {
      state.userInfo = data
    },
    SET_CHILDREN: (state, data) => {
      state.children = data
    },
    SET_USERCHILD: (state, data) => {
      state.userChild = data
      if (data.parentTitle) {
        state.parentFn = `${data.trueName}的${data.parentTitle}`
      } else {
        state.parentFn = `${data.trueName}的家长`
      }
    }
  },
  actions: {
    // 新增页面缓存值
    addPageStore: ({ commit }, data) => {
      commit('ADD_PAGE_STORE', data)
    },
    // 获取校区信息
    async school({ commit }) {
      const { data } = await getSchool.get()
      console.log('获取学校信息')
      commit('SET_SCHOOL', data)
    },
    // 查询学校列表
    getSchoolList: async({ commit }, searchData) => {
      const {
        schoolType,
        searchName,
        status
      } = searchData
      console.log('获取学校列表')
      const { data } = await getSchoolList.get({
        schoolType,
        searchName,
        status
      })
      if (data) {
        commit('SET_SCHOOLLIST', data)
      }
    },
    // 获取openid
    getWebAuth: async({ commit, state }, code) => {
      const { data } = await getWebOpenid.get({
        code,
        school: state.schoolCode
      })
      // 获取用户信息
      await getWebUserInfo.get({
        webAccessToken: data.access_token,
        openid: data.openid
      })
      if (data) {
        commit('SET_WEBAUTH', data)
      }
    },
    // 获取用户学校列表
    getUserSchools: async({ commit, state }, userInfo) => {
      state.schoolCode = ''
      state.schoolCode = ''
      console.log('获取学校列表')
      const { data } = await getUserSchools.get({
        type: userInfo.type,
        account: userInfo.account
      })
      if (data) {
        if (data.length && data.length === 1) {
          commit('SET_USERSCHOOL', data[0].id)
        }
        commit('SET_USERSCHOOLS', data)
      }
    },
    configLogin: async({ commit, state, dispatch }, userInfo) => {
      const { account, password } = userInfo
      const jsencrypt = new JSEncrypt()
      jsencrypt.setPublicKey(state.pk)
      const encrypted = jsencrypt.encrypt(password)
      const { data } = await configLogin.post({
        account,
        password: encrypted
      })
      console.log('login data', data)
      setToken(data.token)
      state.loginForm = {}
      commit('SET_TOKEN', data.token)
      await dispatch('getInfo')
    },
    getAndSetFrame: async({ commit, state, dispatch }) => {
      console.log('我去取模板的参数是', state.schoolCode)
      let role = 'root'
      switch (state.type) {
        case -1:
          role = 'teacher' // 这里故意把root改成老师，取老师模板
          break
        case 0:
          role = 'student'
          break
        case 1:
          role = 'teacher'
          break
        case 2:
          role = 'parent'
          break
      }
      let frameList = []
      if (setting.state.mode === 'editor') {
        frameList = (await getFrameList({ role, schoolCode: state.schoolCode, _id: setting.state.frameId })).data
      } else {
        frameList = (await getFrameList({ role, schoolCode: state.schoolCode, inUse: true })).data
      }
      console.log('我从数据库取到的模板是', frameList)
      if (frameList.length === 1) {
        dispatch('setPagelist', { pageList: frameList[0].fram, page: '' })
      }
    },
    mobileLogin: async({ commit, state, dispatch }, userInfo) => {
      const { account, password, type, school } = userInfo
      const jsencrypt = new JSEncrypt()
      jsencrypt.setPublicKey(state.pk)
      const encrypted = jsencrypt.encrypt(password)
      const { data } = await mobileLogin.post({
        account,
        type,
        school,
        openid: state.webAuth.openid,
        password: encrypted,
        platform: 'mwoa'
      })
      if (data.checkMsg && type === 'parent') {
        Vue.prototype.$notify({
          message: data.checkMsg,
          type: 'warning',
          duration: 2 * 1000
        })
        return
      }
      console.log('login data', data)
      setToken(data.token)
      state.loginForm = {}
      commit('SET_TOKEN', data.token)
      await dispatch('getInfo')
      // todo
      await dispatch('getAndSetFrame')
      if (type === 'parent') {
        dispatch('setCurrentPage', { page: 'select-child' })
      } else {
        dispatch('setCurrentPage', { page: 'home' })
      }
    },
    webAuthentication: async({ commit, state }) => {
      const data = await getPublicId.get({ schoolCode: state.schoolCode })
      console.log('publicAppid', data)
      const redirect_url = urlencode(window.location.href)
      // const redirect_url = urlencode('http://muse.tunnel.platoedu.net/mobile')
      const url = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${data.publicAppid}&redirect_uri=${redirect_url}&response_type=code&scope=snsapi_userinfo&state=${state.schoolCode}#wechat_redirect`
      console.log('url', url)
      console.log('window.location', window.location)
      window.location.href = url
    },
    // get user info
    getInfo: async({ dispatch, commit, state }) => {
      const { data } = await getInfo.get({
        token: state.token
      })
      console.log('用户data', data)
      commit('SET_USERINFO', data)
      const { account, avatar, auths, type, pwd_initialized, pwd_weak, name, _id, students, schoolCode } = data
      console.log('用户auths', auths)
      commit('SET_CHILDREN', students)
      console.log('id', _id)
      commit('SET_USER', data)
      commit('SET_ID', _id)
      commit('SET_ACCOUNT', account)
      commit('SET_NAME', name) // mps已做trueName转换
      commit('SET_TYPE', type)
      commit('SET_MODIFY', pwd_initialized)
      commit('SET_WEAK', pwd_weak)
      commit('SET_AVATAR', avatar)
      commit('SET_AUTHS', auths)
      if (!state.schoolCode) {
        if (!state.schoolCode) {
          state.schoolCode = window.localStorage.getItem('schoolCode')
        } else {
          state.schoolCode = schoolCode
          window.localStorage.setItem('schoolCode', schoolCode)
        }
      }
      if (type === 2 && JSON.stringify(state.userChild) === '{}') {
        console.log('执行了没有', type)
        dispatch('setCurrentPage', { page: 'select-child' })
      }
    },
    logout: async({ commit, state, dispatch }) => {
      await mobilelogout.post({
        token: state.token,
        openid: state.webAuth.openid
      })
      commit('SET_TOKEN', '')
      commit('SET_AUTHS', '')
      removeToken()
      commit('SET_LOGINPAGE', 'select-school')
      dispatch('setCurrentPage', { page: 'login' })
    },
    initPk: async({ commit }) => {
      console.log('mobile pk')
      const { data } = await sess.get()
      commit('SET_PK', encBase64.parse(data.pk).toString(encUtf8))
    },
    sendRequest: async({ commit, state, dispatch }, data) => {
      const sendata = {}
      for (const item of data.request.specialData) {
        sendata[item.key] = formatReference(storage.state, item.value)
      }
      for (const item of data.request.data) {
        sendata[item.key] = item.value
      }
      console.log('开始请求sendRequest数据sendata是', sendata)
      const res = await mRequest({
        url: data.request.url,
        method: data.request.method,
        data: sendata
      })
      console.log('sendRequest的res', res)
      dispatch('refreshPage')
    }
  }
}
export default storage

