<template>
  <div id="w-image-style">
    <el-collapse v-model="activeNames">
      <el-collapse-item title="位置" name="1">
        <div class="line-layout">
          <number-input v-model="innerElement.left" label="X" @finish="value => finish('left', value)" />
          <number-input v-model="innerElement.top" label="Y" @finish="value => finish('top', value)" />
          <number-input v-model="innerElement.width" label="宽" @finish="value => finish('width', value)" />
          <number-input v-model="innerElement.height" label="高" @finish="value => finish('height', value)" />
        </div>
      </el-collapse-item>
      <el-collapse-item title="样式设置" name="2">
        <!-- <number-slider
          v-model="innerElement.radiusTopLeft"
          class="style-item"
          label="左上圆角"
          :max-value="Math.min(innerElement.record.width, innerElement.record.height)"
          @finish="value => finish('radiusTopLeft', value)"
        />
        <number-slider
          v-model="innerElement.radiusTopRight"
          class="style-item"
          label="右上圆角"
          :max-value="Math.min(innerElement.record.width, innerElement.record.height)"
          @finish="value => finish('radiusTopRight', value)"
        />
        <number-slider
          v-model="innerElement.radiusBottomLeft"
          class="style-item"
          label="左下圆角"
          :max-value="Math.min(innerElement.record.width, innerElement.record.height)"
          @finish="value => finish('radiusBottomLeft', value)"
        />
        <number-slider
          v-model="innerElement.radiusBottomRight"
          class="style-item"
          label="右上圆角"
          :max-value="Math.min(innerElement.record.width, innerElement.record.height)"
          @finish="value => finish('radiusBottomRight', value)"
        /> -->
        <icon-item-select class="style-item" label="图层层级" :data="layerIconList" @finish="layerAction" />
        <icon-item-select label="组件对齐" :data="alignIconList" @finish="alignAction" />
      </el-collapse-item>
      <el-collapse-item title="其他设置" name="3">
        <text-input v-model="innerElement.name" label="名称" @finish="value => finish('name', value)" />
      </el-collapse-item>
      <!-- <el-collapse-item title="客户端配置(设置客户端是否允许修改)" name="4">
        <div class="setting-list">
          <setting-switch
            v-for="item in dActiveElement.setting"
            :key="item.key"
            v-model="item.value"
            class="style-item"
            :label="item.label"
          />
        </div>
      </el-collapse-item> -->
    </el-collapse>
  </div>
</template>

<script>
// 图片组件样式
const NAME = 'w-image-style'
import { mapGetters, mapActions } from 'vuex'

export default {
  name: NAME,
  data() {
    return {
      activeNames: ['1', '2', '3', '4'],
      innerElement: {},
      tag: false,
      ingoreKeys: [
        'left',
        'top',
        'name',
        'width',
        'height',
        'radiusTopLeft',
        'radiusTopRight',
        'radiusBottomLeft',
        'radiusBottomRight'
      ],
      layerIconList: [
        {
          key: 'zIndex',
          icon: 'icon-layer-up',
          tip: '上一层',
          value: 1
        },
        {
          key: 'zIndex',
          icon: 'icon-layer-down',
          tip: '下一层',
          value: -1
        }
      ],
      alignIconList: [
        {
          key: 'align',
          icon: 'icon-align-left',
          tip: '左对齐',
          value: 'left'
        },
        {
          key: 'align',
          icon: 'icon-align-center-horiz',
          tip: '水平居中对齐',
          value: 'ch'
        },
        {
          key: 'align',
          icon: 'icon-align-right',
          tip: '右对齐',
          value: 'right'
        },
        {
          key: 'align',
          icon: 'icon-align-top',
          tip: '上对齐',
          value: 'top'
        },
        {
          key: 'align',
          icon: 'icon-align-center-verti',
          tip: '垂直居中对齐',
          value: 'cv'
        },
        {
          key: 'align',
          icon: 'icon-align-bottom',
          tip: '下对齐',
          value: 'bottom'
        }
      ]
    }
  },
  computed: {
    ...mapGetters(['dActiveElement', 'dMoving'])
  },
  watch: {
    dActiveElement: {
      handler(newValue, oldValue) {
        this.change()
      },
      deep: true
    },
    innerElement: {
      handler(newValue, oldValue) {
        this.changeValue()
      },
      deep: true
    }
  },
  created() {
    this.change()
  },
  methods: {
    ...mapActions(['updateWidgetData', 'updateAlign', 'updateLayerIndex']),
    change() {
      this.tag = true
      this.innerElement = JSON.parse(JSON.stringify(this.dActiveElement))
    },
    changeValue() {
      if (this.tag) {
        this.tag = false
        return
      }
      if (this.dMoving) {
        return
      }
      for (const key in this.innerElement) {
        if (this.ingoreKeys.indexOf(key) !== -1) {
          this.dActiveElement[key] = this.innerElement[key]
        } else if (key !== 'setting' && key !== 'record' && this.innerElement[key] !== this.dActiveElement[key]) {
          this.updateWidgetData({
            uuid: this.dActiveElement.uuid,
            key: key,
            value: this.innerElement[key]
          })
        }
      }
    },
    finish(key, value) {
      this.updateWidgetData({
        uuid: this.dActiveElement.uuid,
        key: key,
        value: value,
        pushHistory: true
      })
    },
    layerAction(item) {
      this.updateLayerIndex({
        uuid: this.dActiveElement.uuid,
        value: item.value
      })
    },
    alignAction(item) {
      this.updateAlign({
        align: item.value,
        uuid: this.dActiveElement.uuid
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~@/styles/page-design.scss";
#w-image-style {
  width: 100%;
  height: 100%;
}
.line-layout {
  width: 100%;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
}
.style-item {
  margin-bottom: 10px;
}
.setting-list {
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  flex-wrap: wrap;
}
</style>
