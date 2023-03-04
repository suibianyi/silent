
const navBar = {
  state: {
    navBar: {
      navBarTitle: '',
      navBarRight: {
        text: '',
        page: ''
      }
    }
  },
  mutations: {
    SET_NAV_BAR: (state, data) => {
      console.log('navBar', data)
      if (data.navBar) {
        state.navBar = data.navBar
      } else {
        state.navBar = {
          navBarTitle: '',
          navBarRight: {
            text: '',
            page: ''
          }
        }
      }
    }
  },

  actions: {
    backNav: ({ commit, dispatch }) => {
      dispatch('popPageChange')
    },
    'nav-bar': async({ commit, state }, data) => {
      commit('SET_NAV_BAR', data)
    }
  }
}
export default navBar

