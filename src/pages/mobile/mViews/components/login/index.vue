<template>
  <div class="login">
    <component :is="page" />
  </div>
</template>

<script>
import home from './home'
import resetPassword from './reset-password'
import schoolList from './school-list'
import selectSchool from './select-school'

export default {
  components: {
    home,
    resetPassword,
    schoolList,
    selectSchool
  },
  data() {
    return {
    }
  },
  computed: {
    page() {
      return this.$store.state.login.loginPage
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
.login{
  width: 100%;
  height: 100vh;
}
</style>
