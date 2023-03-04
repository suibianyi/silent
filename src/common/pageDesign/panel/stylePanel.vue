<template>
  <div id="style-panel">
    <div class="style-tab">
      <span class="tab" :class="{ 'active-tab': activeTab === 0 }" @click="activeTab = 0">设置</span>
      <span class="tab" :class="{ 'active-tab': activeTab === 1 }" @click="activeTab = 1">图层</span>
    </div>
    <div v-show="activeTab === 0" class="style-wrap">
      <component :is="dActiveElement.type + '-style'" v-if="dActiveElement.type" />
    </div>
    <div v-show="activeTab === 1" class="layer-wrap">
      <ul class="widget-list">
        <li
          class="widget"
          :class="{ active: dActiveElement.uuid === dPage.uuid && dSelectWidgets.length === 0 }"
          @click="selectLayer(dPage)"
          @mouseover="hoverLayer('-1')"
          @mouseout="hoverLayer('-1')"
        >
          <span class="widget-type" />
          <span class="widget-name">{{ dPage.name }}</span>
          <div
            class="widget-out"
            :data-type="dPage.type"
            :data-uuid="dPage.uuid"
            :style="{
              marginLeft: '-10px'
            }"
          />
        </li>
        <li
          v-for="widget in getWidgets"
          :key="widget.uuid"
          class="widget"
          :class="[
            {
              active: getIsActive(widget.uuid)
            },
            widget.parent === '-1' ? 'item-one' : 'item-two'
          ]"
          @click="selectLayer(widget)"
          @mouseover="hoverLayer(widget.uuid)"
          @mouseout="hoverLayer('-1')"
        >
          <span class="widget-type" />
          <span class="widget-name">{{ widget.name }}</span>
          <div
            class="widget-out"
            :data-type="widget.type"
            :data-uuid="widget.uuid"
            :style="{
              marginLeft: widget.parent === '-1' ? '-25px' : '-40px'
            }"
          />
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
// 样式设置面板
const NAME = 'style-panel'
import { mapGetters, mapActions } from 'vuex'

export default {
  name: NAME,
  data() {
    return {
      activeTab: 0
    }
  },
  computed: {
    ...mapGetters(['dActiveElement', 'dWidgets', 'dPage', 'dSelectWidgets']),
    getWidgets() {
      let widgets = []
      const len = this.dWidgets.length
      let childs = []
      for (let i = len - 1; i >= 0; --i) {
        const widget = JSON.parse(JSON.stringify(this.dWidgets[i]))
        if (widget.parent === '-1') {
          widgets.push(widget)
          if (widget.isContainer) {
            widgets = widgets.concat(childs)
            childs = []
          }
        } else {
          childs.push(widget)
        }
      }
      if (childs.length > 0) {
        widgets = widgets.concat(childs)
      }

      return widgets
    }
  },
  methods: {
    ...mapActions(['selectWidget', 'updateHoverUuid']),
    selectLayer(widget) {
      this.selectWidget({
        uuid: widget.uuid
      })
    },
    hoverLayer(uuid) {
      this.updateHoverUuid(uuid)
    },
    getIsActive(uuid) {
      if (this.dSelectWidgets.length > 0) {
        const widget = this.dSelectWidgets.find(item => item.uuid === uuid)
        if (widget) {
          return true
        }
        return false
      } else {
        return uuid === this.dActiveElement.uuid
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~@/styles/page-design.scss";
#style-panel {
  position: relative;
  width: 300px;
  height: 100%;
  background-color: #ffffff;
  border-left: 1px solid #d7d7d7;
  display: flex;
  flex-direction: column;
  .style-tab {
    width: 100%;
    display: flex;
    flex-direction: row;
    text-align: center;
    // box-shadow: 0px 1px 5px 1px rgba(0, 0, 0, 0.1);
    z-index: 10;
    .tab {
      flex: 1;
      padding: 10px;
      background-color: #F4F8FB;
      color: $color-black;
      cursor: pointer;
      &.active-tab {
        background-color: $color-white;
        color: $color-black;
      }
    }
  }
  .style-wrap {
    flex: 1;
    width: 100%;
    overflow: auto;
    padding: 0 10px;
  }
  .layer-wrap {
    flex: 1;
    width: 100%;
    overflow: auto;
    .widget-list {
      width: 100%;
      .widget {
        position: relative;
        width: 100%;
        display: flex;
        padding: 10px;
        align-items: center;
        border-bottom: 1px solid #d7d7d7;
        cursor: pointer;
        background-color: #efefef;
        color: $color-black;
        &.active {
          background-color: $color-dark-gray;
          color: $color-white;
        }
        .widget-type {
          width: 20px;
          height: 20px;
          margin-right: 10px;
          display: flex;
          justify-content: center;
          align-items: center;
          background-color: $color-white;
          color: $color-black;
        }
        .widget-name {
          flex: 1;
          font-size: 14px;
          @include single-text-ellipsis();
        }
        .widget-out {
          position: absolute;
          width: 100%;
          height: 100%;
        }
      }
      .item-one {
        padding-left: 25px;
      }
      .item-two {
        padding-left: 40px;
      }
    }
  }
}
</style>
