
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
    swipeList: [{
      imageUrl: 'https://fastly.jsdelivr.net/npm/@vant/assets/apple-1.jpeg',
      page: 'home'
    }, {
      imageUrl: 'https://fastly.jsdelivr.net/npm/@vant/assets/apple-2.jpeg',
      page: ''
    }],
    swipeAutoplay: 3000
  },
  mutations: {
    SET_SWIPE: (state, data) => {
      console.log('currentPage', data)
      state.swipeList = data.swipeList
      state.swipeAutoplay = data.swipeAutoplay
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
      // const spliceRes = data.response.swipeList.split('.')
      // let tempList = res
      // for (const item of spliceRes) {
      //   tempList = tempList[item]
      // }
      // const resultList = []

      // const spliceCorRes = data.response.swipeListCor.split('.')
      // for (const item of tempList) {
      //   let tempCorItem = item
      //   for (const item of spliceCorRes) {
      //     tempCorItem = tempCorItem[item]
      //   }
      //   resultList.push({ imageUrl: tempCorItem })
      // }
      commit('SET_SWIPE', { swipeList: resultList, swipeAutoplay: data.swipeAutoplay })
    }
  }
}
export default swipe

