const cell = {
  state: {
    cellList: [{
      icon: 'location-o',
      title: '帮助中心',
      page: 'home',
      func: {}
    }, {
      icon: 'location-o',
      title: '退出登录',
      page: 'home',
      func: {}
    }]
  },
  mutations: {
    SET_CELL: (state, data) => {
      console.log('cellList', data)
      if (data.cellList && data.cellList.length) {
        state.cellList = data.cellList
      }
      console.log('赋值后cellList', state.cellList)
    }
  },

  actions: {
    cell: async({ commit, state }, data) => {
      console.log('cellList111111', data)
      commit('SET_CELL', data)
    }
  }
}
export default cell

