
const shadowBox = {
  state: {
    shadowBoxList: []
  },
  mutations: {
    SET_SHADOW_BOX: (state, data) => {
      console.log('shadowBoxList', data)
      if (data.shadowBoxList && data.shadowBoxList.length) {
        state.shadowBoxList = data.shadowBoxList
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

