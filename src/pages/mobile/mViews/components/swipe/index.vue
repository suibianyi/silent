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
  data() {
    return {
    }
  },
  computed: {
    swipeList() {
      return this.$store.getters.swipeList
    },
    swipeAutoplay() {
      return this.$store.getters.swipeAutoplay
    }
  },
  mounted() {
  },
  methods: {
    switchPic(image) {
      if (image.page) {
        this.$store.dispatch('setCurrentPage', { page: image.page })
        this.$store.commit('SET_REFERENCE', image)
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
