<template>
  <div class="form-picker">
    <van-popup v-model="showPicker" position="bottom">
      <van-picker
        show-toolbar
        :columns="columns"
        @confirm="onConfirm"
        @cancel="showPicker = false"
      />
    </van-popup>
  </div>
</template>

<script>
export default {
  props: {
    show: {
      type: Boolean,
      default: false
    },
    flag: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      showPicker: false,
      showCalendar: false
    }
  },
  computed: {
  },
  watch: {
    show(newV) {
      console.log('12354674884798465413132146598789', newV)
      // 每次出现都应该重新初始化
      if (newV) {
        this.showPicker = newV
      } else {
        this.showPicker = false
      }
    }
  },
  mounted() {
  },
  methods: {
    formatDate(date) {
      return `${date.getMonth() + 1}/${date.getDate()}`
    },
    close() {
      this.$emit('form-close', this.flag)
      this.showCalendar = false
    },
    onConfirm(date) {
    //   this.$emit('form-close')
      this.showPicker = true
      this.$emit('form-value', this.formatDate(date))
    },
    onTimeConfirm() {
      this.showPicker = false
      this.$emit('form-close', this.flag)
    }
  }

}
</script>

<style lang='scss' scoped>
.form-picker {
    padding: 0px 0px 0px 0px;
}
</style>
