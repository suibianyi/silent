<template>
  <div class="bg">
    <van-nav-bar title="考情详情" left-text="返回" left-arrow @click-left="onClickLeft" />
    <div :style="search.type==='day'?'':'display:none'" class="time">
      <div class="time-select">
        <van-image style="height: 40px;width: 40px;" :src="adminAttendanceClassImages.left" @click="timeSubtract()" />
        <div v-show="searchDayTime===''" @click="calendarShow=true">
          {{ year }}年{{ month }}月{{ day }}日
        </div>
        <div v-show="searchDayTime!==''" @click="calendarShow=true">
          {{ searchDayTime }}
        </div>
        <van-image style="height: 40px;width: 40px;" :src="adminAttendanceClassImages.right" @click="timeAdd()" />
      </div>
    </div>
    <van-pull-refresh v-model="attendance.refreshing" @refresh="onRefresh">
      <van-list
        v-model="attendance.loading"
        :finished="attendance.finished"
        finished-text="没有更多了"
        @load="onLoad()"
      >
        <div class="content">
          <div v-for="(item,index) in statisticsList" :key="index" style="width: 100%;margin-bottom: 30px;">
            <div class="album" @click="click(item)">
              <div class="album-content">
                <div class="album-content-flex">
                  <div class="album-left">
                    <div v-if="gradeFlag==true" style=";margin-top: 10px;">
                      {{ item.gradeName }}
                    </div>
                    <div v-if="gradeFlag==false" style=";margin-top: 10px;">
                      {{ item.className }}
                    </div>
                  <!-- 									<div style="margin-top: -20px;font-weight:normal;font-size:20px;">
										{{item.beginTime}}-{{item.endTime}}
									</div> -->
                  </div>
                  <div class="album-right">
                    <div style="color:#669FE1;font-weight:400;font-size:30px;">
                      {{ item.absentCount }}
                    </div>
                    <div style="margin-top: -20px;font-weight:normal;font-size:16px;">
                      缺卡
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </van-list>
    </van-pull-refresh>
    <van-calendar v-model="calendarShow" :close-on-popstate="false" @confirm="calendarConfirm" @close="calendarCancel" />
  </div>
