import Vue from 'vue'
const tab = {
  state: {
    tab: {
      default: {
        tabList: []
      }
    }
  },
  mutations: {
    SET_TAB: (state, data) => {
      console.log('tab是', data)
      if (data.id && data.tabList) {
        Vue.set(state.tabList, data.id, data.tabList)
      }
      // if (data.tab.tabList && data.tab.tabList.length) {
      //   state.tab = data.tab
      // }
    }
  },

  actions: {
    tab: async({ commit, state }, data) => {
      commit('SET_TAB', data)
    }
  }
}
export default tab

