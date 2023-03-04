<template>
  <div id="number-input">
    <p v-if="label" class="input-label">
      {{ label }}
    </p>
    <div class="input-wrap" :class="{ active: inputBorder }">
      <input
        class="real-input"
        :class="{ disable: !editable }"
        type="text"
        :value="value"
        :readonly="editable ? false : 'readonly'"
        @input="updateValue($event.target.value)"
        @focus="focusInput"
        @blur="blurInput"
        @keyup="verifyNumber"
        @keydown="e => opNumber(e)"
      >
      <div v-if="editable" class="op-btn">
        <div class="up" @click="up" />
        <div class="down" @click="down" />
      </div>
    </div>
  </div>
</template>

<script>
// 数字输入组件
const NAME = 'number-input'

export default {
  name: NAME,
  props: {
    label: {
      type: String,
      default: ''
    },
    value: {
      type: Number,
      default: 0
    },
    editable: {
      type: Boolean,
      default: true
    },
    step: {
      type: Number,
      default: 1
    }
  },
  data() {
    return {
      inputBorder: false,
      tagText: ''
    }
  },
  computed: {},
  methods: {
    updateValue(value) {
      this.$emit('input', value)
    },
    up() {
      this.$emit('finish', parseInt(this.value || 0) + this.step)
    },
    down() {
      let value = parseInt(this.value || 0) - this.step
      if (value < 0) {
        value = 0
      }
      this.$emit('finish', value)
    },
    opNumber(e) {
      e.stopPropagation()
      switch (e.keyCode) {
        case 38:
          this.up()
          return
        case 40:
          this.down()
          return
      }
    },
    verifyNumber() {
      const value = this.value + ''
      const len = value.length
      let newValue = ''
      for (let i = 0; i < len; ++i) {
        const c = value[i]
        if (c >= '0' && c <= '9') {
          newValue += c
        } else {
          break
        }
      }
      if (newValue === '') {
        newValue = '0'
      }
      this.updateValue(parseInt(newValue))
    },
    focusInput() {
      this.inputBorder = true
      this.tagText = this.value
    },
    blurInput() {
      this.inputBorder = false
      if (this.value !== this.tagText) {
        this.$emit('finish', this.value)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~@/styles/page-design.scss";
#number-input {
  width: 60px;
  height: 60px;
  line-height: 1.15;
  .input-label {
    font-size: 12px;
    line-height: 12px;
    padding: 8px 0;
    text-align: center;
  }
  .input-wrap {
    width: 60px;
    display: flex;
    flex-direction: row;
    border: 1px solid #e1e1e1;
    border-radius: 3px;
    &.active {
      border: 1px solid rgba(59, 116, 241, 0.7);
      box-shadow: 1px 1px 5px 2px rgba(59, 116, 241, 0.1);
    }
    .real-input {
      width: 100%;
      height: 30px;
      border: 0px;
      outline: none;
      font-size: 12px;
      padding: 5px;
      text-align: center;
      border-radius: 3px;
      &.disable {
        color: #666666;
        cursor: not-allowed;
      }
    }
    .op-btn {
      width: 14px;
      height: 30px;
      display: flex;
      flex-direction: column;
      border-left: 1px solid #e1e1e1;
      .up {
        position: relative;
        width: 13px;
        flex: 1;
        border-top-right-radius: 3px;
        &:hover {
          background-color: #d1d1d1;
        }
        &:before {
          content: "";
          top: 50%;
          left: 50%;
          transform: translateY(-50%) translateX(-50%);
          position: absolute;
          @include triangle(50%, 4px, $color-dark-gray);
        }
      }
      .down {
        position: relative;
        width: 13px;
        flex: 1;
        border-bottom-right-radius: 3px;
        &:hover {
          background-color: #d1d1d1;
        }
        &:before {
          content: "";
          top: 50%;
          left: 50%;
          transform: translateY(-50%) translateX(-50%);
          position: absolute;
          @include triangle(bottom, 4px, $color-dark-gray);
        }
      }
    }
  }
}
</style>
