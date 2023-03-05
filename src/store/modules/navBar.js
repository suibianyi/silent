import context from '../../pages/mobile/main'
const navBar = {
  state: {
    navBar: {
      navBarTitle: '',
      navBarRight: {
        text: '',
        page: ''
      },
      navBarTextColor: '#00afee'
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
          },
          navBarTextColor: '#00afee'
        }
      }
    }
  },

  actions: {
    backNav: ({ commit, dispatch }) => {
      context.$router.go(-1)
      // dispatch('popPageChange')
    },
    'nav-bar': async({ commit, state }, data) => {
      commit('SET_NAV_BAR', data)
    }
  }
}
export default navBar

