const res = (data, errmsg = 'success', errno = '0') => ({ errmsg, errno, data })

const err = (errmsg, errno = '1004') => ({ errmsg, errno })

export { res, err }
