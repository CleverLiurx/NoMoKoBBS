"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _mongoose = require("mongoose");

var _mongoose2 = _interopRequireDefault(_mongoose);

var _topic = require("../topic");

var _topic2 = _interopRequireDefault(_topic);

var _record = require("../record");

var _record2 = _interopRequireDefault(_record);

var _parise = require("../parise");

var _parise2 = _interopRequireDefault(_parise);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const schema = new _mongoose2.default.Schema({
  // 回复人
  createBy: {
    type: _mongoose2.default.Types.ObjectId,
    ref: "users"
  },
  // 回复的帖子
  topicId: {
    type: _mongoose2.default.Types.ObjectId,
    ref: "topics"
  },
  // 回复的内容
  content: {
    type: String,
    required: true
  },
  // 回复总数
  replyCount: {
    type: Number,
    default: 0
  },
  // 是否有子节点
  hasChild: {
    type: Boolean,
    default: false
  },
  // 父节点id
  pid: _mongoose2.default.Types.ObjectId,
  // 点赞数
  praiseCount: {
    type: Number,
    default: 0
  },
  // 举报数
  informCount: {
    type: Number,
    default: 0
  },
  // 显示状态 true-正常 false-屏蔽内容
  status: {
    type: Boolean,
    default: true
  },
  // 删除状态
  delFlag: {
    type: Boolean,
    default: false
  },
  hadParise: Boolean
}, {
  timestamps: { createdAt: "createTime", updatedAt: "updateTime" },
  toJSON: { virtuals: true }
});

schema.pre("find", function () {
  this.find({ delFlag: false }).populate("createBy", "_id username sex avator").sort({ createTime: -1 });
});

schema.virtual("reply", {
  ref: "replys",
  localField: "_id",
  foreignField: "pid",
  justOne: false
});

schema.post("save", _asyncToGenerator(function* () {
  // 一级回复
  if (!this.pid) {
    const topic = yield _topic2.default.findByIdAndUpdate(this.topicId, {
      $inc: { replyCount: 1 }
    }); // 文章的回帖数+1
    yield _record2.default.findOneAndUpdate({ createBy: topic.createBy }, { $inc: { commentCount: 1 } }); // 被评论数+1
    yield _record2.default.findOneAndUpdate({ createBy: this.createBy }, { $inc: { beCommentCount: 1 } }); // 评论数+1
  } else {
    // 二级回复
    yield Model.findByIdAndUpdate(this.pid, { $inc: { replyCount: 1 } }); // 一级reply的回复数量+1
  }
}));

schema.post("find", (() => {
  var _ref2 = _asyncToGenerator(function* (docs) {
    for (let doc of docs) {
      if (!doc.status) {
        // doc.content = doc.content.slice(0, 2) + '**********'
        doc.content = "**** 涉嫌违规 **** 已被屏蔽 ****";
      }

      // 看自己是否点赞
      const pariseRecord = yield _parise2.default.findOne({
        createBy: doc.createBy,
        replyId: doc._id,
        status: true
      });
      if (pariseRecord) {
        doc.hadParise = true;
      } else {
        doc.hadParise = false;
      }
    }
  });

  return function (_x) {
    return _ref2.apply(this, arguments);
  };
})());

const Model = _mongoose2.default.model("replys", schema);

exports.default = Model;