<template>
  <div class="bg">
    <van-nav-bar title="考情详情" left-text="返回" left-arrow @click-left="onClickLeft" />
    <van-pull-refresh v-model="attendance.refreshing" @refresh="onRefresh">
      <van-list
        v-model="attendance.loading"
        :finished="attendance.finished"
        finished-text="没有更多了"
        @load="onLoad"
      >
        <div class="content">
          <div v-for="(item,index) in statisticsList" :key="index" style="width: 100%;margin-bottom: 30px;">
            <div class="album" @click="click(item)">
              <div class="album-content">
                <div class="album-content-flex">
                  <div class="album-left">
                    <div style=";margin-top: 10px;">
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
  </div>
</template>
<script>
import {
  mRequest
} from '@/api/request'
// import moment from 'moment'
// import { getCourseClassPage } from '@/api/attendance.js'
import { adminAttendanceClassImages } from '@/assets/mobile/class-style/admin-attendance-class.js'
// import { adminAttendanceClassImages } from '../../static/base64-images/admin-attendance-class/admin-attendance-class.js'
export default {

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
        totalCount: 0,
        currentPage: 0,
        pageSize: 5,
        gradeId: '',
        gradeName: '',
        schoolId: '',
        basicPersonId: '',
        schoolCode: '',
        isAbsent: false,
        isLate: false,
        isLeave: false
      },
      scrollTop: 0,
      statisticsList: [],
      adminAttendanceClassImages: adminAttendanceClassImages
    }
  },
  // 监听属性 类似于data概念
  computed: {},
  // 监控data中的数据变化
  mounted() {
    this.search.schoolCode = this.$store.getters.storage.schoolCode
    this.search.basicPersonId = this.$store.getters.storage.userInfo.basicPersonId
    this.search.gradeId = this.$store.getters.storage.reference.gradeId
    this.search.gradeName = this.$store.getters.storage.reference.gradeName
    this.search.personType = this.$store.getters.storage.reference.personType
    this.search.swipeDate = this.$store.getters.storage.reference.swipeDate
    this.search.lateCount = this.$store.getters.storage.reference.lateCount
    this.search.leaveCount = this.$store.getters.storage.reference.leaveCount
    this.search.normalCount = this.$store.getters.storage.reference.normalCount
    this.search.absentCount = this.$store.getters.storage.reference.absentCount
    this.search.attendance = this.$store.getters.storage.reference.attendance
    this.search.attendanceCount = this.$store.getters.storage.reference.attendanceCount
    console.log('grade的search是', this.search, this.$store.getters.storage)
  },
  // 方法集合
  methods: {
    onClickLeft() {
      this.$store.commit('SET_ATTENDANCEPAGE', 'course-attendance-grade')
    },
    // 分页获取用户到离校考勤记录
    async getEventStatisticsRecord() {
      const data = {
        currentPage: this.search.currentPage,
        pageSize: this.search.pageSize,
        schoolId: this.search.schoolId,
        gradeId: this.search.gradeId,
        isAbsent: this.search.isAbsent,
        isLate: this.search.isLate,
        isLeave: this.search.isLeave,
        userId: this.search.basicPersonId,
        swipeDate: this.search.swipeDate,
        schoolCode: this.search.schoolCode
      }
      console.log('请求的数据是', data)
      const res = await mRequest({
        url: '/mas/statistics/course/class',
        method: 'post',
        data: data
      })
      console.log('请求回来的res是', res)
      this.statisticsList = this.statisticsList.concat(res.data.qryList)
      const currenSize = this.statisticsList.length
      this.attendance.loading = false
      let finished = true
      if (currenSize < res.data.totalCount) {
        finished = false
      }
      this.attendance.finished = finished
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
    click(item) {
      this.$store.commit('SET_REFERENCE', item)
      this.$store.commit('SET_ATTENDANCEPAGE', 'course-attendance-course')
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
