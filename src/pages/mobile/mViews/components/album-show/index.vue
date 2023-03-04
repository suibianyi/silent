<template>
  <div class="album-show">
    <van-list
      v-model="albumShowList.loading"
      :finished="albumShowList.finished"
      finished-text="没有更多了"
      @load="onLoad"
    >
      <div class="content">
        <div v-for="(item, index) in albumShowList.albumList" :key="index" class="album">
          <div class="album-image">
            <van-image
              fit="fill"
              width="100%"
              height="100%"
              :src="item.thumb" />
            <!-- <div v-if="currentTabIndex === 2" class="reject-btn" @click="showRejectReason(item.audit_note)">
              查看驳回理由
            </div> -->
            <div v-if="!item.checked" class="album-image-del" @click="imageChecked(index, item.checked)">
              <van-image width="30" height="30" :src="classStyleContentImages.delImgaeUrl" />
            </div>

            <div v-if="item.checked" class="album-image-del" @click="imageChecked(index, item.checked)">
              <van-image width="30" height="30" :src="classStyleContentImages.delImgaeCheckedUrl" />
            </div>
          </div>
        </div>
      </div>
    </van-list>
    <van-goods-action>
      <van-goods-action-button type="warning" text="取消" @click="cancelChecked()" />
      <van-goods-action-button type="danger" text="删除" @click="confirmChecked()" />
    </van-goods-action>
  </div>
</template>

<script>
import { classStyleContentImages } from '@/assets/mobile/class-style/class-style-content.js'
import {
  mRequest
} from '@/api/request'
export default {
  data() {
    return {
      classStyleContentImages: classStyleContentImages,
      album: []
    }
  },
  computed: {
    albumShowList() {
      console.log('album-show的albumsList是', this.$store.getters.album)
      return this.$store.getters.album
    }
  },
  mounted() {
  },
  methods: {
    onLoad() {
      this.$store.dispatch('loadAlbum')
    },
    cancelChecked() {
      for (let i = 0; i < this.$store.getters.album.albumList.length; i++) {
        this.$store.dispatch('setAlbumChecked', { index: i, checked: false })
      }
    },
    async confirmChecked() {
      console.log('执行confirmChecked', this.$store.getters.album)
      if (this.$store.getters.album.del && this.$store.getters.album.del.page && this.$store.getters.album.del.page !== '') {
        this.$store.dispatch('setCurrentPage', { page: this.$store.getters.album.del.page })
      }
      if (this.$store.getters.album.del && this.$store.getters.album.del.req && this.$store.getters.album.del.req !== '') {
        const sendata = {}
        let delArr = []
        this.$store.getters.album.albumList.forEach(o => {
          if (o.checked) {
            delArr.push(o.id)
          }
        })
        delArr = JSON.stringify(delArr)
        sendata.ids = delArr
        console.log('执行req', sendata)
        await mRequest({
          url: this.$store.getters.album.del.req.url,
          method: this.$store.getters.album.del.req.method,
          data: sendata
        })
        this.$store.dispatch('refreshPage')
        // this.$store.dispatch(`${this.$store.getters.album.del.func.method}`, { func: this.$store.getters.album.del.func })
      }
    },
    imageChecked(index, checked) {
      this.$store.dispatch('setAlbumChecked', { index, checked: !checked })
    }
  }

}
</script>

<style lang='scss' scoped>
.album-show {
  .content {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    .album {
			width: 49.9%;
		}
    .album-image-del {
			z-index: 999;
			position: absolute;
			right: 5px;
			top: 5px;
		}
    .album-image {
			display: flex;
			justify-content: center;
			align-items: center;
			height: 190px;
			width: 100%;
			border-radius: 15px;
			position: relative;
			.reject-btn {
				position: absolute;
				top: 0;
				width: 100%;
				height: 80px;
				color: #ffffff;
				background-color: rgba(0, 0, 0, 0.7);
				display: flex;
				justify-content: center;
				align-items: center;
				font-size: 26px;
			}
		}
  }
}

</style>
