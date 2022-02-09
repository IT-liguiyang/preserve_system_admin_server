/*
用来定义路由的路由器模块
*/
const express = require('express');
const md5 = require('blueimp-md5');

const SCHOOL_LIST = require('../public/static/school-list');

const SchoolAdminModel = require('../models/SchoolAdminModel');
const SystemAdminModel = require('../models/SystemAdminModel');
const SchoolModel = require('../models/SchoolModel');
const AnnouncementModel = require('../models/AnnouncementModel');
const RoleModel = require('../models/RoleModel');

// 得到路由器对象
const router = express.Router();

// 登陆
router.post('/login', (req, res) => {
  const { username, password, admin_role } = req.body;
  console.log(username, password, admin_role);

  // 根据username和password查询数据库users, 如果没有, 返回提示错误的信息, 如果有, 返回登陆成功信息
  if(admin_role === '1'){
    SystemAdminModel.findOne({username, password: md5(password)})
      .then(systemadmin => {
        if (systemadmin) { // 登陆成功
        // 生成一个cookie(systemadminid: systemadmin._id), 并交给浏览器保存
          res.cookie('systemadminid', systemadmin._id, {maxAge: 1000 * 60 * 60 * 24});
          if (systemadmin.role_id) {
            RoleModel.findOne({_id: systemadmin.role_id})
              .then(role => {
                systemadmin._doc.role = role;
                console.log('role user', systemadmin);
                res.send({status: 0, data: systemadmin});
              });
          } else {
            systemadmin._doc.role = {menus: []};
            // 返回登陆成功信息
            res.send({status: 0, data: systemadmin});
          }
        } else {// 登陆失败
          res.send({status: 1, msg: '用户名或密码不正确!'});
        }
      })
      .catch(error => {
        console.error('登陆异常', error);
        res.send({status: 1, msg: '登陆异常, 请重新尝试'});
      });
  }
  if(admin_role === '2'){
    console.log('SchoolAdminModel');
    SchoolAdminModel.findOne({username, password: md5(password)})
      .then(schooladmin => {
        if (schooladmin) { // 登陆成功
        // 生成一个cookie(userid: user._id), 并交给浏览器保存
          res.cookie('schooladminid', schooladmin._id, {maxAge: 1000 * 60 * 60 * 24});
          if (schooladmin.role_id) {
            RoleModel.findOne({_id: schooladmin.role_id})
              .then(role => {
                schooladmin._doc.role = role;
                console.log('role user', schooladmin);
                res.send({status: 0, data: schooladmin});
              });
          } else {
            schooladmin._doc.role = {menus: []};
            // 返回登陆成功信息
            res.send({status: 0, data: schooladmin});
          }
        } else {// 登陆失败
          res.send({status: 1, msg: '用户名或密码不正确!'});
        }
      })
      .catch(error => {
        console.error('登陆异常', error);
        res.send({status: 1, msg: '登陆异常, 请重新尝试'});
      });
  }
});

/**
 * 学校管理员管理
 */
// #region 
// 添加学校管理员
router.post('/schooladmin_register', (req, res) => {
  // 读取请求参数数据
  const { username, password } = req.body;
  // 处理: 判断是否已经存在, 如果存在, 返回提示错误的信息, 如果不存在, 保存
  // 查询(根据username)
  SchoolAdminModel.findOne({username})
    .then(schooladmin => {
      // 如果schooladmin有值(已存在)
      if (schooladmin) {
        // 返回提示错误的信息
        res.send({status: 1, msg: '此管理员账户已存在！'});
        return new Promise(() => {
        });
      } else { // 没值(不存在)
        // 保存
        return SchoolAdminModel.create({...req.body, password: md5(password)});
      }
    })
    .then(schooladmin => {
      // 返回包含schooladmin的json数据
      res.send({status: 0, data: schooladmin});
    })
    .catch(error => {
      console.error('注册异常', error);
      res.send({status: 1, msg: '添加学校管理员异常, 请重新尝试！'});
    });
});

