/**
 * Created by douqr on 2016/2/15.
 */

/*使用mongoose操作数据库*/
var mongooseDB = require("./mongooseDB");
var Schema = mongooseDB.mongoose.Schema;

//定义schema
var UserSchema = new Schema({
    name: {type: String, required: true},
    password: {type: String, required: true},
    status: {type: String, default: "down"} //状态是否在线
});

//发布model
var User = mongooseDB.mongoose.model("user", UserSchema);

//用户上线
User.UserUp = function (name, callback) {
    //User.where({ name: name }).update({ status: 'up' }); //没有成功
    User.update({ name: name }, { $set: { status: 'up' }}, { multi: true }, function(){});
    callback();
}

//用户下线
User.UserDown = function (name, callback) {
    User.update({ name: name }, { $set: { status: 'down' }}, { multi: true }, function(){});
    callback();
}

//获取所有在线用户
User.getUserUp = function (callback) {
    User.find({"status": "up"}).sort({"name": 1}).exec(function (err, docs) {
        return callback(err, docs);
    });
}

module.exports = User;


/* 直接操作数据库 */
/*

 //引入数据库操作模块
 var mongodb=require("./db");

 //声明user类
 function User(user){
 this.name=user.name;
 this.password=user.password;
 }

 //增加查询用户静态方法
 User.find=function(username,callback){
 mongodb.open(function(err,db){
 if(err){
 return callback(err);
 }

 //"user"为表名
 db.collection("user",function(err,collection){
 if(err){
 mongodb.close();
 return callback(err);
 }
 //查询name为username的对象
 collection.findOne({name:username},function(err,doc){
 mongodb.close();
 if(doc){
 //组装用户对象
 var user = new User(doc);
 callback(err,user);
 }else{
 callback(err,null);
 }
 });
 });
 });
 }

 //将User给予接口
 module.exports=User;

 //使用原型增加保存方法
 User.prototype.save=function save(callback){

 //存入mongodb文档
 var user = {
 name:this.name,
 password:this.password
 }

 mongodb.open(function(err,db){
 if(err){
 return callback(err);
 }
 db.collection("user",function(err,collection){
 if(err){
 mongodb.close();
 return callback(err);
 }

 //属性增加索引[这样name就不可以重复]
 collection.ensureIndex("name",{unique:true});

 //写入user文档
 collection.insert(user,{safe:true},function(err){
 mongodb.close();
 return callback(err);
 })

 })
 });
 }

 */
