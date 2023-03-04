<template>
  <div class="artical-detail">
    <div class="introduce-section">
      <div class="title">{{ articalDetail.title }}</div>
      <div class="introduce" style="margin-bottom: 50rpx;">
        <div>{{ articalDetail.start_date }}</div>
        <div>{{ articalDetail.creator }}</div>
      </div>
      <div>{{ articalDetail.desc }}</div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {}
  },
  computed: {
    articalDetail() {
      console.log('articalDetail是', this.$store.getters.articalDetail)
      return this.$store.getters.articalDetail
    }
  },
  mounted() {
  },
  methods: {
  }

}
</script>

<style lang='scss' scoped>
.artical-detail {
    padding: 10px 10px 0px 10px;
    .introduce-section {
		display: flex;
		flex-direction: column;
		padding: 20px 30px;
		background: #fff;
		line-height: 1.5;

		.image-container {
			width: 188px;
			height: 152px;
			position: absolute;
			right: 40px;
			top: 100px;

			image {
				width: 100%;
				height: 100%;
			}
		}

		.title {
			font-size: 40px;
			color: #000;
			margin-bottom: 16px;
		}

		.introduce {
			display: flex;
			font-size: 26px;
			color: #909399;

			text {
				margin-right: 16px;
			}
		}
	}
}
</style>
