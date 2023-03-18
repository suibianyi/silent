<template>
  <div class="dynamic-title-config">
    <van-popup v-model="showPopup" :round="true" :style="{ width: '90%', height: '80%' }" @close="closePopup">
      <div class="form">
        顶部导航栏设置
        <van-field v-model="navBar.navBarTitle" label="中间文字" placeholder="请输入文字" />
        <van-field v-model="navBar.navBarRight.text" label="右边文字" placeholder="请输入文字" />
        <van-field :value="formatPageListShow(navBar.navBarRight)" label="选择功能" placeholder="请选择功能" readonly @click="clickPage()" />
        文本颜色：
        <div class="vue-color">
          <Compact :value="navBar.navBarTextColor" @input="chooseTextColor" />
        </div>
        标题颜色：
        <div class="vue-color">
          <Compact :value="navBar.navBarTitleColor" @input="chooseTitleColor" />
        </div>
        背景颜色：
        <div class="vue-color">
          <Compact :value="navBar.navBarBackgroundColor" @input="chooseBackgroundColor" />
        </div>
        <div style="margin: 16px;">
          <van-button round block type="info" native-type="submit" @click="confirm">确定</van-button>
        </div>
      </div>
    </van-popup>
    <page-list v-if="chooseNextPage"
               :show="chooseNextPage"
               :func="!navBar.navBarRight.func||navBar.navBarRight.func==''?{}:navBar.navBarRight.func"
               :req="!navBar.navBarRight.req||navBar.navBarRight.req==''?{}:navBar.navBarRight.req"
               :action="!navBar.navBarRight.action||navBar.navBarRight.action==''? {}:navBar.navBarRight.action"
               @result="chooseVal"
               @on-close="closeChoosePage" />
  </div>
</template>

<script>
import { formatPageListShow } from '@/mUtils'
import pageList from '../pagelist/index123.vue'
import { Compact } from 'vue-color'

export default {
  components: {
    pageList,
    Compact
  },
  props: {
    show: {
      type: Boolean,
      default: false
    },
    flag: {
      type: Number,
      default: 0
    },
    configIndex: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      showPopup: false,
      navBar: {
        navBarTitle: '',
        navBarRight: {
          text: '',
          page: '',
          func: {
            method: ''
          }
        },
        navBarBackgroundColor: '#FFFFFF',
        navBarTextColor: '#73d8ff',
        navBarTitleColor: '#000000'
      },
      chooseNextPage: false
    }
  },
  computed: {
  },
  watch: {
    show: {
      handler(newVal) {
        this.showPopup = newVal
      },
      deep: true,
      immediate: true
    },
    configIndex: {
      handler(newVal) {
        if (this.$store.getters.pageList[this.$store.getters.currentPage].componentList[newVal].navBar) {
          this.navBar.navBarTitle = this.$store.getters.pageList[this.$store.getters.currentPage].componentList[newVal].navBar.navBarTitle
          if (this.$store.getters.pageList[this.$store.getters.currentPage].componentList[newVal].navBar.navBarRight) {
            this.navBar.navBarRight = this.$store.getters.pageList[this.$store.getters.currentPage].componentList[newVal].navBar.navBarRight
          }
        }
      },
      deep: true,
      immediate: true
    }
  },
  mounted() {
    console.log('show', this.show)
  },
  methods: {
    formatPageListShow,
    chooseBackgroundColor(value) {
      console.log('选择颜色的结果是', value)
      this.navBar.navBarBackgroundColor = value.hex
    },
    chooseTitleColor(value) {
      console.log('选择颜色的结果是', value)
      this.navBar.navBarTitleColor = value.hex
    },
    chooseTextColor(value) {
      console.log('选择颜色的结果是', value)
      this.navBar.navBarTextColor = value.hex
    },
    chooseVal(val) {
      this.navBar.navBarRight.action = val
    },
    closeChoosePage() {
      this.chooseNextPage = false
    },
    clickPage(index) {
      this.chooseNextPage = true
    },
    closePopup() {
      this.$emit('on-close')
    },
    confirm() {
      console.log('我设置nav-bar点了确认', JSON.stringify(this.navBar))
      this.$store.dispatch('editComponent', { index: this.configIndex, pageListName: this.$store.getters.currentPage, key: 'navBar', value: this.navBar })
      this.$emit('on-close')
    }
  }

}
</script>

<style lang='scss' scoped>
.dynamic-title-config {
    padding: 10px 10px 0px 10px;
    .form {
      margin: 20px;
      .delete-button {
       height: 100%;
      }
    }
}
.vue-color {
  padding: 10px 16px;
}
</style>
