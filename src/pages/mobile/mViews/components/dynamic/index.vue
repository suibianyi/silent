<template>
  <div class="dynamic">
    <van-list
      v-model="dynamic.loading"
      :finished="dynamic.finished"
      finished-text="没有更多了"
      @load="onLoad"
    >
      <van-card v-for="(value,index) in dynamic.dynamicList" :key="value.title+index" :title="value.title" :desc="value.desc" :thumb="value.thumb"
                @click="switchPic(value)"
      />
    </van-list>
  </div>
</template>

<script>
export default {
  data() {
    return {

    }
  },
  computed: {
    dynamic() {
      console.log('dynamic是', this.$store.getters.dynamic)
      return this.$store.getters.dynamic
    }
  },
  mounted() {
  },
  methods: {
    onLoad() {
      this.$store.dispatch('loadDynamic')
    },
    switchPic(value) {
      if (value.page) {
        this.$store.commit('SET_REFERENCE', value)
        this.$store.dispatch('setCurrentPage', { page: value.page })
      } else if (this.$store.getters.dynamic.dynamicJumpPage.page !== '') {
        this.$store.commit('SET_REFERENCE', value)
        this.$store.dispatch('setCurrentPage', { page: this.$store.getters.dynamic.dynamicJumpPage.page })
      }
    }
  }

}
</script>

<style lang='scss' scoped>
.dynamic {
    padding: 10px 10px 0px 10px;
}
</style>
