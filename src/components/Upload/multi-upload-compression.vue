<template>
  <div class="multi-upload-image">
    <el-upload
      class="upload"
      :action="tempUrl"
      :data="dataObj"
      :on-preview="handlePreview"
      :on-remove="handleRemove"
      :on-progress="onProgress"
      :on-exceed="handleExceed"
      :show-file-list="!uploading && checkFile"
      list-type="picture-card"
      :accept="accept"
      :limit="limit"
      :on-success="onSuccess"
      :on-error="onError"
      :before-upload="beforeUpload"
      :class="{disabled: value.length === limit}">
      <i v-if="!uploading" class="el-icon-plus" />
      <el-progress v-if="uploading" class="progress" type="circle" :percentage="percentage" />
    </el-upload>
    <el-dialog :visible.sync="previewVisible" append-to-body>
      <img v-if="previewSrc && !isVideo(previewName) && !uploading" width="100%" :src="previewSrc" alt="">
      <video v-if="previewSrc && isVideo(previewName) && !uploading" :key="previewSrc" ref="player" preload width="100%" alt="预览视频" controls>
        <source :src="previewSrc" type="video/ogg">
        <source :src="previewSrc" type="video/mp4">
      </video>
    </el-dialog>
  </div>
</template>

<script>
import {
  sampleSize,
  assign,
  map
} from 'lodash'
import { isVideo } from '@/utils'
import { getUploadParams } from '@/api/MFS/mfs'
import video from '@/assets/video.png'
import request from '@/utils/request'

export default {
  props: {
    value: {
      type: Array,
      default: () => ([])
    },
    accept: {
      type: String,
      default: ''
    },
    bucket: {
      type: String,
      default: ''
    },
    prefix: { // 文件名前缀
      type: String,
      default: '1'
    },
    limit: {
      type: Number,
      default: 0
    },
    size: {
      type: Number,
      default: 300 * 1024 * 1024 // nginx限制了内容传输最多300M
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
    }
  },
  data() {
    return {
      tempUrl: '',
      dataObj: {
        token: '',
        key: '',
        bucket: ''
      },
      previewVisible: false,
      previewName: '',
      previewSrc: '',
      defaultVideoImg: video,
      compression: '',
      percentage: 0,
      uploading: false,
      timer: {},
      checkFile: false,
      imgScale: '',
      setdar: ''
    }
  },
  destroyed() {
    console.log('清除定时器', this.timer)
    Object.keys(this.timer).forEach((item) => {
      clearTimeout(this.timer[item])
    })
  },
  methods: {
    initiate(url, method, data) {
      return request({
        url,
        method,
        data
      })
    },
    isVideo,
    onSuccess(res, file, fileList) {
      console.log('上传成功', res, file, fileList)
      let result = {}
      this.timer[file.uid] = setInterval(async() => {
        result = await this.initiate(`${this.compression}/${this.bucket}/${res.filename}`, 'get')
        console.log('result压缩结果', result, this.uploading, this.percentage)
        if (result.name) {
          this.uploading = false
          res.filename = result.name
          clearTimeout(this.timer[file.uid])
          map(fileList, (f) => {
            if (f.response && f.response.filename === res.filename) {
              f.name = res.filename
              f.previewSrc = f.url
              f.url = isVideo(res.filename) ? this.defaultVideoImg : f.url
            }
          })
          this.value.push(res.filename)
          this.percentage = 0
          console.log('this.value', this.value)
        }
      }, 1000)
      console.log('this.timer', this.timer)
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
    onError(err) {
      this.uploading = false
      this.$emit('error', err)
    },
    async handlePreview(file) {
      console.log('预览文件~~~~', file)
      if (file.url) {
        this.previewSrc = file.previewSrc
        this.previewName = file.name
        this.previewVisible = true
      }
    },
    handleRemove(file) {
      console.log('删除文件~~~~', file)
      if (file.name) {
        this.value.indexOf(file.name) !== -1 && this.value.splice(this.value.indexOf(file.name), 1)
      }
    },
    handleExceed(files, fileList) {
      this.$message.warning('超过上传文件个数限制')
    },
    /**
     * 上传文件之前的钩子
     *
     * 文件名命名规则
     * 用户相关的素材：素材类型编码_毫秒时间戳_4位随机数字
     * */
    async beforeUpload(file) {
      console.log('type', this.accept, file.type)
      console.log('file--------------111', file, this.size)
      let uploadData = ''
      if (file.type.indexOf('image/') >= 0) {
        uploadData = await new Promise((resolve, reject) => {
          console.log('上传的是图片')
          const _URL = window.URL || window.webkitURL
          console.log('上传的是图片', _URL.createObjectURL(file))
          const img = document.createElement('img')
          img.addEventListener('load', () => {
            resolve({
              width: img.width,
              height: img.height
            })
          })
          img.src = _URL.createObjectURL(file)
        })
      }
      console.log('uploadData', uploadData)
      if (uploadData.width > uploadData.height) {
        this.imgScale = '1920:1080'
        this.setdar = '16/9'
      } else {
        this.imgScale = '1080:1920'
        this.setdar = '9/16'
      }
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
      if (this.accept.indexOf('video') >= 0 && /^video\/(mp4)$/.test(file.type)) {
        if (file.size > 1024 * 1024 * 1024) { // 1g
          this.$message({
            showClose: true,
            message: '文件大小不能超过1GB',
            type: 'error',
            duration: 2000
          })
          return Promise.reject()
        }
      }
      if (this.accept.indexOf('image') >= 0 && /^image\/(jpeg|png|jpg)$/.test(file.type)) {
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
      this.checkFile = true
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
        imgScale: this.imgScale,
        setdar: this.setdar
      })
      console.log('file4--------------', bucket, source, prefix)
    }
  }
}
</script>

<style lang="stylus" scoped>
@import "~@/styles/mixin.scss";
.multi-upload-image {
  position: relative;
  >>> .disabled {
    .el-upload--picture-card {
      display: none;
    }
  }
}
.upload
  position: relative
  .progress
    position: absolute
    top 10px
    left 10px
</style>
