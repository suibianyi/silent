<template>
  <div class="form-page">
    <van-form>
      <van-field
        v-for="(item, index) in formList" :key="index"
        v-model="item.model.text"
        :name="item.label"
        :label="item.label"
        :type="item.type||'text'"
        :required="item.require||false"
        :placeholder="item.placeholder || ''"
        :rules="item.rules || []"
        :readonly="item.component=='output'"
        @click="openShowComp(item, index)"
      >
        <template v-if="item.component=='input'" #input>
          <component :is="item.key" v-model="item.model" :config="item" />
        </template>
      </van-field>
      <div style="margin: 16px;">
        <van-button round block type="info" native-type="submit" @click="onSubmit">提交</van-button>
      </div>
    </van-form>
    <div v-for="(item, index) in formList" :key="index">
      <component
        :is="item.key"
        v-if="item.component=='output'"
        :flag="chooseIndex"
        :type="item.type"
        :show="showComp==item.key"
        :config="item"
        @form-close="closeForm"
        @form-value="getFormValue" />
    </div>
  </div>
</template>

<script>
import { map } from 'lodash'
const files = require.context('../../components', true, /index.vue$/)
const components = {}
// const matchReg = /(?<=\/).*?(?=\/)/g
const matchReg = /\.\/(.*)\/index\.vue$/
files.keys().forEach((key) => {
  const match = key.match(matchReg)
  if (match.length > 2) {
    return
  }
  const name = match[1]
  components[name] = files(key).default
})
export default {
  components: {
    ...components
  },
  data() {
    return {
      showComp: '',
      chooseIndex: 0
    }
  },
  computed: {
    formList() {
      console.log('获得的formlist是', this.$store.getters.formPage.formList)
      return this.$store.getters.formPage.formList
    }
  },
  mounted() {},
  methods: {
    closeForm(index) {
      this.showComp = ''
    },
    openShowComp(item, index) {
      if (item.component === 'output') {
        this.showComp = item.key
        this.chooseIndex = index
        console.log('我点击了打开', this.showComp)
        this.$forceUpdate()
      }
    },
    getFormValue(value) {
      console.log('传上来的value', value)
      this.$store.dispatch('setFormList', value)
    },
    onSubmit() {
      console.log('最新的值', this.$store.getters.formPage.formList)
      let validate = true
      map(this.$store.getters.formPage.formList, list => {
        if (list && list.require) {
          if (['input', 'output'].includes(list.component)) {
            validate = !!list.model.value
          } else {
            validate = !!list.model.text
          }
        }
      })
      if (!validate) {
        this.$Notify({ type: 'warning', message: '必填项未填写' })
        return
      }
      this.$store.dispatch('handelFormList')
      this.$store.dispatch('backNav')
    }
  }

}
</script>

<style lang='scss' scoped>
.form-page {
    padding: 10px 10px 0px 10px;
    width: 100%;
}
</style>
