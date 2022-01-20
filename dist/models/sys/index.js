"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _mongoose = require("mongoose");

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const schema = new _mongoose2.default.Schema({
  nameCh: {
    type: String,
    required: true
  },
  nameEn: {
    type: String,
    required: true
  },
  value: Number
}, { timestamps: { createdAt: "createTime", updatedAt: "updateTime" } });

const Model = _mongoose2.default.model("sys", schema);

exports.default = Model;