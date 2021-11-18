const utils = {
  // 6-18位数字字母特殊字符
  checkPass: pass => /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[~!@#$%^&*()_+`\-={}:";'<>?,.\/]).{6,18}$/.test(pass)
}

export default utils
