<template>
  <div class="examine-page">
    <van-nav-bar title="老师审核" left-text="返回" left-arrow @click-left="onClickLeft" />
    <van-list
      v-if="lists.length"
      v-model="loading"
      :finished="finished"
    >
      <van-cell
        v-for="list in lists"
        :key="`${list.personId}${list.studentNo}${list.telephone}`"
        is-link center
        :label="`学号: ${list.studentNo}`"
        :value="`电话: ${list.telephone}`"
        @click="handlerClick(list)"
      >
        <template #title>
          <span class="custom-title">{{ `${list.studentName}${list.parentTitle}` }}</span>
          <van-tag type="danger">未审核</van-tag>
        </template>
        <!-- <template #right-icon>
          <van-icon name="records" size="20" class="search-icon" />
        </template> -->
      </van-cell>
    </van-list>
    <van-empty v-else description="暂无数据" />
  </div>
</template>

<script>

// import { map } from 'lodash'
import {
  mRequest
} from '@/api/request'
import {
  getExamineList,
  updExamineList
} from '@/api/examine'
export default {
  data() {
    return {
      cellList: [],
      userInfo: this.$store.state.storage.userInfo,
      lists: [],
      loading: false,
      finished: true,
      currentPage: 1,
      pageSize: 10
    }
  },
  // computed: {
  //   cellList() {
  //     console.log('cellList是', this.$store.getters.cellList)
  //     return this.$store.getters.cellList
  //   }
  // },
  async mounted() {
    console.log('这里存的东西是', this.$store.getters.storage)
    await this.getExamineList()
    this.getStudentUnread()
    // this.cellList = this.$store.getters.storage.children
  },
  methods: {
    onClickLeft() {
      this.$store.dispatch('backNav')
    },
    handlerClick(item) {
      console.log('点击', item)
      this.$dialog.confirm({
        title: '审核',
        message: `是否同意${item.studentName}${item.parentTitle}注册~`
      })
        .then(async() => {
          // todo 同意接口
          await this.updExamineList(item)
          console.log('同意')
        })
        .catch(() => {
          console.log('取消~')
        })
    },
    switchCell(s) {
      const data = {
        sid: s.personNo,
        studentId: s._id,
        orgClassId: s.orgClassId,
        orgClassName: s.orgClassName,
        schoolCode: this.$store.getters.storage.schoolCode,
        userType: this.$store.getters.storage.type,
        account: this.$store.getters.storage.userInfo.telephone,
        sName: s.trueName
        // classId: s.orgClassName
      }
      this.$store.commit('SET_CHATSTUDENT', data)
      this.$store.commit('SET_CHATPAGE', 'chat')
    },
    async getExamineList() {
      const { storage } = this.$store.getters
      const { userInfo } = storage
      const opts = {
        parentStatus: 'noApprove',
        personNo: userInfo.account,
        schoolCode: storage.schoolCode
        // isPage: 1,
        // pageSize: this.pageSize,
        // currentPage: this.currentPage
      }
      if (userInfo.orgClassId) {
        opts.classId = userInfo.orgClassId
      }
      const { data } = await getExamineList(opts)
      console.log('获取列表', data)
      if (data.totalCount > 0) {
        this.lists = data.qryList
      }
    },
    async updExamineList(item) {
      const { storage } = this.$store.getters
      const { userInfo } = storage
      const result = await updExamineList({
        parentPersonId: item.personId,
        parentStatus: 'normal',
        personNo: userInfo.account,
        schoolCode: storage.schoolCode,
        studentPersonNo: item.studentNo
      })
      console.log('审核结果', result)
      if (result.code === 0) {
        await this.getExamineList()
      }
    },
    async getStudentUnread() {
      for (let i = 0; i < this.cellList.length; i++) {
        const data = {
          sid: this.cellList[i].personNo,
          schoolCode: this.cellList[i].schoolCode,
          userId: this.userInfo.basicPersonId
        }
        const res = await mRequest({
          // url: api + `/api/private/chat/unread?sid=${data.sid}&schoolCode=${data.schoolCode}&userId=${data.userId}`,
          url: `/chat/unread`,
          method: 'get',
          data
        })
        if (res) {
          this.cellList[i].unread = res.unread
          console.log('res.unread', this.cellList[i])
        }
      }
    },
    onLoad() {
      // 异步更新数据
      // setTimeout 仅做示例，真实场景中一般为 ajax 请求
      setTimeout(() => {
        for (let i = 0; i < 10; i++) {
          this.list.push(this.list.length + 1)
        }

        // 加载状态结束
        this.loading = false

        // 数据全部加载完成
        if (this.list.length >= 40) {
          this.finished = true
        }
      }, 1000)
    }
  }

}
</script>

<style lang='scss' scoped>
.examine-page {
    padding: 0px 0px 0px 0px;
}
</style>
