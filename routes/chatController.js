/**
 * Created by douqr on 2016/2/18.
 */

var express = require("express");
var router = express.Router();

router.get("/toChat", function (req, res, next) {
    var user = req.session.user;
    res.render("chat/chat", {title: "竞价聊天室"});
});


module.exports = router;