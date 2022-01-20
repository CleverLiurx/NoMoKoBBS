"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _mongoose = require("mongoose");

var _mongoose2 = _interopRequireDefault(_mongoose);

var _mongo = require("../../config/mongo");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = () => {
  return new Promise((resolve, reject) => {
    _mongoose2.default.connect(_mongo.connectionString, { config: _mongo.options }).then(() => {
      const db = _mongoose2.default.connection;
      resolve(db);
    }).catch(e => reject(e));
  });
};