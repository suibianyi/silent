<template>
  <div class="form-calendar">
    <van-calendar v-model="showCalendar" :close-on-popstate="false" @confirm="onConfirm" @close="close" @select="selectCalendar" />
    <van-popup v-model="showPicker" position="bottom">
      <van-datetime-picker
        v-if="type!='YYYY-MM-DD'"
        type="time"
        @confirm="onTimeConfirm"
        @cancel="showPicker = false"
      />
    </van-popup>
  </div>
</template>

<script>
import moment from 'moment'
export default {
  props: {
    show: {
      type: Boolean,
      default: false
    },
    flag: {
      type: Number,
      default: 0
    },
    type: {
      type: String,
      default: 'YYYY-MM-DD'
    }
  },
  data() {
    return {
      showPicker: false,
      showCalendar: false,
      dataPickerType: 'datetime',
      tempDate: '',
      minDate: new Date(2000, 0, 1),
      maxDate: new Date(2050, 0, 31)
    }
  },
  computed: {
  },
  watch: {
    show(newV) {
      // 每次出现都应该重新初始化
      if (newV) {
        this.showCalendar = newV
      } else {
        this.showCalendar = false
      }
    },
    type(newT) {
    //   if (newT === 'YYYY-MM-DD HH:mm:ss') {
    //     this.dataPickerType = 'datetime'
    //   }
      if (newT === 'YYYY-MM-DD HH:mm') {
        this.dataPickerType = 'datetime'
      }
    }
  },
  mounted() {
  },
  methods: {
    formatDate(date) {
      if (this.type === 'YYYY-MM-DD HH:mm') {
        this.tempDate = date
      }
      console.log('选择的日期是', `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`)
      return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`
    },
    formatTime(date) {
      console.log('选择的时间是', `${date}`)
      return `${this.tempDate.getFullYear()}/${this.tempDate.getMonth() + 1}/${this.tempDate.getDate()} ${date}:00`
    },
    close() {
      this.$emit('form-close', this.flag)
      this.showCalendar = false
    },
    onConfirm(date) {
      this.formatDate(date)
      if (this.type === 'YYYY-MM-DD') {
        this.$emit('form-close')
        this.$emit('form-value', { text: this.formatDate(date), flag: this.flag, value: moment(this.formatDate(date)).format('x') })
      }
      if (this.type === 'YYYY-MM-DD HH:mm') {
        this.showPicker = true
      }
    },
    onTimeConfirm(date) {
      this.showPicker = false
      this.formatTime(date)
      this.$emit('form-value', { text: this.formatTime(date), flag: this.flag, value: moment(this.formatTime(date)).format('x') })
      this.$emit('form-close', this.flag)
    },
    selectCalendar(date) {
      this.formatDate(date)
      if (this.type === 'YYYY-MM-DD HH:mm') {
        this.showPicker = true
      }
    }
  }

}
</script>

<style lang='scss' scoped>
.form-calendar {
    padding: 0px 0px 0px 0px;
}
</style>
