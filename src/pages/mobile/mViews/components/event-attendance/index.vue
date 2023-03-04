<template>
  <div class="attendance-index">
    <component :is="page" />
  </div>
</template>

<script>
import eventAttendanceStatistics from './event-attendance-statistics'
import eventAttendanceClassify from './event-attendance-classify'
import eventAttendanceDetail from './event-attendance-detail'

export default {
  components: {
    eventAttendanceStatistics,
    eventAttendanceClassify,
    eventAttendanceDetail
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
