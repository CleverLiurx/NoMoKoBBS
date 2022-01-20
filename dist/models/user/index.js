"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _mongoose = require("mongoose");

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const schema = new _mongoose2.default.Schema({
  // 手机号：登录
  phone: {
    type: String,
    required: true,
    unique: [true, "手机号已经被注册啦"],
    index: true
  },
  // 用户名：昵称
  username: {
    type: String,
    unique: true,
    required: [true, "用户名不能为空"],
    minlength: 2,
    maxlength: 10
  },
  // 8位密码盐值
  salt: {
    type: String,
    required: true
  },
  // 密码
  password: {
    type: String,
    required: true
  },
  // 邮箱
  email: String,
  // 生日
  birthday: {
    type: String,
    default: "2000-01-01"
  },
  // 性别 1-男 0-女
  sex: {
    type: Number,
    enum: [0, 1],
    default: 1
  },
  // 头像
  avator: {
    type: String,
    default: "http://cdn.bayuechuqi.com/upload_776383f16724e1a3bd793657ee3eb0a1?imageslim"
  },
  // 用户记录
  record: {
    type: _mongoose2.default.Types.ObjectId,
    ref: "records"
  },
  // 关联学校的学号
  studentId: {
    type: _mongoose2.default.Types.ObjectId,
    unique: true,
    ref: "school"
  },
  // 是否为版主
  isSectioner: {
    type: Boolean,
    default: false
  },
  // 显示状态 true-正常 false-存在但不显示信息
  status: {
    type: Boolean,
    default: true
  },
  // 删除状态 1-删除
  delFlag: {
    type: Boolean,
    default: false
  },
  // 管理员
  isAdmin: {
    type: Boolean,
    default: false
  }
}, { timestamps: { createdAt: "createTime", updatedAt: "updateTime" } });

const Model = _mongoose2.default.model("users", schema);

exports.default = Model;