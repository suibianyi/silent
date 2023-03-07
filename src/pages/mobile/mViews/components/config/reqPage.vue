<template>
  <div class="req-config">
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
            <van-radio name="1">get</van-radio>
            <van-radio name="2">post</van-radio>
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
      <div style="margin: 16px;">
        <van-button round block type="info" native-type="submit" @click="confirm">确定</van-button>
      </div>
    </div>
    <tree :show="showTree" :list="treeList" @result="chooseResult"
          @on-close="closePage" />
    <tree :show="showSpecialTree" :list="specialTree" @result="chooseResult"
          @on-close="closePage" />
  </div>
</template>

<script>
import { formatTree } from '@/mUtils'
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
    configIndex: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      showTree: false,
      showSpecialTree: false,
      treeList: [],
      specialIndex: -1,
      specialTree: [],
      treeMode: '',
      request: {
        id: '',
        url: '',
        method: 'get',
        data: [],
        specialData: []
      }
    }
  },
  computed: {
  },
  watch: {
    configIndex: {
      handler(newVal) {
        if (this.$store.getters.pageList[this.$store.getters.currentPage].requestData && this.$store.getters.pageList[this.$store.getters.currentPage].requestData[newVal]) {
          this.request = this.$store.getters.pageList[this.$store.getters.currentPage].requestData[newVal]
          for (const item of this.request.data) {
            item.value = JSON.stringify(item.value)
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
      }
    },
    chooseSpecial(index) {
      this.specialIndex = index
      this.treeMode = 'special'
      this.specialTree = this.formatTree(this.$store.getters.storage)
      this.showSpecialTree = true
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
      if (!this.request.id || this.request.id === '') {
        this.request.id = Math.random().toString(36).slice(-8)
      }
      this.$store.dispatch('editRequestData', { index: this.configIndex, pageListName: this.$store.getters.currentPage, key: this.request.id, value: this.request })
      console.log('最后的结果是', tempRequest)
      this.$emit('on-close')
    }
  }

}
</script>

<style lang='scss' scoped>
.req-config {
    .popup-content {
      margin-top: 10px
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
