<template>
  <div class="tree">
    <van-popup v-model="showPopup" :round="true" :style="{ width: '90%', height: '80%' }" :closeable="true" @close="closePopup">
      <div class="tree-content">
        <tree
          ref="tree"
          :data="list"
          :options="options"
          @node:selected="onSelected"
          @node:checked="onChecked"
          @node:unchecked="onUnChecked"
        />
      </div>
      <div style="margin: 16px;">
        <van-button round block type="info" native-type="submit" @click="onSubmit">提交</van-button>
      </div>
    </van-popup>
  </div>
</template>

<script>
import { formatTree } from '@/mUtils'
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
    list: {
      type: Array,
      default() {
        return []
      }
    },
    text: {
      type: String,
      default: 'text'
    },
    returnType: {
      type: String,
      default: 'path'
    },
    multiple: {
      type: Boolean,
      default: false
    },
    checkOnSelect: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      showPopup: false,
      options: {
        checkbox: true,
        checkOnSelect: this.checkOnSelect,
        multiple: this.multiple,
        propertyNames: {
          text: this.text
        }
      },
      chooseResult: []
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
    }
  },
  mounted() {
    console.log('show', this.show)
    // console.log('tree里面special模式下拿到的', this.formatTree(this.$store.getters.storage))
    // this.mylist = this.formatTree(this.$store.getters.storage)
  },
  methods: {
    formatTree,
    formatTreeRes(val) {
      let temp = ''
      if (val.parent !== null) {
        if (val.data.value) {
          temp = `${this.formatTreeRes(val.parent)}.${val.data.value}` + temp
        } else {
          temp = `${this.formatTreeRes(val.parent)}.${val.data.text}` + temp
        }
      } else {
        if (val.data.value) {
          temp = `${val.data.value}` + temp
        } else {
          temp = `${val.data.text}` + temp
        }
      }
      return temp
    },
    closePopup() {
      this.$emit('on-close')
    },
    onSelected(node) {
      console.log('我点击了onSelected', node)
      if (this.returnType === 'path') {
        console.log('我点击了onSelected', this.formatTreeRes(node))
        this.$emit('result', { data: this.formatTreeRes(node) })
        this.$emit('on-close')
      } else if (this.returnType === 'node') {
        this.$emit('result', { data: node })
      }
    },
    onChecked(node) {
      console.log('我点击了onChecked', node)
      if (this.returnType === 'path') {
        console.log('我点击了onChecked', this.formatTreeRes(node))
        this.$emit('result', { data: this.formatTreeRes(node) })
        this.$emit('on-close')
      } else if (this.returnType === 'node') {
        this.chooseResult.push(node)
      }
    },
    onUnChecked(node) {
      console.log('我点击了onUnChecked', node)
      if (this.returnType === 'node') {
        this.chooseResult = this.chooseResult.filter((item) => {
          return item.id !== node.id
        })
      }
    },
    // getcheckTrue(arr) {
    //   arr.forEach((el) => {
    //     if (el.states.selected === true) {
    //       this.chooseResult.push(el)
    //     }
    //     this.getcheckTrue(el.children || [])
    //   })
    // },
    onSubmit() {
      console.log('我们来看看', this.chooseResult)
      if (this.returnType === 'node') {
        this.$emit('result', { data: this.chooseResult })
        this.$emit('on-close')
      }
    }
  }

}
</script>

<style lang='scss' scoped>
.tree {
    padding: 10px 10px 0px 10px;
    .tree-content {
      padding-top: 30px;
    }
}
</style>
