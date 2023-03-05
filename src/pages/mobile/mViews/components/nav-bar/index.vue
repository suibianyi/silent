<template>
  <div class="nav-bar">
    <van-nav-bar :style="{'background':navBar.navBarBackgroundColor,'--titleColor': navBar.navBarTitleColor,'--fontColor': navBar.navBarTextColor}" :title="navBar.navBarTitle" left-text="返回" left-arrow :right-text="navBar.navBarRight&&navBar.navBarRight.text" @click-left="onClickLeft" @click-right="onClickRight">
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
      console.log('在navbar', this.$store.getters.navBar.navBarRight)
      if (this.$store.getters.navBar.navBarRight && this.$store.getters.navBar.navBarRight.func && this.$store.getters.navBar.navBarRight.func !== '') {
        console.log('执行func')
        this.$store.dispatch(`${this.$store.getters.navBar.navBarRight.func.method}`, { func: this.$store.getters.navBar.navBarRight.func })
      }
      if (this.$store.getters.navBar.navBarRight && this.$store.getters.navBar.navBarRight.req && this.$store.getters.navBar.navBarRight.req !== '') {
        console.log('执行req')
        this.$store.dispatch('sendRequest', { request: this.$store.getters.navBar.navBarRight.req })
      }
    }
  }

}
</script>

<style lang='scss' scoped>
.nav-bar {
    padding: 0px 0px 0px 0px;
    /deep/ .van-nav-bar__title{
    color: var(--titleColor) !important;
    }
    /deep/ .van-nav-bar .van-icon {
    color: var(--fontColor) !important;

    }
    /deep/ .van-nav-bar__text {
    color: var(--fontColor) !important;
}
}
</style>
