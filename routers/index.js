/*
用来定义路由的路由器模块
*/
const express = require('express');
const md5 = require('blueimp-md5');

// const SCHOOL_LIST = require('../public/static/school-list');

const SchoolAdminModel = require('../models/SchoolAdminModel');
const SystemAdminModel = require('../models/SystemAdminModel');
const SchoolModel = require('../models/SchoolModel');
const AnnouncementModel = require('../models/AnnouncementModel');
const NewsModel = require('../models/NewsModel');
const DynamicSharingModel = require('../models/DynamicSharingModel');
const OpinionsSuggestionsModel = require('../models/OpinionsSuggestionsModel');
const ReservationInfoModel = require('../models/ReservationInfoModel');
const UserModel = require('../models/UserModel');

// 得到路由器对象
const router = express.Router();

// 登陆
router.post('/login', (req, res) => {
  const { username, password, role_id } = req.body;
  console.log(username, password, role_id);

  // 根据username和password查询数据库users, 如果没有, 返回提示错误的信息, 如果有, 返回登陆成功信息
  if(role_id === '1'){
    SystemAdminModel.findOne({username, password: md5(password)})
      .then(systemadmin => {
        if (systemadmin) { // 登陆成功
        // 生成一个cookie(systemadminid: systemadmin._id), 并交给浏览器保存
          res.cookie('systemadminid', systemadmin._id, {maxAge: 1000 * 60 * 60 * 24});
          // 返回登陆成功信息
          res.send({status: 0, data: systemadmin});
          
        } else {// 登陆失败
          res.send({status: 1, msg: '用户名或密码不正确!'});
        }
      })
      .catch(error => {
        console.error('登陆异常', error);
        res.send({status: 1, msg: '登陆异常, 请重新尝试'});
      });
  }
  if(role_id === '2'){
    console.log('SchoolAdminModel');
    SchoolAdminModel.findOne({username, password: md5(password)})
      .then(schooladmin => {
        if (schooladmin) { // 登陆成功
          // 生成一个cookie(userid: user._id), 并交给浏览器保存
          res.cookie('schooladminid', schooladmin._id, {maxAge: 1000 * 60 * 60 * 24});
          // 返回登陆成功信息
          res.send({status: 0, data: schooladmin});
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
 * 获取首页相关信息
 */
//#region 
// 获取各模块数量信息
router.get('/welcome', async (req, res) => {
  let numberObj = [];
  // 获取用户列表长度
  await UserModel.find().then(users => {
    numberObj.push({'usersLength':users.length});
  }).catch(error => {
    console.error('获取用户列表长度异常', error);
    res.send({status: 1, msg: '获取用户列表长度异常, 请重新尝试'});
  });
  // 获取学校列表长度
  await SchoolModel.find().then(schools => {
    numberObj.push({'schoolsLength':schools.length});
  }).catch(error => {
    console.error('获取学校列表长度异常', error);
    res.send({status: 1, msg: '获取学校列表长度异常, 请重新尝试'});
  });
  // 获取公告列表长度
  await AnnouncementModel.find().then(announcements => {
    numberObj.push({'announcementsLength':announcements.length});
  }).catch(error => {
    console.error('获取公告列表长度异常', error);
    res.send({status: 1, msg: '获取公告列表长度异常, 请重新尝试'});
  });
  // 获取新闻列表长度
  await NewsModel.find().then(news => {
    numberObj.push({'newsLength':news.length});
  }).catch(error => {
    console.error('获取新闻列表长度异常', error);
    res.send({status: 1, msg: '获取新闻列表长度异常, 请重新尝试'});
  });
  // 动态分享列表长度
  await DynamicSharingModel.find().then(dynamic_sharings => {
    numberObj.push({'dynamic_sharingsLength':dynamic_sharings.length});
  }).catch(error => {
    console.error('获取动态分享列表长度异常', error);
    res.send({status: 1, msg: '获取动态分享列表长度异常, 请重新尝试'});
  });
  // 获取意见建议列表长度
  await OpinionsSuggestionsModel.find().then(opinions_suggestions => {
    numberObj.push({'opinions_suggestionsLength':opinions_suggestions.length});
  }).catch(error => {
    console.error('获取意见建议列表长度异常', error);
    res.send({status: 1, msg: '获取意见建议列表长度异常, 请重新尝试'});
  });
  // 获取预约信息列表长度
  await ReservationInfoModel.find().then(reservation_infos => {
    numberObj.push({'reservation_infosLength':reservation_infos.length});
  }).catch(error => {
    console.error('获取预约信息列表长度异常', error);
    res.send({status: 1, msg: '获取预约信息列表长度异常, 请重新尝试'});
  });
  // 获取学校管理员列表长度
  await SchoolAdminModel.find().then(school_admins => {
    numberObj.push({'school_adminsLength':school_admins.length});
  }).catch(error => {
    console.error('获取学校管理员列表长度异常', error);
    res.send({status: 1, msg: '获取学校管理员列表长度异常, 请重新尝试'});
  });
  // 获取系统管理员列表长度
  await SystemAdminModel.find().then(system_admins => {
    numberObj.push({'system_adminsLength':system_admins.length});
  }).catch(error => {
    console.error('获取系统管理员列表长度异常', error);
    res.send({status: 1, msg: '获取系统管理员列表长度异常, 请重新尝试'});
  });
  res.send(numberObj);
});

// 获取系统公告
// 搜索学校管理员列表
router.get('/system_announcement', (req, res) => {
  AnnouncementModel.find({publisher: new RegExp(`^.*${'系统管理员'}.*$`)})
    .then(announcement => {
      res.send({status: 0, data: announcement});
    })
    .catch(error => {
      console.error('搜索系统公告列表异常', error);
      res.send({status: 1, msg: '搜索系统公告列表异常, 请重新尝试'});
    });
});
//#endregion

/**
 * 登录注册管理
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
  const { username, role_id }  = req.query;
  if (role_id === '1') {
    // 查询(根据username)
    SystemAdminModel.find({'username':username}).then(systemadmin => {
      // 返回包含schooladmin的json数据
      res.send({status: 0, data: systemadmin});
    })
      .catch(error => {
        console.error('获取异常', error);
        res.send({status: 1, msg: '获取学校管理员信息异常, 请重新尝试！'});
      });
  }else{
    // 查询(根据username)
    SchoolAdminModel.find({'username':username}).then(schooladmin => {
    // 返回包含schooladmin的json数据
      res.send({status: 0, data: schooladmin});
    })
      .catch(error => {
        console.error('获取异常', error);
        res.send({status: 1, msg: '添加系统管理员信息异常, 请重新尝试！'});
      });
  }
});

// 修改学校管理员密码
router.post('/update_admin_password', (req, res) => {
  // 读取请求参数数据
  const { username, password, role_id } = req.body;
  // 处理: 判断是否已经存在, 如果存在, 返回提示错误的信息, 如果不存在, 保存
  // 查询(根据username)
  if (role_id === '1'){
    SystemAdminModel.updateOne({username},{$set:{'password':md5(password)}})
      .then(res.send({status: 0, msg: '修改密码成功！请重新登录，即将跳转到登录页面！'}))
      .catch(error => {
        console.error('注册异常', error);
        res.send({status: 1, msg: '添加学校管理员异常, 请重新尝试！'});
      });                                 
  }else{
    SchoolAdminModel.updateOne({username},{$set:{'password':md5(password)}})
      .then(res.send({status: 0, msg: '修改密码成功！请重新登录，即将跳转到登录页面！'}))
      .catch(error => {
        console.error('注册异常', error);
        res.send({status: 1, msg: '添加学校管理员异常, 请重新尝试！'});
      });
  }
});
//#endregion

/**
 * 学校管理
 */
// #region 
// 添加学校
router.post('/manage/school/add', (req, res) => {
  // 读取请求参数数据
  const { school } = req.body;
  // const school_name = school[1];

  console.log(school);

  // 处理: 判断是否已经存在, 如果存在, 返回提示错误的信息, 如果不存在, 保存
  // 查询(根据username)
  SchoolModel.findOne({school})
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
  console.log(schoolObj, schoolId);
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
  const {pageNum, pageSize, schoolName, schoolDistrict, openAreas} = req.query;
  let contition = {};
  if (schoolName) {
    // 按学校名称搜索
    contition = {school: new RegExp(`^.*${schoolName}.*$`)};  
  } else if (schoolDistrict) {
    // 按所在区域搜索
    contition = {school: new RegExp(`^.*${schoolDistrict}.*$`)};
  } else if (openAreas) {
    // 按所在区域搜索
    contition = {openAreasInfoStr: new RegExp(`^.*${openAreas}.*$`)};
    SchoolModel.find(contition)
      .then(schools => {
        res.send({status: 0, data: pageFilter(schools, pageNum, pageSize)});
      })
      .catch(error => {
        console.error('搜索学校列表异常', error);
        res.send({status: 1, msg: '搜索学校列表异常, 请重新尝试'});
      });
    return;
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

// 获取指定发布者的公告列表
router.get('/manage/announcement/search_by_publisher', (req, res) => {
  const {publisher} = req.query;
  console.log(publisher);
  // 查询并根据发布时间进行排序
  AnnouncementModel.find({publisher: publisher}).sort({'pub_time':-1})
    .then((announcement) => {
      res.send({status: 0, data: announcement});
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

/**
 * 新闻模块
 */
// #region 
// 添加新闻
router.post('/manage/news/add', (req, res) => {
  NewsModel.create({...req.body}).then(
    res.send({status: 0, msg: '添加成功'})
  ).catch(error => {
    console.error('添加新闻异常', error);
    res.send({status: 1, msg: '添加新闻异常, 请重新尝试！'});
  });
});

// 获取新闻列表
router.get('/manage/news/list', (req, res) => {
  const {pageNum, pageSize} = req.query;
  // 查询并根据发布时间进行排序
  NewsModel.find().sort({'real_pub_time':1})
    .then((news) => {
      // console.log(news);
      res.send({status: 0, data: pageFilter(news, pageNum, pageSize)});
    })
    .catch(error => {
      console.error('获取新闻列表异常', error);
      res.send({status: 1, msg: '获取新闻列表异常, 请重新尝试'});
    });
});

// 小程序获取新闻列表（不带分页）
router.get('/wechat/news/list', (req, res) => {
  // 查询并根据发布时间进行排序
  NewsModel.find().sort({real_pub_time:1})
    .then((news) => {
      // console.log(news);
      res.send({status: 0, data: news});
    })
    .catch(error => {
      console.error('获取新闻列表异常', error);
      res.send({status: 1, msg: '获取新闻列表异常, 请重新尝试'});
    });
});

// 更新新闻信息
router.post('/manage/news/update', (req, res) => {
  // 读取请求参数数据
  const { newsObj, newsId } = req.body; 
  // 查询(根据_id)
  NewsModel.updateOne({'_id': newsId},{$set:newsObj})
    .then(res.send({status: 0, msg: '修改新闻信息成功！'}))
    .catch(error => {
      console.error('修改异常', error);
      res.send({status: 1, msg: '修改新闻信息异常, 请重新尝试！'});
    });
});

// 删除新闻信息
router.post('/manage/news/delete', (req, res) => {
  const {newsId} = req.body;
  // console.log(req.body);
  NewsModel.deleteOne({_id: newsId})
    .then(res.send({status: 0}))
    .catch(error => {
      console.error('删除异常', error);
      res.send({status: 1, msg: '删除新闻信息异常, 请重新尝试！'});
    });
});

// 搜索新闻列表
router.get('/manage/news/search', (req, res) => {
  console.log(req.query);
  const {pageNum, pageSize, newsTheme, newsPublisher} = req.query;
  let contition = {};
  if (newsTheme) {
    contition = {pub_theme: new RegExp(`^.*${newsTheme}.*$`)};
  } else if (newsPublisher) {
    contition = {publisher: new RegExp(`^.*${newsPublisher}.*$`)};
  }
  NewsModel.find(contition).sort({real_pub_time:1})
    .then(news => {
      res.send({status: 0, data: pageFilter(news, pageNum, pageSize)});
    })
    .catch(error => {
      console.error('搜索新闻列表异常', error);
      res.send({status: 1, msg: '搜索新闻列表异常, 请重新尝试'});
    });
});

// 小程序搜索新闻列表
router.get('/wechat/news/search', (req, res) => {
  console.log(req.query);
  const {newsTheme, newsPublisher} = req.query;
  let contition = {};
  if (newsTheme) {
    contition = {pub_theme: new RegExp(`^.*${newsTheme}.*$`)};
  } else if (newsPublisher) {
    contition = {publisher: new RegExp(`^.*${newsPublisher}.*$`)};
  }
  NewsModel.find(contition).sort({real_pub_time:1})
    .then(news => {
      res.send({status: 0, data: news});
    })
    .catch(error => {
      console.error('搜索新闻列表异常', error);
      res.send({status: 1, msg: '搜索新闻列表异常, 请重新尝试'});
    });
});
// #endregion

/**
 * 动态分享模块
 */
// #region 
// 添加动态分享
router.post('/manage/dynamic_sharing/add', (req, res) => {
  DynamicSharingModel.create({...req.body}).then(
    res.send({status: 0, msg: '添加成功'})
  ).catch(error => {
    console.error('添加动态分享异常', error);
    res.send({status: 1, msg: '添加动态分享异常, 请重新尝试！'});
  });
});

// 获取动态分享列表
router.get('/manage/dynamic_sharing/list', (req, res) => {
  const {pageNum, pageSize} = req.query;
  // 查询并根据发布时间进行排序
  DynamicSharingModel.find().sort({'pub_time':-1})
    .then((dynamic_sharings) => {
      // console.log(dynamic_sharings);
      res.send({status: 0, data: pageFilter(dynamic_sharings, pageNum, pageSize)});
    })
    .catch(error => {
      console.error('获取动态分享列表异常', error);
      res.send({status: 1, msg: '获取动态分享列表异常, 请重新尝试'});
    });
});

// 获取动态分享列表
router.get('/wechat/dynamic_sharing/list', (req, res) => {
  // 查询并根据发布时间进行排序
  DynamicSharingModel.find().sort({'pub_time':-1})
    .then((dynamic_sharings) => {
      // console.log(dynamic_sharings);
      res.send({status: 0, data: dynamic_sharings});
    })
    .catch(error => {
      console.error('获取动态分享列表异常', error);
      res.send({status: 1, msg: '获取动态分享列表异常, 请重新尝试'});
    });
});

/**
 通过_id查询学校信息动态信息
 */
router.post('/manage/dynamic_info_by_id', (req, res) => {
  // 读取请求参数数据
  const { dynamic_sharingId } = req.body;

  DynamicSharingModel.find({_id: dynamic_sharingId})
    .then(dynamic => { res.send({status: 0, data: dynamic});})
    .catch(error => {
      console.error('通过id查询学校信息动态信息异常', error);
      res.send({status: 1, msg: '通过id查询学校信息动态信息异常, 请重新尝试'});
    });
});

// 更新动态分享信息
router.post('/manage/dynamic_sharing/update', (req, res) => {
  // 读取请求参数数据
  const { dynamic_sharingObj, dynamic_sharingId } = req.body; 
  console.log(dynamic_sharingObj, dynamic_sharingId);
  // 查询(根据_id)
  DynamicSharingModel.updateOne({'_id':dynamic_sharingId},{$set:dynamic_sharingObj})
    .then(res.send({status: 0, msg: '修改动态分享信息成功！'}))
    .catch(error => {
      console.error('修改异常', error);
      res.send({status: 1, msg: '修改动态分享信息异常, 请重新尝试！'});
    });
});

// 删除动态分享信息
router.post('/manage/dynamic_sharing/delete', (req, res) => {
  const {dynamic_sharingId} = req.body;
  // console.log(req.body);
  DynamicSharingModel.deleteOne({_id: dynamic_sharingId})
    .then(res.send({status: 0}))
    .catch(error => {
      console.error('删除异常', error);
      res.send({status: 1, msg: '删除动态分享信息异常, 请重新尝试！'});
    });
});

// 搜索动态分享列表
router.get('/manage/dynamic_sharing/search', (req, res) => {
  console.log(req.query);
  const {pageNum, pageSize, dynamic_sharingTheme, dynamic_sharingPublisher} = req.query;
  let contition = {};
  if (dynamic_sharingTheme) {
    contition = {pub_theme: new RegExp(`^.*${dynamic_sharingTheme}.*$`)};
  } else if (dynamic_sharingPublisher) {
    contition = {publisher: new RegExp(`^.*${dynamic_sharingPublisher}.*$`)};
  }
  DynamicSharingModel.find(contition)
    .then(dynamic_sharing => {
      res.send({status: 0, data: pageFilter(dynamic_sharing, pageNum, pageSize)});
    })
    .catch(error => {
      console.error('搜索动态分享列表异常', error);
      res.send({status: 1, msg: '搜索动态分享列表异常, 请重新尝试'});
    });
});
// #endregion

/**
 * 意见建议模块
 */
// #region 
// 添加意见建议
router.post('/manage/opinions_suggestions/add', (req, res) => {
  OpinionsSuggestionsModel.create({...req.body}).then(
    res.send({status: 0, msg: '添加成功'})
  ).catch(error => {
    console.error('添加意见建议异常', error);
    res.send({status: 1, msg: '添加意见建议异常, 请重新尝试！'});
  });
});

// 获取意见建议列表
router.get('/manage/opinions_suggestions/list', (req, res) => {
  const {pageNum, pageSize} = req.query;
  // 查询并根据发布时间进行排序
  OpinionsSuggestionsModel.find().sort({'pub_time':-1})
    .then((opinions_suggestions) => {
      // console.log(news);
      res.send({status: 0, data: pageFilter(opinions_suggestions, pageNum, pageSize)});
    })
    .catch(error => {
      console.error('获取意见建议列表异常', error);
      res.send({status: 1, msg: '获取意见建议列表异常, 请重新尝试'});
    });
});

// 更新意见建议信息
router.post('/manage/opinions_suggestions/update', (req, res) => {
  // 读取请求参数数据
  const { opinions_suggestionsObj, opinions_suggestionsId } = req.body; 
  // 查询(根据_id)
  OpinionsSuggestionsModel.updateOne({'_id': opinions_suggestionsId},{$set:opinions_suggestionsObj})
    .then(res.send({status: 0, msg: '修改意见建议信息成功！'}))
    .catch(error => {
      console.error('修改异常', error);
      res.send({status: 1, msg: '修改意见建议信息异常, 请重新尝试！'});
    });
});

// 删除意见建议信息
router.post('/manage/opinions_suggestions/delete', (req, res) => {
  const {opinions_suggestionsId} = req.body;
  // console.log(req.body);
  OpinionsSuggestionsModel.deleteOne({_id: opinions_suggestionsId})
    .then(res.send({status: 0}))
    .catch(error => {
      console.error('删除异常', error);
      res.send({status: 1, msg: '删除意见建议信息异常, 请重新尝试！'});
    });
});

// 搜索意见建议列表
router.get('/manage/opinions_suggestions/search', (req, res) => {
  console.log(req.query);
  const {pageNum, pageSize, opinions_suggestionsTheme, opinions_suggestionsPublisher} = req.query;
  let contition = {};
  if (opinions_suggestionsTheme) {
    contition = {pub_theme: new RegExp(`^.*${opinions_suggestionsTheme}.*$`)};
  } else if (opinions_suggestionsPublisher) {
    contition = {pub_realname: new RegExp(`^.*${opinions_suggestionsPublisher}.*$`)};
  }
  OpinionsSuggestionsModel.find(contition)
    .then(opinions_suggestions => {
      res.send({status: 0, data: pageFilter(opinions_suggestions, pageNum, pageSize)});
    })
    .catch(error => {
      console.error('搜索意见建议列表异常', error);
      res.send({status: 1, msg: '搜索意见建议列表异常, 请重新尝试'});
    });
});
// #endregion

/**
 * 预约信息模块
 */
// #region 
// 添加预约信息
router.post('/manage/reservation_info/add', (req, res) => {
  ReservationInfoModel.create({...req.body}).then(
    res.send({status: 0, msg: '添加成功'})
  ).catch(error => {
    console.error('添加预约信息异常', error);
    res.send({status: 1, msg: '添加预约信息异常, 请重新尝试！'});
  });
});

// 获取预约信息列表
router.get('/manage/reservation_info/list', (req, res) => {
  const {pageNum, pageSize} = req.query;
  // 查询并根据发布时间进行排序
  // ReservationInfoModel.find().sort({'pub_time':-1})
  ReservationInfoModel.find()
    .then((reservation_info) => {
    // console.log(news);
      res.send({status: 0, data: pageFilter(reservation_info, pageNum, pageSize)});
    })
    .catch(error => {
      console.error('获取预约信息列表异常', error);
      res.send({status: 1, msg: '获取预约信息列表异常, 请重新尝试'});
    });
});

// 更新预约信息信息
router.post('/manage/reservation_info/update', (req, res) => {
  // 读取请求参数数据
  const { reservation_infoObj, reservation_infoId } = req.body; 
  // 查询(根据_id)
  ReservationInfoModel.updateOne({'_id': reservation_infoId},{$set:reservation_infoObj})
    .then(res.send({status: 0, msg: '修改预约信息成功！'}))
    .catch(error => {
      console.error('修改异常', error);
      res.send({status: 1, msg: '修改预约信息异常, 请重新尝试！'});
    });
});

// 删除预约信息信息
router.post('/manage/reservation_info/delete', (req, res) => {
  const {reservation_infoId} = req.body;
  // console.log(req.body);
  ReservationInfoModel.deleteOne({_id: reservation_infoId})
    .then(res.send({status: 0}))
    .catch(error => {
      console.error('删除异常', error);
      res.send({status: 1, msg: '删除预约信息信息异常, 请重新尝试！'});
    });
});

// 搜索预约信息列表
router.get('/manage/reservation_info/search', (req, res) => {
  console.log(req.query);
  const {pageNum, pageSize, reservation_info_School, reservation_info_Name} = req.query;
  let contition = {};
  if (reservation_info_School) { // 按已约学校搜索
    contition = {res_school: new RegExp(`^.*${reservation_info_School}.*$`)};
  } else if (reservation_info_Name) {  // 按预约姓名搜索
    contition = {res_realname: new RegExp(`^.*${reservation_info_Name}.*$`)};
  }
  ReservationInfoModel.find(contition)
    .then(reservation_info => {
      res.send({status: 0, data: pageFilter(reservation_info, pageNum, pageSize)});
    })
    .catch(error => {
      console.error('搜索预约信息列表异常', error);
      res.send({status: 1, msg: '搜索预约信息列表异常, 请重新尝试'});
    });
});
// #endregion

/**
 * 用户模块
 */
// #region 
// 添加用户
router.post('/manage/user/add', (req, res) => {
  // 读取请求参数数据
  const { username } = req.body;

  // 处理: 判断是否已经存在, 如果存在, 返回提示错误的信息, 如果不存在, 保存
  // 查询(根据username)
  UserModel.findOne({username})
    .then(user => {
      // 如果user有值(已存在)
      if (user) {
        // 返回提示错误的信息
        res.send({status: 1, msg: '此账户已存在！'});
        return new Promise(() => {
        });
      } else { // 没值(不存在)
        return UserModel.create({...req.body});
      }
    })
    .then(user => {
      // 返回包含user的json数据
      res.send({status: 0, data: user});
    })
    .catch(error => {
      console.error('注册异常', error);
      res.send({status: 1, msg: '添加用户异常, 请重新尝试！'});
    });
});

// 获取指定用户名用户信息
router.get('/manage/user/current', (req, res) => {
  const { username } = req.query;
  console.log(username);
  // 查询并根据发布时间进行排序
  UserModel.find({'username':username}).then(user => {
    // 返回包含user的json数据
    res.send({status: 0, data: user});
  })
    .catch(error => {
      console.error('获取用户异常', error);
      res.send({status: 1, msg: '获取用户异常, 请重新尝试'});
    });
});

// 获取用户列表
router.get('/manage/user/list', (req, res) => {
  const {pageNum, pageSize} = req.query;
  // 查询并根据发布时间进行排序
  // ReservationInfoModel.find().sort({'pub_time':-1})
  UserModel.find()
    .then((user) => {
    // console.log(news);
      res.send({status: 0, data: pageFilter(user, pageNum, pageSize)});
    })
    .catch(error => {
      console.error('获取用户列表异常', error);
      res.send({status: 1, msg: '获取用户列表异常, 请重新尝试'});
    });
});

// 更新用户信息
router.post('/manage/user/update', (req, res) => {
  console.log('请求更新用户信息');
  // 读取请求参数数据
  const { userObj, userId } = req.body;
  console.log(userObj, userId);
  // 查询(根据_id)
  UserModel.updateOne({'_id': userId},{$set:userObj})
    .then(res.send({status: 0, msg: '修改用户信息成功！'}))
    .catch(error => {
      console.error('修改异常', error);
      res.send({status: 1, msg: '修改用户信息异常, 请重新尝试！'});
    });
});

// 删除用户信息
router.post('/manage/user/delete', (req, res) => {
  const {userId} = req.body;
  // console.log(req.body);
  UserModel.deleteOne({_id: userId})
    .then(res.send({status: 0}))
    .catch(error => {
      console.error('删除异常', error);
      res.send({status: 1, msg: '删除用户信息异常, 请重新尝试！'});
    });
});

// 搜索用户列表
router.get('/manage/user/search', (req, res) => {
  console.log(req.query);
  const {pageNum, pageSize, username, realname} = req.query;
  let contition = {};
  if (username) { // 按账号搜索
    contition = {username: new RegExp(`^.*${username}.*$`)};
  } else if (realname) {  // 按预约姓名搜索
    contition = {realname: new RegExp(`^.*${realname}.*$`)};
  }
  UserModel.find(contition)
    .then(user => {
      res.send({status: 0, data: pageFilter(user, pageNum, pageSize)});
    })
    .catch(error => {
      console.error('搜索用户列表异常', error);
      res.send({status: 1, msg: '搜索用户列表异常, 请重新尝试'});
    });
});
// #endregion

/**
 * 学校管理员模块
 */
// #region 
// 添加学校管理员
router.post('/manage/school_admin/add', (req, res) => {
  // 读取请求参数数据
  const { username, password } = req.body;

  // 处理: 判断是否已经存在, 如果存在, 返回提示错误的信息, 如果不存在, 保存
  // 查询(根据username)
  SchoolAdminModel.findOne({username})
    .then(school_admin => {
      // 如果school_admin有值(已存在)
      if (school_admin) {
        // 返回提示错误的信息
        res.send({status: 1, msg: '此学校管理员已存在，请重新输入！'});
        return new Promise(() => {
        });
      } else { // 没值(不存在)
        return SchoolAdminModel.create({...req.body, password: md5(password)});
      }
    })
    .then(school_admin => {
      // 返回包含school_admin的json数据
      res.send({status: 0, data: school_admin});
    })
    .catch(error => {
      console.error('注册异常', error);
      res.send({status: 1, msg: '添加学校管理员异常, 请重新尝试！'});
    });
});

// 获取学校管理员列表
router.get('/manage/school_admin/list', (req, res) => {
  const {pageNum, pageSize} = req.query;
  // 查询并根据发布时间进行排序
  // ReservationInfoModel.find().sort({'pub_time':-1})
  SchoolAdminModel.find()
    .then((school_admin) => {
    // console.log(news);
      res.send({status: 0, data: pageFilter(school_admin, pageNum, pageSize)});
    })
    .catch(error => {
      console.error('获取学校管理员列表异常', error);
      res.send({status: 1, msg: '获取学校管理员列表异常, 请重新尝试'});
    });
});

// 更新学校管理员信息
router.post('/manage/school_admin/update', (req, res) => {
  // 读取请求参数数据
  // const { school_adminObj, school_adminId, password } = req.body; 
  const { school_adminObj, school_adminId } = req.body; 
  // 查询(根据_id)
  SchoolAdminModel.updateOne({'_id': school_adminId},{$set:{...school_adminObj}})
    .then(res.send({status: 0, msg: '修改学校管理员信息成功！'}))
    .catch(error => {
      console.error('修改异常', error);
      res.send({status: 1, msg: '修改学校管理员信息异常, 请重新尝试！'});
    });
});

// 删除学校管理员信息
router.post('/manage/school_admin/delete', (req, res) => {
  const {school_adminId} = req.body;
  // console.log(req.body);
  SchoolAdminModel.deleteOne({_id: school_adminId})
    .then(res.send({status: 0}))
    .catch(error => {
      console.error('删除异常', error);
      res.send({status: 1, msg: '删除学校管理员信息异常, 请重新尝试！'});
    });
});

// 搜索学校管理员列表
router.get('/manage/school_admin/search', (req, res) => {
  console.log(req.query);
  const {pageNum, pageSize, school_name, realname} = req.query;
  let contition = {};
  if (school_name) { // 按学校搜索
    contition = {school_name: new RegExp(`^.*${school_name}.*$`)};
  } else if (realname) {  // 按姓名搜索
    contition = {realname: new RegExp(`^.*${realname}.*$`)};
  }
  SchoolAdminModel.find(contition)
    .then(school_admin => {
      res.send({status: 0, data: pageFilter(school_admin, pageNum, pageSize)});
    })
    .catch(error => {
      console.error('搜索学校管理员列表异常', error);
      res.send({status: 1, msg: '搜索学校管理员列表异常, 请重新尝试'});
    });
});
// #endregion

/**
 * 系统管理员模块
 */
// #region 
// 添加系统管理员
router.post('/manage/system_admin/add', (req, res) => {
  // 读取请求参数数据
  const { username, password } = req.body;

  // 处理: 判断是否已经存在, 如果存在, 返回提示错误的信息, 如果不存在, 保存
  // 查询(根据username)
  SystemAdminModel.findOne({username})
    .then(system_admin => {
      // 如果system_admin有值(已存在)
      if (system_admin) {
        // 返回提示错误的信息
        res.send({status: 1, msg: '此系统管理员已存在，请重新输入！'});
        return new Promise(() => {
        });
      } else { // 没值(不存在)
        return SystemAdminModel.create({...req.body, password: md5(password)});
      }
    })
    .then(system_admin => {
      // 返回包含system_admin的json数据
      res.send({status: 0, data: system_admin});
    })
    .catch(error => {
      console.error('注册异常', error);
      res.send({status: 1, msg: '添加系统管理员异常, 请重新尝试！'});
    });
});

// 获取系统管理员列表
router.get('/manage/system_admin/list', (req, res) => {
  const {pageNum, pageSize} = req.query;
  // 查询并根据发布时间进行排序
  // ReservationInfoModel.find().sort({'pub_time':-1})
  SystemAdminModel.find()
    .then((system_admin) => {
    // console.log(news);
      res.send({status: 0, data: pageFilter(system_admin, pageNum, pageSize)});
    })
    .catch(error => {
      console.error('获取系统管理员列表异常', error);
      res.send({status: 1, msg: '获取系统管理员列表异常, 请重新尝试'});
    });
});

// 更新系统管理员信息
router.post('/manage/system_admin/update', (req, res) => {
  // 读取请求参数数据
  const { system_adminObj, system_adminId, password } = req.body; 
  // 查询(根据_id)
  SystemAdminModel.updateOne({'_id': system_adminId},{$set:{...system_adminObj, password: md5(password)}})
    .then(res.send({status: 0, msg: '修改系统管理员信息成功！'}))
    .catch(error => {
      console.error('修改异常', error);
      res.send({status: 1, msg: '修改系统管理员信息异常, 请重新尝试！'});
    });
});

// 删除系统管理员信息
router.post('/manage/system_admin/delete', (req, res) => {
  const {system_adminId} = req.body;
  // console.log(req.body);
  SystemAdminModel.deleteOne({_id: system_adminId})
    .then(res.send({status: 0}))
    .catch(error => {
      console.error('删除异常', error);
      res.send({status: 1, msg: '删除系统管理员信息异常, 请重新尝试！'});
    });
});

// 搜索系统管理员列表
router.get('/manage/system_admin/search', (req, res) => {
  console.log(req.query);
  const {pageNum, pageSize, username, realname} = req.query;
  let contition = {};
  if (username) { // 按账号搜索
    contition = {username: new RegExp(`^.*${username}.*$`)};
  } else if (realname) {  // 按预约姓名搜索
    contition = {realname: new RegExp(`^.*${realname}.*$`)};
  }
  SystemAdminModel.find(contition)
    .then(system_admin => {
      res.send({status: 0, data: pageFilter(system_admin, pageNum, pageSize)});
    })
    .catch(error => {
      console.error('搜索系统管理员列表异常', error);
      res.send({status: 1, msg: '搜索系统管理员列表异常, 请重新尝试'});
    });
});
// #endregion

/**
 * 权限管理模块
 */
//#region 
// 获取学校管理员权限列表
router.get('/manage/role/school_admin/list', (req, res) => {
  SchoolAdminModel.find()
    .then(roles => {
      res.send({status: 0, data: roles});
    })
    .catch(error => {
      console.error('获取权限管理列表异常', error);
      res.send({status: 1, msg: '获取权限管理列表异常, 请重新尝试'});
    });
});

// 更新学校管理员权限(设置权限)
router.post('/manage/role/school_admin/update', (req, res) => {
  const role = req.body;
  // role.auth_time = Date.now();
  SchoolAdminModel.findOneAndUpdate({_id: role._id}, role)
    .then(oldRole => {
      // console.log('---', oldRole._doc)
      res.send({status: 0, data: {...oldRole._doc, ...role}});
    })
    .catch(error => {
      console.error('更新学校管理员权限异常', error);
      res.send({status: 1, msg: '更新学校管理员权限异常, 请重新尝试'});
    });
});

// 获取权限管理列表
router.get('/manage/role/system_admin/list', (req, res) => {
  SystemAdminModel.find()
    .then(roles => {
      res.send({status: 0, data: roles});
    })
    .catch(error => {
      console.error('获取权限管理列表异常', error);
      res.send({status: 1, msg: '获取权限管理列表异常, 请重新尝试'});
    });
});

// 更新权限管理(设置权限)
router.post('/manage/role/system_admin/update', (req, res) => {
  const role = req.body;
  // role.auth_time = Date.now();
  SystemAdminModel.findOneAndUpdate({_id: role._id}, role)
    .then(oldRole => {
      // console.log('---', oldRole._doc)
      res.send({status: 0, data: {...oldRole._doc, ...role}});
    })
    .catch(error => {
      console.error('更新系统管理员权限异常', error);
      res.send({status: 1, msg: '更新系统管理员权限异常, 请重新尝试'});
    });
});
//#endregion

/**
 通过学校管理员姓名查询学校信息
 */
router.post('/manage/school_info_by_username', (req, res) => {
  // 读取请求参数数据
  const { realname } = req.body;

  SchoolAdminModel.find({realname: new RegExp(`^.*${realname}.*$`)})
    .then(school => {
      res.send({status: 0, data: school});
    })
    .catch(error => {
      console.error('通过学校管理员姓名查询学校信息异常', error);
      res.send({status: 1, msg: '通过学校管理员姓名查询学校信息异常, 请重新尝试'});
    });
});

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