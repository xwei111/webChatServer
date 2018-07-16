const chatuserInfo = require('../models/chatuser');
const jwt = require('jsonwebtoken');
const reg=/^[A-Za-z0-9]{6,20}$/;

const formidable = require('formidable')
const fs = require('fs');
var sd = require("silly-datetime");
const AVATAR_UPLOAD_FOLDER = '/avatar/'; // 上传路径

var devhttp='http://localhost:3000';
var prohttp='http://140.143.150.59:3000';

// // 压缩图片
const gm = require('gm');
const imageMagick = gm.subClass({ imageMagick: true });

const findAllData = (findObj)=>{
    const p = new Promise((resolve,reject)=>{
        chatuserInfo.find(findObj).sort({_id:-1}).select({createdAt:0,updatedAt:0,__v:0}).exec((err,docAll)=>{
            if(err){
				reject(err)
			}else{
				resolve(docAll)
			}
        })
    })
    return p;
}

function addChatUser(obj,res){
    chatuserInfo.create(obj,(err,doc)=>{
        if(err){
            console.log('err',err)
            return ; 
        }

        res.json({
            code:200,
            msg:'注册成功'
        })
    })
}

exports.register =(req,res,next)=>{
    const {user,pass} = req.query;
    const obj = {user:user}
    findAllData(obj)
        .then((result)=>{
            const data = result[0];
            if(data){
                res.json({
                    code:401,
                    msg:'用户已存在'
                })
            }else if(!reg.test(pass)){
                res.json({
                    code:401,
                    msg:'密码为6-20位数字字母组合'
                })
            }else{
                let num = Math.floor(Math.random()*10+1);
                let img = `${devhttp}ig${num}.jpg`;
                addChatUser({user:user,pass:pass,img:img},res)
            }
        })
        .catch((err)=>{
            console.log('err',err)
        })
}

exports.login = (req,res,next)=>{
    const {user,pass} = req.query;
    const obj = {user:user};
    findAllData(obj)
        .then((result)=>{
            const data = result[0];
            if(!data){
                res.json({
                    code:401,
                    msg:'用户不存在'
                })
            }else if(pass!==data.pass){
                res.json({
                    code:401,
                    msg:'用户密码错误'
                })
            }else{
                let id = data._id;
                let img = data.img;
                let expires = 60 * 60 * 24 * 30;
                let token = jwt.sign({ id, user ,img}, 'secret', { expiresIn: expires })
                res.json({
                    code:200,
                    msg:'登录成功',
                    data:{
                        user:user,
                        token:token,
                        id:id,
                        img:img
                    }
                })
            }
        })
        .catch((err)=>{
            console.log('err',err)
        })
}



// 表情包
exports.getEmoticon = function (req,res,next){
    return res.json({
        code:200,
        emotion:[`${devhttp}/emoticon/Boring.gif`,
                 `${devhttp}/emoticon/cry.gif`,
                 `${devhttp}/emoticon/dont.gif`,
                 `${devhttp}/emoticon/drink.gif`,
                 `${devhttp}/emoticon/drunken.gif`,
                 `${devhttp}/emoticon/eat.gif`,
                 `${devhttp}/emoticon/fly.gif`,
                 `${devhttp}/emoticon/fullmark.gif`,
                 `${devhttp}/emoticon/hi.gif`,
                 `${devhttp}/emoticon/hot.gif`,
                 `${devhttp}/emoticon/playtogter.gif`,
                 `${devhttp}/emoticon/pre.gif`,
                 `${devhttp}/emoticon/run.gif`,
                 `${devhttp}/emoticon/sleep.gif`,
                 `${devhttp}/emoticon/smile.gif`,
                 `${devhttp}/emoticon/swing.gif`,
            ]
    })
}

// 上传图片
exports.uploadImg = function (req, res, next) {
	var form = new formidable.IncomingForm();   //创建上传表单
	form.encoding = 'utf-8';		//设置编辑
	form.uploadDir = 'public' + AVATAR_UPLOAD_FOLDER;	 //设置上传目录
	form.keepExtensions = true;	 //保留后缀
	form.maxFieldsSize = 2 * 1024 * 1024;   //文件大小
    
	form.parse(req, function (err, fields, files) {

		if (err) {
			return res.json({
				"code": 500,
				"message": "内部服务器错误"
			})
        }
        console.log('filesfilesfilesfilesfilesfilesfiles',files)
		// 限制文件大小 单位默认字节 这里限制大小为2m
		if (files.file.size > form.maxFieldsSize) {
			fs.unlink(files.file.path)
			return res.json({
				"code": 401,
				"message": "图片应小于2M"
			})
		}

		var extName = '';  //后缀名
		switch (files.file.type) {
			case 'image/pjpeg':
				extName = 'jpg';
				break;
			case 'image/jpeg':
				extName = 'jpg';
				break;
			case 'image/png':
				extName = 'png';
				break;
			case 'image/x-png':
				extName = 'png';
				break;
		}

		if (extName.length == 0) {
			return res.json({
				"code": 404,
				"message": "只支持png和jpg格式图片"
			})
        }
       

		//使用第三方模块silly-datetime
		var t = sd.format(new Date(), 'YYYYMMDDHHmmss');
		//生成随机数
		var ran = parseInt(Math.random() * 8999 + 10000);

		// 生成新图片名称
		var avatarName = t + '_' + ran + '.' + extName;
		// 新图片路径
		var newPath = form.uploadDir + avatarName;

		// 更改名字和路径
		fs.rename(files.file.path, newPath, function (err) {
			if (err) {
				return res.json({
					"code": 401,
					"message": "图片上传失败"
				})
			}
			
            
            //压缩上传图片
            imageMagick(newPath)
                .resize(100,100,'>')
                .quality(100)
                .autoOrient()
                .write(newPath, function (err, data) {
                    if (err) {
                        throw err;
                    }
                    return res.json({
                        "code": 200,
                        "message": "上传成功",
                        result: devhttp + AVATAR_UPLOAD_FOLDER + avatarName
                    })
                });

             

		})
	});

}


