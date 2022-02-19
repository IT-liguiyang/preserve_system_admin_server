/*
能操作schooladmin集合数据的Model
 */
// 1.引入mongoose
const mongoose = require('mongoose');
// const md5 = require('blueimp-md5')

// 2.字义Schema(描述文档结构)
const schooladminSchema = new mongoose.Schema({
  username: {type: String, required: true}, // 用户名（手机号）
  password: {type: String, required: true}, // 密码
  realname: String, // 姓名
  school: Array, // 学校标识码['区编号', '学校代码']
  ID_number:String, // 身份证号
  role_id: String,
  auth_time: String, // 授权时间
  auth_person: String, // 授权时间
  auth_menus: Array, // 所有有权限操作的菜单path的数组
  create_time: {type: Number, default:new Date()}
});

// 3. 定义Model(与集合对应, 可以操作集合)
const SchoolAdminModel = mongoose.model('school_admins', schooladminSchema);

// 4. 向外暴露Model
module.exports = SchoolAdminModel;