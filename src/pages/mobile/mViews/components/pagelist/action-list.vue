<template>
  <div class="page-list">
    <van-popup v-model="showPopup" :style="{ width: '100%', height: '100%' }" :closeable="true" @close="closePopup">
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
                :desc="action.schoolCode"
                :title="action.name + '  ' +action.role"
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
      </div>
    </van-popup>
  </div>
</template>
<script>

import _ from 'lodash'
export default {
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
      acitonList: []
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
    if (this.req && this.req.method) {
      this.actionList.push(_.assign(this.req, { type: 'req' }))
    }
    if (this.func && this.func.actions) {
      this.actionList.push(_.assign(this.func, { type: 'func' }))
    }
    if (this.page && this.page.length) {
      this.actionList.push(_.assign(this.page, { type: 'page' }))
    }
    if (this.actions && this.actions.length) {
      this.actionList = _.cloneDeep(this.actions)
    }
  },
  beforeDestroy() {
  },
  methods: {
    showAddAction() {

    },
    editAction() {

    },
    delAction() {

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
