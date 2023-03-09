<template>
  <div class="form-page">
    <van-popup v-model="showPopup" :round="true" :style="{ width: '100%', height: '100%' }" :closeable="true" @close="closePopup">
      <div class="popup-content">
        <van-form>
          <draggable :value="formList" @input="dragComponent" @start="chooseDrag" @end="dragEnd">
            <van-swipe-cell v-for="(item,index) in formList" :key="item.label+index">
              <van-field
                v-model="item.model.text"
                :name="item.label"
                :label="item.label"
                :type="item.type||'text'"
                :required="item.require||false"
                :placeholder="item.placeholder || ''"
                :rules="item.rules || []"
                :readonly="item.component=='output'"
              >
                <template v-if="item.component=='input'" #input>
                  <component :is="item.key" />
                </template>
              </van-field>
              <template #right>
                <van-button square text="编辑" type="info" class="delete-button" @click="editFormListData(item, index)" />
                <van-button square text="删除" type="danger" class="delete-button" @click="delFormListData(index)" />
              </template>
            </van-swipe-cell>
          </draggable>
          <div class="add-comp" @click="showAddComponent=true">
            <van-icon name="plus" size="50" />
          </div>
          <div style="margin: 16px;">
            <van-button round block type="info" native-type="submit" @click="onSubmit">提交</van-button>
          </div>
        </van-form>
        <div v-for="(item, index) in formList" :key="item.label+index+1048">
          <component
            :is="item.key"
            v-if="item.component=='output'"
            :id="item.id"
            :key="item.id"
            :flag="chooseIndex"
            :type="item.type"
            :show="showComp==item.key"
            :config="item.config"
            @form-close="closeForm"
            @form-value="getFormValue" />
        </div>
      </div>
    </van-popup>
    <component
      :is="configComponent"
      :show="dialogVisible"
      :edit-index="editIndex"
      :config-index="configIndex"
      @on-close="closeConfigDialog"
      @on-confirm="confirmConfig"
    />
    <van-popup v-if="formList.length" v-model="showEditForm" :round="true" :style="{ width: '90%', height: '80%' }" :closeable="true">
      <div class="popup-content">
        修改名称
        <van-field
          v-model="formList[editFormIndex].label"
          name="name"
          label="name"
          placeholder="请输入名称"
          :rules="[{ required: true, message: '请输入名称' }]"
        />
        <van-field v-model="formList[editFormIndex].data" name="编辑使用" label="编辑使用" placeholder="value" @click="chooseSpecial(editFormIndex,'edit')" />
        <div style="margin: 16px;">
          <van-button round block type="info" native-type="submit" @click="saveEditForm">确定</van-button>
        </div>
      </div>
    </van-popup>
    <van-popup v-model="showAddComponent" :round="true" :style="{ width: '100%', height: '100%' }" :closeable="true">
      <div class="add-component-popup">
        <div :style="{ 'text-align': 'center', 'font-size': '35px' }">
          请选择组件
        </div>
        <div v-for="(item, index) in componentsList"
             :key="item.describe.name.value+index">
          <van-card
            :desc="item.describe.name.key"
            :title="item.describe.name.value"
            thumb="https://img01.yzcdn.cn/vant/ipad.jpeg"
            @click="addComponent(item)"
          />
        </div>
      </div>
    </van-popup>
    <van-popup v-model="showRequestPopup" :round="true" :style="{ width: '100%', height: '100%' }" :closeable="true">
      <div class="popup-content">
        <div class="form">
          表单提交参数设置
          <van-field
            v-model="request.url"
            name="url"
            label="url"
            placeholder="请输入提交地址"
            :rules="[{ required: true, message: '请输入提交地址' }]"
          />
          <van-field name="radio" label="method">
            <template #input>
              <van-radio-group v-model="request.method" direction="horizontal">
                <van-radio name="get">get</van-radio>
                <van-radio name="post">post</van-radio>
              </van-radio-group>
            </template>
          </van-field>
          <van-field
            name="表单提交参数"
            label="表单提交参数"
          />
          <div v-for="(item,index) in request.formData" :key="item.label+index+4096">
            <van-field v-model="item.value" :label="item.label" placeholder="请输入提交所对应的字段" />
          </div>
          <van-field
            name="固定提交参数"
            label="固定提交参数"
            right-icon="add-o"
            @click="addData"
          />
          <van-swipe-cell v-for="(item,index) in request.data" :key="index">
            <div class="key-value">
              <div :style="{ width: '48%' }">
                <van-field v-model="item.key" placeholder="key" />
              </div>
              <div :style="{ width: '48%' }">
                <van-field v-model="item.value" placeholder="value" />
              </div>
            </div>
            <template #right>
              <van-button square text="删除" type="danger" class="delete-button" @click="delData(index)" />
            </template>
          </van-swipe-cell>
          <van-field
            name="动态提交参数"
            label="动态提交参数"
            right-icon="add-o"
            @click="addSpecialData"
          />
          <van-swipe-cell v-for="(item,index) in request.specialData" :key="index+1024">
            <div class="key-value">
              <div :style="{ width: '48%' }">
                <van-field v-model="item.key" placeholder="key" />
              </div>
              <div :style="{ width: '48%' }">
                <van-field v-model="item.value" placeholder="value" @click="chooseSpecial(index, 'special')" />
              </div>
            </div>
            <template #right>
              <van-button square text="删除" type="danger" class="delete-button" @click="delSpecialData(index)" />
            </template>
          </van-swipe-cell>
          <div style="margin: 16px;">
            <van-button round block type="info" native-type="submit" @click="confirm">确定</van-button>
          </div>
        </div>
      </div>
    </van-popup>
    <tree v-if="showSpecialTree" :show="showSpecialTree" :list="specialTree" @result="chooseResult"
          @on-close="closePage" />
  </div>
