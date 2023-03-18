<template>
  <div>
    <div class="page-list">
      <van-popup v-model="showPopup" :style="{ width: '100%', height: '100%' }" :closeable="true" @click-close-icon="closePopup">
        <div class="popup-content">
          <div :style="{ 'text-align': 'center', 'font-size': '35px' }">
            动作列表
          </div>
          <div class="component-list">
            <van-cell-group>
              <div
                v-for="action in actionList"
                :key="action.id"
                class="cell-item"
              >
                <van-card
                  :title="action.type"
                  :desc="action.method||action.page"
                  thumb="https://img01.yzcdn.cn/vant/ipad.jpeg"
                  @click="chooseAction($event, action)"
                >
                  <template #footer>
                    <van-button round text="编辑" type="default" class="edit-button" @click="editAction(action)" />
                    <van-button round text="删除" type="default" class="delete-button" @click="delAction(action)" />
                  </template>
                </van-card>
              </div>

            </van-cell-group>
            <div class="add-comp" @click="showAddAction" />
          </div>
          <div style="margin: 16px;">
            <van-button round block type="info" native-type="submit" @click="onSubmit">确定</van-button>
          </div>
        </div>
      </van-popup>
    </div>
    <page-list v-if="openFuncList"
               :show="openFuncList"
               :action="action"
               @result="getresult"
               @on-close="closeChoosePage" />
  </div>
</template>
<script>

import _ from 'lodash'
import pageList from '../pagelist/index123456.vue'
export default {
  components: {
    pageList
  },
  filters: {
    getkey(lists, pageIndex) {
      console.log('传进来的参数是', lists, pageIndex)
      // console.log('应该显示的是', Object.keys(lists)[pageIndex])
      return lists
    }
  },
  props: {
    show: {
      type: Boolean,
      default: false
    },
    func: {
      type: Object,
      default: () => {
        return {}
      }
    },
    req: {
      type: Object,
      default: () => {
        return {}
      }
    },
    page: {
      type: String,
      default: () => {
        ''
      }
    },
    actions: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data() {
    return {
      actionList: [],
      action: {},
      openFuncList: false
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
    console.log('功能配置列表页，我来啦', this.req)
    console.log('功能配置列表页，我来啦', this.func)
    console.log('功能配置列表页，我来啦', this.page)
    if (this.req && this.req.method) {
      this.actionList.push(_.assign(this.req, { type: 'req', id: Math.random().toString(36).slice(-8) }))
    }
    if (this.func && this.func.actions) {
      this.actionList.push(_.assign(this.func, { type: 'func', id: Math.random().toString(36).slice(-8) }))
    }
    if (this.page && this.page.length) {
      this.actionList.push(_.assign(this.page, { type: 'page', id: Math.random().toString(36).slice(-8) }))
    }
    if (this.actions && this.actions.length) {
      this.actionList = _.cloneDeep(this.actions)
    }
    console.log('功能配置列表页，我来啦', this.actionList)
  },
  beforeDestroy() {
  },
  methods: {
    showAddAction() {
      this.action = {}
      this.openFuncList = true
    },
    editAction(item) {
      this.action = item
      this.openFuncList = true
    },
    delAction(item) {
      this.actionList = this.actionList.filter((res) => {
        return res.id !== item.id
      })
    },
    chooseAction() {

    },
    closeChoosePage() {
      this.openFuncList = false
    },
    closePopup() {
      console.log('我点击了关闭')
      this.$emit('on-close')
    },
    getresult(value) {
      console.log('我获得的东西是', value)
      if (_.isEmpty(this.action)) {
        this.actionList.push(_.assign(value, { id: Math.random().toString(36).slice(-8) }))
      } else {
        const index = this.actionList.findIndex(res => res.id === this.action.id)
        this.actionList[index] = _.assign(value, { id: this.action.id })
      }
    },
    onSubmit() {
      console.log('提交的时候this.actionList', this.actionList)
      this.$emit('result', this.actionList)
      this.$emit('on-close')
    }
  }
}
</script>

<style lang="stylus" scoped>
.page-list
  padding-top: 50px;
  display: flex
  flex-wrap: wrap
  flex-direction: row
  width 100%
  height 100%
  overflow-x: hidden
  .popup-content {
    margin-top: 30px
    .add-comp {
      padding: 10px;
      height: 86px;
      text-align: center;
      line-height: 86px;
      width: 100%;
      background: no-repeat url('~@/assets/mobile/create/add.png');
      background-size: contain;
      // background-color: red;
      background-position: center bottom;
      // border: solid 1px #b4b8bf;
      // border-radius: 33px;
      i {
        color: white;
      }
    }
  }

</style>
<style>
  .cell-item {
    position: relative;
    margin: 10px 0;
  }
  .cell-item .van-switch {
    position: absolute;
    right: 15px;
    top: 15px;
  }
  .cell-item .van-button--normal {
    padding: 6px 15px;
  }
  .cell-item .van-card__title {
    font-size: 14px;
  }
  .cell-item .van-card__desc {
    color: #474747;
  }
</style>
