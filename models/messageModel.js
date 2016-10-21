/**
 * Created by douqr on 2016/2/18.
 */

var mongooseDB = require("./mongooseDB");
var Schema = mongooseDB.mongoose.Schema;

//定义schema
var MessageSchema = new Schema({
    user: String,
    message: String,
    time: Date
});

//由schema发布生成Model [其中blog为数据库集合名，数据库会自动生成blogs集合]
var Message = mongooseDB.mongoose.model("message",MessageSchema);

module.exports = Message;