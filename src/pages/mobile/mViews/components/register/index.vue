<!--  -->
<template>
  <div class="bg">
    <div class="header">
      <div class="register-content">
        <div class="content">
          <van-form ref="form" :model="form" :error-type="errorType">
            <van-field
              v-model="form.tel"
              placeholder="请输入手机号"
              label="+86"
              :left-icon="telephonePng"
              label-width="30"
              @input="handlerInput"
            >
              <!-- <vaninput v-model="form.telephone" :trim="true" placeholder="请输入手机号" :maxlength="20" /> -->
            </van-field>
            <van-field
              ref="phoneIpt"
              v-model="form.code"
              class="codeField"
              placeholder="验证码"
              label=" "
              :left-icon="vcodePng"
              label-width="30"
            >
              <!-- <van-input v-model="form.vcode" :trim="true" placeholder="请输入验证码" :maxlength="20" /> -->
              <!-- <van-verification-code ref="uCode" :seconds="seconds"
                                     @change="codeChange" /> -->
              <template #button>
                <van-button size="small" :disabled="disabledBtn" type="info" @click="getCode">{{ codeMsg }}</van-button>
              </template>
            </van-field>
            <van-field
              readonly
              clickable
              :left-icon="'cluster'"
              label-width="30"
              label=" "
              :value="gradeVal"
              placeholder="选择年级"
              @click="showPicker = true"
            />
            <van-field
              readonly
              clickable
              :left-icon="'user-o'"
              label-width="30"
              label=" "
              :value="studentVal"
              placeholder="选择学生"
              @click="showPickerStu = true"
            />
            <van-field
              v-model="form.parentTitle"
              :left-icon="'friends-o'"
              label-width="30"
              label=" "
              placeholder="输入称谓(如:爸爸)"
            />
            <van-field
              v-model="form.password"
              type="password"
              placeholder="请输入密码"
              label=" "
              :left-icon="lockPng"
              label-width="30"
            />
            <van-field
              v-model="form.passwordConfig"
              type="password"
              placeholder="请再次输入密码"
              label=" "
              :left-icon="lockPng"
              label-width="30"
              @input="handlePsdIpt"
            />
          </van-form>
          <!-- <div class="log-direct" @tap="toLogin">使用已有账号直接登录</div> -->
          <div style="margin: 16px;">
            <van-button round block type="info" native-type="submit" @click="register">注册</van-button>
          </div>
          <div class="footer">
            <van-checkbox-group v-model="privacySelect" class="privacyRadio" direction="horizontal">
              <van-checkbox name="select">注册代表同意《服务协议》,和隐私</van-checkbox>
            </van-checkbox-group>
          </div>
        </div>
        <van-popup v-model="showPicker" round position="bottom">
          <van-picker
            show-toolbar
            :columns="grades"
            @cancel="showPicker = false"
            @confirm="onConfirm"
          />
        </van-popup>
        <van-popup v-model="showPickerStu" round position="bottom">
          <van-picker
            show-toolbar
            :columns="studentList"
            @cancel="showPickerStu = false"
            @confirm="onConfirmStu"
          />
        </van-popup>
      </div>
    </div>

    <ourLoading is-full-screen :text="text" :active="loading" />

    <van-modal v-model="codeShow" :show-confirm-button="false" :content="'请扫码登录'" />

  </div>
</template>

<script>
// 这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
// 例如：import 《组件名称》 from '《组件路径》';
// import { getImageUrl } from '@/utils/common.js'
// const Encrypt = require('@/utils/jsencrypt.js')
// import {
//   login,
//   getUserInfo
// } from '@/api/login'
// import {
//   mergePersonPic
// } from '@/api/personal-center.js'
import {
  getGradeList,
  getTelCode,
  getStudentList,
  parentRegister
} from '@/api/school.js'
import _ from 'lodash'

