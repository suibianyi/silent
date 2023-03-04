<template>
  <div class="m-tabbar">
    <div class="tabbar-container" :class="{'iphoneX': isIphoneX}">
      <div v-for="(item, index) in tabbarList" :key="index" class="navigator" @click="switchTab(index, item.pagePath)">
        <div class="navigator-item">
          <van-image v-if="currentIndex === index" width="40" height="40" :src="item.selectedIconPath" />
          <van-image v-if="currentIndex !== index" width="40" height="40" :src="item.iconPath" />
          <div class="text" :class="currentIndex === index ? 'text-area' : ''">{{ item.text }}</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
    }
  },
  computed: {
    isIphoneX() {
      return this.$store.getters.isIphoneX
    },
    tabbarList() {
      return this.$store.getters.tabbarList
    },
    currentIndex() {
      return this.$store.getters.currentIndex
    }
  },
  mounted() {
  },
  methods: {
    switchTab(index, pagePath) {
      if (this.currentIndex !== index) { // 点击的页面和上一次相同不做跳转
        // this.$router.push({ path: pagePath })
        this.$store.dispatch('setCurrentIndex', index)
      }
    }
  }
}
</script>
<style lang='scss' scoped>
.m-tabbar {
	.tabbar-container {
		width: 100%;
		height: 80px;
		padding: 20px 0;
		position: fixed;
		bottom: 0;
		display: flex;
		border-top: 2px #e0e0e0 solid;
		align-items: center;
		justify-content: space-around;
		background: #ffffff;
		z-index: 11;
		.navigator {
			height: 100%;
			display: flex;
			align-items: center;
			justify-content: center;
			background: #FFFFFF;
			z-index: 1;
			.navigator-item {
				height: 65px;
				width: 40px;
				display: flex;
				align-items: center;
				flex-direction: column;
				.text-area {
					color: #7669f7;
				}
				text {
					font-size: 18px;
					color: #929292;
					margin-top: 3px;
				}
			}
		}
	}
	.iphoneX {
		height: 100px !important;
		padding: 20px 0 40px !important;
	}
}
</style>

