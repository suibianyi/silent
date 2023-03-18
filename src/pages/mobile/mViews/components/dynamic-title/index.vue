<template>
  <div class="dynamic-title">
    <div class="content">
      <div class="left">
        <div class="icon" />
        <div class="left-text">
          {{ dynamicTitle.leftText }}
        </div>
      </div>
      <div class="right" @click="switchIt(dynamicTitle)">
        {{ dynamicTitle.rightText }}
      </div>
    </div>
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
    dynamicTitle() {
      console.log('这里拿到的dynamicTitle', this.$store.getters.dynamicTitle[this.id] || this.$store.getters.dynamicTitle.default)
      return this.$store.getters.dynamicTitle[this.id] || this.$store.getters.dynamicTitle.default
      // console.log('查看dynamicTitle', this.$store.getters.dynamicTitle)
      // return this.$store.getters.dynamicTitle
    }
  },
  mounted() {
  },
  methods: {
    switchIt(value) {
      if (value.page && value.page !== '') {
        this.$store.dispatch('setCurrentPage', { page: value.page })
      } else {
        this.$store.dispatch('handelAction', value.action)
      }
    }
  }

}
</script>

<style lang='scss' scoped>
.dynamic-title {
    padding: 10px 10px 0px 10px;
    .content {
      display: flex;
      justify-content: space-between;
      height: 26px;
      .left {
        display: flex;
        align-items: center;
        margin-left: 3px;
        height: 90%;
        .icon {
          width: 7px;
          height: 100%;
          background: #7669f7;
          margin-right: 6px;
        }
        .left-text {
          font-size: 18px;
          line-height: 26px;
        }
      }
      .right {
        line-height: 30px;
        color: #a0a0a0;
        margin-right: 10px;
        font-size: 16px;
      }
    }
}
</style>
