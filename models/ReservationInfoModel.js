/*
能操作news集合数据的Model
 */
// 1.引入mongoose
const mongoose = require('mongoose');

// 2.字义Schema(描述文档结构)
const reservation_infoSchema = new mongoose.Schema({
  res_realname: String, // 姓名
  res_username: String, // 手机号
  submit_time: String, // 提交时间
  res_school: String, // 已约学校
  res_area: String, // 已约场地
  res_time: String, // 已约时间
  has_partners: String, // 是否有同行人
  partnerts_relation: String, // 同行人关系
  vehicle: String, // 交通方式
  has_agreed_safety_commitment: String, // 是否同意安全承诺
  has_agreed_antiepidemic_commitment: String, // 是否同意防疫承诺
  create_time: {type: Number, default:new Date()} 
});

// 3. 定义Model(与集合对应, 可以操作集合)
const ReservationInfoModel = mongoose.model('reservation_info', reservation_infoSchema);

// 4. 向外暴露Model
module.exports = ReservationInfoModel;