// 获取当前登录用户的全部信息
router.get('/get_current_login_admin', (req, res) => {
  // 读取请求参数数据
  const username = req.query;

  // 查询(根据username)
  SchoolAdminModel.find(username).then(schooladmin => {
    // 返回包含schooladmin的json数据
    res.send({status: 0, data: schooladmin});
  })
    .catch(error => {
      console.error('注册异常', error);
      res.send({status: 1, msg: '添加学校管理员异常, 请重新尝试！'});
    });
});

// 修改学校管理员密码
router.post('/schooladmin_updatepassword', (req, res) => {
  // 读取请求参数数据
  const { username, password } = req.body;
  // 处理: 判断是否已经存在, 如果存在, 返回提示错误的信息, 如果不存在, 保存
  // 查询(根据username)
  SchoolAdminModel.updateOne({username},{$set:{'password':md5(password)}})
    .then(res.send({status: 0, msg: '修改密码成功！请重新登录，即将跳转到登录页面！'}))
    .catch(error => {
      console.error('注册异常', error);
      res.send({status: 1, msg: '添加学校管理员异常, 请重新尝试！'});
    });
});
//#endregion

/**
 * 学校管理
 */
// #region 
// 添加学校
router.post('/manage/school/add', (req, res) => {
  // 读取请求参数数据
  const { school_name } = req.body;

  // const { username, password } = req.body;
  // 处理: 判断是否已经存在, 如果存在, 返回提示错误的信息, 如果不存在, 保存
  // 查询(根据username)
  SchoolModel.findOne({school_name})
    .then(school => {
      // 如果school有值(已存在)
      if (school) {
        // 返回提示错误的信息
        res.send({status: 1, msg: '此学校已存在！'});
        return new Promise(() => {
        });
      } else { // 没值(不存在)
        // 保存
        return SchoolModel.create({...req.body});
      }
    })
    .then(school => {
      // 返回包含school的json数据
      res.send({status: 0, data: school});
    })
    .catch(error => {
      console.error('注册异常', error);
      res.send({status: 1, msg: '添加学校管理员异常, 请重新尝试！'});
    });
});

// 获取学校列表
router.get('/manage/school/list', (req, res) => {
  const {pageNum, pageSize} = req.query;
  SchoolModel.find()
    .then((school) => {
      // console.log(school);
      res.send({status: 0, data: pageFilter(school, pageNum, pageSize)});
    })
    .catch(error => {
      console.error('获取学校列表异常', error);
      res.send({status: 1, msg: '获取学校列表异常, 请重新尝试'});
    });
});

// 更新学校信息
router.post('/manage/school/update', (req, res) => {
  // 读取请求参数数据
  const { schoolObj, schoolId } = req.body; 
  // 处理: 判断是否已经存在, 如果存在, 返回提示错误的信息, 如果不存在, 保存
  // 查询(根据username)
  SchoolModel.updateOne({'_id': schoolId},{$set:schoolObj})
    .then(res.send({status: 0, msg: '修改学校信息成功！'}))
    .catch(error => {
      console.error('修改异常', error);
      res.send({status: 1, msg: '修改学校信息异常, 请重新尝试！'});
    });
});

// 删除学校信息
router.post('/manage/school/delete', (req, res) => {
  const {schoolId} = req.body;
  // console.log(req.body);
  // console.log(schoolId);
  SchoolModel.deleteOne({_id: schoolId})
    .then(res.send({status: 0}))
    .catch(error => {
      console.error('删除异常', error);
      res.send({status: 1, msg: '删除学校信息异常, 请重新尝试！'});
    });
});

