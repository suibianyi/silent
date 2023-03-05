<template>
  <div class="bg">
    <van-nav-bar title="考勤详情" left-text="返回" left-arrow @click-left="onClickLeft" />
    <div class="header">
      <div class="header-image">
        <van-image style="width: 100%;height: 80%;" :src="background" />
      </div>
    </div>
    <div class="body-content">
      <div class="content">
        <div class="top-content">
          <div>
            {{ search.className }}
          </div>
          <div style="margin-top: -10px;font-weight:normal;font-size:20px;">
            {{ search.gradeName }}
          </div>
          <div class="absent-attendance-content">
            <div class="attendance-background" @click="changeAttendacneType('isAll')">
              <van-image style="width: 100%;height: 100%;" :src="attendanceNormal">
                <div style="position: relative;top: -66px; z-index: 999;">
                  应到 {{ search.attendanceCount }}
                </div>
              </van-image>
            </div>
            <div class="absent-background" @click="changeAttendacneType('isAbsent')">
              <van-image style="width: 100%;height: 100%;" :src="attendanceAbsent">
                <div style="position: relative;top: -66px; z-index: 999;">
                  缺卡 {{ search.absentCount }}
                </div>
              </van-image>
            </div>
          </div>
          <!-- 					<div style="margin-top: 24px;">
						<u-line color="grey" />
					</div> -->
          <van-grid :border="false" :column-num="3">
            <van-grid-item @click="changeAttendacneType('isNormal')">
              <div style="margin-top: -17px;">
                {{ search.normalCount }}
              </div>
              <div class="grid-text">正常</div>
            </van-grid-item>
            <van-grid-item @click="changeAttendacneType('isLate')">
              <div style="margin-top: -17px;">
                {{ search.lateCount }}
              </div>
              <div class="grid-text">迟到</div>
            </van-grid-item>
            <van-grid-item @click="changeAttendacneType('isLeave')">
              <div style="margin-top: -17px;">
                {{ search.leaveCount }}
              </div>
              <div class="grid-text">请假</div>
            </van-grid-item>
          </van-grid>
        </div>
      </div>
    </div>
    <div style="margin-top: -50px;">
      <van-pull-refresh v-model="attendance.refreshing" @refresh="onRefresh">
        <van-list
          v-model="attendance.loading"
          :finished="attendance.finished"
          finished-text="没有更多了"
          @load="onLoad()"
        >
          <div class="content">
            <div style="border-radius: 15px;width: 100%;overflow: hidden;background-color: #FFFFFF;">
              <div v-for="(item,index) in classifyList" :key="index" style="width: 100%;">
                <div class="album" @click="click(item)">
                  <div class="album-content">
                    <div class="album-content-flex">
                      <div class="album-left">
                        {{ item.courseName }}
                      </div>
                      <div class="album-right">
                        <div style="color:#DA532C;font-size:27px;">
                          <div v-if="search.isAbsent==true&&item.attendanceStatus==2">
                            缺卡{{ item.absentCount }}
                          </div>
                          <div v-if="search.isAbsent==true&&item.attendanceStatus==1">
                            未打卡{{ item.absentCount }}
                          </div>
                          <div v-if="search.isLate==true">
                            迟到{{ item.lateCount }}
                          </div>
                          <div v-if="search.isLeave==true">
                            请假{{ item.leaveCount }}
                          </div>
                          <div v-if="search.isNormal==true">
                            正常{{ item.normalCount }}
                          </div>
                          <div v-if="search.isAll==true">
                            应到{{ item.attendanceCount }}
                          </div>
                        </div>
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
  </div>
</template>

<script>
import {
  mRequest
} from '@/api/request'

