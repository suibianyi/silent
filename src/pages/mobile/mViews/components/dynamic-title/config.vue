<template>
  <div class="dynamic-title-config">
    <van-popup v-model="showPopup" :round="true" :style="{ width: '90%', height: '80%' }" @close="closePopup">
      <div class="form">
        动态标题设置
        <van-field v-model="dynamicTitle.leftText" label="左边文字" placeholder="请输入文字" />
        <van-field v-model="dynamicTitle.rightText" label="右边文字" placeholder="请输入文字" />
        <van-field :value="formatPageListShow(dynamicTitle)" label="跳转页面" placeholder="请选择跳转页面" readonly @click="clickPage()" />
        <div style="margin: 16px;">
          <van-button round block type="info" native-type="submit" @click="confirm">确定</van-button>
        </div>
      </div>
    </van-popup>
    <!-- <page-list :show="chooseNextPage"
               @choose-page="choosePage"
               @on-close="closeChoosePage" /> -->
    <page-list v-if="chooseNextPage"
               :show="chooseNextPage"
               :func="!dynamicTitle.func||dynamicTitle.func==''? {}:dynamicTitle.func"
               :req="!dynamicTitle.req||dynamicTitle.req==''? {}:dynamicTitle.req"
               :action="!dynamicTitle.action||dynamicTitle.action==''? {}:dynamicTitle.action"
               @result="chooseVal"
               @on-close="closeChoosePage" />
  </div>
</template>

<script>
import pageList from '../pagelist/index123.vue'
import { formatPageListShow } from '@/mUtils'
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
      dynamicTitle: {
        leftText: '',
        rightText: '',
        page: ''
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
        if (this.$store.getters.pageList[this.$store.getters.currentPage].componentList[newVal].dynamicTitle) {
          this.dynamicTitle = this.$store.getters.pageList[this.$store.getters.currentPage].componentList[newVal].dynamicTitle
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
    closeChoosePage() {
      this.chooseNextPage = false
    },
    // choosePage(page) {
    //   this.dynamicTitle.page = page
    // },
    chooseVal(val) {
      this.dynamicTitle.action = val
    },
    clickPage(index) {
      this.chooseNextPage = true
    },
    closePopup() {
      this.$emit('on-close')
    },
    confirm() {
      this.$store.dispatch('editComponent', { index: this.configIndex, pageListName: this.$store.getters.currentPage, key: 'dynamicTitle', value: this.dynamicTitle })
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
