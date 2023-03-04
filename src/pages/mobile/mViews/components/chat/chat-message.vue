<template>
  <div>
    <div class="chat-message" :class="{ isMe }">
      <div class="chat-message-time">
        <van-badge :content="chat.create_date | date" color="#e0e0e0" />
      </div>
      <van-image
        round
        width="40px"
        height="40px"
        class="chat-message-avatar"
        :src="chat.avatar || nouser"
      />
      <div class="chat-message-body">
        <div class="chat-message-name">
          {{ chat.creator_name }}
        </div>
        <transition name="haha">
          <div
            v-if="chat && chat.chat_type=='0'"
            class="chat-message-text">
            <span class="chat-message-span">{{ chat.content }}</span>
          </div>
          <div
            v-if="chat && chat.chat_type=='1'"
            class="chat-message-text" :style="voiceMe">
            <audio v-if="chat.content" ref="myaudio" :src="chat.content" :autobuffer="true" @ended="playend" />
            <span v-if="isMe" class="chat-message-voicetime">{{ time }}"</span>
            <span class="chat-message-span" style="padding: 5px" :style="vioceStyle" @click="Start">
              <img :src="picture_src" width="30" style="vertical-align: middle">
            </span>
            <span v-if="!isMe" class="chat-message-voicetime">{{ time }}"</span>
            <van-badge v-if="!isMe && !isRead" dot />
          </div>
        </transition>
        <!-- <show-stuff
          v-if="chat.type==2"
          :key="0"
          :removeable="false"
          :stuff="chat.content"
          :index="0" /> -->
      </div>
    </div>
  </div>
</template>

<script>
import { includes } from 'lodash'
import {
  mRequest
} from '@/api/request'
import voiceLgif from './voice_Lgif.gif'
import voiceRgif from './voice_Rgif.gif'
import voiceLpng from './voice_Lpng.png'
import voiceRpng from './voice_Rpng.png'
// import ShowStuff from '../../components/show-stuff'
import noUser from './noUser.png'

export default {
  // components: {
  //   ShowStuff
  // },
  mixins: [],
  props: {
    chat: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      clickstate: false,
      time: 0,
      mine: false,
      map: {
        interactWithStudent: '家校互动'
      },
      picture_src: voiceLpng,
      nouser: noUser,
      wx: {},
      userInfo: this.$store.state.storage.userInfo,
      voiceRead: []
    }
  },
  computed: {
    voiceMe() {
      if (this.chat.creator_id === this.userInfo.basicPersonId) {
        return {
          'text-align': 'right'
        }
      }
      return {
        'text-align': 'left'
      }
    },
    vioceStyle() {
      return {
        width: `${100 + this.time * 2.5}px`
      }
    },
    isMe() {
      return this.chat.creator_id === this.userInfo.basicPersonId
    },
    isRead() {
      if (this.chat.voice_read && includes(this.chat.voice_read, this.userInfo.basicPersonId)) {
        return true
      }
      return false
    }
  },
  mounted() {
    this.wx = window.wx
    if (this.chat.time) {
      this.time = this.chat.time
    }
    if (this.isMe) {
      this.picture_src = voiceRpng
    }
  },
  methods: {
    playend() {
      this.clickstate = false
      console.log('自动播放结束，触发吗')
      if (this.isMe === true) {
        this.picture_src = voiceRpng
      } else {
        this.picture_src = voiceLpng
      }
    },
    async Start() {
      if (this.chat.voice_read && !includes(this.chat.voice_read, this.userInfo.basicPersonId)) {
        const data = {
          id: this.chat.id,
          userId: this.userInfo.basicPersonId
        }
        await mRequest({
          url: '/chat/voice/read',
          method: 'post',
          data
        })
        this.chat.voice_read.push(this.userInfo.basicPersonId)
      }
      const _this = this
      _this.clickstate = !_this.clickstate
      // this.$emit('play', this.chat.create_date)
      this.$parent.playEnd(this.chat.id)
      if (_this.clickstate) {
        if (_this.chat.localId) {
          _this.wx.playVoice({
            localId: _this.chat.localId // 需要播放的音频的本地ID，由stopRecord接口获得
          })
          _this.wx.onVoicePlayEnd({
            success() {
              if (_this.isMe === true) {
                _this.picture_src = voiceRpng
              } else {
                _this.picture_src = voiceLpng
              }
              _this.clickstate = false
            }
          })
        } else {
          _this.$nextTick(() => {
            this.$refs.myaudio.play()
          })
        }
        if (_this.isMe === true) {
          this.picture_src = voiceRgif
        } else {
          this.picture_src = voiceLgif
        }
      }
    },
    playEnd(chatId) {
      console.log('触发了吗')
      const _this = this
      if (chatId && chatId === _this.chat.id) return
      if (_this.chat.chat_type !== '1') return
      _this.clickstate = false
      if (_this.chat.localId) {
        _this.wx.stopVoice({
          localId: _this.chat.localId // 需要播放的音频的本地ID，由stopRecord接口获得
        })
      } else {
        this.$refs.myaudio.pause()
        this.$refs.myaudio.load()
      }
      if (this.isMe === true) {
        this.picture_src = voiceRpng
      } else {
        this.picture_src = voiceLpng
      }
    }
  }
}
</script>

<style lang="stylus">

.chat-message
  float: left
  width: 100%
  margin: 10px 0

  &-body
    margin-left: 50px

  &-avatar
    float: left
  &-time
    width: 100% !important
    text-align: center
    padding: 10px 0
  &-name
    margin: 0px 0 0px 0
    font-size: 10px
    color: #757575
  &-text
    float: left
  &-span
    float: left
    display: inline-block
    border-radius: 5px
    padding: 8px
    font-size: 16px
    word-wrap: break-word
    background: #ffffff
    border: 1px solid #eeeeee
    max-width: 250px
  &-voicetime
    display: block
    color: #bdbdbd
    float: right
    margin-top: 20px
    margin-left: 5px
  &.isMe
    float: right
    text-align: right
    .chat-message
      &-body
        margin-left: 0
        margin-right: 50px

      &-avatar
        float: right

      &-text
        float: right
        text-align: left
      &-span
        background: #9EEA6A
      &-voicetime
        float left
        margin-top: 20px
        margin-left: 5px

  .haha
    &-enter-active
      transition: all .3s
    &-enter
      opacity: 9
    &-enter-to
      opacity: 1
</style>
