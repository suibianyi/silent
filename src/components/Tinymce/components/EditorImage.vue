<template>
  <div class="upload-container">
    <el-button :style="{background:color,borderColor:color}" icon="el-icon-upload" size="mini" type="primary" @click=" dialogVisible=true">
      上传
    </el-button>
    <el-dialog :visible.sync="dialogVisible" append-to-body>
      <el-upload
        :multiple="true"
        :file-list="fileList"
        :show-file-list="true"
        :on-remove="handleRemove"
        :on-success="handleSuccess"
        :before-upload="beforeUpload"
        :action="uploadUrl"
        :data="formData"
        accept="image/*"
        class="editor-slide-upload"
        list-type="picture-card">
        <el-button size="small" type="primary">
          点击上传
        </el-button>
      </el-upload>
      <el-button @click="dialogVisible = false">
        取消
      </el-button>
      <el-button type="primary" @click="handleSubmit">
        确定
      </el-button>
    </el-dialog>
  </div>
</template>

<script>
// import { getToken } from 'api/qiniu'
import _ from 'lodash'
import { genUploadFileName } from '@/utils/common'
import { getUploadParams } from '@/api/MFS/mfs'

export default {
  name: 'EditorSlideUpload',
  props: {
    color: {
      type: String,
      default: '#1890ff'
    },
    bucket: {
      type: String,
      default: 'mis'
    }
  },
  data() {
    return {
      dialogVisible: false,
      uploadUrl: '', // 上传路径（动态）
      listObj: {},
      fileList: [],
      formData: {},
      domain: ''
    }
  },
  methods: {
    checkAllSuccess() {
      return Object.keys(this.listObj).every(item => this.listObj[item].hasSuccess)
    },
    handleSubmit() {
      const arr = Object.keys(this.listObj).map(v => this.listObj[v])
      if (!this.checkAllSuccess()) {
        this.$message('Please wait for all images to be uploaded successfully. If there is a network problem, please refresh the page and upload again!')
        return
      }
      this.$emit('successCBK', arr)
      this.listObj = {}
      this.fileList = []
      this.dialogVisible = false
    },
    handleSuccess(response, file) {
      console.log('上传成功了', response, file)
      const uid = file.uid
      const objKeyArr = Object.keys(this.listObj)
      for (let i = 0, len = objKeyArr.length; i < len; i++) {
        if (this.listObj[objKeyArr[i]].uid === uid) {
          this.listObj[objKeyArr[i]].url = `${this.domain}/${response.filename}`
          this.listObj[objKeyArr[i]].hasSuccess = true
          return
        }
      }
    },
    handleRemove(file) {
      const uid = file.uid
      const objKeyArr = Object.keys(this.listObj)
      for (let i = 0, len = objKeyArr.length; i < len; i++) {
        if (this.listObj[objKeyArr[i]].uid === uid) {
          delete this.listObj[objKeyArr[i]]
          return
        }
      }
    },
    async beforeUpload(file) {
      console.log('上传之前的文件信息', file)
      const _self = this
      const _URL = window.URL || window.webkitURL
      const fileName = genUploadFileName(file.name)
      this.listObj[fileName] = {}
      const uploadParam = await getUploadParams({
        bucket: this.bucket,
        fname: fileName
      })
      console.log('获取上传信息返回', uploadParam)
      this.uploadUrl = uploadParam.url
      this.domain = uploadParam.domain
      _.assign(this.formData, {
        token: uploadParam.token,
        bucket: this.bucket,
        timestamp: uploadParam.timestamp,
        filename: fileName
      })
      return new Promise((resolve, reject) => {
        const img = new Image()
        img.src = _URL.createObjectURL(file)
        img.onload = function() {
          _self.listObj[fileName] = { hasSuccess: false, uid: file.uid, width: this.width, height: this.height }
        }
        resolve(true)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.editor-slide-upload {
  margin-bottom: 20px;
  >>> .el-upload--picture-card {
    width: 100%;
  }
}
</style>
