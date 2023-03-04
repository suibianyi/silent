
const login = {
  state: {
    loginPage: 'select-school',
    authFlag: false
    // loginPage: 'school-list'
  },
  mutations: {
    SET_LOGINPAGE: (state, data) => {
      state.loginPage = data
    },
    SET_AUTHFLAG: (state, data) => {
      state.authFlag = data
      console.log('设置authFlag', state.authFlag)
    }
  },
  actions: {
  }
}
export default login

