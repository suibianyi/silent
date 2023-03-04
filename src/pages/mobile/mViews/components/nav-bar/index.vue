<template>
  <div class="nav-bar">
    <van-nav-bar :title="navBar.navBarTitle" left-text="返回" left-arrow :right-text="navBar.navBarRight&&navBar.navBarRight.text" @click-left="onClickLeft" @click-right="onClickRight">
      <template #right>
        <!-- <van-icon name="search" size="18" /> -->
      </template>
    </van-nav-bar>
  </div>
</template>

<script>
export default {
  data() {
    return {
    }
  },
  computed: {
    navBar() {
      console.log('这里拿到的navbar', this.$store.getters.navBar)
      return this.$store.getters.navBar
    }
  },
  mounted() {
  },
  methods: {
    onClickLeft() {
      this.$store.dispatch('backNav')
    },
    onClickRight() {
      if (this.$store.getters.navBar.navBarRight && this.$store.getters.navBar.navBarRight.page && this.$store.getters.navBar.navBarRight.page !== '') {
        this.$store.dispatch('setCurrentPage', { page: this.$store.getters.navBar.navBarRight.page })
      }
      if (this.$store.getters.navBar.navBarRight && this.$store.getters.navBar.navBarRight.func && this.$store.getters.navBar.navBarRight.func !== '') {
        console.log('执行func')
        this.$store.dispatch(`${this.$store.getters.navBar.navBarRight.func.method}`, { func: this.$store.getters.navBar.navBarRight.func })
      }
    }
  }

}
</script>

<style lang='scss' scoped>
.nav-bar {
    padding: 0px 0px 0px 0px;
}
</style>
