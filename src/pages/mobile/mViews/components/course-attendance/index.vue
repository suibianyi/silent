<template>
  <div class="attendance-index">
    <component :is="page" />
  </div>
</template>

<script>
import courseAttendanceGrade from './course-attendance-grade'
import courseAttendanceClass from './course-attendance-class'
import courseAttendanceCourse from './course-attendance-course'
import courseAttendanceDetail from './course-attendance-detail'
import classCourseAttendance from './class-course-attendance'
import classCourseAttendanceDetail from './class-course-attendance-detail'
import userCourseAttendance from './user-course-attendance'

export default {
  components: {
    courseAttendanceGrade,
    courseAttendanceClass,
    courseAttendanceCourse,
    courseAttendanceDetail,
    classCourseAttendance,
    classCourseAttendanceDetail,
    userCourseAttendance
  },
  data() {
    return {
    }
  },
  computed: {
    page() {
      return this.$store.state.attendance.attendancePage
    }
  },
  mounted() {
    // this.$store.commit('CHANGE_PAGE', 'home');
  },
  methods: {
  }
}

</script>

<style>
.attendance-index{
  width: 100%;
  height: 100vh;
}
</style>
