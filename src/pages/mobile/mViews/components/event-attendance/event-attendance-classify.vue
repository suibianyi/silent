<template>
  <div class="bg">
    <van-nav-bar title="考情详情" left-text="返回" left-arrow @click-left="onClickLeft" />
    <div class="header">
      <div class="header-image">
        <van-image style="width: 100%;height: 80%;" :src="background" />
      </div>
    </div>
    <div class="body-content">
      <div class="content">
        <div class="top-content">
          <div>
            {{ search.eventName }}
          </div>
          <div style="margin-top: -10px;font-weight:normal;font-size:20px;">
            {{ search.beginTime }}-{{ search.endTime }}
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
                <div v-if="search.attendanceStatus==2" style="position: relative;top: -66px; z-index: 999;">
                  缺卡 {{ search.absentCount }}
                </div>
                <div v-if="search.attendanceStatus==1" style="position: relative;top: -66px;z-index: 999;">
                  未打卡 {{ search.absentCount }}
                </div>
              </van-image>
            </div>
          </div>
          <!-- 					<div style="margin-top: 24px;">
						<u-line color="grey" />
					</div> -->
          <van-grid :border="false" :column-num="3">
            <van-grid-item @click="changeAttendacneType('isNormal')">
              <div style="margin-top: -24px;">
                {{ search.normalCount }}
              </div>
              <div class="grid-text">正常</div>
            </van-grid-item>
            <van-grid-item @click="changeAttendacneType('isLate')">
              <div style="margin-top: -24px;">
                {{ search.lateCount }}
              </div>
              <div class="grid-text">迟到</div>
            </van-grid-item>
            <van-grid-item @click="changeAttendacneType('isLeave')">
              <div style="margin-top: -24px;">
                {{ search.leaveCount }}
              </div>
              <div class="grid-text">请假</div>
            </van-grid-item>
          </van-grid>
        </div>
      </div>
    </div>
    <div style="margin-top: -50px;">
      <van-pull-refresh v-model="attendanced.refreshing" @refresh="onRefresh">
        <van-list
          v-model="attendanced.loading"
          :finished="attendanced.finished"
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
                        <div v-if="item.className">
                          {{ item.className }}
                        </div>
                        <div v-if="item.groupName">
                          {{ item.groupName }}
                        </div>
                      </div>
                      <div class="album-right">
                        <div style="color:#DA532C;font-size:32px;">
                          <div v-if="search.isAbsent==true&&search.attendanceStatus==2">
                            缺卡{{ item.absentCount }}
                          </div>
                          <div v-if="search.isAbsent==true&&search.attendanceStatus==1">
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
// import {
//   getImageDownloadUrl
// } from '@/utils/common.js'
// import { getEventClassifyGroup, getEventClassifyClass } from '@/api/attendance.js'
// import mescrollMixin from '@/components/mescroll-uni/mescroll-mixins.js' // Mescroll下拉刷新功能需要的js
export default {
  // import引入的组件需要注入到对象中才能使
  data() {
    // 这里存放数据
    return {
      attendanced: {
        loading: false,
        finished: false,
        refreshing: false
      },
      background: require('@/assets/mobile/attendance/background.png'),
      attendanceNormal: require('@/assets/mobile/attendance/attendance_normal.jpg'),
      attendanceAbsent: require('@/assets/mobile/attendance/attendance_absent.jpg'),
      // 搜索条件
      search: {
        eventId: '',
        eventName: '',
        personType: '',
        totalCount: 0,
        currentPage: 0,
        pageSize: 5,
        schoolId: '',
        beginTime: '',
        endTime: '',
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
        basicPersonId: '',
        schoolCode: '',
        attendanceStatus: ''
      },
      classifyList: [],
      downOption: {
        auto: false // 是否在初始化后,自动执行downCallback; 默认true
      },
      upOption: {
        auto: false, // 是否在初始化后,自动执行upCallback; 默认true，
        textNoMore: '暂无更多数据'
      },
      // 异常页面提示
      refreshShow: false,
      scrollTop: 0
    }
  },
  // 监听属性 类似于data概念
  computed: {},
  mounted() {
    this.search.schoolCode = this.$store.getters.storage.schoolCode
    this.search.basicPersonId = this.$store.getters.storage.userInfo.basicPersonId
    this.search.eventId = this.$store.getters.storage.reference.eventId
    this.search.eventName = this.$store.getters.storage.reference.eventName
    this.search.personType = this.$store.getters.storage.reference.personType
    this.search.swipeDate = this.$store.getters.storage.reference.swipeDate

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
    // await this.getEventClassifyRecord()
    // this.downCallback()
  },
  methods: {
    onClickLeft() {
      this.$store.commit('SET_ATTENDANCEPAGE', 'event-attendance-statistics')
    },
    onLoad() {
      if (this.attendanced.refreshing) {
        this.statisticsList = []
        this.search.currentPage = 0
        this.attendanced.refreshing = false
      }
      console.log('开始请求数据', this.attendanced)
      this.search.currentPage = this.search.currentPage + 1 // 页码, 默认从1开始
      this.getEventClassifyRecord()
    },
    onRefresh() {
      // 清空列表数据
      this.attendanced.refreshing = true
      this.attendanced.finished = false
      // 重新加载数据
      // 将 loading 设置为 true，表示处于加载状态
      this.attendanced.loading = true
      this.onLoad()
    },
    // 条件查询切换考勤状态
    changeAttendacneType(type) {
      this.search.isAll = false
      this.search.isNormal = false
      this.search.isAbsent = false
      this.search.isLate = false
      this.search.isLeave = false
      this.search[type] = true
      // this.downCallback()
    },
    // 分页获取用户到离校考勤记录
    async getEventClassifyRecord() {
      const data = {
        currentPage: this.search.currentPage,
        pageSize: this.search.pageSize,
        schoolId: this.search.schoolId,
        eventId: this.search.eventId,
        eventName: this.search.eventName,
        personType: this.search.personType,
        swipeDate: this.search.swipeDate,
        userId: this.search.basicPersonId,
        schoolCode: this.search.schoolCode

      }
      console.log('请求的数据是', data)
      if (this.search.personType === 0) {
        const res = await mRequest({
          url: '/mas/statistics/event/groupRecord',
          method: 'post',
          data: data
        })
        this.classifyList = this.classifyList.concat(res.data.qryList)
        const currenSize = this.classifyList.length
        this.attendanced.loading = false
        let finished = true
        if (currenSize < res.data.totalCount) {
          finished = false
        }
        this.attendanced.finished = finished
      } else if (this.search.personType === 1) {
        const res = await mRequest({
          url: '/mas/statistics/event/classRecord',
          method: 'post',
          data: data
        })
        this.classifyList = this.classifyList.concat(res.data.qryList)
        const currenSize = this.classifyList.length
        this.attendanced.loading = false
        let finished = true
        if (currenSize < res.data.totalCount) {
          finished = false
        }
        this.attendanced.finished = finished
      }
    },
    click(item) {
      item.beginTime = this.search.beginTime
      item.endTime = this.search.endTime
      item.attendanceStatus = this.search.attendanceStatus
      this.$store.commit('SET_REFERENCE', item)
      this.$store.commit('SET_ATTENDANCEPAGE', 'event-attendance-detail')
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
			border-bottom:1px solid #EEEEEE;
			padding: 20px;
		}
		.album-content {
			height: 60px;
			width: 100%;
			line-height: 60px;
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