</template>
<script>
import moment from 'moment'
import {
  mRequest
} from '@/api/request'
import { adminAttendanceClassImages } from '@/assets/mobile/class-style/admin-attendance-class.js'
export default { // 使用mixin (在main.js注册全局组件)

  data() {
    // 这里存放数据
    return {
      attendance: {
        loading: false,
        finished: false,
        refreshing: false
      },
      // 搜索条件
      search: {
        type: 'day',
        attendanceType: '1',
        totalCount: 0,
        currentPage: 0,
        pageSize: 5,
        schoolId: '',
        beginTime: '',
        endTime: '',
        basicPersonId: '',
        schoolCode: '',
        isAbsent: false,
        isLate: false,
        isLeave: false
      },
      gradeFlag: true,
      scrollTop: 0,
      statisticsList: [],
      // 日历表
      calendarShow: false,
      // 时间
      year: '',
      year1: '',
      month: '',
      month1: '',
      day: '',
      searchDayTime: '',
      // 图片
      adminAttendanceClassImages: adminAttendanceClassImages
    }
  },
  // 监听属性 类似于data概念
  computed: {},
  // 监控data中的数据变化
  mounted() {
    // 初始化时间
    this.initTime()
    this.search.schoolCode = this.$store.getters.storage.schoolCode
    this.search.basicPersonId = this.$store.getters.storage.userInfo.basicPersonId
    console.log('grade的search是', this.search, this.$store.getters.storage)
  },
  // 方法集合
  methods: {
    onClickLeft() {
      this.$store.dispatch('backNav')
    },
    onLoad() {
      if (this.attendance.refreshing) {
        this.statisticsList = []
        this.search.currentPage = 0
        this.attendance.refreshing = false
      }
      console.log('开始请求数据', this.attendance)
      this.search.currentPage = this.search.currentPage + 1 // 页码, 默认从1开始
      // this.search.limit = 10 // 页长, 默认每页10条
      this.getEventStatisticsRecord()
    },
    onRefresh() {
      // 清空列表数据
      this.attendance.refreshing = true
      this.attendance.finished = false
      // 重新加载数据
      // 将 loading 设置为 true，表示处于加载状态
      this.attendance.loading = true
      this.onLoad()
    },
    // 分页获取用户到离校考勤记录
    async getEventStatisticsRecord() {
      const data = {
        currentPage: this.search.currentPage,
        pageSize: this.search.pageSize,
        schoolId: this.search.schoolId,
        classId: this.search.classId,
        beginTime: this.search.beginTime,
        endTime: this.search.endTime,
        isAbsent: this.search.isAbsent,
        isLate: this.search.isLate,
        isLeave: this.search.isLeave,
        userId: this.search.basicPersonId,
        schoolCode: this.search.schoolCode
      }
      console.log('请求的数据是', data)
      const res = await mRequest({
        url: '/mas/statistics/course/gradeClass',
        method: 'post',
        data: data
      })
      console.log('请求回来的res是', res)
      if (res.data.classList.length > 0) {
        this.statisticsList = this.statisticsList.concat(res.data.classList)
        this.gradeFlag = false
      } else if (res.data.gradeList.length > 0) {
        this.statisticsList = this.statisticsList.concat(res.data.gradeList)
        this.gradeFlag = true
      }
      this.attendance.loading = false
      const currenSize = this.statisticsList.length
      let finished = true
      if (currenSize < res.data.totalCount) {
        finished = false
      }
      this.attendance.finished = finished
    },
    /* 下拉刷新的回调 */
    async downCallback() {
      // 重新赋值加载
      this.statisticsList = []
      await this.getEventStatisticsRecord()
    },
    /* 上拉加载的回调: 其中page.num:当前页 从1开始, page.size:每页数据条数,默认10 */
    async upCallback(page) {
      this.search.currentPage = page.num // 页码, 默认从1开始
      this.search.limit = page.size // 页长, 默认每页10条
      await this.getEventStatisticsRecord()
      console.log('初始化:', this.albums)
    },
    initTime() {
      this.year = new Date().getFullYear()
      this.month = new Date().getMonth() + 1 < 10 ? '0' + (new Date().getMonth() + 1) : new Date().getMonth() + 1
      this.day = new Date().getDate() < 10 ? '0' + new Date().getDate() : new Date().getDate()
      // 初始化
      this.search.beginTime = this.year + '-' + this.month + '-' + this.day + ' ' + '00:00:00'
      this.search.endTime = this.year + '-' + this.month + '-' + this.day + ' ' + '23:59:59'
      this.year1 = this.year
      this.month1 = this.month
      console.log(this.search)
    },
    async timeAdd() {
      this.searchDayTime = ''
      const computedDate = moment(this.search.beginTime).add(1, 'days')
      this.year = computedDate.format('YYYY')
      this.month = computedDate.format('MM')
      this.day = computedDate.format('DD')
      this.search.beginTime = this.year + '-' + this.month + '-' + this.day + ' ' + '00:00:00'
      this.search.endTime = this.year + '-' + this.month + '-' + this.day + ' ' + '23:59:59'
      this.onRefresh()
    },
    async timeSubtract() {
      this.searchDayTime = ''
      const computedDate = moment(this.search.beginTime).subtract(1, 'days')
      this.year = computedDate.format('YYYY')
      this.month = computedDate.format('MM')
      this.day = computedDate.format('DD')
      this.search.beginTime = this.year + '-' + this.month + '-' + this.day + ' ' + '00:00:00'
      this.search.endTime = this.year + '-' + this.month + '-' + this.day + ' ' + '23:59:59'
      this.onRefresh()
    },
    calendarCancel() {
      this.calendarShow = false
    },
    async calendarConfirm(res) {
      console.log(res)
      this.searchDayTime = `${res.getFullYear()}年${res.getMonth() + 1}月${res.getDate()}日`
      this.calendarShow = false
      this.search.beginTime = `${res.getFullYear()}-${res.getMonth() + 1}-${res.getDate()}` + ' ' + '00:00:00'
      this.search.endTime = `${res.getFullYear()}-${res.getMonth() + 1}-${res.getDate()}` + ' ' + '23:59:59'
      // 获取考勤数据
      this.onRefresh()
      // await this.getEventStatisticsRecord()
    },
    click(item) {
      if (this.gradeFlag === true) {
        this.$store.commit('SET_REFERENCE', item)
        this.$store.commit('SET_ATTENDANCEPAGE', 'course-attendance-class')
      }
      if (this.gradeFlag === false) {
        this.$store.commit('SET_REFERENCE', item)
        this.$store.commit('SET_ATTENDANCEPAGE', 'course-attendance-course')
      }
    }
  }
}
</script>
<style lang='scss' scoped>
	//@import url(); 引入公共css类
	.bg {
		min-height: 100%;
		background-color: #EEEEEE;
		.content {
			padding: 20px;
			display: flex;
			justify-content: space-between;
			flex-wrap: wrap;
			.album {
				background-color: #FFFFFF;
				border-radius: 15px;
				padding: 15px;
			}
			.album-content {
				height: 60px;
				width: 100%;
				font-weight: 400;
				line-height: 45px;
				font-size: 25px;
				overflow: hidden;
				white-space: nowrap;
				text-overflow: ellipsis;
			}
			.album-content-flex {
				display: flex;
				justify-content: space-between;
				flex-wrap: wrap;
			}
			.album-right {
				text-align: center;
			}
		}
		.time{
			height: 60px;
			background-color: #FFFFFF;
			display: flex;
			color: #000000;
			justify-content: center;
			align-items: center;
			font-weight: 400;
			font-size: 26px;
			border-bottom: 1px #EEEEEE solid;
			.time-select{
				padding: 0 10px ;
				display: flex;
				flex: 1;
				height: 100%;
				justify-content: space-between;
				align-items: center;
			}
		}
	}
</style>
