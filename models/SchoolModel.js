/*
能操作schooladmin集合数据的Model
 */
// 1.引入mongoose
const mongoose = require('mongoose');
// const md5 = require('blueimp-md5')

// 2.字义Schema(描述文档结构)
const schoolSchema = new mongoose.Schema({
  school: Array, // 学校标识码['所在区域', '学校名称']
  address: String, // 地址
  open_areas: Array, // 开放区域
  open_time: Array, // 开放时间
  create_time: {type: Number, default:new Date()} 
});

// 3. 定义Model(与集合对应, 可以操作集合)
const SchoolModel = mongoose.model('schools', schoolSchema);

// 4. 向外暴露Model
module.exports = SchoolModel;