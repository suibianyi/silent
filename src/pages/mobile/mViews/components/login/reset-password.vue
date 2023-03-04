<template>
  <div class="register-container">
    <div class="main-bg" />
    <div class="title">{{ title }}</div>
    <img class="return-bg" src="@/assets/mobile/login/return.svg" alt="" @click="changeLoginPage('home')">
    <div class="register-main">
      <div class="main-select">
        <van-radio-group v-model="checked" direction="horizontal">
          <van-radio name="teacher" checked-color="#736adb">老师</van-radio>
          <van-radio name="student" checked-color="#736adb">学生</van-radio>
          <van-radio name="parent" checked-color="#736adb">家长</van-radio>
        </van-radio-group>
      </div>
      <van-cell-group>
        <van-field v-if="checked!=='parent'" v-model="account" class="field-item" placeholder="请输入用户名">
          <img slot="left-icon" class="field-icon" src="@/assets/mobile/login/account.svg" alt="">
          <van-icon v-if="account" slot="right-icon" name="cross" @click="account=''" />
        </van-field>
        <van-field v-model="telephone" class="field-item" placeholder="请输入手机号">
          <img slot="left-icon" class="field-icon" src="@/assets/mobile/login/mobile.svg" alt="">
          <van-icon v-if="telephone" slot="right-icon" name="cross" @click="telephone=''" />
        </van-field>
        <van-field v-model="code" class="field-item" placeholder="请输入验证码">
          <img slot="left-icon" class="field-icon" src="@/assets/mobile/login/email.svg" alt="">
          <van-button slot="right-icon" class="field-code" size="mini" type="default">获取验证码</van-button>
        </van-field>
        <van-field v-model="password" class="field-item" type="password" placeholder="请输入新密码">
          <img slot="left-icon" class="field-icon" src="@/assets/mobile/login/password.svg" alt="">
          <van-icon v-if="password" slot="right-icon" name="eye" />
        </van-field>
        <van-field v-model="confirmPassword" class="field-item" type="password" placeholder="请再次输入新密码">
          <img slot="left-icon" class="field-icon" src="@/assets/mobile/login/password.svg" alt="">
          <van-icon v-if="confirmPassword" slot="right-icon" name="eye" />
        </van-field>
      </van-cell-group>
      <div class="login-button">
        <van-button class="button" type="info" color="#736adb">登录</van-button>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'MLogin',
  data() {
    return {
      title: '重置密码',
      checked: 'teacher',
      account: '',
      telephone: '',
      code: '',
      password: '',
      confirmPassword: '',
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
    checked(val) {
      console.log('val密码', val)
      if (val.length) {
        this.passwordType = 'text'
      }
    },
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
  mounted() {
    console.log('123', this.$store.state.settings.tabbarList)
    console.log('123', this.$store)
    this.$store.commit('SET_SETTINGs', [
      {
        pagePath: '../../pages/home/home',
        iconPath: '../../static/images/school.png',
        selectedIconPath: '../../static/images/school_h.png',
        text: '校园'
      },
      {
        pagePath: '../../pages/admin-class-home/admin-class-home',
        iconPath: '../../static/images/class.png',
        selectedIconPath: '../../static/images/class_h.png',
        text: '班级'
      },
      {
        pagePath: '../../pages/admin-personal-center/admin-personal-center',
        iconPath: '../../static/images/my.png',
        selectedIconPath: '../../static/images/my_h.png',
        text: '我的'
      }
    ])

    console.log('234', this.$store.state.settings.tabbarList)
  },
  methods: {
    changeLoginPage(page) {
      console.log('跳转页面', page)
      this.$store.commit('SET_LOGINPAGE', page)
    },
    changePage() {
      window.location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx7cc32da6ee7bd7c6&redirect_uri=http%3A%2F%2Fmuse.tunnel.platoedu.net%2Fmobile%2Flogin&response_type=code&scope=snsapi_base&state=1#wechat_redirect'
    },
    changeType(value) {
      this.$nextTick(() => {
        console.log('获取到了焦点', value)
        this.passwordType = value
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
.register-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  .main-bg {
    width: 100%;
    height: 44%;
    position: absolute;
    top: 0;
    z-index: -1;
    border-radius: 0 0 50% 50% / 0 0 15% 15%;
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
  .register-main {
    width: 90%;
    height: 60%;
    margin-top: 18%;
    border-radius: 10px;
    background: #fff;
    box-shadow: 0px 8px 10px 2px rgba(0, 0, 0, 0.3);
    display: flex;
    flex-direction: column;
    align-items: center;
    .main-select {
      width: 100%;
      height: 18%;
      margin-top: 5%;
      display: flex;
      font-size: 15px;
      justify-content: center;
    }
    .field-item {
      font-size: 15px;
    }
    .login-button {
      width: 100%;
      display: flex;
      justify-content: center;
      align-content: center;
      .button {
        width: 90%;
        margin: 3% 0;
        border-radius: 20px
      }
    }
    .field-icon {
      width: 20px;
      height: 20px;
      margin-right: 5px;
    }
  }
}
</style>
