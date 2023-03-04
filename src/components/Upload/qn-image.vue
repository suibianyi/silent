<template>
  <div
    :style="{
      display: inline ? 'inline-block' : 'block',
      width: adaptable ? '' : `${w}px`,
      height: adaptable ? '' : `${h}px`,
      backgroundImage: !img && url && `url('${url}')`,
      backgroundSize: cover ? 'cover' : 'contain'
    }"
    class="qn-image">
    <img v-if="img && !isVideo(url)" :src="url" class="qn-image-img" alt="预览图片">
    <video v-if="img && isVideo(url)" ref="player" preload class="qn-image-img" alt="预览视频" controls>
      <source :src="url" type="video/ogg">
      <source :src="url" type="video/mp4">
    </video>
    <slot />
  </div>
</template>

<script>
import { getComputedSize } from '@/utils/dom'
import { isVideo } from '@/utils'

import { qnImage } from '@/services/mfs'

export default {
  components: {},
  props: {
    bucket: {
      type: String,
      default: 'mps'
    },
    qnKey: {
      type: String,
      required: true
    },
    width: {
      type: Number,
      default: 100
    },
    height: {
      type: Number,
      default: 100
    },
    format: {
      type: String,
      default: ''
    },
    img: {
      type: Boolean,
      default: false
    },
    adaptable: {
      type: Boolean,
      default: false
    },
    cover: {
      type: Boolean,
      default: false
    },
    inline: {
      type: Boolean,
      default: false
    }
  },
  data: () => ({
    url: '',
    w: 0,
    h: 0
  }),
  watch: {
    qnKey() {
      this.init()
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    isVideo,
    async init() {
      this.w = this.width || this.$el.offsetWidth || 1 // 作为分母计算，不能为0
      this.h = this.height || this.$el.offsetHeight || 1

      this.url = await this.getImageUrl()
    },
    async getImageUrl() {
      const {
        qnKey,
        w,
        h,
        format,
        bucket,
        adaptable,
        cover
      } = this
      let cw = w
      let ch = h
      if (bucket !== 'image-private') {
        if (adaptable) {
          cw = getComputedSize(this.$el, 'width')
          ch = cw / w * h
        }
        cw = Math.round(cw)
        ch = Math.round(ch)
      }
      return qnImage(qnKey, cover ? 'thumb' : format, bucket, cw, ch)
    }
  }
}
</script>

<style lang="stylus">
.qn-image
  position: relative
  background: no-repeat 50%
  &-img
    absolute: top 50% left 0
    width: 100%
</style>
