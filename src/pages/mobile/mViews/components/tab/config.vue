<template>
  <div class="grid-config">
    <van-popup v-model="showPopup" :round="true" :style="{ width: '90%', height: '80%' }" :closeable="true" @close="closePopup">
      <div class="popup-content">
        <div class="form">
          tab设置
          <van-field
            name="新增"
            label="新增tab"
            readonly
            right-icon="add-o"
            @click="addData"
          />
          <van-swipe-cell v-for="(item,index) in tab.tabList" :key="index">
            <van-field v-model="item.title" label="文字描述" placeholder="请输入文字" />
            <van-field v-model="item.value" label="变更的值" placeholder="变更的值" />
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
  </div>
</template>

<script>
import _ from 'lodash'
export default {
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
      tab: {
        tabList: []
      },
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
        if (this.$store.getters.pageList[this.$store.getters.currentPage].componentList[newVal].tab && this.$store.getters.pageList[this.$store.getters.currentPage].componentList[newVal].tab.tabList.length) {
          this.tab = _.cloneDeep(this.$store.getters.pageList[this.$store.getters.currentPage].componentList[newVal].tab)
        }
        console.log('获取到的tab.tabList', this.tab)
      },
      deep: true,
      immediate: true
    }
  },
  mounted() {
    console.log('show', this.show)
  },
  methods: {
    closePopup() {
      this.$emit('on-close')
    },
    addData() {
      this.tab.tabList.push({ title: '', value: '' })
    },
    delData(index) {
      this.tab.tabList.splice(index, 1)
    },
    confirm() {
      this.$store.dispatch('editComponent', { index: this.configIndex, pageListName: this.$store.getters.currentPage, key: 'tab', value: this.tab })
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
