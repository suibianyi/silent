<template>
  <div id="page-style">
    <el-collapse v-model="activeNames">
      <el-collapse-item title="屏幕设置" name="1">
        <value-select
          label="屏幕"
          :data="screenTypeList"
          :value="innerElement.screen"
          input-width="280px"
          text-align="left"
          :readonly="true"
          @finish="value => updateSize('screen', value)"
        />
      </el-collapse-item>
      <el-collapse-item title="位置大小" name="2">
        <div class="position-size">
          <number-input v-model="defaultValue" label="X" :editable="false" />
          <number-input v-model="defaultValue" label="Y" :editable="false" />
          <number-input v-model="innerElement.width" label="宽" :editable="false" />
          <number-input v-model="innerElement.height" label="高" :editable="false" />
          <!-- <number-input v-model="innerElement.width" label="宽" @finish="value => finish('width', value)" />
          <number-input v-model="innerElement.height" label="高" @finish="value => finish('height', value)" /> -->
        </div>
      </el-collapse-item>
      <el-collapse-item title="样式设置" name="3">
        <color-select
          v-model="innerElement.backgroundColor"
          class="select-none"
          label="背景颜色"
          @finish="value => finish('backgroundColor', value)"
        />
        <!-- <bg-img-select :img="innerElement.backgroundImage"/> -->
      </el-collapse-item>
      <el-collapse-item title="其他设置" name="4">
        <text-input v-model="innerElement.name" label="名称" @finish="value => finish('name', value)" />
      </el-collapse-item>
      <!-- <el-collapse-item title="客户端配置(设置客户端是否允许修改)" name="4">
        <setting-switch v-for="item in dActiveElement.setting" :key="item.key" v-model="item.value" :label="item.label" />
      </el-collapse-item> -->
    </el-collapse>
  </div>
</template>

<script>
// 画布组件样式
const NAME = 'page-style'
import { mapGetters, mapActions } from 'vuex'

export default {
  name: NAME,
  data() {
    return {
      screenTypeList: [
        {
          name: '横屏1920*1080',
          value: 1
        },
        {
          name: '竖屏1080*1920',
          value: 2
        }
      ],
      activeNames: ['1', '2', '3', '4'],
      defaultValue: 0,
      innerElement: {},
      tag: false,
      ingoreKeys: ['backgroundColor', 'name', 'width', 'height']
    }
  },
  computed: {
    ...mapGetters(['dActiveElement'])
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
    // this.updateSize()
  },
  methods: {
    ...mapActions(['updatePageData', 'updatePageSize', 'updateScreenType']),
    change() {
      this.tag = true
      this.innerElement = JSON.parse(JSON.stringify(this.dActiveElement))
      console.log('this.innerElement', this.innerElement)
    },
    changeValue() {
      if (this.tag) {
        this.tag = false
        return
      }
      for (const key in this.innerElement) {
        if (key !== 'setting' && key !== 'record' && this.innerElement[key] !== this.dActiveElement[key]) {
          if (this.ingoreKeys.indexOf(key) !== -1) {
            this.dActiveElement[key] = this.innerElement[key]
          } else {
            this.updatePageData({
              key: key,
              value: this.innerElement[key]
            })
          }
        }
      }
    },
    finish(key, value) {
      this.updatePageData({
        key: key,
        value: value,
        pushHistory: true
      })
    },
    updateSize(key, value) {
      switch (value.value) {
        case 1: {
          this.updatePageSize({
            width: 1920,
            height: 1080
          })
          this.updateScreenType({
            name: '横屏1920*1080',
            value: 1
          })
          break
        }
        case 2: {
          this.updatePageSize({
            width: 1080,
            height: 1920
          })
          this.updateScreenType({
            name: '竖屏1080*1920',
            value: 2
          })
          break
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~@/styles/page-design.scss";
#page-style {
  width: 100%;
  height: 100%;
}
.position-size {
  width: 100%;
  display: flex;
  justify-content: space-between;
}
.select {
  margin-bottom: 10px;
}
</style>
