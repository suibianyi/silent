<!--  -->
<template>
  <div class="main-app-div">
    <topBar :parent-label="parentLabel" />
    <div class="changePass">
      <div class="form-div">
        <div class="form-content">
          <el-form ref="resetForm"
                   :model="resetForm"
                   :rules="resetFormRules"
                   label-width="100px">
            <el-form-item
              label="旧密码："
              prop="passWordOld">
              <el-input v-model="resetForm.passWordOld"
                        type="password"
                        auto-complete="off"
                        placeholder="请输入旧密码" />
            </el-form-item>
            <el-form-item
              label="新密码："
              prop="newpwd">
              <el-input v-model="resetForm.newpwd"
                        type="password"
                        auto-complete="off"
                        placeholder="请输入新密码" />
              <span ref="textPawStyle" style="margin-left: 10px">{{ textPaw }}</span>
            </el-form-item>
            <el-form-item
              label="确认密码："
              prop="passWord">
              <el-input v-model="resetForm.passWord"
                        type="password"
                        auto-complete="off"
                        placeholder="请确认新密码" />
            </el-form-item>
          </el-form>
          <div class="buttons">
            <!-- <el-button
              @click="onClose()">取 消</el-button> -->
            <el-button type="primary"
                       @click="submitForm('resetForm')">确 定</el-button>
          </div>

        </div>
      </div>

    </div>

  </div>
</template>

<script>
// 这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
// 例如：import 《组件名称》 from '《组件路径》';
import { setPassword } from '@/api/MPS/user'
import TopBar from '../../views/MBS/components/TopBar'
export default {
  components: {
    TopBar
  },
  props: {
    dialogType: {
      type: String,
      default: ''
    }
  },
  data() {
    // 这里存放数据
    var validatePass = (rule, value, callback) => {
      var reg = new RegExp('[\\u4E00-\\u9FFF]+', 'g')
      if (!value) {
        callback(new Error('请输入新密码'))
      } else if (value.toString().length < 8 || value.toString().length > 18) {
        callback(new Error('密码长度为8-18位'))
      } else if (reg.test(value)) {
        callback(new Error('请输入8-14位字母、数字或标点符号组合的密码'))
      } else {
        callback()
      }
    }
    var validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.resetForm.newpwd) {
        callback(new Error('两次输入密码不一致'))
      } else {
        callback()
      }
    }
    return {
      parentLabel: '修改密码',
      pawValue: '',
      textPaw: '',
      rules: {},
      resetForm: {
        passWordOld: '',
        passWord: '',
        personNo: this.$store.state.user.account,
        parentId: this.$store.state.user.school.id
      },
      resetFormRules: {
        passWordOld: [
          {
            required: true,
            message: '请输入旧密码',
            trigger: 'blur'
          }
        ],
        newpwd: [
          {
            required: true,
            validator: validatePass,
            trigger: 'blur'
          }
        ],
        passWord: [
          {
            required: true,
            validator: validatePass2,
            trigger: 'blur'
          }
        ]
      }

    }
  },
  watch: {
    'resetForm.newpwd': function(newPaw) {
      this.pawValue = this.checkStrong(newPaw)
      if (this.pawValue >= 1) {
        this.textPaw = '弱'
        this.$refs.textPawStyle.style.color = 'red'
      }
      if (this.pawValue >= 2 && this.pawValue < 4) {
        this.textPaw = '中'
        this.$refs.textPawStyle.style.color = 'orange'
      }
      if (this.pawValue === 4) {
        this.textPaw = '强'
        this.$refs.textPawStyle.style.color = 'green'
      }
      if (!this.pawValue) {
        this.textPaw = ''
      }
    }
  },
  // 方法集合
  methods: {
    checkStrong(sValue) {
      var modes = 0
      if (sValue.length < 1) return modes
      if (/\d/.test(sValue)) modes++
      if (/[a-z]/.test(sValue)) modes++
      if (/[A-Z]/.test(sValue)) modes++
      if (/\W/.test(sValue)) modes++
      switch (modes) {
        case 1:
          return 1
        case 2:
          return 2
        case 3:
        case 4:
          return sValue.length < 4 ? 3 : 4
      }
      return modes
    },
    onClose() {
      this.$emit('on-close')
    },
    async submitForm(form) {
      const passParmas = {
        newPwd: this.resetForm.passWord,
        oldPwd: this.resetForm.passWordOld
      }
      this.$refs.resetForm.validate(async(valid) => {
        if (valid) {
          const res = await setPassword(passParmas)
          console.log('res!!!!!', res)
          if (res.code === 200 || res.code === 0) {
            this.$message.success('修改成功, 请使用新密码登录')
            await this.$store.dispatch('user/logout')
            this.$router.push(`/login?redirect=${this.$route.fullPath}`)
          } else {
            this.$message.warning(res.message)
          }
          // .then(async() => {
          //   this.$message.success('修改成功, 请使用新密码登录')
          //   await this.$store.dispatch('user/logout')
          //   this.$router.push(`/login?redirect=${this.$route.fullPath}`)
          // }).catch(() => {
          //   this.$message.warning(res.message)
          // })
        } else {
          // this.$message.warning(res.response.data.message)
        }
      })
    },
    checkType() {
      console.log('this.dialogType', this.dialogType)
    }
  }
}
</script>

<style lang="scss" scoped>
.el-form {
    .el-form-item {
      width: 75%;
      margin: 35px auto;
      .el-form-item__content {
        display: flex;
        align-items: flex-start;
        flex-flow: wrap;
        white-space: nowrap;
        .el-input {
          width: 90%;
        }
      }
    }
  }
.el-button {
  margin-right: 85px;
}
</style>

<style lang='scss' scoped>
//@import url(); 引入公共css类
@import "~@/styles/mixin.scss";
.main-app-div {
  height: 100%;
  background: #fcfcfc;
  overflow: auto;
  .changePass {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 95%;
    height: 600px;
    background: #fff;
    margin: 10px auto 15px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
    .form-div {
      width: 650px;
      height: 350px;
      max-width: 100%;
      margin: 0 auto;
      overflow: auto;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
      .buttons {
        display: flex;
        justify-content: flex-end;
      }
    }
  }
}
</style>
