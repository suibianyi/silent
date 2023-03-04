
const tab = {
  state: {
    tab: {
      tabList: []
    }
  },
  mutations: {
    SET_TAB: (state, data) => {
      console.log('tab是', data)
      if (data.tab.tabList && data.tab.tabList.length) {
        state.tab = data.tab
      }
    }
  },

  actions: {
    tab: async({ commit, state }, data) => {
      commit('SET_TAB', data)
    }
  }
}
export default tab

