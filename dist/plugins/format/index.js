"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
const res = (data, errmsg = "success", errno = "0") => ({
  errmsg,
  errno,
  data
});

const err = (errmsg, errno = "1004") => ({ errmsg, errno });

exports.res = res;
exports.err = err;