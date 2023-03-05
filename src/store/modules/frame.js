import Vue from 'vue'
import { assign } from 'lodash'
import context from '../../pages/mobile/main'
import { getToken, removeToken } from '@/utils/auth' // get token from cookie
import storage from './storage'
import setting from './settings'

const frame = {
  state: {
    pageList: {
      'home': {
        componentList: [
          {
            key: 'm-tabbar'
          },
          {
            key: 'swipe',
            swipeList: [{
              imageUrl: 'https://fastly.jsdelivr.net/npm/@vant/assets/apple-1.jpeg',
              page: 'home'
            }, {
              imageUrl: 'https://fastly.jsdelivr.net/npm/@vant/assets/apple-2.jpeg',
              page: ''
            }],
            request: {
              url: '/content/info/view',
              method: 'post',
              data: [{
                key: 'page',
                value: 1
              }, {
                key: 'limit',
                value: 1000
              }, {
                key: 'audit',
                value: 2
              }, {
                key: 'contentIds',
                value: ['sparkle']
              }, {
                key: 'checkTree',
                value: true
              }],
              specialData: [{
                key: 'schoolCode',
                value: 'schoolCode'
              }]
            },
            response: {
              swipeList: 'data.list',
              swipeListCor: 'image'
            },
            swipeAutoplay: 3000
          },
          {
            key: 'grid-nav',
            gridList: [{
              imageUrl: require('@/assets/mobile/grid-nav/release-info.png'),
              page: 'information',
              text: '信息发布'
            }, {
              imageUrl: require('@/assets/mobile/grid-nav/patch-approval.png'),
              page: 'form-page',
              text: '信息审核'
            }, {
              imageUrl: require('@/assets/mobile/grid-nav/appointment.png'),
              page: 'qnrtc',
              text: '场地预约'
            }],
            gridColumnNum: 4
          },
          {
            key: 'notice-bar',
            noticeList: [{
              text: 'https://fastly.jsdelivr.net/npm/@vant/assets/apple-1.jpeg'
            }, {
              text: 'dfgdf gfd gdsf gdsf sd fasd fsad ads fasd a'
            }],
            noticeClick: ''
          },
          {
            key: 'dynamic-title',
            dynamicTitle: {
              rightText: '查看更多',
              leftText: '校园动态',
              page: 'school-dynamic-list'
            }
          },
          {
            key: 'dynamic',
            dynamicList: [{
              desc: '描述信息',
              title: '123165465',
              thumb: 'https://img01.yzcdn.cn/vant/ipad.jpeg',
              text: 'fasfjsdh lsjd f;ldsj f;klsdha ;lfhsd ;lfhsd;l fhsd fsd fsd fasd fs dasf  v s',
              page: 'artical'
            }, {
              desc: '描述信息',
              title: '123165465',
              thumb: 'https://img01.yzcdn.cn/vant/ipad.jpeg',
              text: 'fasfjsdh lsjd f;ldsj f;klsdha ;lfhsd ;lfhsd;l fhsd fsd fsd fasd fs dasf  v s',
              page: 'artical'
            }, {
              desc: '描述信息',
              title: '12dsfgdfg 3165465',
              thumb: 'https://img01.yzcdn.cn/vant/ipad.jpeg',
              text: 'fasfjsdh lsjd f;ldsj f;klsdha ;lfhsd ;lfhsd;l fhsd fsd fsd fasd fs dasf  v s',
              page: 'artical'
            }, {
              desc: '描述信息',
              title: '12hdgd 3165465',
              thumb: 'https://img01.yzcdn.cn/vant/ipad.jpeg',
              text: 'fasfjsdh lsjd f;ldsj f;klsdha ;lfhsd ;lfhsd;l fhsd fsd fsd fasd fs dasf  v s',
              page: 'artical'
            }, {
              desc: '描述信息',
              title: '123对方感受的165465',
              thumb: 'https://img01.yzcdn.cn/vant/ipad.jpeg',
              text: 'fasfjsdh lsjd f;ldsj f;klsdha ;lfhsd ;lfhsd;l fhsd fsd fsd fasd fs dasf  v s',
              page: 'artical'
            }, {
              desc: '描述信息',
              title: '12316对方感到发生过5465',
              thumb: 'https://img01.yzcdn.cn/vant/ipad.jpeg',
              text: 'fasfjsdh lsjd f;ldsj f;klsdha ;lfhsd ;lfhsd;l fhsd fsd fsd fasd fs dasf  v s',
              page: 'artical'
            }],
            request: {
              url: '/content/info/view',
              method: 'post',
              data: [{
                key: 'page',
                value: 1
              }, {
                key: 'limit',
                value: 5
              }, {
                key: 'audit',
                value: 2
              }, {
                key: 'contentIds',
                value: ['news']
              }, {
                key: 'previewType',
                value: 'image'
              }, {
                key: 'sort',
                value: { start_date: -1 }
              }, {
                key: 'checkTree',
                value: true
              }],
              specialData: [{
                key: 'schoolCode',
                value: 'schoolCode'
              }]
            },
            response: {
              descList: 'data.list',
              descListCor: 'creator.account',
              titleList: 'data.list',
              titleListCor: 'title',
              thumbList: 'data.list',
              thumbListCor: 'image'
            },
            dynamicJumpPage: {
              page: 'artical'
            },
            setData: 'SET_ARTICAL'
          }
        ]
      },
      'school-dynamic-list': {
        componentList: [
          {
            key: 'nav-bar',
            navBar: {
              navBarTitle: '校园动态',
              navBarRight: {
                text: '新增',
                page: 'form-school-dynamic'
              }
            }
          },
          {
            key: 'dynamic-1',
            dynamicList: [{
              desc: '描述信息',
              title: '123165465',
              thumb: 'https://img01.yzcdn.cn/vant/ipad.jpeg',
              text: 'fasfjsdh lsjd f;ldsj f;klsdha ;lfhsd ;lfhsd;l fhsd fsd fsd fasd fs dasf  v s',
              updateTime: '2022/8/9 14:22:22',
              page: 'artical'
            }, {
              desc: '描述信息',
              title: '123165465',
              text: 'fasfjsdh lsjd f;ldsj f;klsdha ;lfhsd ;lfhsd;l fhsd fsd fsd fasd fs dasf  v s',
              updateTime: '2022/8/9 14:22:22',
              page: 'artical'
            }, {
              desc: '描述信息',
              title: '12dsfgdfg 3165465',
              thumb: 'https://img01.yzcdn.cn/vant/ipad.jpeg',
              text: 'fasfjsdh lsjd f;ldsj f;klsdha ;lfhsd ;lfhsd;l fhsd fsd fsd fasd fs dasf  v s',
              updateTime: '2022/8/9 14:22:22',
              page: 'artical'
            }, {
              desc: '描述信息',
              title: '12hdgd 3165465',
              thumb: 'https://img01.yzcdn.cn/vant/ipad.jpeg',
              text: 'fasfjsdh lsjd f;ldsj f;klsdha ;lfhsd ;lfhsd;l fhsd fsd fsd fasd fs dasf  v s',
              page: 'artical'
            }, {
              desc: '描述信息',
              title: '123对方感受的165465',
              thumb: 'https://img01.yzcdn.cn/vant/ipad.jpeg',
              text: 'fasfjsdh lsjd f;ldsj f;klsdha ;lfhsd ;lfhsd;l fhsd fsd fsd fasd fs dasf  v s',
              page: 'artical'
            }, {
              desc: '描述信息',
              title: '12316对方感到发生过5465',
              thumb: 'https://img01.yzcdn.cn/vant/ipad.jpeg',
              text: 'fasfjsdh lsjd f;ldsj f;klsdha ;lfhsd ;lfhsd;l fhsd fsd fsd fasd fs dasf  v s',
              updateTime: '2022/8/9 14:22:22',
              page: 'artical'
            }],
            dynamicJumpPage: {
              page: 'artical'
            },
            setData: 'SET_ARTICAL'
          }
        ]
      },
      'artical': {
        componentList: [
          {
            key: 'nav-bar',
            navBar: {
              navBarTitle: '班级动态详情'
            }
          },
          {
            key: 'artical-detail',
            articalDetail: {
              desc: '描述信息',
              title: '123165465',
              thumb: 'https://img01.yzcdn.cn/vant/ipad.jpeg',
              page: 'home'
            }
          }
        ]
      },
      'form-school-dynamic': {
        componentList: [
          {
            key: 'nav-bar',
            navBar: {
              navBarTitle: '校园动态发布'
            }
          },
          {
            key: 'form-page',
            formList: [{
              label: '封面',
              require: true,
              component: 'input',
              key: 'form-upload',
              model: {
                text: ''
              }
            }, {
              label: '标题',
              require: true,
              placeholder: '请输入标题',
              model: {
                text: ''
              }
            }, {
              label: '摘要',
              type: 'textarea',
              require: true,
              placeholder: '请输入摘要',
              model: {
                text: ''
              }
            }, {
              label: '正文',
              require: true,
              component: 'input',
              model: {
                text: ''
              },
              key: 'tinymce'
            }, {
              label: '开始时间',
              require: true,
              component: 'output',
              type: 'YYYY-MM-DD HH:mm',
              model: {
                text: ''
              },
              key: 'form-calendar'
            }, {
              label: '结束时间',
              require: true,
              component: 'output',
              type: 'YYYY-MM-DD HH:mm',
              model: {
                text: ''
              },
              key: 'form-calendar'
            }],
            request: {
              url: '/mobile/info/view',
              method: 'post',
              data: [{
                key: 'audit',
                value: 2
              }, {
                key: 'contentIds',
                value: ['news']
              }, {
                key: 'previewType',
                value: 'image'
              }, {
                key: 'checkTree',
                value: true
              }],
              formData: [{
                label: '封面',
                value: ''
              }, {
                label: '标题',
                value: ''
              }, {
                label: '摘要',
                value: ''
              }, {
                label: '正文',
                value: ''
              }, {
                label: '开始时间',
                value: ''
              }, {
                label: '结束时间',
                value: ''
              }],
              specialData: [{
                key: 'schoolCode',
                value: 'schoolCode'
              }]
            }
          }
        ]
      },
      'form-page': {
        componentList: [
          {
            key: 'nav-bar',
            navBar: {
              navBarTitle: '表单提交'
            }
          },
          {
            key: 'form-page',
            formList: [{
              label: '测试',
              placeholder: '请输入测试',
              model: ''
            }, {
              label: '测试123',
              model: ''
            }, {
              label: '图片',
              component: 'input',
              key: 'form-upload'
            }, {
              label: '开始时间',
              component: 'output',
              key: 'form-calendar'
            }]
          }
        ]
      },
      'my': {
        componentList: [
          {
            key: 'm-tabbar'
          },
          {
            key: 'my-head',
            specialData: {
              avatar: '',
              name: ''
            }
          },
          {
            key: 'cell',
            cellList: [{
              icon: 'location-o',
              title: '帮助中心',
              page: 'home',
              func: ''
            }, {
              icon: 'location-o',
              title: '健康数据采集',
              page: 'home',
              func: ''
            }, {
              icon: 'location-o',
              title: '退出登录',
              page: '',
              func: {
                method: 'dialog',
                show: true,
                title: '退出登录',
                text: '确定退出登录吗？',
                func: 'logout'
              }
            }]
          }
        ]
      },
      'class': {
        componentList: [
          {
            key: 'm-tabbar'
          },
          {
            key: 'swipe',
            swipeList: [{
              imageUrl: 'https://fastly.jsdelivr.net/npm/@vant/assets/apple-1.jpeg',
              page: 'home'
            }, {
              imageUrl: 'https://fastly.jsdelivr.net/npm/@vant/assets/apple-2.jpeg',
              page: ''
            }],
            request: {
              url: '/api/private/content/info/view',
              method: 'post',
              data: [{
                key: 'page',
                value: 1
              }, {
                key: 'limit',
                value: 1000
              }, {
                key: 'audit',
                value: 2
              }, {
                key: 'contentIds',
                value: ['sparkle']
              }, {
                key: 'checkTree',
                value: true
              }],
              specialData: [{
                key: 'schoolCode',
                value: 'parkCode'
              }]
            },
            response: {
              swipeList: 'data.list',
              swipeListCor: ''
            },
            swipeAutoplay: 3000
          },
          {
            key: 'grid-nav',
            gridList: [{
              imageUrl: require('@/assets/mobile/grid-nav/class-table.png'),
              page: '',
              text: '我的课表'
            }, {
              imageUrl: require('@/assets/mobile/grid-nav/patch-approval.png'),
              page: '',
              text: '我的考勤'
            }, {
              imageUrl: require('@/assets/mobile/grid-nav/person-course.png'),
              page: '',
              text: '课程考勤'
            }, {
              imageUrl: require('@/assets/mobile/grid-nav/class-info.png'),
              page: '',
              text: '班级信息'
            }, {
              imageUrl: require('@/assets/mobile/grid-nav/class-ranking.png'),
              page: '',
              text: '红旗评比'
            }, {
              imageUrl: require('@/assets/mobile/grid-nav/mix-course.png'),
              page: '',
              text: '混班教学'
            }, {
              imageUrl: require('@/assets/mobile/grid-nav/take-leava.png'),
              page: '',
              text: '请假'
            }],
            gridColumnNum: 4
          },
          {
            key: 'dynamic-title',
            dynamicTitle: {
              rightText: '查看更多',
              leftText: '班级动态',
              page: 'school-dynamic-list'
            }
          },
          {
            key: 'dynamic',
            dynamicList: [{
              desc: '描述信息',
              title: '123165465',
              thumb: 'https://img01.yzcdn.cn/vant/ipad.jpeg',
              text: 'fasfjsdh lsjd f;ldsj f;klsdha ;lfhsd ;lfhsd;l fhsd fsd fsd fasd fs dasf  v s',
              page: 'artical'
            }, {
              desc: '描述信息',
              title: '123165465',
              thumb: 'https://img01.yzcdn.cn/vant/ipad.jpeg',
              text: 'fasfjsdh lsjd f;ldsj f;klsdha ;lfhsd ;lfhsd;l fhsd fsd fsd fasd fs dasf  v s',
              page: 'artical'
            }, {
              desc: '描述信息',
              title: '12dsfgdfg 3165465',
              thumb: 'https://img01.yzcdn.cn/vant/ipad.jpeg',
              text: 'fasfjsdh lsjd f;ldsj f;klsdha ;lfhsd ;lfhsd;l fhsd fsd fsd fasd fs dasf  v s',
              page: 'artical'
            }, {
              desc: '描述信息',
              title: '12hdgd 3165465',
              thumb: 'https://img01.yzcdn.cn/vant/ipad.jpeg',
              text: 'fasfjsdh lsjd f;ldsj f;klsdha ;lfhsd ;lfhsd;l fhsd fsd fsd fasd fs dasf  v s',
              page: 'artical'
            }, {
              desc: '描述信息',
              title: '123对方感受的165465',
              thumb: 'https://img01.yzcdn.cn/vant/ipad.jpeg',
              text: 'fasfjsdh lsjd f;ldsj f;klsdha ;lfhsd ;lfhsd;l fhsd fsd fsd fasd fs dasf  v s',
              page: 'artical'
            }, {
              desc: '描述信息',
              title: '12316对方感到发生过5465',
              thumb: 'https://img01.yzcdn.cn/vant/ipad.jpeg',
              text: 'fasfjsdh lsjd f;ldsj f;klsdha ;lfhsd ;lfhsd;l fhsd fsd fsd fasd fs dasf  v s',
              page: 'artical'
            }],
            dynamicJumpPage: {
              page: 'artical'
            },
            setData: 'SET_ARTICAL'
          }
        ]
      },
      'login': {
        componentList: [
          {
            key: 'login'
          }
        ]
      },
      'select-child': {
        componentList: [
          {
            key: 'select-child'
          }
        ]
      },
      'qnrtc': {
        componentList: [
          {
            key: 'qnrtc'
          }
        ]
      },
      'chat': {
        componentList: [
          {
            key: 'chat'
          }
        ]
      },
      'course-attendance': {
        componentList: [
          {
            key: 'course-attendance',
            attendance: {
              firstPage: ''
            }
          }
        ]
      },
      'event-attendance': {
        componentList: [
          {
            key: 'event-attendance',
            attendance: {
              firstPage: ''
            }
          }
        ]
      },
      'information': {
        componentList: [
          {
            key: 'nav-bar',
            navBar: {
              navBarTitle: '信息发布'
            }
          },
          {
            key: 'shadow-box',
            shadowBoxList: [{
              imageUrl: require('@/assets/mobile/shadow-box/new.png'),
              page: 'school-dynamic-list',
              text: '校园动态'
            }, {
              imageUrl: require('@/assets/mobile/shadow-box/school-photo.png'),
              page: '',
              text: '校园风采'
            }, {
              imageUrl: require('@/assets/mobile/shadow-box/general-notice.png'),
              page: 'common-notice',
              text: '一般通知'
            }, {
              imageUrl: require('@/assets/mobile/shadow-box/emegency-notice.png'),
              page: '',
              text: '紧急通知'
            }, {
              imageUrl: require('@/assets/mobile/shadow-box/welcome.png'),
              page: '',
              text: '欢迎词'
            }]
          }
        ]
      },
      'common-notice': {
        componentList: [
          {
            key: 'nav-bar',
            navBar: {
              navBarTitle: '一般通知',
              navBarRight: {
                text: '新增',
                page: 'form-common-notice'
              }
            }
          },
          {
            key: 'dynamic-1',
            dynamicList: [{
              desc: '描述信息',
              title: '123165465',
              text: 'fasfjsdh lsjd f;ldsj f;klsdha ;lfhsd ;lfhsd;l fhsd fsd fsd fasd fs dasf  v s',
              updateTime: '2022/8/9 14:22:22',
              page: 'artical'
            }, {
              desc: '描述信息',
              title: '123165465',
              text: 'fasfjsdh lsjd f;ldsj f;klsdha ;lfhsd ;lfhsd;l fhsd fsd fsd fasd fs dasf  v s',
              updateTime: '2022/8/9 14:22:22',
              page: 'artical'
            }, {
              desc: '描述信息',
              title: '12dsfgdfg 3165465',
              text: 'fasfjsdh lsjd f;ldsj f;klsdha ;lfhsd ;lfhsd;l fhsd fsd fsd fasd fs dasf  v s',
              updateTime: '2022/8/9 14:22:22',
              page: 'artical'
            }, {
              desc: '描述信息',
              title: '12hdgd 3165465',
              text: 'fasfjsdh lsjd f;ldsj f;klsdha ;lfhsd ;lfhsd;l fhsd fsd fsd fasd fs dasf  v s',
              page: 'artical'
            }, {
              desc: '描述信息',
              title: '123对方感受的165465',
              text: 'fasfjsdh lsjd f;ldsj f;klsdha ;lfhsd ;lfhsd;l fhsd fsd fsd fasd fs dasf  v s',
              page: 'artical'
            }, {
              desc: '描述信息',
              title: '12316对方感到发生过5465',
              text: 'fasfjsdh lsjd f;ldsj f;klsdha ;lfhsd ;lfhsd;l fhsd fsd fsd fasd fs dasf  v s',
              updateTime: '2022/8/9 14:22:22',
              page: 'artical'
            }],
            dynamicJumpPage: {
              page: 'artical'
            },
            setData: 'SET_ARTICAL'
          }
        ]
      },
      'form-common-notice': {
        componentList: [
          {
            key: 'nav-bar',
            navBar: {
              navBarTitle: '通知发布'
            }
          },
          {
            key: 'form-page',
            formList: [{
              label: '标题',
              require: true,
              placeholder: '请输入标题',
              model: {
                text: ''
              }
            }, {
              label: '正文',
              type: 'textarea',
              require: true,
              placeholder: '请输入正文',
              model: {
                text: ''
              }
            }, {
              label: '开始时间',
              require: true,
              component: 'output',
              type: 'YYYY-MM-DD HH:mm',
              model: {
                text: ''
              },
              key: 'form-calendar'
            }, {
              label: '结束时间',
              require: true,
              component: 'output',
              type: 'YYYY-MM-DD HH:mm',
              model: {
                text: ''
              },
              key: 'form-calendar'
            }]
          }
        ]
      }
    },
    currentPage: 'home'
  },
  mutations: {
    SET_CURRENTPAGE: (state, data) => {
      console.log('currentPage', data)
      state.currentPage = data
    },
    SET_PAGELIST: (state, data) => {
      console.log('pageList', data)
      state.pageList = data
    },
    SET_PAGE: (state, data) => {
      console.log('pageList', data)
      state.pageList[data.pageListName].componentList = data.page
    },
    DEL_PAGELIST: (state, data) => {
      console.log('delpageList', data)
      state.pageList[data.pageListName].componentList.splice(data.index, 1)
    },
    ADD_COMPONENT: (state, data) => {
      console.log('addcomponent', data)
      state.pageList[data.pageListName].componentList.push(data.component)
    },
    DEL_PAGE: (state, data) => {
      console.log('delpage', data)
      Vue.delete(state.pageList, data)
      console.log('删除后的nowpage', state.pageList)
    },
    ADD_PAGE: (state, data) => {
      console.log('addpage', data)
      Vue.set(state.pageList, data.pageListName, { componentList: [] })
      console.log('nowpage', state.pageList)
    },
    EDIT_COMPONENT: (state, data) => {
      console.log('edit_component', data)
      Vue.set(state.pageList[data.pageListName].componentList[data.index], data.key, data.value)
      console.log('nowpage', state.pageList)
    },
    // 编辑requestData的东西
    EDIT_REQUESTDATA: (state, data) => {
      console.log('edit_requestData', data)
      if (state.pageList[data.pageListName].requestData && state.pageList[data.pageListName].requestData[data.key]) {
        Vue.set(state.pageList[data.pageListName].requestData, data.key, data.value)
      } else if (state.pageList[data.pageListName].requestData) {
        Vue.set(state.pageList[data.pageListName].requestData, data.key, data.value)
      } else if (!state.pageList[data.pageListName].requestData) {
        state.pageList[data.pageListName].requestData = {}
        Vue.set(state.pageList[data.pageListName].requestData, data.key, data.value)
      }
      console.log('now——requestData', state.pageList)
    },
    EDIT_FORM_COMPONENT: (state, data) => {
      console.log('edit_form_component', data)
      Vue.set(state.pageList[data.pageListName].componentList[data.configIndex].formList[data.editIndex], data.key, data.value)
      console.log('nowpage', state.pageList)
    },
    EDIT_PAGE: (state, data) => {
      console.log('edit_page', data)
      Vue.set(state.pageList[data.pageListName], data.key, data.value)
      console.log('nowpage', state.pageList)
    },
    EDIT_PAGE_NAME: (state, data) => {
      console.log('edit_page_name', data)
      Vue.delete(state.pageList, data.oldName)
      Vue.set(state.pageList, data.newName, data.value)
    }
  },

  actions: {
    // 切换页面使用
    setCurrentPage: async({ commit, state, dispatch }, data) => {
      console.log('router推入页面切换', data.page, setting.state.mode)
      commit('SET_CURRENTPAGE', data.page)
      if (setting.state.mode === 'user') {
        context.$router.push('/mobile/' + data.page)
      } else {
        context.$router.push('/whoisyourdaddy/' + data.page)
      }
    },
    // 加载页面
    loadPageList: async({ commit, state, dispatch }, data) => {
      const hasToken = getToken()
      if (hasToken) {
        if (data.page === 'login') {
          data.page = 'home'
        }
        console.log('storage', storage.state.userInfo, JSON.stringify(storage.state.userInfo))
        if (JSON.stringify(storage.state.userInfo) === '{}') {
          await dispatch('getInfo')
          // todo
          await dispatch('getAndSetFrame')
        }
        if (state.auths) {
          console.log()
        }
      } else {
        data.page = 'login'
        commit('SET_TOKEN', '')
        removeToken()
        Vue.prototype.$notify({
          message: '登陆验证过期或未登录，请登录',
          type: 'warning',
          duration: 3 * 1000
        })
      }
      commit('SET_CURRENTPAGE', data.page)
      if (!data.back) {
        commit('PUSH_PAGECHANGE', data.page)
      }
      console.log('开始切换页面123456798', state)
      if (state.pageList[data.page] && state.pageList[data.page].requestData) {
        console.log('开始推入请求', state.pageList[data.page].requestData)
        dispatch('addRequest', state.pageList[data.page].requestData)
      }
      if (state.pageList[data.page] && state.pageList[data.page].componentList && state.pageList[data.page].componentList.length) {
        for (const item of state.pageList[data.page].componentList) {
          console.log('开始切换页面')
          item.new = true
          dispatch(`${item.key}`, item)
        }
      }
      if (state.pageList[data.page] && state.pageList[data.page].backgroundColor) {
        dispatch('setBackgroundColor', state.pageList[data.page].backgroundColor)
      } else {
        dispatch('setBackgroundColor', '#ffffff')
      }
      if (state.pageList[data.page] && state.pageList[data.page].keepAlive) {
        dispatch('setKeepAlive', state.pageList[data.page].keepAlive)
      } else {
        dispatch('setKeepAlive', false)
      }
    },
    // 选择模板的时候注入模板列表
    setPagelist: ({ commit, state, dispatch }, data) => {
      commit('SET_PAGELIST', data.pageList)
      if (data.page && data.page !== '') {
        dispatch('setCurrentPage', { page: data.page })
      }
    },
    // 删除模板内容
    delPagelist: ({ commit }, data) => {
      commit('DEL_PAGELIST', data)
    },
    // 新增compenent
    addComponent: ({ commit }, data) => {
      commit('ADD_COMPONENT', data)
    },
    // 修改页面compenent排序用
    setPage: ({ commit }, data) => {
      commit('SET_PAGE', data)
    },
    // 新增页面
    addPage: ({ commit }, data) => {
      commit('ADD_PAGE', data)
    },
    // 删除页面
    delPage: ({ commit }, data) => {
      commit('DEL_PAGE', data)
    },
    // 编辑组件
    editComponent: ({ commit }, data) => {
      commit('EDIT_COMPONENT', data)
    },
    // 编辑requestData的东西
    editRequestData: ({ commit }, data) => {
      commit('EDIT_REQUESTDATA', data)
    },
    // 编辑表单组件
    editFormComponent: ({ commit }, data) => {
      commit('EDIT_FORM_COMPONENT', data)
    },
    // 编辑页面属性用
    editPage: ({ commit }, data) => {
      commit('EDIT_PAGE', data)
    },
    refreshPage: ({ commit, state, dispatch }, data) => {
      if (state.pageList[state.currentPage] && state.pageList[state.currentPage].componentList && state.pageList[state.currentPage].componentList.length) {
        for (const item of state.pageList[state.currentPage].componentList) {
          console.log('开始刷新页面')
          item.new = true
          dispatch(`${item.key}`, item)
        }
      }
      if (state.pageList[state.currentPage] && state.pageList[state.currentPage].backgroundColor) {
        dispatch('setBackgroundColor', state.pageList[state.currentPage].backgroundColor)
      } else {
        dispatch('setBackgroundColor', '#ffffff')
      }
    }
  }
}
export default frame

