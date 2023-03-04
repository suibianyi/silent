<template>
  <div class="navbar">
    <hamburger :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" />

    <!-- <breadcrumb class="breadcrumb-container" /> -->
    <el-menu v-if="$store.state.user.account === 'root'" :default-active="activeGroup" mode="horizontal" background-color="#319cff" text-color="#FFFFFF" active-text-color="#FFFFFF" style="display: inline-block" @select="handleNavbarSelect">
      <!-- <template>
        <el-menu-item v-for="item in newRouters" :key="item.meta.group.key" :index="item.meta.group.key">{{ item.meta.group.name }}</el-menu-item>
      </template> -->
      <el-menu-item index="useradmin">权限管理</el-menu-item>
      <el-menu-item index="bigdata">数据报表</el-menu-item>
      <el-menu-item index="wechart">微信管理</el-menu-item>
    </el-menu>
    <div class="right-menu">
      <div class="school-name">
        <div>{{ schoolName }}</div>
        <div style="font-size: 15px">{{ userName || 'root管理员' }}</div>
      </div>
      <el-dropdown class="avatar-container" trigger="click">
        <div class="avatar-wrapper">
          <img :src="avatar" class="user-avatar">
          <i class="el-icon-caret-bottom" style="color: #fff" />
        </div>
        <el-dropdown-menu slot="dropdown" class="user-dropdown">
          <el-dropdown-item>
            <span style="display:block;" @click="changePassword">修改密码</span>
          </el-dropdown-item>
          <el-dropdown-item divided>
            <span style="display:block;" @click="logout">退出</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <ChangePass v-if="changePassVisible"
                :dialog-type="changePassType"
                @on-close="onClose" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
// import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import ChangePass from './ChangePass'
import { hasAuths } from '@/auths'

export default {
  components: {
    // Breadcrumb,
    Hamburger,
    ChangePass
  },
  data() {
    return {
      schoolName: this.$store.state.user.school.name,
      userName: this.$store.state.user.name,
      changePassVisible: false,
      changePassType: '',
      activeGroup: ''
    }
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'avatar',
      'navbar',
      'addRouters',
      'type',
      'pwd_initialized'
    ]),
    newRouters: function() {
      const cache = []
      console.log('addRouters!!!', this.addRouters)
      for (const t of this.addRouters) {
        if (cache.find(c => c.meta.group.name === t.meta.group.name)) {
          continue
        }
        cache.push(t)
      }
      return cache
    }
    // activeGroup: function() {
    //   const route = this.$route
    //   console.log('routerouteroute', route)
    //   const { meta, path, matched } = route
    //   // if set path, the sidebar will highlight the path you set
    //   console.log('当前路由', meta, matched)
    //   if (meta && meta.group && meta.group.key) {
    //     console.log('aaaaa')
    //     this.$store.dispatch('app/toggleNavbarGroup', meta.group.key)
    //     return meta.group.key
    //   } else if (matched && matched.length && matched[0].meta && matched[0].meta.group && matched[0].meta.group.key) {
    //     console.log('bbbbb', matched[0].meta.group.key)
    //     this.$store.dispatch('app/toggleNavbarGroup', matched[0].meta.group.key)
    //     return matched[0].meta.group.key
    //   }
    //   return path
    // }
  },
  mounted() {
    const route = this.$route
    const { meta, matched } = route
    // if set path, the sidebar will highlight the path you set
    if (this.type === -1 && !this.pwd_initialized) {
      this.$store.dispatch('app/toggleNavbarGroup', '')
    } else {
      console.log('当前路由', meta, matched)
      if (meta && meta.group && meta.group.key) {
        console.log('aaaaa')
        this.$store.dispatch('app/toggleNavbarGroup', meta.group.key)
        this.activeGroup = meta.group.key
      } else if (matched && matched.length && matched[0].meta && matched[0].meta.group && matched[0].meta.group.key) {
        console.log('bbbbb', matched[0].meta.group.key)
        this.$store.dispatch('app/toggleNavbarGroup', matched[0].meta.group.key)
        this.activeGroup = matched[0].meta.group.key
      }
    }

    // return path
  },
  methods: {
    hasAuths,
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    async logout() {
      await this.$store.dispatch('user/logout')
      this.$router.push(`/login?redirect=${this.$route.fullPath}`)
    },
    handleNavbarSelect(group) {
      console.log('触发', group)
      // if (group === 'exam') {
      //   const routeUrl = this.$router.resolve({
      //     name: 'examManage'
      //   })
      //   console.log('触发2222', group)
      //   window.open(routeUrl.href, '_blank')
      // } else {
      this.$store.dispatch('app/toggleNavbarGroup', group)
      // this.$store.dispatch('app/toggleNavbarGroup', group)
    },
    changePassword() {
      // this.changePassVisible = true
      // this.changePassType = '修改密码'
      this.$router.push({ name: 'changePass' })
    },
    onClose() {
      this.changePassVisible = false
    }
  }
}
</script>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  // background: #fff;
  background: #319cff;
  box-shadow: 0 1px 4px rgba(0,21,41,.08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background .3s;
    -webkit-tap-highlight-color:transparent;

    &:hover {
      background: rgba(0, 0, 0, .025)
    }
  }

  .el-menu--horizontal>.el-menu-item {
    line-height: 50px;
    font-size: 15px;
    height: 50px;
  }

  .breadcrumb-container {
    float: left;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;

    &:focus {
      outline: none;
    }

    .school-name {
      float: left;
      color: white;
      margin-right: 10px;
      line-height: 1.15;
      margin-top: 8px;
      text-align: right;
    }
    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background .3s;

        &:hover {
          background: rgba(0, 0, 0, .025)
        }
      }
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        margin-top: 5px;
        position: relative;

        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
