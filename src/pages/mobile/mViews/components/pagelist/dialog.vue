<template>
  <div class="action-sheet-config">
    <van-popup v-model="showPopup" :round="true" :style="{ width: '90%', height: '80%' }" :closeable="true" @close="closePopup">
      <div class="popup-content">
        <div class="form">
          对话框组件配置
          <van-field v-model="dialog.title" label="标题" placeholder="请输入标题" />
          <van-field v-model="dialog.text" label="文字描述" placeholder="请输入文字" />
          <van-field :value="formatPageListShow(dialog)" label="跳转页面" placeholder="请选择跳转页面" readonly @click="clickPage(index)" />
          <div style="margin: 16px;">
            <van-button round block type="info" native-type="submit" @click="confirm">确定</van-button>
          </div>
        </div>
      </div>
    </van-popup>
    <page-list v-if="chooseNextPage"
               :show="chooseNextPage"
               :func="!dialog.func||dialog.func==''? {}:dialog.func"
               :req="!dialog.req||dialog.req==''? {}:dialog.req"
               @choose-page="chooseVal"
               @choose-func="chooseVal"
               @choose-req="chooseVal"
               @on-close="closeChoosePage" />
  </div>
</template>

<script>
import { formatPageListShow, formatPageListRes } from '@/mUtils'
export default {
  components: {
    pageList: () => import('./index123.vue')
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
    value: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data() {
    return {
      showPopup: false,
      dialog: {
        title: '',
        text: '',
        page: ''
      },
      tempIndex: -1,
      chooseNextPage: false,
      showText: ''
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
    value: {
      handler(newVal) {
        this.dialog = newVal
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
    chooseVal(val) {
      this.dialog = formatPageListRes(this.dialog, val)
    },
    clickPage(index) {
      this.tempIndex = index
      this.chooseNextPage = true
    },
    closePopup() {
      this.$emit('on-close')
    },
    confirm() {
      this.$emit('input', this.dialog)
      this.$emit('confirm', this.dialog)
      this.$emit('on-close')
    }
  }

}
</script>

<style lang='scss' scoped>
.action-sheet-config {
    padding: 10px 10px 0px 10px;
    .popup-content {
      margin-top: 30px
    }
    .form {
      margin: 20px;
      .delete-button {
       height: 100%;
      }
    }
}
</style>
