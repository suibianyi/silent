import Vue from 'vue'
import {
  mRequest
} from '@/api/request'
import {
  formatResponseArray,
  formatReference
} from '@/mUtils'
import storage from './storage'
const swipe = {
  state: {
    swipe: {
      default: {
        swipeList: [{
          imageUrl: 'https://fastly.jsdelivr.net/npm/@vant/assets/apple-1.jpeg',
          page: 'home'
        }, {
          imageUrl: 'https://fastly.jsdelivr.net/npm/@vant/assets/apple-2.jpeg',
          page: ''
        }],
        swipeAutoplay: 3000
      }
    }
  },
  mutations: {
    SET_SWIPE: (state, data) => {
      console.log('swip', data)
      if (data.id && data.swipe) {
        if (state.swipe[data.id]) {
          Object.assign(state.swipe[data.id], data.swipe)
          console.log('执行swip123456', state.swipe)
        } else {
          Vue.set(state.swipe, data.id, data.swipe)
          console.log('执行swip', state.swipe)
        }
      }
    }
  },

  actions: {
    swipe: async({ commit, state }, data) => {
      const sendata = {}
      console.log('开始请求swip数据', data)
      for (const item of data.request.specialData) {
        sendata[item.key] = formatReference(storage.state, item.value)
      }
      for (const item of data.request.data) {
        sendata[item.key] = item.value
      }
      console.log('开始请求swip数据sendata是', sendata)
      const res = await mRequest({
        url: data.request.url,
        method: data.request.method,
        data: sendata
      })
      const formatData = {
        res,
        format: [{
          responseList: data.response.swipeList,
          responseCor: data.response.swipeListCor,
          resultName: 'imageUrl'
        }]
      }
      const resultList = formatResponseArray(formatData)
      commit('SET_SWIPE', { id: data.id, swipe: { swipeList: resultList, swipeAutoplay: data.swipeAutoplay }})
    }
  }
}
export default swipe

