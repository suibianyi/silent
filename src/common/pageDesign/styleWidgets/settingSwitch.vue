<template>
  <div id="setting-switch">
    <span class="label">{{ label }}</span>
    <el-switch v-model="innerValue" active-color="#3B74F1" />
  </div>
</template>

<script>
// 设置开关组件
const NAME = 'setting-switch'

export default {
  name: NAME,
  props: {
    label: {
      type: String,
      default: ''
    },
    value: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      innerValue: false,
      first: false
    }
  },
  watch: {
    innerValue(value) {
      if (this.first) {
        this.first = false
        return
      }
      this.updateValue(value)
    }
  },
  created() {
    if (this.innerValue !== this.value) {
      this.first = true
    }
    this.innerValue = this.value
  },
  methods: {
    updateValue(value) {
      this.$emit('input', value)
    }
  }
}
</script>

<style lang="scss" scoped>
#setting-switch {
  display: flex;
  align-items: center;
  .label {
    margin-right: 10px;
  }
}
</style>
