<template>
  <div class="grid-config">
    <van-popup v-model="showPopup" :round="true" :style="{ width: '90%', height: '80%' }" :closeable="true" @close="closePopup">
      <div class="popup-content">
        <div class="form">
          底部导航图标设置
          <van-field
            name="新增"
            label="新增底部导航图标"
            readonly
            right-icon="add-o"
            @click="addData"
          />
          <van-swipe-cell v-for="(item,index) in tabbarList" :key="index">
            <van-field name="uploader" label="未选中图标上传">
              <template #input>
                <formUpload v-model="item.iconPath" />
              </template>
            </van-field>
            <van-field name="uploader" label="选中图标上传">
              <template #input>
                <formUpload v-model="item.selectedIconPath" />
              </template>
            </van-field>
            <van-field v-model="item.text" label="文字描述" placeholder="请输入文字" />
            <van-field :value="formatPageListShow(item)" label="跳转页面" placeholder="请选择跳转页面" readonly @click="clickPage(index)" />
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
    <!-- <page-list :show="chooseNextPage"
               @choose-page="choosePage"
               @on-close="closeChoosePage" /> -->
    <page-list v-if="chooseNextPage"
               :show="chooseNextPage"
               :func="!tabbarList[tempIndex].func||tabbarList[tempIndex].func==''? {}:tabbarList[tempIndex].func"
               :req="!tabbarList[tempIndex].req||tabbarList[tempIndex].req==''? {}:tabbarList[tempIndex].req"
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
      tabbarList: [
        {
          page: 'home',
          iconPath: require('@/assets/mobile/tabbar/school.png'),
          selectedIconPath: require('@/assets/mobile/tabbar/school_h.png'),
          text: '校园'
        },
        {
          page: 'class',
          iconPath: require('@/assets/mobile/tabbar/class.png'),
          selectedIconPath: require('@/assets/mobile/tabbar/class_h.png'),
          text: '班级'
        },
        {
          page: 'my',
          iconPath: require('@/assets/mobile/tabbar/my.png'),
          selectedIconPath: require('@/assets/mobile/tabbar/my_h.png'),
          text: '我的'
        }
      ],
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
        this.tabbarList = this.$store.getters.pageList[this.$store.getters.currentPage].componentList[newVal].tabbarList
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
    //   this.tabbarList[this.tempIndex].page = page
    // },
    chooseVal(val) {
      this.tabbarList[this.tempIndex] = formatPageListRes(this.tabbarList[this.tempIndex], val)
    },
    clickPage(index) {
      this.tempIndex = index
      this.chooseNextPage = true
    },
    closePopup() {
      this.$emit('on-close')
    },
    addData() {
      this.tabbarList.push({ iconPath: '', selectedIconPath: '', page: '', text: '' })
    },
    delData(index) {
      this.tabbarList.splice(index, 1)
    },
    confirm() {
      this.$store.dispatch('editComponent', { index: this.configIndex, pageListName: this.$store.getters.currentPage, key: 'tabbarList', value: this.tabbarList })
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
