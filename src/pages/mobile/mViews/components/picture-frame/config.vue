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
            <van-field v-model="item.page" label="跳转页面" placeholder="请选择跳转页面" readonly @click="clickPage(index)" />
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
    <page-list :show="chooseNextPage"
               @choose-page="choosePage"
               @on-close="closeChoosePage" />
  </div>
</template>

<script>
import _ from 'lodash'
import pageList from '../pagelist/index123.vue'
import formUpload from '../upload'
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
      shadowBoxList: [{
        imageUrl: require('@/assets/mobile/shadow-box/new.png'),
        page: 'school-dynamic-list',
        text: '校园动态'
      }, {
        imageUrl: require('@/assets/mobile/shadow-box/school-photo.png'),
        page: '',
        text: '校园风采'
      }, {
        imageUrl: require('@/assets/mobile/shadow-box/general-notice.png'),
        page: 'common-notice',
        text: '一般通知'
      }, {
        imageUrl: require('@/assets/mobile/shadow-box/emegency-notice.png'),
        page: '',
        text: '紧急通知'
      }, {
        imageUrl: require('@/assets/mobile/shadow-box/welcome.png'),
        page: '',
        text: '欢迎词'
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
    closeChoosePage() {
      this.chooseNextPage = false
    },
    choosePage(page) {
      this.shadowBoxList[this.tempIndex].page = page
    },
    clickPage(index) {
      this.tempIndex = index
      this.chooseNextPage = true
    },
    closePopup() {
      this.$emit('on-close')
    },
    addData() {
      this.shadowBoxList.push({ imageUrl: '', page: '', text: '' })
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
