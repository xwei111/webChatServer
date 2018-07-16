var express = require('express');
var router = express.Router();
var chatuser =require('../controller/chatuser')


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

router.get('/checkuser',function(req,res,next){
  res.render('chatroom',{title:"let's talk"})
})

// 注册
router.get('/register',chatuser.register)
// 登录
router.get('/login',chatuser.login)
// 表情包
router.get('/getEmoticon',chatuser.getEmoticon)
// 上传图片
router.post('/uploadImg',chatuser.uploadImg)

module.exports = router;
