<template>
  <div id="widget-panel">
    <div class="widget-classify">
      <span
        v-for="(item, index) in widgetClassifyList"
        :key="index"
        class="classify-item"
        :class="{ 'active-classify-item': activeWidgetClassify === index }"
        @click="clickClassify(index)"
      >
        {{ item.name }}
      </span>
    </div>
    <div class="widget-wrap">
      <text-list-wrap v-if="widgetClassifyList[0].show" :style="getStyle(0)" />
      <!-- <shape-list-wrap v-if="widgetClassifyList[1].show" :style="getStyle(1)" /> -->
      <img-list-wrap v-if="widgetClassifyList[1].show" :style="getStyle(1)" />
    </div>
  </div>
</template>

<script>
// 组件面板
const NAME = 'widget-panel'

export default {
  name: NAME,
  data() {
    return {
      widgetClassifyList: [
        {
          name: '文本',
          icon: 'icon-text',
          show: false
        },
        // {
        //   name: '形状',
        //   icon: 'icon-shape',
        //   show: false
        // },
        {
          name: '图片',
          icon: 'icon-pic',
          show: false
        }
        // {
        //   name: '素材',
        //   icon: 'icon-material',
        //   show: false
        // }
      ],
      activeWidgetClassify: -1
    }
  },
  watch: {
    activeWidgetClassify(index) {
      if (index >= 0 && index < this.widgetClassifyList.length) {
        this.widgetClassifyList[index].show = true
      }
    }
  },
  mounted() {
    this.activeWidgetClassify = 0
  },
  methods: {
    clickClassify(index) {
      this.activeWidgetClassify = index
    },
    getStyle(index) {
      return {
        display: this.activeWidgetClassify === index ? '' : 'none'
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~@/styles/page-design.scss";
#widget-panel {
  position: relative;
  width: 300px;
  height: 100%;
  display: flex;
  flex-direction: column;
  font-weight: bold;
  color: $color-black;
  .widget-classify {
    width: 100%;
    // height: 100%;
    display: flex;
    flex-direction: row;
    text-align: center;
    background-color: $color-white;
    .classify-item {
      flex: 1;
      padding: 10px;
      background-color: #F4F8FB;
      color: $color-black;
      cursor: pointer;
      // list-style: none;
      // width: 100%;
      // height: 60px;
      // font-size: 12px;
      // cursor: pointer;
      // display: flex;
      // justify-content: center;
      // align-items: center;
      // flex-direction: column;
      p {
        margin-top: 5px;
      }
      &:hover {
        color: $color-main;
      }
    }
    .active-classify-item {
      background-color: $color-white;
      color: $color-black;
    }
  }
  .widget-wrap {
    flex: 1;
    height: 100%;
    background-color: $color-white;
  }
}
</style>
