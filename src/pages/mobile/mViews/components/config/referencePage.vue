<template>
  <div class="grid-config">
    <div class="form">
      参数配置
      <van-field
        v-if="arrayField.length"
        name="新增"
        label="新增"
        readonly
        right-icon="add-o"
        @click="addData"
      />
      <div v-for="(array,arrayIndex) in arrayField" :key="arrayIndex">
        <van-swipe-cell v-for="(item,index) in array.value" :key="index">
          <van-field v-if="item.key.indexOf('img') != -1||item.key.indexOf('url') != -1||item.key.indexOf('image') != -1||item.key.indexOf('icon') != -1" name="uploader" :label="item.key">
            <template #input>
              <formUpload v-model="item.value" />
            </template>
          </van-field>
          <van-field v-else-if="item.key.indexOf('page') != -1" v-model="item.value" :label="item.key" placeholder="请选择跳转页面" readonly @click="clickPage(index)" />
          <van-field v-else v-model="item.value" :label="item.key" />
          <template #right>
            <van-button square text="删除" type="danger" class="delete-button" @click="delData(index)" />
          </template>
        </van-swipe-cell>
      </div>
      <div v-for="(object,indexObj) in objectField" :key="indexObj">
        <div v-for="(item,index) in object.value" :key="index">
          <van-field v-if="item.key.indexOf('img') != -1||item.key.indexOf('url') != -1||item.key.indexOf('image') != -1||item.key.indexOf('icon') != -1" name="uploader" :label="item.key">
            <template #input>
              <formUpload v-model="item.value" />
            </template>
          </van-field>
          <van-field v-else-if="item.key.indexOf('page') != -1" v-model="item.value" :label="item.key" placeholder="请选择跳转页面" readonly @click="clickPage(index)" />
          <van-field v-else v-model="item.value" :label="item.key" />
        </div>
      </div>
      <div v-for="(item,index) in stringField" :key="index">
        <van-field v-if="item.key.indexOf('img') != -1||item.key.indexOf('url') != -1||item.key.indexOf('image') != -1||item.key.indexOf('icon') != -1" name="uploader" :label="item.key">
          <template #input>
            <formUpload v-model="item.value" />
          </template>
          <template #button>
            <van-button size="small" type="primary">传参</van-button>
          </template>
        </van-field>
        <van-field v-else-if="item.key.indexOf('page') != -1" v-model="item.value" :label="item.key" placeholder="请选择跳转页面" readonly @click="clickPage(index)" />
        <van-field v-else v-model="item.value" :label="item.key">
          <template #button>
            <van-button size="small" type="primary">传参</van-button>
          </template>
        </van-field>
      </div>
      <div style="margin: 16px;">
        <van-button round block type="info" native-type="submit" @click="confirm">确定</van-button>
      </div>
    </div>
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
      stringField: [],
      objectField: [],
      arrayField: [],
      tempIndex: -1,
      chooseNextPage: false
    }
  },
  computed: {
    obj() {
      console.log('配置页面时候查出来的是', this.$store.getters.pageList[this.$store.getters.currentPage].componentList[this.configIndex])
      return this.$store.getters.pageList[this.$store.getters.currentPage].componentList[this.configIndex].key
    }
  },
  watch: {
    show: {
      handler(newVal) {
        console.log('jieshou:', newVal)
        this.showPopup = newVal
      },
      deep: true,
      immediate: true
    }
  },
  mounted() {
    console.log('show', this.show)
    const temp = this.$store.getters.pageList[this.$store.getters.currentPage].componentList[this.configIndex]
    console.log('配置页面时候查出来的是123', temp)
    let keyArray = Object.keys(temp)
    // keyArray.remove('key')
    keyArray = keyArray.filter(k => k !== 'key' && k !== 'shadeWindow')
    for (const i of keyArray) {
      if (_.isObject(temp[i])) {
        if (temp[i].isArray) {
          const arrayKeyValue = []
          for (const j of temp[i]) {
            const arrayKeyArray = Object.keys(j)
            const tempArrayKeyValue = []
            for (const k of arrayKeyArray) {
              tempArrayKeyValue.push({ key: k, value: j[k] })
            }
            arrayKeyValue.push({ tempArrayKeyValue })
          }
          this.arrayField.push({ key: i, value: arrayKeyValue })
        } else {
          const objKeyArray = Object.keys(temp[i])
          const objKeyValue = []
          for (const j of objKeyArray) {
            objKeyValue.push({ key: j, value: temp[i][j] })
          }
          this.objectField.push({ key: i, value: objKeyValue })
        }
      } else {
        this.stringField.push({ key: i, value: temp[i] })
      }
    }
    console.log('配置页面时候查出来的stringField是', this.stringField)
    console.log('配置页面时候查出来的objectField是', this.objectField)
    console.log('配置页面时候查出来的arrayField是', this.arrayField)
  },
  methods: {
    closeChoosePage() {
      this.chooseNextPage = false
    },
    choosePage(page) {
      this.gridList[this.tempIndex].page = page
    },
    clickPage(index) {
      this.tempIndex = index
      this.chooseNextPage = true
    },
    closePopup() {
      this.$emit('on-close')
    },
    addData() {
      this.gridList.push({ imageUrl: '', page: '', text: '' })
    },
    delData(index) {
      this.gridList.splice(index, 1)
    },
    confirm() {
      this.$store.dispatch('editComponent', { index: this.configIndex, pageListName: this.$store.getters.currentPage, key: 'gridList', value: this.gridList })
      this.$emit('on-close')
    }
  }

}
</script>

<style lang='scss' scoped>
.grid-config {
    .popup-content {
      margin-top: 10px
    }
    .form {
      margin: 20px;
      .delete-button {
       height: 100%;
      }
    }
}
</style>
