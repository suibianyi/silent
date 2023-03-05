<template>
  <div ref="content" class="home-mode" :style="{
    'backgroundColor':`${backgroundColor}`}">
    <div v-for="(item, index) in components" :key="index" class="component-item">
      <component :is="item&&item.key"
                 v-if="item"
                 :config="item.config" />
    </div>
    <div v-if="includeTabbar" class="is-tabbar" />
    <van-dialog v-model="dialog.show" :title="dialog.title" show-cancel-button @confirm="confirmDialog(dialog)">
      <div :style="{
        'width': '100%',
        'height': `100px`,
        'text-align': 'center',
        'line-height': '100px'}"
      >
        {{ dialog.text }}
      </div>
    </van-dialog>
    <van-action-sheet
      v-model="actionSheet.show"
      :actions="actionSheet.actions"
      :cancel-text="actionSheet.cancelText"
      :description="actionSheet.description"
      close-on-click-action
      @select="actionSheetSelect"
    />
  </div>
</template>
<script>

import { parseSearchArgs } from '@/utils'

const files = require.context('./components', true, /index.vue$/)
const components = {}
// const matchReg = /(?<=\/).*?(?=\/)/g
const matchReg = /\.\/(.*)\/index\.vue$/
files.keys().forEach((key) => {
  const match = key.match(matchReg)
  console.log('这里的match', match)
  if (match.length > 2) {
    return
  }
  const name = match[1]
  components[name] = files(key).default
})
console.log('components', components)
export default {
  components: {
    ...components
  },
  data() {
    return {
      code: '',
      innerWidth: window.innerWidth,
      innerHeight: window.innerHeight,
      playList: [],
      openPlay: false,
      order: 0
    }
  },
  computed: {
    dialog() {
      console.log('dialog变了', this.$store.getters.dialog)
      return this.$store.getters.dialog
    },
    actionSheet() {
      console.log('actionSheet变了', this.$store.getters.actionSheet)
      return this.$store.getters.actionSheet
    },
    components() {
      console.log('this.$store.getters.frame.currentPage', this.$store.getters.currentPage)
      console.log('我查到的组件有', this.$store.state.componentsLibrary.components)
      const config = this.$store.getters.pageList[this.$store.getters.currentPage]
      console.log('config', config)
      let component = []
      if (config && config.componentList.length) {
        component = config.componentList
      }
      console.log('获得的component', component)
      this.$nextTick(() => {
        this.$refs.content.scrollTo(0, 0)
      })
      return component
    },
    backgroundColor() {
      console.log('backgroundColor变了', this.$store.getters.backgroundColor)
      return this.$store.getters.backgroundColor
    },
    includeTabbar() {
      const config = this.$store.getters.pageList[this.$store.getters.currentPage]
      if (config && config.componentList.length) {
        for (const item of config.componentList) {
          if (item.key === 'm-tabbar') {
            return true
          }
        }
      }
      return false
    }
  },
  watch: {
    $route: {
      handler(newVal) {
        console.log('我发现路由变了', this.$route.params.page)
        this.$store.dispatch('setMode', 'user')
        this.$store.dispatch('setCurrentPage', { page: this.$route.params.page })
        this.$store.dispatch('loadPageList', { page: this.$store.getters.currentPage })
      },
      deep: true,
      immediate: true
    }
  },
  mounted() {
    this.$store.dispatch('setMode', 'user')
    console.log('我要开始赋值啦', this.$store.getters.currentPage)
    const queryData = parseSearchArgs()
    console.log('queryData', queryData)
    if (queryData.state) {
      this.$store.commit('SET_USERSCHOOL', queryData.state)
    }
    if (queryData.code) {
      console.log('queryData', queryData.code)
      this.$store.dispatch('getWebAuth', queryData.code)
      this.$store.commit('SET_LOGINPAGE', 'home')
      this.$store.dispatch('setCurrentPage', { page: 'login' })
    }
    this.$store.dispatch('loadPageList', { page: this.$store.getters.currentPage })
    // this.$store.dispatch('setCurrentPage', { page: this.$store.getters.currentPage })
    console.log('我来看看这个时候的$route.params', this.$route.params.page)
  },
  beforeDestroy() {
  },
  methods: {
    confirmDialog(value) {
      console.log('dialog在create', value.func)
      this.$store.dispatch('logout')
      this.$store.dispatch(`${value.func}`)
    },
    actionSheetSelect(value) {
      if (value.page && value.page !== '') {
        this.$store.dispatch('setCurrentPage', { page: value.page })
      }
      if (value.func && value.func !== '') {
        console.log('执行func')
        this.$store.dispatch(`${value.func.method}`, { func: value.func })
      }
      if (value.req && value.req !== '') {
        console.log('执行req')
        this.$store.dispatch('sendRequest', { request: value.req })
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
.home-mode
  position relative
  width 100%
  height 100%
  overflow-x: hidden
  .is-tabbar
    width 100%
    height:100px
</style>
