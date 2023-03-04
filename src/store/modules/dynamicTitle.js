
const dynamicTitle = {
  state: {
    dynamicTitle: {
      rightText: '查看更多',
      leftText: '校园动态',
      page: 'school-dynamic-list'
    }
  },
  mutations: {
    SET_DYNAMIC_TITLE: (state, data) => {
      if (data.dynamicTitle) {
        state.dynamicTitle = data.dynamicTitle
      }
      console.log('dynamicTitle', state.dynamicTitle)
    }
  },

  actions: {
    'dynamic-title': async({ commit, state }, data) => {
      commit('SET_DYNAMIC_TITLE', data)
    }
  }
}
export default dynamicTitle

