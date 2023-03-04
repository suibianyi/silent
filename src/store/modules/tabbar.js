
const tabbar = {
  state: {
    tabbarList: [
      {
        page: 'home',
        iconPath: require('@/assets/mobile/tabbar/school.png'),
        selectedIconPath: require('@/assets/mobile/tabbar/school_h.png'),
        text: '校园'
      },
      {
        page: 'class',
        iconPath: require('@/assets/mobile/tabbar/class.png'),
        selectedIconPath: require('@/assets/mobile/tabbar/class_h.png'),
        text: '班级'
      },
      {
        page: 'my',
        iconPath: require('@/assets/mobile/tabbar/my.png'),
        selectedIconPath: require('@/assets/mobile/tabbar/my_h.png'),
        text: '我的'
      }
    ],
    currentIndex: 0
  },
  mutations: {
    SET_CURRENTINDEX: (state, data) => {
      console.log('currentIndex', data)
      state.currentIndex = data
    },
    SET_M_TABBAR: (state, data) => {
      console.log('tabbarList', data)
      if (data.tabbarList && data.tabbarList.length) {
        state.tabbarList = data.tabbarList
      }
    }
  },

  actions: {
    setCurrentIndex: ({ commit, state, dispatch }, data) => {
      commit('SET_CURRENTINDEX', data)
      dispatch('setCurrentPage', { page: state.tabbarList[data].page })
    },
    'm-tabbar': async({ commit, state }, data) => {
      commit('SET_M_TABBAR', data)
    }
  }
}
export default tabbar

