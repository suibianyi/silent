<template>
  <div
    id="w-text"
    ref="widget"
    :contenteditable="editable ? 'plaintext-only' : false"
    :class="[{ 'edit-text': editable }, params.uuid, params.fontClass.value]"
    :style="{
      position: 'absolute',
      left: params.left - parent.left + 'px',
      top: params.top - parent.top + 'px',
      width: Math.max(params.fontSize, params.width) + 'px',
      minWidth: params.fontSize + 'px',
      minHeight: params.fontSize * params.lineHeight + 'px',
      lineHeight: params.fontSize * params.lineHeight + 'px',
      letterSpacing: (params.fontSize * params.letterSpacing) / 100 + 'px',
      fontSize: params.fontSize + 'px',
      color: params.textColor,
      textAlign: params.textAlign,
      fontWeight: params.fontWeight,
      fontStyle: params.fontStyle,
      textDecoration: params.textDecoration,
      opacity: params.opacity,
      backgroundColor: params.backgroundColor
    }"
    @dblclick="e => dblclickText(e)"
    @blur="e => updateText(e)"
    v-html="params.text"
  />
</template>

<script>
// 文本组件
const NAME = 'w-text'

import { mapGetters, mapActions } from 'vuex'

export default {
  name: NAME,
  setting: {
    name: '文本',
    type: NAME,
    uuid: -1,
    editable: true,
    width: 300,
    left: 0,
    top: 0,
    lineHeight: 1.5,
    letterSpacing: 0,
    fontSize: 24,
    fontClass: {
      name: '默认字体',
      value: ''
    },
    fontWeight: 'normal',
    fontStyle: 'normal',
    textDecoration: 'none',
    textColor: 'rgba(0, 0, 0, 1)',
    textAlign: 'left',
    text: '文本',
    opacity: 1,
    backgroundColor: '',
    parent: '-1',
    setting: [
      {
        label: '文本内容',
        parentKey: 'text',
        value: true
      },
      {
        label: '文本颜色',
        parentKey: 'textColor',
        value: false
      }
    ],
    record: {
      width: 0,
      height: 0,
      minWidth: 0,
      minHeight: 0,
      dir: 'horizontal'
    }
  },
  props: ['params', 'parent'],
  data() {
    return {
      editable: false
    }
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
    ...mapActions(['updateWidgetData']),
    updateRecord() {
      if (this.dActiveElement.uuid === this.params.uuid) {
        const record = this.dActiveElement.record
        record.width = this.$refs.widget.offsetWidth
        record.height = this.$refs.widget.offsetHeight
        record.minWidth = this.params.fontSize
        record.minHeight = this.params.fontSize * this.params.lineHeight
      }
    },
    updateText(e) {
      // this.editable = false
      // console.log(e.target.innerText.replace(/\n|\r\n/g,"<br/>").replace(/ /g, '&nbsp;'))
      // this.updateWidgetData({
      //   uuid: this.params.uuid,
      //   key: 'text',
      //   value: e.target.innerText.replace(/\n|\r\n/g,"<br/>").replace(/ /g, '&nbsp;')
      // })
    },
    dblclickText(e) {
      // this.editable = true
      // let text = document.getElementsByClassName(this.params.uuid)
      // if (text.length > 0) {
      //   text = text[0]
      // }
      // if (document.body.createTextRange) {
      //   var range = document.body.createTextRange()
      //   range.moveToElementText(text)
      //   range.select()
      // } else if (window.getSelection) {
      //   var selection = window.getSelection()
      //   var range = document.createRange()
      //   range.selectNodeContents(text)
      //   selection.removeAllRanges()
      //   selection.addRange(range)
      // }
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~@/styles/page-design.scss";
// @import "~@/styles/page-design-font.scss";
#w-text {
  outline: none;
  cursor: pointer;
  word-break: break-word;
  &.edit-text {
    cursor: text;
    outline: 1px solid $color-black !important;
  }
}
</style>
