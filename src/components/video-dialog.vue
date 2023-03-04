<template>
  <el-dialog
    :visible="show"
    width="60%"
    class="box-edit-dialog"
    center
    @close="handleClose">
    <div class="dialogTittle">
      <p class="tittleWord">
        {{ title }}
      </p>
    </div>
    <div class="smallThing" />
    <div class="wrapper">
      <video
        :src="src"
        muted
        autoplay
        :controls="true"
        style="height: 100%" />
    </div>
  </el-dialog>
</template>

<script>

export default {
  props: [
    // eslint-disable-next-line vue/require-prop-types
    'show',
    // eslint-disable-next-line vue/require-prop-types
    'title',
    // eslint-disable-next-line vue/require-prop-types
    'src'
  ],

  data() {
    return {}
  },
  methods: {
    handleClose() {
      this.$emit('close')
    }
  }
}
</script>

<style lang='scss' scoped>
@import "~@/styles/mixin.scss";
.dialogTittle {
  @include dialogTitle;
}
.smallThing {
  @include buleBlock;
}
.wrapper {
  width: 100%;
  height: 360px;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
