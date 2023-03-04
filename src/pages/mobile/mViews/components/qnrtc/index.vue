<template>
  <div class="qnrtc-index">
    <component :is="page" />
  </div>
</template>

<script>
import selectStudent from './select-student'
import selectMode from './select-mode'
import videoPage from './video'
import audioPage from './audio'

export default {
  components: {
    selectStudent,
    selectMode,
    videoPage,
    audioPage
  },
  data() {
    return {
    }
  },
  computed: {
    page() {
      return this.$store.state.qnrtc.qnrtcPage
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
.qnrtc-index{
  width: 100%;
  height: 100vh;
}
</style>
