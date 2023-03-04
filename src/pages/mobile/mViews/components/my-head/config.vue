<template>
  <div class="swipe-config">
    <van-popup v-model="showPopup" :round="true" :style="{ width: '90%', height: '80%' }" :closeable="true" @close="closePopup">
      <div class="popup-content">
        <div class="form">
          指定显示参数设置
          <van-field
            v-model="specialData.avatar"
            readonly
            name="avatar"
            label="avatar"
            @click="chooseSpecial('avatar')"
          />
          <van-field
            v-model="specialData.name"
            readonly
            name="name"
            label="name"
            @click="chooseSpecial('name')"
          />
          <div style="margin: 16px;">
            <van-button round block type="info" native-type="submit" @click="confirm">确定</van-button>
          </div>
        </div>
      </div>
    </van-popup>
    <tree :show="showSpecialTree" :list="specialTree" @result="chooseResult"
          @on-close="closePage" />
  </div>
</template>

<script>
import { splitTreeRes, formatTree } from '@/mUtils'
// import _ from 'lodash'
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
      specialData: {
        avatar: '',
        name: ''
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
        if (this.$store.getters.pageList[this.$store.getters.currentPage].componentList[newVal].specialData) {
          this.specialData = this.$store.getters.pageList[this.$store.getters.currentPage].componentList[newVal].specialData
          // for (const item of this.request.data) {
          //   item.value = JSON.stringify(item.value)
          // }
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
    closePage() {
      this.showSpecialTree = false
    },
    chooseResult(val) {
      if (this.treeMode === 'special') {
        this.specialData[this.specialIndex] = val.data
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
    confirm() {
      // const tempRequest = _.cloneDeep(this.request)
      // console.log('变化前的的结果是', tempRequest)
      // for (const item of tempRequest.data) {
      //   item.value = JSON.parse(item.value)
      // }
      this.$store.dispatch('editComponent', { index: this.configIndex, pageListName: this.$store.getters.currentPage, key: 'specialData', value: this.specialData })
      // console.log('最后的结果是', tempRequest)
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
