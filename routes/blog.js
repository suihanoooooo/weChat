var express = require("express");
var router = express.Router();
var Blog = require("../models/blog");

router.get("/addBlog", function (req, res, next) {
    res.render("blog/addBlog", {title: "添加博文"});
});

router.post("/saveBlog", function (req, res, next) {
    var curUser = req.session.user;

    /*使用mongoose操作数据库*/
    var blog = new Blog({"user": req.session.user.name, "blog": req.body.blog, "time": new Date()});
    blog.save(function (err, doc) {
        if (err) {
            req.session.error = "保存失败" + err;
            return res.redirect("addBlog");
        }

        req.session.success = "发表成功";
        return res.redirect("/");
    });

    /*使用mongodb直接操作数据库*/
    /* var blog = new Blog(curUser.name,req.body.blog);
     blog.save(function(err){
     if(err){
     req.session.error = "保存失败" + err;
     return res.redirect("addBlog");
     }
     req.session.success = "发表成功";
     return res.redirect("/");
     });*/
});

module.exports = router;