import storage from './storage'
const myHead = {
  state: {
    myHead: {
      myHeadBackground: require('@/assets/mobile/my/header.png'),
      avatar: 'https://img01.yzcdn.cn/vant/cat.jpeg',
      name: '佚名'
    }
  },
  mutations: {
    SET_MY_HEAD: (state, data) => {
      console.log('myHead', data)
      if (data.avatar) {
        state.myHead.avatar = data.avatar
      }
      if (data.name) {
        state.myHead.name = data.name
      }
      if (data.myHeadBackground) {
        state.myHead.myHeadBackground = data.myHeadBackground
      }
    }
  },

  actions: {
    'my-head': async({ commit, state }, data) => {
      // for (const item of data.specialData) {
      //   sendata[item.key] = storage.state[item.value]
      // }
      const tempdata = {}
      tempdata.avatar = storage.state[data.specialData.avatar]
      tempdata.name = storage.state[data.specialData.name]
      commit('SET_MY_HEAD', tempdata)
    }
  }
}
export default myHead

