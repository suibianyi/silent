import _ from 'lodash'
import moment from 'moment'
import {
  mRequest
} from '@/api/request'
import storage from './storage'
import {
  formatReference
} from '@/mUtils'
const form = {
  state: {
    formPage: {
      formList: [],
      request: {}
    }
  },
  mutations: {
    SET_FORM: (state, data) => {
      console.log('formList', data)
      state.formPage.formList = data.formList
      state.formPage.request = data.request
    },
    SET_FORM_LIST_ITEM: (state, data) => {
      console.log('formListItem', data)
      state.formPage.formList[data.flag].model = data
    }
  },

  actions: {
    setFormList: ({ commit, state }, data) => {
      if (state.formPage.formList[data.flag]) {
        commit('SET_FORM_LIST_ITEM', data)
      }
    },
    'form-page': async({ commit, state }, data) => {
      const formList = _.cloneDeep(data.formList)
      for (const item of formList) {
        if (item.data && item.data !== '') {
          item.model.text = formatReference(storage.state, item.data)
          item.model.value = formatReference(storage.state, item.data)
          if (item.key === 'form-calendar') {
            item.model.text = moment(formatReference(storage.state, item.data)).format(item.type)
          }
        }
      }
      console.log('得到的formlist是', formList)
      commit('SET_FORM', { formList, request: data.request })
    },
    handelFormList: async({ commit, state }, data) => {
      const sendata = {}
      console.log('开始准备提交表单数据', state.formPage)
      for (const item of state.formPage.request.specialData) {
        console.log('开始准备提交表单数据formatReference的结果是', formatReference(storage.state, item.value))
        sendata[item.key] = formatReference(storage.state, item.value)
      }
      // for (const item of state.formPage.request.specialData) {
      //   sendata[item.key] = storage.state[item.value]
      // }
      for (const item of state.formPage.request.data) {
        sendata[item.key] = item.value
      }
      for (const item of state.formPage.request.formData) {
        sendata[item.value] = item.value
      }
      for (let i = 0; i < state.formPage.request.formData.length; i++) {
        if (state.formPage.formList[i].component === 'output') {
          sendata[state.formPage.request.formData[i].value] = state.formPage.formList[i].model.value
        } else if (state.formPage.formList[i].component === 'input') {
          sendata[state.formPage.request.formData[i].value] = state.formPage.formList[i].model.value
        } else {
          sendata[state.formPage.request.formData[i].value] = state.formPage.formList[i].model.text
        }
      }
      console.log('开始准备提交表单数据sendata是', sendata)
      const res = await mRequest({
        url: state.formPage.request.url,
        method: state.formPage.request.method,
        data: sendata
      })
      console.log('请求回来的结果是', res)
    }
  }
}
export default form

