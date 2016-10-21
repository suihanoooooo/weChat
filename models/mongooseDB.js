/**
 * Created by douqr on 2016/2/17.
 * 使用mongoose操作数据库
 */
//引入连接配置的模块
var settings = require("../settings");

var mongoose = require("mongoose");
mongoose.connect("mongodb://" + settings.host + "/" + settings.db);

//公开
module.exports.mongoose = mongoose;
