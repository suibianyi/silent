<template>
  <div class="dynamic-title-config">
    <van-popup v-model="showPopup" :round="true" :style="{ width: '90%', height: '80%' }" @close="closePopup">
      <div class="form">
        显示页面设置
        <van-field v-model="attendanceShow" label="进入页面" placeholder="请选择跳转页面" readonly @click="clickPage(index)" />
        <div style="margin: 16px;">
          <van-button round block type="info" native-type="submit" @click="confirm">确定</van-button>
        </div>
      </div>
    </van-popup>
    <van-action-sheet
      v-model="actionSheet.show"
      :actions="actionSheet.actions"
      :cancel-text="actionSheet.cancelText"
      :description="actionSheet.description"
      close-on-click-action
      @select="actionSheetSelect"
    />
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
    },
    configIndex: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      showPopup: false,
      attendance: {
        firstPage: ''
      },
      attendanceShow: '',
      actionSheet: {
        show: false,
        actions: [{
          value: 'course-attendance-grade',
          name: '考勤管理-课堂考勤'
        }, {
          value: 'class-course-attendance',
          name: '课程考勤'
        }, {
          value: 'user-course-attendance',
          name: '家长学生查看课程考勤'
        }]
      },
      chooseNextPage: false
    }
  },
  computed: {
  },
  watch: {
    show: {
      handler(newVal) {
        this.showPopup = newVal
      },
      deep: true,
      immediate: true
    },
    configIndex: {
      handler(newVal) {
        if (this.$store.getters.pageList[this.$store.getters.currentPage].componentList[newVal].attendance) {
          this.attendance = this.$store.getters.pageList[this.$store.getters.currentPage].componentList[newVal].attendance
          if (this.attendance.firstPage === 'course-attendance-grade') {
            this.attendanceShow = '考勤管理-课堂考勤'
          }
          if (this.attendance.firstPage === 'class-course-attendance') {
            this.attendanceShow = '课程考勤'
          }
        }
      },
      deep: true,
      immediate: true
    }
  },
  mounted() {
    console.log('show', this.show)
  },
  methods: {
    clickPage(index) {
      this.actionSheet.show = true
    },
    actionSheetSelect(value) {
      this.attendance.firstPage = value.value
      this.attendanceShow = value.name
    },
    confirm() {
      this.$store.dispatch('editComponent', { index: this.configIndex, pageListName: this.$store.getters.currentPage, key: 'attendance', value: this.attendance })
      this.$emit('on-close')
    }
  }

}
</script>

<style lang='scss' scoped>
.dynamic-title-config {
    padding: 10px 10px 0px 10px;
    .form {
      margin: 20px;
      .delete-button {
       height: 100%;
      }
    }
}
</style>
