<template>
  <div class="cell">
    <van-nav-bar title="选择孩子" left-text="返回" left-arrow @click-left="onClickLeft" />
    <van-cell-group>
      <van-cell v-for="value in cellList" :key="value.trueName" :title="value.trueName" is-link size="large"
                @click="switchCell(value)">
        <template #default>
          <van-badge :content="value.unread" />
        </template>
      </van-cell>
    </van-cell-group>
  </div>
</template>

<script>

import { map } from 'lodash'
import {
  mRequest
} from '@/api/request'
export default {
  data() {
    return {
      cellList: [],
      userInfo: this.$store.state.storage.userInfo
    }
  },
  // computed: {
  //   cellList() {
  //     console.log('cellList是', this.$store.getters.cellList)
  //     return this.$store.getters.cellList
  //   }
  // },
  mounted() {
    console.log('这里存的东西是', this.$store.getters.storage)
    this.getStudents()
    this.getStudentUnread()
    // this.cellList = this.$store.getters.storage.children
  },
  methods: {
    onClickLeft() {
      this.$store.dispatch('backNav')
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
    getStudents() {
      this.cellList = map(this.$store.getters.storage.children, s => {
        s.unread = 0
        return s
      })
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
    }
  }

}
</script>

<style lang='scss' scoped>
.cell {
    padding: 0px 0px 0px 0px;
}
</style>