// 搜索学校列表
router.get('/manage/school/search', (req, res) => {
  console.log(req.query);
  const {pageNum, pageSize, schoolName, schoolDistrict} = req.query;
  let contition = {};
  if (schoolName) {
    contition = {school_name: new RegExp(`^.*${schoolName}.*$`)};
  } else if (schoolDistrict) {
    // 将区域名转换为区域编号再进行搜索
    const schoolObj = SCHOOL_LIST.find( schoolObj => schoolDistrict == schoolObj.label ) || {};
    contition = {district: new RegExp(`^.*${schoolObj.value}.*$`)};
  }
  SchoolModel.find(contition)
    .then(schools => {
      res.send({status: 0, data: pageFilter(schools, pageNum, pageSize)});
    })
    .catch(error => {
      console.error('搜索学校列表异常', error);
      res.send({status: 1, msg: '搜索学校列表异常, 请重新尝试'});
    });
});
// #endregion

/**
 * 公告模块
 */
// #region 
// 添加公告
router.post('/manage/announcement/add', (req, res) => {
  AnnouncementModel.create({...req.body}).then(
    res.send({status: 0, msg: '添加成功'})
  ).catch(error => {
    console.error('添加公告异常', error);
    res.send({status: 1, msg: '添加公告异常, 请重新尝试！'});
  });
});

// 获取公告列表
router.get('/manage/announcement/list', (req, res) => {
  const {pageNum, pageSize} = req.query;
  // 查询并根据发布时间进行排序
  AnnouncementModel.find().sort({'pub_time':-1})
    .then((announcement) => {
      // console.log(announcement);
      res.send({status: 0, data: pageFilter(announcement, pageNum, pageSize)});
    })
    .catch(error => {
      console.error('获取公告列表异常', error);
      res.send({status: 1, msg: '获取公告列表异常, 请重新尝试'});
    });
});

// 更新公告信息
router.post('/manage/announcement/update', (req, res) => {
  // 读取请求参数数据
  const { announcementObj, announcementId } = req.body; 
  // 查询(根据_id)
  AnnouncementModel.updateOne({'_id': announcementId},{$set:announcementObj})
    .then(res.send({status: 0, msg: '修改公告信息成功！'}))
    .catch(error => {
      console.error('修改异常', error);
      res.send({status: 1, msg: '修改公告信息异常, 请重新尝试！'});
    });
});

// 删除学校信息
router.post('/manage/announcement/delete', (req, res) => {
  const {announcementId} = req.body;
  // console.log(req.body);
  // console.log(announcementId);
  AnnouncementModel.deleteOne({_id: announcementId})
    .then(res.send({status: 0}))
    .catch(error => {
      console.error('删除异常', error);
      res.send({status: 1, msg: '删除公告信息异常, 请重新尝试！'});
    });
});

// 搜索产品列表
router.get('/manage/announcement/search', (req, res) => {
  console.log(req.query);
  const {pageNum, pageSize, announcementTheme, announcementPublisher} = req.query;
  let contition = {};
  if (announcementTheme) {
    contition = {pub_theme: new RegExp(`^.*${announcementTheme}.*$`)};
  } else if (announcementPublisher) {
    contition = {publisher: new RegExp(`^.*${announcementPublisher}.*$`)};
  }
  AnnouncementModel.find(contition)
    .then(announcements => {
      res.send({status: 0, data: pageFilter(announcements, pageNum, pageSize)});
    })
    .catch(error => {
      console.error('搜索公告列表异常', error);
      res.send({status: 1, msg: '搜索公告列表异常, 请重新尝试'});
    });
});
// #endregion

/*
得到指定数组的分页信息对象
 */
function pageFilter(arr, pageNum, pageSize) {
  pageNum = pageNum * 1;
  pageSize = pageSize * 1;
  const total = arr.length;
  const pages = Math.floor((total + pageSize - 1) / pageSize);
  const start = pageSize * (pageNum - 1);
  const end = start + pageSize <= total ? start + pageSize : total;
  const list = [];
  for (var i = start; i < end; i++) {
    list.push(arr[i]);
  }

  return {
    pageNum,
    total,
    pages,
    pageSize,
    list
  };
}

require('./file-upload')(router);

module.exports = router;