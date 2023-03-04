<template>
  <div id="img-water-fall" ref="imgWaterFall">
    <div
      class="content-box"
      :style="{
        top: contentTop + 'px'
      }"
    >
      <div
        v-for="(item, index) in innerListData"
        :key="index"
        class="img-box"
        :style="{
          width: boxWidth + 'px',
          height: boxWidth / item.ratio + 'px',
          top: item.top + 'px',
          left: item.left + 'px'
        }"
        @click.stop="selectImg(item, index)"
      >
        <transition name="fade">
          <img
            class="img"
            :src="item.value.url"
            :style="{
              width: boxWidth - 10 + 'px',
              height: boxWidth / item.ratio - 10 + 'px'
            }"
          >
        </transition>
        <div v-if="item.value.canDel" class="delete" @click.stop="deleteImg(item, index)">
          <div class="bg" />
          <i class="delete-icon iconfont icon-delete-x" />
        </div>
      </div>
    </div>
    <div id="scroll-box" ref="scrollBox" class="scroll-box">
      <div
        id="scroll-bar"
        ref="scrollBar"
        class="scroll-bar"
        :style="{
          height: scrollBarStyle.height + 'px',
          top: scrollBarStyle.top + 'px',
          display: scrollBarStyle.display
        }"
      />
    </div>
  </div>
</template>

<script>
// 图片素材-瀑布流组件
const NAME = 'img-water-fall'

