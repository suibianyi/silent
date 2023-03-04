<template>
  <div class="chat-index">
    <component :is="page" />
  </div>
</template>

<script>
import selectStudent from './select-student'
import chat from './chat'
// import videoPage from './video'
// import audioPage from './audio'

export default {
  components: {
    selectStudent,
    chat
  },
  data() {
    return {
    }
  },
  computed: {
    page() {
      return this.$store.state.chat.chatPage
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
.chat-index{
  width: 100%;
  height: 100vh;
}
</style>
