<template>
  <div id="img-list-wrap">
    <div class="style-tab">
      <span class="tab" :class="{ 'active-tab': activeTab === 0 }" @click="activeTab = 0">我的</span>
      <!-- <span class="tab" :class="{ 'active-tab': activeTab === 1 }" @click="activeTab = 1">推荐</span> -->
    </div>
    <div v-if="hadShowMyImg" class="tab-content" :style="getStyle(0)">
      <img-water-fall
        class="img-list"
        :list-data="myImgList"
        sort-by="key"
        k="key"
        @delete-img="deleteImg"
        @select-img="selectImg"
      />
      <div class="upload-btn-wrap">
        <el-upload :action="tempUrl"
                   :data="dataObj"
                   :show-file-list="false"
                   :before-upload="beforeUpload"
                   :on-success="onSuccess"
                   accept=".jpg,.png,.jpeg">
          <div class="upload-btn" @click="uploadImg">
            <i class="iconfont icon-upload" />
            <span>上传图片</span>
          </div>
        </el-upload>

      </div>
      <!-- <el-upload :auto-upload="true"
                 :http-request="onImport"
                 :show-file-list="false"
                 action="">
        <el-button type="primary"
                   :loading="onImportLoading"
                   icon="el-icon-upload2">导入数据</el-button>
      </el-upload> -->
    </div>
    <div v-if="hadShowRecommendImg" class="tab-content" :style="getStyle(1)">
      <img-water-fall
        class="img-list"
        :list-data="recommendImgList"
        sort-by="id"
        k="id"
        @delete-img="deleteImg"
        @select-img="selectImg"
      />
    </div>
  </div>
</template>

<script>
// 图片列表
const NAME = 'img-list-wrap'
import _ from 'lodash'

import wImage from '@/common/pageDesign/widgets/wImage/wImage'
import { getUploadParams } from '@/api/MFS/mfs'

import { mapActions } from 'vuex'

// import slogan1 from '@/assets/poster/slogan1.jpg'
// import slogan2 from '@/assets/poster/slogan2.jpg'
// import clue1 from '@/assets/poster/clue1.jpg'
// import clue2 from '@/assets/poster/clue2.jpg'

export default {
  name: NAME,
  data() {
    return {
      tempUrl: '',
      dataObj: {
        token: '',
        key: '',
        bucket: ''
      },
      prefix: '1',
      bucket: 'mis',
      source: 'u',
      domain: '',
      activeTab: -1,
      myImgList: [],
      recommendImgList: [
        // {
        //   id: 1,
        //   url: slogan1,
        //   ratio: 98 / 131
        // },
        // {
        //   id: 2,
        //   url: slogan2,
        //   ratio: 98 / 55
        // },
        // {
        //   id: 3,
        //   url: clue1,
        //   ratio: 98 / 131
        // },
        // {
        //   id: 3,
        //   url: clue2,
        //   ratio: 98 / 55
        // }
      ],
      hadShowMyImg: false,
      hadShowRecommendImg: false,
      pos: 0
    }
  },
  watch: {
    activeTab(value) {
      if (value === 0) {
        this.hadShowMyImg = true
      } else if (value === 1) {
        this.hadShowRecommendImg = true
      }
    }
  },
  mounted() {
    this.activeTab = 0
  },
  methods: {
    ...mapActions(['addWidget']),
    getStyle(index) {
      return {
        display: this.activeTab === index ? '' : 'none'
      }
    },
    async beforeUpload(file) {
      console.log('file--------------', file, this.size)
      if (this.size && file.size > this.size) {
        this.overSize = true
        this.$message({
          showClose: true,
          message: `文件大小不能超过${parseInt((this.size / 1024 / 1024), 10)}M`,
          type: 'error',
          duration: 2000
        })
        return
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
        const code = _.sampleSize('0123456789', 4).join('')
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
      console.log('请求token参数', params)
      const rst = await getUploadParams(params)
      this.tempUrl = rst.url // 'https://upload-z2.qiniup.com/' //
      this.domain = rst.domain
      _.assign(this.dataObj, {
        token: rst.token,
        bucket: this.bucket,
        timestamp: rst.timestamp,
        filename: params.fname
      })
      console.log('file4--------------', bucket, source, prefix)
    },
    onSuccess(res, file) { // copy
      console.log('resresres', res, file)
      const url = `${this.domain}/${res.filename}`
      const image = {
        url: url,
        ratio: 1
      }
      this.myImgList.push(image)
    },
    selectImg(item) {
      const setting = JSON.parse(JSON.stringify(wImage.setting))
      setting.width = 500
      setting.height = parseInt(500 / item.value.ratio)
      setting.imgUrl = item.value.url
      this.addWidget(setting)
    },
    deleteImg(item) {
      //
    },
    uploadImg() {}
  }
}
</script>

<style lang="scss" scoped>
@import "~@/styles/page-design.scss";
#img-list-wrap {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  .style-tab {
    width: 100%;
    display: flex;
    border-bottom: 1px solid $color-dark-gray;
    .tab {
      flex: 1;
      padding: 10px;
      color: $color-black;
      cursor: pointer;
      border-bottom: 2px solid $color-transparent;
      text-align: center;
      &.active-tab {
        color: $color-main;
        border-bottom: 2px solid $color-main;
      }
    }
  }
  .tab-content {
    width: 100%;
    flex: 1;
    display: flex;
    flex-direction: column;
    .img-list {
      width: 100%;
      flex: 1;
      .img-item {
        width: 33.33%;
        height: auto;
        padding: 6px;
        cursor: pointer;
        &:hover {
          outline: 1px solid $color-main;
        }
        .img {
          width: 100%;
        }
      }
    }
    .upload-btn-wrap {
      width: 100%;
      display: flex;
      justify-content: center;
      .upload-btn {
        cursor: pointer;
        width: 80%;
        padding: 10px;
        margin: 15px;
        text-align: center;
        border-radius: 5px;
        color: $color-white;
        background-color: $color-main;
        &:hover {
          background-color: lighten($color-main, 10%);
        }
      }
    }
  }
}
>>> .el-upload {
  width: 200px;
}
</style>