</template>

<script>
import Draggable from 'vuedraggable'
import { formatTree } from '@/mUtils'
import tree from '../tree/index123.vue'
const files = require.context('../../components', true, /index.vue$/)
const configs = require.context('../../components', true, /form-edit.vue$/)
const components = {}
// const matchReg = /(?<=\/).*?(?=\/)/g
const matchReg = /\.\/(.*)\/index\.vue$/
const matchRegConfig = /\.\/(.*)\/form-edit\.vue$/
// 注册组件
files.keys().forEach((key) => {
  const match = key.match(matchReg)
  if (match.length > 2) {
    return
  }
  const name = match[1]
  components[name] = files(key).default
})
// 注册配置组件
configs.keys().forEach((key) => {
  const match = key.match(matchRegConfig)
  if (match.length > 2) {
    return
  }
  const name = match[1]
  components[`${name}-edit`] = configs(key).default
})
export default {
  components: {
    ...components,
    Draggable,
    tree
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
      showComp: '',
      chooseIndex: 0,
      showAddComponent: false,
      formList: [],
      showRequestPopup: false,
      request: {
        url: '',
        method: 'get',
        data: [],
        formData: [],
        specialData: []
      },
      showSpecialTree: false,
      specialIndex: -1,
      specialTree: [],
      treeType: '',
      showEditForm: false,
      editFormIndex: 0,
      configComponent: '',
      dialogVisible: false,
      editIndex: 0,
      dragFlag: false,
      componentsList: [{
        describe: {
          name: {
            key: '适合单个图片上传',
            value: '上传组件'
          }
        },
        label: '标题',
        require: true,
        component: 'input',
        key: 'form-upload',
        model: {
          text: '',
          value: ''
        }
      }, {
        describe: {
          name: {
            key: '适合单个图片上传-带转码',
            value: '上传组件-带转码'
          }
        },
        label: '标题',
        require: true,
        component: 'input',
        key: 'form-upload-transcode',
        model: {
          text: '',
          value: ''
        }
      }, {
        describe: {
          name: {
            key: '适合多个图片上传',
            value: '上传数组图片组件'
          }
        },
        label: '标题',
        require: true,
        component: 'input',
        key: 'form-upload-array',
        model: {
          text: '',
          value: []
        }
      }, {
        describe: {
          name: {
            key: '适合单行文字输入',
            value: '输入文字组件'
          }
        },
        label: '标题',
        require: true,
        placeholder: '请输入内容',
        model: {
          text: '',
          value: ''
        }
      }, {
        describe: {
          name: {
            key: '适合多行文字输入',
            value: '输入文字组件'
          }
        },
        label: '标题',
        type: 'textarea',
        require: true,
        placeholder: '请输入内容',
        model: {
          text: '',
          value: ''
        }
      }, {
        describe: {
          name: {
            key: '适合需要富文本的场合',
            value: '富文本组件'
          }
        },
        label: '标题',
        require: true,
        component: 'input',
        model: {
          text: '',
          value: ''
        },
        key: 'tinymce'
      }, {
        describe: {
          name: {
            key: '适合需要选择时间的场合',
            value: '选择时间组件'
          }
        },
        label: '时间',
        require: true,
        component: 'output',
        type: 'YYYY-MM-DD HH:mm',
        model: {
          text: '',
          value: ''
        },
        key: 'form-calendar'
      }, {
        describe: {
          name: {
            key: '适合需要树状图选择的场合',
            value: '树形选择组件'
          }
        },
        label: '树形选择',
        require: true,
        component: 'output',
        type: '',
        model: {
          text: ''
        },
        key: 'form-tree'
      }]
    }
  },
  computed: {
    // formList() {
    //   console.log('获得的formlist是', this.$store.getters.formList)
    //   return this.$store.getters.formList
    // }
  },
  watch: {
    show: {
      handler(newVal) {
        this.showPopup = newVal
      },
      deep: true,
      immediate: true
    },
    configIndex: {
      handler(newVal) {
        if (this.$store.getters.pageList[this.$store.getters.currentPage].componentList[newVal].formList) {
          this.formList = this.$store.getters.pageList[this.$store.getters.currentPage].componentList[newVal].formList
        }
        console.log('获取的formlist是', this.formList)
        if (this.$store.getters.pageList[this.$store.getters.currentPage].componentList[newVal].request) {
          this.request = this.$store.getters.pageList[this.$store.getters.currentPage].componentList[newVal].request
        }
      },
      deep: true,
      immediate: true
    }
  },
  mounted() {
  },
  methods: {
    formatTree,
    dragComponent(value) {
      console.log('拖动后的结果是', value)
      this.formList = value
    },
    chooseDrag() {
      this.dragFlag = true
    },
    dragEnd() {
      this.dragFlag = false
    },
    closePopup() {
      this.$emit('on-close')
    },
    closeForm(index) {
      this.showComp = ''
    },
    openShowComp(item, index) {
      if (item.component === 'output') {
        this.showComp = item.key
        this.chooseIndex = index
        console.log('我点击了打开', this.showComp)
      }
    },
    getFormValue(value) {
      console.log('传上来的value', value)
      this.$store.dispatch('setFormList', value)
    },
    addComponent(value) {
      if (value.key === 'form-upload-array') {
        value.model.text = []
      }
      console.log('添加组件的value', value)
      this.formList.push(value)
      console.log('添加完组件的formList', this.formList)
      this.request.formData.push({ label: value.label, value: '', id: Math.random().toString(36).slice(-8) })
      this.showAddComponent = false
    },
    onSubmit() {
      console.log('点击到了提交')
      this.showRequestPopup = true
    },
    addData() {
      this.request.data.push({ key: '', value: '' })
    },
    addSpecialData() {
      this.request.specialData.push({ key: '', value: '' })
    },
    delSpecialData(index) {
      this.request.specialData.splice(index, 1)
    },
    delData(index) {
      this.request.data.splice(index, 1)
    },
    chooseResult(val) {
      if (this.treeType === 'special') {
        this.request.specialData[this.specialIndex].value = val.data
      }
      if (this.treeType === 'edit') {
        this.formList[this.specialIndex].data = val.data
      }
    },
    chooseSpecial(index, type) {
      this.specialIndex = index
      this.treeType = type
      this.specialTree = this.formatTree(this.$store.getters.storage)
      this.showSpecialTree = true
    },
    closePage() {
      this.showSpecialTree = false
    },
    confirm() {
      this.$store.dispatch('editComponent', { index: this.configIndex, pageListName: this.$store.getters.currentPage, key: 'request', value: this.request })
      this.$store.dispatch('editComponent', { index: this.configIndex, pageListName: this.$store.getters.currentPage, key: 'formList', value: this.formList })
      this.showRequestPopup = false
      this.$emit('on-close')
    },
    delFormListData(index) {
      this.formList.splice(index, 1)
      this.request.formData.splice(index, 1)
    },
    editFormListData(item, index) {
      console.log('点击了配置', item, index)
      this.editIndex = index
      this.configComponent = `${item.key}-edit`
      if (components[this.configComponent]) {
        this.dialogVisible = true
      } else {
        this.showEditForm = true
        this.editFormIndex = index
      }
    },
    saveEditForm() {
      this.$store.dispatch('editComponent', { index: this.configIndex, pageListName: this.$store.getters.currentPage, key: 'formList', value: this.formList })
      this.showEditForm = false
    },
    closeConfigDialog() {
      console.log('form-page配置收到关闭消息')
      this.dialogVisible = false
      // 刷新
      // this.$store.dispatch('setCurrentPage', { page: this.$store.getters.currentPage, back: true })
    },
    confirmConfig() {}
  }

}
</script>

<style lang='scss' scoped>
.form-page {
    padding: 10px 10px 0px 10px;
    width: 100%;
    .add-comp {
      padding: 10px;
      height: 100px;
      text-align: center;
      line-height: 100px;
      width: 100%;
      border: solid 1px #b4b8bf;
      border-radius: 33px;
    }
    .popup-content {
      padding: 10px 10px 0px 10px;
      margin-top: 40px
    }
    .form {
      margin: 20px;
      .key-value {
        display: flex;
      }
      .delete-button {
       height: 100%;
      }
    }
}
</style>