export default {

  data() {
    // 这里存放数据
    return {
      attendance: {
        loading: false,
        finished: false,
        refreshing: false
      },
      background: require('@/assets/mobile/attendance/background.png'),
      attendanceNormal: require('@/assets/mobile/attendance/attendance_normal.jpg'),
      attendanceAbsent: require('@/assets/mobile/attendance/attendance_absent.jpg'),
      // 搜索条件
      search: {
        classId: '',
        className: '',
        gradeName: '',
        personType: '',
        totalCount: 0,
        currentPage: 0,
        pageSize: 5,
        schoolId: '',
        beginTime: '',
        endTime: '',
        courseScheduleId: '',
        isAbsent: true,
        isLate: false,
        isLeave: false,
        isNormal: false,
        isAll: false,
        swipeDate: '',
        lateCount: 0,
        leaveCount: 0,
        normalCount: 0,
        absentCount: 0,
        attendance: 0,
        attendanceCount: 0,
        // beginTime: '',
        // endTime: '',
        basicPersonId: '',
        schoolCode: '',
        attendanceStatus: ''
      },
      classifyList: [],
      scrollTop: 0
    }
  },
  // 监听属性 类似于data概念
  computed: {},
  // 监控data中的数据变化
  mounted() {
    this.search.schoolCode = this.$store.getters.storage.schoolCode
    this.search.basicPersonId = this.$store.getters.storage.userInfo.basicPersonId
    this.search.classId = this.$store.getters.storage.reference.classId
    this.search.className = this.$store.getters.storage.reference.className
    this.search.gradeName = this.$store.getters.storage.reference.gradeName
    this.search.personType = this.$store.getters.storage.reference.personType
    this.search.swipeDate = this.$store.getters.storage.reference.swipeDate
    this.search.courseScheduleId = this.$store.getters.storage.reference.courseScheduleId

    this.search.lateCount = this.$store.getters.storage.reference.lateCount
    this.search.leaveCount = this.$store.getters.storage.reference.leaveCount
    this.search.normalCount = this.$store.getters.storage.reference.normalCount
    this.search.absentCount = this.$store.getters.storage.reference.absentCount
    this.search.attendance = this.$store.getters.storage.reference.attendance
    this.search.beginTime = this.$store.getters.storage.reference.beginTime
    this.search.endTime = this.$store.getters.storage.reference.endTime
    this.search.attendanceCount = this.$store.getters.storage.reference.attendanceCount
    this.search.attendanceStatus = this.$store.getters.storage.reference.attendanceStatus
    console.log('grade的search是', this.search, this.$store.getters.storage)
  },
  methods: {
    onClickLeft() {
      this.$store.commit('SET_ATTENDANCEPAGE', 'course-attendance-class')
    },
    // 条件查询切换考勤状态
    changeAttendacneType(type) {
      this.search.isAll = false
      this.search.isNormal = false
      this.search.isAbsent = false
      this.search.isLate = false
      this.search.isLeave = false
      this.search[type] = true
      this.downCallback()
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
      this.getEventClassifyRecord()
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
    async getEventClassifyRecord() {
      const data = {
        currentPage: this.search.currentPage,
        pageSize: this.search.pageSize,
        schoolId: this.search.schoolId,
        classId: this.search.classId,
        eventName: this.search.eventName,
        personType: this.search.personType,
        swipeDate: this.search.swipeDate,
        userId: this.search.basicPersonId,
        schoolCode: this.search.schoolCode,
        courseScheduleId: this.search.courseScheduleId
        // isAbsent: this.search.isAbsent,
        // isLate: this.search.isLate,
        // isLeave: this.search.isLeave,
      }
      console.log('请求的数据是', data)
      const res = await mRequest({
        url: '/mas/statistics/course/classCourse',
        method: 'post',
        data: data
      })
      this.classifyList = this.classifyList.concat(res.data.qryList)
      this.attendance.loading = false
      const currenSize = this.classifyList.length
      let finished = true
      if (currenSize < res.data.totalCount) {
        finished = false
      }
      this.attendance.finished = finished
    },
    click(item) {
      this.$store.commit('SET_REFERENCE', item)
      this.$store.commit('ADD_PAGE_STORE', { pageStoreName: this.$store.getters.currentPage, pageStoreData: item })
      this.$store.commit('SET_ATTENDANCEPAGE', 'course-attendance-detail')
    }
  }
}
</script>
<style lang='scss' scoped>
	.bg {
		min-height: 100%;
		background-color: #EEEEEE;
		.header {
			height: 300px;
			position: relative;
			/* display: flex;
			flex-direction: column;
			align-items: center; */

			.header-image {
				height: 100%;
				width: 100%;
				position: absolute;
				left: 0px;
				top: 0px;

			}
		}
		.body-content {
			margin-top: -300px;
			position: absolute;
			width: 100%;
		}
		.content {
			padding: 40px 20px 20px 20px;
			display: flex;
			justify-content: space-between;
			flex-wrap: wrap;
		}
		.absent-attendance-content {
			height: 50px;
			display: flex;
			justify-content: space-between;
			flex-wrap: wrap;
			text-align: center;
			line-height: 80px;
			color:#FFFFFF;
			.attendance-background {
				height: 100%;
				width: 48%;

			}
			.absent-background {
				height: 100%;
				width: 48%;

			}
		}
		.grid-text {
			font-weight: normal;
			font-size: 20px;
			margin-top: -17px;
		}
		.top-content {
			height: 220px;
			width: 100%;
			font-weight: 400;
			line-height: 45px;
			font-size: 28px;
			overflow: hidden;
			white-space: nowrap;
			text-overflow: ellipsis;
			background-color: #FFFFFF;
			border-radius: 15px;
			padding: 20px;
		}
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
</style>
