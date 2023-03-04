import {
  formatReference
} from '@/mUtils'
import storage from './storage'
const artical = {
  state: {
    articalDetail: {
      desc: '',
      title: '',
      thumb: '',
      page: ''
    }
  },
  mutations: {
    SET_ARTICAL: (state, data) => {
      console.log('收到artical-detail数据是', data)
      state.articalDetail = data
      console.log('articalDetail', state.articalDetail)
    }
  },

  actions: {
    'artical-detail': async({ commit, state }, data) => {
      console.log('开始请求artical-detail数据', data)
      if (data && data.reference) {
        console.log('开始请求artical-detail数据12345678956413134156', data.reference.title)
        console.log('56413134156', storage)
        const title = formatReference(storage.state, data.reference.title)
        const thumb = formatReference(storage.state, data.reference.thumb)
        const desc = formatReference(storage.state, data.reference.desc)
        commit('SET_ARTICAL', { title: title, thumb: thumb, desc: desc })
      }
    }
  }
}
export default artical

