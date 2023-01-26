var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');

//自定义另一个文件
var session = require('express-session');//加入session支持
var User = require("./models/user");

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//增加片段视图的支持---没有成功
var partials = require('express-partials');
//app.set("view engine","ejs");
app.use(partials());

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'public')));

//加入session[四个参数必须有，具体作用暂不清楚]
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: {secure: false}
}));

//使用中间件来返回成功和失败信息【成功】
app.use(function (req, res, next) {
    //声明变量
    var err = req.session.error,
        msg = req.session.success;

    //删除会话中原有属性
    delete req.session.error;
    delete req.session.success;

    //将信息放在动态视图变量中
    res.locals.message = "";
    if (err) res.locals.message = "<div class='alert-error'> " + err + "</div>";
    if (msg) res.locals.message = "<div class='alert-success'> " + msg + "</div>";
    next();
});

//使用中间件保存用户登录信息
app.use(function (req, res, next) {

    //写法1：这种写法有点多
    /*
    res.locals.user = null;
    if(req.session.user){
        res.locals.user = req.session.user;
    }*/

    //写法2
    res.locals.user = req.session.user;

    //写法3：没有成功
    /*res.locals({
     user:req.session.user
     })*/
    next();
});

app.use('/', routes);

//自定义路由规则
app.use('/user', require('./routes/user'));
app.use('/blog', require('./routes/blog'));
app.use('/chat', require('./routes/chatController'));

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
