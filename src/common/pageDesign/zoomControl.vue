<template>
  <div id="zoom-control">
    <ul v-show="show" class="zoom-selecter">
      <li
        v-for="(item, index) in zoomList"
        :key="index"
        class="zoom-item"
        :class="{ 'zoom-item-active': activezoomIndex === index }"
        @click.stop="selectItem(index)"
      >
        <i v-if="item.icon" class="iconfont" :class="item.icon" />
        <span>{{ item.text }}</span>
        <i v-if="activezoomIndex === index" class="iconfont icon-selected" />
      </li>
    </ul>
    <div class="zoom-control-wrap">
      <div
        class="zoom-icon radius-left"
        :class="{ disable: activezoomIndex === 0 }"
        @click.stop="activezoomIndex > 0 ? sub() : ''"
      >
        <i class="iconfont icon-sub" />
      </div>
      <div class="zoom-text" :class="{ 'zoom-text-active': show }" @click.stop="show = !show">
        {{ zoom.text }}
      </div>
      <div
        class="zoom-icon radius-right"
        :class="{ disable: otherIndex === otherList.length - 1 }"
        @click.stop="otherIndex < otherList.length - 1 ? add() : ''"
      >
        <i class="iconfont icon-add" />
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

// 组件大小控制器
const NAME = 'zoom-control'

export default {
  name: NAME,
  data() {
    return {
      activezoomIndex: 0,
      zoomList: [
        {
          text: '25%',
          value: 25
        },
        {
          text: '50%',
          value: 50
        },
        {
          text: '75%',
          value: 75
        },
        {
          text: '100%',
          value: 100
        },
        {
          text: '125%',
          value: 125
        },
        {
          text: '150%',
          value: 150
        },
        {
          text: '200%',
          value: 200
        },
        {
          text: '最佳尺寸',
          value: -1,
          icon: 'icon-best-size'
        }
      ],
      show: false,
      zoom: {
        value: 0,
        text: 0
      },
      otherList: [
        {
          text: '250%',
          value: 250
        },
        {
          text: '300%',
          value: 300
        },
        {
          text: '350%',
          value: 350
        },
        {
          text: '400%',
          value: 400
        },
        {
          text: '450%',
          value: 450
        },
        {
          text: '500%',
          value: 500
        }
      ],
      otherIndex: -1,
      bestZoom: 0
    }
  },
  mounted() {
    window.addEventListener('click', this.close)
    this.activezoomIndex = this.zoomList.length - 1
  },
  beforeDestroy() {
    window.removeEventListener('click', this.close)
  },
  computed: {
    ...mapGetters(['dPage', 'dScreen'])
  },
  watch: {
    activezoomIndex(value) {
      if (value < 0 || value > this.zoomList.length - 1) {
        return
      }
      this.zoom = this.zoomList[value]
    },
    otherIndex(value) {
      if (value < 0 || value > this.otherList.length - 1) {
        return
      }
      this.zoom = this.otherList[value]
    },
    zoom(value) {
      let realValue = value.value
      if (realValue === -1) {
        realValue = this.calcZoom()
      }
      this.updateZoom(realValue)
    }
  },
  methods: {
    ...mapActions(['updateZoom']),
    selectItem(index) {
      this.activezoomIndex = index
      this.otherIndex = -1
      this.show = false
    },
    close(e) {
      this.show = false
    },
    add() {
      this.show = false
      if (this.activezoomIndex === this.zoomList.length - 2 || this.activezoomIndex === this.zoomList.length - 1) {
        this.activezoomIndex = this.zoomList.length
        this.otherIndex += 1
        return
      }
      if (this.activezoomIndex !== this.zoomList.length) {
        this.activezoomIndex++
        return
      }
      if (this.otherIndex < this.otherList.length - 1) {
        this.otherIndex++
      }
    },
    sub() {
      this.show = false
      if (this.otherIndex === 0) {
        this.otherIndex = -1
        this.activezoomIndex = this.zoomList.length - 2
        return
      }
      if (this.otherIndex !== -1) {
        this.otherIndex--
        return
      }
      if (this.activezoomIndex === this.zoomList.length - 1) {
        this.activezoomIndex = this.zoomList.length - 2
        return
      }
      if (this.activezoomIndex !== 0) {
        this.activezoomIndex--
      }
    },
    calcZoom() {
      const widthZoom = ((this.dScreen.width - 142) * 100) / this.dPage.width
      const heightZoom = ((this.dScreen.height - 122) * 100) / this.dPage.height

      this.bestZoom = Math.min(widthZoom, heightZoom)
      return this.bestZoom
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~@/styles/page-design.scss";
#zoom-control {
  position: absolute;
  bottom: 50px;
  left: 340px;
  z-index: 1000;
  .zoom-control-wrap {
    height: 40px;
    display: flex;
    flex-direction: row;
    font-size: 14px;
    .radius-left {
      border-top-left-radius: 50%;
      border-bottom-left-radius: 50%;
    }
    .radius-right {
      border-top-right-radius: 50%;
      border-bottom-right-radius: 50%;
    }
    .zoom-icon {
      background-color: $color-light-gray;
      color: $color-white;
      width: 40px;
      cursor: pointer;
      display: flex;
      justify-content: center;
      align-items: center;
      &:hover {
        color: $color-main;
        background-color: $color-dark-gray;
      }
    }
    .disable {
      color: #808080;
      &:hover {
        color: #808080;
        background-color: $color-light-gray;
        cursor: not-allowed;
      }
    }
    .zoom-text {
      background-color: $color-light-gray;
      color: $color-white;
      width: 60px;
      cursor: pointer;
      display: flex;
      justify-content: center;
      align-items: center;
      &:hover {
        color: $color-main;
        background-color: $color-dark-gray;
      }
    }
    .zoom-text-active {
      color: $color-main;
      background-color: $color-dark-gray;
    }
  }
  .zoom-selecter {
    position: absolute;
    width: 100%;
    top: -10px;
    transform: translateY(-100%);
    z-index: 1000;
    background-color: $color-dark-gray;
    color: $color-white;
    &:after {
      content: "";
      position: absolute;
      bottom: -8px;
      left: 50%;
      transform: translateX(-50%);
      @include triangle(-8px, 8px, $color-dark-gray);
    }
    .zoom-item {
      width: 100%;
      height: 34px;
      font-size: 14px;
      padding: 10px;
      display: flex;
      align-items: center;
      cursor: pointer;
      i {
        margin-right: 10px;
        &:last-child {
          margin-right: 0;
        }
      }
      span {
        flex: 1;
      }
      &:hover {
        color: $color-main;
        background-color: #50555b;
      }
    }
    .zoom-item-active {
      color: $color-main;
      background-color: #50555b;
    }
  }
}
</style>
