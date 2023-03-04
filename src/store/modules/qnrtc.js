
const qnrtc = {
  state: {
    qnrtcPage: 'select-student',
    selectStudent: {
      sid: '',
      schoolCode: '',
      userType: '',
      account: '',
      sName: '',
      classId: ''
    }
  },
  mutations: {
    SET_QNRTCPAGE: (state, data) => {
      state.qnrtcPage = data
    },
    SET_QNRTCSTUDENT: (state, data) => {
      state.selectStudent = data
      console.log('选择的学生是', state.selectStudent)
    }
  },
  actions: {
  }
}
export default qnrtc

