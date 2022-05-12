/*
能操作news集合数据的Model
 */
// 1.引入mongoose
const mongoose = require('mongoose');

// 2.字义Schema(描述文档结构)
const reservation_infoSchema = new mongoose.Schema({
  res_realname: String, // 姓名
  res_username: String, // 手机号
  ID_number: String, // 身份证号
  res_avater: Array, // 用户头像
  res_school_name: String, // 已约学校
  res_school_id: String, // 已约学校编号
  res_date: String, // 已约日期
  res_place: String, // 已约场地
  res_time: String, // 已约时段
  vehicle: String, // 交通方式
  status: String, // 预约状态，canceled 为已取消，using 为正常，finished 为已完成，unuse 为未使用
  submit_time: String, // 提交时间
  comment: Array, // 评论
  create_time: {type: Number, default:new Date()} 
});

// 3. 定义Model(与集合对应, 可以操作集合)
const ReservationInfoModel = mongoose.model('reservation_info', reservation_infoSchema);

// 4. 向外暴露Model
module.exports = ReservationInfoModel;