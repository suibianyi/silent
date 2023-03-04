<template>
  <div class="cell-config">
    <van-popup v-model="showPopup" :round="true" :style="{ width: '90%', height: '80%' }" :closeable="true" @close="closePopup">
      <div class="form">
        单元格设置
        <van-field
          name="新增"
          label="新增单元格"
          readonly
          right-icon="add-o"
          @click="addData"
        />
        <van-swipe-cell v-for="(item,index) in cellList" :key="index">
          <van-field name="uploader" label="图标上传">
            <template #input>
              <formUpload v-model="item.icon" />
            </template>
          </van-field>
          <van-field v-model="item.title" label="文字描述" placeholder="请输入文字" />
          <van-field :value="formatPageListShow(item)" label="跳转页面" placeholder="请选择跳转页面" readonly @click="clickPage(index)" />
          <template #right>
            <van-button square text="删除" type="danger" class="delete-button" @click="delData(index)" />
          </template>
        </van-swipe-cell>
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
               :func="!cellList[tempIndex].func||cellList[tempIndex].func==''? {}:cellList[tempIndex].func"
               :req="!cellList[tempIndex].req||cellList[tempIndex].req==''? {}:cellList[tempIndex].req"
               @choose-page="chooseVal"
               @choose-func="chooseVal"
               @choose-req="chooseVal"
               @on-close="closeChoosePage" />
  </div>
</template>

<script>
import pageList from '../pagelist/index123.vue'
import formUpload from '../upload'
import { formatPageListShow, formatPageListRes } from '@/mUtils'
export default {
  components: {
    pageList,
    formUpload
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
      cellList: [{
        icon: 'location-o',
        title: '帮助中心',
        page: 'home',
        func: {}
      }, {
        icon: 'location-o',
        title: '退出登录',
        page: 'home',
        func: {}
      }],
      tempIndex: -1,
      chooseNextPage: false
    }
  },
  computed: {
  },
  watch: {
    show: {
      handler(newVal) {
        console.log('jieshou:', newVal)
        this.showPopup = newVal
      },
      deep: true,
      immediate: true
    },
    configIndex: {
      handler(newVal) {
        const val = this.$store.getters.pageList[this.$store.getters.currentPage].componentList[newVal]
        if (val.cellList && val.cellList.length) {
          this.cellList = val.cellList
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
    //   this.cellList[this.tempIndex].page = page
    // },
    chooseVal(val) {
      this.cellList[this.tempIndex] = formatPageListRes(this.cellList[this.tempIndex], val)
    },
    clickPage(index) {
      this.tempIndex = index
      this.chooseNextPage = true
    },
    closePopup() {
      this.$emit('on-close')
    },
    addData() {
      this.cellList.push({ imageUrl: '', page: '', text: '' })
    },
    delData(index) {
      this.cellList.splice(index, 1)
    },
    confirm() {
      this.$store.dispatch('editComponent', { index: this.configIndex, pageListName: this.$store.getters.currentPage, key: 'cellList', value: this.cellList })
      this.$emit('on-close')
    }
  }

}
</script>

<style lang='scss' scoped>
.cell-config {
    padding: 10px 10px 0px 10px;
    .form {
      margin: 20px;
      .delete-button {
       height: 100%;
      }
    }
}
</style>
