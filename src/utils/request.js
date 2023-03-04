import axios from 'axios'
import { assign } from 'lodash'
// import { MessageBox, Message } from 'element-ui'
import { MessageBox } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'
import Vue from 'vue'
// create an axios instance
const service = axios.create({
  baseURL: '/api/private', // url = base url + request url
  withCredentials: false, // send cookies when cross-domain requests
  timeout: 60000 // request timeout
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
          MessageBox.confirm(
            '您已登出平台，是否要重新登录？',
            '登出确认',
            {
              confirmButtonText: '重新登录',
              cancelButtonText: '取消',
              type: 'warning'
            }
          ).then(() => {
            store.dispatch('user/resetToken').then(() => {
              location.reload()
            })
          })
        }
      } else {
        // 防止同时多次弹窗
        Vue.prototype.$message.error({
          message: res.msg || res.message || '服务器异常',
          type: 'error',
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
      Vue.prototype.$message.error({
        message: '请求超时...',
        type: 'error',
        duration: 5 * 1000
      })
    } else if (error.message.includes('500')) {
      Vue.prototype.$message.error({
        message: '服务器异常，状态 500',
        type: 'error',
        duration: 5 * 1000
      })
    } else {
      Vue.prototype.$message.error({
        message: error.message,
        type: 'error',
        duration: 5 * 1000
      })
    }

    return Promise.reject(error)
  }
)

export function resourcePost(url, config) {
  return data => service(assign(config, {
    url,
    method: 'post',
    data
  }))
}

export function resourcePut(url, config) {
  return data => service(assign(config, {
    url,
    method: 'put',
    data
  }))
}

export function resourceGet(url, config) {
  return params => service(assign(config, {
    url,
    method: 'get',
    params
  }))
}

export function resourceDelete(url, config) {
  return params => service(assign(config, {
    url,
    method: 'delete',
    params
  }))
}

export default service
