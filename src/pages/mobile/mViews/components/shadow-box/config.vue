<template>
  <div class="grid-config">
    <van-popup v-model="showPopup" :round="true" :style="{ width: '90%', height: '80%' }" :closeable="true" @close="closePopup">
      <div class="popup-content">
        <div class="form">
          阴影导航图标设置
          <van-field
            name="新增"
            label="新增阴影导航图标"
            readonly
            right-icon="add-o"
            @click="addData"
          />
          <van-swipe-cell v-for="(item,index) in shadowBoxList" :key="index">
            <van-field name="uploader" label="图标上传">
              <template #input>
                <formUpload v-model="item.imageUrl" />
              </template>
            </van-field>
            <van-field v-model="item.text" label="文字描述" placeholder="请输入文字" />
            <van-field :value="formatPageListShow(item)" label="跳转页面" placeholder="请选择跳转页面" readonly @click="clickPage(index)" />
            <van-field :value="formatAuthShow(item.auth || [])" label="权限" placeholder="请选择显示权限" readonly @click="clickAuth(index)" />
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
    <tree :show="showTree" :list="treeList" text="name" return-type="node" :multiple="true" :check-on-select="true" @result="chooseResult"
          @on-close="closePage" />
    <!-- <page-list :show="chooseNextPage"
               @choose-page="choosePage"
               @on-close="closeChoosePage" /> -->
    <page-list v-if="chooseNextPage"
               :show="chooseNextPage"
               :func="!shadowBoxList[tempIndex].func||shadowBoxList[tempIndex].func==''? {}:shadowBoxList[tempIndex].func"
               :req="!shadowBoxList[tempIndex].req||shadowBoxList[tempIndex].req==''? {}:shadowBoxList[tempIndex].req"
               :page="!shadowBoxList[tempIndex].page||shadowBoxList[tempIndex].page==''? '':shadowBoxList[tempIndex].page"
               :action="!shadowBoxList[tempIndex].action||shadowBoxList[tempIndex].action==''? {}:shadowBoxList[tempIndex].action"
               @result="chooseVal"
               @on-close="closeChoosePage" />
  </div>
</template>

<script>
import _ from 'lodash'
import pageList from '../pagelist/index123.vue'
import formUpload from '../upload'
import { formatPageListShow, formatAuthShow } from '@/mUtils'
import { AUTHS_TREE } from '@/mUtils/auth'
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
      shadowBoxList: [],
      tempIndex: -1,
      authIndex: -1,
      chooseNextPage: false,
      jumpPage: '',
      showTree: false,
      treeList: []
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
        if (this.$store.getters.pageList[this.$store.getters.currentPage].componentList[newVal].shadowBoxList) {
          this.shadowBoxList = _.cloneDeep(this.$store.getters.pageList[this.$store.getters.currentPage].componentList[newVal].shadowBoxList)
        }
        console.log('获取到的shadowBoxList', this.shadowBoxList)
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
    formatAuthShow,
    clickAuth(index) {
      this.authIndex = index
      this.showTree = true
      // this.treeList = formatTreeSelected([AUTHS_TREE])
      this.treeList = [AUTHS_TREE]
      console.log('权限树是', this.treeList)
    },
    closePage() {
      this.showTree = false
    },
    chooseResult(value) {
      this.shadowBoxList[this.authIndex].auth = []
      for (const item of value.data) {
        this.shadowBoxList[this.authIndex].auth.push({
          id: item.id,
          text: item.data.text
        })
      }
    },
    closeChoosePage() {
      this.chooseNextPage = false
    },
    // choosePage(page) {
    //   this.shadowBoxList[this.tempIndex].page = page
    // },
    // clickPage(index) {
    //   this.tempIndex = index
    //   this.chooseNextPage = true
    // },
    chooseVal(val) {
      this.shadowBoxList[this.tempIndex].action = val
    },
    clickPage(index) {
      this.tempIndex = index
      this.chooseNextPage = true
    },
    closePopup() {
      this.$emit('on-close')
    },
    addData() {
      this.shadowBoxList.push({ imageUrl: '', action: '', text: '' })
    },
    delData(index) {
      this.shadowBoxList.splice(index, 1)
    },
    confirm() {
      this.$store.dispatch('editComponent', { index: this.configIndex, pageListName: this.$store.getters.currentPage, key: 'shadowBoxList', value: this.shadowBoxList })
      this.$emit('on-close')
    }
  }

}
</script>

<style lang='scss' scoped>
.grid-config {
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
