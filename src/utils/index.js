import { sampleSize } from 'lodash'
// 格式化时间
export function dateFormat(fmt, dateTime) {
  const date = new Date(dateTime)
  // author: meizz
  const o = {
    'M+': date.getMonth() + 1, // 月份
    'd+': date.getDate(), // 日
    'h+': date.getHours(), // 小时
    'm+': date.getMinutes(), // 分
    's+': date.getSeconds(), // 秒
    'q+': Math.floor((date.getMonth() + 3) / 3), // 季度
    S: date.getMilliseconds() // 毫秒
  }
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(
      RegExp.$1,
      (date.getFullYear() + '').substr(4 - RegExp.$1.length)
    )
  }
  for (const k in o) {
    if (new RegExp('(' + k + ')').test(fmt)) {
      fmt = fmt.replace(
        RegExp.$1,
        RegExp.$1.length === 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length)
      )
    }
  }
  return fmt
}

export function subjectTypeToString(type) {
  let ret = '停用'
  if (type === 0) {
    ret = '白名单'
  }
  if (type === 1) {
    ret = '黑名单'
  }
  if (type === 2) {
    ret = 'Vip'
  }
  return ret
}

// 获取当前时间戳
export function getTimeValue(isSecond) {
  var time = new Date().getTime()
  if (isSecond === true) {
    time = parseInt(time / 1000)
  }
  return time
}

// 删除数组中指定值
export function deleteArraySpecificElement(element, array) {
  if (array instanceof Array) {
    const index = array.indexOf(element)
    if (index > -1) {
      array.splice(index, 1)
    }
  } else {
    throw new Error('传入的不是一个数组')
  }
}

// 获取url中指定参数值
export function _GetQueryString(paraName) {
  const url = decodeURI(document.location.toString())
  const arrObj = url.split('?')
  if (arrObj.length > 1) {
    const arrPara = arrObj[1].split('&')
    let arr
    for (let i = 0; i < arrPara.length; i++) {
      arr = arrPara[i].split('=')
      if (arr != null && arr[0] === paraName) {
        return arr[1]
      }
    }
    return ''
  } else {
    return ''
  }
}

// 判断是否视频
export function isVideo(name = '') {
  const ext = name.substring(name.lastIndexOf('.') + 1).toLowerCase()
  return ext === 'avi' ||
    ext === 'ogg' ||
    ext === 'mp4' ||
    ext === '3gp' ||
    ext === 'mkv' ||
    ext === 'mpg' ||
    ext === 'mpeg' ||
    ext === 'ts' ||
    ext === 'rmvb' ||
    ext === 'wmv' ||
    ext === 'flv' ||
    ext === 'mov' ||
    ext === 'webm'
}
// urlencode
export function urlencode(str) {
  str = (str + '').toString()
  return encodeURIComponent(str).replace(/!/g, '%21').replace(/'/g, '%27').replace(/\(/g, '%28').replace(/\)/g, '%29').replace(/\*/g, '%2A').replace(/%20/g, '+')
}
// getUrlParam
export function parseSearchArgs() {
  var url = location.search // 获取url中"?"符后的字串
  var rst = {}
  if (url.indexOf('?') !== -1) {
    var str = url.substr(1)
    var parts = str.split('&')
    for (var i = 0; i < parts.length; i++) {
      rst[parts[i].split('=')[0]] = decodeURI(parts[i].split('=')[1])
    }
  }
  return rst
}

// 根据模块，来源，前缀获取唯一上传文件名称 source: u-用户 s-系统 p-特定
export function genUploadFileName(name, bucket = 'mis', source = 'u', prefix = '') {
  console.log('bbbbbbbbbbb')
  let firstCode = 'f' // 编码中的第1位，i表示image，f表示file, v表示video
  const suffixIndex = name.lastIndexOf('.')
  const suffix = name.substring(suffixIndex + 1).toUpperCase()
  if ([
    'BMP',
    'JPG',
    'JPEG',
    'PNG',
    'GIF'
  ].indexOf(suffix) >= 0) {
    firstCode = 'i'
  } else if ([
    'MP4',
    'MPG',
    'MPEG',
    'AVI',
    'WEBM',
    'OGG'
  ].indexOf(suffix) >= 0) {
    firstCode = 'v'
  }

  const code = sampleSize('0123456789', 4).join('')
  console.log('ccccc')
  return `${firstCode}${source}${prefix}_${new Date().getTime()}_${code}` + (suffix && `.${suffix.toLowerCase()}` || '')
}
