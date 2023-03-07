
import Vue from 'vue'
const grid = {
  state: {
    grid: {
      default: {
        gridList: [],
        gridColumnNum: 4
      }
    }
  },
  mutations: {
    SET_GRID: (state, data) => {
      console.log('grid是', data)
      if (data.id) {
        Vue.set(state.grid, data.id, { gridList: data.gridList, gridColumnNum: data.gridColumnNum })
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

