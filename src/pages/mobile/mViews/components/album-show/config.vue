<template>
  <div class="dynamic-config">
    <van-popup v-model="showPopup" :round="true" :style="{ width: '90%', height: '80%' }" :closeable="true" @close="closePopup">
      <div class="popup-content">
        <div class="form">
          请求参数设置
          <van-field
            v-model="request.url"
            name="url"
            label="url"
            placeholder="请输入请求地址"
            :rules="[{ required: true, message: '请输入请求地址' }]"
          />
          <van-field name="radio" label="method">
            <template #input>
              <van-radio-group v-model="request.method" direction="horizontal">
                <van-radio name="get">get</van-radio>
                <van-radio name="post">post</van-radio>
              </van-radio-group>
            </template>
          </van-field>
          <van-field
            name="固定请求参数"
            label="固定请求参数"
            right-icon="add-o"
            @click="addData"
          />
          <div v-for="(item,index) in request.data" :key="index" class="key-value">
            <div :style="{ width: '48%' }">
              <van-field v-model="item.key" placeholder="key" />
            </div>
            <div :style="{ width: '48%' }">
              <van-field v-model="item.value" placeholder="value" />
            </div>
            <div class="delete-button">
              <van-icon name="close" :size="20" @click="delData(index)" />
            </div>
          </div>
          <van-field
            name="动态请求参数"
            label="动态请求参数"
            right-icon="add-o"
            @click="addSpecialData"
          />
          <div v-for="(item,index) in request.specialData" :key="index+1024" class="key-value">
            <div :style="{ width: '48%' }">
              <van-field v-model="item.key" placeholder="key" />
            </div>
            <div :style="{ width: '48%' }">
              <van-field v-model="item.value" placeholder="value" @click="chooseSpecial(index)" />
            </div>
            <div class="delete-button">
              <van-icon name="close" :size="20" @click="delSpecialData(index)" />
            </div>
          </div>
          <!-- <div style="margin: 16px;">
          <van-button round block type="info" native-type="submit" @click="query">请求</van-button>
        </div> -->
          请求结果解析设置
          <van-field
            v-model="response.thumbList"
            readonly
            name="thumbList"
            label="图片"
            @click="query('thumb')"
          />
          <van-field
            v-model="response.thumbListCor"
            readonly
            name="对应字段"
            label="对应字段"
            @click="query('thumb')"
          />
          <van-field v-model="jumpPage" label="跳转页面" placeholder="请选择跳转页面" readonly @click="clickPage('page')" />
          <van-field :value="formatPageListShow(edit)" label="编辑选择" placeholder="请选择功能" readonly @click="clickPage('edit')" />
          <van-field :value="formatPageListShow(del)" label="删除选择功能" placeholder="请选择功能" readonly @click="clickPage('del')" />
          <div style="margin: 16px;">
            <van-button round block type="info" native-type="submit" @click="confirm">确定</van-button>
          </div>
        </div>
      </div>
    </van-popup>
    <tree :show="showTree" :list="treeList" @result="chooseResult"
          @on-close="closePage" />
    <tree :show="showSpecialTree" :list="specialTree" @result="chooseResult"
          @on-close="closePage" />
    <!-- <page-list :show="chooseNextPage"
               @choose-page="choosePage"
               @on-close="closeChoosePage" /> -->
    <page-list v-if="chooseNextPage"
               :show="chooseNextPage"
               :func="!tempPageList.func||tempPageList.func==''?{}:tempPageList.func"
               :req="!tempPageList.req||tempPageList.req==''?{}:tempPageList.req"
               :action="!tempPageList.action||tempPageList.action==''? {}:tempPageList.action"
               @result="chooseVal"
               @on-close="closeChoosePage" />
  </div>
</template>

