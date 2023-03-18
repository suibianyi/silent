<template>
  <div class="dynamic-1">
    <van-list
      v-model="dynamic.loading"
      :finished="dynamic.finished"
      finished-text="没有更多了"
      @load="onLoad"
    >
      <div v-for="(value,index) in dynamic.dynamicList" :key="value.title+index" @click="switchPic(value)">
        <div class="time">
          {{ value.updateTime }}
        </div>
        <div class="content">
          <div v-if="value.thumb" class="picture">
            <van-image
              fit="fill"
              width="100%"
              height="160"
              :src="value.thumb"
            />
          </div>
          <div class="text">
            <div class="title">
              {{ value.title }}
            </div>
            <div class="desc">
              {{ value.desc }}
            </div>
          </div>
        </div>
      </div>
    </van-list>
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
    return {}
  },
  computed: {
    dynamic() {
      console.log('这里拿到的dynamic', this.$store.getters.dynamic[this.id] || this.$store.getters.dynamic.default)
      return this.$store.getters.dynamic[this.id] || this.$store.getters.dynamic.default
    }
  },
  mounted() {
  },
  methods: {
    onLoad() {
      this.$store.dispatch('loadDynamic', { id: this.id })
    },
    switchPic(value) {
      if (value.page) {
        this.$store.commit('ADD_PAGE_STORE', { pageStoreName: this.$store.getters.currentPage, pageStoreData: value })
        this.$store.commit('SET_REFERENCE', value)
        this.$store.dispatch('setCurrentPage', { page: value.page })
      } else if (this.$store.getters.dynamic[this.id].dynamicJumpPage.page !== '') {
        this.$store.commit('ADD_PAGE_STORE', { pageStoreName: this.$store.getters.currentPage, pageStoreData: value })
        this.$store.commit('SET_REFERENCE', value)
        this.$store.dispatch('setCurrentPage', { page: this.$store.getters.dynamic[this.id].dynamicJumpPage.page })
      } else {
        this.$store.dispatch('handelAction', value.action)
      }
    }
  }

}
</script>

<style lang='scss' scoped>
.dynamic-1 {
    margin: 10px 15px 0px 15px;
    .time {
        text-align: center;
        color: #A0A0A0;
        height: 60px;
        font-size: 16px;
        line-height: 60px;
    }
    .content {
        border-radius: 10px;
        margin-bottom: 10px;
        box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
        .picture {
            width: 100%;
            height: 160px;
        }
        .text {
            padding: 23px;
            .title {
                font-size: 30px;
                color: #000;
            }
            .desc {
                margin-top: 10px;
                color: #828282;
            }
        }
    }
}
</style>
