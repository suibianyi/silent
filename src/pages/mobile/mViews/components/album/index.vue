<template>
  <div class="album">
    <van-list
      v-model="albums.loading"
      :finished="albums.finished"
      finished-text="没有更多了"
      @load="onLoad"
    >
      <div class="content">
        <div v-for="(item,index) in albums.albumList" :key="index" style="width: 45%;margin-bottom: 40rpx;">
          <div class="album-con" @click="switchPic(item)">
            <div class="album-image">
              <van-image
                fit="fill"
                width="100%"
                height="80"
                :src="item.thumb&&item.thumb!=''?item.thumb:noPic"
              />
              <div class="album-image-del"
              >
                <van-image width="30" height="30" :src="classStyleImages.delImgaeUrl" @click.stop="deletePhoto(item)" />
              </div>
              <div class="album-image-edit"
              >
                <van-image width="30" height="30" :src="classStyleImages.editImgaeUrl" @click.stop="editPhoto(item)" />
              </div>
            </div>

            <div class="album-content">
              {{ item.title }}
            </div>
          </div>
        </div>
      </div>
    </van-list>
  </div>
</template>

<script>
import { classStyleImages } from '@/assets/mobile/class-style/class-style.js'
export default {
  data() {
    return {
      classStyleImages: classStyleImages,
      timeOutEvent1: '',
      touchIndex: -1,
      noPic: require('@/assets/mobile/album/cover.jpg')
    }
  },
  computed: {
    albums() {
      console.log('albumsList是', this.$store.getters.album)
      if (this.$store.getters.album.albumList && this.$store.getters.album.albumList[0]) {
        this.$store.commit('SET_REFERENCE', this.$store.getters.album.albumList[0])
        this.$store.commit('ADD_PAGE_STORE', { pageStoreName: this.$store.getters.currentPage, pageStoreData: this.$store.getters.album.albumList[0] })
      }
      return this.$store.getters.album
    }
  },
  mounted() {
  },
  methods: {
    gotouchstart1(index) {
      const _this = this
      clearTimeout(_this.timeOutEvent1) // 清除定时器
      _this.timeOutEvent1 = 0
      _this.touchIndex = -1
      _this.timeOutEvent1 = setTimeout(() => {
        // 执行长按要执行的内容，
        _this.touchIndex = index
        console.log('album长按1秒', _this.touchIndex)
      }, 1000) // 这里设置定时
    },
    // 手释放，如果在1000毫秒内就释放，则取消长按事件，此时可以执行onclick应该执行的事件
    gotouchend1(val) {
      const _this = this
      clearTimeout(_this.timeOutEvent1)
      if (_this.touchIndex === -1) {
        // 这里写要执行的内容（尤如onclick事件）
        this.switchPic(val)
      }
    },
    // 如果手指有移动，则取消所有事件，此时说明用户只是要移动而不是长按
    gotouchmove1() {
      const _this = this
      clearTimeout(_this.timeOutEvent1) // 清除定时器
      _this.timeOutEvent1 = 0
    },
    async deletePhoto(value) {
      console.log('点击了删除')
      this.$store.commit('SET_REFERENCE', value)
      this.$store.commit('ADD_PAGE_STORE', { pageStoreName: this.$store.getters.currentPage, pageStoreData: value })
      if (this.$store.getters.album.del && this.$store.getters.album.del.page && this.$store.getters.album.del.page !== '') {
        this.$store.dispatch('setCurrentPage', { page: this.$store.getters.album.del.page })
      }
      if (this.$store.getters.album.del && this.$store.getters.album.del.func && this.$store.getters.album.del.func !== '') {
        console.log('执行func')
        this.$store.dispatch(`${this.$store.getters.album.del.func.method}`, { func: this.$store.getters.album.del.func })
      }
      if (this.$store.getters.album.del && this.$store.getters.album.del.req && this.$store.getters.album.del.req !== '') {
        console.log('执行req')
        this.$store.dispatch('sendRequest', { request: this.$store.getters.album.del.req })
      }
      if (this.$store.getters.album.del && this.$store.getters.album.del.action && this.$store.getters.album.del.action.length) {
        console.log('执行req')
        this.$store.dispatch('handelAction', this.$store.getters.album.del.action)
      }
    },
    editPhoto(value) {
      console.log('点击了编辑', this.$store.getters.album.edit)
      this.$store.commit('SET_REFERENCE', value)
      this.$store.commit('ADD_PAGE_STORE', { pageStoreName: this.$store.getters.currentPage, pageStoreData: value })
      if (this.$store.getters.album.edit && this.$store.getters.album.edit.page && this.$store.getters.album.edit.page !== '') {
        this.$store.dispatch('setCurrentPage', { page: this.$store.getters.album.edit.page })
      } else if (this.$store.getters.album.edit && this.$store.getters.album.edit.func && this.$store.getters.album.edit.func !== '') {
        console.log('执行func')
        this.$store.dispatch(`${this.$store.getters.album.edit.func.method}`, { func: this.$store.getters.album.edit.func })
      } else {
        this.$store.dispatch('handelAction', this.$store.getters.album.edit.action)
      }
    },
    onLoad() {
      this.$store.dispatch('loadAlbum')
    },
    switchPic(value) {
      if (value.page) {
        this.$store.commit('SET_REFERENCE', value)
        this.$store.commit('ADD_PAGE_STORE', { pageStoreName: this.$store.getters.currentPage, pageStoreData: value })
        this.$store.dispatch('setCurrentPage', { page: value.page })
        // this.$store.commit(`${this.$store.getters.dynamicJumpDate}`, value)
      } else if (this.$store.getters.dynamicJumpPage !== '') {
        this.$store.commit('SET_REFERENCE', value)
        this.$store.commit('ADD_PAGE_STORE', { pageStoreName: this.$store.getters.currentPage, pageStoreData: value })
        this.$store.dispatch('setCurrentPage', { page: this.$store.getters.album.jumpPage })
        // this.$store.commit(`${this.$store.getters.dynamicJumpDate}`, value)
      } else {
        this.$store.dispatch('handelAction', this.$store.getters.album.jumpPage.action)
      }
    }
  }

}
</script>

<style lang='scss' scoped>
.album {
    margin: 10px 15px 15px 15px;
    min-height: 100px;
    min-width: 80%;
    .time {
        text-align: center;
        color: #A0A0A0;
        height: 60px;
        font-size: 16px;
        line-height: 60px;
    }
    .content {
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;
      .album-con {
        /* height: 300rpx; */
        /* width: 100%; */
        background-color: #FFFFFF;
        border-radius: 15px;
        padding: 15px;
        margin: 12px 0px 12px 0px;
      }

      .album-image {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 80px;
        width: 100%;
        border-radius: 15px;
        position: relative;
      }

      .album-content {
        height: 40px;
        width: 100%;
        font-weight: bold;
        line-height: 50px;
        font-size: 15px;
        text-align: center;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }

      .album-image-count {
        color: #FFFFFF;
        position: absolute;
        right: 20px;
        bottom: 20px;
        z-index: 997;
      }

      .album-image-del {
        position: absolute;
        right: 5px;
        top: 50px;
      }

      .album-image-edit {
        position: absolute;
        right: 5px;
        bottom: 45px;
      }
    }
}
</style>
