<template>
  <div
    id="w-rectangle"
    ref="widget"
    :style="{
      position: 'absolute',
      left: params.left - parent.left + 'px',
      top: params.top - parent.top + 'px',
      width: params.width + 'px',
      height: params.height + 'px',
      border: params.size + 'px solid ' + params.color,
      backgroundColor: params.backgroundColor,
      borderTopLeftRadius: params.radiusTopLeft + 'px',
      borderTopRightRadius: params.radiusTopRight + 'px',
      borderBottomLeftRadius: params.radiusBottomLeft + 'px',
      borderBottomRightRadius: params.radiusBottomRight + 'px',
      opacity: params.opacity
    }"
  />
</template>

<script>
// 形状-矩形组件
const NAME = 'w-rectangle'

import { mapGetters, mapActions } from 'vuex'

export default {
  name: NAME,
  setting: {
    name: '形状-矩形',
    type: NAME,
    uuid: -1,
    width: 100,
    height: 100,
    left: 0,
    top: 0,
    opacity: 1,
    radiusTopLeft: 0,
    radiusTopRight: 0,
    radiusBottomLeft: 0,
    radiusBottomRight: 0,
    parent: '-1',
    color: 'rgba(0, 0, 0, 1)',
    backgroundColor: '',
    size: 5,
    setting: [],
    record: {
      width: 0,
      height: 0,
      minWidth: 1,
      minHeight: 1,
      dir: 'all'
    }
  },
  props: ['params', 'parent'],
  data() {
    return {}
  },
  updated() {
    this.updateRecord()
  },
  mounted() {
    this.updateRecord()
  },
  computed: {
    ...mapGetters(['dActiveElement'])
  },
  methods: {
    ...mapActions([]),
    updateRecord() {
      if (this.dActiveElement.uuid === this.params.uuid) {
        const record = this.dActiveElement.record
        record.width = this.$refs.widget.offsetWidth
        record.height = this.$refs.widget.offsetHeight
        record.minWidth = this.params.size * 2
        record.minHeight = this.params.size * 2
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~@/styles/page-design.scss";
#w-rectangle {
  outline: none;
  cursor: pointer;
}
</style>
