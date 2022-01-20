"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _mongoose = require("mongoose");

var _mongoose2 = _interopRequireDefault(_mongoose);

var _record = require("../record");

var _record2 = _interopRequireDefault(_record);

var _star = require("../star");

var _star2 = _interopRequireDefault(_star);

var _parise = require("../parise");

var _parise2 = _interopRequireDefault(_parise);

var _classes = require("../classes");

var _classes2 = _interopRequireDefault(_classes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const schema = new _mongoose2.default.Schema({
  // 所属板块
  classFrom: {
    type: _mongoose2.default.Types.ObjectId,
    ref: "class"
  },
  // 创建人
  createBy: {
    type: _mongoose2.default.Types.ObjectId,
    ref: "users"
  },
  // 标题
  title: String,
  // 简单内容
  content: {
    type: String
  },
  // 富文本内容
  richContent: {
    type: String
  },
  // 简单内容带的图片
  topicImage: [{
    name: String,
    url: String
  }],
  focusUrl: String,
  isFocus: {
    type: Boolean,
    default: false
  },
  // 点击数
  hitsCount: {
    type: Number,
    default: 0
  },
  // 点赞数
  praiseCount: {
    type: Number,
    default: 0
  },
  // 收藏数
  starCount: {
    type: Number,
    default: 0
  },
  // 回复数
  replyCount: {
    type: Number,
    default: 0
  },
  // 最后回复人
  repliedBy: {
    type: _mongoose2.default.Types.ObjectId,
    ref: "users"
  },
  // 最后回复时间
  repliedTime: Date,
  // 显示状态 true-正常 false-屏蔽内容
  status: {
    type: Boolean,
    default: true
  },
  // 删除状态 1-删除
  delFlag: {
    type: Boolean,
    default: false
  },
  // 热门回复
  hotReply: {
    type: _mongoose2.default.Types.ObjectId,
    ref: "replys"
  },
  // 举报数
  informCount: {
    type: Number,
    default: 0
  },
  // 是否匿名
  anon: {
    type: Boolean,
    default: false
  },
  hadStar: Boolean,
  hadParise: Boolean
}, {
  timestamps: { createdAt: "createTime", updatedAt: "updateTime" },
  toJSON: { virtuals: true }
});

schema.pre("findOne", function () {
  this.findOne({ delFlag: false }).populate({
    path: "createBy",
    select: "_id username sex avator record email",
    populate: {
      path: "record",
      select: "beCommentCount bePraiseCount beStarCount commentCount pointCount praiseCount starCount topicCount"
    }
  }).populate("classFrom", "_id classname");
});
schema.pre("find", function () {
  this.find({ delFlag: false }).populate("createBy", "_id username sex avator email").populate("classFrom", "_id classname");
});

schema.virtual("reply", {
  ref: "replys",
  localField: "_id",
  foreignField: "topicId",
  justOne: false
});

schema.post("findOne", (() => {
  var _ref = _asyncToGenerator(function* (doc) {
    if (doc) {
      // 如果被屏蔽
      if (!doc.status) {
        doc.content = "**** 涉嫌违规 **** 已被屏蔽 ****";
        // doc.content = doc.content.slice(0, 2) + '**********'
      }

      // 看自己是否收藏
      const starRecord = yield _star2.default.findOne({
        createBy: doc.createBy._id,
        topicId: doc._id,
        status: true
      });
      if (starRecord) {
        doc.hadStar = true;
      } else {
        doc.hadStar = false;
      }

      // 看自己是否点赞
      const pariseRecord = yield _parise2.default.findOne({
        createBy: doc.createBy._id,
        topicId: doc._id,
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
    return _ref.apply(this, arguments);
  };
})());
schema.post("findOneAndUpdate", (() => {
  var _ref2 = _asyncToGenerator(function* (doc) {
    if (doc) {
      // 如果被屏蔽
      if (!doc.status) {
        doc.content = "**** 涉嫌违规 **** 已被屏蔽 ****";
        // doc.content = doc.content.slice(0, 2) + '**********'
      }

      // 看自己是否收藏
      const starRecord = yield _star2.default.findOne({
        createBy: doc.createBy._id,
        topicId: doc._id,
        status: true
      });
      if (starRecord) {
        doc.hadStar = true;
      } else {
        doc.hadStar = false;
      }

      // 看自己是否点赞
      const pariseRecord = yield _parise2.default.findOne({
        createBy: doc.createBy._id,
        topicId: doc._id,
        status: true
      });
      if (pariseRecord) {
        doc.hadParise = true;
      } else {
        doc.hadParise = false;
      }
    }
  });

  return function (_x2) {
    return _ref2.apply(this, arguments);
  };
})());

schema.post("find", (() => {
  var _ref3 = _asyncToGenerator(function* (docs) {
    for (let doc of docs) {
      // 看自己是否收藏
      const starRecord = yield _star2.default.findOne({
        createBy: doc.createBy._id,
        topicId: doc._id,
        status: true
      });
      if (starRecord) {
        doc.hadStar = true;
      } else {
        doc.hadStar = false;
      }

      // 看自己是否点赞
      const pariseRecord = yield _parise2.default.findOne({
        createBy: doc.createBy._id,
        topicId: doc._id,
        status: true
      });
      if (pariseRecord) {
        doc.hadParise = true;
      } else {
        doc.hadParise = false;
      }
    }
  });

  return function (_x3) {
    return _ref3.apply(this, arguments);
  };
})());

schema.post("save", _asyncToGenerator(function* () {
  yield _record2.default.findOneAndUpdate({ createBy: this.createBy }, { $inc: { topicCount: 1 } });
  yield _classes2.default.findOneAndUpdate({ _id: this.classFrom }, { $inc: { topicCount: 1 } });
}));

const Model = _mongoose2.default.model("topics", schema);

exports.default = Model;