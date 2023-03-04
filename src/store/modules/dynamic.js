
import {
  mRequest
} from '@/api/request'
import _ from 'lodash'
import {
  formatResponseArray,
  formatReference
} from '@/mUtils'
import storage from './storage'
const dynamic = {
  state: {
    dynamic: {
      dynamicList: [],
      loading: false,
      finished: false,
      request: {},
      response: {},
      dynamicJumpPage: {
        page: '',
        func: '',
        req: ''
      },
      dynamicJumpDate: '',
      totalPage: ''
    }
  },
  mutations: {
    SET_DYNAMIC: (state, data) => {
      console.log('dynamicList在SET_DYNAMIC', data)
      if (data.dynamicList) {
        console.log('赋值前的dynamicList', state.dynamic.dynamicList)
        state.dynamic.dynamicList = state.dynamic.dynamicList.concat(data.dynamicList)
        console.log('赋值完的dynamicList', state.dynamic.dynamicList)
        if (state.dynamic.dynamicList.length >= state.dynamic.totalPage) {
          state.dynamic.finished = true
        }
      }
      if (data.dynamicJumpPage && data.dynamicJumpPage !== '') {
        state.dynamic.dynamicJumpPage = data.dynamicJumpPage
      }
      if (data.dynamicJumpDate) {
        state.dynamic.dynamicJumpDate = data.dynamicJumpDate
      }
      if (data.request) {
        state.dynamic.request = data.request
      }
      if (data.response) {
        state.dynamic.response = data.response
      }
      if (data.totalPage) {
        state.dynamic.totalPage = data.totalPage
        if (state.dynamic.dynamicList.length >= state.dynamic.totalPage) {
          state.dynamic.finished = true
        }
      }
      if (data.loading) {
        state.dynamic.loading = data.loading
      }
      if (data.finished) {
        state.dynamic.finished = data.finished
      }
      console.log('赋值dynamic完毕')
    },
    CLEAN_DYNAMIC: (state, data) => {
      state.dynamic.dynamicList = []
    }
  },

  actions: {
    loadDynamic: async({ commit, state }, data) => {
      console.log('我正在load加载')
      if (state.dynamic.dynamicList.length < state.dynamic.totalPage) {
        state.dispatch('dynamic', state)
      }
    },
    'dynamic-1': async({ commit, dispatch }, data) => {
      dispatch('dynamic', data)
    },
    dynamic: async({ commit, state }, data) => {
      if (data.dynamicJumpPage && data.dynamicJumpPage !== '') {
        commit('SET_DYNAMIC', { dynamicJumpPage: data.dynamicJumpPage })
      }
      const sendata = {}
      for (const item of data.request.specialData) {
        sendata[item.key] = formatReference(storage.state, item.value)
      }
      for (const item of data.request.data) {
        sendata[item.key] = item.value
      }
      console.log('开始请求dynamic数据', sendata)
      const res = await mRequest({
        url: data.request.url,
        method: data.request.method,
        data: sendata
      })
      const formatData = {
        res,
        format: [{
          responseList: data.response.descList,
          responseCor: data.response.descListCor,
          resultName: 'desc'
        }, {
          responseList: data.response.titleList,
          responseCor: data.response.titleListCor,
          resultName: 'title'
        }, {
          responseList: data.response.thumbList,
          responseCor: data.response.thumbListCor,
          resultName: 'thumb'
        }]
      }
      const resultList = formatResponseArray(formatData)
      console.log('格式化dynamic数据', resultList,)
      if (data.new) {
        commit('CLEAN_DYNAMIC')
      }
      commit('SET_DYNAMIC', { dynamicList: resultList })
      const tempRequest = _.cloneDeep(data.request)
      for (const item of tempRequest) {
        if (item.key === 'page') {
          item.value++
        }
      }
      commit('SET_DYNAMIC', { request: tempRequest, response: data.response })
      if (res.data.total) {
        commit('SET_DYNAMIC', { totalPage: res.data.total, loading: false })
      }
    }
  }
}
export default dynamic

