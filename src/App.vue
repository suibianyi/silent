<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App',
  async beforeCreate() {
    await this.$store.dispatch('initPk')
  }
}
</script>
<style>
/* 全局修改滚动条的样式 */
::-webkit-scrollbar {
    width: 10px;
    height: 10px;
}
::-webkit-scrollbar-thumb{ /*滚动条里面小方块*/
    border-radius: 10px;
    background: #cfcbcb;
}
::-webkit-scrollbar-thumb:hover{ /*滚动条里面小方块*/
    border-radius: 10px;
    background: #409eff;
}
::-webkit-scrollbar-track{ /*滚动条里面轨道*/
    border-radius: 10px;
    background: #ededed;
}
</style>
