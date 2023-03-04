<template>
  <div class="children-list">
    <div class="main-bg" />
    <div class="title">{{ title }}</div>
    <div class="children-main">
      <div v-for="(item, index) in children" :key="index" class="childItem" :class="item._id === childId ? 'choose' : ''" @click="chooseSchool(item)">
        <img class="child-headImage" :src="getHeadImageUrl(item.headImageUrl)" alt="">
        <div class="child-name">{{ item.trueName }}</div>
      </div>
    </div>
    <div class="confirm-button">
      <van-button class="button" type="info" color="#736adb" @click="confirm">确认</van-button>
    </div>
  </div>
</template>

<script>
import student from '@/assets/mobile/login/student.png'

export default {
  name: 'MLogin',
  data() {
    return {
      title: '选择孩子',
      childId: '',
      chooseChild: {}
    }
  },
  computed: {
    children() {
      return this.$store.getters.children
    }
  },
  watch: {
  },
  mounted() {
    if (this.$store.state.storage.userInfo) {
      this.$store.dispatch('getInfo')
    }
  },
  methods: {
    getHeadImageUrl(headImageUrl) {
      return headImageUrl || student
    },
    changeLoginPage(page) {
      console.log('跳转页面', page)
      this.$store.commit('SET_LOGINPAGE', page)
    },
    async chooseSchool(item) {
      this.childId = item._id
      this.chooseChild = item
    },
    async confirm() {
      this.$store.commit('SET_USERCHILD', this.chooseChild)
      this.$store.dispatch('setCurrentPage', { page: 'home' })
    }
  }
}
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg: #283443;
$light_gray: #fff;
$cursor: #000000;
.children-list {
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  .main-bg {
    width: 100%;
    height: 44%;
    position: absolute;
    border-radius: 0 0 50% 50% / 0 0 15% 15%;
    top: 0;
    z-index: -1;
    background: linear-gradient(-90deg, #736ADB 0%, #897FFC 100%);
  }
  .return-bg {
    top: 2%;
    left: 2%;
    width: 22px;
    height: 22px;
    z-index: 2;
    position: absolute;
  }
  .title {
    width: 100%;
    height: 50px;
    line-height: 50px;
    font-size: 20px;
    text-align: center;
    z-index: 1;
    color: #fff;
  }
  .children-main {
    width: 90%;
    height: 70%;
    margin-top: 10%;
    border-radius: 10px;
    background: #fff;
    box-shadow: 0px 8px 10px 2px rgba(0, 0, 0, 0.3);
    display: flex;
    flex-direction: column;
    align-items: center;
    overflow: auto;
    padding-top: 10px;
    .childItem {
      width: 120px;
      height: 140px;
      font-size: 18px;
      font-weight: 400;
      margin: 20px;
      text-align: center;
      .child-name {
        width: 120px;
        height: 40px;
        text-align: center;
      }
      .child-headImage {
        border-radius: 50px;
        width: 100px;
        height: 100px;
      }
    }
    .choose {
      border: 2px solid #736ADB;
      background: rgb(239, 243, 254);
    }
  }
  .confirm-button {
    width: 100%;
    margin-top: 10%;
    display: flex;
    justify-content: center;
    align-content: center;
    .button {
      width: 90%;
      margin: 3% 0;
      border-radius: 20px
    }
  }
}
</style>
