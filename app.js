var express=require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var axios = require('axios');

var app=express();
var http=require('http').createServer(app);
var io=require('socket.io')(http);

const format = require('./config/date')
const chatcontent = require('./models/chatcontent')

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');

let count = 0;
 
//模板引擎
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(cookieParser());
//静态服务
app.use(express.static(path.join(__dirname, 'public')));

// 设置服务器跨域权限
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With');
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By", " 3.2.1")
    next();
});

app.use('/', indexRouter)
app.use('/user', usersRouter)

io.on('connection',function(socket){
    // 有人登陆聊天室
    socket.on('login',function(msg){
      count++;
      io.emit('login',{user:msg,peopleNum:count})
    });

    // 聊天内容
    socket.on('chating',function(msg){
      
      msg.time = format(new Date(), 'yyyy-MM-dd HH:mm:ss')
      
      chatcontent.create(msg,(err,doc)=>{
          if(err){
              console.log('err',err)
              return ; 
          }
      })

      io.emit('chating',msg);
    });
})

app.get('/searchChatcontent',(req,res,next)=>{
  chatcontent.find({}).select({createdAt:0,updatedAt:0,__v:0}).exec((err,docAll)=>{
    if(err){
      return;
    }else{
      res.json(docAll)
    }
  })
})
 

//监听端口
http.listen(3000);
console.log('server start port 3000');