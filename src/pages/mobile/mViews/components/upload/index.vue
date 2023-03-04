<template>
  <div class="form-page">
    <van-uploader v-model="fileList" :after-read="afterRead" :max-count="1" :before-delete="beforeDelete" />
  </div>
</template>

<script>
import request from 'superagent'
// import {
//   mRequest
// } from '@/api/request'
import { getUrlUpload } from '@/api/user'
export default {
  props: {
    value: {
      type: String,
      default: ''
    },
    config: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      fileList: []
    }
  },
  watch: {
    value: {
      handler(newVal) {
        console.log('图片上传组件收到的newVal', newVal)
        if (newVal !== '') {
          this.fileList = [{ url: newVal }]
        } else {
          this.fileList = []
        }
      },
      deep: true,
      immediate: true
    }
  },
  // computed: {
  //   fileList() {
  //     console.log('fileList是', this.value)
  //     if (this.value.value !== '') {
  //       return [{ url: this.value }]
  //     }
  //     return []
  //   }
  // },
  mounted() {
  },
  methods: {
    beforeDelete() {
      this.$emit('input', '')
    },
    base64toFile(dataurl, filename = 'file') {
      const arr = dataurl.split(',')
      const mime = arr[0].match(/:(.*?);/)[1]
      const suffix = mime.split('/')[1]
      const bstr = atob(arr[1])
      let n = bstr.length
      const u8arr = new Uint8Array(n)
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n)
      }
      return new File([u8arr], `${filename}.${suffix}`, {
        type: mime
      })
    },
    async uploadImage(stream) {
      const bucket = 'mis' // this.bucket 由于作用域问题无法获取this
      const parmas = {
        bucket,
        fname: `${Date.parse(new Date())}.png`
      }
      const uploadParam = await getUrlUpload.get(parmas)
      this.uploadUrl = uploadParam.domain
      console.log('上传信息', uploadParam)
      const res = await request.post(uploadParam.url)
        .field('token', `${uploadParam.token}`)
        .field('bucket', `${bucket}`)
        .field('timestamp', `${uploadParam.timestamp}`)
        .field('filename', `${parmas.fname}`)
        .attach('file', stream, `${parmas.fname}`)
      this.fileName = res.body.filename
      console.log('res', res, this.fileName, this.uploadUrl)
      console.log('这里是单个图片上传')
      this.$emit('input', `${this.uploadUrl}/${this.fileName}`)
    },
    async afterRead(file) {
      console.log('上传图片是', file)
      const rotateimg = this.base64toFile(file.content)
      await this.uploadImage(rotateimg)
    }
  }

}
</script>

<style lang='scss' scoped>
.form-page {
    padding: 0px 0px 0px 0px;
}
</style>
