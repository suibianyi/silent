import Vue from 'vue'
import { cloneDeep } from 'lodash'
const dialog = {
  state: {
    content: {
      show: false,
      title: '123165465',
      text: 'https://img01.yzcdn.cn/vant/ipad.jpeg',
      func: 'home'
    }
  },
  mutations: {
    SET_DIALOG: (state, data) => {
      // state.content = data.func
      Vue.set(state, 'content', cloneDeep(data.func))
      console.log('dialog', state.content)
    }
  },

  actions: {
    dialog: async({ commit, state }, data) => {
      commit('SET_DIALOG', data)
    }
  }
}
export default dialog

