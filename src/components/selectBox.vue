<!--  -->
<template>
  <div class="selectClass">
    <el-select v-model="editInfo.bids"
               v-el-select-loadmore="loadmore"
               :filter-method="filterMethodThrottle"
               :multiple="multiple"
               filterable
               placeholder="请选择"
               style="width: 300px;"
               @change="selectTerminal"
               @remove-tag="deleteTerminal">
      <el-option
        v-for="(item, index) in terminalOptions"
        :key="index"
        :label="`${item.bid} ${item.name}`"
        :value="item.bid" />
    </el-select>
  </div>
</template>

<script>
import { getTerminaList } from '@/api/MBS/organization'

export default {
  directives: {
    'el-select-loadmore': {
      bind(el, binding) {
        // 获取element-ui定义好的scroll盒子
        const SELECTWRAP_DOM = el.querySelector('.el-select-dropdown .el-select-dropdown__wrap')
        SELECTWRAP_DOM.addEventListener('scroll', function() {
          /**
                    * scrollHeight 获取元素内容高度(只读)
                    * scrollTop 获取或者设置元素的偏移值,常用于, 计算滚动条的位置, 当一个元素的容器没有产生垂直方向的滚动条, 那它的scrollTop的值默认为0.
                    * clientHeight 读取元素的可见高度(只读)
                    * 如果元素滚动到底, 下面等式返回true, 没有则返回false:
                    * ele.scrollHeight - ele.scrollTop === ele.clientHeight;
                    */
          const condition = this.scrollHeight - this.scrollTop - 10 <= this.clientHeight
          if (condition) {
            binding.value()
          }
        })
      }
    }
  },
  props: {
    editInfo: {
      type: Object,
      default() { }
    },
    terminalParams: {
      type: Object,
      default() { }
    },
    multiple: {
      type: Boolean,
      default: true
    }
  },
  data() {
    // 这里存放数据
    return {
      terminalOptions: [],
      total: ''
    }
  },
  computed: {
    filterMethodThrottle(val) {
      var time = null
      return (val) => {
        if (time) {
          clearTimeout(time)
        }
        time = setTimeout(() => {
          // 搜索方法
          this.handleSearch(val)
          clearTimeout(time)
        }, 2000)
      }
    }
  },
  created() {
    this._getTerminaList()
  },
  beforeDestroy() {
    this.terminalParams.page = 1
    this.terminalParams.tip = ''
  },
  // 方法集合
  methods: {
    async loadmore() {
      if (this.terminalOptions.length < this.total) {
        this.terminalParams.page++
        const terminaList = await getTerminaList(this.terminalParams)
        this.terminalOptions = this.terminalOptions.concat(terminaList.data.items)
      } else {
        return
      }
    },
    handleSearch(val) {
      this.terminalParams.page = 1
      this.terminalParams.tip = val
      this._getTerminaList()
    },
    selectTerminal(val) {
      const aiBox = []
      for (let i = 0; i < val.length; i++) {
        const index = val[i].indexOf('-') + 1
        if (val[i][index] === 'F') {
          aiBox.push(val[i])
        }
      }
      if (aiBox.length > 1) {
        this.$message.warning('最多只能绑定一台感知仓')
        this.editInfo.bids.splice(-1)
      }
    },
    async _getTerminaList() {
      console.log('参数', this.terminalParams)
      const terminaList = await getTerminaList(this.terminalParams)
      this.terminalOptions = terminaList.data.items
      this.terminalOptions.forEach(item => {
        item.disabled = false
      })
      this.total = terminaList.data.total
      console.log('zhongduan:', this.terminalOptions)
    },
    deleteTerminal(val) {
      console.log('查看移除终端', val)
    }
  }
}
</script>
<style lang='scss' scoped>
@import "~@/styles/mixin.scss";
</style>
