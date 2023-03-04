<template>
  <div class="upload-image">
    <template v-if="multiple">
      <div
        v-for="(key, indexS) in value"
        :key="indexS"
        :style="multipleStyle"
        class="upload-image-multiple-item">
        <qn-image
          :width="w"
          :height="h"
          :bucket="bucket"
          :qn-key="key"
          :cover="cover">
          <i class="el-icon-delete upload-image-multiple-item-remove"
             @click="remove(indexS)" />
        </qn-image>
      </div>
    </template>
    <el-upload
      :action="tempUrl"
      :data="dataObj"
      :show-file-list="false"
      :accept="accept"
      :on-success="onSuccess"
      :on-error="onError"
      :before-upload="beforeUpload"
      :on-progress="onProgress"
      :disabled="disabled"
      :style="{
        display: multiple ? 'inline-block' : '',
        verticalAlign: 'middle'
      }">
      <el-progress v-if="uploading" type="circle" :percentage="percentage" style="margin-top:30px;" />
      <template v-if="multiple">
        <slot>
          <div v-if="value.length < limit" :style="multipleStyle" class="upload-image-multiple">
            <div class="upload-image-multiple-wrap">
              <i class="el-icon-delete" />
              <div v-if="limit" class="upload-image-multiple-text">
                {{ value.length }}/{{ limit }}
              </div>
            </div>
          </div>
        </slot>
      </template>
      <template v-else>
        <qn-image
          v-if="qnKey"
          :width="w"
          :height="h"
          :bucket="bucket"
          :qn-key="qnKey"
          :img="showImage"
          :cover="cover"
          adaptable />
        <upload-icon
          v-if="!qnKey&&!uploading"
          :w="w"
          :h="h"
          :local="local">
          <slot />
        </upload-icon>
      </template>
    </el-upload>
  </div>
</template>

<script>
import {
  sampleSize,
  clone,
  isArray,
  isObject,
  assign
} from 'lodash'
import QnImage from './qn-image'
import { getUploadParams } from '@/api/MFS/mfs'
import UploadIcon from './upload-icon'
import request from '@/utils/request'

