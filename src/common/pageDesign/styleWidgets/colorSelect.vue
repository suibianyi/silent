<template>
  <div id="color-select">
    <span class="label">{{ label }}</span>
    <el-color-picker v-model="innerColor" show-alpha size="medium" :predefine="dColorHistory" @active-change="activeChange" />
  </div>
</template>

<script>
// 颜色选择组件
const NAME = 'color-select'
import { mapGetters, mapActions } from 'vuex'

export default {
  name: NAME,
  props: {
    label: {
      type: String,
      default: ''
    },
    value: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      innerColor: '#000000',
      first: true
    }
  },
  computed: {
    ...mapGetters(['dColorHistory'])
  },
  watch: {
    innerColor(value) {
      if (this.first) {
        this.first = false
        return
      }
      this.$emit('finish', value)
      this.pushColorToHistory(value)
    }
  },
  created() {
    this.first = true
    this.innerColor = this.value
  },
  methods: {
    ...mapActions(['pushColorToHistory']),
    updateValue(value) {
      this.$emit('input', value)
    },
    activeChange(value) {
      this.updateValue(value)
    }
  }
}
</script>

<style lang="scss" scoped>
#color-select {
  display: flex;
  align-items: center;
  .label {
    margin-right: 10px;
  }
}
</style>
