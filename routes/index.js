var express = require('express');
var router = express.Router();
var userServerController = require('../controllers/user.server.controller.js');
var addHumanController = require('../controllers/add.server.controller.js');
var informationController = require('../controllers/information.server.controller.js');
var searchController = require('../controllers/search.server.controller.js');

/***********************页面url****************************/ 
// 首页
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
// 登陆页面
router.get('/login',function(req, res, next){
	res.render('login',{});
});




/***********************后台处理接口url****************************/ 
// 登陆处理
router.post('/doLogin',function(req, res, next){
	userServerController.doLogin(req, res, next);
});
// 检测登陆状态
router.get('/checkStatus',function(req, res, next){
	userServerController.checkStatus(req, res, next);
});
// 登出
router.get('/loginOut',function(req, res, next){
	userServerController.loginOut(req, res, next);
});
// 获取验证码
router.get('/verifycode',function(req, res, next){
	userServerController.verifycode(req, res, next);
});
// 上传文件
router.post('/batchAdd',function(req, res, next){
	addHumanController.uploadFile(req, res, next);
});
// 修改上传头像
router.post('/editHeadPic',function(req, res, next){
	informationController.editHeadPic(req, res, next);
});
// 获取虚拟人详细信息
router.get('/getInformationDetail',function(req, res, next){
	informationController.getInformationDetail(req, res, next);
});
// 获取虚拟人列表数据
router.get('/gethumanItemData',function(req, res, next){
	informationController.gethumanItemData(req, res, next);
});
// 获取虚拟人画像
router.get('/getPortrait',function(req, res, next){
	informationController.getPortrait(req, res, next);
});
// 获取虚拟人线索
router.get('/getClue',function(req, res, next){
	informationController.getClue(req, res, next);
});
// 确认修改虚拟人信息
router.post('/saveInformation',function(req, res, next){
	informationController.saveInformation(req, res, next);
});
// 通过条件搜索虚拟人
router.post('/searchByCondition',function(req, res, next){
	searchController.searchByCondition(req, res, next);
});
// 添加新虚拟人
router.post('/addNewHuman',function(req, res, next){
	addHumanController.addNewHuman(req, res, next);
})
module.exports = router;