export default {
  components: {
    UploadIcon,
    QnImage
  },
  props: {
    value: {
      type: [
        String,
        Array,
        Object
      ],
      default: () => ([])
    },
    w: {
      type: Number,
      default: 2
    },
    h: {
      type: Number,
      default: 1
    },
    accept: {
      type: String,
      default: ''
    },
    cover: {
      type: Boolean,
      default: false
    },
    bucket: {
      type: String,
      default: ''
    },
    prefix: { // 文件名前缀
      type: String,
      default: '1'
    },
    progress: {
      type: Boolean,
      default: false
    },
    multiple: {
      type: Boolean,
      default: false
    },
    limit: {
      type: Number,
      default: 0
    },
    size: {
      type: Number,
      default: 500 * 1024 * 1024 // nginx限制了内容传输最多300M
    },
    index: {
      type: Number,
      default: 0
    },
    isPersistentOps: {
      type: Boolean,
      default: false
    },
    /**
     * 素材来源
     * 编码中的第2位，u表示user
     * */
    source: {
      type: String,
      default: 'u'
    },
    showImage: {
      type: Boolean,
      default: true
    },
    local: {
      type: String,
      default: 'click_upload'
    },
    disabled: {
      type: Boolean,
      default: false
    },
    type: {
      type: String,
      default: '16/9'
    }
  },
  data() {
    return {
      tempUrl: '',
      compression: '',
      dataObj: {
        token: '',
        key: '',
        bucket: ''
      },
      head: { 'Content-Type': 'Access-Control-Allow-Origin' },
      qnKey: '',
      filename: '',
      percentage: 0,
      overSize: false,
      uploading: false,
      timer: '',
      imgScale: '',
      setdar: '',
      imgScaleWidth: '1920',
      imgScaleHeight: '1080',
      width: '16',
      height: '9'
    }
  },
  computed: {
    multipleStyle() {
      return {
        width: `${this.w}px`,
        height: `${this.h}px`
      }
    }
  },
  watch: {
    value() {
      this.setQnKey(this.value)
    },
    type(val) {
      console.log('监听类型', val)
    }
  },
  created() {
    this.setQnKey(this.value)
  },
  destroyed() {
    console.log('清除定时器', this.timer)
    clearTimeout(this.timer)
  },
  methods: {
    initiate(url, method, data) {
      return request({
        url,
        method,
        data
      })
    },
    async onSuccess(res, file) { // copy
      // res.key = res.filename
      console.log('上传成功', res, file, file.name)
      let result = {}
      console.log('result压缩结果', result)
      this.timer = setInterval(async() => {
        result = await this.initiate(`${this.compression}/${this.bucket}/${res.filename}`, 'get')
        console.log('result压缩结果', result)
        if (result.name) {
          this.uploading = false
          this.percentage = 0
          res.key = result.name
          clearTimeout(this.timer)
          this.setQnKey(res.key)
          if (isArray(this.value)) {
            const arr = clone(this.value)
            if (this.multiple) {
              arr.push(res.key)
            } else {
              arr[this.index] = res.key
            }
            this.$emit('input', arr)
          } else if (isObject(this.value)) {
            this.$emit('input', assign({}, file, res))
          } else {
            this.$emit('input', res.key)
          }
          console.log('res.key结果', res.key)
        }
      }, 1000)
      console.log('设置的定时器', this.timer)
    },
    onError(err) {
      this.uploading = false
      this.$emit('error', err)
    },
    onProgress(event) {
      if (this.overSize) {
        return
      }
      if (~~event.percent > 90) {
        this.percentage = 90
      } else {
        this.percentage = ~~event.percent
      }
    },
    setQnKey(value) {
      if (isArray(value)) {
        if (value.length > 0) {
          value = value[this.index]
        } else {
          value = ''
        }
      } else if (isObject(value)) {
        value = value.key
      }
      this.qnKey = value
    },
    remove(indexRow) {
      this.value.splice(indexRow, 1)
    },
    /**
     * 上传文件之前的钩子
     *
     * 文件名命名规则
     * 用户相关的素材：素材类型编码_毫秒时间戳_4位随机数字
     * */
    async beforeUpload(file) {
      console.log('type', this.accept, this.type)
      console.log('file--------------', file, this.size)
      // let uploadData = ''
      // if (file.type.indexOf('image/') >= 0) {
      //   uploadData = await new Promise((resolve, reject) => {
      //     console.log('上传的是图片')
      //     const _URL = window.URL || window.webkitURL
      //     console.log('上传的是图片', _URL.createObjectURL(file))
      //     const img = document.createElement('img')
      //     img.addEventListener('load', () => {
      //       resolve({
      //         width: img.width,
      //         height: img.height
      //       })
      //     })
      //     img.src = _URL.createObjectURL(file)
      //   })
      // }
      // console.log('uploadData', uploadData)
      const sizeArry = this.type.split('/')
      const first = sizeArry[0]
      const second = sizeArry[1]
      // console.log('比例数组', sizeArry)
      if (Number(first) < Number(second)) {
        this.imgScaleWidth = '1080'
        this.imgScaleHeight = '1920'
        this.width = '9'
        this.height = '16'
      } else if (Number(first) > Number(second)) {
        this.imgScaleWidth = '1920'
        this.imgScaleHeight = '1080'
        this.width = '16'
        this.height = '9'
      }
      // if (uploadData.width > uploadData.height) {
      //   this.imgScale = '1920:1080'
      //   this.setdar = '16/9'
      // } else {
      //   this.imgScale = '1080:1920'
      //   this.setdar = '9/16'
      // }
      if (this.accept.indexOf(file.type) < 0) {
        this.checkFile = false
        this.$message({
          showClose: true,
          message: '文件格式错误',
          type: 'error',
          duration: 2000
        })
        return
      }
      if (this.accept.indexOf('video') >= 0 && /^video\/(mp4|avi)$/.test(file.type)) {
        if (file.size > 500 * 1024 * 1024) { // 500M
          this.$message({
            showClose: true,
            message: '文件大小不能超过500M',
            type: 'error',
            duration: 2000
          })
          return Promise.reject()
        }
      } else if (this.accept.indexOf('image') >= 0 && /^image\/(jpeg|png|jpg|bmp)$/.test(file.type)) {
        if (file.size > 10 * 1024 * 1024) { // 10m
          this.$message({
            showClose: true,
            message: '文件大小不能超过10M',
            type: 'error',
            duration: 2000
          })
          return Promise.reject()
        }
      }
      this.overSize = false
      this.uploading = true
      const {
        bucket,
        source,
        prefix
      } = this
      console.log('file2--------------', bucket, source, prefix, file.type)

      let firstCode = 'f' // 编码中的第1位，i表示image，f表示file
      const suffixIndex = file.name.lastIndexOf('.')
      const suffix = file.name.substring(suffixIndex + 1).toUpperCase()
      if (file.type) {
        if (file.type.indexOf('image/') >= 0) {
          firstCode = 'i'
        } else if (file.type.indexOf('video/') >= 0) {
          firstCode = 'v'
        }
      } else if (file.name) {
        if ([
          'BMP',
          'JPG',
          'JPEG',
          'PNG',
          'GIF'
        ].indexOf(suffix) >= 0) {
          firstCode = 'i'
        }
      }

      this.dataObj.key = `${firstCode}${source}${prefix}_`
      console.log('tttttttttt', this.dataObj.key)

      if (['p'].indexOf(source) >= 0) {
        this.dataObj.key += file.name
      } else {
        console.log('bbbbbbbbbbbbbb')
        const code = sampleSize('0123456789', 4).join('')
        console.log('bbbbbbbbbbbbbb1')
        this.dataObj.key += `${new Date().getTime()}_${code}` + (suffix && `.${suffix.toLowerCase()}` || '')
        console.log('bbbbbbbbbbbbbb2', bucket)
        console.log('bbbbbbbbbbbbbb2', this.dataObj)
      }
      const params = {
        bucket,
        fname: this.dataObj.key
      }
      console.log('params-11--------------', params)
      console.log('file311--------------', bucket, source, prefix, this.dataObj)
      if (this.isPersistentOps) {
        params.persistentOps = 'imageView2/2/w/800/h/800|saveas/'
      }
      console.log('请求token参数', params)
      const rst = await getUploadParams(params)
      this.tempUrl = rst.url // 'https://upload-z2.qiniup.com/' //
      this.compression = rst.compression
      this.filename = params.fname
      assign(this.dataObj, {
        token: rst.token,
        bucket: this.bucket,
        timestamp: rst.timestamp,
        filename: params.fname,
        compression: '1',
        imgScaleWidth: this.imgScaleWidth,
        imgScaleHeight: this.imgScaleHeight,
        w: this.width,
        h: this.height
      })
      console.log('file4--------------', bucket, source, prefix)
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~@/styles/mixin.scss";
.upload-container {
  width: 100%;
  position: relative;
  @include clearfix;
  .image-uploader {
    width: 35%;
    float: left;
  }
  .image-preview {
    width: 200px;
    height: 200px;
    position: relative;
    border: 1px dashed #d9d9d9;
    float: left;
    margin-left: 50px;
    .image-preview-wrapper {
      position: relative;
      width: 100%;
      height: 100%;
      img {
        width: 100%;
        height: 100%;
      }
    }
    .image-preview-action {
      position: absolute;
      width: 100%;
      height: 100%;
      left: 0;
      top: 0;
      cursor: default;
      text-align: center;
      color: #fff;
      opacity: 0;
      font-size: 20px;
      background-color: rgba(0, 0, 0, .5);
      transition: opacity .3s;
      cursor: pointer;
      text-align: center;
      line-height: 200px;
      .el-icon-delete {
        font-size: 36px;
      }
    }
    &:hover {
      .image-preview-action {
        opacity: 1;
      }
    }
  }
  .image-app-preview {
    width: 320px;
    height: 180px;
    position: relative;
    border: 1px dashed #d9d9d9;
    float: left;
    margin-left: 50px;
    .app-fake-conver {
      height: 44px;
      position: absolute;
      width: 100%; // background: rgba(0, 0, 0, .1);
      text-align: center;
      line-height: 64px;
      color: #fff;
    }
  }
}
</style>
<style lang="stylus">
$border-color-light = #e4e7ed
$border-color-base = #dcdfe6
$color-text-placeholder = #B8B8B8
$font-size-h1 = 30px
$font-size-h2 = 20px
$font-size-h3 = 18px
$font-size-h4 = 17px
$font-size-h5 = 16px
$font-size-h6 = 14px
$font-size-h7 = 12px
.upload-image
  position: relative
  .thumb-content
    border: 1px solid $border-color-light
    border-radius: 8px
  .el-upload
    width: 100%
    display: block
  .upload-icon
      border: 1px solid $border-color-base
      border-radius: 6px
      &-bg
        position: absolute
        left: 0
        top: 0
        bottom: 0
        right: 0
    .qn-image
      border: 1px solid $border-color-base
  &-progress
    absolute: left 0 right 0 bottom -18px
  &-multiple
    position: relative
    border: $border-base
    border-radius: 6px
    &-wrap
      absolute: top 50% left 0 right 0
      transform: translateY(-50%)
      color: $color-text-placeholder
      text-align: center
      font-size: $font-size-h2
      line-height: 1
    &-text
      font-size: $font-size-h6
      margin-top: 3px
    &-item
      position: relative
      display: inline-block
      vertical-align: middle
      margin-right: 11px
      .qn-image
        border-radius: 6px
      &-remove
        absolute: top ($font-size-h3 / -2) right ($font-size-h3 / -2)
        font-size: $font-size-h3
        color: $color-text-placeholder
</style>
