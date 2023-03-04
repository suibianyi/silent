<template>
  <div class="dynamic-title-config">
    <van-popup v-model="showPopup" :round="true" :style="{ width: '90%', height: '80%' }" @close="closePopup">
      <div class="form">
        顶部导航栏设置
        <van-field v-model="navBar.navBarTitle" label="中间文字" placeholder="请输入文字" />
        <van-field v-model="navBar.navBarRight.text" label="右边文字" placeholder="请输入文字" />
        <van-field :value="formatPageListShow(navBar.navBarRight)" label="选择功能" placeholder="请选择功能" readonly @click="clickPage()" />
        <div style="margin: 16px;">
          <van-button round block type="info" native-type="submit" @click="confirm">确定</van-button>
        </div>
      </div>
    </van-popup>
    <page-list v-if="chooseNextPage"
               :show="chooseNextPage"
               :func="!navBar.navBarRight.func||navBar.navBarRight.func==''?{}:navBar.navBarRight.func"
               :req="!navBar.navBarRight.req||navBar.navBarRight.req==''?{}:navBar.navBarRight.req"
               @choose-page="chooseVal"
               @choose-func="chooseVal"
               @choose-req="chooseVal"
               @on-close="closeChoosePage" />
  </div>
</template>

<script>
import { formatPageListShow, formatPageListRes, formRightText } from '@/mUtils'
import pageList from '../pagelist/index123.vue'
export default {
  components: {
    pageList
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
        }
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
            this.formRightText()
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
  formRightText,
  methods: {
    formatPageListShow,
    chooseVal(val) {
      this.navBar.navBarRight = formatPageListRes(this.navBar.navBarRight, val)
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
</style>
