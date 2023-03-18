<template>
  <div class="grid-config">
    <van-popup v-model="showPopup" :round="true" :style="{ width: '90%', height: '80%' }" :closeable="true" @close="closePopup">
      <div class="popup-content">
        <div class="form">
          多眼图设置
          <van-field
            name="新增"
            label="新增多眼图"
            readonly
            right-icon="add-o"
            @click="addData"
          />
          <van-swipe-cell v-for="(item,index) in gridList" :key="index">
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
          <van-field v-model="gridColumnNum" label="一行个数" placeholder="一行显示多少个图标" />
          <div style="margin: 16px;">
            <van-button round block type="info" native-type="submit" @click="confirm">确定</van-button>
          </div>
        </div>
      </div>
    </van-popup>
    <tree :show="showTree" :list="treeList" text="name" return-type="node" :multiple="true" :check-on-select="true" @result="chooseResult"
          @on-close="closePage" />
    <page-list v-if="chooseNextPage"
               :show="chooseNextPage"
               :func="!gridList[tempIndex].func||gridList[tempIndex].func==''? {}:gridList[tempIndex].func"
               :req="!gridList[tempIndex].req||gridList[tempIndex].req==''? {}:gridList[tempIndex].req"
               :page="!gridList[tempIndex].page||gridList[tempIndex].page==''? '':gridList[tempIndex].page"
               :action="!gridList[tempIndex].action||gridList[tempIndex].action==''? {}:gridList[tempIndex].action"
               @result="chooseVal"
               @on-close="closeChoosePage" />
  </div>
</template>

<script>
import pageList from '../pagelist/index123.vue'
import tree from '../tree/index123.vue'
import formUpload from '../upload'
import { formatPageListShow, formatAuthShow } from '@/mUtils'
import { AUTHS_TREE } from '@/mUtils/auth'
export default {
  components: {
    tree,
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
      gridList: [{
        imageUrl: require('@/assets/mobile/grid-nav/release-info.png'),
        page: 'information',
        text: '信息发布'
      }, {
        imageUrl: require('@/assets/mobile/grid-nav/patch-approval.png'),
        page: '',
        text: '信息审核'
      }, {
        imageUrl: require('@/assets/mobile/grid-nav/appointment.png'),
        page: '',
        text: '场地预约'
      }],
      tempIndex: -1,
      gridColumnNum: 4,
      chooseNextPage: false,
      authIndex: -1,
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
        const val = this.$store.getters.pageList[this.$store.getters.currentPage].componentList[newVal]
        if (val.gridList && val.gridList.length) {
          this.gridList = val.gridList
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
      this.gridList[this.authIndex].auth = []
      for (const item of value.data) {
        this.gridList[this.authIndex].auth.push({
          id: item.id,
          text: item.data.text
        })
      }
    },
    closeChoosePage() {
      this.chooseNextPage = false
    },
    chooseVal(val) {
      this.gridList[this.tempIndex].action = val
    },
    clickPage(index) {
      this.tempIndex = index
      this.chooseNextPage = true
    },
    closePopup() {
      this.$emit('on-close')
    },
    addData() {
      this.gridList.push({ imageUrl: '', action: '', text: '', auth: [] })
    },
    delData(index) {
      this.gridList.splice(index, 1)
    },
    confirm() {
      this.$store.dispatch('editComponent', { index: this.configIndex, pageListName: this.$store.getters.currentPage, key: 'gridList', value: this.gridList })
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
