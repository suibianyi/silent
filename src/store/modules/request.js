
const request = {
  state: {
    request: {
      requestList: {}
    }
  },
  mutations: {
    ADD_REQUEST: (state, data) => {
      console.log('request是', data)
      if (data && data.requestList) {
        state.request.requestList = data.requestList
      }
    }
  },

  actions: {
    addRequest: async({ commit, state }, data) => {
      commit('ADD_REQUEST', data)
    }
  }
}
export default request

