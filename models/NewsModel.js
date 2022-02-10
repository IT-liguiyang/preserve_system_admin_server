/*
能操作news集合数据的Model
 */
// 1.引入mongoose
const mongoose = require('mongoose');

// 2.字义Schema(描述文档结构)
const newsSchema = new mongoose.Schema({
  publisher: String, // 发布人
  pub_time: String, // 发布时间
  pub_theme: String, // 公告主题
  pub_content: Array, // 内容
  create_time: {type: Number, default:new Date()} 
});

// 3. 定义Model(与集合对应, 可以操作集合)
const NewsModel = mongoose.model('news', newsSchema);

// 4. 向外暴露Model
module.exports = NewsModel;