<template>
  <div class="chat-main">
    <van-nav-bar fixed title="家校互动" left-text="返回" left-arrow @click-left="onClickLeft" />
    <div
      ref="mycontent"
      class="chat-container">
      <van-pull-refresh v-model="isLoading" @refresh="onRefresh" />
      <chat-message
        v-for="record in chats"
        ref="messages"
        :key="record.create_date"
        class="chat-message"
        :chat="record" />
      <p>{{ fileStr }}</p>
    </div>
    <div v-if="being_voice" class="box">
      <img :src="picture_src" width="40%" style="opacity:0.7">
    </div>
    <div
      :style="picStyle"
      class="chat-input">
      <van-icon
        v-if="!voice"
        :style="leftStyle"
        name="huatong"
        class="iconfont"
        class-prefix="icon"
        @click="voice = !voice" />
      <van-icon
        v-if="voice"
        :style="leftStyle"
        name="jianpan"
        class="iconfont"
        class-prefix="icon"
        @click="voice = !voice" />
      <van-field
        v-if="!voice"
        ref="textField"
        v-model="chat.text"
        :underline-show="false"
        :style="textStyle"
        :multi-line="true"
        @focus="textfocus" />
      <van-button
        v-if="!voice"
        type="primary"
        :style="btnStyle"
        :disabled="chatBtn"
        label="发送"
        @click="send">
        发送
      </van-button>
      <van-button
        v-if="voice"
        type="default"
        :style="voicebtnStyle"
        label="按住 说话"
        @touchstart.passive.native="touchStart"
        @touchmove.passive.native="touchMove"
        @touchend.passive.native="touchEnd"
        @touchcancel.passive.native="touchCancel"
        @oncontextmenu="contextmenu"
        @click="noop">
        按住 说话
      </van-button>
      <van-icon
        v-if="voice"
        :style="rightStyle"
        name="jianpan"
        class="iconfont"
        class-prefix="icon"
        @click="voice = !voice" />
      <!-- <div v-if="showUploadBtn" class="">
        <div
          v-for="(stuff, index) in chat.stuffs"
          :key="index">
          <show-stuff
            :style="squarItemStyle"
            :stuff="stuff"
            :index="index"
            @remove="remove(stuff, index)" />
        </div>
        <upload-btn
          v-if="chat.stuffs.length <= 9"
          :style="squarItemStyle"
          :pms="false"
          @upload:success="uploadSuccess"
          @upload:error="uploadError" />
      </div> -->
    </div>
  </div>
</template>

<script>

