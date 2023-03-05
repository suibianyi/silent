<template>
  <div class="tree">
    <van-popup v-model="showPopup" :round="true" :style="{ width: '90%', height: '80%' }" :closeable="true" @close="closePopup">
      <div class="tree-content">
        <tree
          v-if="updateFlag"
          ref="tree"
          :data="list"
          :options="options"
          @node:selected="onSelected"
          @node:checked="onChecked"
          @node:unchecked="onUnChecked"
        />
      </div>
      <div style="margin: 16px;">
        <van-button round block type="info" native-type="submit" @click="confirm">确定</van-button>
      </div>
    </van-popup>
  </div>
</template>

<script>
import {
  mRequest
} from '@/api/request'
import { formatTree } from '@/mUtils'
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
    config: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      showPopup: false,
      options: {
        checkbox: true,
        multiple: false,
        propertyNames: {
          text: 'label'
        }
      },
      list: [],
      treeData: [],
      updateFlag: true,
      chooseData: []
    }
  },
  computed: {
  },
  watch: {
    show: {
      async handler(newVal) {
        console.log('1234567891112131141516171819')
        this.showPopup = newVal
      },
      deep: true,
      immediate: true
    }
  },
  async mounted() {
    console.log('tree的show', this.show)
    this.updateFlag = false
    await this.getTree()
    console.log('请求回来的结果是', this.treeData)
    this.list = this.list.concat(this.treeData)
    console.log('展示的list是', JSON.stringify(this.list))
    this.$forceUpdate()
    this.updateFlag = true
  },
  methods: {
    formatTree,
    async getTree() {
      const sendata = {}
      if (this.config.request.url && this.config.request.url !== '') {
        for (const item of this.config.request.specialData) {
          sendata[item.key] = this.$store.getters.storage[item.value]
          console.log('让我来看看这里面有什么', this.$store.getters.storage)
        }
        for (const item of this.config.request.data) {
          sendata[item.key] = item.value
        }
        this.treeData = (await mRequest({
          url: this.config.request.url,
          method: this.config.request.method,
          data: sendata
        })).data
      }
    },
    closePopup() {
      this.$emit('form-close')
    },
    onSelected(node) {
      console.log('我点击了onSelected', node)
    },
    onUnChecked(node) {
      if (node.children.length === 0) {
        const index = _.findIndex(this.chooseData, { id: node.id, text: node.data.text })
        this.chooseData.splice(index, 1)
        console.log('我点击了onUnChecked', this.chooseData)
      }
      // console.log('我点击了onUnChecked', node)
    },
    onChecked(node) {
      if (node.children.length === 0) {
        this.chooseData.push({ id: node.id, text: node.data.text })
        console.log('我点击了onChecked', this.chooseData)
      }
      // this.$emit('result', { data: this.formatTreeRes(node) })
      // this.$emit('on-close')
    },
    confirm() {
      this.$emit('form-value', { text: this.chooseData[0] ? this.chooseData[0].text : '', flag: this.flag, value: this.chooseData })
      this.$emit('form-close')
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
