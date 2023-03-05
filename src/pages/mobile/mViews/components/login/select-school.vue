<template>
  <div class="school-select">
    <div class="muse-logo" @click="comboPoint()">
      <img class="logo" src="@/assets/mobile/login/logo.png" alt="">
      <div>{{ platformName }}</div>
    </div>
    <div class="school-main">
      <div class="school-search">
        <van-search v-model="search" class="vant-search" placeholder="请输入校区名称" @search="onSearch" @cancel="onCancel" />
      </div>
      <div class="school-list">
        <van-picker
          class="vant-select"
          title="标题"
          :show-toolbar="false"
          value-key="schoolName"
          :default-index="0"
          :columns="schoolList"
          @change="chooseSchool"
        />
      </div>
    </div>
    <div class="login-button">
      <van-button class="button" type="info" color="#736adb" @click="confirm">确认</van-button>
    </div>
  </div>
</template>

<script>

export default {
  name: 'MLogin',
  data() {
    return {
      search: '',
      platformName: '智慧校园物联管理平台',
      schoolType: '',
      searchName: '',
      status: '',
      schoolCode: '',
      url: window.document.location.href,
      timer: null,	// 定时器
      waitTime: 300,	// 允许间隔时间（单位：ms）
      numClick: 0,	// 连击累计次数
      lastTime: new Date().getTime(), // 上次点击时间
      authFlag: false
    }
  },
  computed: {
    schoolList() {
      return this.$store.getters.schoolList
    }
  },
  watch: {
    async search(val) {
      console.log('搜索', val)
      await this.$store.dispatch('getSchoolList', {
        schoolType: this.schoolType,
        searchName: val,
        status: this.status
      })
      this.schoolCode = this.schoolList[0] && this.schoolList[0].schoolCode
    }
  },
  async mounted() {
    await this.$store.dispatch('getSchoolList', {
      schoolType: this.schoolType,
      searchName: this.searchName,
      status: this.status
    })
    this.schoolCode = this.schoolList[0] && this.schoolList[0].schoolCode
    this.authFlag = this.$store.state.login.authFlag
  },
  methods: {
    comboPoint() {
      console.log('点击了', this.numClick)
      const currTime = new Date().getTime() // 当前点击时间
      this.numClick = (currTime - this.lastTime) <= this.waitTime ? this.numClick++ : 1
      console.log('点击了2', (currTime - this.lastTime) <= this.waitTime ? this.numClick++ : 1)
      this.lastTime = currTime
      clearTimeout(this.timer)
      const _this = this
      this.timer = setTimeout(function() {
        clearTimeout(_this.timer)
        // 处理点击事件
        if (_this.numClick > 4) {
          // 连续点击五次或者五次以上的点击事件
          console.log('点击超过4次了')
          _this.authFlag = true
        }
      }, _this.waitTime)
    },
    chooseSchool(item, value, index) {
      console.log('选中的item', item)
      console.log('选中的value', value)
      console.log('选中的index', index)
      this.schoolCode = value.schoolCode
    },
    onSearch(val) {
      console.log('data', val)
    },
    async confirm() {
      console.log('跳转', this.schoolCode)
      if (this.$store.getters.mode === 'editor') {
        this.authFlag = true
      }
      this.$store.commit('SET_USERSCHOOL', this.schoolCode)
      if (this.authFlag) {
        this.$store.commit('SET_LOGINPAGE', 'home')
      } else {
        await this.$store.dispatch('webAuthentication')
      }
    },
    onCancel() {
      console.log('取消')
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
.school-select {
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
  .school-main {
    width: 75%;
    height: 48%;
    margin-top: 6%;
    .school-search {
      width: 100%;
      height: 15%;
      line-height: 100%;
      text-align: center;
      overflow: hidden;
      border-radius: 20px 20px 0 0;
      .vant-search {
        width: 100%;
        height: 100%;
      }
    }
    .school-list {
      width: 100%;
      min-height: 85%;
      height: 85%;
      display: flex;
      flex-direction: column;
      align-items: center;
      overflow: hidden;
      border-radius: 0 0 20px 20px;
      .vant-select {
        width: 100%;
        height: 90%;
      }
    }
  }
  .login-button {
    margin-top: 2%;
    width: 80%;
    display: flex;
    justify-content: center;
    align-content: center;
    .button {
      width: 90%;
      margin: 8% 0;
      border-radius: 20px
    }
  }
}
</style>
