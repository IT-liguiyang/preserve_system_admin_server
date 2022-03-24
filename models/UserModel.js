/*
能操作user集合数据的Model
 */
// 1.引入mongoose
const mongoose = require('mongoose');
// const md5 = require('blueimp-md5')

// 2.字义Schema(描述文档结构)
const userSchema = new mongoose.Schema({
  username: {type: String, required: true}, // 用户名（手机号）
  // password: {type: String, required: true}, // 密码
  head_portrait: Array, // 用户头像
  realname: String, // 姓名
  ID_number: String, // 身份证号
  address: String, // 住址
  profession: String, // 职业
  realname_authentication: String, // 实名认证
  create_time: {type: Number, default:new Date()}
});

// 3. 定义Model(与集合对应, 可以操作集合)
const UserModel = mongoose.model('users', userSchema);

// 4. 向外暴露Model
module.exports = UserModel;