<!--  -->
<template>
  <div class="addAddEditFormwork">
    <div class="content">
      <div class="content-left">
        <div class="edit-key" @click="intoEdit()">编辑</div>
        <div class="phone-area">
          <div class="custom-main">
            <div id="main-box" class="module-box" :style="{'transform': `scale(${scale.rateWidth}, ${scale.rateHeight})`}">
              <div
                id="poster"
                ref="content"
                class="main"
                :style="{
                  'width': `${paintWidth}px`,
                  'height': `${paintHeight}px`,
                  'overflow-y': 'scroll',
                  'backgroundColor':`${backgroundColor}`,
                  '-moz-user-select': 'none',
                  '-webkit-user-select': 'none'}"
                @touchstart="gotouchstart()"
                @touchmove="gotouchmove()"
                @touchend="gotouchend()"
                @onmousedown="gotouchstart()"
                @onmouseover="gotouchmove()"
                @onmouseup="gotouchend()"
              >
                <div v-if="selectCompoent && loginStatus" class="content-right">
                  <div class="component-box">
                    <div class="title">模板列表</div>
                    <div class="component-list">
                      <van-cell-group>
                        <div
                          v-for="frame in frameList"
                          :key="frame._id"
                          class="cell-item"
                        >
                          <van-card
                            :desc="frame.schoolCode"
                            :title="frame.name + '  ' +frame.role"
                            :tag="tagInfo(frame)"
                            thumb="https://img01.yzcdn.cn/vant/ipad.jpeg"
                            @click="chooseFrame($event, frame)"
                          >
                            <template #footer>
                              <van-button round text="编辑" type="default" class="edit-button" @click="editFrame(frame)" />
                              <van-button round text="导出" type="default" class="delete-button" @click="exportFrame(frame)" />
                              <van-button round text="删除" type="default" class="delete-button" @click="delFrame(frame)" />
                            </template>
                          </van-card>
                          <van-switch v-model="frame.inUse" active-color="#8677EC" inactive-color="#B2B2B2" @change="switchChange(frame)" />
                        </div>

                      </van-cell-group>
                      <div class="add-comp" @click="showAddFram" />
                    </div>
                  </div>
                </div>
                <div v-if="!loginStatus">
                  <div class="login-container">
                    <div class="muse-logo">
                      <img class="logo" src="@/assets/mobile/login/logo.png" alt="">
                      <div>配置平台</div>
                    </div>
                    <div class="login-main">
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
                    </div>
                  </div>
                </div>
                <draggable v-if="!selectCompoent && loginStatus" :value="components" :disabled="!edit" @input="dragComponent" @start="chooseDrag" @end="dragEnd">
                  <div
                    v-for="(item, index) in components"
                    :key="index"
                    :style="{'position':'relative', 'height':'100%'}"
                    @mouseenter="onmouseover(index, item)" @mouseleave="onmouseout(index)"
                  >
                    <keep-alive>
                      <component
                        :is="item&&item.key"
                        v-if="item"
                        :id="item.id"
                        :config="item.config"
                      />
                    </keep-alive>
                    <div v-if="item&&item.shadeWindow&&item.key=='m-tabbar'&&edit&&!dragFlag" class="edit-bg-fiexd">
                      <div class="edit-button"
                           @click="config(item, index)" />
                      <div class="close-button"
                           @click="del(index)" />
                    </div>
                    <div v-if="item&&item.shadeWindow&&edit&&!dragFlag" class="edit-bg">
                      <div class="edit-button"
                           @click="config(item, index)" />
                      <div class="close-button"
                           @click="del(index)" />
                    </div>
                  </div>
                  <div v-if="edit" class="add-comp" @click="showAddComponent=true">
                    <!-- <van-icon name="plus" size="50" /> -->
                  </div>
                  <div v-if="edit" class="change-background-color">
                    选择背景颜色
                    <van-radio-group :value="backgroundColor" direction="horizontal" @input="changeBackColor">
                      <van-radio name="#ffffff">白色</van-radio>
                      <van-radio name="#eeeeee">灰色</van-radio>
                    </van-radio-group>
                  </div>
                  <div v-if="edit" class="change-background-color">
                    是否使用keep-alive
                    <van-radio-group :value="keepAlive" direction="horizontal" @input="changeKeepAlive">
                      <van-radio name="true">是</van-radio>
                      <van-radio name="false">否</van-radio>
                    </van-radio-group>
                  </div>
                  <div v-if="includeTabbar" class="is-tabbar" />
                  <component
                    :is="configComponent"
                    :show="dialogVisible"
                    :config-index="configIndex"
                    @on-close="closeConfigDialog"
                    @on-confirm="confirmConfig"
                  />
                </draggable>
                <van-popup v-model="showAddComponent" :round="true" :style="{ width: '90%', height: '80%' }">
                  <div class="add-component-popup">
                    <div :style="{ 'text-align': 'center', 'font-size': '35px' }">
                      请选择组件
                    </div>
                    <div v-for="(item, index) in componentsList"
                         :key="index">
                      <van-card
                        :desc="item.describe.name.key"
                        :title="item.describe.name.value"
                        :thumb="item.imgUrl || 'https://img01.yzcdn.cn/vant/ipad.jpeg'"
                        @click="addComponent(item)"
                        @click-thumb.stop="showPicture(item.imgUrl || 'https://img01.yzcdn.cn/vant/ipad.jpeg')"
                      />
                    </div>
                  </div>
                </van-popup>
                <van-image-preview v-model="showImagePreview" :images="imagePreview" />
                <van-popup v-model="showAdd" :round="true" :style="{ width: '90%', height: '80%' }">
                  <van-tabs v-model="active">
                    <van-tab title="新增模板">
                      <div class="form">
                        <van-field v-model="addModel.name" name="name" label="name" placeholder="请输入模板名称"
                                   :rules="[{ required: true, message: '请输入模板名称' }]" />
                        <van-field v-model="addModel.schoolCode" name="schoolCode" label="schoolCode" placeholder="请输入schoolCode"
                                   :rules="[{ required: true, message: '请输入schoolCode' }]" />
                        <van-field v-model="addModel.role" name="role" label="role" placeholder="请输入role"
                                   :rules="[{ required: true, message: '请输入role' }]" />
                        <div style="margin: 16px;">
                          <van-button round block type="info" native-type="submit" @click="addFram">确定</van-button>
                        </div>
                      </div>
                    </van-tab>
                    <van-tab title="导入模板">
                      <div class="form">
                        <van-field name="uploader" label="模板上传">
                          <template #input>
                            <van-uploader v-model="uploader" accept=".zip" :max-count="1" :before-read="beforeRead" upload-icon="description" />
                          </template>
                        </van-field>
                        <div style="margin: 16px;">
                          <van-button round block type="info" native-type="submit" @click="importFram">确定</van-button>
                        </div>
                      </div>
                    </van-tab>
                  </van-tabs>

                </van-popup>
                <van-popup v-model="showEdit" :round="true" :style="{ width: '90%', height: '80%' }">
                  <div class="form">
                    编辑模板
                    <van-field
                      v-model="editModel.name"
                      name="name"
                      label="name"
                      placeholder="请输入模板名称"
                      :rules="[{ required: true, message: '请输入模板名称' }]"
                    />
                    <van-field
                      v-model="editModel.schoolCode"
                      name="schoolCode"
                      label="schoolCode"
                      placeholder="请输入schoolCode"
                      :rules="[{ required: true, message: '请输入schoolCode' }]"
                    />
                    <van-field
                      v-model="editModel.role"
                      name="role"
                      label="role"
                      placeholder="请输入role"
                      :rules="[{ required: true, message: '请输入role' }]"
                    />
                    <div style="margin: 16px;">
                      <van-button round block type="info" native-type="submit" @click="saveEditFram">确定</van-button>
                    </div>
                  </div>
                </van-popup>
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
            </div>
          </div>
        </div>
        <div class="home-key" @click="clickHomeKey()"> {{ showText }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import Draggable from 'vuedraggable'
import { find } from 'lodash'
// import preventBack from 'vue-prevent-browser-back' // 组件内单独引入
import { getToken } from '@/utils/auth' // get token from cookie
import {
  getFrameList,
  createFrameList,
  delFrameList,
  updateFrameList,
  importFrameList
} from '@/api/frame'
const files = require.context('./components', true, /index.vue$/)
const configs = require.context('./components', true, /config.vue$/)
const components = {}
// const matchReg = /(?<=\/).*?(?=\/)/g
const matchReg = /\.\/(.*)\/index\.vue$/
const matchRegConfig = /\.\/(.*)\/config\.vue$/
files.keys().forEach((key) => {
  console.log('-------------------------', key)
  const match = key.match(matchReg)
  if (match.length > 2) {
    return
  }
  const name = match[1]
  components[name] = files(key).default
})
configs.keys().forEach((key) => {
  console.log('！！！！！！！！！！！！！！！！！！！！！', key)
  const match = key.match(matchRegConfig)
  if (match.length > 2) {
    return
  }
  const name = match[1]
  components[`${name}-config`] = configs(key).default
})

export default {
  components: {
    ...components,
    Draggable
  },
  // mixins: [preventBack],
  // import引入的组件需要注入到对象中才能使用
  props: {
    fixturesInfo: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    // 这里存放数据
    return {
      innerWidth: 0,
      innerHeight: 0,
      paintWidth: 414,
      paintHeight: 720,
      edit: false,
      timeOutEvent: '',
      configComponent: '',
      configIndex: 0,
      dialogVisible: false,
      model: {},
      frameList: [],
      showAdd: false,
      addModel: {
        name: '',
        schoolCode: '',
        role: ''
      },
      showEdit: false,
      editModel: {
        _id: '',
        name: '',
        schoolCode: '',
        role: ''
      },
      framModel: {
        _id: '',
        name: '',
        schoolCode: '',
        role: ''
      },
      showAddComponent: false,
      dragFlag: false,
      selectCompoent: true,
      showText: '',
      loginStatus: false,
      account: '',
      password: '',
      showImagePreview: false,
      imagePreview: [],
      exportUrl: 'api/private/export/fram',
      uploader: [],
      active: 0
    }
  },
  computed: {
    scale() {
      let rateWidth = 1
      let rateHeight = 1
      console.log('缩放比例', this.plate)
      rateWidth = this.innerWidth / this.paintWidth
      rateHeight = this.innerHeight / this.paintHeight
      console.log('缩放比例', this.innerWidth, this.innerHeight)
      console.log('缩放比例', rateWidth, rateHeight)
      return { rateWidth, rateHeight }
    },
    backgroundColor() {
      console.log('backgroundColor变了', this.$store.getters.backgroundColor)
      return this.$store.getters.backgroundColor
    },
    keepAlive() {
      console.log('keepAlive变了', this.$store.getters.keepAlive)
      return this.$store.getters.keepAlive ? 'true' : 'false'
    },
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
    componentsList() {
      console.log('我查到的组件有', this.$store.state.componentsLibrary.components)
      return this.$store.state.componentsLibrary.components
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
  // 监控data中的数据变化
  watch: {
    $route: {
      handler(newVal) {
        console.log('我发现路由变了', this.$route.params.page)
        if (this.$store && this.$store.dispatch) {
          this.$store.dispatch('setMode', 'editor')
          this.$store.dispatch('setCurrentPage', { page: this.$route.params.page })
          this.$store.dispatch('loadPageList', { page: this.$store.getters.currentPage })
        }
      },
      deep: true,
      immediate: true
    }
  },
  async mounted() {
    this.$store.dispatch('setMode', 'editor')
    const hasToken = getToken()
    if (hasToken) {
      this.loginStatus = true
    } else {
      this.loginStatus = false
    }
    try {
      this.frameList = (await getFrameList()).data
    } catch (error) {
      this.frameList.push({
        _id: '1234',
        role: 'teacher',
        name: '未取到fram用',
        schoolCode: 'hshdev',
        fram: this.$store.getters.pageList
      })
      console.log('取不到模板，使用默认模板', this.frameList)
    }

    // this.frameList = (await getFrameList()).data
    console.log('我拿到的列表是', this.frameList)
    console.log('我要开始赋值啦', this.$store.getters.currentPage)
    // this.$store.dispatch('setCurrentPage', { page: this.$store.getters.currentPage })
    this.$nextTick(() => {
      this.innerWidth = document.getElementsByClassName('phone-area')[0].clientWidth
      this.innerHeight = document.getElementsByClassName('phone-area')[0].clientHeight
      console.log('innerWidth', this.innerWidth)
      console.log('innerHeight', this.innerHeight)
    })
    // this.$store.dispatch('loadPageList', { page: this.$store.getters.currentPage })
  },
  // 方法集合
  methods: {
    async login() {
      if (this.account === '') {
        this.$Notify({ type: 'warning', message: '请输入账号' })
        return
      }
      if (this.password === '') {
        this.$Notify({ type: 'warning', message: '请输入密码' })
        return
      }
      await this.$store.dispatch('configLogin', {
        account: this.account,
        password: this.password
      })
      this.loginStatus = true
    },
    tagInfo(frame) {
      return frame.inUse ? '使用中' : ''
    },
    async switchChange(frame) {
      console.log('不是吧11', frame, frame.inUse)
      if (frame.inUse) {
        this.$dialog.confirm({
          title: '注意',
          message: '开启该模板,会关闭同类型的其他模板~'
        })
          .then(async() => {
            await updateFrameList({
              id: frame._id,
              name: frame.name,
              role: frame.role,
              schoolCode: frame.schoolCode,
              fram: frame.fram,
              inUse: frame.inUse
            })
            this.frameList = (await getFrameList()).data
          })
          .catch(() => {
            console.log('取消~')
          })
      } else {
        await updateFrameList({
          id: frame._id,
          name: frame.name,
          role: frame.role,
          schoolCode: frame.schoolCode,
          fram: frame.fram,
          inUse: frame.inUse
        })
        this.frameList = (await getFrameList()).data
      }
    },
    confirmDialog(value) {
      console.log('dialog在create', value.func)
      this.$store.dispatch('logout')
      this.$store.dispatch(`${value.func}`)
    },
    beforeClose(action, done) {
      if (action === 'confirm') {
        this.saveFram()
        this.edit = false
        done()
      } else {
        this.edit = false
        done()
      }
    },
    clickHomeKey() {
      if (this.showText === '保存') {
        this.showText = '返回'
        this.$dialog.confirm({
          title: '保存模板',
          message: '确认保存编辑结果吗？',
          beforeClose: this.beforeClose
        })
        return
      }
      if (this.showText === '返回') {
        this.showText = ''
        this.selectCompoent = true
        this.$store.dispatch('setCurrentPage', { page: 'template' })
      }
    },
    intoEdit() {
      this.edit = true
      this.showText = '保存'
    },
    gotouchstart() {
      const _this = this
      clearTimeout(_this.timeOutEvent) // 清除定时器
      _this.timeOutEvent = 0
      _this.timeOutEvent = setTimeout(() => {
        // 执行长按要执行的内容，
        // this.edit = true
        _this.$nextTick(function() {
          _this.edit = true
          _this.showText = '保存'
        })
        console.log('长按1.5秒', _this.edit)
      }, 2000) // 这里设置定时
    },
    // 手释放，如果在1000毫秒内就释放，则取消长按事件，此时可以执行onclick应该执行的事件
    gotouchend() {
      console.log('create间听到取消长按')
      const _this = this
      clearTimeout(_this.timeOutEvent)
      if (_this.timeOutEvent !== 0) {
        // 这里写要执行的内容（尤如onclick事件）
      }
    },
    // 如果手指有移动，则取消所有事件，此时说明用户只是要移动而不是长按
    gotouchmove() {
      const _this = this
      clearTimeout(_this.timeOutEvent) // 清除定时器
      _this.timeOutEvent = 0
    },
    dragComponent(value) {
      console.log('拖动后的结果是', value)
      this.$store.dispatch('setPage', { page: value, pageListName: this.$store.getters.currentPage })
    },
    chooseDrag() {
      this.dragFlag = true
    },
    dragEnd() {
      this.dragFlag = false
    },
    showAddFram() {
      this.showAdd = true
    },
    async addFram() {
      // 默认不使用
      await createFrameList({
        fram: this.$store.getters.pageList,
        role: this.addModel.role,
        name: this.addModel.name,
        schoolCode: this.addModel.schoolCode,
        inUse: false
      })
      this.frameList = (await getFrameList()).data
      this.showAdd = false
    },
    async delFrame(frame) {
      console.log('我要删除的fram是', frame)
      if (frame) {
        this.$dialog.confirm({
          title: '注意',
          message: '该操作不可逆~'
        })
          .then(async() => {
            await delFrameList({ id: frame._id })
            this.frameList = (await getFrameList()).data
          })
          .catch(() => {
            console.log('取消~')
          })
      }
    },
    async exportFrame(frame) {
      console.log('我要导出的fram是', frame)
      window.open(`${this.exportUrl}?id=${frame._id}`)
      this.frameList = (await getFrameList()).data
    },
    async importFram() {
      console.log('file:', this.uploader[0].content)
      console.log('我要导入的fram是', this.uploader[0].content)
      await importFrameList({
        modelFile: this.uploader[0].content
      })
      this.frameList = (await getFrameList()).data
      this.showAdd = false
    },
    beforeRead(file) {
      console.log('上传模板的type', file.type)
      // if (file.type !== 'application/x-zip-compressed') {
      //   this.$toast('请上传zip文件')
      //   return false
      // }
      return true
    },
    editFrame(frame) {
      this.showEdit = true
      this.editModel = frame
    },
    async saveEditFram() {
      await updateFrameList({
        id: this.editModel._id,
        name: this.editModel.name,
        role: this.editModel.role,
        schoolCode: this.editModel.schoolCode,
        fram: this.editModel.fram
      })
      this.frameList = (await getFrameList()).data
      this.showEdit = false
    },
    chooseFrame(event, frame) {
      this.framModel = {
        _id: frame._id,
        fram: frame.fram,
        role: frame.role,
        name: frame.name,
        schoolCode: frame.schoolCode
      }
      this.$store.dispatch('setFrameId', frame._id)
      let path = null
      if (event.path) {
        path = event.path
      } else {
        path = event.composedPath()
      }
      const target = find(path, ele => this.hasClass(ele, 'van-card__header'))
      if (target) {
        this.selectCompoent = false
        this.showText = '返回'
        // this.$store.commit('SET_AUTHFLAG', true)
        this.$store.dispatch('logout')
        this.$store.dispatch('setPagelist', { pageList: frame.fram, page: 'home' })
      }
    },
    onmouseover(index, item) {
      console.log('移入了', index)
      this.$set(this.components[index], 'shadeWindow', true)
    },
    onmouseout(index) {
      console.log('移出了', index)
      this.$set(this.components[index], 'shadeWindow', false)
    },
    config(item, index) {
      console.log('点击了配置', item, index)
      this.configIndex = index
      this.configComponent = `${item.key}-config`
      this.$set(this.components[index], 'shadeWindow', false)
      //   this.editData = item
      this.edit = false
      this.dialogVisible = true
    },
    closeConfigDialog() {
      this.dialogVisible = false
      // 刷新
      this.$store.dispatch('setCurrentPage', { page: this.$store.getters.currentPage, back: true })
    },
    confirmConfig() {},
    del(index) {
      console.log('点击了删除', index)
      this.$store.dispatch('delPagelist', { index: index, pageListName: this.$store.getters.currentPage })
    },
    closeMixDialog() {
      this.$emit('on-close')
    },
    async saveFram() {
      console.log('保存之前看一眼模板', this.$store.getters.pageList)
      await updateFrameList({
        id: this.framModel._id,
        name: this.framModel.name,
        role: this.framModel.role,
        schoolCode: this.framModel.schoolCode,
        fram: this.$store.getters.pageList
      })
      this.frameList = (await getFrameList()).data
    },
    addComponent(item) {
      if (item && item.describe) {
        this.$store.dispatch('addComponent', { pageListName: this.$store.getters.currentPage, component: { key: item.describe.name.key, id: Math.random().toString(36).slice(-8) }})
        this.$toast('增加成功')
      }
      this.showAddComponent = false
    },
    async submitForm() {
      this.$emit('on-close')
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
    },
    changeBackColor(val) {
      this.$store.dispatch('editPage', { pageListName: this.$store.getters.currentPage, key: 'backgroundColor', value: val })
      this.$store.dispatch('setBackgroundColor', val)
    },
    changeKeepAlive(val) {
      this.$store.dispatch('editPage', { pageListName: this.$store.getters.currentPage, key: 'keepAlive', value: val })
      this.$store.dispatch('setKeepAlive', val)
    },
    showPicture(val) {
      console.log('我点击了图片')
      this.imagePreview = [val]
      this.showImagePreview = true
    },
    chooseResult(val) {
      if (this.treeType === 'special') {
        this.request.specialData[this.specialIndex].value = val.data
      }
      if (this.treeType === 'edit') {
        this.formList[this.specialIndex].data = val.data
      }
    },
    chooseSpecial(index, type) {
      this.specialIndex = index
      this.treeType = type
      this.specialTree = this.formatTree(this.$store.getters.storage)
      this.showSpecialTree = true
    },
    closePage() {
      this.showSpecialTree = false
    },
    confirm() {
      this.$store.dispatch('editComponent', { index: this.configIndex, pageListName: this.$store.getters.currentPage, key: 'request', value: this.request })
      this.$store.dispatch('editComponent', { index: this.configIndex, pageListName: this.$store.getters.currentPage, key: 'formList', value: this.formList })
      this.showRequestPopup = false
      this.$emit('on-close')
    },
    actionSheetSelected(value) {
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
    },
    hasClass(el, cls) {
      if (!el || !cls) return false
      if (cls.indexOf(' ') !== -1) throw new Error('className should not contain space.')
      if (el.classList) {
        return el.classList.contains(cls)
      } else {
        return (' ' + el.className + ' ').indexOf(' ' + cls + ' ') > -1
      }
    }
  }
}
</script>
<style lang='scss' scoped>
@import "~@/styles/mixin.scss";
.addAddEditFormwork {
  .form {
    margin: 30px;
  }
  .content {
    display: flex;
    .add-comp {
      padding: 10px;
      height: 86px;
      text-align: center;
      line-height: 86px;
      width: 100%;
      background: no-repeat url('~@/assets/mobile/create/add.png');
      background-size: contain;
      // background-color: red;
      background-position: center bottom;
      // border: solid 1px #b4b8bf;
      // border-radius: 33px;
      i {
        color: white;
      }
    }
    .change-background-color {
       padding: 10px;
       width: 100%;
       text-align: center;
    }
    .content-left {
      width: 360px;
      height: 745px;
      margin: 0 auto;
      background-image: url('../../../assets/mobile/create/phone_list.png');
      background-repeat: no-repeat;
      .edit-key {
        width: 58px;
        height:30px;
        margin-top: 55px;
        // border: 1px red solid;
        margin-left: 270px;
        font-size: 15px;
        background-color: #FFFFFF;
        border-radius: 30px 0;
        text-align: center;
        color:darkgray;
        line-height: 30px;
      }
      // .edit-key:before {
      //   position: absolute;
      //   right: -30.5px;
      //   bottom: 12.5px;
      //   content: '';

      //   display: inline-block;
      //   width: 30px;
      //   background: yellow;
      //   height: 26px;

      //   border-left: 1px solid #e2e2ea;
      //   border-bottom: 1px solid #e2e2ea;
      //   border-bottom-left-radius: 12px 12px;
      //   z-index: 2;
      // }
      // .title:after {
      //   position: absolute;
      //   display: inline-block;
      //   content: '';
      //   bottom: 0;

      //   right: -15px;
      //   width: 36px;
      //   height: 60px;
      //   background: #ff0000bf;
      //   z-index: 1;
      // }
      .phone-area {
        width: 320px;
        height: 556px;
        margin-left: 16px;
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
          .edit-bg-fiexd {
            position: fixed;
            bottom: 0;
            z-index: 99999;
            background-image: linear-gradient(rgba(0, 0, 0, 0.4), transparent);
            width: 100%;
            height: 80px;
            border-radius: 15px;
            .edit-button {
                cursor: pointer;
                background-image: url('../../../assets/mobile/create/edit.png');
                background-size: '100% auto';
                background-repeat: no-repeat;
                height: 45px;
                width: 45px;
                position: absolute;
                top: 30px;
                right: 55px;
                transform: translate(-50%, -50%);
            }
            .close-button {
                cursor: pointer;
                background-image: url('../../../assets/mobile/create/close.png');
                background-size: '100% auto';
                background-repeat: no-repeat;
                z-index: 99999;
                height: 45px;
                width: 45px;
                position: absolute;
                top: 30px;
                right: 0px;
                transform: translate(-50%, -50%);
                }
          }
          .edit-bg {
            top: 0;
            left: 0;
            position: absolute;
            z-index: 99999;
            background-image: linear-gradient(rgba(0, 0, 0, 0.4), transparent);
            width: 100%;
            height: 100%;
            border-radius: 15px;
            .edit-button {
                cursor: pointer;
                background-image: url('../../../assets/mobile/create/edit.png');
                background-size: '100% auto';
                background-repeat: no-repeat;
                height: 45px;
                width: 45px;
                position: absolute;
                top: 30px;
                right: 55px;
                transform: translate(-50%, -50%);
            }
            .close-button {
                cursor: pointer;
                background-image: url('../../../assets/mobile/create/close.png');
                background-size: '100% auto';
                background-repeat: no-repeat;
                z-index: 99999;
                height: 45px;
                width: 45px;
                position: absolute;
                top: 30px;
                right: 0px;
                transform: translate(-50%, -50%);
                }
          }
          .module-box {
            transform-origin: 0 0;
            background-color: #fff;
            position: absolute;
            width: 414px;
          }
          .add-component-popup {
            margin: 20px;
          }
          .is-tabbar {
              width: 100%;
              height:80px;
          }
        }
      }
      .home-key {
        width: 58px;
        height:62px;
        // border: 1px red solid;
        margin-left: 148px;
        text-align: center;
        color:darkgray;
        line-height: 62px;
      }
    }
    .login-container {
      width: 414px;
      height: 720px;
      background-size: 100% 100% !important;
      background: url('~@/assets/mobile/login/login-bg.png');
      display: flex;
      flex-direction: column;
      align-items: center;
      .muse-logo {
        width: 100px;
        height: 100px;
        margin-top: 100px;
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
        height: 350px;
        margin-top: 60px;
        padding-top: 50px;
        // border: 1px solid red;
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
    .content-right {
      .edit-button {
        border: 1px solid #8677EC;
        color: #8677EC;
        height: 100%;
      }
      .delete-button {
        height: 100%;
        background-color: #F1F0F0;
      }
      .component-box {
        .title {
          text-align: center;
          margin-top: 15px;
          font-size: 20px;
          line-height: 1;
        }
        .component-list {
          padding: 10px;
        }
      }
    }
  }
  &-class-input {
    float: left;
    width: 80%;
  }
  &-class-btn {
    margin-left: 10px;
  }
}
.red-packets-active {
  animation-name: upAnimation;
  transform-origin: center bottom;
  animation-duration: .6s;
  animation-fill-mode: both;
  animation-iteration-count: infinite;
  animation-delay: .3s;
}
@keyframes upAnimation {
    0% {
        transition:transform .1s linear;
        transform:  translate(0px, 0px) rotate(0deg)
    }

    20% {
        transition:transform .1s linear;
        transform:  translate(.2px, .2px) rotate(2deg)
    }

    40% {
        transition:transform .1s linear;
        transform:  translate(0px, 0px) rotate(0deg)
    }

    60% {
        transition:transform .1s linear;
        transform:  translate(.2px, -.2px) rotate(2deg)
    }

    80% {
        transition:transform .1s linear;
        transform:  translate(-.2px, .2px) rotate(-2deg)
    }
    100% {
        transition:transform .1s linear;
        transform:  translate(0px, 0px) rotate(0deg)
    }
}
</style>
<style>
  .cell-item {
    position: relative;
    margin: 10px 0;
  }
  .cell-item .van-switch {
    position: absolute;
    right: 15px;
    top: 15px;
  }
  .cell-item .van-button--normal {
    padding: 6px 15px;
  }
  .cell-item .van-card__title {
    font-size: 14px;
  }
  .cell-item .van-card__desc {
    color: #474747;
  }
</style>
