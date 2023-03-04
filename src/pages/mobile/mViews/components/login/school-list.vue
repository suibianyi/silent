<template>
  <div class="school-list">
    <div class="main-bg" />
    <div class="title">{{ title }}</div>
    <img class="return-bg" src="@/assets/mobile/login/return.svg" alt="" @click="changeLoginPage('home')">
    <div class="schools-main">
      <div v-for="(item, index) in userSchools" :key="index" class="schoolItem" :class="item.id === school ? 'choose' : ''" @click="chooseSchool(item)">
        {{ item.name }}
      </div>
    </div>
    <div class="login-button">
      <van-button class="button" type="info" color="#736adb" @click="login">确认</van-button>
    </div>
  </div>
</template>

<script>

export default {
  name: 'MLogin',
  data() {
    return {
      title: '校区选择',
      school: ''
    }
  },
  computed: {
    userSchools() {
      return this.$store.getters.userSchools
    }
  },
  watch: {
  },
  mounted() {
  },
  methods: {
    changeLoginPage(page) {
      console.log('跳转页面', page)
      this.$store.commit('SET_LOGINPAGE', page)
    },
    async chooseSchool(item) {
      this.school = item.id
      this.$store.commit('SET_USERSCHOOL', item.id)
    },
    async login() {
      const { loginForm } = this.$store.state.storage
      await this.$store.dispatch('mobileLogin', {
        type: loginForm.type,
        account: loginForm.account,
        password: loginForm.password,
        school: this.$store.state.storage.schoolCode
      })
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
.school-list {
  width: 100%;
  height: 100%;
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
  .schools-main {
    width: 90%;
    min-height: 65%;
    height: 65%;
    margin-top: 10%;
    border-radius: 10px;
    background: #fff;
    box-shadow: 0px 8px 10px 2px rgba(0, 0, 0, 0.3);
    display: flex;
    flex-direction: column;
    align-items: center;
    overflow: auto;
    padding-top: 10px;
    .schoolItem {
      width: 90%;
      height: 60px;
      line-height: 60px;
      font-size: 18px;
      font-weight: 400;
      text-align: center;
      padding: 0 20px;
      margin-bottom: 10px;
      border-radius: 10px;
      background: #F2F2F2;
    }
    .choose {
      border: 2px solid #736ADB;
      background: rgb(239, 243, 254);
    }
  }
  .login-button {
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
