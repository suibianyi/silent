<template>
  <div class="swipe">
    <van-swipe style="height: 200px;border-radius: 10px;" :autoplay="swipeAutoplay">
      <van-swipe-item v-for="(image, index) in swipeList" :key="index" @click="switchPic(image)">
        <van-image :src="image.imageUrl" fit="cover" />
      </van-swipe-item>
    </van-swipe>
  </div>
</template>

<script>
export default {
  props: {
    id: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
    }
  },
  computed: {
    swipeList() {
      const temp = this.$store.getters.swipe[this.id]
      console.log('这里拿到的swipe', temp ? temp.swipeList : this.$store.getters.swipe.default.swipeList)
      return temp ? temp.swipeList : this.$store.getters.swipe.default.swipeList
    },
    swipeAutoplay() {
      const temp = this.$store.getters.swipe[this.id]
      console.log('这里拿到的swipeAutoplay', temp ? temp.swipeAutoplay : this.$store.getters.swipe.default.swipeAutoplay)
      return temp ? temp.swipeAutoplay : this.$store.getters.swipe.default.swipeAutoplay
    }
  },
  mounted() {
  },
  methods: {
    switchPic(image) {
      if (image.page) {
        this.$store.dispatch('setCurrentPage', { page: image.page })
        this.$store.commit('SET_REFERENCE', image)
        this.$store.commit('ADD_PAGE_STORE', { pageStoreName: this.$store.getters.currentPage, pageStoreData: image })
      }
    }
  }

}
</script>

<style lang='scss' scoped>
.swipe {
    padding: 10px 10px 0px 10px;
}
</style>
