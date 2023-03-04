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
      :show-file-list="false"
      :accept="accept"
      :limit="limit"
      :on-success="onSuccess"
      :on-error="onError"
      :file-list="files"
      :before-upload="beforeUpload"
      :disabled="status"
      :class="{disabled: value.length === limit}">
      <el-button slot="trigger" size="small" type="primary">本地上传</el-button>
    </el-upload>
    <div class="file">
      <div v-for="(item,index) in files" :key="index" class="upload-image" @mouseenter="onmouseover(index)" @mouseleave="onmouseout(index)">
        <div v-if="item.progressFlag" class="percentage">
          <el-progress type="circle" :percentage="item.progressPercent || 0" />
        </div>
        <img v-if="!item.progressFlag && item.url && !isVideo(item.url)" class="image" :src="`${domain}/${item.url}`" alt="">
        <video v-if="!item.progressFlag && item.url && isVideo(item.url)" :key="previewSrc" ref="player" preload class="image" width="100%" alt="预览视频" controls>
          <source :src="item.url" type="video/ogg">
          <source :src="item.url" type="video/mp4">
        </video>
        <div v-if="item.shadeWindow" class="image-shade">
          <span class="image-button" @click="handlePictureCardPreview(item)">
            <i class="el-icon-zoom-in" />
          </span>
          <span class="image-button" @click="remove(index, item)">
            <i class="el-icon-delete" />
          </span>
        </div>
      </div>
    </div>
    <el-dialog :visible.sync="dialogVisible" :append-to-body="true">
      <img v-if="!isVideo(dialogImageUrl)" width="100%" :src="dialogImageUrl" alt="">
      <video v-if="isVideo(dialogImageUrl)" :key="previewSrc" ref="player" preload class="image" width="100%" alt="预览视频" controls>
        <source :src="dialogImageUrl" type="video/ogg">
        <source :src="dialogImageUrl" type="video/mp4">
      </video>
    </el-dialog>
  </div>
</template>

