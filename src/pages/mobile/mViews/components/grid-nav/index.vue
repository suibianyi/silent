<template>
  <div class="grid-nav">
    <van-grid direction="vertical" :column-num="gridColumnNum" :border="false" :clickable="true" icon-size="52px">
      <van-grid-item v-for="value in gridList" :key="value.text" :icon="value.imageUrl" :text="value.text" @click="switchPic(value)" />
    </van-grid>
  </div>
</template>

<script>
import { judgeAuth } from '@/mUtils'
export default {
  data() {
    return {
    }
  },
  computed: {
    gridList() {
      return this.$store.getters.gridList.filter((item) => {
        if (item.auth && item.auth.length > 0) {
          console.log('判断权限的结果是', judgeAuth(item.auth, this.$store.getters.storage.auths))
          return judgeAuth(item.auth, this.$store.getters.storage.auths)
        }
        return true
      })
    },
    gridColumnNum() {
      return this.$store.getters.gridColumnNum
    }
  },
  mounted() {
  },
  methods: {
    switchPic(value) {
      if (value.page) {
        this.$store.dispatch('setCurrentPage', { page: value.page })
      }
    }
  }

}
</script>

<style lang='scss' scoped>
.grid-nav {
    padding: 0px 10px 0px 10px;
}
</style>
