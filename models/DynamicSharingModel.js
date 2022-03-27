/*
能操作dynamic_sharing集合数据的Model
 */
// 1.引入mongoose
const mongoose = require('mongoose');
// const md5 = require('blueimp-md5')

// 2.字义Schema(描述文档结构)
const dynamic_sharingSchema = new mongoose.Schema({
  publish_username: String, // 发布人(手机号)
  publish_realname: String, // 发布人(姓名)
  publish_avater: Array, // 发布人头像
  pub_time: String, // 发布时间
  pub_content: Array, // 内容
  image_list: Array, // 图片（数组） 
  love: Array, // 点赞（存放点赞人姓名的数组）
  comment: Array, // 评论（数组）
  create_time: {type: Number, default:new Date()} 
});

// 3. 定义Model(与集合对应, 可以操作集合)
const DynamicSharingModel = mongoose.model('dynamic_sharings', dynamic_sharingSchema);

// 4. 向外暴露Model
module.exports = DynamicSharingModel;