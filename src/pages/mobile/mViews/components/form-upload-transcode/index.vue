<template>
  <div class="form-page">
    <van-radio-group v-model="pingType" direction="horizontal">
      <van-radio name="16/9">横屏</van-radio>
      <van-radio name="9/16">竖屏</van-radio>
    </van-radio-group>
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
      type: Object,
      default() {
        return {
          text: '',
          value: ''
        }
      }
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
      fileList: [],
      pingType: '16/9',
      timer: {}
    }
  },
  watch: {
    value: {
      handler(newVal) {
        console.log('单个图片上传组件收到的newVal', newVal)
        if (newVal && newVal.value !== '' && newVal.text) {
          this.fileList = [{ url: newVal.value }]
        } else if (newVal && newVal.text !== '' && newVal.value) {
          this.fileList = [{ url: newVal.text }]
        } else {
          this.fileList = []
        }
        console.log('单个图片上传组件最后是', this.fileList)
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
      this.$emit('input', { text: '', value: '' })
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
        .field('compression', '1')
        .field('imgScaleHeight', `${this.pingType === '16/9' ? 1080 : 1920}`)
        .field('imgScaleWidth', `${this.pingType === '16/9' ? 1920 : 1080}`)
        .field('w', `${this.pingType === '16/9' ? 16 : 9}`)
        .field('h', `${this.pingType === '16/9' ? 9 : 16}`)
        .attach('file', stream, `${parmas.fname}`)
      this.fileName = res.body.filename
      console.log('res', res, this.fileName, this.uploadUrl)
      const _this = this
      _this.timer[res.body.filename] = setInterval(async() => {
        const result = await request.get(`${uploadParam.compression}/mis/${res.body.filename}`)
        // const result = await mRequest({
        //   url: `${uploadParam.compression}/mis/${res.body.filename}`,
        //   method: 'post',
        //   data: {
        //     bucket: 'mis',
        //     filename: res.body.filename
        //   }
        // })
        console.log('请求回来的result', result)
        if (result.body.name) {
          this.fileName = result.body.name
          clearInterval(_this.timer[res.body.filename])
          clearTimeout(_this.timer[res.body.filename])
          console.log('这里是单个图片上传', `${this.uploadUrl}/${this.fileName}`)
          this.$emit('input', { value: `${this.uploadUrl}/${this.fileName}`, text: `${this.uploadUrl}/${this.fileName}` })
        }
      }, 1000)
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
