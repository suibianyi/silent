import Vue from 'vue'
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
      default: {
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
    }
  },
  mutations: {
    SET_DYNAMIC: (state, data) => {
      console.log('dynamicList在SET_DYNAMIC', data)
      if (data && data.id) {
        if (!state.dynamic[data.id]) {
          Vue.set(state.dynamic, data.id, {})
        }
        if (data.dynamicList) {
          console.log('赋值前的dynamicList', state.dynamic[data.id].dynamicList)
          Vue.set(state.dynamic[data.id], 'dynamicList', state.dynamic[data.id].dynamicList.concat(data.dynamicList))
          console.log('赋值完的dynamicList', state.dynamic[data.id].dynamicList)
          if (state.dynamic[data.id].dynamicList.length >= state.dynamic[data.id].totalPage) {
            Vue.set(state.dynamic[data.id], 'finished', true)
          }
        }
        if (data.dynamicJumpPage && data.dynamicJumpPage !== '') {
          Vue.set(state.dynamic[data.id], 'dynamicJumpPage', data.dynamicJumpPage)
        }
        if (data.dynamicJumpDate) {
          Vue.set(state.dynamic[data.id], 'dynamicJumpDate', data.dynamicJumpDate)
        }
        if (data.request) {
          Vue.set(state.dynamic[data.id], 'request', data.request)
        }
        if (data.response) {
          Vue.set(state.dynamic[data.id], 'response', data.response)
        }
        if (data.totalPage) {
          Vue.set(state.dynamic[data.id], 'totalPage', data.totalPage)
          if (state.dynamic[data.id].dynamicList.length >= state.dynamic[data.id].totalPage) {
            Vue.set(state.dynamic[data.id], 'finished', true)
          }
        }
        if (typeof (data.loading) === 'boolean') {
          Vue.set(state.dynamic[data.id], 'loading', data.loading)
          console.log('赋值dynamic。load完毕', state.dynamic[data.id].loading)
        }
        if (data.finished) {
          Vue.set(state.dynamic[data.id], 'finished', data.finished)
        }
        console.log('赋值dynamic完毕')
      }
    },
    CLEAN_DYNAMIC: (state, data) => {
      console.log('删除dynamicList', data)
      state.dynamic[data.id].dynamicList = []
    }
  },

  actions: {
    loadDynamic: async({ commit, state, dispatch }, data) => {
      if (data.id && state.dynamic[data.id] && state.dynamic[data.id].dynamicList && (state.dynamic[data.id].dynamicList.length < state.dynamic[data.id].totalPage)) {
        const temp = _.assign(state.dynamic[data.id], { new: false, id: data.id })
        console.log('我正在load加载dynamic', temp)
        dispatch('dynamic', temp)
      } else {
        commit('SET_DYNAMIC', { id: data.id, loading: false })
      }
    },
    'dynamic-1': async({ commit, dispatch }, data) => {
      dispatch('dynamic', data)
    },
    dynamic: async({ commit, state }, data) => {
      console.log('dynamic的刚进来', data)
      if (data.id) {
        if (data.dynamicJumpPage && data.dynamicJumpPage !== '') {
          commit('SET_DYNAMIC', { id: data.id, dynamicJumpPage: data.dynamicJumpPage })
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
        console.log('格式化dynamic数据', resultList)
        if (data.new) {
          commit('CLEAN_DYNAMIC', data)
        }
        commit('SET_DYNAMIC', { id: data.id, dynamicList: resultList })
        const tempRequest = _.cloneDeep(data.request)
        console.log('dynamic的request数据', tempRequest, data.request)
        for (const item of tempRequest.data) {
          if (item.key === 'page') {
            item.value++
          }
        }
        commit('SET_DYNAMIC', { id: data.id, request: tempRequest, response: data.response })
        if (res.data.total) {
          commit('SET_DYNAMIC', { id: data.id, totalPage: res.data.total, loading: false })
        }
      }
    }
  }
}
export default dynamic