export default {
  data() {
    // 这里存放数据
    return {
      // 扫码登录判断
      codeShow: false,
      // 验证码倒计时
      tips: '',
      seconds: 60,
      vcodeStatus: true,
      // 样式
      title: '注册',
      leftIconStyle: {
        width: '40px',
        height: '40px'
      },
      labelStyle: {
        color: '#c0c4cc',
        marginLeft: '40px'
      },
      registereStyle: {
        backgroundColor: '#736bdb',
        borderRadius: '40px',
        color: '#ffffff',
        marginTop: '20px'
      },
      // 表单校验
      // 文字提示
      errorType: ['toast'],
      rules: {
        telephone: [{
          required: true,
          message: '请输入手机号',
          // blur和change事件触发检验
          trigger: 'blur,change'
        },
        {
          // 自定义验证函数，见上说明
          validator: (rule, value, callback) => {
            // 上面有说，返回true表示校验通过，返回false表示不通过
            // this.$u.test.mobile()就是返回true或者false的
            return this.$u.test.mobile(value)
          },
          message: '手机号码格式不正确',
          // 触发器可以同时用blur和change
          trigger: ['change', 'blur']
        }
        ],
        vcode: [{
          required: true,
          message: '验证码不能为空',
          // blur和change事件触发检验
          trigger: 'blur,change'
        },
        {
          min: 4,
          max: 4,
          message: '验证码长度不正确'
        }
        ],
        password: [{
          required: true,
          message: '请输入密码',
          // 可以单个或者同时写两个触发验证方式
          trigger: 'blur,change'
        },
        // {
        // 	pattern: /^[0-9a-zA-Z]*$/g,
        // 	// 正则检验前先将值转为字符串
        // 	transform(value) {
        // 		return String(value);
        // 	},
        // 		message: '只能包含字母或数字',
        // },
        {
          min: 8,
          message: '密码长度至少为8位'
        }
        ],
        passwordConfig: [{
          required: true,
          message: '请输入确认密码',
          // 可以单个或者同时写两个触发验证方式
          trigger: 'blur,change'
        },
        {
          validator: (rule, value, callback) => {
            if (value === this.form.password) {
              return true
            } else {
              return false
            }
          },
          message: '两次密码不一致'
        }
        ]
      },
      // 表单信息
      form: {
        tel: '',
        account: '',
        code: '',
        password: '',
        passwordConfig: '',
        grade: '',
        clazz: '',
        studentId: '',
        parentTitle: '',
        telephone: ''
      },
      // 提交
      submitStatus: false,
      // 暂存扫码进来的班级id
      classId: '',
      schoolId: '',
      detailInfo: '',
      text: '',
      loading: false,
      telephonePng: require('@/assets/mobile/register/telephone.png'),
      vcodePng: require('@/assets/mobile/register/vcode.png'),
      lockPng: require('@/assets/mobile/register/lock.png'),
      disabledBtn: true,
      privacySelect: [''],
      owPopover: false,
      actions: [{ text: '选项一' }, { text: '选项二' }, { text: '选项三' }],
      showPicker: false,
      gradeVal: '',
      studentVal: '',
      columns: ['杭州', '宁波', '温州', '绍兴', '湖州', '嘉兴', '金华', '衢州'],
      schoolCode: '', // "da352b38d30948cdb596ffd5eba0ef34"
      grades: [],
      codeMsg: '获取验证码',
      timer: 0,
      showPickerStu: false,
      studentList: []
    }
  },
  // 监听属性 类似于data概念
  computed: {
    components() {
      console.log('this.$store.getters.frame.currentPage', this.$store.getters.currentPage)
      const config = this.$store.getters.pageList[this.$store.getters.currentPage]
      console.log('config', config)
      let component = []
      if (config && config.componentList.length) {
        component = config.componentList
      }
      console.log('获得的component', component)
      this.$nextTick(() => {
        this.$refs.content.scrollTo(0, 0)
      })
      return component
    }
  },
  async created() {
    const { href } = window.location
    const query = href.slice(href.lastIndexOf('?') + 1)
    this.schoolCode = query.split('=')[1] || ''
    this.handlerInput = _.debounce(this.inputIhoneFnc, 1000)
    this.handlePsdIpt = _.debounce(this.inputPsdFnc, 1000)
    this.grades = await this.getGrades()
  },
  // 监控data中的数据变化
  // 获取
  onLoad(options) {
    // this.schoolId = '71997ac69bb84891b498aec26a93f5f1'
    // this.classId = 'f9574230da3641d0806a2e3f6b76dc44'
    if (options.detailInfo) {
      console.log('---')
      const detailInfo = JSON.parse(decodeURIComponent(options.detailInfo))
      this.classId = detailInfo.classId
      this.schoolId = detailInfo.schoolId
      console.log('班级ID', this.classId, this.schoolId)
    }
  },
  onReady() {
    this.$refs.form.setRules(this.rules)
  },
  // 方法集合
  methods: {
    // getImageUrl,
    // 获取登录的用户信息
    getUserInfos(openid, avatarUrl) {
    //   this.text = '获取用户信息中'
    //   return getUserInfo({
    //     // token: uni.getStorageSync('Authorization')
    //   })
    //     .then(async(res) => {
    //       await mergePersonPic({
    //         basicPersonId: res.data.basicPersonId,
    //         headImageUrl: avatarUrl,
    //         faceImageUrl: []
    //       })
    //       this.loading = false
    //       console.log('登录成功')
    //       res.data.openid = openid
    //       res.data.headImageUrl = avatarUrl
      // 设置用户信息到缓存班级 学校  人员编号
      //   uni.setStorageSync('loginUserInfo', res.data)
      //   uni.setStorageSync('userInfo', res.data)
      //   const item = {
      //     classId: this.classId,
      //     schoolId: this.schoolId
      //   }
      // 家长
      //   uni.navigateTo({
      //     url: '../../../pages_common/pages/student-bind-details/student-bind-details?detailInfo=' +
      // 						encodeURIComponent(JSON.stringify(item))
      //   })
      // }).catch((e) => {
      // 先清除缓存信息
      //   uni.clearStorageSync()
      //   uni.showToast({
      //     title: `登录失败，请尝试手动登录`,
      //     icon: 'none',
      //     duration: 2000
      //   })
      this.loading = false
      // })
    },
    // 已有账号跳转登录页
    toLogin() {
    //   const item = {
    //     classId: this.classId,
    //     schoolId: this.schoolId
    //   }
    //   uni.navigateTo({
    //     url: '../../../pages/login/login?detailInfo=' + encodeURIComponent(JSON.stringify(item))
    //   })
    },
    async encrypt(password) {
    //   await this.$store.dispatch('initPk')
    //   const jsencrypt = new Encrypt.JSEncrypt()
    //   jsencrypt.setPublicKey(this.$store.state.pk)
    //   const encrypted = jsencrypt.encrypt(password)
    //   return encrypted
    },
    // 登录接口
    async userLogin(wxInfo, avatarUrl) {
      this.text = '登录中...'
      //   uni.clearStorageSync()
    //   const encrypted = await this.encrypt(this.form.password)
    //   const data = {
    //     school: '',
    //     type: 'parent',
    //     account: this.form.telephone,
    //     password: encrypted,
    //     openid: wxInfo.openid,
    //     unionid: wxInfo.unionid
    //   }
    //   return login(data)
    //     .then((res) => {
    //       // token存缓存
    //     //   uni.setStorageSync('Authorization', res.data.token)
    //       // 获取用户信息
    //       this.getUserInfos(wxInfo.openid, avatarUrl)
    //     }).catch((e) => {
    //       this.loading = false
    //     })
    },
    // 注册
    async register() {
    //   const that = this
      this.$refs.form.validate(valid => {
        if (valid) {
          //   uni.getUserProfile({
          //     desc: '授权获取微信头像',
          //     success: async function(res) {
          //       const avatarUrl = res.userInfo.avatarUrl
          //       console.log('avatarUrl', avatarUrl)
          //       that.submitStatus = true
          //       const data = {
          //         'account': that.form.telephone,
          //         'tel': that.form.telephone,
          //         'password': that.form.password,
          //         'code': that.form.vcode
          //       }
          //       that.loading = true
          //       that.text = '注册中...'
          //       // 保存提交
          //       register(data)
          //         .then(async(res) => {
          //           that.submitStatus = false
          //           uni.showToast({
          //             title: `注册成功`,
          //             icon: 'none',
          //             duration: 2000
          //           })
          //           // MBS注册家长
          //           const parmas = {
          //             parentId: that.schoolId,
          //             // orgClassId: that.classId,  // 防止家长注册后没有第一时间绑定学生，后续登录可重新获取班级学生列表
          //             personType: 2,
          //             sex: 'MALE',
          //             telephone: that.form.telephone,
          //             status: 'ENABLED'
          //           }
          //           await mergePersonParentMini(parmas)
          //           uni.login({
          //             success: async function(res) {
          //               const wxData = (await getOpenId({
          //                 appid: config.appId,
          //                 code: res.code
          //               })).data
          //               if (wxData && wxData.openid) {
          //                 that.userLogin({
          //                   openid: wxData.openid,
          //                   unionid: wxData.unionid
          //                 }, avatarUrl)
          //               }
          //             },
          //             fail(err) {
          //               that.loading = false
          //               uni.showToast({
          //                 title: '登录失败请重试~',
          //                 icon: 'none',
          //                 duration: 2000
          //               })
          //               console.log('获取微信登录code错误', err)
          //             }
          //           })
        //             }).catch((e) => {
        //               that.loading = false
        //               that.submitStatus = false
        //             })
        //         },
        //         fail(err) {
        //           uni.showToast({
        //             title: '需要授权后才可注册~',
        //             icon: 'none',
        //             duration: 2000
        //           })
        //           console.log('授权获取微信头像错误', err)
        //         }
        //       })
        }
        if (valid) return
      })
      const { form } = this
      if (!form.tel) {
        this.$Notify({ type: 'warning', message: '请输入正确手机号~' })
      }
      if (!form.code) {
        this.$Notify({ type: 'warning', message: '请输入正确验证码~' })
      }
      if (!form.password) {
        this.$Notify({ type: 'warning', message: '请输入正确密码~' })
      }
      if (!form.passwordConfig) {
        this.$Notify({ type: 'warning', message: '请再次输入正确验证码~' })
      }
      const { privacySelect } = this
      if (!privacySelect.length || (privacySelect.length && !privacySelect[0])) {
        this.$Notify({ type: 'warning', message: '请勾选《服务协议》和隐私~' })
      }
      this.form.account = this.form.tel
      this.form.type = 'mwoa'
      this.form.telephone = this.form.tel
      const result = await parentRegister({
        schoolId: this.schoolCode,
        ...this.form
      })
      if (result.code === 0) {
        this.$Notify({ type: 'success', message: '注册成功,等待老师审核~' })
        // todo 跳转登录页
        this.resetForm()
      }
    },
    // 验证码相关功能
    codeChange(text) {
      this.tips = text
    },

    // 获取验证码
    async getCode() {
      // 获取前判断手机号正确
    //   console.log(this.form.telephone)
    //   if (!this.$u.test.mobile(this.form.telephone)) {
    //     this.$u.toast('手机号码格式不正确')
    //     return
    //   }
      // 模拟向后端请求验证码
      // uni.showLoading({
      // 	title: '正在获取验证码'
      // })
      // 调用获取验证码
      // let data={
      // 	"tel":this.form.telephone,
      // 	"type":"bind_tel"
      // }
      // const data = {
      //   'account': this.form.telephone,
      //   'tel': this.form.telephone
      // }
      // getRegisterSms(data)
      //   .then((res) => {
      //     // uni.hideLoading();
      //     this.$u.toast('验证码已发送')
      //     // 通知验证码组件内部开始倒计时
      //     this.$refs.uCode.start()
      //   }).catch((e) => {
      //     // uni.hideLoading();
      //     this.$u.toast(e)
      //   })
      // setTimeout(() => {
      // 		//验证码已发送逻辑
      // 	uni.hideLoading();
      // 	// 这里此提示会被this.start()方法中的提示覆盖
      // 	this.$u.toast('验证码已发送');
      // 	// 通知验证码组件内部开始倒计时
      // 	this.$refs.uCode.start();

      // }, 2000);
      const telphone = this.form.tel
      console.log('有区别?', telphone, this.form.tel, this.form)
      if (!this.checkPhone(telphone)) return
      const result = await getTelCode({
        account: telphone,
        tel: telphone
      }).catch((e) => {
        this.$Notify({ type: 'warning', message: '您的账号已经注册, 请直接登录' })
      })
      console.log('返回', result)
      if (!result) return
      if (result.code !== 0) {
        this.$Notify({ type: 'warning', message: result.message })
        return
      }
      // 通知发出 禁用发送按钮
      this.$Notify({ type: 'success', message: '发送成功' })
      this.disabledBtn = true
      let interval = 60 * 2
      this.timer = setInterval(() => {
        if (this.codeMsg === '0s') {
          clearTimeout(this.timer)
          this.disabledBtn = false
          this.codeMsg = '获取验证码'
          return
        }
        this.codeMsg = `${interval--}s`
      }, 1000)
    },
    includeTabbar() {
      const { pageList, currentPage } = this.$store.getters
      const config = pageList[currentPage]
      if (config && config.componentList.length) {
        for (const item of config.componentList) {
          if (item.key === 'm-tabbar') {
            return true
          }
        }
      }
      return false
    },
    inputIhoneFnc(value) {
      console.log('事件', value)
      if (!value) return
      this.checkPhone(value)
    },
    inputPsdFnc(value) {
      if (!value) return
      if (value === this.form.password) return
      this.$Notify({ type: 'warning', message: '请保证两次输入密码一致!' })
    },
    checkPhone(value) {
      let normal = true
      if (/^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/.test(value)) {
        this.disabledBtn = false
      } else {
        this.$Notify({ type: 'warning', message: '请输入正确的手机号~' })
        normal = false
        if (!this.disabledBtn) {
          this.disabledBtn = true
        }
      }
      return normal
    },
    async getGrades() {
      const { data } = await getGradeList({
        parentId: this.schoolCode,
        resourceType: 1,
        currentPage: 1,
        pageSize: 10000
      })
      console.log('年级', data.total, data.list)
      const grades = []
      const { total, list } = data
      if (total > 0) {
        for (const grade of list) {
          const item = {
            text: grade.resourceName,
            values: [grade.basicResourceId]
          }
          const { children } = grade
          if (children && children.length) {
            item.children = []
            for (const clazz of children) {
              item.children.push({ text: clazz.resourceName, values: [clazz.basicResourceId] })
            }
          }
          grades.push(item)
        }
      }
      return grades
    },
    async onConfirm(opt) {
      console.log('确定咯', opt)
      const grade = _.find(this.grades, g => g.text === opt[0])
      this.showPicker = false
      if (grade && grade.children && grade.children.length) {
        this.form.gradeId = grade.values[0]
        const clazz = _.find(grade.children, c => c.text === opt[1])
        if (clazz) {
          this.form.classId = clazz.values[0]
          // todo 获取学生
          console.log('确定咯1', opt)
          this.gradeVal = `${grade.text}/${clazz.text}`
          await this.getStuents(grade.values[0], clazz.values[0])
        }
      }
    },
    onConfirmStu(opt) {
      console.log('选中学生', opt)
      this.showPickerStu = false
      this.studentVal = opt.text
      const student = _.find(this.studentList, s => s.text === opt.text)
      if (student && student.id) {
        this.form.studentId = student.id
      }
    },
    async getStuents(grade, clazz) {
      const { code, data } = await getStudentList({
        parentId: this.schoolCode,
        classId: clazz,
        gradeId: grade,
        currentPage: 1,
        pageSize: 10000
      })
      console.log('学生', data)
      if (code === 0 && data.totalCount > 0) {
        this.studentList = _.map(data.qryList, l => ({
          text: l.trueName,
          id: l.basicPersonId
        }))
      }
    },
    resetForm() {
      this.form = {
        tel: '',
        account: '',
        code: '',
        password: '',
        passwordConfig: '',
        grade: '',
        clazz: '',
        studentId: '',
        parentTitle: ''
      }
    },
    async getTree() {
      const sendata = {}
      const { url, data, method, specialData } = this.config.request
      if (url && url !== '') {
        for (const item of specialData) {
          sendata[item.key] = this.$store.getters.storage[item.value]
          console.log('让我来看看这里面有什么', this.$store.getters.storage)
        }
        for (const item of data) {
          sendata[item.key] = item.value
        }
        this.treeData = (await getStudentList({
          url,
          method,
          data: sendata
        })).data
      }
    },
    getData() {
      const sendata = {}
      for (const item of this.config.request.specialData) {
        sendata[item.key] = this.$store.getters.storage[item.value]
        console.log('让我来看看这里面有什么', this.$store.getters.storage)
      }
      for (const item of this.config.request.data) {
        sendata[item.key] = item.value
      }
    },
    clickNotice() {
      const goto = this.$store.getters.noticeClick
      if (goto.page && goto.page !== '') {
        this.$store.dispatch('setCurrentPage', { page: goto.page })
      }
      this.$emit('input', this.dialog)
      this.$emit('confirm', this.dialog)
      this.$emit('on-close')
    }
  }
}

</script>

<style lang='scss' scoped>
	//@import url(); 引入公共css类
	.bg {
		min-height: 100%;
		height: 100vh;
		position: relative;

		.header {
			height: 35%;
			background-color: #8379f3;

		}

		.register-content {
			/* height: 100%; */
			padding: 20px;

			.content {
				/* height: 100%; */
				background-color: #FFFFFF;
				border-radius: 10px;
				border: 2px solid #EEEEEE;
				padding: 40px;
				box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.5);

				.log-direct {
					width: 100%;
					line-height: 14px;
					color: #8379f3;
					text-align: right;
					font-size: 14px;

					margin-top: 10px;
				}
			}

		}

		.footer {
			margin-top: 20px;
			display: flex;
			justify-content: center;
			align-items: center;
			font-size: 16px;
			color: #c0c4cc;

		}
	}
</style>
<style>
  .content .codeField .van-button {
    width: 82px;
    text-align: center;
  }
  .footer .van-checkbox__label {
    color: #c0c4cc;
    font-size: 14px;
  }
</style>
