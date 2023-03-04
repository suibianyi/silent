/**
 * 管理端专用 api
 */

import axios from 'axios'
import Vue from 'vue'
import {
  each,
  isObject,
  map,
  clone
} from 'lodash'
import store from '@/store'
import { getToken, removeToken } from '@/utils/auth'
import { Utils } from '../utils'

const methods = ['get', 'post', 'put', 'delete']

const service = axios.create({
  baseURL: `${window.location.origin}/api/private`,
  withCredentials: false,
  timeout: 60000, // request timeout
  validateStatus(status) {
    if (status === 401) {
      Utils.appVm && Utils.appVm.$emit('401')
    }
    return status >= 200 && status < 400
  }
})

// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent

    if (store.getters.token) {
      // let each request carry token
      // ['X-Token'] is a custom headers key
      // please modify it according to the actual situation
      config.headers['Authorization'] = getToken()
    }
    if (store.getters.schoolCode) {
      // let each request carry token
      // ['X-Token'] is a custom headers key
      // please modify it according to the actual situation
      console.log('store.getters.schoolCode', store.getters.schoolCode)
      config.headers['X-SCHOOL'] = store.getters.schoolCode
    }
    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
   */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  async response => {
    let res = response.data || response
    // 排除非json类型
    if (response.headers['content-type'].indexOf('application/json') === -1) {
      return res
    }
    if (res instanceof Blob) {
      res = JSON.parse(await res.text())
    }
    // if the custom code is not 20000, it is judged as an error.
    if (res.code !== 0 && res.code !== 200) {
      // Message({
      //   message: res.msg || res.message || 'Error',
      //   type: 'error',
      //   duration: 5 * 1000
      // })
      // 70001: Illegal token; 50012: Other clients logged in; 70000: Token expired;
      if (res.code === 70001 || res.code === 50012 || res.code === 70000) {
        // to re-logindeng
        console.log('response', response.config.url)
        if (response.config.url.indexOf('/user/logout') < 0) {
          console.log('您已登出平台')
          store.commit('SET_TOKEN', '')
          store.commit('SET_AUTHS', '')
          removeToken()
          // store.dispatch('setCurrentPage', { page: 'login' })
        }
      } else {
        // 防止同时多次弹窗
        Vue.prototype.$notify({
          message: res.msg || res.message || '服务器异常',
          type: 'danger',
          color: '#ad0000',
          background: '#ffe1e1',
          duration: 5 * 1000
        })
      }
      return Promise.reject(new Error(res.msg || res.message || 'Error'))
    } else {
      if (response.headers.authorization) {
        store.dispatch('user/refreshToken', response.headers.authorization)
      }
      return res
    }
  },
  error => {
    console.log('err' + error) // for debug
    if (error.message.includes('timeout')) {
      // 判断请求异常信息中是否含有超时timeout字符串
      Vue.prototype.$notify({
        message: '请求超时...',
        type: 'warning',
        duration: 5 * 1000
      })
    } else if (error.message) {
      Vue.prototype.$notify({
        message: error.message,
        type: 'warning',
        duration: 5 * 1000
      })
    } else {
      Vue.prototype.$notify({
        message: '服务器异常，状态 500',
        type: 'danger',
        color: '#ad0000',
        background: '#ffe1e1',
        duration: 5 * 1000
      })
    }
    return Promise.reject(error)
  }
)
function transformQuery(args) {
  return map(args, (v, k) => {
    delete args[k]
    return `${k}=${encodeURIComponent(v)}`
  }).join('&')
}

/**
 * 填充参数路径
 * @param {string} method http method
 * @param {string} path url
 * @param {object} data http send data
 */
export function fillUrl(method, path, data) {
  const pattern = /\/:(\w+)/g
  const isDataObject = isObject(data)
  let result = path.replace(pattern, ($0, $1) => {
    const value = isDataObject ? data[$1] : data
    isDataObject && (delete data[$1])
    return value != null ? `/${encodeURIComponent(value)}` : ''
  })
  if (isDataObject && !/^post|put$/.test(method)) {
    const query = transformQuery(data)
    query && (result += `?${query}`)
  }
  return result
}

export default function resource(path) {
  const fns = {}
  each(methods, (method) => {
    /**
     * @param {object || string || number} data
     * @param {object} config
     */
    fns[method] = (data, config) => {
      const cloneData = clone(data)
      // 该方法将会改变 cloneData
      const url = fillUrl(method, path, cloneData)
      console.log('resource url', url)
      !config && (config = {})
      config.method = method
      config.url = url
      if (cloneData && /^post|put$/.test(method)) {
        config.data = cloneData
      }
      return service(config)
    }
  })
  return fns
}

