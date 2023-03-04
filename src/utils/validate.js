/**
 * Created by PanJiaChen on 16/11/18.
 */

/**
 * @param {string} path
 * @returns {Boolean}
 */
export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validUsername(str) {
  return str && str.trim().length > 0
}

// 验证邮箱
export function validEmail(str) {
  if (!str) {
    return true
  }
  const regEmail = /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/
  return regEmail.test(str)
}

// 验证tel
export function validTel(str) {
  if (!str) {
    return true
  }
  const regTel = /^((0\d{2,3}-\d{7,8})|(1[35847]\d{9}))$/
  return regTel.test(str)
}
