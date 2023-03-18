<template>
  <div class="qnrtc">
    <div id="localtracks" :style="{ 'width': `100%`, 'height': `45%`, 'background-image': `url(${avatar})`,'background-size':'100% 100%'}" />
    <div id="remotetracks" class="remote">
      <!-- <div id="remotetracks-1" :style="{ 'width': `33%`, 'height': `33%`}" />
      <div id="remotetracks-2" :style="{ 'width': `33%`, 'height': `33%`}" />
      <div id="remotetracks-3" :style="{ 'width': `33%`, 'height': `33%`}" /> -->
    </div>
    <div class="handle">
      <div class="hang-pic" style="margin-left: 20px;" @click="hangVideo">
        <van-image height="90" :src="videoHang" /></div>
    </div>
  </div>
</template>
<script>
import {
  mRequest
} from '@/api/request'
import QNRTC from 'qnweb-rtc'
export default {
  data() {
    // 这里存放数据
    return {
      client: '',
      localTracks: '',
      screenHeight: 0,
      videoHeight: 0,
      videoPushHeight: 0,
      enableMic: true,
      videoHang: require('@/assets/mobile/qnrtc/hang.png'),
      videoVoice: require('@/assets/mobile/qnrtc/videoVoice.png'),
      videoNoVoice: require('@/assets/mobile/qnrtc/videoNoVoice.png'),
      avatar: ''
    }
  },
  mounted() {
    this.avatar = this.$store.getters.storage.avatar
    console.log('current version is', QNRTC.VERSION)
    window.addEventListener('beforeunload', () => {
      this.client && this.client.leave()
    })
    this.client = QNRTC.createClient()
    this.client.on(
      'connection-state-changed',
      function(connectionState, info) {
        console.log('connection-state-changed', connectionState, info)
      }
    )
    this.client.on('user-joined', (user) => {
      console.log('user-joined', user)
    })
    this.client.on('user-left', (user) => {
      console.log('user-left', user)
    })
    this.autoSubscribe(this.client)
    this.joinRoom()
    this.$nextTick(() => {
      this.innerWidth = document.getElementsByClassName('qnrtc')[0].clientWidth
      this.innerHeight = document.getElementsByClassName('qnrtc')[0].clientHeight
      console.log('innerWidth', this.innerWidth)
      console.log('innerHeight', this.innerHeight)
    })
  },
  methods: {
    // 离开房间
    async hangVideo() {
      // for (const i of this.localTracks) {
      //   i.destroy()
      // }
      this.localTracks.destroy()
      this.localTracks = []
      await this.client.leave()
      this.$store.commit('SET_QNRTCPAGE', 'select-mode')
    },
    voiceVideo() {
      this.enableMic = !this.enableMic
    },
    async joinRoom() {
      // 创建QNRTCClient对象
      const res = await mRequest({
        url: '/mws/user/roomToken',
        method: 'post',
        data: this.$store.state.qnrtc.selectStudent
      })
      console.log('取到的roomtoken是', res)
      if (res && res.data && res.data.roomToken) {
        const roomToken = res.data.roomToken
        // const roomToken = 'bq71DL_v1RTKaHqSsE-JnX-FQ6aklLH1_ELyZPs6:OmZjPYmryIPV7jmBX60dFLGWIc0=:eyJhcHBJZCI6ImZ3ZTZvY3lmYiIsImV4cGlyZUF0IjoxNjgwMzM3MTcyLCJwZXJtaXNzaW9uIjoidXNlciIsInJvb21OYW1lIjoiU0hPV18yMDE5MzIzNCIsInVzZXJJZCI6IjEyMzQ1NiJ9'
        // 这里替换成刚刚生成的 RoomToken
        await this.client.join(roomToken)
        console.log('joinRoom success!')
        await this.publish(this.client)
        // this.autoSubscribe(this.client)
      }
    },
    async publish(client) {
      // 同时采集麦克风音频和摄像头视频轨道。
      // 这个函数会返回一组audio track 与 video track
      // const localTracks = await QNRTC.createMicrophoneAndCameraTracks()
      this.localTracks = await QNRTC.createMicrophoneAudioTrack({
        encoderConfig: {
          sampleRate: 16000, // 采样率
          stereo: true // 使用双声道
        }
      })
      console.log('my local tracks', this.localTracks)
      // 将刚刚的 Track 列表发布到房间中
      await client.publish(this.localTracks)
      console.log('publish success!')
      // 在这里添加
      // // 获取页面上的一个元素作为播放画面的父元素
      // const localElement = document.getElementById('localtracks')
      // // 遍历本地采集的 Track 对象
      // for (const localTrack of this.localTracks) {
      //   console.log(localTrack)
      //   // 如果这是麦克风采集的音频 Track，我们就不播放它。
      //   if (localTrack.isAudio()) continue
      //   // 调用 Track 对象的 play 方法在这个元素下播放视频轨
      //   localTrack.play(localElement, {
      //     mirror: true
      //   })
      // }
    },
    async subscribe(client, tracks) {
      // 传入 Track 对象数组调用订阅方法发起订阅，异步返回成功订阅的 Track 对象。
      const remoteTracks = await client.subscribe(tracks)
      // 选择页面上的一个元素作为父元素，播放远端的音视频轨
      const remoteElement = document.getElementById('remotetracks')
      // 遍历返回的远端 Track，调用 play 方法完成在页面上的播放
      for (const remoteTrack of [...remoteTracks.audioTracks]) {
        // const remoteElement = document.getElementById(`remotetracks-${i}`)
        // console.log(`这里看到的remotetracks-${i}`, remoteElement)
        remoteTrack.play(remoteElement)
      }
    },
    // 这里的参数 client 是指刚刚初始化的 QNRTCClient 对象, 同上
    autoSubscribe(client) {
    // 添加事件监听，当房间中出现新的 Track 时就会触发，参数是 trackInfo 列表
      client.on('user-published', (userId, tracks) => {
        console.log('user-published!', userId, tracks)
        this.subscribe(client, tracks)
          .then(() => console.log('subscribe success!'))
          .catch(e => console.error('subscribe error', e))
      })
      // 就是这样，就像监听 DOM 事件一样通过 on 方法监听相应的事件并给出处理函数即可
      client.on('user-published', function(userID, track) {
        console.log('user-published', userID, track)
      })
    }

  }
}
</script>
<style  lang='scss'>
  .qnrtc-stream-player {
    object-fit: cover !important;
  }
</style>
<style lang='scss'>
.qnrtc {
  width: 100%;
  height: 100%;
  // display: flex;
  // flex-direction: row;
  // flex-wrap: wrap;
  // justify-content: center;
  overflow-y: hidden;
  background: black;
  .remote {
    display: flex;
    flex-direction: row;
    overflow-y: hidden;
    background: black;
    .qnrtc-stream-player {
      width: 50% !important;
      height: 33% !important;
      object-fit: cover !important;
    }
  }
  .handle {
			position: fixed;
			top: 82%;
			display: flex;
			flex-direction: row;
			justify-content: center;
			width: 100%;
		}
}
</style>
