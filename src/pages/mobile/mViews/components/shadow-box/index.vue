<template>
  <div class="shadow-box">
    <div v-for="value in shadowBoxList" :key="value.text" @click="switchPic(value)">
      <div class="container" :class="value.empty? 'nobox' : ''">
        <div class="content">
          <img v-if="value.imageUrl" :src="value.imageUrl" alt="">
          <div v-if="value.text" class="name">
            {{ value.text }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import _ from 'lodash'
import { judgeAuth } from '@/mUtils'
export default {
  props: {
    id: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      width: 0
    }
  },
  computed: {
    shadowBoxList() {
      if (this.width) {
        const num = parseInt((this.width - 20) / 100)
        let cloneShadowBoxList = _.cloneDeep(this.$store.getters.shadowBoxList[this.id] || this.$store.getters.shadowBoxList.default)
        cloneShadowBoxList = cloneShadowBoxList.filter((item) => {
          if (item.auth && item.auth.length > 0) {
            console.log('判断权限的结果是', judgeAuth(item.auth, this.$store.getters.storage.auths))
            return judgeAuth(item.auth, this.$store.getters.storage.auths)
          }
          return true
        })
        if (num > 0) {
          const addNum = Math.ceil(cloneShadowBoxList.length % num)
          console.log('一行的数目和多出来的数目', num, addNum)
          if (cloneShadowBoxList.length / num > 1) {
            const tempList = cloneShadowBoxList
            for (let i = 0; i < num - addNum; i++) {
              tempList.push({ empty: true })
            }
            return tempList
          }
          return cloneShadowBoxList
        }
      }
      const cloneShadowBoxList = _.cloneDeep(this.$store.getters.shadowBoxList[this.id] || this.$store.getters.shadowBoxList.default)
      return cloneShadowBoxList.filter((item) => {
        if (item.auth && item.auth.length > 0) {
          console.log('判断权限的结果是', judgeAuth(item.auth, this.$store.getters.storage.auths))
          return judgeAuth(item.auth, this.$store.getters.storage.auths)
        }
        return true
      })
    }
  },
  mounted() {
    this.width = this.$parent.paintWidth || this.$parent.innerWidth || window.innerWidth
    console.log('页面宽度是', this.width)
    console.log('父元素是', this.$parent)
  },
  methods: {
    switchPic(value) {
      if (value.page && value.page !== '') {
        this.$store.dispatch('setCurrentPage', { page: value.page })
      }
      if (value.action) {
        this.$store.dispatch('handelAction', value.action)
      }
    }
  }

}
</script>

<style lang='scss' scoped>
.nobox{
	box-shadow:none !important
}
.shadow-box {
    min-height: 50px;
    padding: 10px 10px 0px 10px;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
    .container {
        width: 100px;
        height: 100px;
        border-radius: 15px;
        margin-bottom: 20px;
        box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
        display: flex;
        align-items: center;
        justify-content: center;
        .content {
            width: 60px;
            height: 60px;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-wrap: wrap;
            img {
                width: 45px;
                height: 45px;
                border-radius: 50%;
            }
        }
        .name {
            margin-top: 10px;
            width: 100%;
            color: #646566;
            font-size: 14px;
            display: flex;
            align-items: center;
            justify-content: center;
        }
    }
}
</style>
