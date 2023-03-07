<template>
  <div class="dynamic">
    <van-list
      v-model="dynamic.loading"
      :finished="dynamic.finished"
      finished-text="没有更多了"
      @load="onLoad"
    >
      <van-card v-for="(value,index) in dynamic.dynamicList" :key="value.title+index" :title="value.title" :desc="value.desc" :thumb="value.thumb"
                @click="switchPic(value)"
      />
    </van-list>
  </div>
</template>

<script>

const components = {}
export default {
  props: {
    id: {
      type: String,
      default: ''
    }
  },
  data() {
    return {

    }
  },
  computed: {
    dynamic() {
      console.log('这里拿到的dynamic', this.$store.getters.dynamic[this.id] || this.$store.getters.dynamic.default)
      return this.$store.getters.dynamic[this.id] || this.$store.getters.dynamic.default
    }
  },
  mounted() {
  },
  methods: {
    onLoad() {
      this.$store.dispatch('loadDynamic', { id: this.id })
    },
    closePage() {
      this.showSpecialTree = false
    },
    confirm() {
      this.$store.dispatch('editComponent', { index: this.configIndex, pageListName: this.$store.getters.currentPage, key: 'request', value: this.request })
      this.$store.dispatch('editComponent', { index: this.configIndex, pageListName: this.$store.getters.currentPage, key: 'formList', value: this.formList })
      this.showRequestPopup = false
      this.$emit('on-close')
    },
    delFormListData(index) {
      this.formList.splice(index, 1)
      this.request.formData.splice(index, 1)
    },
    editFormListData(item, index) {
      console.log('点击了配置', item, index)
      this.editIndex = index
      this.configComponent = `${item.key}-edit`
      if (components[this.configComponent]) {
        this.dialogVisible = true
      } else {
        this.showEditForm = true
        this.editFormIndex = index
      }
    },
    addComponent(value) {
      if (value.key === 'form-upload-array') {
        value.model.text = []
      }
      console.log('添加组件的value', value)
      this.formList.push(value)
      console.log('添加完组件的formList', this.formList)
      this.request.formData.push({ label: value.label, value: '' })
      this.showAddComponent = false
    },
    onSubmit() {
      console.log('点击到了提交')
      this.showRequestPopup = true
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
    switchPic(value) {
      if (value.page) {
        this.$store.commit('ADD_PAGE_STORE', { pageStoreName: this.$store.getters.currentPage, pageStoreData: value })
        this.$store.commit('SET_REFERENCE', value)
        this.$store.dispatch('setCurrentPage', { page: value.page })
      } else if (this.$store.getters.dynamic[this.id].dynamicJumpPage.page !== '') {
        this.$store.commit('ADD_PAGE_STORE', { pageStoreName: this.$store.getters.currentPage, pageStoreData: value })
        this.$store.commit('SET_REFERENCE', value)
        this.$store.dispatch('setCurrentPage', { page: this.$store.getters.dynamic[this.id].dynamicJumpPage.page })
      }
    }
  }

}
</script>

<style lang='scss' scoped>
.dynamic {
    padding: 10px 10px 0px 10px;
}
</style>
<style>
  .dynamic .van-card__title {
    font-size: 18px;
    max-height: 45px;
    line-height: 22px;
  }
  .dynamic .van-card__desc {
    font-size: 15px
  }
</style>
