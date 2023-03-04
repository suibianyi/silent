<template>
  <div class="my-head">
    <div class="header-image">
      <van-image
        height="200px"
        fit="fill"
        :src="myHead.myHeadBackground"
      />
      <!-- <img class="img-class" :src="myHeadBackground"> -->
    </div>
    <div class="header-user">
      <van-image
        round
        width="88px"
        height="88px"
        fit="fill"
        :src="myHead.avatar"
      />
      <div class="head-name">
        {{ myHead.name }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {}
  },
  computed: {
    myHead() {
      console.log('myHead', this.$store.getters.myHead)
      return this.$store.getters.myHead
    },
    userName() {
      return '林旻'
    }
  },
  mounted() {
  },
  methods: {
    switchCell(value) {
      if (value.page) {
        this.$store.dispatch('setCurrentPage', { page: value.page })
      }
    }
  }

}
</script>

<style lang='scss' scoped>
.my-head {
    padding: 0px 0px 0px 0px;
    height: 200px;
    position: relative;
    .header-image {
        height: 200px;
        width: 100%;
        position: absolute;
        left: 0px;
        top: 0px;
        .img-class {
          object-fit:cover;
          max-height: 100%;
          max-width: 100%;
        }
    }
    .header-user {
        display: flex;
        height: 120px;
        align-items: center;
        position: absolute;
        left: 15px;
        top: 82px;
        .head-name {
            color: #ffffff;
            margin-left: 20px;
            font-size: 35px;
        }
    }
}
</style>
