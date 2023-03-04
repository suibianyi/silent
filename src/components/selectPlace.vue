<!--  -->
<template>
  <div class="selectClass">
    <el-dialog
      :visible="true"
      :before-close="closeMixDialog">
      <div class="dialogTittle1">
        <div>选择场所分类</div>
        <div class="smallThing" />
      </div>

      <div class="form-container">
        <el-input
          v-model="filterText"
          placeholder="二级场所分类" />
        <el-tree
          ref="tree"
          class="filter-tree"
          :data="data"
          :props="defaultProps"
          :check-strictly="!multiple"
          node-key="basicResourceId"
          default-expand-all
          show-checkbox
          highlight-current
          check-on-click-node
          :filter-node-method="filterNode"
          :default-checked-keys="editInfo.ids"
          @check-change="checkChange" />
      </div>
      <span slot="footer">
        <el-button @click="closeMixDialog">取 消</el-button>
        <el-button
          type="primary"
          @click="submitForm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
// 这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
// 例如：import 《组件名称》 from '《组件路径》';
// @check="checkGroupNode"
// @node-click="nodeClick"
import _ from 'lodash'
import { getOrgPlaceTreeList } from '@/api/MBS/organization'

export default {
  components: {},
  // import引入的组件需要注入到对象中才能使用
  props: {
    editInfo: {
      type: Object,
      default: () => ({})
    },
    multiple: {
      type: Boolean,
      default: true
    }
  },
  data() {
    // 这里存放数据
    return {
      filterText: '',
      data: [],
      defaultProps: {
        children: 'children',
        label: 'resourceName' // 场所名称
      }
    }
  },
  // 监听属性 类似于data概念
  computed: {},
  // 监控data中的数据变化
  watch: {
    filterText(val) { // 接收父组件的内容
      this.$refs.tree.filter(val)
    }
  },
  // 生命周期 - 创建完成（可以访问当前this实例）
  async created() {
    const siteTree = await getOrgPlaceTreeList({
      parentId: this.$store.state.user.school.id
    })
    this.data = siteTree.data && siteTree.data.qryClassPlaceList.map(o => {
      o.disabled = true
      return o
    }) || []
  },
  // 生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {},
  beforeCreate() { }, // 生命周期 - 创建之前
  beforeMount() { }, // 生命周期 - 挂载之前
  beforeUpdate() { }, // 生命周期 - 更新之前
  updated() { }, // 生命周期 - 更新之后
  beforeDestroy() { }, // 生命周期 - 销毁之前
  destroyed() { }, // 生命周期 - 销毁完成
  activated() { }, // 如果页面有keep-alive缓存功能，这个函数会触发
  // 方法集合
  methods: {
    /* nodeClick(data) { // 需要控制单选或多选
      console.log('选中的节点', data)
      if (!data.disabled) {
        if (this.multiple) {
          const keys = this.$refs.tree.getCheckedKeys()
          const hasChecked = keys.indexOf(data.id) >= 0
          this.$refs.tree.setChecked(data, !hasChecked)
        } else {
          this.$refs.tree.setCheckedNodes([data])
        }
      }
    },
    checkGroupNode(a, b) {
      const chkKeys = _.compact(b.checkedKeys)
      if (chkKeys.length > 0) {
        this.$refs.tree.setCheckedKeys(chkKeys)
      }
    }, */
    checkChange(data, checked) {
      if (checked && !this.multiple) {
        this.$refs.tree.setCheckedKeys([data.basicResourceId])
      }
    },
    closeMixDialog() {
      this.$emit('on-close')
    },
    resetForm(formName) {
      // this.$nextTick(() => {
      this.$refs[formName].resetFields()
      // })
    },
    submitForm() {
      let chkNodes = this.$refs.tree.getCheckedNodes()
      console.log('ttt', chkNodes)
      chkNodes = _.filter(chkNodes, node => node.parentNo !== '-1')
      if (chkNodes && chkNodes.length) {
        this.$emit('on-updata', {
          ids: _.map(chkNodes, 'basicResourceId'),
          names: _.map(chkNodes, 'resourceName')
        })
        return
      }
      this.$message.warning('请选择场所分类')
    },
    filterNode(value, data) {
      if (!value) return true
      return data.resourceName.indexOf(value) !== -1 && data.parentNo !== '-1'
    }
  }
}
</script>
<style lang='scss' scoped>
@import "~@/styles/mixin.scss";
@include dialog-clear;
@include dialog-center;
.selectClass {
  /deep/.el-dialog{
    height: 580px !important
  }
  /deep/ .el-dialog__footer{
    text-align: center
  }
  .dialogTittle1 {
    @include dialogTitle1;
    margin-top: 30px
  }
  .smallThing {
    @include buleBlock1;
  }
  >>> .el-dialog {
    @include dialogSize;
  }
  .filter-tree {
    margin-top: 10px;
  }
  >>> .el-tree {
    height: 300px;
    overflow: auto;
    .el-checkbox .is-disabled {
      display: none;
    }
  }
}
</style>
