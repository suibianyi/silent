<template>
  <div class="login-container">
    <div class="muse-logo">
      <img class="logo" src="@/assets/mobile/login/logo.png" alt="">
      <div>{{ platformName }}</div>
    </div>
    <div class="login-main">
      <div class="main-select">
        <van-radio-group v-model="checked" direction="horizontal">
          <van-radio name="teacher" checked-color="#736adb">老师</van-radio>
          <van-radio name="student" checked-color="#736adb">学生</van-radio>
          <van-radio name="parent" checked-color="#736adb">家长</van-radio>
        </van-radio-group>
      </div>
      <div class="main-input">
        <div class="input-item">
          <img class="input-icon" src="@/assets/mobile/login/account.svg" alt="">
          <input v-model="account" autocomplete="off" placeholder="请输入账号" class="input" type="text">
        </div>
        <div class="input-item">
          <img class="input-icon" src="@/assets/mobile/login/password.svg" alt="">
          <input v-model="password" autocomplete="off" placeholder="请输入密码" class="input" type="password">
        </div>
      </div>
      <div class="login-button">
        <van-button class="button" type="info" color="#736adb" @click="login">登录</van-button>
      </div>
      <div class="forget-password" @click="changeLoginPage">
        <span>忘记密码？</span>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'MLogin',
  data() {
    return {
      checked: 'teacher',
      account: '',
      password: '',
      schoolName: '',
      loading: false,
      passwordType: 'text',
      redirect: undefined,
      screenHeight: document.documentElement.clientHeight,
      isShow: false,
      successRange: '',
      platformName: '智慧校园物联管理平台',
      version: '',
      url: window.document.location.href
    }
  },
  computed: {
    scale() {
      const rateWidth = window.innerWidth / 750
      const rateHeight = window.innerHeight / 1080
      console.log('屏幕宽度:', window.innerWidth)
      console.log('屏幕高度:', window.innerHeight)
      console.log('缩放比例', rateWidth, rateHeight)
      return { rateWidth, rateHeight }
    }
  },
  watch: {
    password(val) {
      console.log('val密码', val)
      if (val.length) {
        this.passwordType = 'text'
      }
    },
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    },
    screenHeight: {
      handler(oldVal, newVal) {
        console.log('oldVal', oldVal)
        console.log('newVal', newVal)
      }
    }
  },
  async mounted() {
    console.log('123', this.$store.state.settings.tabbarList)
    console.log('123', this.$store)
    // publicAppid
    // this.$store.commit('SET_SETTINGs', [
    //   {
    //     pagePath: '../../pages/home/home',
    //     iconPath: '../../static/images/school.png',
    //     selectedIconPath: '../../static/images/school_h.png',
    //     text: '校园'
    //   },
    //   {
    //     pagePath: '../../pages/admin-class-home/admin-class-home',
    //     iconPath: '../../static/images/class.png',
    //     selectedIconPath: '../../static/images/class_h.png',
    //     text: '班级'
    //   },
    //   {
    //     pagePath: '../../pages/admin-personal-center/admin-personal-center',
    //     iconPath: '../../static/images/my.png',
    //     selectedIconPath: '../../static/images/my_h.png',
    //     text: '我的'
    //   }
    // ])

    console.log('234', this.$store.state.settings.tabbarList)
  },
  methods: {
    changePage() {
      window.location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx7cc32da6ee7bd7c6&redirect_uri=http%3A%2F%2Fmuse.tunnel.platoedu.net%2Fmobile%2Flogin&response_type=code&scope=snsapi_base&state=1#wechat_redirect'
    },
    changeLoginPage() {
      this.$store.commit('SET_LOGINPAGE', 'reset-password')
    },
    changeType(value) {
      this.$nextTick(() => {
        console.log('获取到了焦点', value)
        this.passwordType = value
      })
    },
    async login() {
      if (this.account === '') {
        this.$Notify({ type: 'warning', message: '请输入账号' })
        return
      }
      if (this.password === '') {
        this.$Notify({ type: 'warning', message: '请输入密码' })
        return
      }
      this.$store.commit('SET_LOGINFORM', {
        type: this.checked,
        account: this.account,
        password: this.password,
        school: this.$store.state.storage.schoolCode
      })
      await this.$store.dispatch('mobileLogin', {
        type: this.checked,
        account: this.account,
        password: this.password,
        school: this.$store.state.storage.schoolCode
      })
    },
    async platform() {
      if (!this.$store.state.user.platform.platformName) {
        await this.$store.dispatch('user/platform', this.$store.state.user.school.id)
      }
      this.platformName = this.$store.state.user.platform.platformName
    },
    async handleLogin() {
      this.isShow = true
    },
    // 获取cookie
    getCookie: function(key) {
      if (document.cookie.length > 0) {
        var start = document.cookie.indexOf(key + '=')
        if (start !== -1) {
          start = start + key.length + 1
          var end = document.cookie.indexOf(';', start)
          if (end === -1) end = document.cookie.length
          return unescape(document.cookie.substring(start, end))
        }
      }
      return ''
    },
    // 保存cookie
    setCookie: function(cName, value, expiredays) {
      var exdate = new Date()
      exdate.setDate(exdate.getDate() + expiredays)
      document.cookie = cName + '=' + decodeURIComponent(value) +
            ((expiredays == null) ? '' : ';expires=' + exdate.toGMTString())
    },
    // 用户通过了验证
    async success(msg, next) {
      console.log('验证码验证成功', msg, next)
      if (msg) {
        const valid = await this.$refs.loginForm.validate().catch(() => {})
        if (valid) {
          try {
            this.loading = true
            await this.$store.dispatch('user/login', this.loginForm)
            this.$router.push({ path: '/' })
            this.setUserInfo()
          } catch (e) {
            console.log('eee', e)
            // this.$message.error(e)
          } finally {
            this.loading = false
          }
        }
      } else {
        this.$message({
          showClose: true,
          message: `验证失败`,
          type: 'error',
          duration: 2000
        })
      }
      this.isShow = false // 通过验证后，需要手动隐藏模态框
    },
    // 用户点击遮罩层，应该关闭模态框
    close() {
      this.isShow = false
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
.login-container {
  width: 100%;
  height: 100%;
  background-size: 100% 100% !important;
  background: url('~@/assets/mobile/login/login-bg.png');
  display: flex;
  flex-direction: column;
  align-items: center;
  .muse-logo {
    width: 75%;
    height: 25%;
    margin-top: 14.2%;
    display: flex;
    flex-direction: column;
    align-items: center;
    color: #fff;
    font-size: 18px;
    .logo {
      width: 100px;
      height: 100px;
    }
  }
  .login-main {
    width: 75%;
    height: 25%;
    margin-top: 5.3%;
    .main-select {
      width: 100%;
      height: 30%;
      margin-top: 8%;
      display: flex;
      font-size: 15px;
      justify-content: center;
    }
    .main-input {
      width: 100%;
      font-size: 15px;
      color: #444444;
      display: flex;
      flex-direction: column;
      align-items: center;
      .input-item {
        width: 90%;
        height: 50px;
        margin-top: 3%;
        display: flex;
        align-items: center;
        border-radius: 15px;
        background-color: #F5F5F5;
        .input-icon {
          width: 20px;
          height: 20px;
          margin: 0 10px;
        }
        .input {
          width: 80%;
          height: 100%;
          border: 0px;
          border-radius: 15px;
          background-color: #F5F5F5;
        }
      }
    }
    .login-button {
      width: 100%;
      display: flex;
      justify-content: center;
      align-content: center;
      .button {
        width: 90%;
        margin: 8% 0;
        border-radius: 20px
      }
    }
    .forget-password {
      width: 100%;
      display: flex;
      justify-content: flex-end;
      align-content: center;
      color: #333333;
      font-size: 15px;
    }
  }
}
</style>
