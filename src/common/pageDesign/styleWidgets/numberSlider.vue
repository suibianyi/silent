<template>
  <div id="number-slider">
    <span class="label">{{ label }}</span>
    <el-slider v-model="innerValue" :min="minValue" :max="maxValue" input-size="mini" show-input @change="changeValue" />
  </div>
</template>

<script>
// 数值滑块组件
const NAME = 'number-slider'
import { mapGetters, mapActions } from 'vuex'

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
    minValue: {
      type: Number,
      default: 0
    },
    maxValue: {
      type: Number,
      default: 100
    }
  },
  data() {
    return {
      innerValue: 0,
      first: true
    }
  },
  computed: {
    ...mapGetters([])
  },
  watch: {
    innerValue(value) {
      if (this.first) {
        this.first = false
        return
      }
      this.$emit('input', value)
    }
  },
  created() {
    this.first = true
    this.innerValue = this.value
  },
  methods: {
    ...mapActions([]),
    changeValue(value) {
      this.$emit('finish', value)
    }
  }
}
</script>

<style lang="scss">
.el-slider {
  width: 200px !important;
  .show-input {
    margin-right: 90px !important;
  }
  .el-slider__input {
    width: 80px !important;
    .el-input-number__decrease,
    .el-input-number__increase {
      width: 16px !important;
    }
    .el-input--mini {
      .el-input__inner {
        padding-left: 10px !important;
        padding-right: 10px !important;
      }
    }
  }
}
</style>

<style lang="scss" scoped>
#number-slider {
  display: flex;
  align-items: center;
  .label {
    margin-right: 10px;
  }
}
</style>
