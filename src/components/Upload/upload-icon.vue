<template>
  <div class="upload-icon">
    <div :style="{paddingTop: 100 * h / w + '%'}" />
    <div :style="bgStyle" :class="[local, cover ? 'cover' : '']" class="upload-icon-bg" />
    <div class="upload-icon-content">
      <slot />
    </div>
  </div>
</template>

<script>
export default {
  components: {},
  props: {
    url: {
      type: String,
      default: ''
    },
    fallback: {
      type: String,
      default: ''
    },
    local: {
      type: String,
      default: ''
    },
    cover: {
      type: Boolean,
      default: false
    },
    w: {
      type: Number,
      default: 1
    },
    h: {
      type: Number,
      default: 1
    }
  },
  data: () => ({}),
  computed: {
    bgStyle() {
      const { url, fallback } = this
      const imageUrl = url || fallback
      return {
        backgroundImage: imageUrl ? `url(${imageUrl})` : ''
      }
    }
  },
  methods: {}
}
</script>

<style lang="stylus">
$icons = id_card_back id_card_front upload_image hold_id_card store click_upload
.upload-icon
  position: relative
  overflow: hidden
  &-bg
  &-content
    absolute: top 0 bottom 0 left 0 right 0
  &-bg
    background: $color-white no-repeat 50%
    background-size: cover
    transition: transform .5s
    overflow: hidden
    for $icon in $icons
      &.{$icon}
        background: url("./" + $icon + ".png") no-repeat center
        background-size: contain
    &.cover
      background-size: cover
</style>
