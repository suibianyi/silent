<template>
  <div class="swipe-config">
    <van-popup v-model="showPopup" :round="true" :style="{ width: '100%', height: '100%' }" :closeable="true" @close="closePopup">
      <div class="popup-content">
        <van-tabs v-model="active" sticky>
          <van-tab title="请求数据">
            <req-page :config-index="configIndex" @on-close="closeConfigDialog" />
          </van-tab>
          <van-tab title="配置参数">
            <set-page :config-index="configIndex" @on-close="closeConfigDialog" />
          </van-tab>
          <van-tab title="配置参数">
            <reference-page :config-index="configIndex" @on-close="closeConfigDialog" />
          </van-tab>
        </van-tabs>
      </div>
    </van-popup>
  </div>
</template>

<script>
import reqPage from './reqPage.vue'
import setPage from './setPage.vue'
import referencePage from './referencePage.vue'
export default {
  components: {
    reqPage,
    setPage,
    referencePage
  },
  props: {
    show: {
      type: Boolean,
      default: false
    },
    flag: {
      type: Number,
      default: 0
    },
    configIndex: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      showPopup: false,
      active: 0
    }
  },
  computed: {
  },
  watch: {
    show: {
      handler(newVal) {
        this.showPopup = newVal
      },
      deep: true,
      immediate: true
    }
  },
  mounted() {
    console.log('show', this.show)
  },
  methods: {
    closePopup() {
      this.$emit('on-close')
    },
    closeConfigDialog() {
      this.$emit('on-close')
    }
  }

}
</script>

<style lang='scss' scoped>
.swipe-config {
    padding: 10px 10px 0px 10px;
    .popup-content {
      margin-top: 30px
    }
    .form {
      margin: 20px;
      .key-value {
        display: flex;
      }
      .delete-button {
       height: 100%;
      }
    }
}
</style>
