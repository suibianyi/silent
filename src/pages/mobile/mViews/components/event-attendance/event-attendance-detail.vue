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
            <div v-if="search.className">
              {{ search.className }}
            </div>
            <div v-if="search.groupName">
              {{ search.groupName }}
            </div>
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
                <div v-if="search.attendanceShow==2" style="position: relative;top: -66px; z-index: 999;">
                  缺卡 {{ search.absentCount }}
                </div>
                <div v-if="search.attendanceShow==1" style="position: relative;top: -66px;z-index: 999;">
                  未打卡 {{ search.absentCount }}
                </div>
              </van-image>
            </div>
          </div>
          <!-- 					<div style="margin-top: 24px;">
						<u-line color="grey" />
					</div> -->
          <van-grid style="margin-top: 10px;" :border="false" :column-num="3">
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
                <div class="album">
                  <div class="album-content">
                    <div class="album-content-flex">
                      <div class="album-left">
                        <div>
                          {{ item.name }}
                        </div>
                      </div>
                      <div class="album-right">
                        <div style="color:#DA532C;font-size:32px;" @click="changeStatus(item)">
                          <div v-if="item.attendStatus=='absent' && search.attendanceShow==2">
                            缺卡
                          </div>
                          <div v-if="item.attendStatus=='absent' && search.attendanceShow==1" style="color:#a0a0a0;font-size:32px;">
                            -
                          </div>
                          <div v-if="item.attendStatus=='leave'" style="color:#a0a0a0;font-size:32px;">
                            请假
                          </div>
                          <div v-if="item.attendStatus=='late'" style="color:#a0a0a0;font-size:32px;">
                            {{ item.checkTime||'' }} 迟到
                          </div>
                          <div v-if="item.attendStatus=='normal'" style="color:#a0a0a0;font-size:32px;">
                            {{ item.checkTime||'' }} 正常
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
    <u-action-sheet v-model="showStatus" :actions="statusList" @select="chooseStatus" />
  </div>
</template>

