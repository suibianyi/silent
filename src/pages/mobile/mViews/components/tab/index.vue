<template>
  <div class="tab">
    <van-tabs v-model="active">
      <van-tab v-for="value in tab.tabList" :key="value.title" :title="value.title" />
    </van-tabs>
  </div>
</template>

<script>
import _ from 'lodash'
export default {
  props: {
    id: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      active: this.$store.getters.storage.reference.tabActive || 0
    }
  },
  computed: {
    tab() {
      console.log('这里拿到的tab', this.$store.getters.tab[this.id] || this.$store.getters.tab.default)
      return this.$store.getters.tab[this.id] || this.$store.getters.tab.default
      // console.log('tab:', this.$store.getters.tab)
      // return this.$store.getters.tab
    }
  },
  watch: {
    active: {
      handler(newVal) {
        if (this.$store.getters.tab[this.id].tabList.length) {
          const data = _.assign(this.$store.state.storage.reference, { tab: this.$store.getters.tab[this.id].tabList[this.active].value, tabActive: newVal })
          this.$store.commit('SET_REFERENCE', data)
          this.$store.commit('ADD_PAGE_STORE', { pageStoreName: this.$store.getters.currentPage, pageStoreData: data })
          this.$store.dispatch('refreshPage')
        }
      },
      deep: true,
      immediate: true
    }
  },
  mounted() {
  },
  methods: {

  }

}
</script>

<style lang='scss' scoped>
.tab {
    padding: 0px 10px 0px 10px;
}
</style>
