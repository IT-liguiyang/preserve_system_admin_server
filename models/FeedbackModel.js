/*
能操作news集合数据的Model
 */
// 1.引入mongoose
const mongoose = require('mongoose');

// 2.字义Schema(描述文档结构)
const feedbackSchema = new mongoose.Schema({
  pub_username: String, // 发布人手机号
  pub_realname: String, // 发布人姓名
  type: String, // 意见反馈类型
  acceptor: String, // 受理人
  pub_time: String, // 发布时间
  pub_content: String, // 内容
  image_list: Array, // 图片（数组） 
  create_time: {type: Number, default:new Date()} 
});

// 3. 定义Model(与集合对应, 可以操作集合)
const FeedbackModel = mongoose.model('feedback', feedbackSchema);

// 4. 向外暴露Model
module.exports = FeedbackModel;