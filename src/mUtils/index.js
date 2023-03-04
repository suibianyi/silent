import _ from 'lodash'
// 将请求回来的数据变成tree能够展示的方式
export function formatTree(val) {
  const children = []
  for (const item in val) {
    if (_.isObject(val[item])) {
      children.push({ text: `${item}`, children: this.formatTree(val[item]) })
    } else {
      children.push({ text: `${item}:${val[item]}`, data: { value: `${item}` }})
    }
  }
  return children
}
// 判断数组对象最长的长度
export function getObjLength(val) {
  let max = 0
  for (const item in val) {
    if (_.isObject(val[item])) {
      let i = 0
      // eslint-disable-next-line no-unused-vars
      for (const key in val[item]) {
        i++
      }
      if (i > max) {
        max = i
      }
    }
  }
  return max
}
// 请求返回结果格式化使用
export function splitTreeRes(val) {
  console.log('传splitTreeRes的值是', val)
  const str = val.split('.')
  let list = ''
  let cor = ''
  let flag = false
  for (let i = 0; i < str.length; i++) {
    if (!isNaN(Number(str[i], 10))) {
      flag = true
      for (let j = 0; j < i; j++) {
        if (list === '') {
          list = `${str[j]}`
        } else {
          list = `${list}.${str[j]}`
        }
      }
      if (i < str.length) {
        for (let k = i + 1; k < str.length; k++) {
          if (cor === '') {
            cor = `${str[k]}`
          } else {
            cor = `${cor}.${str[k]}`
          }
        }
      }
      return { list, cor }
    }
  }
  if (!flag) {
    cor = val
    return { list, cor }
  }
  return { list, cor }
}
/* val: {
  res, //返回值
  format：[{
    responseList, //数组位置
    responseCor, //格式化数据
    resultName, //返回的名称
  }]
}*/
// 请求返回结果展示数据化使用
export function formatResponseArray(val) {
  console.log('传formatResponse的值是', val)
  const firstList = []
  for (const item of val.format) {
    const spliceRes = item.responseList.split('.')
    let tempList = val.res
    for (const item of spliceRes) {
      tempList = tempList[item]
    }
    firstList.push(tempList)
  }
  const resultList = []
  console.log('formatResponse处理的firstList值是', firstList)
  const length = getObjLength(firstList)
  for (let i = 0; i < length; i++) {
    resultList.push({})
  }
  console.log('formatResponse新建的resultList值是', resultList)
  let k = 0
  for (const itemList of firstList) {
    console.log('formatResponse的itemList值是', itemList)
    if (_.isObject(itemList)) {
      let j = 0
      for (const item of itemList) {
        let tempCorItem = item
        const spliceCorRes = val.format[k].responseCor.split('.')
        console.log(`formatResponse处理的val.format${[k]}.responseCor.split值是`, spliceCorRes, tempCorItem)
        for (const cor of spliceCorRes) {
          tempCorItem = tempCorItem[cor]
        }
        console.log('formatResponse处理的tempCorItem值是', tempCorItem)
        resultList[j][val.format[k].resultName] = tempCorItem
        j++
      }
    }
    k++
  }
  console.log('formatResponse处理的中间是', resultList)
  if (resultList.length) {
    for (const itemList of firstList) {
      let l = 0
      for (const item of itemList) {
        resultList[l] = _.assign(resultList[l], item)
        l++
      }
    }
  }
  console.log('formatResponse处理的结果是', resultList)
  return resultList
}
export function formatReference(data, format) {
  console.log('formatReference的值是', data, format)
  const spliceRes = format.split('.')
  console.log('formatReference的结果是', spliceRes)
  let tempList = data
  for (const item of spliceRes) {
    tempList = tempList[item]
  }
  return tempList
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
  const code = _.sampleSize('0123456789', 4).join('')
  console.log('ccccc')
  return `${firstCode}${source}${prefix}_${new Date().getTime()}_${code}` + (suffix && `.${suffix.toLowerCase()}` || '')
}

export function formatPageListShow(val) {
  if (val) {
    if (val.page && val.page !== '') {
      return val.page
    }
    if (val.func && val.func !== '') {
      return `${val.func.method}功能`
    }
    if (val.req && val.req !== '') {
      return `${val.req.method}方法`
    }
  }
  return ''
}

export function formatPageListRes(data, val) {
  if (val) {
    if (val.method && (val.method === 'get' || val.method === 'post' || val.method === 'delete')) {
      return _.assign(data, { page: '', func: '', req: val })
    } else if (val.method) {
      return _.assign(data, { page: '', func: val, req: '' })
    } else {
      return _.assign(data, { page: val, func: '', req: '' })
    }
  }
  return _.assign(data, { page: '', func: '', req: '' })
}

export function formatTreeSelected(arr) {
  let newArr = []
  if (arr !== undefined && arr.length > 0) {
    newArr = arr.map(item => {
      item.state = { selected: true }
      if (item.children !== undefined && item.children.length > 0) {
        this.formatTreeSelected(item.children)
      }
      return item
    })
  }
  return newArr
}
