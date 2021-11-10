import svgCaptcha from 'svg-captcha'

const codeConfig = {
  size: 5,
  ignoreChars: '0o1i',
  noise: 2,
  height: 44
}

const creatCaptcha = () => {
  const captcha = svgCaptcha.create(codeConfig)
  const code = captcha.text.toLowerCase()
  const svg = captcha.data
  return { code, svg }
}

export default creatCaptcha
