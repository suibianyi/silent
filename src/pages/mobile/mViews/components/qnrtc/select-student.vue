<template>
  <div class="cell">
    <van-nav-bar title="选择孩子" left-text="返回" left-arrow @click-left="onClickLeft" />
    <van-cell-group>
      <van-cell v-for="value in cellList" :key="value.trueName" :title="value.trueName" :icon="value.icon" is-link size="large"
                @click="switchCell(value)" />
    </van-cell-group>
  </div>
</template>

<script>

export default {
  data() {
    return {
      cellList: []
    }
  },
  // computed: {
  //   cellList() {
  //     console.log('cellList是', this.$store.getters.cellList)
  //     return this.$store.getters.cellList
  //   }
  // },
  mounted() {
    console.log('这里存的东西是', this.$store.getters.storage)
    this.cellList = this.$store.getters.storage.children
  },
  methods: {
    onClickLeft() {
      this.$store.dispatch('backNav')
    },
    switchCell(s) {
      const data = {
        sid: s.personNo,
        schoolCode: this.$store.getters.storage.schoolCode,
        userType: this.$store.getters.storage.type,
        account: this.$store.getters.storage.userInfo.telephone,
        sName: s.trueName,
        classId: s.orgClassName
      }
      this.$store.commit('SET_QNRTCSTUDENT', data)
      this.$store.commit('SET_QNRTCPAGE', 'select-mode')
    }
  }

}
</script>

<style lang='scss' scoped>
.cell {
    padding: 0px 0px 0px 0px;
}
</style>
