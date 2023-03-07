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
    gridList() {
      const temp = this.$store.getters.grid[this.id] || this.$store.getters.grid.default
      return temp.gridList.filter((item) => {
        if (item.auth && item.auth.length > 0) {
          console.log('判断权限的结果是', judgeAuth(item.auth, this.$store.getters.storage.auths))
          return judgeAuth(item.auth, this.$store.getters.storage.auths)
        }
        return true
      })
    },
    gridColumnNum() {
      const temp = this.$store.getters.grid[this.id]
      console.log('grid123456789', this.$store.getters.grid.default)
      return temp ? temp.gridColumnNum : this.$store.getters.grid.default.gridColumnNum
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