export default {
  name: NAME,
  props: {
    listData: {
      type: Array,
      required: true
    },
    sortBy: {
      type: String,
      default: ''
    },
    k: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      innerListData: [],
      parentWidth: 0,
      listHeight: 0,
      scrollBarStyle: {
        height: 0,
        top: 0,
        display: 'none'
      },
      contentTop: 0
    }
  },
  computed: {
    boxWidth() {
      return (this.parentWidth - 5) / 3
    },
    scrollTop() {
      return this.scrollBarStyle.top
    }
  },
  watch: {
    listData(value) {
      this.preLoadImg()
    },
    listHeight(value) {
      this.resizeScorll()
    },
    scrollTop(value) {
      const scrollBar = this.$refs.scrollBar
      const boxHeight = scrollBar.parentNode.offsetHeight
      const barHeight = scrollBar.offsetHeight
      this.contentTop = (-value * boxHeight) / barHeight
    }
  },
  mounted() {
    this.parentWidth = this.$refs.imgWaterFall.clientWidth
    this.preLoadImg()
    this.$refs.scrollBar.onmousedown = this.tragScroll
    this.$refs.scrollBox.onmousedown = this.clickScroll
    this.mouseWheel(this.$refs.imgWaterFall, this.wheelChange)
  },
  methods: {
    preLoadImg() {
      const arr = []
      this.listData.forEach((item, index) => {
        arr.push({
          ratio: item.ratio,
          value: item
        })
      })
      this.innerListData = arr
      this.waterfall()
    },
    waterfall() {
      const heightList = [1, 1, 1]
      const len = this.innerListData.length
      for (let index = 0; index < len; ++index) {
        const item = this.innerListData[index]
        let col = 0
        const value = Math.min.apply(null, heightList)
        for (let j = 0; j < 3; ++j) {
          if (value === heightList[j]) {
            col = j
            break
          }
        }
        item.top = heightList[col]
        item.left = this.boxWidth * col + 1
        heightList[col] += this.boxWidth / item.ratio
      }
      this.listHeight = Math.max.apply(null, heightList)
    },
    selectImg(value, index) {
      this.$emit('select-img', value)
    },
    deleteImg(value, index) {
      this.innerListData.splice(index, 1)
      this.waterfall()
      this.$emit('delete-img', value)
    },
    mouseWheel(obj, handler) {
      bind(obj, 'mousewheel', function(event) {
        const data = -getWheelData(event)
        handler(data)
        if (document.all) {
          window.event.returnValue = false
        } else {
          event.preventDefault()
        }
      })
      // 火狐
      bind(obj, 'DOMMouseScroll', function(event) {
        const data = getWheelData(event)
        handler(data)
        event.preventDefault()
      })
      function getWheelData(e) {
        return -e.deltaY
      }
      function bind(obj, type, handler) {
        if (obj.addEventListener) {
          obj.addEventListener(type, handler, false)
        } else if (obj.attachEvent) {
          obj.attachEvent('on' + type, handler)
        } else {
          obj['on' + type] = handler
        }
      }
    },
    // 调整滚动条
    resizeScorll() {
      const scrollBar = this.$refs.scrollBar
      const boxHeight = scrollBar.parentNode.offsetHeight
      const scrollHeight = (boxHeight * boxHeight) / this.listHeight
      this.scrollBarStyle.display = this.listHeight <= boxHeight ? 'none' : ''
      this.scrollBarStyle.height = scrollHeight
    },
    // 拖拽滚动条
    tragScroll(e) {
      e.stopPropagation()
      e.preventDefault()
      const scrollBar = this.$refs.scrollBar
      const boxHeight = scrollBar.parentNode.offsetHeight
      const barHeight = scrollBar.offsetHeight
      let scrollTop = scrollBar.offsetTop
      let startTop = e.pageY
      document.addEventListener('mousemove', trag, true)
      document.addEventListener(
        'mouseup',
        e => {
          e.stopPropagation()
          e.preventDefault()
          document.removeEventListener('mousemove', trag, true)
          document.removeEventListener('mouseup', trag, true)
        },
        true
      )
      const _this = this
      function trag(e) {
        e.stopPropagation()
        e.preventDefault()
        const tragTop = e.pageY
        let temp = tragTop - startTop + scrollTop
        temp = Math.min(Math.max(0, temp), boxHeight - barHeight)
        scrollTop = temp
        startTop = tragTop
        _this.scrollBarStyle.top = temp
      }
    },
    clickScroll(e) {
      e.stopPropagation()
      e.preventDefault()
      const scrollBar = this.$refs.scrollBar
      const boxHeight = scrollBar.parentNode.offsetHeight
      const barHeight = scrollBar.offsetHeight
      const scrollTop = scrollBar.offsetTop
      const _this = this
      document.addEventListener(
        'mouseup',
        e => {
          e.stopPropagation()
          e.preventDefault()
          const endTop = e.pageY
          const temp = barHeight / 2 + scrollTop - endTop
          let tempTop = scrollTop - temp
          tempTop = Math.min(Math.max(0, tempTop), boxHeight - barHeight)
          _this.scrollBarStyle.top = tempTop
          document.removeEventListener('mouseup', this, true)
        },
        true
      )
    },
    // 鼠标滚轮滚动，滚动条滚动
    wheelChange(data) {
      const scrollBar = this.$refs.scrollBar
      const boxHeight = scrollBar.parentNode.offsetHeight
      const barHeight = scrollBar.offsetHeight
      let top = this.scrollBarStyle.top + data
      top = Math.min(Math.max(0, top), boxHeight - barHeight)
      this.scrollBarStyle.top = top
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~@/styles/page-design.scss";
#img-water-fall {
  position: relative;
  width: 100%;
  flex: 1;
  overflow: hidden;
  .scroll-box {
    width: 5px;
    position: absolute;
    top: 0;
    right: 1px;
    height: 100%;
    .scroll-bar {
      position: absolute;
      width: 5px;
      top: 0;
      background: $color-white;
      border-radius: 10px;
    }
  }
  .content-box {
    position: absolute;
    height: 100%;
    top: 0;
    left: 0;
    .img-box {
      position: absolute;
      cursor: pointer;
      padding: 5px;
      &:hover {
        outline: 1px solid $color-white;
        .delete {
          width: 40px;
          height: 40px;
          .bg {
            border-top: 40px solid $color-light-gray;
            border-right: 40px solid $color-transparent;
          }
          .delete-icon {
            left: 5px;
            top: 5px;
            display: block;
            position: absolute;
          }
        }
      }
      .delete {
        position: absolute;
        left: 0;
        top: 0;
        .delete-icon {
          font-size: 12px;
          color: $color-white;
          display: none;
        }
      }
    }
  }
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
