// 校验正则
function regTest(reg, value, callback, message) {
  if (!reg.test(value)) {
    callback(new Error(message))
  } else {
    callback()
  }
}

// 用户名
export function validUserName(rule, value, callback) {
    const reg = /^[a-zA-Z0-9_-]{3,16}$/
    const message = '需为字母 数字 _ -，3-16位'
    return regTest(reg, value, callback, message)
}

// 手机号码
export function validPhone(rule, value, callback) {
    const reg = /^1[3456789]\d{9}$/
    const message = '手机号码格式有误'
    return regTest(reg, value, callback, message)
}

// 密码
export function validPwd(rule, value, callback) {
  const reg = /^(?=.*[0-9])(?=.*[a-zA-Z])[0-9a-zA-Z!@#$%^&*,.()]{6,20}$/
  const message = '密码必须包含字母、数字，长度6-20'
  return regTest(reg, value, callback, message)
}

// 正整数
export function validInteger(rule, value, callback) {
  const reg = /^[1-9]\d*$/
  const message = '请输入正整数！'
  return regTest(reg, value, callback, message)
}