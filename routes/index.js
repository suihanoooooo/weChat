var express = require('express');
var router = express.Router();
var Blog = require("../models/blog");
var User = require("../models/user");

/* GET home page. */
router.get('/', function (req, res, next) {

    /*使用mongoose操作数据库*/
    /*写法1*/
    /* Blog.find({},null,{sort:[{"time":-1}]},function(err,blogs){
     if(err){
     blogs = [];
     }

     res.render('index', { title: '微博世界',titleEn:'blog world',blogs:blogs });
     });*/

    /*写法2*/
    Blog.find({}).sort({"time": -1}).limit(10).exec(function (err, blogs) {
        //查询在线用户列表
        User.getUserUp(function (err, userUps) {
            res.render('index', {title: '微博世界', titleEn: 'blog world', blogs: blogs, userUps: userUps});
        });
    });

    /*写法3 [没有成功，populate可能要引入util包]*/
    /*Blog.find().populate({
     //path: 'owner',
     //select: 'name',
     //match: { color: 'black' },
     options: { sort: { name: -1 },limit:2}
     }).exec(function(err,blogs){
     res.render('index', { title: '微博世界',titleEn:'blog world',blogs:blogs });
     });*/


    /*直接操作mongodb*/
    /* Blog.find("",function(err,array){
     if(!array){
     array = [];
     }
     res.render('index', { title: '微博世界',titleEn:'blog world',blogs:array });
     })*/

});

//在线用户
var onlineUsers = {};
//当前在线人数
var onlineCount = 0;



module.exports = router;
