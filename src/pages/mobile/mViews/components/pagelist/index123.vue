<template>
  <div class="page-list">
    <van-popup v-model="showPopup" :style="{ width: '100%', height: '100%' }" :closeable="true" @close="closePopup">
      <div class="popup-content">
        <van-tabs v-model="active" sticky>
          <van-tab title="跳转页面">
            <van-grid :column-num="2" :border="false">
              <van-grid-item v-for="(page, pageIndex) in pageLists"
                             :key="pageIndex">
                <div>
                  {{ pageIndex }}
                </div>
                <div class="content">
                  <div class="phone-area-page" @click.stop="choosePage(pageIndex)">
                    <div class="custom-main">
                      <div id="main-box" class="module-box" :style="{'transform': `scale(${scale.rateWidth}, ${scale.rateHeight})`}">
                        <div
                          id="poster"
                          class="main"
                          :style="{
                            'width': `${paintWidth}px`,
                            'height': `${paintHeight}px`,
                            'overflow-y': 'scroll',
                            '-moz-user-select': 'none',
                            '-webkit-user-select': 'none'}"
                        >
                          <div
                            v-for="(item, index) in page.componentList"
                            :key="index"
                            :style="{'position':'relative'}"
                          >
                            <div class="edit-bg" />
                            <component
                              :is="item&&item.key"
                              v-if="item"
                              :config="item.config"
                            />
                          </div>
                          <div v-if="includeTabbar" class="is-tabbar" />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="home-key" @click="clickHomeKey(pageIndex)"> 删除</div>
                </div>
              </van-grid-item>
            </van-grid>
          </van-tab>
          <van-tab title="选择功能">
            <div v-for="(item, index) in funcList"
                 :key="index">
              <van-card
                :desc="item.describe"
                :title="item.name"
                :thumb="item.imageUrl"
                @click="chooseFunction(item)"
              />
            </div>
          </van-tab>
          <van-tab title="发送请求">
            <div class="form">
              请求参数设置
              <van-field
                v-model="request.url"
                name="url"
                label="请求地址"
                placeholder="请输入请求地址"
                :rules="[{ required: true, message: '请输入请求地址' }]"
              />
              <van-field name="radio" label="method">
                <template #input>
                  <van-radio-group v-model="request.method" direction="horizontal">
                    <van-radio name="get">get</van-radio>
                    <van-radio name="post">post</van-radio>
                    <van-radio name="delete">delete</van-radio>
                  </van-radio-group>
                </template>
              </van-field>
              <van-field
                name="固定请求参数"
                label="固定请求参数"
                right-icon="add-o"
                @click="addData"
              />
              <van-swipe-cell v-for="(item,index) in request.data" :key="index">
                <div class="key-value">
                  <div :style="{ width: '48%' }">
                    <van-field v-model="item.key" placeholder="key" />
                  </div>
                  <div :style="{ width: '48%' }">
                    <van-field v-model="item.value" placeholder="value" />
                  </div>
                </div>
                <template #right>
                  <van-button square text="删除" type="danger" class="delete-button" @click="delData(index)" />
                </template>
              </van-swipe-cell>
              <van-field
                name="动态请求参数"
                label="动态请求参数"
                right-icon="add-o"
                @click="addSpecialData"
              />
              <van-swipe-cell v-for="(item,index) in request.specialData" :key="index+1024">
                <div class="key-value">
                  <div :style="{ width: '48%' }">
                    <van-field v-model="item.key" placeholder="key" />
                  </div>
                  <div :style="{ width: '48%' }">
                    <van-field v-model="item.value" placeholder="value" @click="chooseSpecial(index)" />
                  </div>
                </div>
                <template #right>
                  <van-button square text="删除" type="danger" class="delete-button" @click="delSpecialData(index)" />
                </template>
              </van-swipe-cell>
              <div style="margin: 16px;">
                <van-button round block type="info" native-type="submit" @click="confirmRequest">确定</van-button>
              </div>
            </div>
          </van-tab>
        </van-tabs>
      </div>
    </van-popup>
    <tree :show="showSpecialTree" :list="specialTree" @result="chooseResult"
          @on-close="closePage" />
    <van-popup v-model="addPopup" round :style="{ width: '70%', height: '25%' }">
      <div class="add">
        新建页面
      </div>
      <van-form>
        <van-field v-model="newPageName" label="名字" placeholder="给你的新页面取个名字吧" :rules="[{ validator:validatorAdd, message: '该名字已经存在' }]" />
      </van-form>
      <div style="margin: 26px;">
        <van-button round block type="info" native-type="submit" @click="confirm">确定</van-button>
      </div>
    </van-popup>
    <van-dialog v-model="delPageShow" title="删除页面" show-cancel-button @confirm="delpage()">
      <div :style="{
        'width': '100%',
        'height': `100px`,
        'text-align': 'center',
        'line-height': '100px'}"
      >
        删除后将不可恢复
      </div>
    </van-dialog>
    <action-sheet-config v-if="showFuncPopup&&chooseFunc=='actionSheet'" v-model="actions" :show="showFuncPopup&&chooseFunc=='actionSheet'" @on-close="closeItem" @confirm="confirmSet" />
    <dialog-config v-if="showFuncPopup&&chooseFunc=='dialog'" v-model="actions" :show="showFuncPopup&&chooseFunc=='dialog'" @on-close="closeItem" @confirm="confirmSet" />
  </div>
