import Vue from 'vue'
const shadowBox = {
  state: {
    shadowBoxList: {
      default: []
    }
  },
  mutations: {
    SET_SHADOW_BOX: (state, data) => {
      console.log('shadowBoxList', data)
      if (data.shadowBoxList && data.shadowBoxList.length) {
        Vue.set(state.shadowBoxList, data.id, data.shadowBoxList)
      }
    }
  },

  actions: {
    'shadow-box': async({ commit, state }, data) => {
      commit('SET_SHADOW_BOX', data)
    }
  }
}
export default shadowBox

