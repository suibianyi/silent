
const settings = {
  state: {
    isIphoneX: false,
    pageChange: ['home'],
    schoolCode: 'HSHDEV',
    backgroundColor: '#ffffff'
  },
  mutations: {
    PUSH_PAGECHANGE: (state, data) => {
      console.log('切换的下一页是', data)
      state.pageChange.push(data)
      console.log('切换的下一页后的list', state.pageChange)
    },
    POP_PAGECHANGE: (state) => {
      console.log('pageChange_pop')
      state.pageChange.pop()
    },
    SET_BACKGROUND_COLOR: (state, data) => {
      state.backgroundColor = data
    }
  },

  actions: {
    popPageChange: ({ commit, state, dispatch }) => {
      if (state.pageChange.length) {
        commit('POP_PAGECHANGE')
        console.log('state.pageChange还剩下', state.pageChange)
        dispatch('setCurrentPage', { page: state.pageChange[state.pageChange.length - 1 ], back: true })
      }
    },
    setBackgroundColor: ({ commit, state, dispatch }, data) => {
      if (data) {
        commit('SET_BACKGROUND_COLOR', data)
      }
    }
  }
}
export default settings

