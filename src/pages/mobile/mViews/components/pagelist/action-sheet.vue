<template>
  <div class="action-sheet-config">
    <van-popup v-model="showPopup" :round="true" :style="{ width: '90%', height: '80%' }" :closeable="true" @close="closePopup">
      <div class="popup-content">
        <div class="form">
          弹出组件配置
          <van-field
            name="新增"
            label="新增内容"
            readonly
            right-icon="add-o"
            @click="addData"
          />
          <van-swipe-cell v-for="(item,index) in actionShetList" :key="index">
            <van-field v-model="item.name" label="文字描述" placeholder="请输入文字" />
            <van-field :value="formatPageListShow(item)" label="跳转页面" placeholder="请选择跳转页面" readonly @click="clickPage(index)" />
            <template #right>
              <van-button square text="删除" type="danger" class="delete-button" @click="delData(index)" />
            </template>
          </van-swipe-cell>
          <div style="margin: 16px;">
            <van-button round block type="info" native-type="submit" @click="confirm">确定</van-button>
          </div>
        </div>
      </div>
    </van-popup>
    <page-list v-if="chooseNextPage"
               :show="chooseNextPage"
               :func="!actionShetList[tempIndex].func||actionShetList[tempIndex].func==''? {}:actionShetList[tempIndex].func"
               :req="!actionShetList[tempIndex].req||actionShetList[tempIndex].req==''? {}:actionShetList[tempIndex].req"
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
      actionShetList: [{
        page: 'information',
        name: '信息发布'
      }, {
        page: '',
        name: '信息审核'
      }, {
        page: '',
        name: '场地预约'
      }],
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
        this.actionShetList = newVal
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
      this.actionShetList[this.tempIndex] = formatPageListRes(this.actionShetList[this.tempIndex], val)
    },
    clickPage(index) {
      this.tempIndex = index
      this.chooseNextPage = true
    },
    closePopup() {
      this.$emit('on-close')
    },
    addData() {
      this.actionShetList.push({ page: '', name: '' })
    },
    delData(index) {
      this.actionShetList.splice(index, 1)
    },
    confirm() {
      console.log('actionsheetinput的结果是', this.actionShetList)
      this.$emit('input', this.actionShetList)
      this.$emit('confirm', this.actionShetList)
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
