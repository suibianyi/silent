<template>
  <el-dialog
    :visible="show"
    width="60%"
    center
    @close="handleClose">
    <div class="dialogTittle">
      <p class="tittleWord">
        自定义列表项
      </p>
    </div>
    <div class="smallThing" />
    <el-checkbox-group v-model="checklist" class="table-column-select-dialog-checkbox-group">
      <template v-for="(item, index) in list">
        <el-checkbox :key="'cb' + item" :label="item">
          {{ item }}
        </el-checkbox>
        <br v-if="(index + 1) % 4 === 0" :key="'br' + item">
      </template>
    </el-checkbox-group>
    <span slot="footer">
      <el-button
        type="primary"
        @click="handleSubmit">保 存</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  props: [
    // eslint-disable-next-line vue/require-prop-types
    'show',
    // eslint-disable-next-line vue/require-prop-types
    'type',
    // eslint-disable-next-line vue/require-prop-types
    'defaultCheckedTableColumns'
  ],
  data() {
    return {
      list: [],
      checklist: []
    }
  },
  watch: {
    show(v) {
      if (v === true) {
        if (this.defaultCheckedTableColumns) {
          this.checklist = this.defaultCheckedTableColumns.slice(0)
        } else {
          this.checklist = []
        }
        this.initList()
      }
    },
    defaultCheckedTableColumns: {
      immediate: true,
      handler(v) {
        if (v) {
          this.checklist = v.slice(0)
        }
      }
    }
  },
  methods: {
    initList() {
      if (this.type === 'box') {
        this.list = ['终端名称', '场所', '分类', '模板', '底库', '离线模板', '系统版本', 'ROM版本', 'IP地址', '启用状态', '运行状态', '授权状态']
      } else if (this.type === 'aibox') {
        this.list = ['类型', '场所', 'IP地址', '端口', '系统版本', '人脸底库', '运行状态']
      } else {
        this.list = []
      }
    },
    handleClose() {
      this.$emit('close')
    },
    handleSubmit() {
      this.$emit('submit', this.checklist.slice(0))
    }
  }
}
</script>
<style lang="scss">
@import "~@/styles/mixin.scss";

.dialogTittle {
  @include dialogTitle;
}
.smallThing {
  @include buleBlock;
}

.table-column-select-dialog-checkbox-group {
  padding-left: 200px;
  line-height: 32px;
}

</style>
