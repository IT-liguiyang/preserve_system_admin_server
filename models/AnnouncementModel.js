/*
能操作announcement集合数据的Model
 */
// 1.引入mongoose
const mongoose = require('mongoose');
// const md5 = require('blueimp-md5')

// 2.字义Schema(描述文档结构)
const announcementSchema = new mongoose.Schema({
  publisher: String, // 发布人
  pub_time: String, // 发布时间
  pub_theme: String, // 公告主题
  pub_content: Array, // 内容
  create_time: {type: Number, default:new Date()} 
});

// 3. 定义Model(与集合对应, 可以操作集合)
const AnnouncementModel = mongoose.model('announcements', announcementSchema);

// 4. 向外暴露Model
module.exports = AnnouncementModel;