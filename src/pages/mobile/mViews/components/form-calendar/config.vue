<template>
  <div class="form-page">
    <van-popup v-model="showPopup" :round="true" :style="{ width: '100%', height: '100%' }" :closeable="true" @close="closePopup">
      <div class="popup-content">
        <van-form>
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
  </div>
</template>

<script>
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
