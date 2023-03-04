
const grid = {
  state: {
    gridList: [],
    gridColumnNum: 4
  },
  mutations: {
    SET_GRID: (state, data) => {
      console.log('grid是', data)
      if (data.gridList && data.gridList.length) {
        state.gridList = data.gridList
      }
      if (state.gridColumnNum) {
        state.gridColumnNum = data.gridColumnNum
      }
    }
  },

  actions: {
    'grid-nav': async({ commit, state }, data) => {
      commit('SET_GRID', data)
    }
  }
}
export default grid