</template>
<script>

import _ from 'lodash'
import tree from '../tree/index123.vue'
import { splitTreeRes, formatTree } from '@/mUtils'
const files = require.context('../../components', true, /index.vue$/)
const components = {}
// const matchReg = /(?<=\/).*?(?=\/)/g
const matchReg = /\.\/(.*)\/index\.vue$/
files.keys().forEach((key) => {
  const match = key.match(matchReg)
  console.log('正则读到的match是', match)
  if (match.length > 2) {
    return
  }
  const name = match[1]
  console.log('正则读到的default是', files(key))
  components[name] = files(key).default
})
console.log('components', components)
// import actionSheetConfig from './action-sheet.vue'
export default {
  components: {
    ...components,
    tree,
    actionSheetConfig: () => import('./action-sheet.vue'),
    dialogConfig: () => import('./dialog.vue')
  },
  filters: {
    getkey(lists, pageIndex) {
      console.log('传进来的参数是', lists, pageIndex)
      // console.log('应该显示的是', Object.keys(lists)[pageIndex])
      return lists
    }
  },
  props: {
    show: {
      type: Boolean,
      default: false
    },
    func: {
      type: Object,
      default: () => {
        return {}
      }
    },
    req: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {
      innerWidth: 160,
      innerHeight: 273,
      paintWidth: 207,
      paintHeight: 448,
      showPopup: false,
      addPopup: false,
      newPageName: '',
      active: 0,
      showFuncPopup: false,
      chooseFunc: '',
      actions: [],
      funcList: [{
        method: 'dialog',
        imageUrl: require('@/assets/mobile/list-pic/dialog.png'),
        name: 'dialog对话框',
        describe: ''
      }, {
        method: 'actionSheet',
        imageUrl: require('@/assets/mobile/list-pic/action-sheet.png'),
        name: 'actionSheet对话框',
        describe: ''
      }],
      request: {
        url: '',
        method: 'get',
        data: [],
        specialData: []
      },
      showSpecialTree: false,
      specialIndex: -1,
      specialTree: [],
      treeMode: '',
      delPageShow: false,
      delPageIndex: ''
    }
  },
  computed: {
    scale() {
      let rateWidth = 1
      let rateHeight = 1
      console.log('缩放比例', this.plate)
      rateWidth = this.innerWidth / this.paintWidth
      rateHeight = this.innerHeight / this.paintHeight
      // if (rateWidth > rateHeight) {
      //   rateWidth = rateHeight
      // } else {
      //   rateHeight = rateWidth
      // }
      console.log('缩放比例', this.innerWidth, this.innerHeight)
      console.log('缩放比例', rateWidth, rateHeight)
      return { rateWidth, rateHeight }
    },
    pageLists() {
      const obj = JSON.parse(JSON.stringify(_.cloneDeep(this.$store.getters.pageList)))
      const returnObj = _.assign({ '添加页面': { componentList: [] }}, obj)
      console.log('pagelist选择页面发现pagelist发生了改变', returnObj)
      return returnObj
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
    show: {
      handler(newVal) {
        this.showPopup = newVal
      },
      deep: true,
      immediate: true
    },
    func: {
      handler(newVal) {
        if (newVal && newVal.actions) {
          this.actions = newVal.actions
        }
      },
      deep: true,
      immediate: true
    },
    req: {
      handler(newVal) {
        if (newVal && newVal.method) {
          this.request = newVal
        }
      },
      deep: true,
      immediate: true
    }
  },
  mounted() {
    console.log('我要开始赋值啦', document.getElementsByClassName('phone-area-page'))
    this.$nextTick(() => {
      if (document.getElementsByClassName('phone-area-page')[0]) {
        this.innerWidth = document.getElementsByClassName('phone-area-page')[0].clientWidth
        this.innerHeight = document.getElementsByClassName('phone-area-page')[0].clientHeight
        console.log('innerWidth', this.innerWidth)
        console.log('innerHeight', this.innerHeight)
      }
    })
  },
  beforeDestroy() {
  },
  methods: {
    formatTree,
    validatorAdd(val) {
      for (const item in this.pageLists) {
        console.log('循环结果是', item)
        if (item === val) {
          return false
        }
      }
      return true
    },
    confirm() {
      if (!this.validatorAdd(this.newPageName)) {
        return
      }
      this.$store.dispatch('addPage', { pageListName: this.newPageName })
      this.addPopup = false
      this.$emit('choose-page', this.newPageName)
      this.$emit('on-close')
    },
    closePopup() {
      this.$emit('on-close')
    },
    choosePage(page) {
      if (page === '添加页面') {
        this.addPopup = true
      } else {
        this.$emit('choose-page', page)
        this.$emit('on-close')
      }
    },
    chooseFunction(item) {
      this.chooseFunc = item.method
      this.showFuncPopup = true
    },
    closeFuncPopup() {
      this.showFuncPopup = false
    },
    closeItem() {
      this.showFuncPopup = false
    },
    confirmSet(value) {
      console.log('收到提交的东西啦', value)
      const func = {
        method: 'actionSheet',
        show: true,
        actions: this.actions
      }
      this.$emit('choose-func', func)
      this.$emit('on-close')
      // func: {
      //           method: 'dialog',
      //           show: true,
      //           title: '退出登录',
      //           text: '确定退出登录吗？',
      //           func: 'logout'
      //         }
    },
    chooseResult(val) {
      if (this.treeMode === 'special') {
        this.request.specialData[this.specialIndex].value = val.data
      } else {
        const str = splitTreeRes(val.data)
        console.log('格式化后的str是', str)
      }
    },
    closePage() {
      this.showSpecialTree = false
    },
    chooseSpecial(index) {
      this.specialIndex = index
      this.treeMode = 'special'
      this.specialTree = this.formatTree(this.$store.getters.storage)
      this.showSpecialTree = true
    },
    addData() {
      this.request.data.push({ key: '', value: '' })
    },
    addSpecialData() {
      this.request.specialData.push({ key: '', value: '' })
    },
    delSpecialData(index) {
      this.request.specialData.splice(index, 1)
    },
    delData(index) {
      this.request.data.splice(index, 1)
    },
    confirmRequest() {
      console.log('点击请求的确定传出去的参数', this.request)
      this.$emit('choose-req', this.request)
      this.$emit('on-close')
    },
    delpage() {
      this.$store.dispatch('delPage', this.delPageIndex)
      this.delPageShow = false
    },
    clickHomeKey(page) {
      console.log('我点击了删除', page)
      this.delPageShow = true
      this.delPageIndex = page
    }
  }
}
</script>

<style lang="stylus" scoped>
.page-list
  padding-top: 50px;
  display: flex
  flex-wrap: wrap
  flex-direction: row
  width 100%
  height 100%
  overflow-x: hidden
  .popup-content {
    margin-top: 30px
  }
  .form {
    margin: 20px;
    .key-value {
      display: flex;
    }
    .delete-button {
      height: 100%;
    }
  }
  .content {
      width: 200px;
      height: 372px;
      margin-left: -15px;
      background-image: url('../../../../../assets/mobile/create/phone_bg.png');
      background-size: cover;
    .phone-area-page {
      width: 160px;
      height: 320px;
      padding-top: 42px;
      margin-left: 27px;
      border-width: 1px;
      .custom-main {
        position: relative;
        min-height: calc(100%);
        min-width: calc(100%);
        ::-webkit-scrollbar {
          width: 0 !important;
        }
        ::-webkit-scrollbar {
            width: 0 !important;height: 0;
        }
        .edit-bg {
          top: 0;
          left: 0;
          position: absolute;
          z-index: 99999;
          width: 100%;
          height: 100%;
        }
        .module-box {
          transform-origin: 0 0;
          background-color: #fff;
          position: absolute;
          width: 207px;
        }
      }
    }
    .home-key {
        width: 29px;
        height:31px;
        // border: 1px red solid;
        margin-left: 93px;
        text-align: center;
        color:darkgray;
        line-height: 31px;
        font-size:10px
      }
  }
  .add {
    width: 100%
    height: 60px
    line-height: 60px
    text-align: center
    font-size: 28px
  }

  .is-tabbar
    width 100%
    height:100px
</style>