<script>
import {
  splitTreeRes,
  formatTree
} from '@/mUtils'
import { formatPageListShow } from '@/mUtils'
import {
  mRequest
} from '@/api/request'
import _ from 'lodash'
import tree from '../tree/index123.vue'
import pageList from '../pagelist/index123.vue'
export default {
  components: {
    pageList,
    tree
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
      showTree: false,
      treeList: [],
      showSpecialTree: false,
      specialIndex: -1,
      specialTree: [],
      treeMode: '',
      choose: '',
      request: {
        url: '',
        method: 'get',
        data: [],
        specialData: []
      },
      response: {
        // descList: 'data.list',
        // descListCor: 'creator.account',
        // titleList: 'data.list',
        // titleListCor: 'title',
        thumbList: 'data.list',
        thumbListCor: 'image'
      },
      jumpPage: '',
      edit: {
        text: '',
        page: '',
        func: {
          method: ''
        }
      },
      del: {
        text: '',
        page: '',
        func: {
          method: ''
        }
      },
      tempPageList: {},
      model: '',
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
        if (this.$store.getters.pageList[this.$store.getters.currentPage].componentList[newVal].request) {
          this.request = _.cloneDeep(this.$store.getters.pageList[this.$store.getters.currentPage].componentList[newVal].request)
          for (const item of this.request.data) {
            item.value = JSON.stringify(item.value)
          }
        }
        if (this.$store.getters.pageList[this.$store.getters.currentPage].componentList[newVal].response) {
          this.response = this.$store.getters.pageList[this.$store.getters.currentPage].componentList[newVal].response
        }
        if (this.$store.getters.pageList[this.$store.getters.currentPage].componentList[newVal].jumpPage) {
          this.jumpPage = this.$store.getters.pageList[this.$store.getters.currentPage].componentList[newVal].jumpPage
        }
        if (this.$store.getters.pageList[this.$store.getters.currentPage].componentList[newVal].edit) {
          this.edit = this.$store.getters.pageList[this.$store.getters.currentPage].componentList[newVal].edit
        }
        if (this.$store.getters.pageList[this.$store.getters.currentPage].componentList[newVal].del) {
          this.del = this.$store.getters.pageList[this.$store.getters.currentPage].componentList[newVal].del
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
    //   this.jumpPage = page
    // },
    chooseVal(val) {
      this.tempPageList = val
      if (this.model === 'page') {
        this.jumpPage.action = this.tempPageList
      }
      if (this.model === 'del') {
        this.del.action = this.tempPageList
      }
      if (this.model === 'edit') {
        this.edit.action = this.tempPageList
      }
    },
    clickPage(val) {
      this.model = val
      if (val === 'edit') {
        this.tempPageList = this.edit
      }
      if (val === 'del') {
        this.tempPageList = this.del
      }
      if (val === 'page') {
        this.tempPageList = { page: this.jumpPage }
      }
      this.chooseNextPage = true
    },
    formatTree,
    async query(val) {
      this.choose = val
      const sendata = {}
      for (const item of this.request.specialData) {
        sendata[item.key] = this.$store.getters.storage[item.value]
        console.log('让我来看看这里面有什么', this.$store.getters.storage)
      }
      for (const item of this.request.data) {
        sendata[item.key] = JSON.parse(item.value)
      }
      const res = await mRequest({
        url: this.request.url,
        method: this.request.method,
        data: sendata
      })
      console.log('请求回来的结果是', res)
      console.log('格式化的结果是', this.formatTree(res))
      this.treeList = this.formatTree(res)
      this.treeMode = 'normal'
      this.showTree = true
    },
    closePage() {
      this.showTree = false
      this.showSpecialTree = false
    },
    chooseResult(val) {
      if (this.treeMode === 'special') {
        this.request.specialData[this.specialIndex].value = val.data
      } else {
        const str = splitTreeRes(val.data)
        console.log('格式化后的str是', str)
        if (this.choose === 'thumb') {
          this.response.thumbList = str.list
          this.response.thumbListCor = str.cor
        }
        if (this.choose === 'desc') {
          this.response.descList = str.list
          this.response.descListCor = str.cor
        }
        if (this.choose === 'title') {
          this.response.titleList = str.list
          this.response.titleListCor = str.cor
        }
      }
    },
    chooseSpecial(index) {
      this.specialIndex = index
      this.treeMode = 'special'
      this.specialTree = this.formatTree(this.$store.getters.storage)
      this.showSpecialTree = true
    },
    closePopup() {
      this.$emit('on-close')
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
    confirm() {
      const tempRequest = _.cloneDeep(this.request)
      console.log('变化前的的结果是', tempRequest)
      for (const item of tempRequest.data) {
        item.value = JSON.parse(item.value)
      }
      this.$store.dispatch('editComponent', { index: this.configIndex, pageListName: this.$store.getters.currentPage, key: 'request', value: tempRequest })
      this.$store.dispatch('editComponent', { index: this.configIndex, pageListName: this.$store.getters.currentPage, key: 'response', value: this.response })
      this.$store.dispatch('editComponent', { index: this.configIndex, pageListName: this.$store.getters.currentPage, key: 'jumpPage', value: this.jumpPage })
      this.$store.dispatch('editComponent', { index: this.configIndex, pageListName: this.$store.getters.currentPage, key: 'del', value: this.del })
      this.$store.dispatch('editComponent', { index: this.configIndex, pageListName: this.$store.getters.currentPage, key: 'edit', value: this.edit })
      console.log('最后的结果是', tempRequest)
      this.$emit('on-close')
    }
  }

}
</script>

<style lang='scss' scoped>
.dynamic-config {
    padding: 10px 10px 0px 10px;
    .popup-content {
      margin-top: 30px
    }
    .form {
      margin: 20px;
      .key-value {
        display: flex;
      }
      .delete-button {
       width: 5%;
       height: 27px;
       display: flex;
       align-items: center;
        justify-content: center;
      }
    }
}
</style>
