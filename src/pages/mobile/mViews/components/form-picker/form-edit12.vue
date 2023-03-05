<template>
  <div class="tree-edit">
    <van-popup v-model="showPopup" :round="true" :style="{ width: '90%', height: '80%' }" :closeable="true" @close="closePopup">
      <div class="popup-content">
        修改名称
        <van-field
          v-model="label"
          name="name"
          label="name"
          placeholder="请输入名称"
          :rules="[{ required: true, message: '请输入名称' }]"
        />
        <van-field v-model="data" name="编辑使用" label="编辑使用" placeholder="value" @click="chooseSpecial(0,'edit')" />
        <van-cell center title="是否必填">
          <template #right-icon>
            <van-switch v-model="required" size="24" />
          </template>
        </van-cell>
        <div style="margin: 16px;">
          <van-button round block type="info" native-type="submit" @click="confirm">确定</van-button>
        </div>
      </div>
    </van-popup>
    <tree :show="showTree" :list="treeList" @result="chooseResult"
          @on-close="closePage" />
    <tree v-if="showSpecialTree" :show="showSpecialTree" :list="specialTree" @result="chooseResult"
          @on-close="closePage" />
  </div>
</template>

<script>
import tree from '../tree/index123.vue'
import { splitTreeRes, formatTree } from '@/mUtils'
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
    },
    editIndex: {
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
      label: '',
      data: '',
      required: true
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
        if (this.$store.getters.pageList[this.$store.getters.currentPage].componentList[newVal].formList[this.editIndex].require) {
          this.required = this.$store.getters.pageList[this.$store.getters.currentPage].componentList[newVal].formList[this.editIndex].require
        }
        if (this.$store.getters.pageList[this.$store.getters.currentPage].componentList[newVal].formList[this.editIndex].label) {
          this.label = this.$store.getters.pageList[this.$store.getters.currentPage].componentList[newVal].formList[this.editIndex].label
        }
        if (this.$store.getters.pageList[this.$store.getters.currentPage].componentList[newVal].formList[this.editIndex].data) {
          this.data = this.$store.getters.pageList[this.$store.getters.currentPage].componentList[newVal].formList[this.editIndex].data
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
    closePopup() {
      this.$emit('on-close')
    },
    closePage() {
      this.showTree = false
      this.showSpecialTree = false
    },
    chooseResult(val) {
      if (this.treeMode === 'special') {
        this.request.specialData[this.specialIndex].value = val.data
      } else if (this.treeMode === 'edit') {
        this.data = val.data
      } else {
        const str = splitTreeRes(val.data)
        console.log('格式化后的str是', str)
        this.response.swipeList = str.list
        this.response.swipeListCor = str.cor
      }
    },
    chooseSpecial(index, type) {
      this.specialIndex = index
      this.treeMode = type
      this.specialTree = this.formatTree(this.$store.getters.storage)
      this.showSpecialTree = true
    },
    confirm() {
      this.$store.dispatch('editFormComponent', { configIndex: this.configIndex, editIndex: this.editIndex, pageListName: this.$store.getters.currentPage, key: 'require', value: this.required })
      this.$store.dispatch('editFormComponent', { configIndex: this.configIndex, editIndex: this.editIndex, pageListName: this.$store.getters.currentPage, key: 'label', value: this.label })
      this.$store.dispatch('editFormComponent', { configIndex: this.configIndex, editIndex: this.editIndex, pageListName: this.$store.getters.currentPage, key: 'data', value: this.data })
      this.$emit('on-close')
    }
  }

}
</script>

<style lang='scss' scoped>
.tree-edit {
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