<script>
import {
  sampleSize,
  assign
} from 'lodash'
import { isVideo } from '@/utils'
import { getUploadParams } from '@/api/MFS/mfs'
import video from '@/assets/video.png'
import request from 'superagent'

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
    },
    status: {
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
      tempUrl: '', // 上传地址
      domain: '', // 下载地址
      compression: '', // 压缩结果查询地址
      dataObj: {
        token: '',
        key: '',
        bucket: ''
      },
      previewVisible: false,
      previewName: '',
      previewSrc: '',
      defaultVideoImg: video,
      uploading: false,
      timer: {},
      progressTimer: {},
      checkFile: false,
      imgScale: '',
      setdar: '',
      files: [],
      toJpg: false,
      pageSize: 1,
      dialogVisible: false,
      dialogImageUrl: '',
      imgScaleWidth: '1920',
      imgScaleHeight: '1080',
      w: '16',
      h: '9'
    }
  },
  watch: {
    type(val) {
      console.log('监听横竖屏', val)
    }
  },
  destroyed() {
    console.log('清除定时器', this.timer)
    Object.keys(this.timer).forEach((item) => {
      clearTimeout(this.timer[item])
    })
  },
  methods: {
    onmouseover(index) {
      // this.files[index].shadeWindow = true
      this.$set(this.files[index], 'shadeWindow', true)
    },
    onmouseout(index) {
      // this.files[index].shadeWindow = false
      this.$set(this.files[index], 'shadeWindow', false)
    },
    handlePictureCardPreview(item) {
      this.dialogImageUrl = `${this.domain}/${item.url}`
      this.dialogVisible = true
    },
    remove(index, item) {
      this.files.splice(index, 1)
      this.value.splice(index, 1)
      if (item.uid) {
        clearTimeout(this.timer[item.uid])
      }
      console.log('this.files', this.files)
      console.log('this.value', this.value)
    },
    initiate(url, method, data) {
      return request({
        url,
        method,
        data
      })
    },
    isVideo,
    random() {
      return (Math.floor(Math.random() * 9) + 1) / 10
    },
    onSuccess(res, file, fileList) {
      console.log('上传成功', res, file, fileList)
      console.log('上传成功后的列表', this.files)
      this.dataObj = {}
      let result = {}
      this.timer[file.uid] = setInterval(async() => {
        this.files.forEach((item, index) => {
          console.log(item.uid, file.uid)
          if (item.uid === file.uid && item.progressPercent < 98) {
            // console.log('item.progressPercent', item.progressPercent)
            // const num = ((this.random() + item.progressPercent) * 10) / 10
            const num = item.progressPercent + 1
            const cloneFile = { ...item, progressPercent: num }
            this.$set(this.files, index, cloneFile)
            // this.$set(this.files[index], 'progressPercent', item.progressPercent + 1)
            console.log('this.files[index]', this.files[index])
          }
        })
        // this.files = this.files
        if (!this.toJpg) {
          result = (await request.post(this.compression)
            .send({
              bucket: this.bucket,
              filename: res.filename,
              toJpg: '2'
            })).body
          console.log('result压缩结果', result, this.uploading)
          if (result.name) {
            this.files.forEach((item, index) => {
              if (item.uid === file.uid) {
                item.url = isVideo(res.filename) ? this.defaultVideoImg : result.name
                item.progressFlag = false
                item.progressPercent = 100
                item.percentage = 100
                // this.$set(this.files[index], 'progressFlag', false)
                // this.$set(this.files[index], 'progressFlag', false)
                console.log('this.files[index]', this.files[index])
              }
            })
            console.log('停止循环')
            clearTimeout(this.timer[file.uid])
            // 最终数组
            if (this.value.indexOf(result.name) === -1) {
              this.value.push(result.name)
            }
          }
          console.log('this.value', this.value)
        } else {
          const { result } = (await request.post(this.compression)
            .send({
              bucket: this.bucket,
              filename: res.filename,
              toJpg: '1'
            })).body
          // const { result } = await this.initiate(`${this.compression}/${this.bucket}/1/${res.filename}`, 'post')
          // this.pageSize = result && result.length && result[0].totalpage
          console.log('result', result)
          console.log('result', this.pageSize, result.length)
          console.log('this.pageSize === result.length', this.pageSize === result.length)
          let isFinish = false
          if (result && result.length) {
            for (const item of result) {
              // 展示
              let checkValue = false
              for (const file of this.files) {
                console.log(file.url, item.name)
                if (file.url === item.name) {
                  checkValue = true
                }
              }
              console.log('checkValue', checkValue)
              if (!checkValue) {
                console.log('加入this.files', item.name)
                this.files.push({
                  url: item.name,
                  progressFlag: false,
                  progressPercent: 100,
                  percentage: 100,
                  order: item.order,
                  toJpg: true
                })
                this.files = this.files.sort((a, b) => a.order - b.order)
              }
              if (item.lastOne) {
                clearTimeout(this.timer[file.uid])
                isFinish = true
                break
              }
            }
            // result.forEach((item) => {
            // })
          }
          if (this.pageSize !== 0 && isFinish) {
            console.log('排序后', this.files)
            let fileInit = []
            this.files.forEach((fileItem) => {
              if (fileItem.toJpg) {
                fileInit.push(fileItem.url)
              }
            })
            fileInit = fileInit.reverse()
            fileInit.forEach((fileValue) => {
              this.value.push(fileValue)
            })
            console.log('this.value132456', this.value)
            // clearTimeout(this.timer[file.uid])
            // this.pageSize = 0
            this.files = this.files.filter(item => item.name !== file.name)
            console.log('执行删除', this.files)
          }
        }
      }, 3000)
      console.log('this.timer', this.timer)
    },
    onProgress(event, file, fileList) {
      console.log('event', event, file, fileList)
      if (this.overSize) {
        return
      }
      console.log('event', event.percent)
      fileList.forEach(item => {
        console.log('item.progressFlag !== false', item.progressFlag !== false)
        if (item.progressFlag !== false) {
          if (item.percentage >= 49.9 || event.percent >= 49.9) {
            item.progressPercent = 49.9
            item.progressFlag = true
          } else {
            item.progressFlag = true
            item.progressPercent = Math.abs(item.percentage.toFixed(1))
          }
        }
      })
      this.files = fileList
      console.log('this.files', this.files)
      // if (~~event.percent > 90) {
      //   this.percentage = 90
      // } else {
      //   this.percentage = ~~event.percent
      // }
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
      console.log('type', this.accept, file.type, this.type)
      console.log('file--------------111', file, this.size)
      // let uploadData = ''
      this.toJpg = false
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
        this.w = '9'
        this.h = '16'
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
      } else { // 非图片视频文件转图片： ppt、pptx、doc、docx、pdf、xls、xlxs
        if (file.size > 500 * 1024 * 1024) { // 200m
          this.$message({
            showClose: true,
            message: '文件大小不能超过200M',
            type: 'error',
            duration: 2000
          })
          return Promise.reject()
        }
        this.toJpg = true
        assign(this.dataObj, {
          toJpg: '1'
        })
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
          'GIF',
          'bmp'
        ].indexOf(suffix) >= 0) {
          firstCode = 'i'
        }
      }

      this.dataObj.key = `${firstCode}${source}${prefix}_`
      console.log('tttttttttt', this.dataObj.key)

      if (['p'].indexOf(source) >= 0) {
        this.dataObj.key += file.name
      } else {
        const code = sampleSize('0123456789', 4).join('')
        console.log('code', code)
        console.log('this.dataObj.key', this.dataObj.key)
        this.dataObj.key += `${new Date().getTime()}_${code}` + (suffix && `.${suffix.toLowerCase()}` || '')
        console.log('this.dataObj.key22', this.dataObj.key)
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
      console.log('rst', rst)
      this.tempUrl = rst.url // 'https://upload-z2.qiniup.com/' //
      this.domain = rst.domain
      this.compression = rst.transcode
      this.filename = params.fname
      assign(this.dataObj, {
        token: rst.token,
        bucket: this.bucket,
        timestamp: rst.timestamp,
        filename: params.fname,
        compression: '1',
        imgScaleWidth: this.imgScaleWidth,
        imgScaleHeight: this.imgScaleHeight,
        w: this.w,
        h: this.h
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
.file
  width 500px
  display flex
  flex-wrap wrap
.upload-image
  width 152px
  height 152px
  position relative
  margin 0 10px 10px 0
  border 1px dashed #c0ccda
  .percentage
    width 150px
    height 150px
    display flex
    justify-content center
    align-items center
  .image
    width 150px
    height 150px
    object-fit cover
  .image-shade
    top 0
    left 0
    position absolute
    width 150px
    height 150px
    background-color rgba(0, 0, 0, 0.4)
    display flex
    justify-content center
    align-items center
    color #fff
    .image-button
      margin 15px
      font-size 20px
      cursor pointer
</style>
