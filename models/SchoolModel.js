/*
能操作school集合数据的Model
 */
// 1.引入mongoose
const mongoose = require('mongoose');

// 2.字义Schema(描述文档结构)
const schoolSchema = new mongoose.Schema({
  school: Array, // 学校标识码['所在区域', '学校名称']
  image: Array, // 学校图片
  telephone: String, // 联系电话
  address: String, // 地址
  longitude: String, // 经度
  latitude: String, // 纬度
  trafficGuidance: String, // 交通指引
  openTimeInfoStr: String, // 开放时间介绍
  openAreasInfoStr: String, // 开放区域介绍
  schoolIntroduce: String, // 学校介绍
  reservationNotice: String, // 预约须知
  openBooking: String, // 是否可以预约，'0'：不可以，'1'：可以
  create_time: {type: Number, default:new Date()} 
});

// 3. 定义Model映射(通过映射返回的值对数据库进行增、删、改、查)
const SchoolModel = mongoose.model('schools', schoolSchema);

// 4. 向外暴露Model
module.exports = SchoolModel;