<script>
import {
  mRequest
} from '@/api/request'
// import {
//   getImageDownloadUrl
// } from '@/utils/common.js'
// import { getEventDetailClass, changeStatus } from '@/api/attendance.js'
export default {
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
        classId: '',
        className: '',
        groupName: '',
        groupType: '',
        eventId: '',
        eventName: '',
        personType: '',
        totalCount: 0,
        currentPage: 0,
        pageSize: 5,
        schoolId: '',
        beginTime: '',
        endTime: '',
        isAbsent: false,
        isLate: false,
        isLeave: false,
        attendanceStatus: '',
        swipeDate: '',
        lateCount: 0,
        leaveCount: 0,
        normalCount: 0,
        absentCount: 0,
        attendance: 0,
        attendanceCount: 0,
        basicPersonId: '',
        schoolCode: '',
        attendanceShow: ''
      },
      classifyList: [],
      showStatus: false,
      changeItem: {},
      statusList: [{
        name: '缺卡',
        value: 'absent'
      }, {
        name: '迟到',
        value: 'late'
      }, {
        name: '请假',
        value: 'leave'
      }, {
        name: '正常',
        value: 'normal'
      }]
    }
  },
  // 监听属性 类似于data概念
  computed: {},
  // 监控data中的数据变化

  mounted() {
    this.search.schoolCode = this.$store.getters.storage.schoolCode
    this.search.basicPersonId = this.$store.getters.storage.userInfo.basicPersonId
    this.search.eventId = this.$store.getters.storage.reference.eventId
    this.search.eventName = this.$store.getters.storage.reference.eventName
    this.search.classId = this.$store.getters.storage.reference.classId
    this.search.className = this.$store.getters.storage.reference.className
    this.search.groupName = this.$store.getters.storage.reference.groupName
    this.search.groupType = this.$store.getters.storage.reference.groupType
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
    this.search.attendanceShow = this.$store.getters.storage.reference.attendanceStatus
    console.log('grade的search是', this.search, this.$store.getters.storage)
  },
  methods: {
    onClickLeft() {
      this.$store.commit('SET_ATTENDANCEPAGE', 'event-attendance-classify')
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
    changeStatus(item) {
      if (this.search.attendanceShow === 2) {
        this.showStatus = true
        this.changeItem = item
      }
    },
    async chooseStatus(index) {
      const data = {
        schoolCode: this.search.schoolCode,
        searchType: 0,
        id: this.changeItem.id,
        attendStatus: index.value
      }
      console.log('上报的数据是', data)
      await mRequest({
        url: '/mas/attendance/web/mergeRecordAttendanceStatus',
        method: 'post',
        data: data
      })
      this.$toast('修改成功')
      // await changeStatus(data)
      // uni.showToast({
      //   title: '修改成功',
      //   icon: 'none'
      // })
      this.showStatus = false
      this.onRefresh()
    },
    // 条件查询切换考勤状态
    changeAttendacneType(type) {
      this.search.isAll = false
      this.search.isNormal = false
      this.search.isAbsent = false
      this.search.isLate = false
      this.search.isLeave = false
      this.search[type] = true
      if (type === 'isLeave') {
        this.search.attendanceStatus = 'leave'
      }
      if (type === 'isAll') {
        this.search.attendanceStatus = ''
      }
      if (type === 'isNormal') {
        this.search.attendanceStatus = 'normal'
      }
      if (type === 'isLate') {
        this.search.attendanceStatus = 'late'
      }
      if (type === 'isAbsent') {
        this.search.attendanceStatus = 'absent'
      }
      this.onRefresh()
    },
    // 分页获取用户到离校考勤记录
    async getEventClassifyRecord() {
      const data = {
        currentPage: this.search.currentPage,
        pageSize: this.search.pageSize,
        schoolId: this.search.schoolId,
        eventId: this.search.eventId,
        eventName: this.search.eventName,
        classId: this.search.classId,
        className: this.search.className,
        groupName: this.search.groupName,
        personType: this.search.personType,
        isAbsent: this.search.isAbsent,
        isLate: this.search.isLate,
        isLeave: this.search.isLeave,
        groupType: this.search.groupType,
        attendStatus: this.search.attendanceStatus,
        swipeDate: this.search.swipeDate,
        isPage: 1,
        userId: this.search.basicPersonId,
        schoolCode: this.search.schoolCode

      }
      console.log('请求的数据是', data)
      const res = await mRequest({
        url: '/mas/statistics/event/classPersonRecord',
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
      // return getEventDetailClass(data)
      //   .then((res) => {
      //     console.log('请求回来的数据是', res)
      //     this.classifyList = this.classifyList.concat(res.data.qryList)
      //     const currenSize = this.classifyList.length
      //     let hasNext = false
      //     if (currenSize < res.data.totalCount) {
      //       hasNext = true
      //     }
      //     this.mescroll.endSuccess(currenSize, hasNext)
      //     this.refreshShow = false
      //   }).catch((e) => {
      //     if (this.statisticsList.length === 0) {
      //       this.refreshShow = true
      //     }
      //     this.mescroll.endErr()
      //   })
    },
    mescrollInit(mescroll) {
      this.mescroll = mescroll
    },
    /* 下拉刷新的回调 */
    async downCallback() {
      // 重新赋值加载
      this.classifyList = []
      await this.getEventClassifyRecord()
    },
    /* 上拉加载的回调: 其中page.num:当前页 从1开始, page.size:每页数据条数,默认10 */
    async upCallback(page) {
      this.search.currentPage = page.num // 页码, 默认从1开始
      this.search.limit = page.size // 页长, 默认每页10条
      await this.getEventClassifyRecord()
    }
  }
}
</script>
<style lang='scss' scoped>
	//@import url(); 引入公共css类
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
			height: 230px;
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
			padding: 20px;
			border-bottom:1px solid #EEEEEE
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
