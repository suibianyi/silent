<template>
  <div class="cell">
    <van-cell-group>
      <van-cell v-for="value in cellList" :key="value.title" :title="value.title" :icon="value.icon" is-link size="large"
                @click="switchCell(value)" />
    </van-cell-group>
  </div>
</template>

<script>
export default {
  data() {
    return {}
  },
  computed: {
    cellList() {
      console.log('cellList是', this.$store.getters.cellList)
      return this.$store.getters.cellList
    }
  },
  mounted() {
  },
  methods: {
    switchCell(value) {
      if (value.page !== '') {
        this.$store.dispatch('setCurrentPage', { page: value.page })
      }
      if (value.func && value.func.method === 'dialog') {
        console.log('执行dialog')
        this.$store.dispatch('dialog', { func: value.func })
      }
    }
  }

}
</script>

<style lang='scss' scoped>
.cell {
    padding: 0px 0px 0px 0px;
}
</style>
