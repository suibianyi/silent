import Vue from 'vue'
import { cloneDeep } from 'lodash'
const actionSheet = {
  state: {
    content: {
      show: false,
      actions: [],
      text: 'https://img01.yzcdn.cn/vant/ipad.jpeg',
      func: 'home'
    }
  },
  mutations: {
    SET_ACTIONDHEET: (state, data) => {
      // state.content = data.func
      Vue.set(state, 'content', cloneDeep(data.func))
      console.log('actionSheet', state.content)
    }
  },

  actions: {
    actionSheet: async({ commit, state }, data) => {
      commit('SET_ACTIONDHEET', data)
    }
  }
}
export default actionSheet

