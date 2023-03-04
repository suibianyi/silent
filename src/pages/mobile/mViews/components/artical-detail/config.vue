<template>
  <div class="artical-config">
    <van-popup v-model="showPopup" :round="true" :style="{ width: '100%', height: '100%' }" :closeable="true" @close="closePopup">
      <div class="popup-content">
        <van-tabs v-model="active" sticky>
          <!-- <van-tab title="请求数据">
            <req-page :config-index="configIndex" @on-close="closeConfigDialog" />
          </van-tab>
          <van-tab title="配置参数">
            <set-page :config-index="configIndex" @on-close="closeConfigDialog" />
          </van-tab> -->
          <van-tab title="配置参数">
            <div class="form">
              文章内容设置
              <van-field v-model="articalDetail.title" label="标题" @click="chooseSpecial(1)" />
              <van-field v-model="articalDetail.thumb" label="图片" @click="chooseSpecial(2)" />
              <van-field v-model="articalDetail.desc" label="内容" readonly @click="chooseSpecial(3)" />
              <div style="margin: 16px;">
                <van-button round block type="info" native-type="submit" @click="confirmReference">确定</van-button>
              </div>
            </div>
          </van-tab>
        </van-tabs>
      </div>
    </van-popup>
    <tree :show="showSpecialTree" :list="specialTree" @result="chooseResult"
          @on-close="closePage" />
  </div>
</template>

<script>
import { formatTree } from '@/mUtils'
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
      active: 0,
      showSpecialTree: false,
      specialTree: [],
      articalDetail: {
        desc: '',
        title: '',
        thumb: '',
        page: ''
      }
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
        if (val.articalDetail) {
          this.articalDetail = val.articalDetail
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
    chooseSpecial(index) {
      this.specialIndex = index
      this.specialTree = this.formatTree(this.$store.getters.storage)
      this.showSpecialTree = true
    },
    chooseResult(val) {
      if (this.specialIndex === 1) {
        this.articalDetail.title = val.data
      }
      if (this.specialIndex === 2) {
        this.articalDetail.thumb = val.data
      }
      if (this.specialIndex === 3) {
        this.articalDetail.desc = val.data
      }
    },
    closePage() {
      this.showSpecialTree = false
    },
    closePopup() {
      this.$emit('on-close')
    },
    closeConfigDialog() {
      this.$emit('on-close')
    },
    confirmReference() {
      console.log('我惦记确定了看看结果', this.articalDetail)
      this.$store.dispatch('editComponent', { index: this.configIndex, pageListName: this.$store.getters.currentPage, key: 'reference', value: this.articalDetail })
      this.$emit('on-close')
    }
  }

}
</script>

<style lang='scss' scoped>

</style>
