<template>
  <div id="value-select" ref="select" :style="{ width: inputWidth }">
    <p v-if="label" class="input-label">
      {{ label }}
    </p>
    <div class="input-wrap" :class="{ active: inputBorder }" :style="{ width: inputWidth }">
      <input
        class="real-input"
        :style="{ textAlign: textAlign }"
        :class="{ disable: !disable }"
        :readonly="readonly ? 'readonly' : ''"
        type="text"
        :value="showValue"
        @input="innerValue = $event.target.value.replace(RegExp(suffix), '')"
        @focus="inputBorder = true"
        @blur="inputBorder = false"
      >
      <div class="op-btn">
        <div class="down" @click="inputBorder = !inputBorder" />
      </div>
    </div>
    <el-popover
      ref="list"
      v-model="inputBorder"
      placement="bottom-start"
      trigger="click"
      :width="width"
      popper-class="value-select-list"
    >
      <ul v-if="data" class="list-ul">
        <li
          v-for="listItem in data"
          :key="typeof listItem === 'object' ? listItem.name : listItem"
          :class="{ active: listItem == innerValue }"
          @click="selectItem(listItem)"
        >
          {{ (typeof listItem === "object" ? listItem.name : listItem) + suffix }}
        </li>
      </ul>
    </el-popover>
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
      type: undefined,
      default: 0
    },
    suffix: {
      type: String,
      default: ''
    },
    data: {
      required: true,
      type: Array
    },
    disable: {
      type: Boolean,
      default: true
    },
    inputWidth: {
      type: String,
      default: '80px'
    },
    textAlign: {
      type: String,
      default: 'center'
    },
    readonly: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      inputBorder: false,
      tagText: '',
      width: '0',
      innerValue: ''
    }
  },
  computed: {
    showValue() {
      return this.innerValue + this.suffix
    }
  },
  watch: {
    value(value) {
      this.innerValue = typeof this.value === 'object' ? this.value.name : this.value
    },
    inputBorder(value) {
      if (value) {
        this.tagText = this.innerValue
      } else {
        if (this.innerValue !== this.tagText) {
          this.$emit('finish', this.innerValue)
        }
      }
    }
  },
  created() {
    this.innerValue = typeof this.value === 'object' ? this.value.name : this.value
  },
  mounted() {
    this.width = this.$refs.select.offsetWidth
  },
  methods: {
    selectItem(item) {
      const value = typeof item === 'object' ? item.name : item
      if (this.innerValue !== value) {
        this.innerValue = value
        this.$emit('finish', item)
      }
    }
  }
}
</script>

<style lang="scss">
.value-select-list {
  min-width: 10px !important;
  padding: 5px !important;
}
</style>

<style lang="scss" scoped>
@import "~@/styles/page-design.scss";
#value-select {
  width: 80px;
  height: 60px;
  line-height: 1.15;
  .input-label {
    font-size: 12px;
    line-height: 12px;
    padding: 8px 0;
  }
  .input-wrap {
    width: 80px;
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
.list-ul {
  max-height: 240px;
  overflow-y: auto;
  li {
    cursor: pointer;
    padding: 5px;
    color: $color-black;
    font-size: 14px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    &:hover {
      background-color: #d1d1d1;
    }
    &.active {
      color: $color-main;
    }
  }
}
</style>
