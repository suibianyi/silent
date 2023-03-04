import { padStart } from 'lodash'
export function formatDate(date, fmt) {
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
  }
  const o = {
    'M+': date.getMonth() + 1,
    'd+': date.getDate(),
    'h+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds()
  }
  for (const k in o) {
    if (new RegExp(`(${k})`).test(fmt)) {
      const str = o[k] + ''
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : padLeftZero(str))
    }
  }
  return fmt
}

function padLeftZero(str) {
  return ('00' + str).substr(str.length)
}

function fillZero(str, len = 2) {
  return padStart(str, len, '0')
}

export function date(value) {
  const current = new Date(parseInt(value, 10))
  return value ? `${current.getFullYear()}-${fillZero(current.getMonth() + 1)}-\
    ${fillZero(current.getDate())} ${fillZero(current.getHours())}:\
    ${fillZero(current.getMinutes())}:${fillZero(current.getSeconds())}` : ''
}
