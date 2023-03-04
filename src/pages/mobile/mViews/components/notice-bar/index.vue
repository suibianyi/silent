<template>
  <div class="notice-bar">
    <div class="notice-border" @click="clickNotice()">
      <van-notice-bar color="#cccccc" background="#ffffff" left-icon="volume-o" :scrollable="false" mode="link">
        <van-swipe
          vertical
          class="notice-swipe"
          :autoplay="3000"
          :show-indicators="false"
        >
          <van-swipe-item v-for="notice in noticeList" :key="notice.text">
            {{ notice.text }}
          </van-swipe-item>
        </van-swipe>
      </van-notice-bar>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
    }
  },
  computed: {
    noticeList() {
      return this.$store.getters.noticeList
    }
  },
  mounted() {
  },
  methods: {
    clickNotice() {
      const goto = this.$store.getters.noticeClick
      if (goto.page && goto.page !== '') {
        this.$store.dispatch('setCurrentPage', { page: goto.page })
      }
    }
  }

}
</script>

<style lang='scss' scoped>
.van-notice-bar {
    border-radius: 10px;
}
.notice-bar {
    padding: 10px 10px 0px 10px;
    .notice-border {
        border: 1px #e0e0e0 solid;
        border-radius: 10px;
        .notice-swipe {
            height: 40px;
            line-height: 40px;
        }
    }
}
</style>
