<template>
  <div class="tinymce">
    <Tinymce ref="editor" v-model="model.text" :height="400" />
  </div>
</template>

<script>
import Tinymce from '../Tinymce_copy'
export default {
  components: {
    Tinymce
  },
  props: {
    value: {
      type: Object,
      default() {
        return {
          text: '',
          value: ''
        }
      }
    }
  },
  data() {
    return {
      model: {
        text: ''
      }
    }
  },
  watch: {
    value: {
      handler(val) {
        this.model.text = val.value
      },
      deep: true,
      immediate: true
    },
    'model.text': {
      handler(val) {
        console.log('model.text', val)
        this.$emit('input', { text: val, val: val })
      },
      deep: true,
      immediate: true
    }
  },
  mounted() {
  },
  methods: {
    switchPic(image) {
      if (image.page) {
        this.$store.dispatch('setCurrentPage', { page: image.page })
      }
    }
  }

}
</script>

<style lang='scss' scoped>
.tinymce {
    position: relative;
}
</style>
