/*
能操作message集合数据的Model
 */
// 1.引入mongoose
const mongoose = require('mongoose');

// 2.字义Schema(描述文档结构)
const messageSchema = new mongoose.Schema({
  publisher: String, // 发布人（学校或系统管理员）
  acceptor: String, // 收消息用户的 手机号
  pub_time: String, // 发布时间
  pub_content: Array, // 内容
  isRead:  String, // 是否已读，'0'：未读，'1'：已读
  create_time: {type: Number, default:new Date()} 
});

// 3. 定义Model(与集合对应, 可以操作集合)
const MessageModel = mongoose.model('message', messageSchema);

// 4. 向外暴露Model
module.exports = MessageModel;