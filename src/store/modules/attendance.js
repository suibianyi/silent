
const attendance = {
  state: {
    attendancePage: '',
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
    SET_ATTENDANCEPAGE: (state, data) => {
      console.log('考勤进入的页面是', data)
      state.attendancePage = data
    },
    SET_QNRTCSTUDENT: (state, data) => {
      state.selectStudent = data
      console.log('选择的学生是', state.selectStudent)
    }
  },
  actions: {
    'course-attendance': async({ commit, state }, data) => {
      if (data && data.attendance && data.attendance.firstPage) {
        commit('SET_ATTENDANCEPAGE', data.attendance.firstPage)
      }
    },
    'event-attendance': async({ commit, state }, data) => {
      if (data && data.attendance && data.attendance.firstPage) {
        commit('SET_ATTENDANCEPAGE', data.attendance.firstPage)
      }
    }
  }
}
export default attendance