import { Toast } from 'vant'
import { assign, isEmpty, map, last, differenceBy } from 'lodash'
// import request from 'superagent'
import {
  mRequest
} from '@/api/request'
import { getWxSdk } from './wx'
import chatMessage from './chat-message'
import BeingRecordings from './Being_Recordings.png'
import CancelRecordings from './Cancel_Recordings.png'
// import CountDown from './countDown.gif';
import TimeShort from './timeShort.png'
export default {
  components: {
    chatMessage
  },
  data() {
    const style = {
      transform: 'scale(2)',
      color: 'rgb(118,105,247)'
    }
    return {
      cellList: [],
      isLoading: false,
      count: 0,
      leftStyle: assign({ 'margin-left': '5px', order: '0' }, style),
      rightStyle: assign({ 'margin-right': '5px', order: '2' }, style),
      voice: false,
      chats: [],
      chat: {
        sid: '',
        text: '',
        stuffs: []
      },
      picture_src: BeingRecordings,
      being_voice: false,
      startY: 0, // 开始触摸的位置
      moveY: 0, // 滑动时的位置
      endY: 0, // 结束触摸的位置
      disY: 0, // 移动距离
      showUploadBtn: false,
      refreshing: false,
      trigger: null,
      timer: '',
      map: {
        interactWithStudent: '家校互动'
      },
      wx: {},
      serverId: '',
      startTime: 0,
      unreadHold: false,
      scroll_height: 0,
      open: false,
      complete: true,
      fileStr: '',
      updateHold: false,
      userInfo: this.$store.state.storage.userInfo
    }
  },
  computed: {
    textStyle() {
      return {
        background: 'white',
        'border-radius': '5px',
        'min-height': '32px',
        'margin-bottom': '0px',
        // width: `${window.innerWidth - 130}px`,
        width: `${250}px`,
        order: '1'
      }
    },
    voicebtnStyle() {
      const style = {
        background: 'grey400',
        height: '32px',
        'margin-bottom': '0px',
        'border-radius': '5px',
        'user-select': 'none',
        // width: `${window.innerWidth - 130}px`,
        width: `${280}px`,
        order: '1'
      }
      return style
    },
    btnStyle() {
      const {
        chatBtn
      } = this
      const style = {
        color: 'white',
        height: '32px',
        'min-width': '60px',
        order: '2'
      }
      if (!chatBtn) {
        style['background-color'] = 'rgb(118,105,247)'
      }
      return style
    },
    picStyle() {
      let h = 0
      if (this.showUploadBtn) {
        const len = this.chat.stuffs && this.chat.stuffs.length || 0
        h += this.squarWidth * (~~(len / 3) + 1) + 25
      }
      return {
        'margin-bottom': `${h}px`
      }
    },
    chatBtn() {
      const {
        text,
        stuffs
      } = this.chat
      return isEmpty(text || stuffs)
    },
    student() {
      return this.$store.state.chat.selectStudent
    }
  },
  async beforeCreate() {
    const sdk = await getWxSdk()
    console.log('获取到的微信配置是', sdk)
    if (!window) {
      window.alert('没有window')
    }
    this.wx = window.wx
  },
  mounted() {
    console.log('这里存的东西是', this.$store.getters.storage)
    this.cellList = this.$store.getters.storage.children
    this.setTimer()
    this.initChats()
  },
  methods: {
    onClickLeft() {
      this.$store.dispatch('backNav')
    },
    switchCell(s) {
      const data = {
        sid: s.personNo,
        schoolCode: this.$store.getters.storage.schoolCode,
        userType: this.$store.getters.storage.type,
        account: this.$store.getters.storage.userInfo.telephone,
        sName: s.trueName,
        classId: s.orgClassName
      }
      this.$store.commit('SET_QNRTCSTUDENT', data)
      this.$store.commit('SET_QNRTCPAGE', 'select-mode')
    },
    onRefresh() {
      setTimeout(() => {
        Toast('刷新成功')
        this.isLoading = false
        this.count++
      }, 1000)
    },
    setTimer() {
      this.timer = window.setInterval(async() => {
        await this.updateChats()
      }, 2000)
    },
    textfocus() {
      // this.$nextTick(() => {
      //   this.scrollTo('bottom');
      // });
    },
    async updateChats() {
      if (this.updateHold) {
        return
      }
      console.log('更新信息')
      const end = last(this.chats) && last(this.chats).create_date
      const data = {
        sid: this.student.sid,
        schoolCode: this.student.schoolCode
      }
      if (end) {
        data.end = end - 2000
      }
      if (this.student.sid) {
        const res = await mRequest({
          url: '/chat/list',
          method: 'post',
          data
        })
        if (res.list && res.list.length) {
          const diffres = differenceBy(res.list, this.chats, 'id')
          this.chats = this.chats.concat(diffres)
          if (diffres && diffres.length) {
            const opt = {
              ...data,
              createDate: this.chats[this.chats.length - 1].create_date,
              userId: this.userInfo.basicPersonId
            }
            await mRequest({
              url: '/chat/unread',
              method: 'post',
              data: opt
            })
            this.$nextTick(() => {
              this.scrollTo('bottom')
            })
          }
        }
      }
    },
    async send() {
      if (this.refreshing) {
        return
      }
      if (this.chat.text.replace(/(^\s*)|(\s*$)/g, '').length === 0) {
        this.chat.text = ''
        this.open = true
        return
      }
      this.$refs.textField.focus()
      const data = {
        sid: this.student.sid,
        studentId: this.student.studentId,
        schoolCode: this.student.schoolCode,
        chatType: '0',
        text: this.chat.text,
        creatorId: this.userInfo.basicPersonId,
        cid: this.student.orgClassId, // 班级信息
        className: this.student.orgClassName,
        creatorName: this.userInfo.trueName || '',
        creatorAvatar: this.userInfo.headImageUrl
      }
      const res = await mRequest({
        url: '/chat/message',
        method: 'post',
        data
      })
      if (res && res.msg) {
        this.chats.push(res.msg)
      }
      this.chat.stuffs = []
      this.chat.text = ''
      this.showUploadBtn = false
      this.$nextTick(() => {
        this.scrollTo('bottom')
      })
    },
    scrollTo(direct) {
      let height = 0
      if (direct === 'bottom') {
        height = this.$refs.mycontent.scrollHeight
        console.log('需要设置的高度', height)
      }
      window.setTimeout(() => {
        this.$refs.mycontent.scrollTop = height
      }, 300)
    },
    async initChats() {
      if (this.student && this.student.sid) {
        const data = {
          sid: this.student.sid,
          schoolCode: this.student.schoolCode
        }
        const res = await mRequest({
          url: '/chat/list',
          method: 'post',
          data
        })
        console.log('res~~~~~~', res)
        if (res && res.list) {
          this.chats = res.list
          if (this.chats.length > 0) {
            const opt = {
              ...data,
              createDate: this.chats[this.chats.length - 1].create_date,
              userId: this.userInfo.basicPersonId
            }
            await mRequest({
              url: '/chat/unread',
              method: 'post',
              data: opt
            })
            this.$nextTick(() => {
              this.scrollTo('bottom')
            })
          }
        }
      }
    },
    async touchStart(ev) {
      if (!this.complete) {
        return
      }
      // this.$emit('playEnd')
      this.playEnd()
      const vm = this
      this.startY = ev.touches[0].clientY
      vm.wx.startRecord()
      this.updateHold = true
      vm.wx.onVoiceRecordEnd({
        // 录音时间超过一分钟没有停止的时候会执行 complete 回调
        complete(r) {
          // console.log('完成了', JSON.stringify(r))
          // vm.fileStr = JSON.stringify(r)
          vm.being_voice = false
          const createDate = new Date().getTime()
          vm.unreadHold = true
          let time = Math.round((new Date().getTime() - vm.startTime) / 1000)
          if (time > 60) {
            time = 60
          }
          const msg = {
            creator_id: vm.userInfo.basicPersonId,
            chat_type: '1',
            localId: r.localId,
            time,
            create_date: createDate,
            avatar: vm.userInfo.headImageUrl,
            creator_name: vm.userInfo.trueName
          }
          vm.chats.push(msg)
          vm.$nextTick(() => {
            vm.scrollTo('bottom')
          })
          vm.wx.uploadVoice({
            localId: r.localId, // 需要上传的音频的本地ID，由stopRecord接口获得
            isShowProgressTips: 1, // 默认为1，显示进度提示
            success(res) {
              vm.serverId = res.serverId // 返回音频的服务器端ID
              vm.uploadFile(res.serverId, time)
            }
          })
        }
      })
      this.picture_src = BeingRecordings
      this.being_voice = true
      this.startTime = new Date().getTime()
    },
    touchMove(ev) {
      this.moveY = ev.touches[0].clientY
      this.disY = this.moveY - this.startY
      console.log('disY', this.disY)
      console.log('moveY', this.moveY)
      if (this.disY < -60) {
        this.picture_src = CancelRecordings
      } else {
        this.picture_src = BeingRecordings
      }
    },
    async touchEnd() {
      console.log('end')
      if (this.being_voice) {
        if (this.disY >= -60) {
          if (new Date().getTime() - this.startTime < 1000) {
            this.picture_src = TimeShort
            setTimeout(() => {
              this.being_voice = false
            }, 1500)
            setTimeout(() => {
              this.wx.stopRecord()
            }, 300)
          } else {
            this.complete = false
            setTimeout(() => {
              this.complete = true
            }, 600)
            this.being_voice = false
            const vm = this
            const createDate = new Date().getTime()
            const time = `${Math.round((new Date().getTime() - vm.startTime) / 1000)}`
            this.wx.stopRecord({
              success(r) {
                vm.unreadHold = true
                const msg = {
                  creator_id: vm.userInfo.basicPersonId,
                  chat_type: '1',
                  localId: r.localId, // ?
                  time,
                  create_date: createDate,
                  avatar: vm.userInfo.headImageUrl,
                  creator_name: vm.userInfo.trueName
                }
                vm.chats.push(msg)
                vm.$nextTick(() => {
                  vm.scrollTo('bottom')
                })
                vm.wx.uploadVoice({
                  localId: r.localId, // 需要上传的音频的本地ID，由stopRecord接口获得
                  isShowProgressTips: 1, // 默认为1，显示进度提示
                  async success(res) {
                    vm.serverId = res.serverId // 返回音频的服务器端ID
                    vm.uploadFile(res.serverId, time)
                  }
                })
              }
            })
          }
        } else {
          this.wx.stopRecord()
          this.being_voice = false
        }
      }
    },
    touchCancel() {
      this.being_voice = false
      this.wx.stopRecord()
    },
    contextmenu(e) {
      e.preventDefault()
    },
    async uploadFile(tempFilePath, time) {
      // 保存消息
      const that = this
      const chat = { // 后台保存语音消息
        sid: that.student.sid,
        studentId: that.student.studentId,
        schoolCode: that.student.schoolCode,
        chatType: '1',
        // voice: `${uploadParam.domain}/${fname}`
        serverId: tempFilePath,
        duration: time,
        creatorId: that.userInfo.basicPersonId,
        cid: that.student.orgClassId,
        className: that.student.orgClassName,
        creatorName: that.userInfo.trueName || '',
        creatorAvatar: that.userInfo.headImageUrl
      }
      const result = await mRequest({
        url: '/wx/chat/info',
        method: 'post',
        data: chat
      })

      if (result.msg) {
        that.chats[that.chats.length - 1].id = result.msg.id
        that.updateHold = false
      }
    },
    playEnd(chatId) {
      const { messages } = this.$refs
      map(messages, (message) => {
        message.playEnd(chatId)
      })
    }
    // downloadFormServer() {

    // }
  }

}
</script>

<style lang='scss' scoped>

@import '../../../../../assets/mobile/chat/huatong/iconfont.css';
@import '../../../../../assets/mobile/chat/jianpan/iconfont.css';

.chat-main {
    padding: 0px 0px 0px 0px;
    position: relative;
    .van-nav-bar--fixed {
      top: -1px;
    }
    .chat-container {
      position: absolute;
      top: 28px;
      left: 0;
      right: 0;
      bottom: 50px;
      overflow-y: scroll;
      background: #f5f5f5;
      padding: 10px;
      min-height: calc(100vh - 40px - 41px);
    }
    .box {
      position: fixed;
      width: 100%;
      opacity: 0.8;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .chat-input {
      padding: 10px;
      display: flex;
      -webkit-box-orient: horizontal;
      flex-direction: row;
      justify-content: space-between;
      flex-wrap: nowrap;
      align-items: center;
      position: fixed;
      z-index: 1;
      bottom: 0;
      background: #eee;
      width: 100%;
      border-top: 1px solid #bdbdbd;

      .van-cell {
        padding: 2px 6px;
      }
    }
}
</style>
