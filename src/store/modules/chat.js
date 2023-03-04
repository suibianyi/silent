
const chat = {
  state: {
    chatPage: 'select-student',
    selectStudent: {
      sid: '',
      studentId: '',
      orgClassId: '',
      orgClassName: '',
      schoolCode: '',
      userType: '',
      account: '',
      sName: '',
      classId: ''
    }
  },
  mutations: {
    SET_CHATPAGE: (state, data) => {
      state.chatPage = data
    },
    SET_CHATSTUDENT: (state, data) => {
      state.selectStudent = data
      console.log('选择的学生是', state.selectStudent)
    }
  },
  actions: {
  }
}
export default chat

