<!--  -->
<template>
  <div class="selectClass">
    <el-dialog
      :visible="true"
      :before-close="closeMixDialog">
      <div class="dialogTittle">选择{{ selectType ? '场所' : '班级' }}</div>
      <div class="smallThing" />
      <div class="form-container">
        <el-input
          v-model.lazy="filterText"
          :placeholder="selectType? '场所名称': '班级名称'"
          @change="filterText = filterText.trim()" />
        <el-tree
          ref="tree"
          class="filter-tree"
          :data="data"
          :props="defaultProps"
          :check-strictly="!multiple"
          :render-after-expand="false"
          node-key="id"
          :default-expand-all="selectType != 1 && selectType != 2"
          :default-expanded-keys="defaultKeys"
          show-checkbox
          highlight-current
          :check-on-click-node="!multiple"
          :filter-node-method="filterNode"
          :default-checked-keys="initSelectIds"
          @node-click="nodeClick"
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
//           check-strictly
import { getClassTree } from '@/api/MIS/content'

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
    },
    contentName: {
      type: String,
      default: ''
    },
    selectType: {
      type: Number,
      default: 0
    }, // 选择类型 0-班级 1-场所（含年级树） 2- 场所（不含年级树）
    dormitoryInfo: {
      type: Boolean,
      default: true
    } // 场所数据中是否包含宿舍树，默认包含
  },
  data() {
    // 这里存放数据
    return {
      filterText: '',
      data: [],
      defaultProps: {
        children: 'children',
        label: 'label'
      }
    }
  },
  // 监听属性 类似于data概念
  computed: {
    initSelectIds() {
      const rst = []
      _.each(this.editInfo.ids, (id) => {
        rst.push(id)
        rst.push(`${id}_p`)
      })
      return rst
    },
    defaultKeys() {
      if (this.selectType === 1 || this.selectType === 3) {
        const two = ['listByGrade', 'listByPlace']
        return two
      } else {
        const one = ['placeTree']
        return one
      }
    }
  },
  // 监控data中的数据变化
  watch: {
    filterText(val) { // 接收父组件的内容
      this.$refs.tree.filter(val)
    }
  },
  // 生命周期 - 创建完成（可以访问当前this实例）
  async created() {
    const classRst = await getClassTree({
      type: this.selectType,
      // dormitoryInfo: this.dormitoryInfo,
      contentName: this.contentName
    })
    if (this.multiple) {
      this.data = classRst.data
      return
    }
    this.data = classRst.data.map((one) => {
      if (one.type === 1) { // 年级
        one.disabled = true
      }
      return one
    })
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
    nodeClick(data, node) {
      if (data.type === 3) { // 3级联动
        this.$refs.tree.setChecked(node, !node.checked, false)
      }
    },
    combineClassPlaceIds(ids) { // 合并年级场所树id
      const rst = []
      _.each(ids, (id) => {
        if (_.endsWith(id, '_p')) {
          rst.push(id.substring(0, id.indexOf('_p')))
        } else {
          rst.push(id)
        }
      })
      return _.uniq(_.compact(rst))
    },
    combineClassPlaceNames(names) { // 合并年级场所树name
      const rst = []
      _.each(names, (name) => {
        if (name.indexOf('（教室：') > 0) {
          rst.push(name.substring(name.indexOf('（教室：') + 4, name.lastIndexOf('）')))
        } else {
          rst.push(name)
        }
      })
      return _.uniq(_.compact(rst))
    },
    checkChange(data, checked) {
      if (checked && !this.multiple) {
        this.$refs.tree.setCheckedKeys([data.id])
      }
      if (data.type === 3) { // 3级联动
        if (_.endsWith(data.id, '_p')) {
          const node2Id = data.id.substring(0, data.id.indexOf('_p'))
          this.$refs.tree.setChecked(node2Id, checked, false)
        } else {
          this.$refs.tree.setChecked(`${data.id}_p`, checked, false)
        }
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
      if (!chkNodes || !chkNodes.length) {
        if (!this.multiple) {
          this.$message.warning('请选择班级')
        } else {
          this.$message.warning('请选择场所')
        }
        return
      }
      chkNodes = _.filter(chkNodes, node => node.type === (this.selectType ? 3 : 2))
      if (chkNodes && chkNodes.length) {
        this.$emit('on-updata', {
          ids: this.combineClassPlaceIds(_.map(chkNodes, 'id')),
          names: this.combineClassPlaceNames(_.map(chkNodes, 'label'))
        })
        return
      }
      this.$message.warning('已选择的节点中未包含场所')
    },
    filterNode(value, data) {
      if (!value) return true
      if (data.type === (this.selectType ? 3 : 2)) {
        let label2 = data.label
        if (label2.indexOf('（教室：') > 0) {
          label2 = label2.substring(label2.indexOf('（教室：') + 4, label2.lastIndexOf('）'))
        }
        return label2.indexOf(value) !== -1
      }
      return false
    }
  }
}
</script>
<style lang='scss' scoped>
@import "~@/styles/mixin.scss";
.selectClass {
  .dialogTittle {
    @include dialogTitle;
  }
  .smallThing {
    @include buleBlock;
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
