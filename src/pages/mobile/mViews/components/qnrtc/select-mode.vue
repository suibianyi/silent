<template>
  <div class="mode">
    <div class="bg" :style="{ 'background-image': `url(${firstBackground})`,'background-size':'100% 100%'}">
      <van-nav-bar title="视频通话" left-text="返回" left-arrow @click-left="onClickLeft" />
      <div class="button-container">
        <div class="button-item" @click="navigateTo('video')">
          <van-image :src="videoPng" mode="aspectFit" />
        </div>
        <div class="button-item" @click="navigateTo('audio')">
          <van-image :src="audioPng" mode="aspectFit" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  data() {
    return {
      // 加载动画
      firstBackground: require('@/assets/mobile/qnrtc/firstBackground.png'),
      videoPng: require('@/assets/mobile/qnrtc/video.png'),
      audioPng: require('@/assets/mobile/qnrtc/audio.png'),
      loading: true,
      schoolPhotos: [], // 校园风采
      indicatorDots: true,
      autoplay: true,
      interval: 3000,
      duration: 500,
      content: [],
      newList: [],
      userInfo: {
        auths: []
      },
      screenHeight: 0,
      sid: '',
      studentId: '',
      schoolCode: '',
      cid: '',
      className: '',
      trueName: ''
    }
  },
  methods: {
    onClickLeft() {
      this.$store.commit('SET_QNRTCPAGE', 'select-student')
    },
    navigateTo(val) {
      if (val === 'video') {
        this.$store.commit('SET_QNRTCPAGE', 'videoPage')
      } else if (val === 'audio') {
        this.$store.commit('SET_QNRTCPAGE', 'audioPage')
      }
    }
  }
}
</script>

<style lang="scss" scope>
.mode {
  height: 100%;
  width: 100%;
	.bg {
    width: 100%;
    height: 100vh;
    // background-image: url('../../../../../assets/mobile/qnrtc/firstBackground.png');
    // background-size: 100% 100%;
		.button-container {
			display: flex;
			flex-wrap: wrap;
			justify-content: center;
			width: 90%;
			height:460px;
			margin: auto;
			position: relative;
			top: 50%;
			transform: translateY(-50%);

			.button-item {
				width: 60%;
				height: 45%;
				position: relative;
				margin-left: 10px;
			}
		}
	}
}

</style>
