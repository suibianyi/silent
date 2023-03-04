<template>
  <div class="swipe-config">
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
          <van-swipe-cell v-for="(item,index) in request.data" :key="index">
            <div class="key-value">
              <div :style="{ width: '48%' }">
                <van-field v-model="item.key" placeholder="key" />
              </div>
              <div :style="{ width: '48%' }">
                <van-field v-model="item.value" placeholder="value" />
              </div>
            </div>
            <template #right>
              <van-button square text="删除" type="danger" class="delete-button" @click="delData(index)" />
            </template>
          </van-swipe-cell>
          <van-field
            name="动态请求参数"
            label="动态请求参数"
            right-icon="add-o"
            @click="addSpecialData"
          />
          <van-swipe-cell v-for="(item,index) in request.specialData" :key="index+1024">
            <div class="key-value">
              <div :style="{ width: '48%' }">
                <van-field v-model="item.key" placeholder="key" />
              </div>
              <div :style="{ width: '48%' }">
                <van-field v-model="item.value" placeholder="value" @click="chooseSpecial(index)" />
              </div>
            </div>
            <template #right>
              <van-button square text="删除" type="danger" class="delete-button" @click="delSpecialData(index)" />
            </template>
          </van-swipe-cell>
          <!-- <div style="margin: 16px;">
          <van-button round block type="info" native-type="submit" @click="query">请求</van-button>
        </div> -->
          请求结果解析设置
          <van-field
            v-model="response.swipeList"
            readonly
            name="url"
            label="swipeList"
            @click="query"
          />
          <van-field
            v-model="response.swipeListCor"
            readonly
            name="对应字段"
            label="对应字段"
            @click="query"
          />
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
  </div>
</template>

<script>
import { splitTreeRes, formatTree } from '@/mUtils'
import {
  mRequest
} from '@/api/request'
import _ from 'lodash'
import tree from '../tree/index123.vue'
export default {
  components: {
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
      showSpecialTree: false,
      treeList: [],
      specialIndex: -1,
      specialTree: [],
      treeMode: '',
      request: {
        url: '',
        method: 'get',
        data: [],
        specialData: []
      },
      response: {
        swipeList: '',
        swipeListCor: ''
      }
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
        console.log('我们来看看this.request', this.$store.getters.pageList[this.$store.getters.currentPage].componentList[newVal])
        if (this.$store.getters.pageList[this.$store.getters.currentPage].componentList[newVal].request) {
          this.request = _.cloneDeep(this.$store.getters.pageList[this.$store.getters.currentPage].componentList[newVal].request)
          for (const item of this.request.data) {
            item.value = JSON.stringify(item.value)
          }
        }
        if (this.$store.getters.pageList[this.$store.getters.currentPage].componentList[newVal].response) {
          this.response = this.$store.getters.pageList[this.$store.getters.currentPage].componentList[newVal].response
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
    formatTree,
    async query() {
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
        this.response.swipeList = str.list
        this.response.swipeListCor = str.cor
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
      console.log('最后的结果是', tempRequest)
      this.$emit('on-close')
    }
  }

}
</script>

<style lang='scss' scoped>
.swipe-config {
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
       height: 100%;
      }
    }
}
</style>
