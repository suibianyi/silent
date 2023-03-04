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
const album = {
  state: {
    album: {
      albumList: [],
      loading: false,
      finished: false,
      request: {},
      response: {},
      jumpPage: '',
      jumpDate: '',
      totalPage: ''
    }
  },
  mutations: {
    SET_ALBUM: (state, data) => {
      console.log('albumList在SET_ALBUM', data)
      if (data.albumList) {
        console.log('赋值前的albumList', state.album.albumList)
        state.album.albumList = state.album.albumList.concat(data.albumList)
        console.log('赋值完的albumList', state.album.albumList)
        if (state.album.albumList.length >= state.album.totalPage) {
          state.album.finished = true
        }
      }
      if (data.jumpPage && data.jumpPage !== '') {
        state.album.jumpPage = data.jumpPage
      }
      if (data.jumpDate) {
        state.album.jumpDate = data.jumpDate
      }
      if (data.edit) {
        state.album.edit = data.edit
      }
      if (data.del) {
        state.album.del = data.del
      }
      if (data.request) {
        state.album.request = data.request
      }
      if (data.response) {
        state.album.response = data.response
      }
      if (data.totalPage) {
        state.album.totalPage = data.totalPage
        if (state.album.albumList.length >= state.album.totalPage) {
          state.album.finished = true
        }
      }
      if (data.loading) {
        state.album.loading = data.loading
      }
      if (data.finished) {
        state.album.finished = data.finished
      }
    },
    CLEAN_ALBUM: (state, data) => {
      state.album.albumList = []
    },
    SET_CHECKED: (state, data) => {
      Vue.set(state.album.albumList[data.index], 'checked', data.checked)
      console.log('修改后的albumList', state.album.albumList)
    }
  },

  actions: {
    setAlbumChecked: ({ commit, state }, data) => {
      console.log('我正在setAlbumChecked', data)
      commit('SET_CHECKED', data)
    },
    loadAlbum: async({ commit, state }, data) => {
      console.log('我正在load加载')
      if (state.album.albumList.length < state.album.totalPage) {
        state.dispatch('album', state)
      }
    },
    'album-show': async({ commit, dispatch }, data) => {
      dispatch('album', data)
    },
    album: async({ commit, state }, data) => {
      if (data.jumpPage && data.jumpPage !== '') {
        commit('SET_ALBUM', { jumpPage: data.jumpPage })
      }
      if (data.edit) {
        commit('SET_ALBUM', { edit: data.edit })
      }
      if (data.del) {
        commit('SET_ALBUM', { del: data.del })
      }
      if (data.request && data.request.url && data.request.url !== '') {
        const sendata = {}
        console.log('开始请求album数据', data)
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
        const format = []
        if (data.response && data.response.descList && data.response.descList !== '') {
          format.push({
            responseList: data.response.descList,
            responseCor: data.response.descListCor,
            resultName: 'desc'
          })
        }
        if (data.response && data.response.titleList && data.response.titleList !== '') {
          format.push({
            responseList: data.response.titleList,
            responseCor: data.response.titleListCor,
            resultName: 'title'
          })
        }
        if (data.response && data.response.thumbList && data.response.thumbList !== '') {
          format.push({
            responseList: data.response.thumbList,
            responseCor: data.response.thumbListCor,
            resultName: 'thumb'
          })
        }
        console.log('这里的format是', format)
        const formatData = {
          res,
          format: format
        }
        const resultList = formatResponseArray(formatData)
        console.log('格式化album数据', resultList,)
        if (data.new) {
          commit('CLEAN_ALBUM')
        }
        commit('SET_ALBUM', { albumList: resultList })
        const tempRequest = _.cloneDeep(data.request)
        for (const item of tempRequest) {
          if (item.key === 'page') {
            item.value++
          }
        }
        commit('SET_ALBUM', { request: tempRequest, response: data.response })
        if (res.data.total) {
          commit('SET_ALBUM', { totalPage: res.data.total, loading: false })
        }
      }
    }
  }
}
export default album

