/**
 * Created by zhzb on 2016/2/14.
 */
var express = require("express");
var router = express.Router();
var crypto = require("crypto"); //可以执行md5加密 [没有测试]

var User = require("../models/user");

/*跳转到注册页面*/
router.get('/toReg', function (req, res, next) {
    res.render('user/reg', {title: '用户注册'});
});

/*跳转到登录页面*/
router.get('/toLogin', function (req, res, next) {
    res.render('user/login', {title: '用户登录'});
});

/*用户注册*/
router.post('/doReg', function (req, res, next) {

    //组装用户对象
    /* 方式1
     var user = new User({
     "name":  req.body["name"],
     "password": req.body["password"]
     });*/

    //方式2
    var user = new User(req.body);

    /*使用mongoose操作数据库*/
    User.find({"name": user.name}).limit(1).exec(function (err, docs) {
        if (err) {
            req.session.error = "查询数据失败:" + err;
            return res.redirect("toReg");
        }
        if (docs && docs.length) {
            req.session.error = "用户已经存在";
            return res.redirect("toReg");
        }

        //执行保存操作
        user.save(function (err) {
            if (err) {
                req.session.error = "保存失败:" + err;
                return res.redirect("toReg");
            }
            req.session.user = user;

            User.UserUp(user.name, function () {
                req.session.success = "用户注册成功";
                return res.redirect("/");
            });

        });

    });

    /*直接操作数据库*/
    /*
     //根据用户名判断用户是否已经存在
     User.find(user.name,function(err,u){
     if(err){
     req.session.error = "查询数据失败:" + err;
     return res.redirect("toReg");
     }
     if(u){
     req.session.error = "用户已经存在";
     return res.redirect("toReg");
     }

     //执行保存操作
     user.save(function (err) {
     if (err) {
     req.session.error = "保存失败:" + err;
     return res.redirect("toReg");
     }
     req.session.user = user;
     req.session.success = "用户注册成功";
     return res.redirect("/");
     });
     });*/
});

/*用户退出*/
router.get('/logout', function (req, res, next) {
    var user = req.session.user;
    User.UserDown(user.name, function () {
        req.session.user = null;
        req.session.success = "退出成功";
        return res.redirect("/");
    });
});

/*用户登录*/
router.post('/doLogin', function (req, res, next) {

    //方式2
    var user = new User(req.body);

    User.find({"name": user.name}).limit(1).exec(function (err, docs) {  //使用mongoose操作数据库
        /*User.find(user.name,function(err,u){ //直接操作数据库  */
        if (err) {
            req.session.error = "连接数据库失败";
            return res.redirect("toLogin");
        }

        if (docs.length < 1) {
            req.session.error = "用户不存在";
            return res.redirect("toLogin");
        }

        if (docs[0].password != user.password) {
            req.session.error = "密码错误";
            return res.redirect("toLogin");
        }

        User.UserUp(docs[0].name, function () {
            req.session.user = docs[0];
            req.session.success = "登录成功";
            return res.redirect("/");
        });
    });

});

/*查看用户*/
router.get('/view/:blogId', function (req, res, next) {
    res.render('user/view', {title: '明细', name: 'black wind', content: '<p>this is my blog ...</p>'});
});

module.exports = router;