/*
能操作booking_info集合数据的Model
 */
// 1.引入mongoose
const mongoose = require('mongoose');
// const md5 = require('blueimp-md5')

// 2.字义Schema(描述文档结构)
const booking_infoSchema = new mongoose.Schema({
  school_id: String, // 学校的id
  school: Array, // 学校标识码['所在区域', '学校名称']
  open_info_from_form: Object, // 原始表单收集的开放信息
  open_info: Array,  // 开放信息 列表
  isVacation: Boolean, // 设置寒暑假是否开启
  create_time: {type: Number, default:new Date()} 
});

// 3. 定义Model(与集合对应, 可以操作集合)
const BookingInfoModel = mongoose.model('booking_infos', booking_infoSchema);

// 4. 向外暴露Model
module.exports = BookingInfoModel;