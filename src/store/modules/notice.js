import {
  mRequest
} from '@/api/request'
import _ from 'lodash'
import {
  formatResponseArray,
  formatReference
} from '@/mUtils'
import storage from './storage'
const notice = {
  state: {
    notice: {
      noticeList: [],
      noticeClick: ''
    }
  },
  mutations: {
    SET_NOTICE: (state, data) => {
      console.log('noticeList在SET_notice', data)
      if (data.noticeList) {
        console.log('赋值前的noticeList', state.notice.noticeList)
        state.notice.noticeList = state.notice.noticeList.concat(data.noticeList)
        console.log('赋值完的noticeList', state.notice.noticeList)
        if (state.notice.noticeList.length >= state.notice.totalPage) {
          state.notice.finished = true
        }
      }
      if (data.noticeJumpPage && data.noticeJumpPage !== '') {
        state.notice.noticeJumpPage = data.noticeJumpPage
      }
      if (data.noticeJumpDate) {
        state.notice.noticeJumpDate = data.noticeJumpDate
      }
      if (data.request) {
        state.notice.request = data.request
      }
      if (data.response) {
        state.notice.response = data.response
      }
      if (data.totalPage) {
        state.notice.totalPage = data.totalPage
        if (state.notice.noticeList.length >= state.notice.totalPage) {
          state.notice.finished = true
        }
      }
      if (data.loading) {
        state.notice.loading = data.loading
      }
      if (data.finished) {
        state.notice.finished = data.finished
      }
      if (data.noticeClick && data.noticeClick !== '') {
        state.notice.noticeClick = data.noticeClick
      }
    },
    CLEAN_NOTICE: (state, data) => {
      state.notice.noticeList = []
    }
  },

  actions: {
    'notice-bar': async({ commit, state }, data) => {
      if (data.new) {
        commit('CLEAN_NOTICE')
      }
      if (data.noticeJumpPage && data.noticeJumpPage !== '') {
        commit('SET_notice', { noticeJumpPage: data.noticeJumpPage })
      }
      if (data && data.request && data.request.url) {
        const sendata = {}
        console.log('开始请求notice数据', data)
        for (const item of data.request.specialData) {
          sendata[item.key] = formatReference(storage.state, item.value)
        }
        for (const item of data.request.data) {
          sendata[item.key] = item.value
        }
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
        console.log('格式化notice数据', resultList,)
        commit('SET_notice', { noticeList: resultList })
        const tempRequest = _.cloneDeep(data.request)
        for (const item of tempRequest) {
          if (item.key === 'page') {
            item.value++
          }
        }
        commit('SET_notice', { request: tempRequest, response: data.response })
        if (res.data.total) {
          commit('SET_notice', { totalPage: res.data.total, loading: false })
        }
      }
    }
  }
}
export default notice

